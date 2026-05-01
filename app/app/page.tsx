import Link from "next/link"
import { getFeaturedProjects } from "@/lib/data"
import { ProjectCard } from "@/components/project-card"
import { HelpWantedBadges } from "@/components/help-wanted-badges"
import { LandscapeReveal } from "@/components/landscape-reveal"
import { startNewSubmissionAction } from "@/app/actions"
import { HeroSearchRotator } from "@/components/hero-search-rotator"
import { FallingHelpTags } from "@/components/falling-help-tags"
import { presetProjectTags } from "@/lib/constants"

export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects()
  const searchPromptWords = ["landing page", "e-commerce", "marketplace", "portfolio", "saas", "workflow"]
  const popularTags = presetProjectTags.slice(0, 6)
  const heroDiscoveryTags = ["New this week", "Approved", "Design help", "Agent tools"]
  const heroMiniCards = [
    { title: "Vibecode", category: "Idea", tone: "from-[#132b56] via-[#2b7fff] to-[#8ed1ff]" },
    { title: "Build", category: "Creation", tone: "from-[#2f3552] via-[#5e7cff] to-[#d6e3ff]" },
    { title: "Publish", category: "Business", tone: "from-[#11344a] via-[#1e7eb2] to-[#b9ebff]" },
  ]
  return (
    <div className="flex flex-col">
      <section className="overflow-hidden border-b border-border bg-[radial-gradient(circle_at_top_left,_rgba(109,182,255,0.22),_transparent_28%),radial-gradient(circle_at_80%_15%,_rgba(186,227,255,0.3),_transparent_24%),linear-gradient(180deg,_#f8fcff_0%,_#ffffff_62%)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div className="flex flex-col">
              <h1 className="mt-6 max-w-3xl font-serif text-5xl leading-[0.94] sm:text-6xl lg:text-[4.6rem]">
                Vibecoding Marketplace for Vibecoded projects.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
                Create, share, collaborate and discover Vibecoded projects.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/browse"
                  className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-[0_20px_40px_-24px_rgba(15,23,42,0.7)]"
                >
                  Browse projects
                </Link>
                <form action={startNewSubmissionAction}>
                  <button className="rounded-full border border-border bg-background/80 px-6 py-3 text-sm font-semibold hover:bg-muted transition-colors">
                    Submit a project
                  </button>
                </form>
              </div>
            </div>

            <div className="flex flex-col gap-5 lg:justify-self-end lg:self-start">
              <div className="relative">
                <div className="hero-orb absolute left-10 top-8 h-20 w-20 rounded-full bg-[#5ea8ff]/30 blur-2xl" />
                <div className="hero-orb-delayed absolute bottom-14 right-14 h-28 w-28 rounded-full bg-[#b8e4ff]/28 blur-3xl" />
                <video
                  src="/assets/hero.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  aria-label="Vibeblt browse showcase"
                  className="relative mx-auto block w-full rounded-[2.5rem] border border-white/10 shadow-[0_40px_100px_-45px_rgba(15,23,42,0.85)]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {heroMiniCards.map((card) => (
                  <div
                    key={card.title}
                    className={`group relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br ${card.tone} p-4 shadow-[0_18px_40px_-26px_rgba(15,23,42,0.45)]`}
                  >
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/75">
                      {card.category}
                    </p>
                    <p className="mt-2 font-serif text-lg text-white">{card.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 rounded-[2rem] border border-[#d4e4f2] bg-[linear-gradient(180deg,#fdfefe_0%,#f2f8fd_100%)] p-4 shadow-[0_30px_80px_-36px_rgba(15,23,42,0.18)]">
            <div className="rounded-[1.5rem] bg-white px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#60758a]">
                  Search by project type
                </p>
                <div className="hidden items-center gap-2 text-xs text-[#7c92a8] sm:flex">
                  {heroDiscoveryTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#dbe9f7] bg-[#f8fbff] px-3 py-1 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <form action={startNewSubmissionAction}>
                  <button
                    className="text-2xl font-semibold leading-none text-[#2b7fff] transition-colors hover:text-[#162033]"
                    aria-label="Start your project submission"
                  >
                    +
                  </button>
                </form>
              </div>

              <form action="/browse" className="mt-4">
                <label className="relative block">
                  <input
                    type="search"
                    name="q"
                    placeholder=""
                    className="peer min-h-16 w-full rounded-2xl border border-[#dbe9f7] bg-[#fbfdff] px-6 pr-36 text-lg font-medium text-[#162033] outline-none transition-colors placeholder:text-[#9bb0c5] focus:border-[#2b7fff]/35 focus:bg-white"
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center text-lg peer-focus:opacity-0">
                    <HeroSearchRotator words={searchPromptWords} />
                  </div>
                  <button className="absolute right-2.5 top-2.5 rounded-full bg-[#162033] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_-20px_rgba(15,23,42,0.7)] transition-colors hover:bg-[#2b7fff]">
                    Search
                  </button>
                </label>
              </form>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 px-2">
              <span className="text-sm font-semibold text-[#60758a]">Popular:</span>
              {popularTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/browse?q=${encodeURIComponent(tag)}`}
                  className="rounded-full border border-[#d4e4f2] bg-white px-3 py-1.5 text-sm text-[#60758a] transition-colors hover:border-[#2b7fff]/30 hover:bg-[#edf5ff] hover:text-[#2b7fff]"
                >
                  {tag.toLowerCase()}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-[linear-gradient(180deg,#ffffff_0%,#f6fbff_100%)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">Help tags</p>
            <h2 className="mt-3 font-serif text-4xl">
              Vibecoded projects can have flaws — get help and ship with confidence.
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              We created help tags so you can mark where you want extra eyes — security, design, performance, marketing,
              accessibility, pricing, QA — and let the community lift the rough spots into something you're proud to ship.
            </p>

            <FallingHelpTags />

            <div className="mt-8 flex flex-wrap gap-4">
              <form action={startNewSubmissionAction}>
                <button className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-[0_20px_40px_-24px_rgba(15,23,42,0.7)] hover:opacity-90 transition-opacity">
                  Tag your project for help
                </button>
              </form>
              <Link
                href="/dashboard"
                className="rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold hover:bg-muted"
              >
                Update an existing submission
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2.75rem] bg-[radial-gradient(circle_at_top_right,_rgba(43,127,255,0.18),_transparent_60%)] blur-2xl" />

            <div className="rounded-[2rem] border border-[#dbe9f7] bg-white p-5 shadow-[0_28px_70px_-32px_rgba(15,23,42,0.28)]">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7c92a8]">Live listing preview</p>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#cdebd9] bg-[#e7f7ee] px-3 py-1 text-xs font-semibold text-[#1f7a47]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1f7a47]/60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1f7a47]" />
                  </span>
                  Approved
                </span>
              </div>

              <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-[#e3edf8] bg-[#f4f8fd]">
                <div className="relative h-44 bg-[linear-gradient(135deg,#e8f0fb_0%,#dee9fb_45%,#f6e9ff_100%)]">
                  <div className="absolute inset-x-6 top-6 h-3 rounded-full bg-white/70" />
                  <div className="absolute inset-x-6 top-12 h-3 w-2/3 rounded-full bg-white/55" />
                  <div className="absolute bottom-6 left-6 h-16 w-24 rounded-2xl bg-white/80 shadow-[0_12px_28px_-18px_rgba(15,23,42,0.35)]" />
                  <div className="absolute bottom-6 right-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2b7fff]/15">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#2b7fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
                      <path d="M12 2 4 7v10l8 5 8-5V7l-8-5Z" />
                      <path d="m4 7 8 5 8-5M12 22V12" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mt-5 px-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-serif text-xl text-[#162033]">Lumen Studio</p>
                    <p className="mt-1 text-sm text-[#5d7994]">A focus timer that adapts to how you actually work.</p>
                  </div>
                  <span className="rounded-full border border-[#dbe9f7] bg-[#f8fbff] px-3 py-1 text-xs font-semibold text-[#5d7994]">
                    Productivity
                  </span>
                </div>

                <div className="mt-5 rounded-2xl border border-[#dbe9f7] bg-[#fbfdff] p-4">
                  <HelpWantedBadges tags={["Design", "Performance"]} />
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-[#7c92a8]">
              That row of tags is what reviewers see — and where they reply.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Featured projects</p>
            <h2 className="mt-2 font-serif text-4xl">Projects ready for feedback right below the fold</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Real projects, real builders, and listings that make it easy to browse, try, and start a useful conversation.
            </p>
          </div>
          <Link href="/browse" className="text-sm font-semibold text-muted-foreground hover:text-foreground">
            View all
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} variant="compact" redirectTo="/" />
          ))}
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <LandscapeReveal
          className="mx-auto min-h-[420px] max-w-6xl rounded-[1.75rem] border border-[#d6e4ef] shadow-[0_34px_90px_-52px_rgba(15,23,42,0.42)] lg:min-h-[500px]"
          scene={
            <>
              <img
                src="/assets/prefooter-landscape.png"
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08)_0%,rgba(15,23,42,0.16)_48%,rgba(15,23,42,0.28)_100%)]" />
            </>
          }
          cta={
            <div className="mx-auto flex min-h-[420px] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center lg:min-h-[500px]">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white [text-shadow:0_2px_10px_rgba(15,23,42,0.46)]">
                Get on the map
              </p>
              <h2 className="mt-4 font-serif text-4xl text-white sm:text-5xl lg:text-6xl [text-shadow:0_4px_24px_rgba(15,23,42,0.58)]">
                Your ideas are worth sharing.
              </h2>
              <p className="mt-5 max-w-xl text-lg text-white/95 [text-shadow:0_2px_14px_rgba(15,23,42,0.5)]">
                Sign up for Vibeblt to share your vibecoded projects with the world and find people ready to build alongside you.
              </p>
              <Link
                href="/auth/signup"
                className="mt-9 rounded-full bg-white px-8 py-4 text-base font-semibold text-[#162033] shadow-[0_24px_60px_-20px_rgba(15,23,42,0.55)] transition-colors hover:bg-[#162033] hover:text-white"
              >
                Sign up for Vibeblt
              </Link>
            </div>
          }
        />
      </section>

    </div>
  )
}
