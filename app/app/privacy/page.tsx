import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy | Vibeblt",
  description: "How Vibeblt collects, uses, shares, and protects information from builders and visitors.",
}

const updatedAt = "April 30, 2026"

const sections = [
  {
    title: "1. What Vibeblt Collects",
    body: [
      "Account information: when you sign in with Google or GitHub, Vibeblt may receive your email address, name, avatar, provider account identifier, and other basic profile details needed to create and secure your account.",
      "Builder profile information: you may add or edit your public name, username, bio, avatar image or avatar URL, Twitter/X URL, GitHub URL, and other public builder details.",
      "Project information: when you submit a project, Vibeblt stores listing details such as project name, tagline, description, live URL, category, tech stack, project tags, help tags, thumbnail, screenshots, review status, review notes, and publication status.",
      "Community activity: Vibeblt stores comments, replies, likes, follows, saved engagement state, project ownership, timestamps, and moderation state so conversations and dashboards work.",
      "Technical information: Vibeblt may receive IP address, browser, device, referral, page activity, cookies, logs, and analytics events from hosting, analytics, authentication, and security tools.",
    ],
  },
  {
    title: "2. What Becomes Public",
    body: [
      "Approved and published projects may be visible to anyone. Public project pages can include your builder profile, project details, screenshots, thumbnail, live URL, tags, comments, like counts, follower counts, and related engagement.",
      "Drafts, projects in review, private dashboard views, account email addresses, and admin review controls are not intended to be public, though no online system can be guaranteed to be perfectly secure.",
    ],
  },
  {
    title: "3. How Vibeblt Uses Information",
    body: [
      "Vibeblt uses information to run authentication, create profiles, accept project submissions, review listings, publish approved projects, support comments and replies, show likes and follows, manage dashboards, prevent abuse, troubleshoot bugs, improve the product, and respond to support requests.",
      "Vibeblt may also use public project and profile content to feature or promote the directory and the builders using it.",
    ],
  },
  {
    title: "4. How Information Is Shared",
    body: [
      "Public content is shared by design when you publish or participate publicly on Vibeblt.",
      "Vibeblt may share information with service providers that help operate the site, including authentication, database, storage, hosting, analytics, email, security, and infrastructure providers. These providers process information on Vibeblt's behalf.",
      "Vibeblt may disclose information if required by law, to protect users or the service, to investigate abuse, or as part of a business transfer such as a merger, acquisition, or sale of assets.",
      "Vibeblt does not sell personal information and does not use submitted project data to run third-party ad targeting.",
    ],
  },
  {
    title: "5. Cookies, OAuth, and Analytics",
    body: [
      "Vibeblt uses cookies and similar technologies to keep you signed in, protect sessions, remember auth state, measure site usage, and understand which pages or features need improvement.",
      "If you use Google or GitHub to sign in, those providers may process information under their own privacy policies. Your live project URLs may also take visitors to third-party sites controlled by the project owner.",
    ],
  },
  {
    title: "6. Storage, Security, and Retention",
    body: [
      "Vibeblt uses reasonable technical and organizational safeguards for account, profile, submission, and engagement data. No method of transmission or storage is completely secure.",
      "Vibeblt keeps information as long as needed to operate the service, maintain public listings, resolve disputes, comply with legal obligations, prevent abuse, and improve the product. If you want your account, profile, or project content removed, contact Vibeblt.",
    ],
  },
  {
    title: "7. Your Choices",
    body: [
      "You can edit your builder profile from settings, manage project drafts and submissions from your dashboard, and choose what project information to submit for review.",
      "You can ask to access, correct, export, or delete account information by contacting hello@vibeblt.com. Some information may need to be retained when required for security, legal, audit, or abuse-prevention reasons.",
    ],
  },
  {
    title: "8. Children",
    body: [
      "Vibeblt is not intended for children under 13, and Vibeblt does not knowingly collect personal information from children under 13. If you believe a child has provided personal information, contact Vibeblt so it can be reviewed and removed where appropriate.",
    ],
  },
  {
    title: "9. Changes",
    body: [
      "Vibeblt may update this policy as the product changes. The updated date at the top of this page will show when the policy was last revised.",
    ],
  },
]

export default function PrivacyPage() {
  return (
    <div className="bg-[linear-gradient(180deg,#f8fcff_0%,#ffffff_38%)]">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#60758a]">Privacy Policy</p>
          <h1 className="mt-3 font-serif text-5xl leading-none sm:text-6xl">How Vibeblt handles builder and project data.</h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Vibeblt is built around public project discovery, reviewed submissions, and feedback from the community.
            This policy explains what information is collected, what becomes public, and how the site uses that information.
          </p>
          <p className="mt-4 text-sm font-medium text-[#60758a]">Last updated: {updatedAt}</p>
        </div>

        <div className="mt-10 grid gap-5">
          {sections.map((section) => (
            <section key={section.title} className="rounded-[1.5rem] border border-[#dbe9f7] bg-white p-6 shadow-[0_18px_46px_-36px_rgba(15,23,42,0.35)]">
              <h2 className="font-serif text-2xl">{section.title}</h2>
              <div className="mt-4 space-y-4 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-8 grid gap-4 rounded-[1.5rem] border border-border bg-muted/30 p-6 text-sm leading-6 text-muted-foreground sm:grid-cols-[1fr_auto] sm:items-center">
          <p>
            Questions or requests about your information can be sent to{" "}
            <a href="mailto:hello@vibeblt.com" className="font-semibold text-foreground hover:underline">
              hello@vibeblt.com
            </a>
            .
          </p>
          <Link href="/terms" className="rounded-full border border-border bg-white px-4 py-2 text-center font-semibold text-foreground hover:bg-muted">
            Read Terms
          </Link>
        </div>
      </div>
    </div>
  )
}
