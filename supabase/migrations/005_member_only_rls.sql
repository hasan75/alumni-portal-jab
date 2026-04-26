-- =============================================================================
-- Migration 005: Restrict events, jobs, and directory to active alumni only
--
-- Previously these tables had "Public read" policies allowing unauthenticated
-- access. Events and jobs are now member-only features; directory listings
-- expose PII and must also be member-only.
-- Apply via Supabase dashboard SQL editor or CLI.
-- =============================================================================

-- events: replace public read with active-alumni-only read
DROP POLICY IF EXISTS "Public read published events" ON events;
CREATE POLICY "Active alumni read published events" ON events FOR SELECT
  USING (status = 'published' AND is_active_alumni());

-- jobs: replace public read with active-alumni-only read
DROP POLICY IF EXISTS "Public read published jobs" ON jobs;
CREATE POLICY "Active alumni read published jobs" ON jobs FOR SELECT
  USING (status = 'published' AND is_active_alumni());

-- alumni_profiles (directory): replace public read with active-alumni-only read
-- Alumni can still always read their own profile via the existing
-- "Alumni read own profile" policy (auth.uid() = id), regardless of status.
DROP POLICY IF EXISTS "Public read active alumni" ON alumni_profiles;
CREATE POLICY "Active alumni read directory" ON alumni_profiles FOR SELECT
  USING (status = 'active' AND is_active_alumni());
