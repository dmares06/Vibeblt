import { maxProjectTagCount, presetProjectTags } from "@/lib/constants"

type ProjectTagFieldsetProps = {
  selectedTags?: string[]
}

export function ProjectTagFieldset({ selectedTags = [] }: ProjectTagFieldsetProps) {
  const selected = new Set(selectedTags)
  const customTags = selectedTags.filter((tag) => !presetProjectTags.includes(tag as (typeof presetProjectTags)[number])).join(", ")

  return (
    <fieldset className="grid gap-4 rounded-[1.5rem] border border-[#dbe9f7] bg-[#f8fbff] p-5">
      <div>
        <p className="text-sm font-semibold text-foreground">Project topics</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Add up to {maxProjectTagCount} tags so people can find projects by theme, use case, or format when they browse or search.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {presetProjectTags.map((tag) => (
          <label
            key={tag}
            className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors ${
              selected.has(tag)
                ? "border-[#2b7fff]/30 bg-[#edf5ff] text-[#2b7fff]"
                : "border-border bg-background text-muted-foreground hover:border-[#dbe9f7] hover:bg-white"
            }`}
          >
            <input type="checkbox" name="projectTags" value={tag} defaultChecked={selected.has(tag)} className="sr-only" />
            {tag}
          </label>
        ))}
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-semibold">Add your own tags</span>
        <input
          name="customProjectTags"
          defaultValue={customTags}
          placeholder="Example: E-commerce, Marketplace, Clothing Brand"
          className="min-h-12 rounded-2xl border border-border bg-background px-4"
        />
      </label>
    </fieldset>
  )
}
