"use client"

import { useState } from "react"
import { maxProjectTagCount, presetProjectTags } from "@/lib/constants"

type ProjectTagFieldsetProps = {
  selectedTags?: string[]
}

export function ProjectTagFieldset({ selectedTags = [] }: ProjectTagFieldsetProps) {
  const initialSelected = new Set(
    selectedTags.filter((tag) => presetProjectTags.includes(tag as (typeof presetProjectTags)[number])),
  )
  const initialCustom = selectedTags
    .filter((tag) => !presetProjectTags.includes(tag as (typeof presetProjectTags)[number]))
    .join(", ")

  const [selected, setSelected] = useState<Set<string>>(initialSelected)
  const [customTags, setCustomTags] = useState(initialCustom)

  const customCount = customTags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean).length
  const totalCount = selected.size + customCount
  const atLimit = totalCount >= maxProjectTagCount

  const toggle = (tag: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(tag)) {
        next.delete(tag)
      } else {
        if (totalCount >= maxProjectTagCount) return prev
        next.add(tag)
      }
      return next
    })
  }

  return (
    <fieldset className="grid gap-4 rounded-[1.5rem] border border-[#dbe9f7] bg-[#f8fbff] p-5">
      <div>
        <p className="text-sm font-semibold text-foreground">Project topics</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Add up to {maxProjectTagCount} tags so people can find projects by theme, use case, or format when they browse or search.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {totalCount}/{maxProjectTagCount} selected
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {presetProjectTags.map((tag) => {
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
        <input key={tag} type="hidden" name="projectTags" value={tag} />
      ))}

      <label className="grid gap-2">
        <span className="text-sm font-semibold">Add your own tags</span>
        <input
          name="customProjectTags"
          value={customTags}
          onChange={(event) => setCustomTags(event.target.value)}
          placeholder="Example: E-commerce, Marketplace, Clothing Brand"
          className="min-h-12 rounded-2xl border border-border bg-background px-4"
        />
      </label>
    </fieldset>
  )
}
