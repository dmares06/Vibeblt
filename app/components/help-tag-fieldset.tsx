"use client"

import { useState } from "react"
import { maxHelpTagCount, presetHelpTags } from "@/lib/constants"

type HelpTagFieldsetProps = {
  selectedTags?: string[]
}

export function HelpTagFieldset({ selectedTags = [] }: HelpTagFieldsetProps) {
  const initialSelected = new Set(
    selectedTags.filter((tag) => presetHelpTags.includes(tag as (typeof presetHelpTags)[number])),
  )
  const initialCustom =
    selectedTags.find((tag) => !presetHelpTags.includes(tag as (typeof presetHelpTags)[number])) ?? ""

  const [selected, setSelected] = useState<Set<string>>(initialSelected)
  const [customTag, setCustomTag] = useState(initialCustom)

  const customCount = customTag.trim() ? 1 : 0
  const totalCount = selected.size + customCount
  const atLimit = totalCount >= maxHelpTagCount

  const toggle = (tag: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(tag)) {
        next.delete(tag)
      } else {
        if (totalCount >= maxHelpTagCount) return prev
        next.add(tag)
      }
      return next
    })
  }

  return (
    <fieldset className="grid gap-4 rounded-[1.5rem] border border-[#dbe9f7] bg-[#f8fbff] p-5">
      <div>
        <p className="text-sm font-semibold text-foreground">Help wanted</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Add up to {maxHelpTagCount} tags if you want extra eyes on security, design, launch work, collaboration, or any other area.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {totalCount}/{maxHelpTagCount} selected
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {presetHelpTags.map((tag) => {
          const isSelected = selected.has(tag)
          const isDisabled = !isSelected && atLimit
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(tag)}
              disabled={isDisabled}
              aria-pressed={isSelected}
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors ${
                isSelected
                  ? "border-[#2b7fff]/30 bg-[#edf5ff] text-[#2b7fff]"
                  : "border-border bg-background text-muted-foreground hover:border-[#dbe9f7] hover:bg-white"
              } ${isDisabled ? "cursor-not-allowed opacity-50 hover:border-border hover:bg-background" : ""}`}
            >
              {tag}
            </button>
          )
        })}
      </div>

      {Array.from(selected).map((tag) => (
        <input key={tag} type="hidden" name="helpTags" value={tag} />
      ))}

      <label className="grid gap-2">
        <span className="text-sm font-semibold">Add your own tag</span>
        <input
          name="customHelpTag"
          value={customTag}
          onChange={(event) => setCustomTag(event.target.value)}
          placeholder="Example: Accessibility, Pricing, QA"
          className="min-h-12 rounded-2xl border border-border bg-background px-4"
        />
      </label>
    </fieldset>
  )
}
