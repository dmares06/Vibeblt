"use client"

import { useEffect, useState } from "react"

type AvatarUploadFieldProps = {
  currentAvatarUrl?: string | null
  fullName: string
}

export function AvatarUploadField({ currentAvatarUrl, fullName }: AvatarUploadFieldProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const avatarUrl = previewUrl ?? currentAvatarUrl
  const initial = fullName.trim().charAt(0).toUpperCase() || "?"

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  return (
    <label className="grid gap-3">
      <span className="text-sm font-semibold px-1">Avatar Image</span>
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-muted/30 p-4">
        <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xl font-semibold text-muted-foreground">
          {avatarUrl ? <img src={avatarUrl} alt={fullName} className="h-full w-full object-cover" /> : initial}
        </span>
        <div className="grid flex-1 gap-2">
          <input
            name="avatarFile"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0]
              setPreviewUrl((current) => {
                if (current) {
                  URL.revokeObjectURL(current)
                }
                return file ? URL.createObjectURL(file) : null
              })
            }}
            className="rounded-2xl border border-dashed border-border bg-background px-4 py-3 text-sm"
          />
          <span className="text-xs text-muted-foreground">
            {previewUrl ? "Previewing your selected image. Save changes to publish it." : "Upload a square image up to 5 MB."}
          </span>
        </div>
      </div>
    </label>
  )
}
