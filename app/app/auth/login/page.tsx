import Link from "next/link"
import { signInWithGithubAction, signInWithGoogleAction } from "@/app/actions"
import { isSupabaseConfigured } from "@/lib/supabase/env"

interface LoginPageProps {
  searchParams: Promise<{ error?: string; next?: string }>
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.68-.06-1.34-.17-1.97H12v3.73h5.39a4.61 4.61 0 0 1-2 3.03v2.52h3.24c1.9-1.75 2.97-4.33 2.97-7.31Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.61-2.45l-3.24-2.52c-.9.6-2.05.96-3.37.96-2.59 0-4.79-1.75-5.57-4.1H3.08v2.6A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.43 13.89A5.98 5.98 0 0 1 6.12 12c0-.66.11-1.3.31-1.89V7.51H3.08A10 10 0 0 0 2 12c0 1.61.38 3.13 1.08 4.49l3.35-2.6Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.01c1.47 0 2.8.5 3.84 1.49l2.88-2.88C16.95 2.98 14.69 2 12 2A10 10 0 0 0 3.08 7.51l3.35 2.6c.78-2.35 2.98-4.1 5.57-4.1Z"
      />
    </svg>
  )
}

function GitHubMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M12 .5C5.65.5.5 5.8.5 12.33c0 5.23 3.3 9.67 7.87 11.24.58.11.79-.26.79-.58 0-.29-.01-1.04-.02-2.04-3.2.71-3.88-1.58-3.88-1.58-.53-1.37-1.28-1.74-1.28-1.74-1.05-.73.08-.71.08-.71 1.16.08 1.76 1.22 1.76 1.22 1.03 1.81 2.7 1.29 3.36.98.1-.77.4-1.3.73-1.6-2.56-.3-5.25-1.31-5.25-5.84 0-1.29.45-2.34 1.19-3.17-.12-.3-.52-1.5.11-3.12 0 0 .97-.32 3.19 1.21a10.8 10.8 0 0 1 5.81 0c2.22-1.53 3.19-1.21 3.19-1.21.63 1.62.23 2.82.11 3.12.74.83 1.19 1.88 1.19 3.17 0 4.54-2.7 5.54-5.27 5.83.41.37.78 1.09.78 2.2 0 1.59-.01 2.87-.01 3.26 0 .32.21.7.8.58A11.9 11.9 0 0 0 23.5 12.33C23.5 5.8 18.35.5 12 .5Z" />
    </svg>
  )
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const configured = isSupabaseConfigured()
  const nextPath = params.next?.startsWith("/") && !params.next.startsWith("//") ? params.next : "/submit"

  return (
    <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-5xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Builder access</p>
          <h1 className="mt-4 font-serif text-5xl leading-none">Sign in and submit a live project.</h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Vibeblt uses Google and GitHub only for v1 so builders can get into the submission flow with minimal friction.
          </p>
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Sign in</p>
          <h2 className="mt-3 font-serif text-3xl">Continue with OAuth</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            After login, new users land on the project submission form immediately.
          </p>

          {params.error ? (
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {params.error}
            </div>
          ) : null}

          {!configured ? (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Supabase is not configured yet. Add the values from `.env.example` before testing sign-in.
            </div>
          ) : null}

          <div className="mt-8 grid gap-3">
            <form action={signInWithGoogleAction}>
              <input type="hidden" name="next" value={nextPath} />
              <button
                disabled={!configured}
                className="flex w-full items-center gap-3 rounded-2xl border border-border px-4 py-3 text-left text-sm font-semibold hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
              >
                <GoogleMark />
                Continue with Google
              </button>
            </form>
            <form action={signInWithGithubAction}>
              <input type="hidden" name="next" value={nextPath} />
              <button
                disabled={!configured}
                className="flex w-full items-center gap-3 rounded-2xl border border-border px-4 py-3 text-left text-sm font-semibold hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
              >
                <GitHubMark />
                Continue with GitHub
              </button>
            </form>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Need an account?{" "}
            <Link href="/auth/signup" className="font-medium text-foreground hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
