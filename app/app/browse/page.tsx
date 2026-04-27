import Link from "next/link"
import { categories } from "@/lib/constants"
import { getPublicProjects } from "@/lib/data"
import { ProjectCard } from "@/components/project-card"

interface BrowsePageProps {
  searchParams: Promise<{
    category?: string
    q?: string
  }>
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = await searchParams
  const selectedCategory = params.category ?? ""
  const query = params.q?.trim().toLowerCase() ?? ""
  const allProjects = await getPublicProjects()
  const filteredProjects = allProjects.filter((project) => {
    const categoryMatch = selectedCategory ? project.category === selectedCategory : true
    const queryMatch = query
      ? [
          project.name,
          project.tagline,
          project.description,
          project.owner.fullName,
          project.owner.username,
          project.projectTags.join(" "),
          project.helpTags.join(" "),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)
      : true

    return categoryMatch && queryMatch
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-border bg-muted/40 p-8">
        <h1 className="font-serif text-5xl sm:text-6xl tracking-tight">Browse the directory</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Every listing here has already gone through review. Search by builder, product, category, or project topic.
        </p>

        <form className="mt-8 flex flex-col gap-4 lg:flex-row">
          <input
            type="search"
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Search projects, builders, or tags like e-commerce"
            className="min-h-12 flex-1 rounded-2xl border border-border bg-background px-4"
          />
          <select
            name="category"
            defaultValue={selectedCategory}
            className="min-h-12 rounded-2xl border border-border bg-background px-4"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button className="min-h-12 rounded-2xl bg-foreground px-5 text-sm font-semibold text-background">
            Apply filters
          </button>
        </form>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/browse?category=${encodeURIComponent(category)}`}
              className="rounded-full border border-border px-4 py-2 text-sm hover:bg-background"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredProjects.length} of {allProjects.length} approved projects
        </p>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 ? (
        <div className="mt-10 rounded-[2rem] border border-dashed border-border px-6 py-12 text-center text-muted-foreground">
          No approved projects matched that filter.
        </div>
      ) : null}
    </div>
  )
}
