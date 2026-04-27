import type { ProjectStatus } from "@/lib/types"
import { cn, formatRelativeStatus } from "@/lib/utils"

export function StatusPill({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
        status === "approved_pending_publish" && "bg-emerald-100 text-emerald-700",
        status === "approved" && "bg-emerald-100 text-emerald-700",
        status === "pending_review" && "bg-amber-100 text-amber-800",
        status === "changes_requested" && "bg-rose-100 text-rose-700",
        status === "rejected" && "bg-slate-200 text-slate-700",
        status === "draft" && "bg-slate-100 text-slate-600",
      )}
    >
      {formatRelativeStatus(status)}
    </span>
  )
}
