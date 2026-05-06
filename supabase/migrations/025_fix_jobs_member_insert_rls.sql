-- =============================================================================
-- Migration 025: Fix member INSERT policy on jobs table
--
-- The original "Alumni submit job" policy called is_active_alumni() which is a
-- SECURITY DEFINER function. In some Supabase environments this can silently
-- return null/false inside an RLS WITH CHECK context. Replace it with an inline
-- EXISTS subquery so the status check runs directly as the authenticated role
-- (which can read its own alumni_profiles row via the "Alumni read own profile"
-- SELECT policy: auth.uid() = id).
--
-- Also explicitly targets TO authenticated to make the policy scope clear.
-- =============================================================================

-- ── Ensure pending_review is a valid status (idempotent) ─────────────────────
DO $$
DECLARE con_name TEXT;
BEGIN
  SELECT conname INTO con_name
  FROM pg_constraint
  WHERE conrelid = 'jobs'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) LIKE '%status%';

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE jobs DROP CONSTRAINT %I', con_name);
  END IF;
END;
$$;

ALTER TABLE jobs
  ADD CONSTRAINT jobs_status_check
    CHECK (status IN ('draft', 'published', 'closed', 'archived', 'pending_review'));

-- ── Recreate INSERT policy with inline active-alumni check ────────────────────
DROP POLICY IF EXISTS "Alumni submit job" ON jobs;

CREATE POLICY "Alumni submit job"
  ON jobs FOR INSERT
  TO authenticated
  WITH CHECK (
    posted_by = auth.uid()
    AND alumni_posted = TRUE
    AND status = 'pending_review'
    AND EXISTS (
      SELECT 1 FROM alumni_profiles
      WHERE id = auth.uid() AND status = 'active'
    )
  );

-- ── Recreate remaining member policies (make TO authenticated explicit) ───────
DROP POLICY IF EXISTS "Alumni read own submissions" ON jobs;
CREATE POLICY "Alumni read own submissions"
  ON jobs FOR SELECT
  TO authenticated
  USING (
    posted_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM alumni_profiles
      WHERE id = auth.uid() AND status = 'active'
    )
  );

DROP POLICY IF EXISTS "Alumni update own pending submission" ON jobs;
CREATE POLICY "Alumni update own pending submission"
  ON jobs FOR UPDATE
  TO authenticated
  USING (
    posted_by = auth.uid()
    AND status = 'pending_review'
    AND EXISTS (
      SELECT 1 FROM alumni_profiles
      WHERE id = auth.uid() AND status = 'active'
    )
  )
  WITH CHECK (
    posted_by = auth.uid()
    AND alumni_posted = TRUE
    AND status = 'pending_review'
  );

DROP POLICY IF EXISTS "Alumni withdraw own pending submission" ON jobs;
CREATE POLICY "Alumni withdraw own pending submission"
  ON jobs FOR DELETE
  TO authenticated
  USING (
    posted_by = auth.uid()
    AND status = 'pending_review'
    AND EXISTS (
      SELECT 1 FROM alumni_profiles
      WHERE id = auth.uid() AND status = 'active'
    )
  );
