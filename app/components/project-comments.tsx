import { formatDate } from "@/lib/utils"
import type { ProjectComment } from "@/lib/types"

interface ProjectCommentsProps {
  comments: ProjectComment[]
  projectId: string
}

export function ProjectComments({ comments, projectId }: ProjectCommentsProps) {
  return (
    <section className="mt-12 space-y-8">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="font-serif text-3xl">Discussion</h2>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
          {comments.length} Comments
        </span>
      </div>

      {/* Comment Form */}
      <div className="flex gap-4">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted shadow-sm">
          {/* Default user placeholder or viewer avatar if available */}
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-xs font-bold text-slate-400">
            YOU
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <textarea
            rows={3}
            placeholder="What do you think of this project?"
            className="w-full rounded-2xl border border-border bg-card p-4 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all"
          />
          <div className="flex justify-end">
            <button className="rounded-full bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-blue-100 transition-all hover:bg-blue-700 active:scale-95">
              Post Comment
            </button>
          </div>
        </div>
      </div>

      {/* Comment List */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted shadow-sm">
                {comment.user.avatarUrl ? (
                  <img src={comment.user.avatarUrl} alt={comment.user.fullName} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-100 text-xs font-bold text-slate-400">
                    {comment.user.fullName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">{comment.user.fullName}</span>
                  <span className="text-[11px] text-muted-foreground">@{comment.user.username}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-[11px] text-muted-foreground">{formatDate(comment.createdAt)}</span>
                </div>
                <div className="rounded-2xl rounded-tl-none border border-border bg-muted/30 p-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">{comment.content}</p>
                </div>
                <div className="flex items-center gap-4 px-1">
                  <button className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground transition-colors hover:text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>
                    {comment.likeCount || "Like"}
                  </button>
                  <button className="text-[11px] font-bold text-muted-foreground transition-colors hover:text-blue-600">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[2rem] border border-dashed border-border py-12 text-center text-muted-foreground">
            No comments yet. Be the first to share your vibes!
          </div>
        )}
      </div>
    </section>
  )
}
