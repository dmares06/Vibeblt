import { redirect } from "next/navigation"
import { BuilderProfileCard } from "@/components/builder-profile-card"
import { getFollowedCreatorsForViewer, getViewer } from "@/lib/data"

export default async function FollowingPage() {
  const viewer = await getViewer()

  if (!viewer) {
    redirect("/auth/login?next=/dashboard/following")
  }

  const builders = await getFollowedCreatorsForViewer(viewer.userId)

  return (
    <div className="space-y-10">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">Builder network</p>
        <h1 className="mt-3 font-serif text-5xl">Following</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Keep track of creators whose projects and updates you want to come back to.
        </p>
      </header>

      {builders.length > 0 ? (
        <div className="grid gap-6 xl:grid-cols-2">
          {builders.map((builder) => (
            <BuilderProfileCard
              key={builder.id}
              builder={builder}
              viewerId={viewer.userId}
              redirectTo="/dashboard/following"
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-border px-6 py-14 text-center text-muted-foreground">
          You are not following any creators yet.
        </div>
      )}
    </div>
  )
}
