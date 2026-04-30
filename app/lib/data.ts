import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import type { SupabaseClient, User } from "@supabase/supabase-js"
import { categories, type Category } from "@/lib/constants"
import { demoComments, demoProjects } from "@/lib/demo-data"
import { isSupabaseConfigured, getAdminEmails } from "@/lib/supabase/env"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { AuthViewer, BuilderProfile, ProjectComment, ProjectRecord, ProjectStatus } from "@/lib/types"
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

type ProjectCommentRow = {
  id: string
  project_id: string
  user_id: string
  parent_id: string | null
  content: string
  is_hidden: boolean
  created_at: string
  updated_at: string
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

async function getAuthenticatedUserId() {
  if (!isSupabaseConfigured()) {
    return null
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user?.id ?? null
}

async function hydrateProjectInteractionState(projects: ProjectRecord[], viewerId?: string | null) {
  const userId = viewerId ?? (await getAuthenticatedUserId())

  if (!userId || projects.length === 0) {
    return projects
  }

  const supabase = await createSupabaseServerClient()
  const projectIds = projects.map((project) => project.id)
  const creatorIds = Array.from(new Set(projects.map((project) => project.owner.id)))
  const [{ data: likes }, { data: follows }] = await Promise.all([
    supabase.from("project_likes").select("project_id").eq("user_id", userId).in("project_id", projectIds),
    supabase.from("creator_follows").select("creator_id").eq("follower_id", userId).in("creator_id", creatorIds),
  ])

  const likedProjectIds = new Set((likes ?? []).map((like) => like.project_id as string))
  const followedCreatorIds = new Set((follows ?? []).map((follow) => follow.creator_id as string))

  return projects.map((project) => ({
    ...project,
    isLikedByViewer: likedProjectIds.has(project.id),
    owner: {
      ...project.owner,
      isFollowedByViewer: followedCreatorIds.has(project.owner.id),
    },
  }))
}

async function hydrateBuilderFollowState(builders: BuilderProfile[], viewerId?: string | null) {
  const userId = viewerId ?? (await getAuthenticatedUserId())

  if (!userId || builders.length === 0) {
    return builders
  }

  const supabase = await createSupabaseServerClient()
  const builderIds = builders.map((builder) => builder.id)
  const { data } = await supabase
    .from("creator_follows")
    .select("creator_id")
    .eq("follower_id", userId)
    .in("creator_id", builderIds)
  const followedBuilderIds = new Set((data ?? []).map((follow) => follow.creator_id as string))

  return builders.map((builder) => ({
    ...builder,
    isFollowedByViewer: followedBuilderIds.has(builder.id),
  }))
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

  const projects = await loadProjects(data as ProjectRow[], "public")
  return hydrateProjectInteractionState(projects)
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
  const featuredProjectLimit = 16
  const projects = await getPublicProjects()
  const prioritizedProjects = [...projects].sort((projectA, projectB) => {
    const projectAIsDylan = projectA.owner.username === "dylan-mares"
    const projectBIsDylan = projectB.owner.username === "dylan-mares"

    if (projectAIsDylan === projectBIsDylan) {
      return 0
    }

    return projectAIsDylan ? -1 : 1
  })

  if (prioritizedProjects.length >= featuredProjectLimit) {
    return prioritizedProjects.slice(0, featuredProjectLimit)
  }

  const usedProjectIds = new Set(prioritizedProjects.map((project) => project.id))
  const fillerProjects = demoProjects
    .filter((project) => !usedProjectIds.has(project.id))
    .slice(0, featuredProjectLimit - prioritizedProjects.length)

  return [...prioritizedProjects, ...fillerProjects]
}

export async function getLikedProjectsForViewer(userId: string) {
  noStore()

  if (!isSupabaseConfigured()) {
    return []
  }

  const supabase = await createSupabaseServerClient()
  const { data: likes, error: likesError } = await supabase
    .from("project_likes")
    .select("project_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (likesError || !likes || likes.length === 0) {
    return []
  }

  const projectIds = likes.map((like) => like.project_id as string)
  const { data: projectRows, error: projectsError } = await supabase
    .from("projects")
    .select("*")
    .in("id", projectIds)
    .eq("status", "approved")
    .not("live_revision_id", "is", null)

  if (projectsError || !projectRows) {
    return []
  }

  const projectOrder = new Map(projectIds.map((id, index) => [id, index]))
  const projects = await loadProjects(dataSortedBy(projectRows as ProjectRow[], projectOrder), "public")
  const hydrated = await hydrateProjectInteractionState(projects, userId)

  return hydrated.map((project) => ({ ...project, isLikedByViewer: true }))
}

export async function getFollowedCreatorsForViewer(userId: string) {
  noStore()

  if (!isSupabaseConfigured()) {
    return []
  }

  const supabase = await createSupabaseServerClient()
  const { data: follows, error: followsError } = await supabase
    .from("creator_follows")
    .select("creator_id")
    .eq("follower_id", userId)
    .order("created_at", { ascending: false })

  if (followsError || !follows || follows.length === 0) {
    return []
  }

  const creatorIds = follows.map((follow) => follow.creator_id as string)
  const { data: profiles, error: profilesError } = await supabase.from("profiles").select("*").in("id", creatorIds)

  if (profilesError || !profiles) {
    return []
  }

  const creatorOrder = new Map(creatorIds.map((id, index) => [id, index]))
  const builders = dataSortedBy(profiles as ProfileRow[], creatorOrder).map((profile) => ({
    ...toBuilderProfile(profile),
    isFollowedByViewer: true,
  }))

  return hydrateBuilderFollowState(builders, userId)
}

function dataSortedBy<T extends { id: string }>(rows: T[], order: Map<string, number>) {
  return [...rows].sort((a, b) => (order.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (order.get(b.id) ?? Number.MAX_SAFE_INTEGER))
}

function buildCommentTree(comments: ProjectComment[]) {
  const commentMap = new Map(comments.map((comment) => [comment.id, { ...comment, replies: [] as ProjectComment[] }]))
  const roots: ProjectComment[] = []

  commentMap.forEach((comment) => {
    if (comment.parentId) {
      const parent = commentMap.get(comment.parentId)

      if (parent) {
        parent.replies.push(comment)
      }

      return
    }

    roots.push(comment)
  })

  return roots
}

export async function getProjectComments(projectId: string) {
  noStore()

  if (!isSupabaseConfigured()) {
    return buildCommentTree(demoComments.filter((comment) => comment.projectId === projectId && !comment.isHidden))
  }

  const supabase = await createSupabaseServerClient()
  const { data: commentRows, error } = await supabase
    .from("project_comments")
    .select("*")
    .eq("project_id", projectId)
    .eq("is_hidden", false)
    .order("created_at", { ascending: true })

  if (error || !commentRows || commentRows.length === 0) {
    return []
  }

  const userIds = Array.from(new Set(commentRows.map((comment) => comment.user_id)))
  const { data: profiles } = await supabase.from("profiles").select("*").in("id", userIds)
  const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile as ProfileRow]))

  const comments: ProjectComment[] = []
  const typedCommentRows = commentRows as ProjectCommentRow[]

  typedCommentRows.forEach((comment) => {
    const profile = profileMap.get(comment.user_id)

    if (!profile) {
      return
    }

    comments.push({
      id: comment.id,
      projectId: comment.project_id,
      userId: comment.user_id,
      user: toBuilderProfile(profile),
      parentId: comment.parent_id,
      content: comment.content,
      isHidden: comment.is_hidden,
      createdAt: comment.created_at,
      likeCount: 0,
      replies: [],
    })
  })

  return buildCommentTree(comments)
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
