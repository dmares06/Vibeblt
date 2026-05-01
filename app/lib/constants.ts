export const categories = [
  "Developer Tools",
  "Productivity",
  "Design",
  "Marketing",
  "AI Agents",
  "SaaS",
  "Education",
  "Community",
] as const

export type Category = (typeof categories)[number]

export const projectStatuses = [
  "draft",
  "pending_review",
  "approved_pending_publish",
  "approved",
  "changes_requested",
  "rejected",
] as const

export const adminStatuses = ["pending_review", "changes_requested"] as const

export const maxScreenshotCount = 5
export const maxMediaUploadBytes = 50 * 1024 * 1024
export const maxAvatarUploadBytes = 5 * 1024 * 1024
export const maxProjectTagCount = 6

export const presetProjectTags = [
  "E-commerce",
  "Marketplace",
  "Portfolio",
  "SaaS",
  "AI Agent",
  "AI Chatbot",
  "Automation",
  "Mobile App",
  "Web App",
  "Workflow",
  "Developer Tool",
  "Creator Tools",
  "Data / Analytics",
  "Education",
  "Finance",
  "Health",
  "CRM",
  "Content",
  "Local Business",
  "Social",
  "Productivity",
] as const

export const presetHelpTags = [
  "Security",
  "Design",
  "App Store Submission",
  "Collab",
  "Performance",
  "Growth",
  "Marketing",
  "Advertising",
  "SEO Keywords",
  "Accessibility",
  "QA / Bug Testing",
  "Copywriting",
  "Pricing",
  "User Research",
  "Analytics",
  "Product Feedback",
] as const

export const maxHelpTagCount = 5

export const presetOpenToOptions = [
  "Feedback",
  "Collaboration",
  "Helping builders",
  "Beta testers",
] as const

export const maxProfileFocusAreaCount = 5
