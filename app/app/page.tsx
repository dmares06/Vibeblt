import Link from "next/link"
import { getFeaturedProjects } from "@/lib/data"
import { ProjectCard } from "@/components/project-card"
import { startNewSubmissionAction } from "@/app/actions"
import { HeroSearchRotator } from "@/components/hero-search-rotator"
import { presetProjectTags } from "@/lib/constants"

export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects()
  const helpExamples = ["Security", "Design", "App Store Submission", "Collab", "Accessibility"]
  const searchPromptWords = ["landing page", "e-commerce", "marketplace", "portfolio", "saas", "workflow"]
  const popularTags = presetProjectTags.slice(0, 6)
  const heroDiscoveryTags = ["New this week", "Approved", "Design help", "Agent tools"]
  const heroMiniCards = [
    { title: "OrbitKit", category: "AI Agents", tone: "from-[#132b56] via-[#2b7fff] to-[#8ed1ff]" },
    { title: "Frameflow", category: "Design", tone: "from-[#2f3552] via-[#5e7cff] to-[#d6e3ff]" },
    { title: "SignalOS", category: "Productivity", tone: "from-[#11344a] via-[#1e7eb2] to-[#b9ebff]" },
  ]
  const workflowSteps = [
    {
      label: "Share project info",
      text: "Start the listing with the project name, tagline, category, description, and live public URL.",
    },
    {
      label: "Upload images",
      text: "Add the thumbnail and supporting screenshots that will carry the listing visually.",
    },
    {
      label: "Submit for review",
      text: "Send the finished submission into the moderation queue once the details and assets are complete.",
    },
    {
      label: "Go live",
      text: "Once approved, publish the project to make it appear publicly in browse, on the project page, and on the builder profile.",
    },
  ]

  return (
    <div className="flex flex-col">
      <section className="overflow-hidden border-b border-border bg-[radial-gradient(circle_at_top_left,_rgba(109,182,255,0.22),_transparent_28%),radial-gradient(circle_at_80%_15%,_rgba(186,227,255,0.3),_transparent_24%),linear-gradient(180deg,_#f8fcff_0%,_#ffffff_62%)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[0.84fr_1.16fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                Discover and submit AI-built products
              </p>
              <h1 className="mt-6 max-w-3xl font-serif text-5xl leading-[0.94] sm:text-6xl lg:text-[4.6rem]">
                A place vibecoding calls home.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
                Launch and gain insights to improve or show off your vibecoded projects.
              </p>

              <div className="mt-7 rounded-[1.75rem] border border-[#d4e4f2] bg-[linear-gradient(180deg,#fdfefe_0%,#f2f8fd_100%)] p-3 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.14)]">
                <div className="rounded-[1.25rem] bg-white px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-[#60758a]">Search by project type</p>
                    </div>
                    <form action={startNewSubmissionAction}>
                      <button
                        className="text-xl font-semibold leading-none text-[#2b7fff] transition-colors hover:text-[#162033]"
                        aria-label="Start your project submission"
                      >
                        +
                      </button>
                    </form>
                  </div>

                  <form action="/browse" className="mt-3">
                    <label className="relative block">
                      <input
                        type="search"
                        name="q"
                        placeholder=""
                        className="peer min-h-12 w-full rounded-2xl border border-[#dbe9f7] bg-[#fbfdff] px-4 pr-28 text-base font-medium text-[#162033] outline-none transition-colors placeholder:text-[#9bb0c5] focus:border-[#2b7fff]/35 focus:bg-white"
                      />
                      <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center peer-focus:opacity-0">
                        <HeroSearchRotator words={searchPromptWords} />
                      </div>
                      <button className="absolute right-2 top-2 rounded-full bg-[#162033] px-4 py-2 text-sm font-semibold text-white shadow-[0_16px_30px_-20px_rgba(15,23,42,0.7)] transition-colors hover:bg-[#2b7fff]">
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

            <div className="relative lg:justify-self-end">
              <div className="hero-orb absolute left-10 top-8 h-20 w-20 rounded-full bg-[#5ea8ff]/30 blur-2xl" />
              <div className="hero-orb-delayed absolute bottom-14 right-14 h-28 w-28 rounded-full bg-[#b8e4ff]/28 blur-3xl" />
              <div className="relative mx-auto w-full max-w-[46rem] overflow-hidden rounded-[2.5rem] border border-white/10 bg-[linear-gradient(180deg,#13131a_0%,#1b1b24_55%,#24273a_100%)] p-4 text-white shadow-[0_40px_100px_-45px_rgba(15,23,42,0.85)] sm:p-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.09),_transparent_35%)]" />
                <div className="relative flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-sm">
                    <p className="text-xs uppercase tracking-[0.26em] text-white/50">Product discovery</p>
                    <p className="mt-2 text-xl font-semibold sm:text-2xl">A polished home for approved projects</p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
                    Curated browse view
                  </div>
                </div>

                <div className="relative mt-4 overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 p-2 backdrop-blur-sm sm:p-2.5">
                  <div className="rounded-[1.55rem] border border-white/10 bg-[#f8fbff] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:p-2.5">
                    <div className="flex items-center justify-between rounded-[1rem] bg-white px-3 py-2.5 text-slate-500 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.25)] sm:px-4 sm:py-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#8cc6ff]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#bce2ff]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#dff1ff]" />
                      </div>
                      <div className="rounded-full bg-[#eef6ff] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#53728f] sm:text-[11px] sm:tracking-[0.18em]">
                        Vibeblt Browse
                      </div>
                    </div>

                    <div className="relative mt-2.5 aspect-[1.16/1] overflow-hidden rounded-[1.45rem] border border-[#dbe9f7] bg-[linear-gradient(180deg,#fcfeff_0%,#f4f9ff_100%)] p-3 shadow-[0_28px_60px_-40px_rgba(15,23,42,0.38)] sm:p-4">
                      <div className="hero-showcase-spotlight absolute inset-x-[14%] top-0 h-28 rounded-full bg-[radial-gradient(circle,_rgba(104,174,255,0.18),_transparent_68%)] blur-2xl" />

                      <div className="relative flex flex-wrap items-center justify-between gap-3 rounded-[1.15rem] border border-[#dbe9f7] bg-white/90 px-4 py-3">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7c92a8]">Browse approved launches</p>
                          <p className="mt-1 text-base font-semibold text-[#162033]">Fresh work from builders shipping in public</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {heroDiscoveryTags.map((tag, index) => (
                            <span
                              key={tag}
                              className={`hero-showcase-chip rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                                index === 1
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : "border-[#dbe9f7] bg-[#f7fbff] text-[#5d7994]"
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="relative mt-3 grid gap-3 lg:grid-cols-[0.92fr_1.08fr]">
                        <div className="grid gap-3">
                          {heroMiniCards.map((card, index) => (
                            <div
                              key={card.title}
                              className={`hero-showcase-card rounded-[1.2rem] border border-[#dbe9f7] bg-white p-3 shadow-[0_20px_36px_-30px_rgba(15,23,42,0.24)] ${
                                index === 1 ? "hero-showcase-card-delayed" : ""
                              }`}
                            >
                              <div className={`h-24 rounded-[0.95rem] bg-gradient-to-br ${card.tone}`} />
                              <div className="mt-3 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8ba0b5]">
                                <span>{card.category}</span>
                                <span>Approved</span>
                              </div>
                              <p className="mt-2 text-base font-semibold text-[#162033]">{card.title}</p>
                              <p className="mt-1 text-sm text-[#5d7994]">Polished listing, clear story, live link ready.</p>
                            </div>
                          ))}
                        </div>

                        <div className="hero-showcase-card hero-showcase-card-focus rounded-[1.45rem] border border-[#dbe9f7] bg-white p-4 shadow-[0_28px_60px_-34px_rgba(15,23,42,0.28)]">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7c92a8]">Featured listing</p>
                              <p className="mt-1 text-xl font-semibold text-[#162033]">Northstar Studio</p>
                            </div>
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                              Published
                            </span>
                          </div>

                          <div className="mt-4 overflow-hidden rounded-[1.2rem] border border-[#dbe9f7] bg-[#eef6ff]">
                            <div className="aspect-[4/3] bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.28),transparent_22%),linear-gradient(135deg,#0d2347_0%,#2b7fff_38%,#9ad8ff_100%)]" />
                          </div>

                          <div className="mt-4 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8ba0b5]">
                            <span>Design</span>
                            <span>Rev 4</span>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-[#5d7994]">
                            A crisp public listing with a strong visual, clear metadata, and enough polish to feel worth clicking.
                          </p>

                          <div className="mt-4 grid grid-cols-3 gap-2">
                            <div className="rounded-[0.95rem] border border-[#dbe9f7] bg-[#f8fbff] px-3 py-3">
                              <p className="text-[10px] uppercase tracking-[0.16em] text-[#91a3b6]">Views</p>
                              <p className="mt-1 text-sm font-semibold text-[#162033]">1.8k</p>
                            </div>
                            <div className="rounded-[0.95rem] border border-[#dbe9f7] bg-[#f8fbff] px-3 py-3">
                              <p className="text-[10px] uppercase tracking-[0.16em] text-[#91a3b6]">Saves</p>
                              <p className="mt-1 text-sm font-semibold text-[#162033]">312</p>
                            </div>
                            <div className="rounded-[0.95rem] border border-[#dbe9f7] bg-[#f8fbff] px-3 py-3">
                              <p className="text-[10px] uppercase tracking-[0.16em] text-[#91a3b6]">Help tags</p>
                              <p className="mt-1 text-sm font-semibold text-[#162033]">2 open</p>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between border-t border-[#dbe9f7] pt-4 text-sm">
                            <div className="flex items-center gap-2 text-[#5d7994]">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#edf5ff] font-semibold text-[#2b7fff]">N</div>
                              <span className="font-medium">@northstar</span>
                            </div>
                            <span className="rounded-full border border-[#dbe9f7] px-3 py-1.5 font-medium text-[#162033]">View listing</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[2rem] border border-border bg-[linear-gradient(90deg,rgba(244,249,255,1)_0%,rgba(250,253,255,1)_100%)] p-4 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.22)]">
            <div className="grid gap-4 lg:grid-cols-[auto_1fr] lg:items-center">
              <div className="rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold">
                Discover → Approve → Publish → Grow
              </div>
              <p className="text-sm text-muted-foreground">
                Vibeblt is designed to look editorial, not accidental: approved projects land in a curated browse experience that feels ready for discovery on day one.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-[linear-gradient(180deg,#ffffff_0%,#f6fbff_100%)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">Help wanted</p>
            <h2 className="mt-3 font-serif text-4xl">Ask for help without hiding the project.</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Builders can mark where they want extra eyes, whether that means security advice, design polish,
              app-store submission help, or a collaborator who wants to jump in.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {helpExamples.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#dbe9f7] bg-white px-4 py-2 text-sm font-semibold text-[#2b7fff] shadow-[0_10px_30px_-22px_rgba(43,127,255,0.38)]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
              If the preset tags do not cover the need, builders can type their own custom tag during submission or while editing a live project.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <form action={startNewSubmissionAction}>
                <button className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-[0_20px_40px_-24px_rgba(15,23,42,0.7)] hover:opacity-90 transition-opacity">
                  Add help tags to a project
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

          <div className="rounded-[2rem] border border-[#dbe9f7] bg-white p-6 shadow-[0_28px_70px_-42px_rgba(15,23,42,0.24)]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7c92a8]">How it works</p>
            <div className="mt-5 grid gap-4">
              <div className="rounded-[1.5rem] border border-[#dbe9f7] bg-[#f8fbff] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7c92a8]">1. Select the need</p>
                <p className="mt-2 text-sm text-[#5d7994]">Choose one or more help-wanted tags while creating or editing the project listing.</p>
              </div>
              <div className="rounded-[1.5rem] border border-[#dbe9f7] bg-[#f8fbff] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7c92a8]">2. Add a custom tag</p>
                <p className="mt-2 text-sm text-[#5d7994]">Type your own tag if the preset list misses the exact kind of input or collaboration you want.</p>
              </div>
              <div className="rounded-[1.5rem] border border-[#dbe9f7] bg-[#f8fbff] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7c92a8]">3. Go public</p>
                <p className="mt-2 text-sm text-[#5d7994]">Once the project is approved, those tags appear on the listing so other builders can spot where help is wanted.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Featured projects</p>
            <h2 className="mt-2 font-serif text-4xl">Projects people can discover right below the fold</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              This is the payoff for the hero: real projects, real builders, and listings that already made it through review.
            </p>
          </div>
          <Link href="/browse" className="text-sm font-semibold text-muted-foreground hover:text-foreground">
            View all
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">How it works for builders</p>
            <h2 className="mt-3 font-serif text-4xl">A clean path from idea to public listing.</h2>
            <p className="mt-4 text-muted-foreground">
              Vibeblt should feel obvious on first contact. The steps below explain the builder journey that turns a finished project into a public listing.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {workflowSteps.map((step, index) => (
              <div key={step.label} className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Step {index + 1}</p>
                <h3 className="mt-3 font-serif text-2xl">{step.label}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
