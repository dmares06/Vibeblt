import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import type { SupabaseClient, User } from "@supabase/supabase-js"
import { categories, type Category } from "@/lib/constants"
import { demoProjects } from "@/lib/demo-data"
import { isSupabaseConfigured, getAdminEmails } from "@/lib/supabase/env"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { AuthViewer, BuilderProfile, ProjectRecord, ProjectStatus } from "@/lib/types"
import { slugify } from "@/lib/utils"

type ProjectRow = {
  id: string
  owner_id: string
  slug: string
  status: ProjectStatus
  pending_status: ProjectStatus | null
  live_revision_id: string | null
  pending_revision_id: string | null
  rejection_reason: string | null
  created_at: string
  updated_at: string
  view_count?: number
  heart_count?: number
}

type RevisionRow = {
  id: string
  project_id: string
  name: string
  tagline: string
  description: string
  project_url: string
  category: Category
  tech_stack: string[] | null
  project_tags: string[] | null
  help_tags: string[] | null
  thumbnail_url: string
  screenshot_urls: string[] | null
  review_notes: string | null
  revision_number: number
  created_at: string
  updated_at: string
}

type ProfileRow = {
  id: string
  email: string | null
  full_name: string
  username: string
  avatar_url: string | null
  bio: string | null
  is_admin: boolean | null
  twitter_url: string | null
  github_url: string | null
  follower_count: number | null
  project_count: number | null
}

function toBuilderProfile(profile: ProfileRow): BuilderProfile {
  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.full_name,
    username: profile.username,
    avatarUrl: profile.avatar_url,
    bio: profile.bio,
    isAdmin: Boolean(profile.is_admin),
    twitterUrl: profile.twitter_url,
    githubUrl: profile.github_url,
    followerCount: profile.follower_count ?? 0,
    projectCount: profile.project_count ?? 0,
  }
}

type ProjectViewMode = "public" | "owner" | "admin"

function getRevisionId(project: ProjectRow, mode: ProjectViewMode) {
  if (mode === "public") {
    return project.live_revision_id
  }

  return project.pending_revision_id ?? project.live_revision_id
}

function getDisplayStatus(project: ProjectRow, mode: ProjectViewMode): ProjectStatus {
  if (mode === "public") {
    return "approved"
  }

  return (project.pending_revision_id ? project.pending_status : null) ?? project.status
}

function mapProject(project: ProjectRow, revision: RevisionRow, owner: ProfileRow, mode: ProjectViewMode): ProjectRecord {
  return {
    id: project.id,
    slug: project.slug,
    status: getDisplayStatus(project, mode),
    hasPendingRevision: Boolean(project.pending_revision_id),
    name: revision.name,
    tagline: revision.tagline,
    description: revision.description,
    projectUrl: revision.project_url,
    category: revision.category,
    techStack: revision.tech_stack ?? [],
    projectTags: revision.project_tags ?? [],
    helpTags: revision.help_tags ?? [],
    thumbnailUrl: revision.thumbnail_url,
    screenshotUrls: revision.screenshot_urls ?? [],
    rejectionReason: project.rejection_reason,
    reviewNotes: revision.review_notes,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
    submittedAt: revision.created_at,
    revisionNumber: revision.revision_number,
    owner: toBuilderProfile(owner),
    isLive: Boolean(project.live_revision_id),
    viewCount: project.view_count,
    heartCount: project.heart_count,
  }
}

async function loadProjects(projectRows: ProjectRow[], mode: ProjectViewMode) {
  if (projectRows.length === 0) {
    return []
  }

  const supabase = await createSupabaseServerClient()
  const revisionIds = Array.from(
    new Set(projectRows.map((project) => getRevisionId(project, mode)).filter(Boolean)),
  ) as string[]
  const ownerIds = Array.from(new Set(projectRows.map((project) => project.owner_id)))

  const [{ data: revisions }, { data: profiles }] = await Promise.all([
    supabase.from("project_revisions").select("*").in("id", revisionIds),
    supabase.from("profiles").select("*").in("id", ownerIds),
  ])

  const revisionMap = new Map((revisions ?? []).map((row) => [row.id, row as RevisionRow]))
  const profileMap = new Map((profiles ?? []).map((row) => [row.id, row as ProfileRow]))

  return projectRows
    .map((project) => {
      const revision = revisionMap.get(getRevisionId(project, mode) ?? "")
      const owner = profileMap.get(project.owner_id)

      if (!revision || !owner) {
        return null
      }

      return mapProject(project, revision, owner, mode)
    })
    .filter((project): project is ProjectRecord => Boolean(project))
}

export async function getPublicProjects() {
  noStore()
  if (!isSupabaseConfigured()) {
    return demoProjects.filter((project) => project.status === "approved")
  }

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "approved")
    .not("live_revision_id", "is", null)
    .order("updated_at", { ascending: false })

  if (error || !data) {
    return []
  }

  return loadProjects(data as ProjectRow[], "public")
}

export async function getProjectBySlug(slug: string) {
  noStore()
  const projects = await getPublicProjects()
  return projects.find((project) => project.slug === slug) ?? null
}

export async function getBuilderByUsername(username: string) {
  noStore()
  const projects = await getPublicProjects()
  const matching = projects.filter((project) => project.owner.username === username)
  return matching[0]?.owner ?? null
}

export async function getProjectsByBuilder(username: string) {
  noStore()
  const projects = await getPublicProjects()
  return projects.filter((project) => project.owner.username === username)
}

export async function getFeaturedProjects() {
  noStore()
  const projects = await getPublicProjects()
  return projects.slice(0, 6)
}

export async function getViewer(): Promise<AuthViewer | null> {
  noStore()
  if (!isSupabaseConfigured()) {
    return null
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const profile = await ensureProfile(user)

  return {
    userId: user.id,
    email: user.email ?? null,
    profile,
  }
}

export async function ensureProfile(user: User, supabaseClient?: SupabaseClient): Promise<BuilderProfile> {
  const supabase = supabaseClient ?? (await createSupabaseServerClient())
  const { data: existing } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()

  if (existing) {
    const adminByEmail = user.email ? getAdminEmails().includes(user.email.toLowerCase()) : false

    if (adminByEmail && !existing.is_admin) {
      const { data: updated } = await supabase
        .from("profiles")
        .update({ is_admin: true })
        .eq("id", user.id)
        .select("*")
        .single()

      if (updated) {
        return toBuilderProfile(updated as ProfileRow)
      }
    }

    return toBuilderProfile(existing as ProfileRow)
  }

  const email = user.email ?? null
  const emailHandle = email?.split("@")[0] ?? "builder"
  const baseUsername = slugify(user.user_metadata.full_name ?? user.user_metadata.name ?? emailHandle) || "builder"
  const username = await generateUniqueUsername(baseUsername)
  const isAdmin = email ? getAdminEmails().includes(email.toLowerCase()) : false

  const payload = {
    id: user.id,
    email,
    full_name: user.user_metadata.full_name ?? user.user_metadata.name ?? emailHandle,
    username,
    avatar_url: user.user_metadata.avatar_url ?? null,
    bio: "New on Vibeblt.",
    is_admin: isAdmin,
    twitter_url: null,
    github_url: null,
    follower_count: 0,
    project_count: 0,
  }

  const { data, error } = await supabase.from("profiles").insert(payload).select("*").single()

  if (error || !data) {
    console.error("Unable to create builder profile", {
      error,
      payload,
      userId: user.id,
      email: user.email,
    })
    throw new Error(error?.message ?? "Unable to create builder profile.")
  }

  return toBuilderProfile(data as ProfileRow)
}

export async function generateUniqueUsername(base: string) {
  const supabase = await createSupabaseServerClient()
  let candidate = base || "builder"
  let attempt = 1

  for (;;) {
    const { data } = await supabase.from("profiles").select("id").eq("username", candidate).maybeSingle()
    if (!data) {
      return candidate
    }
    attempt += 1
    candidate = `${base}-${attempt}`
  }
}

export async function generateUniqueProjectSlug(base: string) {
  const supabase = await createSupabaseServerClient()
  let candidate = slugify(base) || "project"
  let attempt = 1

  for (;;) {
    const { data } = await supabase.from("projects").select("id").eq("slug", candidate).maybeSingle()
    if (!data) {
      return candidate
    }
    attempt += 1
    candidate = `${slugify(base)}-${attempt}`
  }
}

export async function getOwnedProjects(ownerId: string) {
  noStore()
  if (!isSupabaseConfigured()) {
    return []
  }

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("owner_id", ownerId)
    .order("updated_at", { ascending: false })

  if (error || !data) {
    return []
  }

  return loadProjects(data as ProjectRow[], "owner")
}

export async function getProjectForOwner(ownerId: string, projectId: string) {
  noStore()
  if (!isSupabaseConfigured()) {
    return null
  }

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("owner_id", ownerId)
    .eq("id", projectId)
    .maybeSingle()

  if (error || !data) {
    return null
  }

  const [project] = await loadProjects([data as ProjectRow], "owner")
  return project ?? null
}

export async function getAdminQueue() {
  noStore()
  if (!isSupabaseConfigured()) {
    return []
  }

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .or("status.eq.pending_review,pending_status.eq.pending_review")
    .not("pending_revision_id", "is", null)
    .order("updated_at", { ascending: false })

  if (error || !data) {
    return []
  }

  return loadProjects(data as ProjectRow[], "admin")
}

export async function isViewerAdmin() {
  noStore()
  const viewer = await getViewer()
  return Boolean(viewer?.profile.isAdmin)
}

export function getSubmissionCategories() {
  return categories
}
