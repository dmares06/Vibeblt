import Link from "next/link"
import { createProjectCommentAction, hideProjectCommentAction } from "@/app/actions"
import { formatDate } from "@/lib/utils"
import type { AuthViewer, ProjectComment } from "@/lib/types"

interface ProjectCommentsProps {
  comments: ProjectComment[]
  projectId: string
  projectSlug: string
  viewer: AuthViewer | null
}

function countComments(comments: ProjectComment[]): number {
  return comments.reduce((total, comment) => total + 1 + countComments(comment.replies), 0)
}

function CommentForm({
  projectId,
  projectSlug,
  parentId,
  viewer,
  compact = false,
}: {
  projectId: string
  projectSlug: string
  parentId?: string
  viewer: AuthViewer | null
  compact?: boolean
}) {
  if (!viewer) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-border bg-muted/20 px-5 py-4 text-sm text-muted-foreground">
        <Link href={`/auth/login?next=${encodeURIComponent(`/project/${projectSlug}`)}`} className="font-semibold text-foreground hover:underline">
          Sign in
        </Link>{" "}
        to join the conversation.
      </div>
    )
  }

  return (
    <form action={createProjectCommentAction} className="flex gap-4">
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="projectSlug" value={projectSlug} />
      {parentId ? <input type="hidden" name="parentId" value={parentId} /> : null}
      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted shadow-sm">
        {viewer.profile.avatarUrl ? (
          <img src={viewer.profile.avatarUrl} alt={viewer.profile.fullName} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-xs font-bold text-slate-400">
            {viewer.profile.fullName.charAt(0)}
          </div>
        )}
      </div>
      <div className="flex-1 space-y-3">
        <textarea
          name="content"
          required
          maxLength={2000}
          rows={compact ? 2 : 3}
          placeholder={parentId ? "Write a reply..." : "Ask a question, offer feedback, or start a conversation."}
          className="w-full rounded-2xl border border-border bg-card p-4 text-sm transition-all focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <div className="flex justify-end">
          <button className="rounded-full bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-blue-100 transition-all hover:bg-blue-700 active:scale-95">
            {parentId ? "Post Reply" : "Post Comment"}
          </button>
        </div>
      </div>
    </form>
  )
}

function CommentThread({
  comment,
  projectId,
  projectSlug,
  viewer,
  depth = 0,
}: {
  comment: ProjectComment
  projectId: string
  projectSlug: string
  viewer: AuthViewer | null
  depth?: number
}) {
  const isAdmin = Boolean(viewer?.profile.isAdmin)

  return (
    <div className={depth > 0 ? "border-l border-border pl-4 sm:pl-6" : ""}>
      <div className="flex gap-4">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted shadow-sm">
          {comment.user.avatarUrl ? (
            <img src={comment.user.avatarUrl} alt={comment.user.fullName} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-xs font-bold text-slate-400">
              {comment.user.fullName.charAt(0)}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-foreground">{comment.user.fullName}</span>
            <Link href={`/builder/${comment.user.username}`} className="text-[11px] text-muted-foreground hover:text-foreground">
              @{comment.user.username}
            </Link>
            <span className="text-muted-foreground">•</span>
            <span className="text-[11px] text-muted-foreground">{formatDate(comment.createdAt)}</span>
          </div>
          <div className="rounded-2xl rounded-tl-none border border-border bg-muted/30 p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{comment.content}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 px-1">
            <details className="group">
              <summary className="cursor-pointer list-none text-[11px] font-bold text-muted-foreground transition-colors hover:text-blue-600">
                Reply
              </summary>
              <div className="mt-4">
                <CommentForm projectId={projectId} projectSlug={projectSlug} parentId={comment.id} viewer={viewer} compact />
              </div>
            </details>
            {isAdmin ? (
              <form action={hideProjectCommentAction}>
                <input type="hidden" name="commentId" value={comment.id} />
                <input type="hidden" name="projectSlug" value={projectSlug} />
                <button className="text-[11px] font-bold text-rose-600 transition-colors hover:text-rose-700">
                  Hide
                </button>
              </form>
            ) : null}
          </div>
        </div>
      </div>

      {comment.replies.length > 0 ? (
        <div className="mt-5 space-y-5">
          {comment.replies.map((reply) => (
            <CommentThread
              key={reply.id}
              comment={reply}
              projectId={projectId}
              projectSlug={projectSlug}
              viewer={viewer}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function ProjectComments({ comments, projectId, projectSlug, viewer }: ProjectCommentsProps) {
  const commentCount = countComments(comments)

  return (
    <section className="mt-12 space-y-8">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-serif text-3xl">Conversation</h2>
          <p className="mt-2 text-sm text-muted-foreground">Ask questions, give feedback, and help the builder improve the project.</p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
          {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
        </span>
      </div>

      <CommentForm projectId={projectId} projectSlug={projectSlug} viewer={viewer} />

      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              projectId={projectId}
              projectSlug={projectSlug}
              viewer={viewer}
            />
          ))
        ) : (
          <div className="rounded-[2rem] border border-dashed border-border py-12 text-center text-muted-foreground">
            No comments yet. Start the conversation with a question or piece of feedback.
          </div>
        )}
      </div>
    </section>
  )
}
