import Link from "next/link"
import { getViewer } from "@/lib/data"
import { signOutAction, startNewSubmissionAction } from "@/app/actions"
import { UserDropdown } from "@/components/user-dropdown"
import { BrandWordmark } from "@/components/brand-wordmark"

export async function SiteHeader() {
  const viewer = await getViewer()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" aria-label="Vibeblt home" className="transition-opacity hover:opacity-85">
            <BrandWordmark />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <Link href="/browse" className="hover:text-foreground transition-colors">
              Browse
            </Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">
              Submission Guidelines
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {viewer ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-[#2b7fff]/40 hover:bg-[#edf5ff] hover:text-[#2b7fff]"
              >
                Dashboard
              </Link>
              <UserDropdown
                profile={viewer.profile}
                signOutAction={signOutAction}
                startNewSubmissionAction={startNewSubmissionAction}
              />
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors px-2"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background hover:opacity-90 transition-opacity"
              >
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
