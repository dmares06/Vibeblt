import Link from "next/link"

export default function PricingPage() {
  const sections = [
    { id: "requirements", label: "Requirements" },
    { id: "visuals", label: "Visuals & Copy" },
    { id: "process", label: "The Review Process" },
    { id: "quality", label: "Quality Bar" },
  ]

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Background Orbs */}
      <div className="pointer-events-none absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-50/50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-slate-50/50 blur-3xl" />

      <div className="grid gap-12 lg:grid-cols-[240px_1fr]">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">On this page</p>
              <nav className="mt-4 flex flex-col gap-3">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {section.label}
                  </a>
                ))}
              </nav>
            </div>
            <div className="rounded-3xl border border-blue-100 bg-blue-50/30 p-5">
              <p className="text-xs font-semibold text-blue-900">Ready to go?</p>
              <p className="mt-2 text-xs leading-relaxed text-blue-800/70">
                If your project meets these guidelines, we'd love to see it.
              </p>
              <Link
                href="/submit"
                className="mt-4 inline-block rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-200 transition-transform hover:-translate-y-0.5"
              >
                Submit Project
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="space-y-16">
          <header>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600/80">Builder Resource</p>
            <h1 className="mt-4 font-serif text-5xl tracking-tight sm:text-6xl">Submission Guidelines</h1>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted-foreground">
              Vibeblt is a curated home for projects built with a "vibe-first" approach. We maintain a quality bar to ensure the directory remains a valuable resource for discovery and inspiration.
            </p>
          </header>

          {/* Requirements Section */}
          <section id="requirements" className="scroll-mt-24">
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">01</div>
              <h2 className="font-serif text-3xl">Minimum Requirements</h2>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="group rounded-[2rem] border border-border bg-card p-8 transition-colors hover:border-blue-200">
                <h3 className="text-lg font-semibold">Technical Basics</h3>
                <ul className="mt-6 space-y-4">
                  {[
                    "Live public URL (no password protection)",
                    "Functional on mobile and desktop",
                    "No broken links or empty states",
                    "SSL certificate enabled (HTTPS)",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="group rounded-[2rem] border border-border bg-card p-8 transition-colors hover:border-blue-200">
                <h3 className="text-lg font-semibold">Project Metadata</h3>
                <ul className="mt-6 space-y-4">
                  {[
                    "Concise, unique project name",
                    "One-sentence punchy tagline",
                    "Accurate category selection",
                    "Primary tech stack listed",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Visuals Section */}
          <section id="visuals" className="scroll-mt-24">
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">02</div>
              <h2 className="font-serif text-3xl">Visuals & Copy</h2>
            </div>
            <p className="mt-4 text-muted-foreground">How your project is presented matters as much as the code.</p>
            
            <div className="mt-8 space-y-6">
              <div className="rounded-[2rem] border border-border bg-card p-8">
                <div className="grid gap-8 md:grid-cols-[200px_1fr]">
                  <div className="aspect-[4/3] rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Thumbnail</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">The Thumbnail (4:3)</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      This is the first thing users see. It should be a high-quality screenshot or a dedicated marketing asset. Avoid cluttered text or low-resolution images.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">Recommended: 1200x900px</span>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">Format: PNG or JPG</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-border bg-card p-8">
                <h3 className="text-lg font-semibold">The Description</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Focus on the "Why" and "How". Explain the core problem you're solving and how your AI implementation makes the experience unique. Keep it structured with paragraphs or lists for readability.
                </p>
              </div>
            </div>
          </section>

          {/* Process Section */}
          <section id="process" className="scroll-mt-24">
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">03</div>
              <h2 className="font-serif text-3xl">The Review Process</h2>
            </div>
            <div className="mt-8 relative border-l-2 border-slate-100 ml-4 pl-8 space-y-12">
              <div className="relative">
                <div className="absolute -left-[41px] top-0 h-4 w-4 rounded-full border-2 border-white bg-blue-500" />
                <h4 className="font-semibold text-slate-900">1. Initial Submission</h4>
                <p className="mt-2 text-sm text-muted-foreground">Your project enters the queue as "Pending". Edits are locked while in this state.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[41px] top-0 h-4 w-4 rounded-full border-2 border-white bg-blue-500" />
                <h4 className="font-semibold text-slate-900">2. Editorial Review</h4>
                <p className="mt-2 text-sm text-muted-foreground">A reviewer checks the URL, visuals, and copy against our quality standards (usually 24-48 hours).</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[41px] top-0 h-4 w-4 rounded-full border-2 border-white bg-blue-500" />
                <h4 className="font-semibold text-slate-900">3. Outcome</h4>
                <p className="mt-2 text-sm text-muted-foreground">Approved projects are marked ready for publish. If changes are requested, you'll receive specific notes to address.</p>
              </div>
            </div>
          </section>

          {/* Quality Section */}
          <section id="quality" className="scroll-mt-24">
            <div className="rounded-[2.5rem] bg-slate-900 p-8 text-white sm:p-12">
              <div className="max-w-2xl">
                <h2 className="font-serif text-3xl sm:text-4xl">The Quality Bar</h2>
                <p className="mt-6 text-lg leading-relaxed text-slate-300">
                  Vibeblt is not an automated directory. Every project is manually vetted. We prioritize:
                </p>
                <div className="mt-10 grid gap-8 sm:grid-cols-2">
                  <div>
                    <p className="font-bold text-blue-400">Innovation</p>
                    <p className="mt-2 text-sm text-slate-400">New ways of interacting with AI or novel use cases for LLMs.</p>
                  </div>
                  <div>
                    <p className="font-bold text-blue-400">Polish</p>
                    <p className="mt-2 text-sm text-slate-400">A clean, focused user experience that feels like a finished product.</p>
                  </div>
                  <div>
                    <p className="font-bold text-blue-400">Utility</p>
                    <p className="mt-2 text-sm text-slate-400">Something that provides immediate value or entertainment to the visitor.</p>
                  </div>
                  <div>
                    <p className="font-bold text-blue-400">Authenticity</p>
                    <p className="mt-2 text-sm text-slate-400">Genuine projects with a clear "vibe" and builder behind them.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <footer className="pt-8 text-center border-t border-border">
            <p className="text-sm text-muted-foreground">
              Questions? Contact us at <a href="mailto:hello@vibeblt.com" className="text-blue-600 font-medium">hello@vibeblt.com</a>
            </p>
          </footer>
        </main>
      </div>
    </div>
  )
}
