import Link from "next/link"
import { redirect } from "next/navigation"
import { getViewer } from "@/lib/data"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const viewer = await getViewer()

  if (!viewer) {
    redirect("/auth/login?next=/dashboard")
  }

  const navItems = [
    {
      label: "My Projects",
      href: "/dashboard",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
      )
    },
    {
      label: "Liked Projects",
      href: "/dashboard/liked",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
      )
    },
    {
      label: "Following",
      href: "/dashboard/following",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>
      )
    },
    {
      label: "Account Settings",
      href: "/dashboard/settings",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
      )
    },
  ]

  const adminNavItems = viewer.profile.isAdmin ? [
    {
      label: "Review Queue",
      href: "/admin",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
      )
    }
  ] : []

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside>
          <div className="sticky top-24 space-y-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 px-4">Dashboard</p>
              <nav className="mt-4 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {adminNavItems.length > 0 && (
              <>
                <div className="h-px bg-border/60 mx-4" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 px-4">Admin</p>
                  <nav className="mt-4 flex flex-col gap-1">
                    {adminNavItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-blue-600 transition-colors hover:bg-blue-50"
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </>
            )}

            <div className="h-px bg-border/60 mx-4" />

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 px-4">Public View</p>
              <nav className="mt-4 flex flex-col gap-1">
                <Link
                  href={`/builder/${viewer.profile.username}`}
                  target="_blank"
                  className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground group"
                >
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Public Profile
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                </Link>
              </nav>
            </div>

            <div className="rounded-3xl border border-blue-100 bg-blue-50/30 p-5">
              <p className="text-xs font-semibold text-blue-900">Need help?</p>
              <p className="mt-2 text-[11px] leading-relaxed text-blue-800/70">
                Check our <Link href="/pricing" className="underline hover:text-blue-900">submission guidelines</Link> for tips on getting approved.
              </p>
            </div>
          </div>
        </aside>

        <main>
          {children}
        </main>
      </div>
    </div>
  )
}
