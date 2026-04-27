import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { ensureProfile } from "@/lib/data"
import { isSupabaseConfigured } from "@/lib/supabase/env"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const next = url.searchParams.get("next") ?? "/submit"
  const errorCode = url.searchParams.get("error_code")
  const errorDescription = url.searchParams.get("error_description")

  if (!isSupabaseConfigured() || !code) {
    const reason = errorDescription ?? errorCode ?? "Missing login code"
    console.error("OAuth callback missing code", {
      reason,
      callbackUrl: request.url,
    })
    return NextResponse.redirect(new URL(`/auth/login?error=${encodeURIComponent(reason)}`, request.url))
  }

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    const reason = error?.message ?? "Unable to finish sign in"
    console.error("OAuth callback exchange failed", {
      reason,
      callbackUrl: request.url,
    })
    return NextResponse.redirect(new URL(`/auth/login?error=${encodeURIComponent(reason)}`, request.url))
  }

  await ensureProfile(data.user, supabase)
  return NextResponse.redirect(new URL(next, request.url))
}
