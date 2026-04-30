import { redirect } from "next/navigation"
import { ProjectCard } from "@/components/project-card"
import { getLikedProjectsForViewer, getViewer } from "@/lib/data"

export default async function LikedProjectsPage() {
  const viewer = await getViewer()

  if (!viewer) {
    redirect("/auth/login?next=/dashboard/liked")
  }

  const projects = await getLikedProjectsForViewer(viewer.userId)

  return (
    <div className="space-y-10">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">Saved discovery</p>
        <h1 className="mt-3 font-serif text-5xl">Liked projects</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Projects you liked are collected here so you can revisit launches, conversations, and builders later.
        </p>
      </header>

      {projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} redirectTo="/dashboard/liked" />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-border px-6 py-14 text-center text-muted-foreground">
          No liked projects yet.
        </div>
      )}
    </div>
  )
}
