import { maxHelpTagCount, presetHelpTags } from "@/lib/constants"

type HelpTagFieldsetProps = {
  selectedTags?: string[]
}

export function HelpTagFieldset({ selectedTags = [] }: HelpTagFieldsetProps) {
  const selected = new Set(selectedTags)
  const customTag = selectedTags.find((tag) => !presetHelpTags.includes(tag as (typeof presetHelpTags)[number])) ?? ""

  return (
    <fieldset className="grid gap-4 rounded-[1.5rem] border border-[#dbe9f7] bg-[#f8fbff] p-5">
      <div>
        <p className="text-sm font-semibold text-foreground">Help wanted</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Add up to {maxHelpTagCount} tags if you want extra eyes on security, design, launch work, collaboration, or any other area.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {presetHelpTags.map((tag) => (
          <label
            key={tag}
            className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors ${
              selected.has(tag)
                ? "border-[#2b7fff]/30 bg-[#edf5ff] text-[#2b7fff]"
                : "border-border bg-background text-muted-foreground hover:border-[#dbe9f7] hover:bg-white"
            }`}
          >
            <input type="checkbox" name="helpTags" value={tag} defaultChecked={selected.has(tag)} className="sr-only" />
            {tag}
          </label>
        ))}
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-semibold">Add your own tag</span>
        <input
          name="customHelpTag"
          defaultValue={customTag}
          placeholder="Example: Accessibility, Pricing, QA"
          className="min-h-12 rounded-2xl border border-border bg-background px-4"
        />
      </label>
    </fieldset>
  )
}
