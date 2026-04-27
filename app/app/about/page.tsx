import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">About Vibeblt</p>
      <h1 className="mt-3 font-serif text-5xl">A curated place for AI-built products.</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5 text-muted-foreground">
          <p>
            Vibeblt is meant to be a clean, focused directory of products built with modern AI-assisted workflows.
            Instead of burying interesting launches in noisy feeds, it gives people one place to browse what builders are actually shipping.
          </p>
          <p>
            For builders, Vibeblt is a simple way to get a live project in front of the right audience. For visitors,
            it is a faster way to discover projects worth trying.
          </p>
          <p>
            Every submission is reviewed before it goes public so the directory stays useful, understandable, and worth coming back to.
          </p>
        </div>
        <div className="rounded-[2rem] border border-border bg-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">What the site is for</p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>Discover live AI-built products.</li>
            <li>Give builders a clean place to showcase what they shipped.</li>
            <li>Keep quality high through review before publication.</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/browse" className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted">
              Browse projects
            </Link>
            <Link href="/submit" className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background">
              Submit your project
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
