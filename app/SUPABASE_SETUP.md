# Supabase Setup

This app already has Supabase-based auth, storage, and project moderation wired in code. Use this checklist to configure the Supabase side so the sign-in and submission flow works end to end.

## 1. Create the Supabase project

- Create a new Supabase project.
- Copy the project URL and anon key from the project API settings.
- Keep the service role key available for server-side actions and admin tasks.

## 2. Apply the schema

- Open the SQL editor in Supabase.
- Run the SQL from `supabase/schema.sql`.
- Confirm these tables exist:
  - `profiles`
  - `projects`
  - `project_revisions`
  - `project_comments`
  - `project_likes`
  - `creator_follows`
- Confirm the `project-assets` storage bucket exists and is public.
- If this is an existing project, re-running `supabase/schema.sql` also adds the profile, project count, comment, like, and follow objects used by the app.

## 3. Set local environment variables

Create a local `.env.local` from `.env.example` and fill in:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_EMAILS=your-email@example.com
```

Notes:

- `ADMIN_EMAILS` is a comma-separated allowlist.
- The email you use for moderation must match one of those values exactly.

## 4. Configure Google OAuth

- In Google Cloud, create an OAuth client for a web application.
- Add these authorized redirect URLs:
  - `https://your-project-ref.supabase.co/auth/v1/callback`
- Copy the Google client ID and client secret into the Google provider settings in Supabase Auth.
- Enable the Google provider in Supabase.

## 5. Configure GitHub OAuth

- In GitHub Developer Settings, create a new OAuth app.
- Set the callback URL to:
  - `https://your-project-ref.supabase.co/auth/v1/callback`
- Copy the GitHub client ID and client secret into the GitHub provider settings in Supabase Auth.
- Enable the GitHub provider in Supabase.

## 6. Configure site URLs in Supabase Auth

In Supabase Auth URL settings:

- Set the site URL to:
  - `http://localhost:3000` for local work
- Add these redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `https://your-production-domain.com/auth/callback`

Before production launch, change the primary site URL to your real domain.

## 7. Start the app locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## 8. Verify the full flow

Run through this exact checklist:

1. Open `/auth/login`.
2. Sign in with Google or GitHub.
3. Confirm you land on `/submit`.
4. Submit a project with:
   - live public URL
   - project name
   - tagline
   - description
   - category
   - thumbnail
5. Confirm the project appears on `/dashboard` as pending review.
6. Sign in with an email listed in `ADMIN_EMAILS`.
7. Open `/admin`.
8. Confirm the submission appears in the moderation queue.
9. Approve the project.
10. Confirm it appears on:
    - `/browse`
    - `/project/[slug]`
    - `/builder/[username]`
11. Open the approved project page while signed in.
12. Post a comment and a nested reply.
13. If your account is an admin, confirm the hide action removes a comment from the public conversation.
14. Like the project and confirm it appears on `/dashboard/liked`.
15. Follow the project creator and confirm they appear on `/dashboard/following`.

## 9. Common issues

- If login buttons are disabled, Supabase environment variables are still missing locally.
- If sign-in works but admin access does not, confirm the login email is listed in `ADMIN_EMAILS`.
- If uploads fail, confirm the `project-assets` bucket exists and the storage policies from `supabase/schema.sql` were applied.
- If OAuth redirects fail, recheck the callback URLs in both the provider dashboard and Supabase Auth settings.
- If comments fail to post, confirm the `project_comments` table and RLS policies from `supabase/schema.sql` were applied after the engagement update.
- If likes or follows fail, confirm the `project_likes`, `creator_follows`, `toggle_project_like`, and `toggle_creator_follow` objects were applied.
