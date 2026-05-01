import { createContactEmailAction } from "@/app/actions"

type ContactPageProps = {
  searchParams: Promise<{
    sent?: string
    error?: string
  }>
}

const contactErrors: Record<string, string> = {
  "invalid-email": "Add a valid email address.",
  "missing-message": "Add a message before sending.",
  "subject-too-long": "Keep the subject under 120 characters.",
  "message-too-long": "Keep the message under 3,000 characters.",
  "email-not-configured": "Contact email is not configured yet.",
  "smtp-auth-failed": "Gmail rejected the SMTP login. Check the Gmail address and app password.",
  "smtp-connection-failed": "The server could not connect to Gmail SMTP.",
  "send-failed": "The message could not be sent. Try again in a moment.",
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams
  const errorMessage = params.error ? contactErrors[params.error] ?? contactErrors["send-failed"] : null

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Contact</p>
      <h1 className="mt-3 font-serif text-5xl">Questions, submissions, or review issues?</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        If you need help with a submission, have a question about review status, or want to reach out about the site,
        send a note here.
      </p>

      <div className="mt-10 rounded-[2rem] border border-border bg-card p-7">
        {params.sent === "1" ? (
          <div className="mb-6 rounded-2xl border border-[#cdebd9] bg-[#e7f7ee] px-4 py-3 text-sm font-medium text-[#1f7a47]">
            Message sent. I will get back to you soon.
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <form action={createContactEmailAction} className="grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-foreground">Your email</span>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="min-h-12 rounded-2xl border border-border bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[#2b7fff]/45"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-foreground">Subject</span>
            <input
              type="text"
              name="subject"
              required
              maxLength={120}
              placeholder="Question about my submission"
              className="min-h-12 rounded-2xl border border-border bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[#2b7fff]/45"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-foreground">Message</span>
            <textarea
              name="message"
              required
              maxLength={3000}
              rows={7}
              placeholder="Tell me what you need help with."
              className="min-h-40 rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[#2b7fff]/45"
            />
          </label>

          <div>
            <button className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90">
              Send message
            </button>
          </div>
        </form>

        <div className="mt-10 grid gap-5 border-t border-border pt-8 md:grid-cols-3">
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
