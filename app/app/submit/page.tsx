import Link from "next/link"
import { redirect } from "next/navigation"
import {
  saveProjectBasicsAction,
  saveProjectDetailsAction,
  saveProjectMediaAction,
  saveSubmissionProfileAction,
  startNewSubmissionAction,
  submitProjectForReviewAction,
} from "@/app/actions"
import { categories } from "@/lib/constants"
import { getOwnedProjects, getProjectForOwner, getViewer } from "@/lib/data"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { HelpTagFieldset } from "@/components/help-tag-fieldset"
import { ProjectTagFieldset } from "@/components/project-tag-fieldset"
import { ScreenshotUploadEditor } from "@/components/screenshot-upload-editor"
import { StatusPill } from "@/components/status-pill"
import { maxScreenshotCount } from "@/lib/constants"
import {
  getDashboardSubmissionStep,
  getMissingSubmissionFields,
  isSubmissionStep,
  submissionSteps,
  type SubmissionStep,
} from "@/lib/submission"

interface SubmitPageProps {
  searchParams: Promise<{
    projectId?: string
    step?: string
  }>
}

const stepLabels: Record<SubmissionStep, string> = {
  profile: "Builder profile",
  project: "Project basics",
  details: "Project details",
  media: "Media",
  review: "Review and submit",
}

const stepDescriptions: Record<SubmissionStep, string> = {
  profile: "Confirm the public builder details attached to this submission.",
  project: "Add the core listing information and choose where the project belongs.",
  details: "Write the listing copy and optional help tags for feedback.",
  media: "Upload the thumbnail and any supporting screenshots.",
  review: "Check the final listing summary before sending it to admin review.",
}

function getStepHref(projectId: string, step: SubmissionStep) {
  return `/submit?projectId=${projectId}&step=${step}`
}

function getPreviousStep(step: SubmissionStep): SubmissionStep | null {
  const index = submissionSteps.indexOf(step)
  return index > 0 ? submissionSteps[index - 1] : null
}

export default async function SubmitPage({ searchParams }: SubmitPageProps) {
  const viewer = await getViewer()

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Submission setup</p>
        <h1 className="mt-3 font-serif text-5xl">Configure Supabase first</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          The builder flow is implemented, but sign-in, storage, and moderation all depend on Supabase. Fill in the environment values from
          `.env.example` and apply `supabase/schema.sql`.
        </p>
      </div>
    )
  }

  if (!viewer) {
    redirect("/auth/login?next=/submit")
  }

  const params = await searchParams
  const projectId = params.projectId ?? ""
  const project = projectId ? await getProjectForOwner(viewer.userId, projectId) : null

  if (projectId && !project) {
    redirect("/dashboard")
  }

  const currentStep: SubmissionStep = project
    ? isSubmissionStep(params.step ?? "") ? (params.step as SubmissionStep) : getDashboardSubmissionStep(project)
    : "profile"

  const allOwnedProjects = await getOwnedProjects(viewer.userId)
  const activeDrafts = allOwnedProjects.filter((item) => item.id !== projectId && item.status !== "approved")
  const missingFields = project ? getMissingSubmissionFields(project) : []
  const previousStep = getPreviousStep(currentStep)

  const isReturningBuilder = allOwnedProjects.length > 0 || (viewer.profile.bio && viewer.profile.bio !== "New on Vibeblt.")

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">Builder onboarding</p>
            <h1 className="mt-3 font-serif text-4xl">Submit a project</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              Drafts are saved as you move through the flow. Nothing goes public until you submit it and it passes admin review.
            </p>
            {project ? (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <StatusPill status={project.status} />
                <span className="text-sm text-muted-foreground">
                  {project.status === "approved_pending_publish"
                    ? project.isLive
                      ? "An approved update is waiting for you to publish."
                      : "This project is approved and still private until you publish it."
                    : project.isLive
                      ? "A live version already exists."
                      : "This project is still private."}
                </span>
              </div>
            ) : null}
          </div>

          <div className="rounded-[2rem] border border-border bg-muted/40 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Submission steps</p>
            <div className="mt-5 grid gap-3">
              {submissionSteps.map((step, index) => {
                const isActive = step === currentStep
                const canLink = Boolean(projectId)

                return canLink ? (
                  <Link
                    key={step}
                    href={getStepHref(projectId, step)}
                    className={`rounded-[1.4rem] border px-4 py-4 transition-colors ${
                      isActive ? "border-[#2b7fff]/30 bg-[#edf5ff]" : "border-border bg-background hover:bg-white"
                    }`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Step {index + 1}</p>
                    <p className="mt-1 font-semibold text-foreground">{stepLabels[step]}</p>
                  </Link>
                ) : (
                  <div key={step} className={`rounded-[1.4rem] border px-4 py-4 ${isActive ? "border-[#2b7fff]/30 bg-[#edf5ff]" : "border-border bg-background"}`}>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Step {index + 1}</p>
                    <p className="mt-1 font-semibold text-foreground">{stepLabels[step]}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {project ? (
            <div className="rounded-[2rem] border border-border bg-card p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Checklist</p>
              {missingFields.length === 0 ? (
                <p className="mt-4 text-sm text-emerald-700">Everything required for admin review is present.</p>
              ) : (
                <div className="mt-4 grid gap-3">
                  {missingFields.map((item) => (
                    <Link
                      key={item.field}
                      href={getStepHref(project.id, item.step)}
                      className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground hover:bg-white"
                    >
                      {item.field}
                    </Link>
                  ))}
                </div>
              )}

              {project.reviewNotes ? (
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
                  <p className="font-semibold">Admin notes</p>
                  <p className="mt-2 whitespace-pre-wrap">{project.reviewNotes}</p>
                </div>
              ) : null}

              {project.isLive && project.status !== "approved" ? (
                <p className="mt-5 text-sm text-muted-foreground">The current live version stays public while this pending update is being worked or reviewed.</p>
              ) : null}
            </div>
          ) : null}

          {activeDrafts.length > 0 ? (
            <div className="rounded-[2rem] border border-border bg-card p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Resume another draft</p>
              <div className="mt-4 grid gap-3">
                {activeDrafts.slice(0, 4).map((draft) => (
                  <Link
                    key={draft.id}
                    href={getStepHref(draft.id, getDashboardSubmissionStep(draft))}
                    className="rounded-[1.4rem] border border-border bg-background px-4 py-4 hover:bg-white"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{draft.name || "Untitled draft"}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{draft.tagline || "Continue your saved setup."}</p>
                      </div>
                      <StatusPill status={draft.status} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </aside>

        <section className="rounded-[2.25rem] border border-border bg-card p-6 shadow-sm sm:p-8">
          {!projectId && isReturningBuilder ? (
            <div className="space-y-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">Welcome back</p>
                <h2 className="mt-3 font-serif text-4xl">Ready to submit a new project?</h2>
                <p className="mt-4 text-muted-foreground">
                  Your builder profile is already set up and will be attached to your new submission automatically.
                </p>
              </div>

              <div className="rounded-[2rem] border border-[#dbe9f7] bg-[#f5faff] p-8">
                <form action={startNewSubmissionAction}>
                  <button className="w-full rounded-2xl bg-foreground py-4 text-lg font-semibold text-background shadow-lg shadow-slate-200 transition-transform hover:-translate-y-0.5">
                    Start a new project listing
                  </button>
                </form>
                <div className="mt-6 flex flex-col items-center gap-4 text-sm text-muted-foreground">
                  <p>Or resume a draft from the sidebar.</p>
                  <div className="h-px w-24 bg-border/60" />
                  <Link href="/submit?step=profile" className="font-medium text-foreground hover:underline">
                    Edit your builder profile first
                  </Link>
                </div>
              </div>

              <div className="grid gap-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Quick Checklist</p>
                <ul className="grid gap-3 text-sm text-muted-foreground">
                  {[
                    "Prepare a 1200x900px thumbnail",
                    "Have your live public URL ready",
                    "Gather a few supporting screenshots",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">{stepLabels[currentStep]}</p>
              <h2 className="mt-3 font-serif text-4xl">{stepDescriptions[currentStep]}</h2>

          {currentStep === "profile" ? (
            <form action={saveSubmissionProfileAction} className="mt-8 grid gap-6">
              {project ? <input type="hidden" name="projectId" value={project.id} /> : null}
              <input type="hidden" name="nextStep" value="project" />

              <label className="grid gap-2">
                <span className="text-sm font-semibold">Full name</span>
                <input
                  name="fullName"
                  defaultValue={viewer.profile.fullName}
                  placeholder="Your public builder name"
                  className="min-h-12 rounded-2xl border border-border px-4"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">Username</span>
                <input
                  name="username"
                  defaultValue={viewer.profile.username}
                  placeholder="your-handle"
                  className="min-h-12 rounded-2xl border border-border px-4"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">Bio</span>
                <textarea
                  name="bio"
                  defaultValue={viewer.profile.bio ?? ""}
                  rows={4}
                  placeholder="What do you build and what kind of projects do you want to be known for?"
                  className="rounded-2xl border border-border px-4 py-3"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">Avatar image</span>
                <input
                  name="avatarFile"
                  type="file"
                  accept="image/*"
                  className="rounded-2xl border border-dashed border-border px-4 py-3"
                />
                {viewer.profile.avatarUrl ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/30 p-3">
                    <span className="h-14 w-14 overflow-hidden rounded-full bg-muted">
                      <img src={viewer.profile.avatarUrl} alt={viewer.profile.fullName} className="h-full w-full object-cover" />
                    </span>
                    <span className="text-xs text-muted-foreground">Current avatar. Choose a new image to replace it.</span>
                  </div>
                ) : null}
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">Avatar URL</span>
                <input
                  name="avatarUrl"
                  type="url"
                  defaultValue={viewer.profile.avatarUrl ?? ""}
                  placeholder="Optional public image URL"
                  className="min-h-12 rounded-2xl border border-border px-4"
                />
              </label>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold">Twitter/X URL</span>
                  <input
                    name="twitterUrl"
                    type="url"
                    defaultValue={viewer.profile.twitterUrl ?? ""}
                    placeholder="https://twitter.com/..."
                    className="min-h-12 rounded-2xl border border-border px-4"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold">GitHub URL</span>
                  <input
                    name="githubUrl"
                    type="url"
                    defaultValue={viewer.profile.githubUrl ?? ""}
                    placeholder="https://github.com/..."
                    className="min-h-12 rounded-2xl border border-border px-4"
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  name="intent"
                  value="save_exit"
                  className="rounded-full border border-border px-5 py-3 text-sm font-semibold hover:bg-muted"
                >
                  Save draft and exit
                </button>
                <button name="intent" value="continue" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background">
                  Continue to project basics
                </button>
              </div>
            </form>
          ) : null}

          {currentStep === "project" && project ? (
            <form action={saveProjectBasicsAction} className="mt-8 grid gap-6">
              <input type="hidden" name="projectId" value={project.id} />
              <input type="hidden" name="nextStep" value="details" />

              <label className="grid gap-2">
                <span className="text-sm font-semibold">Project name</span>
                <input name="name" defaultValue={project.name} placeholder="What is the project called?" className="min-h-12 rounded-2xl border border-border px-4" />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">Tagline</span>
                <input
                  name="tagline"
                  defaultValue={project.tagline}
                  placeholder="Explain what it does in one sentence."
                  className="min-h-12 rounded-2xl border border-border px-4"
                />
              </label>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold">Live public URL</span>
                  <input
                    name="projectUrl"
                    type="url"
                    defaultValue={project.projectUrl}
                    placeholder="https://"
                    className="min-h-12 rounded-2xl border border-border px-4"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold">Category</span>
                  <select name="category" defaultValue={project.category} className="min-h-12 rounded-2xl border border-border px-4">
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="flex flex-wrap gap-3">
                {previousStep ? (
                  <Link href={getStepHref(project.id, previousStep)} className="rounded-full border border-border px-5 py-3 text-sm font-semibold hover:bg-muted">
                    Back
                  </Link>
                ) : null}
                <button
                  name="intent"
                  value="save_exit"
                  className="rounded-full border border-border px-5 py-3 text-sm font-semibold hover:bg-muted"
                >
                  Save draft and exit
                </button>
                <button name="intent" value="continue" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background">
                  Continue to project details
                </button>
              </div>
            </form>
          ) : null}

          {currentStep === "details" && project ? (
            <form action={saveProjectDetailsAction} className="mt-8 grid gap-6">
              <input type="hidden" name="projectId" value={project.id} />
              <input type="hidden" name="nextStep" value="media" />

              <label className="grid gap-2">
                <span className="text-sm font-semibold">Description</span>
                <textarea
                  name="description"
                  defaultValue={project.description}
                  rows={7}
                  placeholder="What does the project do, who is it for, and why is it worth browsing?"
                  className="rounded-2xl border border-border px-4 py-3"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">Tech stack</span>
                <input
                  name="techStack"
                  defaultValue={project.techStack.join(", ")}
                  placeholder="Optional, comma separated. Example: Next.js, Supabase, OpenAI"
                  className="min-h-12 rounded-2xl border border-border px-4"
                />
              </label>

              <ProjectTagFieldset selectedTags={project.projectTags} />
              <HelpTagFieldset selectedTags={project.helpTags} />

              <div className="flex flex-wrap gap-3">
                {previousStep ? (
                  <Link href={getStepHref(project.id, previousStep)} className="rounded-full border border-border px-5 py-3 text-sm font-semibold hover:bg-muted">
                    Back
                  </Link>
                ) : null}
                <button
                  name="intent"
                  value="save_exit"
                  className="rounded-full border border-border px-5 py-3 text-sm font-semibold hover:bg-muted"
                >
                  Save draft and exit
                </button>
                <button name="intent" value="continue" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background">
                  Continue to media
                </button>
              </div>
            </form>
          ) : null}

          {currentStep === "media" && project ? (
            <form action={saveProjectMediaAction} className="mt-8 grid gap-6">
              <input type="hidden" name="projectId" value={project.id} />
              <input type="hidden" name="nextStep" value="review" />

              <div className="grid gap-6">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold">Thumbnail image</span>
                  <input name="thumbnail" type="file" accept="image/*" className="rounded-2xl border border-dashed border-border px-4 py-3" />
                  {project.thumbnailUrl ? (
                    <div className="overflow-hidden rounded-[1.5rem] border border-border bg-muted">
                      <img src={project.thumbnailUrl} alt={project.name || "Project thumbnail"} className="aspect-[4/3] w-full object-cover" />
                    </div>
                  ) : null}
                </label>

                <ScreenshotUploadEditor
                  existingUrls={project.screenshotUrls}
                  maxCount={maxScreenshotCount}
                  projectName={project.name || "Project"}
                />
              </div>

              <div className="flex flex-wrap gap-3">
                {previousStep ? (
                  <Link href={getStepHref(project.id, previousStep)} className="rounded-full border border-border px-5 py-3 text-sm font-semibold hover:bg-muted">
                    Back
                  </Link>
                ) : null}
                <button
                  name="intent"
                  value="save_exit"
                  className="rounded-full border border-border px-5 py-3 text-sm font-semibold hover:bg-muted"
                >
                  Save draft and exit
                </button>
                <button name="intent" value="continue" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background">
                  Continue to review
                </button>
              </div>
            </form>
          ) : null}

          {currentStep === "review" && project ? (
            <div className="mt-8 space-y-6">
              <div className="rounded-[2rem] border border-border bg-muted/30 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{project.category}</p>
                    <h3 className="mt-2 font-serif text-3xl">{project.name || "Untitled project"}</h3>
                    <p className="mt-2 text-muted-foreground">{project.tagline || "Add a tagline before sending this for review."}</p>
                  </div>
                  <StatusPill status={project.status} />
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="overflow-hidden rounded-[1.5rem] border border-border bg-muted">
                    {project.thumbnailUrl ? (
                      <img src={project.thumbnailUrl} alt={project.name || "Project thumbnail"} className="aspect-[4/3] w-full object-cover" />
                    ) : (
                      <div className="flex aspect-[4/3] items-center justify-center text-sm text-muted-foreground">Thumbnail missing</div>
                    )}
                  </div>
                  <div>
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">{project.description || "Add a project description before submitting."}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.techStack.map((item) => (
                        <span key={item} className="rounded-full bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                          {item}
                        </span>
                      ))}
                    </div>
                    {project.projectUrl ? (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-6 inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-background"
                      >
                        Open live URL
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-border bg-card p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">What happens next</p>
                <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <li>1. Your listing goes to the admin queue for review.</li>
                  <li>2. Admin can approve it or send it back with notes.</li>
                  <li>3. Once approved, you publish it to make it appear on the landing page, browse, and your public builder profile.</li>
                </ol>
              </div>

              <form action={submitProjectForReviewAction} className="flex flex-wrap gap-3">
                <input type="hidden" name="projectId" value={project.id} />
                {previousStep ? (
                  <Link href={getStepHref(project.id, previousStep)} className="rounded-full border border-border px-5 py-3 text-sm font-semibold hover:bg-muted">
                    Back
                  </Link>
                ) : null}
                <Link href="/dashboard" className="rounded-full border border-border px-5 py-3 text-sm font-semibold hover:bg-muted">
                  Exit to dashboard
                </Link>
                <button
                  disabled={missingFields.length > 0}
                  className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {project.status === "pending_review" ? "Update submission in review" : "Submit for approval"}
                </button>
              </form>
            </div>
          ) : null}
            </>
          )}
        </section>
      </div>
    </div>
  )
}
