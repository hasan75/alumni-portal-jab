# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm generate     # Static generation
pnpm preview      # Preview production build
```

No test suite is configured. Linting is via ESLint (`@antfu/eslint-config`).

## Environment

Copy `.env.example` to `.env` and fill in all three Supabase keys. The app **will not boot** without them — the `@nuxtjs/supabase` plugin (which has `enforce: "pre"`) throws during SSR setup if `SUPABASE_URL` or `SUPABASE_KEY` are missing, which causes `nuxtApp.$pinia` to be undefined and surfaces as a Pinia "Cannot read properties of undefined (reading 'state')" error.

```
SUPABASE_URL=
SUPABASE_KEY=                  # anon/public key
SUPABASE_SERVICE_ROLE_KEY=     # service_role secret (Settings → API → Project API keys)
```

## Architecture

### Three-layer app
1. **Public** (`/`, `/events`, `/news`, `/jobs`, `/directory`) — `layout: default`, no auth required
2. **Member portal** (`/feed`, `/profile`, `/directory/[id]`) — `layout: member`, `middleware: member-auth`
3. **Admin panel** (`/admin/**`) — `layout: admin`, `middleware: admin-auth`

### Directory layout (`app/` is the Nuxt 4 srcDir)
```
app/
  layouts/        default.vue | member.vue | admin.vue
  middleware/     member-auth.ts | admin-auth.ts
  stores/         auth.ts          ← Pinia store for current alumni session
  composables/    use*.ts          ← one composable per domain
  pages/          file-based routes
  types/          member.ts | event.ts | news.ts | job.ts | feed.ts
  utils/          formatters.ts
  presets/        alumni.js        ← PrimeVue theme (extends Aura, blue #2563EB)
server/
  api/auth/register.post.ts        ← only server route; uses service role key
supabase/
  migrations/                      ← apply manually via Supabase dashboard or CLI
```

### Auth flows
- **Self-registration**: `POST /api/auth/register` (server route) → `auth.admin.createUser()` with service role → creates `alumni_profiles` row with `status='pending'`. Admin approves in `/admin/members`.
- **Member login**: `/login` → check `alumni_profiles.status`. Pending → `/pending`. Suspended/rejected → error. Active → `/feed`.
- **Admin login**: `/admin/login` → verify row in `admin_users` table (`is_active = true`).

### Pinia store (`stores/auth.ts`)
Holds the current `AlumniProfile`. **Critical pattern**: `useSupabaseClient()` and `useSupabaseUser()` must be called *inside* action functions (`loadProfile`, `updateProfile`), never at the top level of `defineStore`. Top-level calls break Pinia SSR initialization.

### Composables pattern
Each composable (`useMembers`, `useEvents`, `useNews`, `useJobs`, `useFeed`) calls `useSupabaseClient()` at its top level — this is fine because composables are always called from within component `<script setup>`, not from store setup. Each returns `{ data ref, loading ref, error ref, async fetchXxx(), async saveXxx(), async deleteXxx() }`.

`useSiteConfig()` — **not** `useAppConfig()` (that name conflicts with Nuxt's built-in). Reads/writes the `app_config` key-value table for branding (app name, logo, primary color, tagline).

### RLS & database
Three SECURITY DEFINER helper functions prevent infinite recursion in policies:
- `is_admin_user()` — checks `admin_users` table
- `is_super_admin()` — role = 'admin'
- `is_active_alumni()` — checks `alumni_profiles.status = 'active'`

Denormalized counters on `events.rsvp_count`, `feed_posts.reaction_count`, and `feed_posts.comment_count` are maintained by triggers in migration 003.

### PrimeVue components
Components are globally registered via `@primevue/nuxt-module` (`components.include: '*'`). Import explicitly in pages/components where needed for clarity (e.g. `import Button from 'primevue/button'`), though auto-import also works. Toast and ConfirmDialog are mounted globally in `app/app.vue`.

---

## UI Design System — Apple Liquid Glass + Fluid Motion

All UI work in this project must follow Apple's **Liquid Glass** design language (introduced iOS 26 / macOS Tahoe) combined with Apple's fluid motion principles. This is the default and only design system for the project. Apply the full standard below on every component and page without being asked.

---

### Liquid Glass Material System

Apple's Liquid Glass is a multi-layer translucent material that simulates real frosted glass with dynamic light, refraction, and depth. Every surface should feel like it has physical weight and reacts to what is behind it.

**The Glass Stack (apply all layers together)**
```css
/* Liquid Glass — full recipe */
background: rgba(255, 255, 255, 0.18);          /* translucent white fill */
backdrop-filter: blur(40px) saturate(180%);     /* deep blur + color boost */
-webkit-backdrop-filter: blur(40px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.45);    /* bright top/left edge */
border-bottom-color: rgba(255, 255, 255, 0.15); /* darker bottom edge (light physics) */
border-right-color: rgba(255, 255, 255, 0.15);
box-shadow:
  0 2px 0 0 rgba(255,255,255,0.6) inset,        /* inner top highlight */
  0 -1px 0 0 rgba(255,255,255,0.1) inset,       /* inner bottom rim */
  0 8px 32px rgba(0, 0, 0, 0.10),               /* ambient shadow */
  0 2px 8px rgba(0, 0, 0, 0.08);                /* close shadow */
border-radius: 20px;
```

**Dark mode Glass Stack**
```css
background: rgba(255, 255, 255, 0.08);
backdrop-filter: blur(40px) saturate(200%);
border: 1px solid rgba(255, 255, 255, 0.12);
border-bottom-color: rgba(255, 255, 255, 0.04);
box-shadow:
  0 2px 0 0 rgba(255,255,255,0.12) inset,
  0 8px 32px rgba(0, 0, 0, 0.40),
  0 2px 8px rgba(0, 0, 0, 0.30);
```

**Tailwind shorthand** — add these as custom utilities in your CSS:
```css
.glass {
  background: rgba(255,255,255,0.18);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.45);
  border-bottom-color: rgba(255,255,255,0.15);
  border-right-color: rgba(255,255,255,0.15);
  box-shadow: 0 2px 0 0 rgba(255,255,255,0.6) inset, 0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.08);
  border-radius: 20px;
}
.glass-dark {
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  border: 1px solid rgba(255,255,255,0.12);
  border-bottom-color: rgba(255,255,255,0.04);
  box-shadow: 0 2px 0 0 rgba(255,255,255,0.12) inset, 0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3);
  border-radius: 20px;
}
.glass-sm {
  background: rgba(255,255,255,0.22);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid rgba(255,255,255,0.5);
  box-shadow: 0 1px 0 0 rgba(255,255,255,0.7) inset, 0 4px 16px rgba(0,0,0,0.08);
  border-radius: 14px;
}
```

**Glass Tinted Variants** (for colored surfaces)
```css
.glass-blue  { background: rgba(0, 122, 255, 0.15); border-color: rgba(0,122,255,0.3); }
.glass-green { background: rgba(52, 199, 89, 0.12); border-color: rgba(52,199,89,0.25); }
.glass-red   { background: rgba(255, 59, 48, 0.12); border-color: rgba(255,59,48,0.25); }
/* Always combine with backdrop-filter: blur(40px) */
```

**Specular Highlight (the key to realism)**
- Add a `::before` pseudo-element with a white-to-transparent gradient on the top portion of glass cards to simulate the light source catching the surface:
```css
.glass-card::before {
  content: '';
  position: absolute; inset: 0;
  border-radius: inherit;
  background: linear-gradient(160deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 50%);
  pointer-events: none;
}
```

**Background requirement**
- Liquid Glass only works over rich backgrounds. Pages MUST use a gradient or mesh background — never a plain white/gray surface behind glass:
```css
/* Option A: Gradient mesh */
background: linear-gradient(135deg, #667eea 0%, #764ba2 40%, #f093fb 100%);

/* Option B: Subtle light mesh (for non-hero pages) */
background: linear-gradient(135deg, #e0e7ff 0%, #f0fdf4 50%, #fef3c7 100%);

/* Option C: Dark deep */
background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
```

---

### Motion & Animation Philosophy

Follow Apple's core motion principles: animations must feel **physical**, **purposeful**, and **continuous**. Nothing appears or disappears abruptly.

**Timing & Easing**
- Use spring-based feel: prefer `cubic-bezier(0.34, 1.56, 0.64, 1)` for entrances (slight overshoot)
- Exit animations: `cubic-bezier(0.36, 0, 0.66, 0)` (ease-in, fast exit)
- Standard transitions: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (ease-out)
- Duration: 200ms for micro (hover/press), 350ms for component transitions, 500ms for page-level
- Always use Tailwind's `transition-all duration-300 ease-out` as a baseline on interactive elements

**Entrance Animations**
- Elements enter with `translate-y-4 opacity-0` → `translate-y-0 opacity-100`
- Stagger children with 50–80ms delay increments using inline `style="animation-delay: Xms"`
- Page sections fade-in-up on scroll using `IntersectionObserver`
- Modals/dialogs scale in from `scale-95 opacity-0` → `scale-100 opacity-100`

**Micro-interactions**
- Buttons: `hover:-translate-y-0.5 hover:shadow-lg active:scale-95 active:translate-y-0`
- Cards: `hover:-translate-y-1 hover:shadow-xl` with `transition-all duration-300`
- Icons: `hover:scale-110 transition-transform duration-200`
- Links: underline slides in from left on hover using pseudo-element or border-bottom trick
- Inputs: border glows on focus with a subtle ring expansion animation

### Visual Design Language

**Surfaces & Depth (Layered Materials)**
- Background base: always a gradient or mesh (see Liquid Glass → Background requirement above) — never plain `bg-gray-50`
- Cards: use `.glass` / `.glass-dark` utility classes — the full liquid glass stack
- Navbar/sidebar: `glass` with slightly higher blur (`blur(60px)`) and `position: sticky`
- Modals/sheets: `glass` + `scale-in` animation + `inset-0` backdrop of `bg-black/20 backdrop-blur-sm`
- Tooltips/popovers: `.glass-sm` — lighter blur, tighter radius
- Elevated panels: increase shadow intensity, not opacity — depth comes from shadow not from being more opaque
- Use specular `::before` highlight on all prominent cards

**Typography**
- Display headings: `font-semibold tracking-tight` — Apple never uses heavy/black weight for large text
- Body: `font-normal leading-relaxed text-gray-700 dark:text-gray-300`
- Labels/captions: `text-xs font-medium tracking-wide uppercase text-gray-500`
- Font stack: `font-sans` (SF Pro fallback chain: `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif`)
- Large hero numbers/stats: `text-5xl font-bold tracking-tighter`

**Color System**
- Primary: use system blue `#007AFF` (Apple blue) or project blue `#2563EB` — consistent, never both
- Success: `#34C759`, Warning: `#FF9F0A`, Danger: `#FF3B30`, Info: `#5AC8FA`
- Tints: always use `bg-blue-50 text-blue-600` pattern for badge/chip coloring, not hard hex
- Gradients: `bg-gradient-to-br from-blue-600 to-indigo-600` for CTAs and hero accents
- Never use pure `#000000` or `#ffffff` — use `gray-900` and `gray-50` respectively

**Spacing & Geometry**
- Border radius: `rounded-2xl` (16px) for cards, `rounded-xl` (12px) for inputs/buttons, `rounded-full` for avatars/badges
- Consistent padding rhythm: sections use `py-16 px-6`, cards use `p-6`, compact cards `p-4`
- Use `gap-6` or `gap-8` in grids — generous whitespace is intentional
- Avoid cramped layouts; Apple designs breathe

**Iconography**
- Use Heroicons (already available) — outline style for navigation, solid for active/filled states
- Size: `w-5 h-5` for inline, `w-6 h-6` for buttons, `w-8 h-8` for feature icons
- Feature icons should sit on a tinted `rounded-xl p-3 bg-blue-50` container

### Component Patterns

**Buttons**
```html
<!-- Primary -->
<button class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ease-out">

<!-- Secondary -->
<button class="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-[#3a3a3c] border border-gray-200 dark:border-gray-700 hover:-translate-y-0.5 hover:shadow-md active:scale-95 font-medium rounded-xl transition-all duration-200 ease-out">

<!-- Ghost/Text -->
<button class="inline-flex items-center gap-1.5 px-3 py-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium transition-all duration-150">
```

**Cards**
```html
<!-- Standard liquid glass card -->
<div class="glass dark:glass-dark relative overflow-hidden p-6 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 ease-out">
  <!-- Specular highlight -->
  <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/30 via-transparent to-transparent"></div>
  <!-- Content -->
</div>

<!-- Tinted accent card -->
<div class="glass glass-blue dark:glass-dark relative overflow-hidden p-6">
  <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
</div>
```

**Inputs**
```html
<!-- Liquid glass input -->
<input class="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 placeholder:text-white/40 text-white"
  style="background:rgba(255,255,255,0.12); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.25);">
```

**Section headings**
```html
<div class="mb-8">
  <p class="text-xs font-semibold tracking-widest uppercase text-blue-600 mb-2">Section label</p>
  <h2 class="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">Heading</h2>
  <p class="mt-2 text-gray-500 dark:text-gray-400 max-w-xl">Supporting description text.</p>
</div>
```

**Stat/metric cards**
```html
<!-- Glass stat card over gradient bg -->
<div class="glass relative overflow-hidden p-6">
  <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/25 via-transparent to-transparent"></div>
  <p class="text-sm font-medium text-white/70">Label</p>
  <p class="text-4xl font-bold tracking-tight mt-1 text-white">1,284</p>
  <p class="text-xs text-white/50 mt-1">+12% this month</p>
</div>
```

**Buttons (Liquid Glass)**
```html
<!-- Primary glass button -->
<button class="relative overflow-hidden inline-flex items-center gap-2 px-5 py-2.5 font-medium rounded-xl text-white hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
  style="background:rgba(255,255,255,0.20); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.4); box-shadow:0 2px 0 rgba(255,255,255,0.4) inset,0 4px 16px rgba(0,0,0,0.15);">
  <span class="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 to-transparent"></span>
  Label
</button>

<!-- Solid primary (CTA, most important action) -->
<button class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-medium rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200">
```

### Animation & CSS Utilities (add to `app/assets/css/main.css`)

```css
/* ── Liquid Glass utilities ─────────────────────────────── */
.glass {
  background: rgba(255,255,255,0.18);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.45);
  border-bottom-color: rgba(255,255,255,0.15);
  border-right-color: rgba(255,255,255,0.15);
  box-shadow: 0 2px 0 0 rgba(255,255,255,0.6) inset,
              0 8px 32px rgba(0,0,0,0.10),
              0 2px 8px rgba(0,0,0,0.08);
  border-radius: 20px;
}
.glass-dark {
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  border: 1px solid rgba(255,255,255,0.12);
  border-bottom-color: rgba(255,255,255,0.04);
  box-shadow: 0 2px 0 0 rgba(255,255,255,0.12) inset,
              0 8px 32px rgba(0,0,0,0.40),
              0 2px 8px rgba(0,0,0,0.30);
  border-radius: 20px;
}
.glass-sm {
  background: rgba(255,255,255,0.22);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid rgba(255,255,255,0.50);
  box-shadow: 0 1px 0 0 rgba(255,255,255,0.7) inset,
              0 4px 16px rgba(0,0,0,0.08);
  border-radius: 14px;
}
.glass-blue  { background: rgba(0,122,255,0.15);  border-color: rgba(0,122,255,0.30); }
.glass-green { background: rgba(52,199,89,0.12);  border-color: rgba(52,199,89,0.25); }
.glass-red   { background: rgba(255,59,48,0.12);  border-color: rgba(255,59,48,0.25); }

/* ── Entrance animations ─────────────────────────────────── */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}
.animate-scale-in {
  animation: scaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes shimmer {
  from { background-position: -200% center; }
  to   { background-position:  200% center; }
}
.animate-shimmer {
  background: linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.4) 50%, transparent 75%);
  background-size: 200% auto;
  animation: shimmer 1.5s linear infinite;
}

/* ── Stagger helpers ─────────────────────────────────────── */
.delay-1 { animation-delay:  60ms; }
.delay-2 { animation-delay: 120ms; }
.delay-3 { animation-delay: 180ms; }
.delay-4 { animation-delay: 240ms; }
.delay-5 { animation-delay: 300ms; }

/* ── Reduced motion ──────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-up,
  .animate-scale-in,
  .animate-shimmer { animation: none; }
  * { transition-duration: 0.01ms !important; }
}
```

### General Rules

1. **Every interactive element** must have a visible hover AND active/pressed state — no exceptions.
2. **No flat white/gray pages** — every page background must be a gradient mesh. Glass only looks right over rich backgrounds.
3. **Liquid Glass is the default surface** — use `.glass` for all cards, panels, navbars, modals. Never plain white.
4. **Specular highlight on every glass card** — add the `from-white/30 via-transparent` gradient overlay as a `pointer-events-none` absolutely-positioned div inside every glass card.
5. **Page transitions** — wrap page `<main>` content in `<Transition name="fade">` with `animate-fade-in-up`.
6. **Empty states** must have a large glass-card container with an icon, heading, and CTA — never just plain text.
7. **Loading states** use `animate-pulse` skeletons shaped like the real content — never a spinner alone.
8. **Dark mode** — every element must have a `dark:` variant or use the `.glass-dark` utility. Design dark-first.
9. **Consistency** — replicate patterns across similar components. If one card uses specular highlight, all cards do.
10. **Whitespace is intentional** — generous padding signals quality. Never cram content.
11. **Accessibility** — all animations wrapped in `@media (prefers-reduced-motion: no-preference)` or disabled via the CSS rule above.
