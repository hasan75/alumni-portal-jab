# Alumni Portal

A full-stack alumni network platform built with Nuxt 4, Supabase, and PrimeVue. It connects graduates through a member directory, social feed, events, news, job board, and a complete admin panel with approval workflows.

---

## Features

### Public Site
- **Homepage** with institution overview and quick links
- **Events**, **News**, and **Jobs** listings with search, filtering, and detail pages
- **Alumni Directory** browsable by batch year, department, and industry

### Member Portal
- **Social Feed** with general and batch-scoped posts, threaded comments, and reactions (like, love, celebrate, support)
- **Profile Management** with education history, work experience, social links, and privacy controls
- **Event RSVP** with going / maybe / not going statuses
- **Member Directory** with detailed alumni profiles

### Admin Panel
- **Member Management** with approval workflow (pending, active, suspended, rejected)
- **Content Management** for events, news articles, and job postings (create, edit, publish, archive)
- **Feed Moderation** with removal reasons and post hiding
- **Site Configuration** for branding (app name, logo, tagline, primary color)
- **Dashboard** with pending approval counter and quick actions

### Security
- **Row-Level Security (RLS)** on all Supabase tables
- Separate **member** and **admin** authentication flows
- `SECURITY DEFINER` helper functions (`is_admin_user()`, `is_super_admin()`, `is_active_alumni()`) to prevent RLS recursion
- Service role key isolated to server-side API routes only

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Nuxt 4](https://nuxt.com) (Vue 3, Composition API, TypeScript) |
| UI Components | [PrimeVue 4](https://primevue.org) with custom Aura-based theme |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) with Liquid Glass design system |
| State Management | [Pinia 3](https://pinia.vuejs.org) |
| Backend & Auth | [Supabase](https://supabase.com) (PostgreSQL, Auth, RLS) |
| Fonts | [Inter](https://rsms.me/inter/) via `@nuxt/fonts` |
| Icons | [PrimeIcons](https://primevue.org/icons/) + `@nuxt/icon` |
| Images | `@nuxt/image` for optimization |
| Linting | [ESLint](https://eslint.org) with `@antfu/eslint-config` |

---

## Project Structure

```
app/
  pages/              File-based routing (28 pages)
  layouts/            default.vue | member.vue | admin.vue
  components/         Reusable Vue components (12 components)
  middleware/         member-auth.ts | admin-auth.ts
  composables/        useMembers, useFeed, useEvents, useNews, useJobs, useSiteConfig
  stores/             auth.ts (Pinia store for alumni session)
  types/              member.ts | event.ts | news.ts | job.ts | feed.ts
  utils/              formatters.ts
  presets/            alumni.js (PrimeVue theme preset)
  assets/css/         main.css (Tailwind + Liquid Glass utilities)
server/
  api/auth/           register.post.ts (service role registration endpoint)
supabase/
  migrations/         5 SQL migrations (schema, RLS, triggers, seed, member policies)
  seed.sql            Initial seed data
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **pnpm** (recommended package manager)
- A **Supabase** project ([create one free](https://supabase.com/dashboard))

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd alumni-app

# Install dependencies
pnpm install
```

### Environment Setup

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NUXT_PUBLIC_APP_NAME=Alumni Portal
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **All three Supabase keys are required.** The app will not boot without them. Missing keys cause a Pinia initialization error during SSR.

You can find these keys in your Supabase dashboard under **Settings > API > Project API keys**.

### Database Setup

Apply the SQL migrations in order from `supabase/migrations/` using the Supabase SQL Editor or CLI:

1. `001_initial_schema.sql` &mdash; Core tables (profiles, events, articles, jobs, feed, admin)
2. `002_rls_policies.sql` &mdash; Row-level security policies and helper functions
3. `003_functions_triggers.sql` &mdash; Database functions and denormalized counter triggers
4. `004_seed_data.sql` &mdash; Initial seed data (batches, categories, config)
5. `005_member_only_rls.sql` &mdash; Member-only access policies

### Run the Dev Server

```bash
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the development server with HMR |
| `pnpm build` | Create a production build |
| `pnpm generate` | Generate a static site |
| `pnpm preview` | Preview the production build locally |
| `pnpm postinstall` | Run `nuxt prepare` (auto-runs after install) |

---

## Architecture

### Three-Layer Access Model

```
Public (no auth)          Member Portal (auth required)       Admin Panel (admin auth)
─────────────────         ──────────────────────────          ─────────────────────────
/                         /feed                               /admin/dashboard
/events, /news, /jobs     /profile                            /admin/members
/directory                /directory/[id]                     /admin/events, news, jobs
/login, /register         /events/[slug] (RSVP)              /admin/feed (moderation)
                                                              /admin/settings
```

Each layer has its own layout and route middleware. Public pages use ISR/SWR caching via `routeRules` in `nuxt.config.ts`.

### Authentication Flows

- **Self-registration**: `POST /api/auth/register` creates a Supabase auth user and an `alumni_profiles` row with `status='pending'`. An admin must approve the member before they can access the portal.
- **Member login**: Checks profile status. Pending users are redirected to `/pending`. Suspended or rejected users see an error.
- **Admin login**: Verifies the user exists in the `admin_users` table with `is_active = true`.

### Data Layer

Each domain has a dedicated composable (`useMembers`, `useEvents`, etc.) that returns reactive `data`, `loading`, and `error` refs along with async CRUD methods. Composables call `useSupabaseClient()` at their top level, which is safe because they are always invoked from component `<script setup>`.

The Pinia auth store (`stores/auth.ts`) holds the current alumni profile. Supabase client calls are made inside action functions only, never at the store's top level, to avoid SSR initialization issues.

### Caching Strategy

| Route Pattern | Strategy | TTL |
|---|---|---|
| `/` | Prerendered at build time | Static |
| `/news/**` | Stale-While-Revalidate | 30 min |
| `/events/**` | Stale-While-Revalidate | 15 min |
| `/jobs/**` | Stale-While-Revalidate | 30 min |
| `/api/**` | CORS enabled | None |

---

## Design System

The UI follows Apple's **Liquid Glass** design language with fluid motion principles:

- Translucent glass surfaces with `backdrop-filter: blur(40px)` over gradient mesh backgrounds
- Specular highlights on all glass cards for depth and realism
- Spring-based entrance animations with staggered children
- Micro-interactions on all interactive elements (hover lift, active press)
- Full dark mode support via `.glass-dark` utilities
- Respects `prefers-reduced-motion` for accessibility

Custom CSS utilities (`.glass`, `.glass-dark`, `.glass-sm`, `.glass-blue`, etc.) and animation classes are defined in `app/assets/css/main.css`.

---

## License

Private. All rights reserved.
