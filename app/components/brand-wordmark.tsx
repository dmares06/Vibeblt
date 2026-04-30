import type { ComponentPropsWithoutRef } from "react"

type BrandWordmarkProps = ComponentPropsWithoutRef<"span"> & {
  markOnly?: boolean
}

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-block overflow-hidden bg-[#f8f8f6] ${className}`}
    >
      <img
        src="/assets/vibeblt-logo.svg"
        alt=""
        className="absolute left-1/2 top-1/2 h-[190%] w-[190%] max-w-none -translate-x-1/2 -translate-y-[42%] object-contain"
      />
    </span>
  )
}

export function BrandWordmark({ className = "", markOnly = false, ...props }: BrandWordmarkProps) {
  if (markOnly) {
    return (
      <span className={`inline-flex items-center ${className}`} {...props}>
        <BrandMark className="h-14 w-14" />
        <span className="sr-only">Vibeblt</span>
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center gap-2 align-middle ${className}`} {...props}>
      <BrandMark className="h-12 w-12 shrink-0" />
      <span className="font-serif text-[1.45rem] leading-none tracking-tight text-[#162033]">
        <span className="text-[#0b45d6]">V</span>ibe<span className="text-[#0b45d6]">B</span>lt
      </span>
    </span>
  )
}
