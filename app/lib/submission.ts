import type { ProjectRevisionContent, ProjectRecord } from "@/lib/types"

export const submissionSteps = ["profile", "project", "details", "media", "review"] as const

export type SubmissionStep = (typeof submissionSteps)[number]

type SubmissionContent = Pick<
  ProjectRevisionContent,
  "name" | "tagline" | "description" | "projectUrl" | "category" | "thumbnailUrl"
>

export function isSubmissionStep(value: string): value is SubmissionStep {
  return submissionSteps.includes(value as SubmissionStep)
}

export function getMissingSubmissionFields(project: SubmissionContent) {
  const missing: Array<{ field: string; step: SubmissionStep }> = []

  if (!project.name) {
    missing.push({ field: "Project name", step: "project" })
  }

  if (!project.tagline) {
    missing.push({ field: "Tagline", step: "project" })
  }

  if (!project.projectUrl) {
    missing.push({ field: "Live public URL", step: "project" })
  }

  if (!project.category) {
    missing.push({ field: "Category", step: "project" })
  }

  if (!project.description) {
    missing.push({ field: "Description", step: "details" })
  }

  if (!project.thumbnailUrl) {
    missing.push({ field: "Thumbnail image", step: "media" })
  }

  return missing
}

export function getSuggestedSubmissionStep(project: SubmissionContent): SubmissionStep {
  const missing = getMissingSubmissionFields(project)
  return missing[0]?.step ?? "review"
}

export function getDashboardSubmissionStep(project: ProjectRecord): SubmissionStep {
  if (project.status === "pending_review" || project.status === "approved_pending_publish") {
    return "review"
  }

  return getSuggestedSubmissionStep(project)
}
