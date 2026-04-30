import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Use | Vibeblt",
  description: "The rules for using Vibeblt, submitting projects, and joining project conversations.",
}

const updatedAt = "April 30, 2026"

const sections = [
  {
    title: "1. Who Can Use Vibeblt",
    body: [
      "Vibeblt is a discovery and feedback marketplace for AI-built and vibecoded projects. You may browse public listings without an account, but you need to sign in to submit a project, comment, like projects, follow builders, or manage your dashboard.",
      "You are responsible for keeping your account access secure and for making sure the information connected to your profile is accurate.",
    ],
  },
  {
    title: "2. Builder Accounts and Profiles",
    body: [
      "When you sign in with Google or GitHub, Vibeblt creates a builder profile using account information such as your name, email, avatar, and username. You can edit public profile details, including your display name, bio, avatar, Twitter/X URL, and GitHub URL.",
      "Your public builder profile may show your approved projects, profile details, follower count, and other public activity connected to your submissions.",
    ],
  },
  {
    title: "3. Project Submissions",
    body: [
      "When you submit a project, you agree that the listing information is truthful, that you have the right to share the project, and that the live URL, screenshots, thumbnails, descriptions, tech stack, tags, and other submitted materials do not infringe someone else's rights.",
      "Submitted projects may be saved as drafts, sent for review, approved, returned with notes, rejected, removed, or unpublished if they are misleading, low quality, harmful, spammy, illegal, or outside the purpose of Vibeblt.",
      "Approval does not mean Vibeblt endorses the project, guarantees it works, or accepts responsibility for the project owner's claims.",
    ],
  },
  {
    title: "4. Public Content and Feedback",
    body: [
      "Approved listings, builder profiles, comments, replies, project likes, follower counts, and similar engagement may be visible to other users and visitors.",
      "Use project conversations for useful feedback, questions, and collaboration. Do not post harassment, spam, hateful content, misleading claims, private information, malware links, or content that violates another person's rights.",
      "Vibeblt may hide comments, remove listings, limit access, or take other moderation action when needed to protect the quality and safety of the site.",
    ],
  },
  {
    title: "5. Ownership",
    body: [
      "You keep ownership of the projects, screenshots, descriptions, and other materials you submit. By submitting content to Vibeblt, you give Vibeblt permission to host, display, format, promote, and distribute that content as part of operating and marketing the directory.",
      "Do not copy Vibeblt's branding, site design, or platform content in a way that confuses people about who owns or operates the service.",
    ],
  },
  {
    title: "6. Third-Party Services and Links",
    body: [
      "Vibeblt uses third-party services for authentication, hosting, storage, analytics, and infrastructure. Public project listings may also link to third-party sites operated by builders.",
      "Vibeblt is not responsible for third-party websites, products, terms, privacy practices, or content once you leave the Vibeblt site.",
    ],
  },
  {
    title: "7. No Paid Marketplace Yet",
    body: [
      "Vibeblt currently focuses on discovery, submissions, public feedback, likes, follows, and basic builder dashboards. Paid help, escrow, subscriptions, or commercial transactions may be added later under separate or updated terms.",
    ],
  },
  {
    title: "8. Availability and Changes",
    body: [
      "Vibeblt is still evolving. Features may change, break, be removed, or become unavailable. We may update these terms as the product changes, and continued use of Vibeblt after an update means you accept the updated terms.",
    ],
  },
  {
    title: "9. Contact",
    body: [
      "Questions about these terms, a project listing, or a moderation decision can be sent to hello@vibeblt.com.",
    ],
  },
]

export default function TermsPage() {
  return (
    <div className="bg-[linear-gradient(180deg,#f8fcff_0%,#ffffff_38%)]">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#60758a]">Terms of Use</p>
          <h1 className="mt-3 font-serif text-5xl leading-none sm:text-6xl">The rules for building in public on Vibeblt.</h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Vibeblt exists so builders can share AI-built projects, collect useful feedback, and help visitors discover what is actually shipping.
            These terms keep that directory useful, honest, and safe.
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

        <div className="mt-8 rounded-[1.5rem] border border-border bg-muted/30 p-6 text-sm leading-6 text-muted-foreground">
          <p>
            This page is a practical operating policy for Vibeblt and is not a substitute for legal advice. For privacy details, read the{" "}
            <Link href="/privacy" className="font-semibold text-foreground hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
