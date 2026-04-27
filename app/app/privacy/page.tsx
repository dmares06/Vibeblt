export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Privacy</p>
      <h1 className="mt-3 font-serif text-5xl">Privacy Policy</h1>
      <div className="mt-8 space-y-6 text-muted-foreground">
        <p>
          This is a basic placeholder privacy policy for Vibeblt. The site may collect account
          information, project submission details, and technical logs needed to run the service and
          review submitted projects.
        </p>
        <p>
          OAuth providers such as Google and GitHub may share profile data needed to create and manage
          your account. Project information you submit for approval may become public if your submission
          is approved.
        </p>
        <p>
          This draft should be replaced with a fuller reviewed privacy policy before a broader public
          launch.
        </p>
      </div>
    </div>
  )
}
