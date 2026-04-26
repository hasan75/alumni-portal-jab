# Database Management Guide

## Overview

The alumni app uses **Supabase (PostgreSQL)** as its backend. Schema is managed through versioned SQL migration files. Seed data is kept separate. The recommended tool is the **Supabase CLI**.

---

## File Structure

```
supabase/
  migrations/
    001_initial_schema.sql      ← All tables (app_config, alumni_profiles, events, jobs, etc.)
    002_rls_policies.sql        ← Row Level Security policies + helper functions
    003_functions_triggers.sql  ← DB functions, triggers (counters, updated_at, etc.)
    004_seed_data.sql           ← Empty — content moved to seed.sql
  seed.sql                      ← Reference/lookup data (categories, platforms, batches)
```

**Rule:** migrations = schema changes only. `seed.sql` = reference data only. Never mix them.

---

## One-Time Setup

### 1. Install Supabase CLI
```bash
brew install supabase/tap/supabase
```

### 2. Login
```bash
supabase login
```

### 3. Link to your project
Find your Project Reference ID in: Supabase Dashboard → Settings → General → Reference ID
```bash
supabase link --project-ref <your-project-ref>
```

### 4. Set up environment variables
Copy `.env.example` to `.env` and fill in your keys from Supabase Dashboard → Settings → API:
```bash
cp .env.example .env
```
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## First-Time Database Setup

Run in this order:

### Step 1 — Apply all migrations
```bash
supabase db push
```
This runs `001` → `002` → `003` → `004` in order. Creates all tables, RLS policies, functions, and triggers.

### Step 2 — Run seed data
The seed file does **not** run automatically with `db push`. Run it manually:

**Option A — Supabase CLI:**
```bash
supabase db reset
```
> ⚠️ `db reset` drops and recreates the entire database, then applies migrations + seed. Only use on a **fresh/dev** database — never on production.

**Option B — SQL Editor (safe for production):**
Paste the contents of `supabase/seed.sql` into Supabase Dashboard → SQL Editor → Run.

### Step 3 — Create the first admin user

**A.** Go to Supabase Dashboard → Authentication → Users → **Add user**
Set email and password. Copy the generated UUID.

**B.** In SQL Editor, run:
```sql
INSERT INTO admin_users (id, email, full_name, role, is_active)
VALUES (
  '<paste-uuid-here>',
  'admin@yourdomain.com',
  'Super Admin',
  'admin',
  true
);
```

Login at `/admin/login` with those credentials.

---

## Ongoing: Making Schema Changes

**Never edit existing migration files.** Always create a new numbered file.

### Creating a new migration

```bash
# Option A: CLI generates the file
supabase migration new your_description
# Creates: supabase/migrations/20240315123456_your_description.sql

# Option B: Create manually (simpler for this project's naming style)
# Create: supabase/migrations/005_your_description.sql
```

Write your SQL in the new file, then apply it:
```bash
supabase db push
```

### Example: adding a new column
```sql
-- supabase/migrations/005_add_linkedin_to_profiles.sql
ALTER TABLE alumni_profiles ADD COLUMN linkedin_url TEXT;
```

---

## Ongoing: Updating Seed Data

To add new reference data (e.g. a new batch year, job category):

1. Add the `INSERT` statement to `supabase/seed.sql`
2. Run just that statement in the SQL Editor on your live database
3. The updated `seed.sql` acts as the source of truth for future `db reset` runs

---

## Common Commands

| Task | Command |
|------|---------|
| Apply pending migrations | `supabase db push` |
| Reset dev DB (wipe + remigrate + seed) | `supabase db reset` |
| Check migration status | `supabase migration list` |
| Pull remote schema changes to local | `supabase db pull` |
| Open Supabase Studio locally | `supabase start` |

---

## Environments

| Environment | How to apply migrations |
|-------------|------------------------|
| **Development** | `supabase db reset` — safe to wipe and start fresh |
| **Staging** | `supabase db push` — applies only new migrations |
| **Production** | `supabase db push` — applies only new migrations, never `db reset` |

Seed data on staging/production: paste `seed.sql` into SQL Editor manually (it uses `ON CONFLICT DO NOTHING` so it's safe to re-run).

---

## Current Migration Summary

| File | What it does |
|------|-------------|
| `001_initial_schema.sql` | Creates all tables: `app_config`, `batches`, `alumni_profiles`, `admin_users`, `events`, `jobs`, `articles`, `feed_posts`, `social_platforms`, etc. |
| `002_rls_policies.sql` | RLS policies + `is_admin_user()`, `is_super_admin()`, `is_active_alumni()` helper functions |
| `003_functions_triggers.sql` | `updated_at` triggers, RSVP counters, reaction/comment counters |
| `004_seed_data.sql` | Empty — content moved to `seed.sql` |
| `seed.sql` | `app_config` defaults, `social_platforms`, `article_categories`, `job_categories`, `batches` (Class of 2015–2024) |

---

## Troubleshooting

**`supabase db push` fails with "already exists"**
A migration was applied manually via SQL Editor but not tracked. Run `supabase migration repair` or mark it as applied:
```bash
supabase migration repair --status applied 20240315123456
```

**RLS blocking queries in admin panel**
Check that the admin user row exists in `admin_users` with `is_active = true`. The `is_admin_user()` function queries this table.

**`nuxtApp.$pinia` error on boot**
Missing `.env` values. The `@nuxtjs/supabase` plugin runs at `enforce: "pre"` and throws if `SUPABASE_URL` or `SUPABASE_KEY` are absent.
