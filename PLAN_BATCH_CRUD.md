# Plan: Admin Batch Management — Full CRUD

## Context

The `/admin/batches` page currently only supports **adding** new batches and **toggling active/inactive** status. Admins cannot edit or delete batches. Batch years are seeded via SQL, which is not practical for ongoing management. This plan upgrades the page to full CRUD following the established admin patterns (Events, News, Jobs).

## Current State

- **Page**: `app/pages/admin/batches/index.vue` — inline add form + DataTable with toggle
- **No composable**: uses direct `useSupabaseClient()` queries inline (doesn't follow the composable pattern)
- **Type**: `Batch` interface exists in `app/types/member.ts`
- **Fetch in other places**: `useMembers.ts` has `fetchBatches()` that only returns active batches (used in dropdowns)

## What to Build

### 1. Create `app/composables/useBatches.ts`

Follow the pattern from `useEvents.ts` / `useNews.ts`:

```
Returns: { data, loading, error, fetchBatches, fetchAllForAdmin, saveBatch, deleteBatch }
```

- `fetchBatches()` — active batches only (move from `useMembers.ts`)
- `fetchAllForAdmin({ search? })` — all batches, ordered by year desc
- `saveBatch(batch)` — upsert (insert if no id, update if id exists)
- `deleteBatch(id)` — delete with safety check (no alumni assigned to that batch year)

### 2. Update `app/pages/admin/batches/index.vue`

Replace the current page with the standard admin CRUD pattern:

- **Search bar** with debounced filtering
- **"New Batch" button** → opens a Dialog (not a separate page, since batches are simple)
- **DataTable** columns: Year, Label, Description, Members, Active, Actions
- **Actions column**: Edit icon (opens dialog), Delete icon (with `useConfirm()` confirmation)
- **Edit Dialog**: fields for Year (number input), Label (text), Description (textarea), Is Active (toggle)
- **Delete safety**: prevent deletion if `member_count > 0` — show warning toast instead

### 3. Update `app/composables/useMembers.ts`

- Remove `fetchBatches()` from `useMembers.ts`
- Import from `useBatches` wherever batches are needed (register page, feed batch filter, etc.)

### 4. Update imports across the app

Files that call `fetchBatches` from `useMembers`:
- `app/pages/register.vue`
- `app/pages/admin/members/[id].vue` (if batch dropdown exists)
- `app/pages/feed/batch/[year].vue`
- Any other file using `useMembers().fetchBatches`

Switch them to `useBatches().fetchBatches`.

## Files to Create/Modify

| File | Action |
|------|--------|
| `app/composables/useBatches.ts` | **Create** — new composable |
| `app/pages/admin/batches/index.vue` | **Rewrite** — full CRUD with dialog |
| `app/composables/useMembers.ts` | **Edit** — remove `fetchBatches()` |
| `app/pages/register.vue` | **Edit** — switch to `useBatches` |
| Other pages using `fetchBatches` | **Edit** — switch imports |

## Delete Safety Rule

Batches referenced by `alumni_profiles.batch_year`, `events.batch_year`, or `feed_posts.batch_year` via foreign keys. Postgres will block deletion if any alumni are assigned. The composable should catch this error and show a user-friendly message: *"Cannot delete — X members are in this batch. Deactivate it instead."*

## Verification

1. Run `pnpm build` — no errors
2. Navigate to `/admin/batches` — see full DataTable with search
3. Add a new batch via dialog — appears in table
4. Edit a batch's label/description — saves correctly
5. Delete a batch with 0 members — succeeds
6. Try to delete a batch with members — shows warning, blocked
7. Check `/register` — batch dropdown still works using `useBatches`
