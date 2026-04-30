import { redirect } from "next/navigation"
import { getViewer } from "@/lib/data"
import { updateAccountSettingsAction } from "@/app/actions"
import Link from "next/link"

interface SettingsPageProps {
  searchParams: Promise<{
    saved?: string
  }>
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const viewer = await getViewer()
  const params = await searchParams

  if (!viewer) {
    redirect("/auth/login?next=/dashboard/settings")
  }

  const { profile } = viewer

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-serif text-4xl">Account Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your public builder profile and account details.</p>
      </header>

      {params.saved === "1" && (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Your profile has been successfully updated.
        </div>
      )}

      <div className="rounded-[2.5rem] border border-border bg-card shadow-sm overflow-hidden">
        <form action={updateAccountSettingsAction} encType="multipart/form-data">
          <div className="p-8 sm:p-10 space-y-8">
            {/* General Info */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white uppercase tracking-wider">01</div>
                <h2 className="font-serif text-2xl">General Profile</h2>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold px-1">Full Name</span>
                  <input
                    name="fullName"
                    defaultValue={profile.fullName}
                    placeholder="Your public name"
                    className="min-h-12 rounded-2xl border border-border bg-background px-4 py-2 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold px-1">Username</span>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                    <input
                      name="username"
                      defaultValue={profile.username}
                      placeholder="handle"
                      className="min-h-12 w-full rounded-2xl border border-border bg-background pl-8 pr-4 py-2 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all"
                      required
                    />
                  </div>
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-semibold px-1">Short Bio</span>
                <textarea
                  name="bio"
                  defaultValue={profile.bio ?? ""}
                  rows={4}
                  placeholder="Tell the community about yourself and what you're building..."
                  className="rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold px-1">Avatar Image</span>
                <input
                  name="avatarFile"
                  type="file"
                  accept="image/*"
                  className="rounded-2xl border border-dashed border-border bg-background px-4 py-3 text-sm"
                />
                {profile.avatarUrl ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/30 p-3">
                    <span className="h-14 w-14 overflow-hidden rounded-full bg-muted">
                      <img src={profile.avatarUrl} alt={profile.fullName} className="h-full w-full object-cover" />
                    </span>
                    <span className="text-xs text-muted-foreground">Current avatar. Choose a new image to replace it.</span>
                  </div>
                ) : null}
                <p className="text-[11px] text-muted-foreground px-1">Upload a square image up to 5 MB.</p>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold px-1">Avatar URL</span>
                <input
                  name="avatarUrl"
                  type="url"
                  defaultValue={profile.avatarUrl ?? ""}
                  placeholder="https://example.com/avatar.jpg"
                  className="min-h-12 rounded-2xl border border-border bg-background px-4 py-2 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all"
                />
                <p className="text-[11px] text-muted-foreground px-1">Optional fallback. A selected image upload replaces this URL.</p>
              </label>
            </section>

            <div className="h-px bg-border/60" />

            {/* Socials */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white uppercase tracking-wider">02</div>
                <h2 className="font-serif text-2xl">Social Connections</h2>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold px-1">Twitter / X URL</span>
                  <input
                    name="twitterUrl"
                    type="url"
                    defaultValue={profile.twitterUrl ?? ""}
                    placeholder="https://twitter.com/yourhandle"
                    className="min-h-12 rounded-2xl border border-border bg-background px-4 py-2 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold px-1">GitHub URL</span>
                  <input
                    name="githubUrl"
                    type="url"
                    defaultValue={profile.githubUrl ?? ""}
                    placeholder="https://github.com/yourhandle"
                    className="min-h-12 rounded-2xl border border-border bg-background px-4 py-2 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all"
                  />
                </label>
              </div>
            </section>
          </div>

          <div className="flex items-center justify-between border-t border-border bg-muted/30 px-8 py-6 sm:px-10">
            <Link
              href={`/builder/${profile.username}`}
              target="_blank"
              className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              View Public Profile
            </Link>
            <button
              type="submit"
              className="rounded-full bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 transition-all hover:bg-blue-700 hover:shadow-blue-200 active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-[2rem] border border-red-100 bg-red-50/30 p-8 sm:p-10">
        <h3 className="text-lg font-bold text-red-900 font-serif">Danger Zone</h3>
        <p className="mt-2 text-sm text-red-800/70 max-w-xl">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button className="mt-6 rounded-full border border-red-200 bg-white px-6 py-2.5 text-xs font-bold text-red-600 shadow-sm transition-colors hover:bg-red-50">
          Delete Account
        </button>
      </div>
    </div>
  )
}
