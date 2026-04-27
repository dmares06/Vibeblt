type HelpWantedBadgesProps = {
  tags: string[]
  compact?: boolean
  limit?: number
  className?: string
}

export function HelpWantedBadges({ tags, compact = false, limit, className = "" }: HelpWantedBadgesProps) {
  if (tags.length === 0) {
    return null
  }

  const visibleTags = typeof limit === "number" ? tags.slice(0, limit) : tags
  const remaining = tags.length - visibleTags.length

  return (
    <div className={className}>
      <p className={`font-semibold uppercase text-[#5d7994] ${compact ? "text-[10px] tracking-[0.16em]" : "text-[11px] tracking-[0.18em]"}`}>
        Help wanted
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {visibleTags.map((tag) => (
          <span
            key={tag}
            className={`rounded-full border border-[#dbe9f7] bg-[#f5f9fe] text-[#2b7fff] ${
              compact ? "px-2.5 py-1 text-[11px] font-medium" : "px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em]"
            }`}
          >
            {tag}
          </span>
        ))}
        {remaining > 0 ? (
          <span
            className={`rounded-full border border-[#dbe9f7] bg-white text-[#5d7994] ${
              compact ? "px-2.5 py-1 text-[11px] font-medium" : "px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em]"
            }`}
          >
            +{remaining}
          </span>
        ) : null}
      </div>
    </div>
  )
}
