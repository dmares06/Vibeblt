create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text not null,
  username text not null unique,
  avatar_url text,
  bio text,
  is_admin boolean not null default false,
  twitter_url text,
  github_url text,
  follower_count integer not null default 0,
  project_count integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles
  add column if not exists twitter_url text;

alter table public.profiles
  add column if not exists github_url text;

alter table public.profiles
  add column if not exists website_url text;

alter table public.profiles
  add column if not exists contact_enabled boolean not null default false;

alter table public.profiles
  add column if not exists contact_email text;

alter table public.profiles
  add column if not exists contact_note text;

alter table public.profiles
  add column if not exists focus_areas text[] not null default '{}';

alter table public.profiles
  add column if not exists open_to text[] not null default '{}';

alter table public.profiles
  add column if not exists follower_count integer not null default 0;

alter table public.profiles
  add column if not exists project_count integer not null default 0;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  slug text not null unique,
  status text not null check (status in ('draft', 'pending_review', 'approved_pending_publish', 'approved', 'changes_requested', 'rejected')) default 'draft',
  pending_status text check (pending_status in ('draft', 'pending_review', 'approved_pending_publish', 'changes_requested')),
  live_revision_id uuid,
  pending_revision_id uuid,
  rejection_reason text,
  view_count integer not null default 0,
  heart_count integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.projects
  add column if not exists view_count integer not null default 0;

alter table public.projects
  add column if not exists heart_count integer not null default 0;

alter table public.projects
  add column if not exists pending_status text;

alter table public.projects
  drop constraint if exists projects_pending_status_check;

alter table public.projects
  add constraint projects_pending_status_check
  check (pending_status in ('draft', 'pending_review', 'approved_pending_publish', 'changes_requested') or pending_status is null);

alter table public.projects
  drop constraint if exists projects_status_check;

alter table public.projects
  add constraint projects_status_check
  check (status in ('draft', 'pending_review', 'approved_pending_publish', 'approved', 'changes_requested', 'rejected'));

alter table public.profiles
  add column if not exists featured_project_id uuid references public.projects(id) on delete set null;

create table if not exists public.project_revisions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  tagline text not null,
  description text not null,
  project_url text not null,
  category text not null,
  tech_stack text[] not null default '{}',
  project_tags text[] not null default '{}',
  help_tags text[] not null default '{}',
  thumbnail_url text not null,
  screenshot_urls text[] not null default '{}',
  review_notes text,
  revision_number integer not null default 1,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.project_revisions
  add column if not exists project_tags text[] not null default '{}';

alter table public.project_revisions
  add column if not exists help_tags text[] not null default '{}';

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

create index if not exists projects_owner_id_idx on public.projects(owner_id);
create index if not exists projects_status_idx on public.projects(status);
create index if not exists project_revisions_project_id_idx on public.project_revisions(project_id);
create index if not exists project_comments_project_id_created_at_idx on public.project_comments(project_id, created_at);
create index if not exists project_comments_parent_id_idx on public.project_comments(parent_id);
create index if not exists project_comments_user_id_idx on public.project_comments(user_id);
create index if not exists project_likes_project_id_idx on public.project_likes(project_id);
create index if not exists creator_follows_creator_id_idx on public.creator_follows(creator_id);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.handle_projects_updated_at()
returns trigger
language plpgsql
as $$
begin
  if (to_jsonb(new) - 'updated_at' - 'view_count' - 'heart_count') is distinct from
     (to_jsonb(old) - 'updated_at' - 'view_count' - 'heart_count') then
    new.updated_at = timezone('utc', now());
  else
    new.updated_at = old.updated_at;
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.handle_updated_at();

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute procedure public.handle_projects_updated_at();

drop trigger if exists project_revisions_set_updated_at on public.project_revisions;
create trigger project_revisions_set_updated_at
before update on public.project_revisions
for each row execute procedure public.handle_updated_at();

drop trigger if exists project_comments_set_updated_at on public.project_comments;
create trigger project_comments_set_updated_at
before update on public.project_comments
for each row execute procedure public.handle_updated_at();

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_revisions enable row level security;
alter table public.project_comments enable row level security;
alter table public.project_likes enable row level security;
alter table public.creator_follows enable row level security;

drop policy if exists "Public profiles are readable" on public.profiles;
create policy "Public profiles are readable"
on public.profiles
for select
using (true);

drop policy if exists "Users can manage their own profile" on public.profiles;
create policy "Users can manage their own profile"
on public.profiles
for all
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Approved projects are readable" on public.projects;
create policy "Approved projects are readable"
on public.projects
for select
using (status = 'approved' or owner_id = auth.uid());

drop policy if exists "Owners can manage their projects" on public.projects;
create policy "Owners can manage their projects"
on public.projects
for all
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "Admins can read all projects" on public.projects;
create policy "Admins can read all projects"
on public.projects
for select
using (
  exists (
    select 1
    from public.profiles
    where public.profiles.id = auth.uid()
      and public.profiles.is_admin = true
  )
);

drop policy if exists "Admins can update all projects" on public.projects;
create policy "Admins can update all projects"
on public.projects
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

drop policy if exists "Project revisions are readable to owners and admins" on public.project_revisions;
create policy "Project revisions are readable to owners and admins"
on public.project_revisions
for select
using (
  exists (
    select 1
    from public.projects
    where public.projects.id = project_revisions.project_id
      and (
        public.projects.owner_id = auth.uid()
        or (public.projects.status = 'approved' and public.projects.live_revision_id = project_revisions.id)
      )
  )
);

drop policy if exists "Owners can manage revisions on their projects" on public.project_revisions;
create policy "Owners can manage revisions on their projects"
on public.project_revisions
for all
using (
  exists (
    select 1
    from public.projects
    where public.projects.id = project_revisions.project_id
      and public.projects.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.projects
    where public.projects.id = project_revisions.project_id
      and public.projects.owner_id = auth.uid()
  )
);

drop policy if exists "Admins can read all project revisions" on public.project_revisions;
create policy "Admins can read all project revisions"
on public.project_revisions
for select
using (
  exists (
    select 1
    from public.profiles
    where public.profiles.id = auth.uid()
      and public.profiles.is_admin = true
  )
);

drop policy if exists "Admins can update project revisions" on public.project_revisions;
create policy "Admins can update project revisions"
on public.project_revisions
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

insert into storage.buckets (id, name, public)
values ('project-assets', 'project-assets', true)
on conflict (id) do nothing;

drop policy if exists "Authenticated users can upload project assets" on storage.objects;
create policy "Authenticated users can upload project assets"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'project-assets');

drop policy if exists "Project assets are publicly readable" on storage.objects;
create policy "Project assets are publicly readable"
on storage.objects
for select
using (bucket_id = 'project-assets');
