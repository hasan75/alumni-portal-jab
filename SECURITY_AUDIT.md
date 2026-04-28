# Security Audit Report

**Date:** 2026-04-28
**Scope:** Full application — Nuxt 4 + Supabase + PrimeVue + Resend email
**Branch:** `feature/email-integration`
**Auditors:** Automated multi-layer review (server routes, middleware/auth, XSS/client, RLS/migrations, config/infrastructure)
**Last updated:** 2026-04-28 — C-2 (XSS/DOMPurify) and C-3 (search_path) fixed

---

## Summary

| Severity | Count | Fixed | Open |
|----------|-------|-------|------|
| Critical | 7 | 6 | 1 |
| High | 10 | 1 | 9 |
| Medium | 16 | 1 | 15 |
| Low / Informational | 12 | 1 | 11 |
| **Total** | **45** | **9** | **36** |
| Passing checks | 13 | — | — |

---

## Previously Fixed (verified this audit)

### FIXED-1. ~~Admin verification uses client-provided ID — privilege escalation~~ (was Critical #1)

All 4 admin server routes (`approve.post.ts`, `reject.post.ts`, `suspend.post.ts`, `admin-create-member.post.ts`) now use `serverSupabaseClient(event)` + `getUser()` to extract the caller's identity from the server-side session. Client-provided `adminId` parameters removed.

### FIXED-2. ~~Change-password accepted client-provided userId — account takeover~~ (was Critical #2)

`change-password.post.ts` now uses `serverSupabaseClient(event)` + `getUser()`. The `userId` body parameter was removed.

### FIXED-3. ~~Registration — no input validation, no rate limiting~~ (was Critical #4)

Zod schema validation with email format + lowercase normalization, password 8–128 chars, full_name 2–100 chars, batch_year integer, phone regex, student_id max 50. Rate limiting at 1 request/60s per email. Generic error messages prevent enumeration.

### FIXED-4. ~~RLS allows alumni to self-approve~~ (was High #5)

Migration `014_protect_profile_sensitive_fields.sql` adds a `BEFORE UPDATE` trigger that reverts changes to `status`, `approved_by`, `approved_at`, `is_verified` for non-admin, non-service-role users.

### FIXED-5. ~~Email case normalization in registration~~ (was Medium #8, partially fixed)

Registration normalizes email to lowercase via Zod `.transform(v => v.toLowerCase().trim())`. DB-level case-insensitive unique index still recommended (see M-8).

### FIXED-6. ~~Orphaned user cleanup swallows errors in register~~ (was Low #17, partially fixed)

`register.post.ts` now logs cleanup failures. However, `admin-create-member.post.ts` still silently swallows (see L-4).

### FIXED-7. ~~Stored XSS — unsanitized `v-html` rendering~~ (was Critical C-2)

**Status:** Fixed. `isomorphic-dompurify` installed. New `useSanitize` composable provides `sanitizeHTML()` with a strict allowlist. All 5 `v-html` bindings in `news/[slug].vue`, `jobs/[slug].vue`, and `events/[slug].vue` now use render-time sanitization. The `RichTextEditor.vue` custom blocklist sanitizer was replaced with DOMPurify. HTML injection in `insertLink()` and `insertImage()` fixed via attribute escaping. Content is now sanitized on mount, watch, input, and blur.

### FIXED-8. ~~No `search_path` on SECURITY DEFINER functions~~ (was Critical C-3)

**Status:** Fixed via migration `015_secure_search_path.sql`. All 9 `SECURITY DEFINER` functions now have `SET search_path = public`: `is_admin_user()`, `is_super_admin()`, `is_active_alumni()`, `update_event_rsvp_count()`, `update_feed_reaction_count()`, `update_feed_comment_count()`, `update_batch_member_count()`, `generate_unique_slug()`, `protect_sensitive_profile_fields()`.

---

## Critical

### C-1. Supabase service role key committed to git history — NEW

**File:** `.env` (committed in initial commit `82f04ef`, removed in `23da6f7`)

The initial commit included `.env` with a real Supabase service role key (a JWT) and anon key for project `vrvweamohqaoepjigqiu`. The key was removed from tracking in a later commit but **remains in git history permanently**. Anyone who clones the repo can extract it via `git log --all -p -- .env`.

The current `.env` on disk contains credentials for a **second** project (`vzbylztcywktecrcobit`), which may also be at risk if the repo is shared.

**Impact:** Full database compromise. The service role key bypasses all RLS policies with complete read/write/delete access to all tables, auth users, and storage.

**Remediation:**
1. **Immediately rotate** service role keys for both Supabase projects via Settings > API in the Supabase dashboard.
2. Use `bfg-repo-cleaner` or `git filter-repo` to purge `.env` from history.
3. Replace the real URL in `.env.example` with `https://your-project-ref.supabase.co`.

---

### ~~C-2. Stored XSS — unsanitized `v-html` rendering~~ FIXED (see FIXED-7)

### ~~C-3. No `search_path` on SECURITY DEFINER functions — privilege escalation~~ FIXED (see FIXED-8)

---

## High

### H-1. No CSRF / origin validation on any server route (still open from #6)

**Files:** All 7 routes under `server/api/`:
- `server/api/auth/register.post.ts`
- `server/api/auth/forgot-password.post.ts`
- `server/api/auth/change-password.post.ts`
- `server/api/auth/admin-create-member.post.ts`
- `server/api/members/approve.post.ts`
- `server/api/members/reject.post.ts`
- `server/api/members/suspend.post.ts`

None check the `Origin` or `Referer` header.

**Impact:** A malicious site can submit POST requests on behalf of a logged-in user whose browser sends the Supabase session cookie automatically. This enables cross-site password changes, member approvals/rejections/suspensions, and registration spam.

**Remediation:** Add origin validation as Nitro server middleware:
```ts
// server/middleware/csrf.ts
export default defineEventHandler((event) => {
  if (event.method === 'POST') {
    const origin = getHeader(event, 'origin')
    const allowed = [useRuntimeConfig().public.siteUrl]
    if (!origin || !allowed.includes(origin)) {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }
  }
})
```

---

### H-2. CORS enabled globally without origin restriction (still open from #9)

**File:** `nuxt.config.ts` line 94

```ts
'/api/**': { cors: true },
```

Sets `Access-Control-Allow-Origin: *` on all API routes. Combined with H-1, this is especially dangerous.

**Remediation:**
```ts
'/api/**': {
  cors: {
    origin: [process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
},
```

---

### H-3. Missing Supabase cookie security configuration (still open from #7)

**File:** `nuxt.config.ts` lines 51–58

No `cookieOptions` configured. In production, cookies may not be `secure`.

**Remediation:**
```ts
supabase: {
  redirect: false,
  cookieOptions: {
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
}
```

---

### H-4. No security headers configured — NEW

**File:** `nuxt.config.ts` — no server middleware, no Nitro headers config

Missing all standard security headers:
- **Content-Security-Policy** — no CSP means inline scripts unrestricted, amplifying XSS impact
- **X-Content-Type-Options** — browsers may MIME-sniff uploaded files
- **X-Frame-Options** — clickjacking possible
- **Strict-Transport-Security** — no HSTS
- **Referrer-Policy** — full referrer leaked
- **Permissions-Policy** — unrestricted browser features

**Remediation:** Add Nitro server middleware:
```ts
// server/middleware/security-headers.ts
export default defineEventHandler((event) => {
  setHeaders(event, {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '0',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  })
})
```

---

### H-5. SWR caching on auth-protected routes — data leakage — NEW

**File:** `nuxt.config.ts` lines 91–93

```ts
'/events/**': { swr: 900 },
'/jobs/**': { swr: 1800 },
```

Event and job detail pages have `middleware: 'member-auth'`. SWR caching at the Nitro layer may cache fully rendered HTML of authenticated pages and serve them to unauthenticated users (or serve one user's response to another). The middleware runs at the Vue layer but SWR caches at the server/CDN layer **before** Vue routing.

**Impact:** Member-only event/job content served to unauthenticated visitors from cache.

**Remediation:** Remove SWR from auth-protected routes, or split public/member routes.

---

### H-6. `is_admin_user()` grants editor role full admin write access — NEW

**File:** `supabase/migrations/002_rls_policies.sql` lines 10–22

```sql
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
  ...
  RETURN user_role IN ('admin', 'editor');
$$
```

The `editor` role gets identical write access to `admin` via `"Admin manage ..."` `FOR ALL` policies on every table. An editor can: delete any alumni profile, modify any event/article/job, write to `app_config` (changing branding), write to `audit_log`, manage all storage objects.

**Impact:** Over-privileged editor role. An editor account compromise = full admin compromise.

**Remediation:** Split into `is_admin_user()` (admin only) and `is_admin_or_editor()` for content tables. Restrict `app_config`, `alumni_profiles` management, and `audit_log` to admin-only.

---

### H-7. `protect_sensitive_profile_fields()` trigger bypass via NULL `auth.uid()` — NEW

**File:** `supabase/migrations/014_protect_profile_sensitive_fields.sql` lines 7–9

```sql
IF auth.uid() IS NULL THEN
    RETURN NEW;
END IF;
```

The function assumes `auth.uid() IS NULL` means "service role". But `auth.uid()` is also `NULL` for unauthenticated requests (anon key with no JWT). If RLS is ever accidentally disabled, or a permissive policy added, this trigger allows anonymous users to set `status`, `approved_by`, `approved_at`, and `is_verified`.

**Impact:** Defense-in-depth failure. Currently mitigated by RLS UPDATE policy, but fragile.

**Remediation:**
```sql
IF current_setting('request.jwt.claims', true)::json->>'role' = 'service_role' THEN
    RETURN NEW;
END IF;
```

---

### H-8. RLS leaks all profile columns to active alumni — privacy violation — NEW

**File:** `supabase/migrations/005_member_only_rls.sql` lines 24–25

```sql
CREATE POLICY "Active alumni read directory" ON alumni_profiles FOR SELECT
  USING (status = 'active' AND is_active_alumni());
```

Any active alumni can read ALL columns of every active profile — including `email`, `phone`, `date_of_birth`, `student_id` — regardless of privacy flags (`show_email`, `show_phone`, `show_dob`). The composable `.select()` limits columns, but a malicious user can query the Supabase API directly.

**Impact:** PII exposure. Privacy flags are decorative, not enforced.

**Remediation:** Create a database view that respects privacy flags and grant SELECT on the view, or use a server API proxy that enforces column filtering.

---

### H-9. Feed posts: alumni can modify admin-only fields — NEW

**File:** `supabase/migrations/002_rls_policies.sql` lines 256–258

```sql
CREATE POLICY "Active alumni update own posts" ON feed_posts FOR UPDATE
  USING (auth.uid() = author_id AND is_active_alumni())
  WITH CHECK (auth.uid() = author_id);
```

Alumni can UPDATE any column on their own posts, including `is_pinned` (admin-only), `status` (can revert `removed` back to `published` after moderation), `removed_by`, and `removal_reason`.

**Impact:** Bypasses admin moderation. A member can un-remove flagged content and self-pin posts.

**Remediation:** Add a `BEFORE UPDATE` trigger (like migration 014) to protect `is_pinned`, `status`, `removed_by`, `removal_reason` on feed posts.

---

## Medium

### M-1. `admin-create-member.post.ts` — no input validation — NEW

**File:** `server/api/auth/admin-create-member.post.ts` lines 6–8

Only checks `!email || !full_name`. No email format validation, no length limits, no `batch_year` type check, no `status` whitelist (any value other than `'pending'` becomes `'active'`).

**Remediation:** Add Zod validation matching the registration schema.

---

### M-2. Error messages leak Supabase internal details — NEW

**Files:**
- `server/api/members/approve.post.ts` line 50: `statusMessage: updateError.message`
- `server/api/members/reject.post.ts` line 52: `statusMessage: updateError.message`
- `server/api/members/suspend.post.ts` line 52: `statusMessage: updateError.message`
- `server/api/auth/admin-create-member.post.ts` line 50: `statusMessage: inviteError.message`

Raw Supabase/PostgreSQL error messages passed to client, revealing table names, column names, constraint names.

**Remediation:** Log server-side, return generic message: `throw createError({ statusCode: 500, statusMessage: 'Operation failed' })`

---

### M-3. PostgREST filter injection via unescaped search input — NEW

**Files:**
- `app/composables/useMembers.ts` lines 35, 71
- `app/composables/useJobs.ts` lines 41, 74
- `app/composables/useEvents.ts` line 46
- `app/composables/useNews.ts` line 36

```ts
query = query.or(`full_name.ilike.%${filters.search}%,display_name.ilike.%${filters.search}%`)
```

User search input interpolated directly into PostgREST filter strings. Characters like `,`, `.`, `(`, `)` can manipulate filter syntax (e.g., `%,email.eq.admin@test.com` injects additional conditions). Not SQL injection (PostgREST parameterizes), but can probe hidden columns.

**Remediation:**
```ts
const safeTerm = filters.search.replace(/[,.()]/g, '')
```

---

### M-4. `change-password.post.ts` — no rate limiting — NEW

**File:** `server/api/auth/change-password.post.ts`

No rate limiting. An attacker with a compromised session can brute-force current passwords. No max password length (only min 8).

**Remediation:** Add rate limiting (5 attempts/minute per user). Add max password length (128).

---

### M-5. `change-password.post.ts` — `signInWithPassword` creates dangling sessions — NEW

**File:** `server/api/auth/change-password.post.ts` lines 43–49

Uses the admin Supabase client to `signInWithPassword` for password verification, creating session tokens that are never cleaned up. Could interfere with Supabase's built-in auth rate limits.

**Remediation:** Add `adminSupabase.auth.signOut()` after verification, or use an alternative verification method.

---

### M-6. `approve.post.ts` — no validation on `ids` array — NEW

**File:** `server/api/members/approve.post.ts` lines 6–9

No UUID format validation, no maximum array length, no type checking on array items. Could mass-approve thousands of UUIDs in one request.

**Remediation:**
```ts
const schema = z.object({ ids: z.array(z.string().uuid()).min(1).max(50) })
```

---

### M-7. `reject.post.ts` and `suspend.post.ts` — no UUID validation — NEW

**Files:** `server/api/members/reject.post.ts` line 6, `server/api/members/suspend.post.ts` line 6

Only truthy check on `id`. Any string passes.

---

### M-8. Email case-insensitive index still missing at DB level (partially fixed from #8)

Registration normalizes email to lowercase, but no database constraint enforces this. A direct DB insert with mixed-case email would bypass normalization.

**Remediation:**
```sql
CREATE UNIQUE INDEX alumni_profiles_email_lower ON alumni_profiles (LOWER(email));
```

---

### M-9. User-controlled URLs in `href` — `javascript:` protocol risk — NEW

**Files:**
- `app/pages/jobs/[slug].vue` lines 41, 61 (`company_website`, `apply_url`)
- `app/components/member/MemberCard.vue` lines 87, 97, 107 (`portfolio_url`, `linkedin_url`, `facebook_url`)
- `app/pages/profile/index.vue` lines 512, 592 (`edu.url`, `work.url`)
- `app/pages/admin/members/[id].vue` line 602 (`link.url`)

Database-stored URLs rendered in `<a :href>` without protocol validation. Members control their own social link/portfolio URLs. A `javascript:alert(1)` URL would execute on click.

**Remediation:** Validate all user-supplied URLs start with `http://` or `https://` before rendering.

---

### M-10. `@nuxt/image` — no domain restrictions (SSRF) — NEW

**File:** `nuxt.config.ts` — `@nuxt/image` registered with no `domains` config

The image optimization proxy (`/_ipx/`) can fetch from any domain, enabling SSRF: `/_ipx/w_100/https://internal-service:8080/admin`.

**Remediation:**
```ts
image: {
  domains: ['your-supabase-project.supabase.co'],
}
```

---

### M-11. Reset-password page uses `getSession()` instead of `getUser()` — NEW

**File:** `app/pages/auth/reset-password.vue` line 24

```ts
const { data: { session } } = await supabase.auth.getSession()
```

`getSession()` reads from local storage without server-side JWT verification. Per Supabase docs, `getUser()` should be used for security-sensitive operations. An expired/tampered local session would still show the password reset form.

**Remediation:** Replace with `supabase.auth.getUser()`.

---

### M-12. Homepage fetches member-only data without auth — NEW

**File:** `app/pages/index.vue` lines 22–31

Homepage (public, pre-rendered) calls `fetchEvents()` and `fetchJobs()`, but migration 005 changed RLS to require `is_active_alumni()`. Unauthenticated visitors see empty arrays. Pre-render at build time runs without auth, producing empty sections.

**Remediation:** Create separate public RLS policies for limited event/job data, or remove these sections from the homepage, or use a server API route with service role.

---

### M-13. File upload MIME type validation is client-side only (still open from #13)

**File:** `app/composables/useImageUpload.ts` lines 30–38

`file.type` is client-controlled. No file extension validation or magic byte checking. An SVG with embedded JavaScript or an HTML file could be uploaded and served inline.

**Remediation:** Validate extension against allowlist. Set `Content-Disposition: attachment` on storage buckets. Add Supabase Storage bucket-level file type restrictions.

---

### M-14. Pages accessible without middleware (still open from #10)

Pages that query member-restricted tables but have no route middleware:

| Page | Current protection |
|------|--------------------|
| `app/pages/news/index.vue` | RLS only |
| `app/pages/jobs/index.vue` | RLS only |
| `app/pages/events/index.vue` | RLS only |

Users see empty content instead of being redirected to login.

---

### M-15. Client-side mutations lack input length validation (still open from #11)

| Composable | Function | Issue |
|------------|----------|-------|
| `useFeed.ts` | `createPost()` | No content length limit |
| `useFeed.ts` | `addComment()` | No comment length limit |
| `useMembers.ts` | `fetchDirectory()` | Search string unbounded |
| `useMembers.ts` | `saveSocialLink()` | No URL validation or length limit |
| `useNews.ts` | `fetchArticles()` | Search string unbounded |
| `useJobs.ts` | `fetchJobs()` | Search string unbounded |

---

### M-16. Auth store `loadProfile` uses `useSupabaseUser()` fallback — NEW

**File:** `app/stores/auth.ts` lines 16–19

When `userId` is not passed, falls back to `useSupabaseUser()` (client-side ref, not server-verified). Could be stale after token expiration. Middleware calls with explicit userId (safe), but future callers could invoke without.

**Remediation:** Remove the `useSupabaseUser()` fallback. Always require a server-verified `userId`.

---

## Low / Informational

### L-1. Devtools enabled unconditionally (still open from #18)

**File:** `nuxt.config.ts` line 6: `devtools: { enabled: true }`

**Remediation:** `devtools: { enabled: process.env.NODE_ENV !== 'production' }`

---

### L-2. In-memory rate limiting resets on restart (still open from #15)

**Files:** `register.post.ts` line 13, `forgot-password.post.ts` line 3

`Map<string, number>` resets on server restart, doesn't work across instances, grows unbounded (no TTL cleanup).

---

### L-3. Registration auto-confirms email (still open from #16)

**File:** `register.post.ts` line 46: `email_confirm: true`

Users can register with fake/disposable emails. Partially mitigated by admin approval.

---

### L-4. `admin-create-member.post.ts` silently swallows cleanup error

**File:** `server/api/auth/admin-create-member.post.ts` line 81

```ts
await adminSupabase.auth.admin.deleteUser(userId).catch(() => {})
```

Unlike `register.post.ts` (now logs errors), this route still silently swallows, leaving orphaned auth users.

---

### L-5. `.env.example` contains real Supabase project URL

**File:** `.env.example` line 1: `SUPABASE_URL=https://vrvweamohqaoepjigqiu.supabase.co`

Reveals the project identifier. Replace with placeholder.

---

### L-6. No server-side audit logging — NEW

None of the admin action routes (`approve`, `reject`, `suspend`, `admin-create-member`) write to the `audit_log` table, despite it existing with proper RLS policies. Admin actions are untracked.

---

### L-7. Middleware error handling gaps (still open from #12)

**Files:** `app/middleware/member-auth.ts`, `app/middleware/admin-auth.ts`

Neither destructures `error` from Supabase queries. On outage, users silently redirected to login with no logging.

**Remediation:**
```ts
const { data, error } = await supabase.from('alumni_profiles').select('status').eq('id', user.id).single()
if (error) {
  console.error('Auth middleware: profile query failed', error)
}
```

---

### L-8. `viewer` admin role has no capabilities — NEW

**File:** `supabase/migrations/001_initial_schema.sql` line 376

`CHECK (role IN ('admin', 'editor', 'viewer'))` — but `is_admin_user()` only returns true for `admin` and `editor`. The `viewer` role is effectively useless.

---

### L-9. No login attempt logging — NEW

**Files:** `app/pages/login.vue`, `app/pages/admin/login.vue`

Failed login attempts are not logged server-side. No rate limiting on login pages. Brute-force attacks go undetected.

---

### L-10. No custom error page — stack traces may leak — NEW

`app/error.vue` does not exist. Nuxt's default error handler may expose stack traces and file paths in production.

---

### L-11. `article_tag_relations` SELECT policy too permissive — NEW

**File:** `supabase/migrations/002_rls_policies.sql` lines 223–224

```sql
CREATE POLICY "Public read article_tag_relations" ON article_tag_relations FOR SELECT
  USING (true);
```

Leaks tag associations for draft/archived articles.

---

### L-12. `event_rsvps` visible to all active alumni — privacy concern — NEW

**File:** `supabase/migrations/002_rls_policies.sql` lines 191–192

Any active alumni can see ALL RSVPs for ALL events, including which member is attending what. Members may not want others to see their RSVP history.

---

## Passing (verified secure)

| Area | Status |
|------|--------|
| `.env` not tracked in git | `.gitignore` correctly excludes `.env`. Verified via `git ls-files`. |
| Service role key server-only | Key is in `runtimeConfig` (not `runtimeConfig.public`). Not exposed to client bundle. |
| Resend API key server-only | `resendApiKey` is in `runtimeConfig` (server-only). Never accessible from client. |
| RLS policy coverage | All tables have RLS enabled with policies. |
| `SECURITY DEFINER` RLS helpers | `is_admin_user()`, `is_super_admin()`, `is_active_alumni()` prevent infinite recursion in policies. |
| Admin identity from server session | All 4 admin routes use `serverSupabaseClient` + `getUser()`. |
| Middleware uses `getUser()` | Both middlewares use async server call, not the unreliable `useSupabaseUser()` reactive ref. |
| Registration input validation | Comprehensive Zod schema with proper constraints. |
| Registration rate limiting | 60s per-email cooldown present. |
| Forgot-password enumeration protection | Returns same generic message regardless of email existence. |
| Email failures non-blocking | `sendEmail()` never throws — email failures don't block operations. |
| SQL injection | All Supabase queries use parameterized PostgREST API. |
| No sensitive data in `localStorage` | Auth state managed via Supabase cookie-based sessions and Pinia store. No `localStorage`/`sessionStorage` usage. |

---

## Recommended action plan (priority order)

| Priority | Action | Effort | Findings |
|----------|--------|--------|----------|
| **P0** | **Rotate all Supabase keys immediately** | 15 min | C-1 |
| **P0** | ~~**Install DOMPurify + render-time sanitization**~~ | ~~2 hours~~ | ~~C-2~~ DONE |
| **P0** | ~~**Add `SET search_path = public` to all SECURITY DEFINER functions**~~ | ~~30 min~~ | ~~C-3~~ DONE |
| **P1** | **Add CSRF origin validation** (server middleware) | 1 hour | H-1 |
| **P1** | **Restrict CORS origins** | 15 min | H-2 |
| **P1** | **Add security headers** (server middleware) | 30 min | H-4 |
| **P1** | **Remove SWR from auth-protected routes** | 15 min | H-5 |
| **P1** | **Fix `protect_sensitive_profile_fields` trigger bypass** | 15 min | H-7 |
| **P2** | **Configure Supabase cookie options** | 15 min | H-3 |
| **P2** | **Split editor/admin RLS policies** | 2 hours | H-6 |
| **P2** | **Protect feed post admin-only fields** (trigger) | 30 min | H-9 |
| **P2** | **Enforce profile privacy flags at DB level** (view) | 1 hour | H-8 |
| **P2** | **Validate URLs before rendering in href** | 30 min | M-9 |
| **P3** | **Add Zod validation to admin-create-member** | 30 min | M-1 |
| **P3** | **Replace raw error messages with generic ones** | 30 min | M-2 |
| **P3** | **Sanitize search input in composables** | 30 min | M-3 |
| **P3** | **Add rate limiting to change-password** | 30 min | M-4 |
| **P3** | **Validate ids/id parameters in member routes** | 30 min | M-6, M-7 |
| **P3** | **Add `@nuxt/image` domain restrictions** | 15 min | M-10 |
| **P3** | **Fix reset-password to use `getUser()`** | 15 min | M-11 |
| **P3** | **Add middleware to unprotected member pages** | 15 min | M-14 |
| **P3** | **Add case-insensitive email index** | 15 min | M-8 |
| **P3** | **Add input length validation to composables** | 1 hour | M-15 |
| **P4** | **Disable devtools in production** | 5 min | L-1 |
| **P4** | **Create custom error.vue** | 30 min | L-10 |
| **P4** | **Add audit logging to admin actions** | 1 hour | L-6 |
| **P4** | **Add middleware error handling** | 15 min | L-7 |
