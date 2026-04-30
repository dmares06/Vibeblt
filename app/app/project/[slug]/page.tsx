import Link from "next/link"
import { notFound } from "next/navigation"
import { HelpWantedBadges } from "@/components/help-wanted-badges"
import { ProjectTopicBadges } from "@/components/project-topic-badges"
import { BuilderProfileCard } from "@/components/builder-profile-card"
import { ProjectComments } from "@/components/project-comments"
import { toggleProjectLikeAction } from "@/app/actions"
import { getProjectBySlug, getProjectComments, getProjectsByBuilder, getViewer } from "@/lib/data"
import { ProjectCard } from "@/components/project-card"
import { formatDate } from "@/lib/utils"

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const builderProjects = await getProjectsByBuilder(project.owner.username)
  const otherProjects = builderProjects.filter((p) => p.id !== project.id).slice(0, 3)
  const [comments, viewer] = await Promise.all([getProjectComments(project.id), getViewer()])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/browse" className="text-sm text-muted-foreground hover:text-foreground">
        Back to browse
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-[2rem] border border-border bg-muted">
            <img src={project.thumbnailUrl} alt={project.name} className="aspect-[4/3] w-full object-cover" />
          </div>
          {project.screenshotUrls.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {project.screenshotUrls.map((url) => (
                <div key={url} className="overflow-hidden rounded-[1.5rem] border border-border bg-muted">
                  <img src={url} alt={`${project.name} screenshot`} className="aspect-[4/3] w-full object-cover" />
                </div>
              ))}
            </div>
          ) : null}

          <div className="rounded-[2rem] border border-border p-8">
            <h2 className="font-serif text-3xl">About this project</h2>
            <div className="mt-6 prose prose-slate max-w-none">
              <p className="whitespace-pre-wrap text-lg leading-relaxed text-muted-foreground">{project.description}</p>
            </div>
          </div>

          <ProjectComments comments={comments} projectId={project.id} projectSlug={project.slug} viewer={viewer} />
        </div>

        <aside className="space-y-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">{project.category}</p>
            <h1 className="mt-4 font-serif text-5xl leading-none">{project.name}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{project.tagline}</p>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Launch Details</p>
                <p className="mt-2 text-sm text-muted-foreground">Published {formatDate(project.updatedAt)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <form action={toggleProjectLikeAction}>
                  <input type="hidden" name="projectId" value={project.id} />
                  <input type="hidden" name="redirectTo" value={`/project/${project.slug}`} />
                  <button
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
                      project.isLikedByViewer
                        ? "border-rose-200 bg-rose-50 text-rose-700"
                        : "border-border bg-background text-foreground hover:bg-muted"
                    }`}
                    aria-pressed={project.isLikedByViewer ? "true" : "false"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={project.isLikedByViewer ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                    {project.isLikedByViewer ? "Liked" : "Like"} {project.heartCount || 0}
                  </button>
                </form>
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background shadow-lg transition-transform hover:-translate-y-0.5 active:scale-95"
                >
                  Visit live project
                </a>
              </div>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-2">
              {project.techStack.map((item) => (
                <span key={item} className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                  {item}
                </span>
              ))}
            </div>
            <ProjectTopicBadges tags={project.projectTags} className="mt-6" linkToBrowse />
            <HelpWantedBadges tags={project.helpTags} className="mt-6" />
          </div>

          <section>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Meet the Builder</p>
            <BuilderProfileCard builder={project.owner} viewerId={viewer?.userId} redirectTo={`/project/${project.slug}`} />
          </section>
        </aside>
      </div>

      {otherProjects.length > 0 ? (
        <section className="mt-20 border-t border-border pt-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">More by builder</p>
              <h2 className="mt-2 font-serif text-4xl">Other projects by {project.owner.fullName.split(" ")[0]}</h2>
            </div>
            <Link href={`/builder/${project.owner.username}`} className="text-sm font-bold text-blue-600 hover:underline">
              View builder profile
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {otherProjects.map((candidate) => (
              <ProjectCard key={candidate.id} project={candidate} redirectTo={`/project/${project.slug}`} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
