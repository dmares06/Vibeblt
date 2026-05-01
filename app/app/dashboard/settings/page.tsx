import { redirect } from "next/navigation"
import { getOwnedProjects, getViewer } from "@/lib/data"
import { updateAccountSettingsAction } from "@/app/actions"
import { AvatarUploadField } from "@/components/avatar-upload-field"
import { maxProfileFocusAreaCount, presetOpenToOptions, presetProjectTags } from "@/lib/constants"
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
  const ownedProjects = await getOwnedProjects(viewer.userId)
  const featureableProjects = ownedProjects.filter((project) => project.status === "approved" && project.isLive)
  const selectedFocusAreas = new Set(profile.focusAreas ?? [])
  const selectedOpenTo = new Set(profile.openTo ?? [])

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
        <form action={updateAccountSettingsAction}>
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

              <AvatarUploadField currentAvatarUrl={profile.avatarUrl} fullName={profile.fullName} />

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

            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white uppercase tracking-wider">02</div>
                <h2 className="font-serif text-2xl">Public Profile Highlights</h2>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-semibold px-1">Website URL</span>
                <input
                  name="websiteUrl"
                  type="url"
                  defaultValue={profile.websiteUrl ?? ""}
                  placeholder="https://your-site.com"
                  className="min-h-12 rounded-2xl border border-border bg-background px-4 py-2 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all"
                />
              </label>

              <div className="grid gap-4 rounded-2xl border border-border bg-muted/20 p-4">
                <label className="flex items-start gap-3">
                  <input
                    name="contactEnabled"
                    type="checkbox"
                    defaultChecked={profile.contactEnabled ?? false}
                    className="mt-1 h-4 w-4 rounded border-border"
                  />
                  <span>
                    <span className="block text-sm font-semibold">Show a Get in touch card</span>
                    <span className="mt-1 block text-xs text-muted-foreground">Display a compact contact card under your profile photo.</span>
                  </span>
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold px-1">Public Contact Email</span>
                    <input
                      name="contactEmail"
                      type="email"
                      defaultValue={profile.contactEmail ?? ""}
                      placeholder="hello@example.com"
                      className="min-h-12 rounded-2xl border border-border bg-background px-4 py-2 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold px-1">Contact Note</span>
                    <input
                      name="contactNote"
                      defaultValue={profile.contactNote ?? ""}
                      maxLength={90}
                      placeholder="Available for new projects"
                      className="min-h-12 rounded-2xl border border-border bg-background px-4 py-2 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all"
                    />
                  </label>
                </div>
              </div>

              <div className="grid gap-3">
                <div>
                  <p className="text-sm font-semibold px-1">Focus Areas</p>
                  <p className="mt-1 px-1 text-xs text-muted-foreground">Choose up to {maxProfileFocusAreaCount} areas you want to be known for.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {presetProjectTags.map((tag) => (
                    <label key={tag} className="cursor-pointer">
                      <input
                        type="checkbox"
                        name="focusAreas"
                        value={tag}
                        defaultChecked={selectedFocusAreas.has(tag)}
                        className="peer sr-only"
                      />
                      <span className="inline-flex rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors peer-checked:border-blue-200 peer-checked:bg-blue-50 peer-checked:text-blue-700">
                        {tag}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid gap-3">
                <p className="text-sm font-semibold px-1">Open To</p>
                <div className="flex flex-wrap gap-2">
                  {presetOpenToOptions.map((option) => (
                    <label key={option} className="cursor-pointer">
                      <input
                        type="checkbox"
                        name="openTo"
                        value={option}
                        defaultChecked={selectedOpenTo.has(option)}
                        className="peer sr-only"
                      />
                      <span className="inline-flex rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors peer-checked:border-emerald-200 peer-checked:bg-emerald-50 peer-checked:text-emerald-700">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-semibold px-1">Featured Project</span>
                <select
                  name="featuredProjectId"
                  defaultValue={profile.featuredProjectId ?? ""}
                  className="min-h-12 rounded-2xl border border-border bg-background px-4 py-2 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all"
                >
                  <option value="">No featured project</option>
                  {featureableProjects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-muted-foreground px-1">Only live approved projects can be featured.</p>
              </label>
            </section>

            <div className="h-px bg-border/60" />

            {/* Socials */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white uppercase tracking-wider">03</div>
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
