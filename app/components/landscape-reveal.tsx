"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

type LandscapeRevealProps = {
  scene: ReactNode
  cta: ReactNode
  className?: string
}

export function LandscapeReveal({ scene, cta, className = "" }: LandscapeRevealProps) {
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
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
            return
          }
        }
      },
      { threshold: 0.2 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`relative isolate overflow-hidden ${className}`}>
      <div className={`absolute inset-0 landscape-scene ${visible ? "landscape-scene-visible" : ""}`}>
        {scene}
      </div>
      <div className={`relative landscape-cta ${visible ? "landscape-cta-visible" : ""}`}>
        {cta}
      </div>
    </div>
  )
}
