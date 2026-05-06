-- =============================================================================
-- Migration 023: Member job submissions
--
-- Allows active alumni to submit job postings for admin review.
-- Uses the existing `posted_by` (UUID FK) and `alumni_posted` (boolean)
-- columns. Adds `pending_review` as a valid status value and three
-- RLS policies scoped to the submitter.
-- =============================================================================

-- ── 1. Extend status CHECK constraint ────────────────────────────────────────
ALTER TABLE jobs
  DROP CONSTRAINT IF EXISTS jobs_status_check;

ALTER TABLE jobs
  ADD CONSTRAINT jobs_status_check
    CHECK (status IN ('draft', 'published', 'closed', 'archived', 'pending_review'));

-- ── 2. RLS: active alumni can INSERT their own pending submission ─────────────
CREATE POLICY "Alumni submit job"
  ON jobs FOR INSERT
  WITH CHECK (
    is_active_alumni()
    AND posted_by = auth.uid()
    AND alumni_posted = TRUE
    AND status = 'pending_review'
  );

-- ── 3. RLS: alumni can SELECT their own submissions (any status) ─────────────
CREATE POLICY "Alumni read own submissions"
  ON jobs FOR SELECT
  USING (
    is_active_alumni()
    AND posted_by = auth.uid()
  );

-- ── 4. RLS: alumni can UPDATE only while still pending_review ────────────────
CREATE POLICY "Alumni update own pending submission"
  ON jobs FOR UPDATE
  USING (
    is_active_alumni()
    AND posted_by = auth.uid()
    AND status = 'pending_review'
  )
  WITH CHECK (
    posted_by = auth.uid()
    AND alumni_posted = TRUE
    AND status = 'pending_review'
  );

-- ── 5. RLS: alumni can DELETE (withdraw) only their pending_review jobs ───────
CREATE POLICY "Alumni withdraw own pending submission"
  ON jobs FOR DELETE
  USING (
    is_active_alumni()
    AND posted_by = auth.uid()
    AND status = 'pending_review'
  );
