export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ")
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

export function formatRelativeStatus(status: string) {
  switch (status) {
    case "pending_review":
      return "Pending review"
    case "approved_pending_publish":
      return "Approved"
    case "approved":
      return "Live"
    case "changes_requested":
      return "Changes requested"
    case "rejected":
      return "Rejected"
    default:
      return "Draft"
  }
}

export function splitTechStack(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

export function unique<T>(values: T[]) {
  return Array.from(new Set(values))
}
