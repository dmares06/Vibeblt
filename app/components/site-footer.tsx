import Link from "next/link"
import { BrandWordmark } from "@/components/brand-wordmark"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-sm text-muted-foreground sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link href="/" aria-label="Vibeblt home" className="transition-opacity hover:opacity-85">
          <BrandWordmark />
        </Link>
        <div className="flex items-center gap-5">
          <Link href="/contact" className="hover:text-foreground">
            Contact
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}
