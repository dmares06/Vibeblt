export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Contact</p>
      <h1 className="mt-3 font-serif text-5xl">Questions, submissions, or review issues?</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        If you need help with a submission, have a question about review status, or want to reach out about the site,
        use the email below.
      </p>

      <div className="mt-10 rounded-[2rem] border border-border bg-card p-7">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Email</p>
        <a
          href="mailto:hello@vibeblt.com"
          className="mt-4 inline-flex text-2xl font-medium text-foreground hover:underline"
        >
          hello@vibeblt.com
        </a>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Submission support</p>
            <p className="mt-2 text-sm text-muted-foreground">Use this for questions about what qualifies, required assets, or the review process.</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Review questions</p>
            <p className="mt-2 text-sm text-muted-foreground">If your project received change requests and you need clarification, reach out here.</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">General contact</p>
            <p className="mt-2 text-sm text-muted-foreground">For site feedback, partnerships, or general questions about Vibeblt.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
