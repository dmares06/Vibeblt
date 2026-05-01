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
  Marketing: {
    tone: "border-[#d8e4ff] bg-[#edf4ff] text-[#2f68c8]",
    iconBg: "bg-[#d7e6ff]",
    iconColor: "text-[#2f68c8]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M4 13v5a2 2 0 0 0 2 2h1" />
        <path d="M7 13 19 7v10L7 13Z" />
        <path d="M7 13v7" />
      </svg>
    ),
  },
  Advertising: {
    tone: "border-[#ffe0d5] bg-[#fff0eb] text-[#b64b2f]",
    iconBg: "bg-[#ffd8ca]",
    iconColor: "text-[#b64b2f]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M4 5h16v10H4z" />
        <path d="M8 19h8" />
        <path d="M12 15v4" />
        <path d="M8 10h5" />
        <path d="M16 10h.01" />
      </svg>
    ),
  },
  "SEO Keywords": {
    tone: "border-[#d7ebe2] bg-[#ecf8f2] text-[#247255]",
    iconBg: "bg-[#d3eadf]",
    iconColor: "text-[#247255]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <circle cx="10.5" cy="10.5" r="5.5" />
        <path d="m15 15 5 5" />
        <path d="M8 10h5" />
        <path d="M10.5 7.5v5" />
      </svg>
    ),
  },
  Accessibility: {
    tone: "border-[#dcdcff] bg-[#f1f1ff] text-[#5754c7]",
    iconBg: "bg-[#dadaff]",
    iconColor: "text-[#5754c7]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <circle cx="12" cy="4" r="2" />
        <path d="M5 8h14" />
        <path d="M12 10v10" />
        <path d="m8 14-2 6" />
        <path d="m16 14 2 6" />
      </svg>
    ),
  },
  "QA / Bug Testing": {
    tone: "border-[#f7d7df] bg-[#fff0f3] text-[#b73a5b]",
    iconBg: "bg-[#f7d3dc]",
    iconColor: "text-[#b73a5b]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="m8 2 1.8 3.5" />
        <path d="M16 2l-1.8 3.5" />
        <path d="M12 7v13" />
        <path d="M5 13h14" />
        <path d="M7 20h10" />
        <path d="M6 9c0-2 2.7-4 6-4s6 2 6 4v5c0 4-2.7 7-6 7s-6-3-6-7V9Z" />
      </svg>
    ),
  },
  Copywriting: {
    tone: "border-[#e8d9ff] bg-[#f7f0ff] text-[#7344b8]",
    iconBg: "bg-[#e7d7ff]",
    iconColor: "text-[#7344b8]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M4 5h16" />
        <path d="M4 12h10" />
        <path d="M4 19h7" />
        <path d="m15 18 4-4 2 2-4 4h-2v-2Z" />
      </svg>
    ),
  },
  Pricing: {
    tone: "border-[#d5ead5] bg-[#eef8ee] text-[#2f7d3d]",
    iconBg: "bg-[#d3ead4]",
    iconColor: "text-[#2f7d3d]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M12 2v20" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  "User Research": {
    tone: "border-[#d2e7f0] bg-[#ebf7fb] text-[#286f89]",
    iconBg: "bg-[#cfe5ee]",
    iconColor: "text-[#286f89]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <circle cx="10" cy="8" r="4" />
        <path d="M3 21c.8-4 3.4-6 7-6 2 0 3.7.6 5 1.8" />
        <circle cx="18" cy="18" r="3" />
        <path d="m20.2 20.2 1.8 1.8" />
      </svg>
    ),
  },
  Analytics: {
    tone: "border-[#d9e4f5] bg-[#eef5ff] text-[#315e9f]",
    iconBg: "bg-[#d8e6f9]",
    iconColor: "text-[#315e9f]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="M8 16v-5" />
        <path d="M12 16V8" />
        <path d="M16 16v-3" />
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
