# Supabase Setup Guide — Alumni Portal

## Step 1 — Create a Supabase Project

1. Go to **https://supabase.com** and sign up / log in
2. Click **"New Project"**
3. Fill in:
   - **Name**: `alumni-portal` (or whatever you like)
   - **Database Password**: save this somewhere safe, you'll need it
   - **Region**: pick the one closest to your users
4. Click **"Create new project"** — wait ~2 minutes for it to provision

---

## Step 2 — Get Your API Keys

Supabase has two key systems. **Use the new keys** — the legacy JWT keys are being phased out (deprecated late 2026).

### New Keys vs Legacy Keys

| | Legacy (being phased out) | New (use these) |
|---|---|---|
| **Public key** | `anon` — long JWT starting with `eyJhb...` | `sb_publishable_...` — short opaque token |
| **Secret key** | `service_role` — long JWT | `sb_secret_...` — short opaque token |
| **Revocation** | Can't revoke until JWT expires (10 years) | Instant revocation |
| **Rotation** | Breaks all clients at once | Multiple keys can coexist during rotation |
| **Browser safety** | `service_role` works in browser (dangerous) | `sb_secret_` is blocked in browsers (safe) |

### Where to Find the New Keys

1. Go to **Settings** (gear icon) → **API Keys**
2. Make sure you're on the **"Publishable and secret API keys"** tab (NOT the "Legacy" tab)
3. You need three values:

| What | Where to find it |
|------|-----------------|
| **Project URL** | Settings → API Keys, or Integrations → Data API → "API URL" (use the base URL: `https://xxxxx.supabase.co`, not the `/rest/v1/` URL) |
| **Publishable key** | The `sb_publishable_...` key under "Publishable key" — click the copy icon |
| **Secret key** | The `sb_secret_...` key under "Secret keys" — click the eye icon to reveal, then copy |

> **Do NOT use** the legacy `eyJhb...` keys from the "Legacy anon, service_role API keys" tab. They still work today but are scheduled for removal in late 2026.

---

## Step 3 — Set Up Your `.env`

```bash
cp .env.example .env
```

Then fill in your `.env` with the **new keys**:

```
SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
SUPABASE_KEY=sb_publishable_your-publishable-key-here
SUPABASE_SERVICE_ROLE_KEY=sb_secret_your-secret-key-here
NUXT_PUBLIC_APP_NAME=Alumni Portal
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

The new `sb_publishable_` and `sb_secret_` keys are drop-in replacements — `@nuxtjs/supabase` and `supabase-js` accept them in the exact same config variables with no code changes.

---

## Step 4 — Run the Migrations (In Order)

Go to **SQL Editor** in your Supabase dashboard (left sidebar), then run each migration file **one at a time, in order**. Copy-paste the contents of each file:

| Order | File | What It Does |
|-------|------|-------------|
| 1 | `supabase/migrations/001_initial_schema.sql` | Creates all 18 tables (profiles, events, articles, jobs, feed, admin, etc.) |
| 2 | `supabase/migrations/002_rls_policies.sql` | Row Level Security policies for all tables |
| 3 | `supabase/migrations/003_functions_triggers.sql` | SECURITY DEFINER helper functions (`is_admin_user`, `is_active_alumni`, etc.) + counter triggers |
| 4 | `supabase/migrations/004_seed_data.sql` | **SKIP** — this file is empty, seed data moved to `seed.sql` |
| 5 | `supabase/migrations/005_member_only_rls.sql` | Additional member-only RLS policies |
| 6 | `supabase/seed.sql` | Seed data (app config, social platforms, article/job categories, sample batches) |

After each one, click **"Run"** and make sure you see "Success" with no errors.

> **Note:** Migration 005 will show a "Query has destructive operations" warning because it drops and recreates RLS policies. Click **"Run this query"** — it's safe.
> Migration 001 will show a "New tables will not have Row Level Security" warning. Click **"Run without RLS"** — migration 002 adds all the RLS policies.

---

## Step 5 — Create Your First Admin User

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Enter your email and a password
4. Copy the **User UID** that appears after creation
5. Go to **SQL Editor** and run:

```sql
INSERT INTO admin_users (id, email, display_name, role, is_active)
VALUES (
  'THE-UUID-YOU-COPIED',
  'your-email@example.com',
  'Your Name',
  'admin',
  true
);
```

This gives you access to `/admin/login`.

---

## Step 6 — Enable Realtime (Optional)

Recommended for live feed updates. Go to **SQL Editor** and run:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE feed_posts, feed_comments, feed_reactions;
```

This enables real-time subscriptions so new feed posts, comments, and reactions appear live without page refresh. You can skip this and add it later.

---

## Step 7 — Boot the App

```bash
pnpm dev
```

- `http://localhost:3000` — public homepage
- `http://localhost:3000/admin/login` — admin panel (use the admin user from Step 5)
- `http://localhost:3000/register` — test member registration flow

---

## Troubleshooting

| Symptom | Cause |
|---------|-------|
| "Cannot read properties of undefined (reading 'state')" | Missing `SUPABASE_URL` or `SUPABASE_KEY` in `.env` |
| 403 on API calls | RLS policies not applied — run migrations 002 and 005 |
| Registration fails | Missing `SUPABASE_SERVICE_ROLE_KEY` — the server route needs it |
| Admin login says "not found" | You didn't insert a row in `admin_users` (Step 5) |
| Using legacy keys and getting deprecation warnings | Switch to the new `sb_publishable_` / `sb_secret_` keys (Step 2) |
