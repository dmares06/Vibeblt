import { notFound } from "next/navigation"
import { getBuilderByUsername, getProjectsByBuilder } from "@/lib/data"
import { ProjectCard } from "@/components/project-card"
import { BuilderProfileCard } from "@/components/builder-profile-card"

interface BuilderPageProps {
  params: Promise<{ username: string }>
}

export default async function BuilderPage({ params }: BuilderPageProps) {
  const { username } = await params
  const builder = await getBuilderByUsername(username)

  if (!builder) {
    notFound()
  }

  const projects = await getProjectsByBuilder(username)

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <BuilderProfileCard builder={builder} variant="header" />

      <section className="mt-12">
        <h2 className="font-serif text-3xl">Projects by {builder.fullName.split(" ")[0]}</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  )
}
