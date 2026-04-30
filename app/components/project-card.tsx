import Link from "next/link"
import { toggleProjectLikeAction } from "@/app/actions"
import { HelpWantedBadges } from "@/components/help-wanted-badges"
import { ProjectTopicBadges } from "@/components/project-topic-badges"
import type { ProjectRecord } from "@/lib/types"

type ProjectCardProps = {
  project: ProjectRecord
  variant?: "default" | "compact"
  showHelpTags?: boolean
  redirectTo?: string
}

export function ProjectCard({ project, variant = "default", showHelpTags = true, redirectTo = `/project/${project.slug}` }: ProjectCardProps) {
  const isCompact = variant === "compact"

  return (
    <article
      className={`group overflow-hidden border border-border bg-card ${
        isCompact
          ? "rounded-[1.4rem] shadow-[0_18px_44px_-28px_rgba(15,23,42,0.28)]"
          : "rounded-3xl shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_32px_80px_-34px_rgba(15,23,42,0.45)]"
      }`}
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={project.thumbnailUrl}
          alt={project.name}
          className={`h-full w-full object-cover transition-transform duration-500 ${isCompact ? "" : "group-hover:scale-[1.04]"}`}
        />
      </div>
      <div className={isCompact ? "space-y-2 p-3" : "space-y-4 p-5"}>
        <div
          className={`flex items-center justify-between gap-3 uppercase text-muted-foreground ${
            isCompact ? "text-[9px] tracking-[0.16em]" : "text-xs tracking-[0.2em]"
          }`}
        >
          <span>{project.category}</span>
          <span>Rev {project.revisionNumber}</span>
        </div>
        <div>
          <h3 className={`font-serif leading-tight ${isCompact ? "text-[1.18rem]" : "text-2xl"}`}>
            <Link
              href={`/project/${project.slug}`}
              className={`transition-colors ${isCompact ? "" : "group-hover:text-[#2b7fff]"}`}
            >
              {project.name}
            </Link>
          </h3>
          <p className={`mt-1 text-muted-foreground ${isCompact ? "text-[11px] leading-[1.28]" : "text-sm"}`}>{project.tagline}</p>
        </div>
        <ProjectTopicBadges tags={project.projectTags} compact={isCompact} limit={isCompact ? 2 : 4} linkToBrowse />
        {showHelpTags ? <HelpWantedBadges tags={project.helpTags} compact={isCompact} limit={isCompact ? 1 : 3} /> : null}
        <div
          className={`flex items-center justify-between border-t border-border/40 ${isCompact ? "pt-3 text-[11px]" : "pt-4 text-sm"}`}
        >
          <div className={`flex items-center ${isCompact ? "gap-2.5" : "gap-4"}`}>
            <Link
              href={`/builder/${project.owner.username}`}
              className={`flex items-center text-muted-foreground transition-colors hover:text-foreground ${isCompact ? "gap-2" : "gap-2.5"}`}
            >
              {project.owner.avatarUrl ? (
                <img
                  src={project.owner.avatarUrl}
                  alt={project.owner.fullName}
                  className={`rounded-full object-cover shadow-sm ${isCompact ? "h-5 w-5" : "h-6 w-6"}`}
                />
              ) : (
                <div className={`flex items-center justify-center rounded-full bg-muted font-bold ${isCompact ? "h-5 w-5 text-[9px]" : "h-6 w-6 text-[10px]"}`}>
                  {project.owner.fullName.charAt(0)}
                </div>
              )}
              <span className="font-medium">@{project.owner.username}</span>
            </Link>

            <div className={`flex items-center text-muted-foreground/70 ${isCompact ? "gap-2" : "gap-3"}`}>
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={isCompact ? "12" : "14"}
                  height={isCompact ? "12" : "14"}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span>{project.viewCount || 0}</span>
              </div>
              <form action={toggleProjectLikeAction}>
                <input type="hidden" name="projectId" value={project.id} />
                <input type="hidden" name="redirectTo" value={redirectTo} />
                <button
                  className={`flex items-center gap-1 transition-colors hover:text-rose-600 ${
                    project.isLikedByViewer ? "text-rose-600" : ""
                  }`}
                  aria-pressed={project.isLikedByViewer ? "true" : "false"}
                  aria-label={project.isLikedByViewer ? `Unlike ${project.name}` : `Like ${project.name}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={isCompact ? "12" : "14"}
                    height={isCompact ? "12" : "14"}
                    viewBox="0 0 24 24"
                    fill={project.isLikedByViewer ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  <span>{project.heartCount || 0}</span>
                </button>
              </form>
            </div>
          </div>

          <a
            href={project.projectUrl}
            target="_blank"
            rel="noreferrer"
            className={`rounded-full border border-border bg-background font-medium transition-colors hover:bg-muted ${isCompact ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-sm"}`}
          >
            Visit
          </a>
        </div>
      </div>
    </article>
  )
}
