import Link from "next/link"
import { redirect } from "next/navigation"
import { approveProjectAction, requestChangesAction } from "@/app/actions"
import { getAdminQueue, getViewer } from "@/lib/data"
import { getAdminEmails } from "@/lib/supabase/env"
import { formatDate } from "@/lib/utils"

export default async function AdminPage() {
  const viewer = await getViewer()

  const allowed = Boolean(
    viewer?.profile.isAdmin || (viewer?.email ? getAdminEmails().includes(viewer.email.toLowerCase()) : false),
  )

  if (!allowed) {
    redirect("/dashboard")
  }

  const queue = await getAdminQueue()

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Moderation queue</p>
      <h1 className="mt-3 font-serif text-5xl">Review pending submissions</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Approve projects when the listing is ready for the builder to publish. Otherwise send them back with clear notes so the builder can revise and resubmit.
      </p>

      <div className="mt-10 grid gap-6">
        {queue.map((project) => (
          <article key={project.id} className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <div className="overflow-hidden rounded-[1.5rem] border border-border bg-muted">
                  {project.thumbnailUrl ? (
                    <img src={project.thumbnailUrl} alt={project.name || "Project thumbnail"} className="aspect-[4/3] w-full object-cover" />
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center text-sm text-muted-foreground">Thumbnail missing</div>
                  )}
                </div>

                {project.screenshotUrls.length > 0 ? (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {project.screenshotUrls.map((url) => (
                      <div key={url} className="overflow-hidden rounded-[1.2rem] border border-border bg-muted">
                        <img src={url} alt={`${project.name || "Project"} screenshot`} className="aspect-[4/3] w-full object-cover" />
                      </div>
                    ))}
                  </div>
                ) : null}

                <p className="mt-4 text-sm text-muted-foreground">
                  Submitted by {project.owner.fullName} on {formatDate(project.submittedAt)}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{project.isLive ? "Update to an already-live project." : "First-time submission."}</p>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{project.category}</p>
                <h2 className="mt-3 font-serif text-3xl">{project.name || "Untitled project"}</h2>
                <p className="mt-2 text-muted-foreground">{project.tagline || "Tagline missing"}</p>
                <p className="mt-5 whitespace-pre-wrap text-sm text-muted-foreground">{project.description || "Description missing"}</p>

                <div className="mt-5 flex flex-wrap gap-3">
                  {project.projectUrl ? (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
                    >
                      Open live URL
                    </a>
                  ) : null}

                  {project.isLive ? (
                    <Link
                      href={`/project/${project.slug}`}
                      className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
                    >
                      Open current listing
                    </Link>
                  ) : null}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.techStack.map((item) => (
                    <span key={item} className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-8 grid gap-4 lg:grid-cols-[auto_1fr]">
                  <form action={approveProjectAction}>
                    <input type="hidden" name="projectId" value={project.id} />
                    <button className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background">
                      Approve project
                    </button>
                  </form>

                  <form action={requestChangesAction} className="grid gap-3">
                    <input type="hidden" name="projectId" value={project.id} />
                    <textarea
                      name="reviewNotes"
                      required
                      rows={3}
                      placeholder="Tell the builder exactly what to fix before this can be approved."
                      className="rounded-2xl border border-border px-4 py-3"
                    />
                    <div>
                      <button className="rounded-full border border-border px-5 py-3 text-sm font-semibold hover:bg-muted">
                        Request changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {queue.length === 0 ? (
        <div className="mt-10 rounded-[2rem] border border-dashed border-border px-6 py-14 text-center text-muted-foreground">
          Nothing is waiting for review right now.
        </div>
      ) : null}
    </div>
  )
}
