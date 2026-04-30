"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { presetHelpTags } from "@/lib/constants"

type HelpTagVisual = {
  tone: string
  iconBg: string
  iconColor: string
  icon: ReactNode
}

const helpTagVisuals: Record<string, HelpTagVisual> = {
  Security: {
    tone: "border-[#dde7ff] bg-[#eef3ff] text-[#3f5bd9]",
    iconBg: "bg-[#dbe5ff]",
    iconColor: "text-[#3f5bd9]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  Design: {
    tone: "border-[#ecd9ff] bg-[#f5edff] text-[#7a3fd9]",
    iconBg: "bg-[#e7d5ff]",
    iconColor: "text-[#7a3fd9]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M12 3v3M5.6 5.6l2.1 2.1M3 12h3M5.6 18.4l2.1-2.1M12 21v-3M18.4 18.4l-2.1-2.1M21 12h-3M18.4 5.6l-2.1 2.1" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  "App Store Submission": {
    tone: "border-[#ffe2c7] bg-[#fff3e3] text-[#a85a16]",
    iconBg: "bg-[#ffe0c2]",
    iconColor: "text-[#a85a16]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M12 2 4 7v10l8 5 8-5V7l-8-5Z" />
        <path d="m4 7 8 5 8-5M12 22V12" />
      </svg>
    ),
  },
  Collab: {
    tone: "border-[#cdebd9] bg-[#e7f7ee] text-[#1f7a47]",
    iconBg: "bg-[#cdebd9]",
    iconColor: "text-[#1f7a47]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="10" r="2.4" />
        <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5M14.5 19c.4-2 2-3.4 4-3.4 1.6 0 3 .9 3.5 2.4" />
      </svg>
    ),
  },
  Performance: {
    tone: "border-[#ffd9d2] bg-[#ffe9e3] text-[#c0432a]",
    iconBg: "bg-[#ffd2c4]",
    iconColor: "text-[#c0432a]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
      </svg>
    ),
  },
  Growth: {
    tone: "border-[#cfe9d8] bg-[#e3f4ea] text-[#1d6f47]",
    iconBg: "bg-[#cce6d6]",
    iconColor: "text-[#1d6f47]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M3 17 9 11l4 4 8-8" />
        <path d="M14 7h7v7" />
      </svg>
    ),
  },
  "Product Feedback": {
    tone: "border-[#cfe6f5] bg-[#e3f1fb] text-[#1f6ea3]",
    iconBg: "bg-[#cfe1f0]",
    iconColor: "text-[#1f6ea3]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M21 12a8 8 0 1 1-3.5-6.6L21 4v5h-5" />
        <path d="M8 12h8M8 15h5" />
      </svg>
    ),
  },
}

export function FallingHelpTags() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "0px 0px -18% 0px", threshold: 0.25 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`mt-7 flex flex-wrap gap-3 help-tags-fall-zone ${visible ? "help-tags-fall-zone-visible" : ""}`}>
      {presetHelpTags.map((tag, index) => {
        const visual = helpTagVisuals[tag]
        if (!visual) return null
        return (
          <span
            key={tag}
            className={`help-tag-fall inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold shadow-[0_10px_24px_-20px_rgba(15,23,42,0.35)] ${visual.tone}`}
            style={{ animationDelay: `${index * 95}ms` }}
          >
            <span className={`flex h-7 w-7 items-center justify-center rounded-full ${visual.iconBg} ${visual.iconColor}`}>
              {visual.icon}
            </span>
            {tag}
          </span>
        )
      })}
    </div>
  )
}
