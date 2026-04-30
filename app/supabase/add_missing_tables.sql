-- Run this in the Supabase SQL editor if you only have profiles, projects, project_revisions.
-- Idempotent: safe to re-run.

create extension if not exists "pgcrypto";

-- ─── Tables (social / engagement) ───────────────────────────────────────────

create table if not exists public.project_comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  parent_id uuid references public.project_comments(id) on delete cascade,
  content text not null check (char_length(trim(content)) > 0 and char_length(content) <= 2000),
  is_hidden boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.project_likes (
  user_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, project_id)
);

create table if not exists public.creator_follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  creator_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (follower_id, creator_id),
  constraint creator_follows_no_self_follow check (follower_id <> creator_id)
);

-- ─── FKs from projects → revisions (no-op if already applied) ─────────────

alter table public.projects
  drop constraint if exists projects_live_revision_id_fkey;

alter table public.projects
  add constraint projects_live_revision_id_fkey
  foreign key (live_revision_id) references public.project_revisions(id)
  on delete set null;

alter table public.projects
  drop constraint if exists projects_pending_revision_id_fkey;

alter table public.projects
  add constraint projects_pending_revision_id_fkey
  foreign key (pending_revision_id) references public.project_revisions(id)
  on delete set null;

-- ─── Indexes ────────────────────────────────────────────────────────────────

create index if not exists project_comments_project_id_created_at_idx on public.project_comments(project_id, created_at);
create index if not exists project_comments_parent_id_idx on public.project_comments(parent_id);
create index if not exists project_comments_user_id_idx on public.project_comments(user_id);
create index if not exists project_likes_project_id_idx on public.project_likes(project_id);
create index if not exists creator_follows_creator_id_idx on public.creator_follows(creator_id);

-- ─── updated_at on comments ─────────────────────────────────────────────────

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists project_comments_set_updated_at on public.project_comments;
create trigger project_comments_set_updated_at
before update on public.project_comments
for each row execute procedure public.handle_updated_at();

-- ─── RLS ────────────────────────────────────────────────────────────────────

alter table public.project_comments enable row level security;
alter table public.project_likes enable row level security;
alter table public.creator_follows enable row level security;

drop policy if exists "Visible comments on approved projects are readable" on public.project_comments;
create policy "Visible comments on approved projects are readable"
on public.project_comments
for select
using (
  is_hidden = false
  and exists (
    select 1
    from public.projects
    where public.projects.id = project_comments.project_id
      and public.projects.status = 'approved'
      and public.projects.live_revision_id is not null
  )
);

drop policy if exists "Authenticated users can comment on approved projects" on public.project_comments;
create policy "Authenticated users can comment on approved projects"
on public.project_comments
for insert
to authenticated
with check (
  auth.uid() = user_id
  and is_hidden = false
  and exists (
    select 1
    from public.projects
    where public.projects.id = project_comments.project_id
      and public.projects.status = 'approved'
      and public.projects.live_revision_id is not null
  )
);

drop policy if exists "Admins can update project comments" on public.project_comments;
create policy "Admins can update project comments"
on public.project_comments
for update
using (
  exists (
    select 1
    from public.profiles
    where public.profiles.id = auth.uid()
      and public.profiles.is_admin = true
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where public.profiles.id = auth.uid()
      and public.profiles.is_admin = true
  )
);

drop policy if exists "Admins can delete project comments" on public.project_comments;
create policy "Admins can delete project comments"
on public.project_comments
for delete
using (
  exists (
    select 1
    from public.profiles
    where public.profiles.id = auth.uid()
      and public.profiles.is_admin = true
  )
);

drop policy if exists "Users can read their own project likes" on public.project_likes;
create policy "Users can read their own project likes"
on public.project_likes
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own project likes" on public.project_likes;
create policy "Users can insert their own project likes"
on public.project_likes
for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.projects
    where public.projects.id = project_likes.project_id
      and public.projects.status = 'approved'
      and public.projects.live_revision_id is not null
  )
);

drop policy if exists "Users can delete their own project likes" on public.project_likes;
create policy "Users can delete their own project likes"
on public.project_likes
for delete
using (auth.uid() = user_id);

drop policy if exists "Users can read their own creator follows" on public.creator_follows;
create policy "Users can read their own creator follows"
on public.creator_follows
for select
using (auth.uid() = follower_id);

drop policy if exists "Users can insert their own creator follows" on public.creator_follows;
create policy "Users can insert their own creator follows"
on public.creator_follows
for insert
to authenticated
with check (
  auth.uid() = follower_id
  and follower_id <> creator_id
);

drop policy if exists "Users can delete their own creator follows" on public.creator_follows;
create policy "Users can delete their own creator follows"
on public.creator_follows
for delete
using (auth.uid() = follower_id);

-- ─── RPCs used by the app (toggle heart / follow) ───────────────────────────

create or replace function public.toggle_project_like(target_project_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  viewer_id uuid := auth.uid();
  changed_count integer := 0;
begin
  if viewer_id is null then
    raise exception 'Sign in before liking projects.';
  end if;

  if not exists (
    select 1
    from public.projects
    where id = target_project_id
      and status = 'approved'
      and live_revision_id is not null
  ) then
    raise exception 'Only live approved projects can be liked.';
  end if;

  delete from public.project_likes
  where user_id = viewer_id
    and project_id = target_project_id;

  get diagnostics changed_count = row_count;

  if changed_count > 0 then
    update public.projects
    set heart_count = greatest(heart_count - 1, 0)
    where id = target_project_id;

    return false;
  end if;

  insert into public.project_likes (user_id, project_id)
  values (viewer_id, target_project_id)
  on conflict do nothing;

  get diagnostics changed_count = row_count;

  if changed_count > 0 then
    update public.projects
    set heart_count = heart_count + 1
    where id = target_project_id;
  end if;

  return true;
end;
$$;

create or replace function public.toggle_creator_follow(target_creator_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  viewer_id uuid := auth.uid();
  changed_count integer := 0;
begin
  if viewer_id is null then
    raise exception 'Sign in before following creators.';
  end if;

  if viewer_id = target_creator_id then
    raise exception 'You cannot follow yourself.';
  end if;

  if not exists (
    select 1
    from public.profiles
    where id = target_creator_id
  ) then
    raise exception 'Creator not found.';
  end if;

  delete from public.creator_follows
  where follower_id = viewer_id
    and creator_id = target_creator_id;

  get diagnostics changed_count = row_count;

  if changed_count > 0 then
    update public.profiles
    set follower_count = greatest(follower_count - 1, 0)
    where id = target_creator_id;

    return false;
  end if;

  insert into public.creator_follows (follower_id, creator_id)
  values (viewer_id, target_creator_id)
  on conflict do nothing;

  get diagnostics changed_count = row_count;

  if changed_count > 0 then
    update public.profiles
    set follower_count = follower_count + 1
    where id = target_creator_id;
  end if;

  return true;
end;
$$;

grant execute on function public.toggle_project_like(uuid) to authenticated;
grant execute on function public.toggle_creator_follow(uuid) to authenticated;
