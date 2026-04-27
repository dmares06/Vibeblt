"use client"

import { useEffect, useState } from "react"

type HeroSearchRotatorProps = {
  words: string[]
}

const TYPE_DELAY_MS = 90
const ERASE_DELAY_MS = 55
const HOLD_DELAY_MS = 1100
const NEXT_DELAY_MS = 240

export function HeroSearchRotator({ words }: HeroSearchRotatorProps) {
  const [wordIndex, setWordIndex] = useState(0)
  const [visibleText, setVisibleText] = useState("")
  const [phase, setPhase] = useState<"typing" | "holding" | "erasing">("typing")

  useEffect(() => {
    const currentWord = words[wordIndex] ?? ""

    if (phase === "typing") {
      if (visibleText.length < currentWord.length) {
        const timer = window.setTimeout(() => {
          setVisibleText(currentWord.slice(0, visibleText.length + 1))
        }, TYPE_DELAY_MS)

        return () => window.clearTimeout(timer)
      }

      const timer = window.setTimeout(() => {
        setPhase("holding")
      }, HOLD_DELAY_MS)

      return () => window.clearTimeout(timer)
    }

    if (phase === "holding") {
      const timer = window.setTimeout(() => {
        setPhase("erasing")
      }, HOLD_DELAY_MS / 2)

      return () => window.clearTimeout(timer)
    }

    if (visibleText.length > 0) {
      const timer = window.setTimeout(() => {
        setVisibleText(currentWord.slice(0, visibleText.length - 1))
      }, ERASE_DELAY_MS)

      return () => window.clearTimeout(timer)
    }

    const timer = window.setTimeout(() => {
      setWordIndex((currentIndex) => (currentIndex + 1) % words.length)
      setPhase("typing")
    }, NEXT_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [phase, visibleText, wordIndex, words])

  return (
    <span className="hero-search-live relative inline-flex min-w-[12ch]">
      <span className="hero-search-live-text">{visibleText}</span>
      <span className="hero-search-live-caret" aria-hidden="true" />
    </span>
  )
}
