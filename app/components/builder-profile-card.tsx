import Link from "next/link"
import { toggleCreatorFollowAction } from "@/app/actions"
import { HelpWantedBadges } from "@/components/help-wanted-badges"
import { ProjectTopicBadges } from "@/components/project-topic-badges"
import type { BuilderProfile, ProjectRecord } from "@/lib/types"

interface BuilderProfileCardProps {
  builder: BuilderProfile
  variant?: "card" | "header"
  viewerId?: string | null
  redirectTo?: string
  featuredProject?: ProjectRecord | null
  projectCount?: number
}

export function BuilderProfileCard({
  builder,
  variant = "card",
  viewerId,
  redirectTo = `/builder/${builder.username}`,
  featuredProject,
  projectCount,
}: BuilderProfileCardProps) {
  const isHeader = variant === "header"
  const isSelf = viewerId === builder.id
  const displayProjectCount = projectCount ?? builder.projectCount ?? 0
  const profileLinks = [
    builder.websiteUrl ? { label: "Website", href: builder.websiteUrl } : null,
    builder.githubUrl ? { label: "GitHub", href: builder.githubUrl } : null,
    builder.twitterUrl ? { label: "X / Twitter", href: builder.twitterUrl } : null,
  ].filter((link): link is { label: string; href: string } => Boolean(link))
  const showContactCard = isHeader && builder.contactEnabled && (builder.contactEmail || builder.websiteUrl)
  const contactHref = builder.contactEmail ? `mailto:${builder.contactEmail}` : builder.websiteUrl ?? "#"
  const contactLabel = builder.contactEmail ? "Email" : "Website"
  const websiteHost = builder.websiteUrl ? getHostname(builder.websiteUrl) : null

  return (
    <div
      className={`relative overflow-hidden border border-border bg-card shadow-sm ${
        isHeader ? "rounded-[2.5rem] p-8 sm:p-10" : "rounded-[2rem] p-6"
      }`}
    >
      {/* Background Accent */}
      <div className="absolute right-0 top-0 -z-0 h-32 w-32 translate-x-10 translate-y--10 rounded-full bg-blue-50/50 blur-3xl" />

      <div className={`relative z-10 flex flex-col gap-6 ${isHeader ? "lg:flex-row lg:items-stretch lg:gap-10" : ""}`}>
        {/* Avatar Section */}
        <div className="shrink-0 self-start">
          <div className="relative">
            <div
              className={`overflow-hidden rounded-full border-4 border-white bg-muted shadow-md ${
                isHeader ? "h-32 w-32 sm:h-40 sm:w-40" : "h-20 w-20"
              }`}
            >
              {builder.avatarUrl ? (
                <img src={builder.avatarUrl} alt={builder.fullName} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-100 text-2xl font-bold text-slate-400">
                  {builder.fullName.charAt(0)}
                </div>
              )}
            </div>
            {isHeader && (
              <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
            )}
          </div>

          {showContactCard ? (
            <div className="mt-14 flex h-36 w-40 flex-col justify-between rounded-2xl border border-border bg-background p-3 shadow-sm">
              <p className="text-sm font-semibold text-foreground">{builder.contactNote || "Available for new projects"}</p>
              <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
                {builder.contactEmail ? (
                  <a href={`mailto:${builder.contactEmail}`} className="flex min-w-0 items-center gap-2 hover:text-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a2 2 0 0 1-2.06 0L2 7" />
                    </svg>
                    <span className="truncate">{builder.contactEmail}</span>
                  </a>
                ) : null}
                {builder.websiteUrl ? (
                  <a href={builder.websiteUrl} target="_blank" rel="noreferrer" className="flex min-w-0 items-center gap-2 hover:text-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <rect width="20" height="14" x="2" y="3" rx="2" />
                      <path d="M8 21h8" />
                      <path d="M12 17v4" />
                    </svg>
                    <span className="truncate">{websiteHost}</span>
                  </a>
                ) : null}
              </div>
              <a
                href={contactHref}
                target={builder.contactEmail ? undefined : "_blank"}
                rel={builder.contactEmail ? undefined : "noreferrer"}
                className="mt-4 flex min-h-10 items-center justify-center rounded-full bg-foreground px-4 text-sm font-semibold text-background"
              >
                Get in touch
                <span className="sr-only"> by {contactLabel}</span>
              </a>
            </div>
          ) : null}

        </div>

        {/* Content Section */}
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className={`font-serif leading-tight ${isHeader ? "text-4xl sm:text-5xl" : "text-2xl"}`}>
                {builder.fullName}
              </h2>
              {builder.isAdmin && (
                <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Staff
                </span>
              )}
            </div>
            <p className="mt-1 text-muted-foreground">@{builder.username}</p>
          </div>

          <p className={`text-muted-foreground leading-relaxed ${isHeader ? "text-lg max-w-2xl" : "text-sm"}`}>
            {builder.bio || "Crafting unique experiences and vibecoding the future."}
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap gap-6 pt-2">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">{builder.followerCount?.toLocaleString() || 0}</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Followers</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">{displayProjectCount.toLocaleString()}</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Projects</span>
            </div>
          </div>

          {isHeader && (profileLinks.length > 0 || builder.focusAreas?.length || builder.openTo?.length) ? (
            <div className="grid max-w-2xl gap-3 rounded-[1.5rem] border border-border bg-background/70 p-4">
                  {profileLinks.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">Links</span>
                      {profileLinks.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-border px-3 py-1 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  ) : null}

                  {builder.focusAreas?.length ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">Focus</span>
                      {builder.focusAreas.slice(0, 5).map((area) => (
                        <span key={area} className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                          {area}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {builder.openTo?.length ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">Open To</span>
                      {builder.openTo.map((option) => (
                        <span key={option} className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                          {option}
                        </span>
                      ))}
                    </div>
                  ) : null}
            </div>
          ) : null}

          {/* Actions Section */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            {isSelf ? (
              <span className="rounded-full border border-border bg-background px-6 py-2.5 text-sm font-bold text-muted-foreground">
                Your profile
              </span>
            ) : (
              <form action={toggleCreatorFollowAction}>
                <input type="hidden" name="creatorId" value={builder.id} />
                <input type="hidden" name="redirectTo" value={redirectTo} />
                <button
                  className={`rounded-full px-6 py-2.5 text-sm font-bold shadow-lg transition-all active:scale-95 ${
                    builder.isFollowedByViewer
                      ? "border border-border bg-background text-foreground shadow-transparent hover:bg-muted"
                      : "bg-blue-600 text-white shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200"
                  }`}
                  aria-pressed={builder.isFollowedByViewer ? "true" : "false"}
                >
                  {builder.isFollowedByViewer ? "Following" : "Follow"}
                </button>
              </form>
            )}
            
            {/* Social Links */}
            <div className="ml-2 flex items-center gap-4 border-l border-border pl-5">
              {builder.websiteUrl && (
                <a href={builder.websiteUrl} target="_blank" rel="noreferrer" className="text-muted-foreground transition-colors hover:text-blue-600" aria-label={`${builder.fullName} website`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 0 20"/><path d="M12 2a15.3 15.3 0 0 0 0 20"/></svg>
                </a>
              )}
              {builder.twitterUrl && (
                <a href={builder.twitterUrl} target="_blank" rel="noreferrer" className="text-muted-foreground transition-colors hover:text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                </a>
              )}
              {builder.githubUrl && (
                <a href={builder.githubUrl} target="_blank" rel="noreferrer" className="text-muted-foreground transition-colors hover:text-slate-900">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {isHeader && (isSelf || featuredProject) ? (
          <aside className="flex rounded-[1.75rem] border border-border bg-background/80 p-5 lg:w-[22rem]">
            {isSelf && !featuredProject ? (
              <div className="flex flex-1 flex-col justify-center rounded-2xl border border-dashed border-border bg-muted/30 p-4">
                <p className="text-sm font-bold text-foreground">Feature a project</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Choose one of your approved projects to pin here from settings.
                </p>
                <Link
                  href="/dashboard/settings"
                  className="mt-4 inline-flex rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background"
                >
                  Edit highlights
                </Link>
              </div>
            ) : null}

            {featuredProject ? (
              <Link href={`/project/${featuredProject.slug}`} className="group flex flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:bg-muted/40">
                <div className="relative h-28 overflow-hidden bg-muted">
                  <img src={featuredProject.thumbnailUrl} alt={featuredProject.name} className="h-full w-full object-cover" />
                  <div className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground shadow-sm">
                    Featured
                  </div>
                </div>
                <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
                  <div className="flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
                    <span className="truncate">{featuredProject.category}</span>
                    <span className="shrink-0">Rev {featuredProject.revisionNumber}</span>
                  </div>
                  <div>
                    <p className="font-serif text-lg leading-tight group-hover:text-blue-600">{featuredProject.name}</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground">{featuredProject.tagline}</p>
                  </div>
                  <div className="max-h-[3.35rem] overflow-hidden">
                    <ProjectTopicBadges tags={featuredProject.projectTags} compact limit={3} />
                  </div>
                  <div className="max-h-[2.25rem] overflow-hidden">
                    <HelpWantedBadges tags={featuredProject.helpTags} compact limit={2} />
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        {featuredProject.viewCount || 0}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                        {featuredProject.heartCount || 0}
                      </span>
                    </div>
                    <span className="rounded-full border border-border bg-background px-2.5 py-1 font-medium text-foreground">Visit</span>
                  </div>
                </div>
              </Link>
            ) : null}
          </aside>
        ) : null}
      </div>
    </div>
  )
}

function getHostname(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, "")
  } catch {
    return value
  }
}
