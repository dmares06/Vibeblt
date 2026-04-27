"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getAdminEmails, isSupabaseConfigured } from "@/lib/supabase/env"
import { generateUniqueProjectSlug, getProjectForOwner, getViewer } from "@/lib/data"
import {
  categories,
  maxHelpTagCount,
  maxMediaUploadBytes,
  maxProjectTagCount,
  maxScreenshotCount,
  presetHelpTags,
  presetProjectTags,
} from "@/lib/constants"
import { slugify, splitTechStack } from "@/lib/utils"
import type { Category } from "@/lib/constants"
import type { ProjectRecord, ProjectStatus } from "@/lib/types"
import type { SubmissionStep } from "@/lib/submission"

type ProjectRow = {
  id: string
  owner_id: string
  slug: string
  status: ProjectStatus
  pending_status: ProjectStatus | null
  live_revision_id: string | null
  pending_revision_id: string | null
}

type RevisionPayload = {
  name: string
  tagline: string
  description: string
  project_url: string
  category: Category
  tech_stack: string[]
  project_tags: string[]
  help_tags: string[]
  thumbnail_url: string
  screenshot_urls: string[]
  review_notes: string | null
}

function configuredGuard() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Add your environment variables first.")
  }
}

async function getOrigin() {
  const headerList = await headers()
  return headerList.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
}

async function signInWithProvider(provider: "google" | "github") {
  configuredGuard()

  const supabase = await createSupabaseServerClient()
  const origin = await getOrigin()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback?next=/submit`,
      ...(provider === "github" ? { scopes: "read:user user:email" } : {}),
    },
  })

  if (error || !data.url) {
    redirect(`/auth/login?error=${encodeURIComponent("Unable to start sign in.")}`)
  }

  redirect(data.url)
}

export async function signInWithGoogleAction() {
  await signInWithProvider("google")
}

export async function signInWithGithubAction() {
  await signInWithProvider("github")
}

export async function signOutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient()
    await supabase.auth.signOut()
  }

  redirect("/")
}

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim()
}

function getIntent(formData: FormData) {
  return getString(formData, "intent") || "continue"
}

function getStep(value: string) {
  return value as SubmissionStep
}

function getSubmitPath(projectId: string, step: SubmissionStep) {
  return `/submit?projectId=${projectId}&step=${step}`
}

function assertCategory(value: string): Category {
  if (!categories.includes(value as Category)) {
    throw new Error("Choose a valid category.")
  }
  return value as Category
}

function normalizeHelpTag(value: string) {
  const collapsed = value.trim().replace(/\s+/g, " ")

  if (!collapsed) {
    return ""
  }

  const presetMatch = presetHelpTags.find((tag) => tag.toLowerCase() === collapsed.toLowerCase())

  if (presetMatch) {
    return presetMatch
  }

  return collapsed.replace(/\b\w/g, (char) => char.toUpperCase())
}

function getHelpTags(formData: FormData) {
  const selectedTags = formData
    .getAll("helpTags")
    .filter((value): value is string => typeof value === "string")
    .map(normalizeHelpTag)
    .filter(Boolean)

  const customTag = normalizeHelpTag(getString(formData, "customHelpTag"))
  const normalized = [...selectedTags, customTag].filter(Boolean)
  const deduped = Array.from(new Map(normalized.map((tag) => [tag.toLowerCase(), tag])).values())

  if (deduped.length > maxHelpTagCount) {
    throw new Error(`Choose up to ${maxHelpTagCount} help tags.`)
  }

  return deduped
}

function normalizeProjectTag(value: string) {
  const collapsed = value.trim().replace(/\s+/g, " ")

  if (!collapsed) {
    return ""
  }

  const presetMatch = presetProjectTags.find((tag) => tag.toLowerCase() === collapsed.toLowerCase())

  if (presetMatch) {
    return presetMatch
  }

  return collapsed
    .split(" ")
    .map((word) => (word.length <= 3 ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()))
    .join(" ")
}

function getProjectTags(formData: FormData) {
  const selectedTags = formData
    .getAll("projectTags")
    .filter((value): value is string => typeof value === "string")
    .map(normalizeProjectTag)
    .filter(Boolean)

  const customTags = getString(formData, "customProjectTags")
    .split(",")
    .map(normalizeProjectTag)
    .filter(Boolean)

  const deduped = Array.from(new Map([...selectedTags, ...customTags].map((tag) => [tag.toLowerCase(), tag])).values())

  if (deduped.length > maxProjectTagCount) {
    throw new Error(`Choose up to ${maxProjectTagCount} project tags.`)
  }

  return deduped
}

function getScreenshotOrder(formData: FormData, currentScreenshotUrls: string[]) {
  const currentScreenshotSet = new Set(currentScreenshotUrls)
  const screenshotOrder = formData
    .getAll("screenshotOrder")
    .filter((value): value is string => typeof value === "string" && value.length > 0)
  const newScreenshotIds = formData
    .getAll("newScreenshotId")
    .filter((value): value is string => typeof value === "string" && value.length > 0)

  if (screenshotOrder.length === 0) {
    return {
      orderedExistingUrls: currentScreenshotUrls,
      orderedNewIds: [] as string[],
    }
  }

  const orderedExistingUrls: string[] = []
  const orderedNewIds: string[] = []
  const seenExisting = new Set<string>()
  const seenNew = new Set<string>()

  screenshotOrder.forEach((entry) => {
    if (entry.startsWith("existing:")) {
      const url = entry.slice("existing:".length)

      if (!currentScreenshotSet.has(url) || seenExisting.has(url)) {
        throw new Error("Invalid screenshot order submitted.")
      }

      seenExisting.add(url)
      orderedExistingUrls.push(url)
      return
    }

    if (entry.startsWith("new:")) {
      const id = entry.slice("new:".length)

      if (!newScreenshotIds.includes(id) || seenNew.has(id)) {
        throw new Error("Invalid screenshot order submitted.")
      }

      seenNew.add(id)
      orderedNewIds.push(id)
      return
    }

    throw new Error("Invalid screenshot order submitted.")
  })

  return {
    orderedExistingUrls,
    orderedNewIds,
  }
}

function validateMediaUploadSize(files: File[]) {
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0)

  if (totalBytes > maxMediaUploadBytes) {
    throw new Error(`Upload up to 50 MB of images at a time.`)
  }
}

function validateUrl(value: string, message: string) {
  let parsed: URL

  try {
    parsed = new URL(value)
  } catch {
    throw new Error(message)
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error(message)
  }
}

function normalizeUsername(value: string) {
  const normalized = slugify(value.replace(/^@+/, ""))

  if (!normalized) {
    throw new Error("Choose a username.")
  }

  return normalized
}

async function uploadAsset(file: File, userId: string, projectId: string) {
  const supabase = await createSupabaseServerClient()
  const fileName = slugify(file.name.replace(/\.[^.]+$/, "")) || "asset"
  const extension = file.name.includes(".") ? file.name.split(".").pop() : "bin"
  const path = `${userId}/${projectId}/${crypto.randomUUID()}-${fileName}.${extension}`
  const { error } = await supabase.storage.from("project-assets").upload(path, file, {
    cacheControl: "3600",
    contentType: file.type || undefined,
    upsert: false,
  })

  if (error) {
    throw new Error("Unable to upload project assets.")
  }

  const { data } = supabase.storage.from("project-assets").getPublicUrl(path)
  return data.publicUrl
}

async function assertUsernameAvailable(username: string, userId: string) {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.from("profiles").select("id").eq("username", username).maybeSingle()

  if (data && data.id !== userId) {
    throw new Error("That username is already taken.")
  }

  return username
}

async function updateBuilderProfile(formData: FormData, viewer: NonNullable<Awaited<ReturnType<typeof getViewer>>>) {
  const fullName = getString(formData, "fullName")
  const username = await assertUsernameAvailable(normalizeUsername(getString(formData, "username")), viewer.userId)
  const bio = getString(formData, "bio")
  const avatarUrl = getString(formData, "avatarUrl")
  const twitterUrl = getString(formData, "twitterUrl")
  const githubUrl = getString(formData, "githubUrl")

  if (!fullName) {
    throw new Error("Add your name before continuing.")
  }

  if (avatarUrl) {
    validateUrl(avatarUrl, "Enter a valid avatar URL.")
  }
  
  if (twitterUrl) {
    validateUrl(twitterUrl, "Enter a valid Twitter/X URL.")
  }

  if (githubUrl) {
    validateUrl(githubUrl, "Enter a valid GitHub URL.")
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      username,
      bio: bio || null,
      avatar_url: avatarUrl || null,
      twitter_url: twitterUrl || null,
      github_url: githubUrl || null,
    })
    .eq("id", viewer.userId)

  if (error) {
    throw new Error("Unable to update your builder profile.")
  }

  revalidatePath(`/builder/${viewer.profile.username}`)
  revalidatePath(`/builder/${username}`)

  return username
}

export async function updateAccountSettingsAction(formData: FormData) {
  configuredGuard()
  const viewer = await getViewer()

  if (!viewer) {
    redirect("/auth/login?next=/dashboard/settings")
  }

  await updateBuilderProfile(formData, viewer)
  redirect("/dashboard/settings?saved=1")
}

async function getOwnedProjectRow(ownerId: string, projectId: string) {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("owner_id", ownerId)
    .eq("id", projectId)
    .maybeSingle()

  if (error || !data) {
    throw new Error("Project not found.")
  }

  return data as ProjectRow
}

async function createDraftProject(viewer: NonNullable<Awaited<ReturnType<typeof getViewer>>>) {
  const supabase = await createSupabaseServerClient()
  const slug = await generateUniqueProjectSlug(`draft-${viewer.profile.username}-${Date.now()}`)
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      owner_id: viewer.userId,
      slug,
      status: "draft",
      pending_status: null,
    })
    .select("*")
    .single()

  if (projectError || !project) {
    throw new Error("Unable to create the project draft.")
  }

  const { data: revision, error: revisionError } = await supabase
    .from("project_revisions")
    .insert({
      project_id: project.id,
      name: "",
      tagline: "",
      description: "",
      project_url: "",
      category: categories[0],
      tech_stack: [],
      project_tags: [],
      help_tags: [],
      thumbnail_url: "",
      screenshot_urls: [],
      review_notes: null,
      revision_number: 1,
    })
    .select("*")
    .single()

  if (revisionError || !revision) {
    throw new Error("Unable to create the draft revision.")
  }

  await supabase.from("projects").update({ pending_revision_id: revision.id }).eq("id", project.id)

  return project.id as string
}

async function getCurrentProject(viewerId: string, projectId: string) {
  const [projectRow, currentProject] = await Promise.all([
    getOwnedProjectRow(viewerId, projectId),
    getProjectForOwner(viewerId, projectId),
  ])

  if (!currentProject) {
    throw new Error("Project not found.")
  }

  return { projectRow, currentProject }
}

async function getNextRevisionNumber(projectId: string, fallback: number) {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from("project_revisions")
    .select("revision_number")
    .eq("project_id", projectId)
    .order("revision_number", { ascending: false })
    .limit(1)

  return (data?.[0]?.revision_number ?? fallback) + 1
}

async function ensureEditableRevision(
  viewerId: string,
  projectRow: ProjectRow,
  currentProject: ProjectRecord,
) {
  if (projectRow.pending_revision_id) {
    return {
      projectRow,
      project: currentProject,
      revisionId: projectRow.pending_revision_id,
    }
  }

  if (!projectRow.live_revision_id) {
    throw new Error("This project does not have an editable revision.")
  }

  const supabase = await createSupabaseServerClient()
  const nextRevisionNumber = await getNextRevisionNumber(projectRow.id, currentProject.revisionNumber)
  const { data: revision, error } = await supabase
    .from("project_revisions")
    .insert({
      project_id: projectRow.id,
      name: currentProject.name,
      tagline: currentProject.tagline,
      description: currentProject.description,
      project_url: currentProject.projectUrl,
      category: currentProject.category,
      tech_stack: currentProject.techStack,
      project_tags: currentProject.projectTags,
      help_tags: currentProject.helpTags,
      thumbnail_url: currentProject.thumbnailUrl,
      screenshot_urls: currentProject.screenshotUrls,
      review_notes: null,
      revision_number: nextRevisionNumber,
    })
    .select("*")
    .single()

  if (error || !revision) {
    throw new Error("Unable to start a draft update.")
  }

  await supabase
    .from("projects")
    .update({
      pending_revision_id: revision.id,
      pending_status: "draft",
    })
    .eq("id", projectRow.id)

  return {
    projectRow: {
      ...projectRow,
      pending_revision_id: revision.id,
      pending_status: "draft" as const,
    },
    project: currentProject,
    revisionId: revision.id as string,
  }
}

function getSavedProjectState(projectRow: ProjectRow) {
  if (projectRow.live_revision_id) {
    return {
      status: "approved" as const,
      pending_status:
        projectRow.pending_status === "pending_review" || projectRow.pending_status === "changes_requested"
          ? projectRow.pending_status
          : "draft",
    }
  }

  return {
    status:
      projectRow.status === "pending_review" || projectRow.status === "changes_requested" ? projectRow.status : "draft",
    pending_status: null,
  }
}

function getSubmittedProjectState(projectRow: ProjectRow) {
  if (projectRow.live_revision_id) {
    return {
      status: "approved" as const,
      pending_status: "pending_review" as const,
    }
  }

  return {
    status: "pending_review" as const,
    pending_status: null,
  }
}

async function updateRevision(revisionId: string, patch: Partial<RevisionPayload>) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from("project_revisions").update(patch).eq("id", revisionId)

  if (error) {
    throw new Error("Unable to save this step.")
  }
}

async function revalidateProjectPaths(username: string, slug?: string) {
  revalidatePath("/")
  revalidatePath("/browse")
  revalidatePath("/dashboard")
  revalidatePath("/admin")
  revalidatePath(`/builder/${username}`)

  if (slug) {
    revalidatePath(`/project/${slug}`)
  }
}

async function redirectAfterStep(projectId: string, intent: string, nextStep: SubmissionStep) {
  if (intent === "save_exit") {
    redirect("/dashboard?saved=1")
  }

  redirect(getSubmitPath(projectId, nextStep))
}

async function getOwnerUsername(ownerId: string) {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.from("profiles").select("username").eq("id", ownerId).maybeSingle()
  return data?.username ?? "builder"
}

export async function saveSubmissionProfileAction(formData: FormData) {
  configuredGuard()
  const viewer = await getViewer()

  if (!viewer) {
    redirect("/auth/login?next=/submit")
  }

  await updateBuilderProfile(formData, viewer)

  let projectId = getString(formData, "projectId")
  if (!projectId) {
    projectId = await createDraftProject(viewer)
  } else {
    await getOwnedProjectRow(viewer.userId, projectId)
  }

  await revalidateProjectPaths(viewer.profile.username)
  await redirectAfterStep(projectId, getIntent(formData), getStep(getString(formData, "nextStep") || "project"))
}

export async function startNewSubmissionAction() {
  configuredGuard()
  const viewer = await getViewer()

  if (!viewer) {
    redirect("/auth/login?next=/submit")
  }

  const projectId = await createDraftProject(viewer)
  redirect(getSubmitPath(projectId, "project"))
}

async function saveProjectStepAction(formData: FormData, scope: "project" | "details" | "media") {
  configuredGuard()
  const viewer = await getViewer()

  if (!viewer) {
    redirect("/auth/login?next=/submit")
  }

  const projectId = getString(formData, "projectId")
  const { projectRow, currentProject } = await getCurrentProject(viewer.userId, projectId)
  const editable = await ensureEditableRevision(viewer.userId, projectRow, currentProject)

  if (scope === "project") {
    const projectUrl = getString(formData, "projectUrl")

    if (projectUrl) {
      validateUrl(projectUrl, "Enter a valid live project URL.")
    }

    await updateRevision(editable.revisionId, {
      name: getString(formData, "name"),
      tagline: getString(formData, "tagline"),
      project_url: projectUrl,
      category: assertCategory(getString(formData, "category") || currentProject.category),
    })
  }

  if (scope === "details") {
    await updateRevision(editable.revisionId, {
      description: getString(formData, "description"),
      tech_stack: splitTechStack(getString(formData, "techStack")),
      project_tags: getProjectTags(formData),
      help_tags: getHelpTags(formData),
    })
  }

  if (scope === "media") {
    const thumbnailFile = formData.get("thumbnail") as File | null
    const screenshotFiles = formData
      .getAll("screenshots")
      .filter((value): value is File => value instanceof File && value.size > 0)
    const { orderedExistingUrls, orderedNewIds } = getScreenshotOrder(formData, currentProject.screenshotUrls)

    if (orderedExistingUrls.length + orderedNewIds.length > maxScreenshotCount) {
      throw new Error(`Upload up to ${maxScreenshotCount} screenshots.`)
    }

    if (orderedNewIds.length !== screenshotFiles.length) {
      throw new Error("Unable to match the uploaded screenshots to the selected order.")
    }

    validateMediaUploadSize([
      ...(thumbnailFile && thumbnailFile.size > 0 ? [thumbnailFile] : []),
      ...screenshotFiles,
    ])

    const thumbnailUrl =
      thumbnailFile && thumbnailFile.size > 0
        ? await uploadAsset(thumbnailFile, viewer.userId, projectId)
        : currentProject.thumbnailUrl

    const uploadedScreenshotUrls = await Promise.all(screenshotFiles.map((file) => uploadAsset(file, viewer.userId, projectId)))
    const newScreenshotUrlMap = new Map(orderedNewIds.map((id, index) => [id, uploadedScreenshotUrls[index]]))
    const screenshotUrls =
      formData.getAll("screenshotOrder").length > 0
        ? formData
            .getAll("screenshotOrder")
            .filter((value): value is string => typeof value === "string" && value.length > 0)
            .map((entry) => {
              if (entry.startsWith("existing:")) {
                return entry.slice("existing:".length)
              }

              const id = entry.slice("new:".length)
              const url = newScreenshotUrlMap.get(id)

              if (!url) {
                throw new Error("Unable to save screenshots in the selected order.")
              }

              return url
            })
        : currentProject.screenshotUrls

    await updateRevision(editable.revisionId, {
      thumbnail_url: thumbnailUrl,
      screenshot_urls: screenshotUrls,
    })
  }

  const supabase = await createSupabaseServerClient()
  await supabase.from("projects").update(getSavedProjectState(editable.projectRow)).eq("id", projectId)

  await revalidateProjectPaths(viewer.profile.username, currentProject.slug)
  await redirectAfterStep(projectId, getIntent(formData), getStep(getString(formData, "nextStep") || "review"))
}

export async function saveProjectBasicsAction(formData: FormData) {
  await saveProjectStepAction(formData, "project")
}

export async function saveProjectDetailsAction(formData: FormData) {
  await saveProjectStepAction(formData, "details")
}

export async function saveProjectMediaAction(formData: FormData) {
  await saveProjectStepAction(formData, "media")
}

export async function submitProjectForReviewAction(formData: FormData) {
  configuredGuard()
  const viewer = await getViewer()

  if (!viewer) {
    redirect("/auth/login?next=/submit")
  }

  const projectId = getString(formData, "projectId")
  const { projectRow, currentProject } = await getCurrentProject(viewer.userId, projectId)
  const editable = await ensureEditableRevision(viewer.userId, projectRow, currentProject)

  if (!currentProject.name || !currentProject.tagline || !currentProject.description || !currentProject.thumbnailUrl) {
    throw new Error("Complete the required fields before submitting.")
  }

  if (!currentProject.projectUrl) {
    throw new Error("Add a live public URL before submitting.")
  }

  validateUrl(currentProject.projectUrl, "Enter a valid live project URL.")

  const supabase = await createSupabaseServerClient()
  const slug = projectRow.live_revision_id ? projectRow.slug : await generateUniqueProjectSlug(currentProject.name)

  await supabase.from("project_revisions").update({ review_notes: null }).eq("id", editable.revisionId)
  await supabase
    .from("projects")
    .update({
      ...getSubmittedProjectState(editable.projectRow),
      slug,
    })
    .eq("id", projectId)

  await revalidateProjectPaths(viewer.profile.username, slug)
  redirect("/dashboard?submitted=1")
}

export async function createProjectAction(formData: FormData) {
  await submitProjectForReviewAction(formData)
}

export async function updateProjectAction(formData: FormData) {
  await submitProjectForReviewAction(formData)
}

async function adminGuard() {
  const viewer = await getViewer()

  if (!viewer) {
    redirect("/auth/login?next=/admin")
  }

  const allowed = viewer.profile.isAdmin || (viewer.email ? getAdminEmails().includes(viewer.email.toLowerCase()) : false)

  if (!allowed) {
    redirect("/dashboard")
  }

  return viewer
}

export async function approveProjectAction(formData: FormData) {
  configuredGuard()
  await adminGuard()
  const projectId = getString(formData, "projectId")
  const supabase = await createSupabaseServerClient()
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .maybeSingle()

  if (!project?.pending_revision_id) {
    throw new Error("No pending revision to approve.")
  }

  await supabase
    .from("projects")
    .update({
      status: project.live_revision_id ? "approved" : "approved_pending_publish",
      pending_status: project.live_revision_id ? "approved_pending_publish" : null,
    })
    .eq("id", projectId)

  await revalidateProjectPaths(await getOwnerUsername(project.owner_id), project.slug)
}

export async function publishApprovedProjectAction(formData: FormData) {
  configuredGuard()
  const viewer = await getViewer()

  if (!viewer) {
    redirect("/auth/login?next=/dashboard")
  }

  const projectId = getString(formData, "projectId")
  const { projectRow } = await getCurrentProject(viewer.userId, projectId)

  if (!projectRow.pending_revision_id) {
    throw new Error("No approved revision is waiting to be published.")
  }

  if (projectRow.live_revision_id) {
    if (projectRow.pending_status !== "approved_pending_publish") {
      throw new Error("This project is not ready to publish yet.")
    }
  } else if (projectRow.status !== "approved_pending_publish") {
    throw new Error("This project is not ready to publish yet.")
  }

  const supabase = await createSupabaseServerClient()
  await supabase
    .from("projects")
    .update({
      live_revision_id: projectRow.pending_revision_id,
      pending_revision_id: null,
      status: "approved",
      pending_status: null,
    })
    .eq("id", projectId)

  await revalidateProjectPaths(viewer.profile.username, projectRow.slug)
  redirect("/dashboard?published=1")
}

export async function deleteDraftProjectAction(formData: FormData) {
  configuredGuard()
  const viewer = await getViewer()

  if (!viewer) {
    redirect("/auth/login?next=/dashboard")
  }

  const projectId = getString(formData, "projectId")
  const { projectRow } = await getCurrentProject(viewer.userId, projectId)

  if (projectRow.live_revision_id) {
    throw new Error("Live projects cannot be deleted from the draft action.")
  }

  if (projectRow.status !== "draft") {
    throw new Error("Only private drafts can be deleted.")
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from("projects").delete().eq("id", projectId)

  if (error) {
    throw new Error("Unable to delete this draft.")
  }

  await revalidateProjectPaths(viewer.profile.username, projectRow.slug)
  redirect("/dashboard?deleted=1")
}

export async function discardDraftUpdateAction(formData: FormData) {
  configuredGuard()
  const viewer = await getViewer()

  if (!viewer) {
    redirect("/auth/login?next=/dashboard")
  }

  const projectId = getString(formData, "projectId")
  const { projectRow } = await getCurrentProject(viewer.userId, projectId)

  if (!projectRow.live_revision_id || !projectRow.pending_revision_id) {
    throw new Error("No draft update is available to discard.")
  }

  if (projectRow.pending_status !== "draft") {
    throw new Error("Only draft updates can be discarded from this action.")
  }

  const supabase = await createSupabaseServerClient()
  const { error: deleteError } = await supabase.from("project_revisions").delete().eq("id", projectRow.pending_revision_id)

  if (deleteError) {
    throw new Error("Unable to discard this draft update.")
  }

  const { error: updateError } = await supabase
    .from("projects")
    .update({
      pending_revision_id: null,
      pending_status: null,
      status: "approved",
    })
    .eq("id", projectId)

  if (updateError) {
    throw new Error("Unable to restore the live project state.")
  }

  await revalidateProjectPaths(viewer.profile.username, projectRow.slug)
  redirect("/dashboard?discarded=1")
}

export async function unpublishProjectAction(formData: FormData) {
  configuredGuard()
  const viewer = await getViewer()

  if (!viewer) {
    redirect("/auth/login?next=/dashboard")
  }

  const projectId = getString(formData, "projectId")
  const { projectRow } = await getCurrentProject(viewer.userId, projectId)

  if (!projectRow.live_revision_id) {
    throw new Error("This project is not currently published.")
  }

  if (projectRow.pending_revision_id) {
    throw new Error("Resolve the current pending revision before unpublishing this project.")
  }

  if (projectRow.status !== "approved") {
    throw new Error("Only live projects can be removed from public pages.")
  }

  const supabase = await createSupabaseServerClient()
  await supabase
    .from("projects")
    .update({
      live_revision_id: null,
      pending_revision_id: projectRow.live_revision_id,
      status: "draft",
      pending_status: null,
    })
    .eq("id", projectId)

  await revalidateProjectPaths(viewer.profile.username, projectRow.slug)
  redirect("/dashboard?unpublished=1")
}

export async function requestChangesAction(formData: FormData) {
  configuredGuard()
  await adminGuard()
  const projectId = getString(formData, "projectId")
  const reviewNotes = getString(formData, "reviewNotes")

  if (!reviewNotes) {
    throw new Error("Add review notes before requesting changes.")
  }

  const supabase = await createSupabaseServerClient()
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .maybeSingle()

  if (!project?.pending_revision_id) {
    throw new Error("No pending revision to review.")
  }

  await supabase.from("project_revisions").update({ review_notes: reviewNotes }).eq("id", project.pending_revision_id)
  await supabase
    .from("projects")
    .update(
      project.live_revision_id
        ? {
            status: "approved",
            pending_status: "changes_requested",
          }
        : {
            status: "changes_requested",
            pending_status: null,
          },
    )
    .eq("id", projectId)

  await revalidateProjectPaths(await getOwnerUsername(project.owner_id), project.slug)
}
