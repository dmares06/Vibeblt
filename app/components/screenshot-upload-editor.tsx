"use client"

import { useEffect, useRef, useState, type ChangeEvent } from "react"

type ScreenshotUploadEditorProps = {
  existingUrls: string[]
  maxCount: number
  projectName?: string
}

type ExistingScreenshotItem = {
  id: string
  kind: "existing"
  url: string
}

type NewScreenshotItem = {
  id: string
  kind: "new"
  file: File
  previewUrl: string
}

type ScreenshotItem = ExistingScreenshotItem | NewScreenshotItem

function reorderItem<T>(items: T[], fromIndex: number, toIndex: number) {
  const next = [...items]
  const [item] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, item)
  return next
}

export function ScreenshotUploadEditor({ existingUrls, maxCount, projectName }: ScreenshotUploadEditorProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const itemsRef = useRef<ScreenshotItem[]>([])
  const nextNewIdRef = useRef(0)
  const [items, setItems] = useState<ScreenshotItem[]>(
    existingUrls.map((url, index) => ({
      id: `existing-${index}`,
      kind: "existing",
      url,
    })),
  )

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  useEffect(() => {
    const root = rootRef.current

    if (!root) {
      return
    }

    const form = root.closest("form")

    if (!form) {
      return
    }

    function handleFormData(event: FormDataEvent) {
      const formData = event.formData

      formData.delete("screenshots")

      items.forEach((item) => {
        if (item.kind === "new") {
          formData.append("screenshots", item.file)
        }
      })
    }

    form.addEventListener("formdata", handleFormData)

    return () => {
      form.removeEventListener("formdata", handleFormData)
    }
  }, [items])

  useEffect(() => {
    return () => {
      itemsRef.current.forEach((item) => {
        if (item.kind === "new") {
          URL.revokeObjectURL(item.previewUrl)
        }
      })
    }
  }, [])

  const remainingSlots = Math.max(0, maxCount - items.length)

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? [])

    if (selectedFiles.length === 0 || remainingSlots === 0) {
      event.target.value = ""
      return
    }

    const filesToAdd = selectedFiles.slice(0, remainingSlots).map((file) => ({
      id: `new-${nextNewIdRef.current++}`,
      kind: "new" as const,
      file,
      previewUrl: URL.createObjectURL(file),
    }))

    setItems((currentItems) => [...currentItems, ...filesToAdd])
    event.target.value = ""
  }

  function moveItem(index: number, direction: -1 | 1) {
    const nextIndex = index + direction

    if (nextIndex < 0 || nextIndex >= items.length) {
      return
    }

    setItems((currentItems) => reorderItem(currentItems, index, nextIndex))
  }

  function removeItem(index: number) {
    setItems((currentItems) => {
      const item = currentItems[index]

      if (item?.kind === "new") {
        URL.revokeObjectURL(item.previewUrl)
      }

      return currentItems.filter((_, itemIndex) => itemIndex !== index)
    })
  }

  return (
    <div ref={rootRef} className="grid gap-3">
      <div className="grid gap-2">
        <span className="text-sm font-semibold">Screenshots</span>
        <span className="text-sm text-muted-foreground">Add multiple images, then reorder them to control how they appear.</span>
        <input
          ref={inputRef}
          name="screenshots"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="rounded-2xl border border-dashed border-border px-4 py-3"
        />
        <span className="text-xs text-muted-foreground">
          {remainingSlots > 0 ? `${remainingSlots} of ${maxCount} screenshot slots remaining.` : `Maximum of ${maxCount} screenshots reached.`}
        </span>
        <span className="text-xs text-muted-foreground">Up to 5 screenshots and 50 MB total across uploaded images.</span>
      </div>

      {items.length > 0 ? (
        <div className="grid gap-3">
          {items.map((item, index) => {
            const previewUrl = item.kind === "existing" ? item.url : item.previewUrl
            const label = item.kind === "existing" ? `Current screenshot ${index + 1}` : item.file.name

            return (
              <div key={item.id} className="grid gap-3 rounded-[1.4rem] border border-border bg-background p-3 sm:grid-cols-[180px_1fr]">
                <div className="overflow-hidden rounded-[1.2rem] border border-border bg-muted">
                  <img src={previewUrl} alt={`${projectName || "Project"} screenshot ${index + 1}`} className="aspect-[4/3] w-full object-cover" />
                </div>

                <div className="grid gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">Position {index + 1}</p>
                      <p className="text-sm text-muted-foreground">{label}</p>
                    </div>
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {item.kind === "existing" ? "Saved" : "New"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => moveItem(index, -1)}
                      disabled={index === 0}
                      className="rounded-full border border-border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Move up
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(index, 1)}
                      disabled={index === items.length - 1}
                      className="rounded-full border border-border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Move down
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-rose-700"
                    >
                      Remove
                    </button>
                  </div>

                  <input
                    type="hidden"
                    name="screenshotOrder"
                    value={item.kind === "existing" ? `existing:${item.url}` : `new:${item.id}`}
                  />
                  {item.kind === "new" ? <input type="hidden" name="newScreenshotId" value={item.id} /> : null}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-[1.4rem] border border-dashed border-border bg-muted/30 px-4 py-5 text-sm text-muted-foreground">
          No screenshots selected yet.
        </div>
      )}
    </div>
  )
}
