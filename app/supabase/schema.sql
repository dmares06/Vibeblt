create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text not null,
  username text not null unique,
  avatar_url text,
  bio text,
  is_admin boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  slug text not null unique,
  status text not null check (status in ('draft', 'pending_review', 'approved_pending_publish', 'approved', 'changes_requested', 'rejected')) default 'draft',
  pending_status text check (pending_status in ('draft', 'pending_review', 'approved_pending_publish', 'changes_requested')),
  live_revision_id uuid,
  pending_revision_id uuid,
  rejection_reason text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

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

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
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
for each row execute procedure public.handle_updated_at();

drop trigger if exists project_revisions_set_updated_at on public.project_revisions;
create trigger project_revisions_set_updated_at
before update on public.project_revisions
for each row execute procedure public.handle_updated_at();

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_revisions enable row level security;

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
