import Link from "next/link"

export default function NotFound() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Page not found</p>
      <h1 className="mt-4 font-serif text-6xl leading-none">Nothing is here.</h1>
      <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
        The page you were looking for does not exist or may have moved. You can jump back into the directory or submit a project from here.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link href="/" className="rounded-full border border-border px-5 py-3 text-sm font-semibold hover:bg-muted">
          Go home
        </Link>
        <Link href="/browse" className="rounded-full border border-border px-5 py-3 text-sm font-semibold hover:bg-muted">
          Browse projects
        </Link>
        <Link href="/submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background">
          Submit your project
        </Link>
      </div>
    </div>
  )
}
