import type { Category } from "@/lib/constants"

export type ProjectStatus =
  | "draft"
  | "pending_review"
  | "approved_pending_publish"
  | "approved"
  | "changes_requested"
  | "rejected"

export interface BuilderProfile {
  id: string
  email?: string | null
  fullName: string
  username: string
  avatarUrl?: string | null
  bio?: string | null
  isAdmin?: boolean
  twitterUrl?: string | null
  githubUrl?: string | null
  followerCount?: number
  projectCount?: number
  isFollowedByViewer?: boolean
}

export interface ProjectRevisionContent {
  name: string
  tagline: string
  description: string
  projectUrl: string
  category: Category
  techStack: string[]
  projectTags: string[]
  helpTags: string[]
  thumbnailUrl: string
  screenshotUrls: string[]
}

export interface ProjectRecord extends ProjectRevisionContent {
  id: string
  slug: string
  status: ProjectStatus
  hasPendingRevision: boolean
  rejectionReason?: string | null
  reviewNotes?: string | null
  createdAt: string
  updatedAt: string
  submittedAt: string
  revisionNumber: number
  owner: BuilderProfile
  isLive: boolean
  viewCount?: number
  heartCount?: number
  isLikedByViewer?: boolean
}

export interface AuthViewer {
  userId: string
  email: string | null
  profile: BuilderProfile
}

export interface ProjectSubmissionValues extends ProjectRevisionContent {
  projectId?: string
}

export interface ProjectComment {
  id: string
  projectId: string
  userId: string
  user: BuilderProfile
  parentId?: string | null
  content: string
  isHidden?: boolean
  createdAt: string
  likeCount: number
  replies: ProjectComment[]
}
