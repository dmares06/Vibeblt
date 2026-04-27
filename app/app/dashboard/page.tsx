import Link from "next/link"
import { redirect } from "next/navigation"
import {
  deleteDraftProjectAction,
  discardDraftUpdateAction,
  publishApprovedProjectAction,
  startNewSubmissionAction,
  unpublishProjectAction,
} from "@/app/actions"
import { HelpWantedBadges } from "@/components/help-wanted-badges"
import { StatusPill } from "@/components/status-pill"
import { getOwnedProjects, getViewer } from "@/lib/data"
import { getDashboardSubmissionStep } from "@/lib/submission"
import { formatDate } from "@/lib/utils"

export default async function DashboardPage() {
  const viewer = await getViewer()

  if (!viewer) {
    redirect("/auth/login?next=/dashboard")
  }

  const projects = await getOwnedProjects(viewer.userId)
  const drafts = projects.filter((project) => project.status === "draft")
  const inReview = projects.filter((project) => project.status === "pending_review" || project.status === "changes_requested")
  const approvedToPublish = projects.filter((project) => project.status === "approved_pending_publish")
  const liveProjects = projects.filter((project) => project.status === "approved")

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">Builder dashboard</p>
          <h1 className="mt-3 font-serif text-5xl">Manage your projects</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Manage your drafts, pending submissions, and live listings in one place.
          </p>
        </div>
        <form action={startNewSubmissionAction}>
          <button className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background hover:opacity-90 transition-opacity">
            Start a new project
          </button>
        </form>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-4">
        <div className="rounded-[1.5rem] border border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Drafts</p>
          <p className="mt-3 font-serif text-4xl">{drafts.length}</p>
          <p className="mt-2 text-sm text-muted-foreground">Private work-in-progress submissions that can be resumed at any time.</p>
        </div>
        <div className="rounded-[1.5rem] border border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">In review</p>
          <p className="mt-3 font-serif text-4xl">{inReview.length}</p>
          <p className="mt-2 text-sm text-muted-foreground">Projects waiting on admin approval or changes before they can be approved.</p>
        </div>
        <div className="rounded-[1.5rem] border border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Approved to publish</p>
          <p className="mt-3 font-serif text-4xl">{approvedToPublish.length}</p>
          <p className="mt-2 text-sm text-muted-foreground">Admin-approved projects waiting on your publish action.</p>
        </div>
        <div className="rounded-[1.5rem] border border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Live projects</p>
          <p className="mt-3 font-serif text-4xl">{liveProjects.length}</p>
          <p className="mt-2 text-sm text-muted-foreground">Approved listings visible on the landing page, browse, and your public builder profile.</p>
        </div>
      </div>

      <section className="mt-12">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-serif text-3xl">Drafts</h2>
          <span className="text-sm text-muted-foreground">{drafts.length} saved</span>
        </div>

        {drafts.length > 0 ? (
          <div className="mt-6 grid gap-5">
            {drafts.map((project) => (
              <article key={project.id} className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <StatusPill status={project.status} />
                      <span className="text-sm text-muted-foreground">Updated {formatDate(project.updatedAt)}</span>
                    </div>
                    <h3 className="mt-4 font-serif text-3xl">{project.name || "Untitled draft"}</h3>
                    <p className="mt-2 text-muted-foreground">{project.tagline || "Continue the onboarding flow to finish the listing."}</p>
                    <HelpWantedBadges tags={project.helpTags} className="mt-4" />
                    {project.isLive ? (
                      <p className="mt-4 text-sm text-muted-foreground">A currently approved version remains public while this draft update stays private.</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/submit?projectId=${project.id}&step=${getDashboardSubmissionStep(project)}`}
                      className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background"
                    >
                      Resume setup
                    </Link>
                    {project.isLive ? (
                      <form action={discardDraftUpdateAction}>
                        <input type="hidden" name="projectId" value={project.id} />
                        <button className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50">
                          Discard draft
                        </button>
                      </form>
                    ) : (
                      <form action={deleteDraftProjectAction}>
                        <input type="hidden" name="projectId" value={project.id} />
                        <button className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50">
                          Delete draft
                        </button>
                      </form>
                    )}
                    {project.isLive ? (
                      <Link
                        href={`/project/${project.slug}`}
                        className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
                      >
                        View live page
                      </Link>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[2rem] border border-dashed border-border px-6 py-12 text-center text-muted-foreground">
            No private drafts yet.
          </div>
        )}
      </section>

      <section className="mt-12">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-serif text-3xl">In review</h2>
          <span className="text-sm text-muted-foreground">{inReview.length} waiting</span>
        </div>

        {inReview.length > 0 ? (
          <div className="mt-6 grid gap-5">
            {inReview.map((project) => (
              <article key={project.id} className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <StatusPill status={project.status} />
                      <span className="text-sm text-muted-foreground">Updated {formatDate(project.updatedAt)}</span>
                    </div>
                    <h3 className="mt-4 font-serif text-3xl">{project.name || "Untitled submission"}</h3>
                    <p className="mt-2 text-muted-foreground">{project.tagline || "This submission is missing visible copy in the current revision."}</p>
                    <HelpWantedBadges tags={project.helpTags} className="mt-4" />
                    {project.reviewNotes ? (
                      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                        <p className="font-semibold">Admin notes</p>
                        <p className="mt-2 whitespace-pre-wrap">{project.reviewNotes}</p>
                      </div>
                    ) : null}
                    {project.isLive ? (
                      <p className="mt-4 text-sm text-muted-foreground">Your current live version stays public until this pending revision is approved.</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/submit?projectId=${project.id}&step=${project.status === "changes_requested" ? getDashboardSubmissionStep(project) : "review"}`}
                      className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background"
                    >
                      {project.status === "changes_requested" ? "Address changes" : "View submission"}
                    </Link>
                    {project.isLive ? (
                      <Link
                        href={`/project/${project.slug}`}
                        className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
                      >
                        View live page
                      </Link>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[2rem] border border-dashed border-border px-6 py-12 text-center text-muted-foreground">
            Nothing is waiting on review right now.
          </div>
        )}
      </section>

      <section className="mt-12">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-serif text-3xl">Approved to publish</h2>
          <span className="text-sm text-muted-foreground">{approvedToPublish.length} ready</span>
        </div>

        {approvedToPublish.length > 0 ? (
          <div className="mt-6 grid gap-5">
            {approvedToPublish.map((project) => (
              <article key={project.id} className="rounded-[2rem] border border-emerald-200 bg-emerald-50/40 p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <StatusPill status={project.status} />
                      <span className="text-sm text-emerald-700">Approved by admin on the current revision</span>
                      <span className="text-sm text-muted-foreground">Updated {formatDate(project.updatedAt)}</span>
                    </div>
                    <h3 className="mt-4 font-serif text-3xl">{project.name || "Untitled submission"}</h3>
                    <p className="mt-2 text-muted-foreground">{project.tagline || "This approved submission is ready to publish."}</p>
                    <HelpWantedBadges tags={project.helpTags} className="mt-4" />
                    <p className="mt-4 text-sm text-muted-foreground">
                      {project.isLive
                        ? "Your current live version stays public until you publish this approved update."
                        : "This project is approved and private until you publish it."}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <form action={publishApprovedProjectAction}>
                      <input type="hidden" name="projectId" value={project.id} />
                      <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
                        Publish now
                      </button>
                    </form>
                    <Link
                      href={`/submit?projectId=${project.id}&step=review`}
                      className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
                    >
                      Review approved submission
                    </Link>
                    {project.isLive ? (
                      <Link
                        href={`/project/${project.slug}`}
                        className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
                      >
                        View live page
                      </Link>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[2rem] border border-dashed border-border px-6 py-12 text-center text-muted-foreground">
            Nothing is approved and waiting for publish right now.
          </div>
        )}
      </section>

      <section className="mt-12">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-serif text-3xl">Live projects</h2>
          <span className="text-sm text-muted-foreground">{liveProjects.length} approved</span>
        </div>

        {liveProjects.length > 0 ? (
          <div className="mt-6 grid gap-5">
            {liveProjects.map((project) => (
              <article key={project.id} className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <StatusPill status={project.status} />
                      <span className="text-sm text-muted-foreground">Updated {formatDate(project.updatedAt)}</span>
                    </div>
                    <h3 className="mt-4 font-serif text-3xl">{project.name}</h3>
                    <p className="mt-2 text-muted-foreground">{project.tagline}</p>
                    <HelpWantedBadges tags={project.helpTags} className="mt-4" />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/dashboard/projects/${project.id}/edit`}
                      className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background"
                    >
                      Submit update
                    </Link>
                    <form action={unpublishProjectAction}>
                      <input type="hidden" name="projectId" value={project.id} />
                      <button className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50">
                        Remove from public
                      </button>
                    </form>
                    <Link
                      href={`/project/${project.slug}`}
                      className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
                    >
                      View live page
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[2rem] border border-dashed border-border px-6 py-12 text-center text-muted-foreground">
            No approved projects yet.
          </div>
        )}
      </section>
    </div>
  )
}
