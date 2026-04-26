# Supabase Setup & Admin User Creation

## Recommended Approach: Supabase CLI

The safest and recommended way to apply migrations and seed data is via the **Supabase CLI**. It is version-controlled, reproducible, and uses Supabase's proper Auth system.

---

## Step 1 — Install & Link CLI

```bash
# Install CLI
brew install supabase/tap/supabase

# Login
supabase login

# Link to your project (Project ID: Supabase dashboard → Settings → General)
supabase link --project-ref <your-project-ref>
```

---

## Step 2 — Apply Migrations

```bash
supabase db push
```

This applies all files in `supabase/migrations/` in order:
1. `001_initial_schema.sql`
2. `002_rls_policies.sql`
3. `003_functions_triggers.sql`

Seed data is in `supabase/seed.sql` (separate from migrations). It runs automatically on `supabase db reset`, or paste it manually into the SQL Editor.

---

## Step 3 — Create the Admin Auth User

Do this **once** via the Supabase dashboard:

1. Go to **Authentication → Users → Add user**
2. Set email and password (e.g. `admin@example.com`)
3. Copy the generated **UUID** from the user row

---

## Step 4 — Insert into `admin_users`

In **Supabase dashboard → SQL Editor**, run:

```sql
INSERT INTO admin_users (id, email, full_name, role, is_active)
VALUES (
  '<paste-auth-user-uuid-here>',
  'admin@example.com',
  'Super Admin',
  'admin',
  true
);
```

---

## Why Not the Other Options

| Option | Problem |
|--------|---------|
| Raw SQL into `auth.users` with `crypt()` | Bypasses Supabase Auth logic (gotrue hooks, metadata, email confirmation) — fragile |
| One-time setup page in the app | Security risk if forgotten and left enabled |

---

## Admin Login

Once set up, log in at `/admin/login` with the credentials created in Step 3.
