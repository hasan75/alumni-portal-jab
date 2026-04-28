-- =============================================================================
-- Migration 019: Enforce profile privacy flags via database view
--
-- 1. Creates is_active_profile() helper (SECURITY DEFINER) so cross-table
--    RLS checks work without needing SELECT access to alumni_profiles.
-- 2. Rewrites alumni_education and alumni_work_experience read policies.
-- 3. Drops "Active alumni read directory" — no more full-column reads
--    of other people's profiles.
-- 4. Creates alumni_directory_view with privacy-flag masking.
-- =============================================================================

-- ── Step 1: Helper function for cross-table status checks ──
CREATE OR REPLACE FUNCTION is_active_profile(profile_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM alumni_profiles
    WHERE id = profile_id AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = public;

-- ── Step 2: Rewrite education read policy ──────────────────
DROP POLICY IF EXISTS "Active alumni read education" ON alumni_education;
CREATE POLICY "Active alumni read education" ON alumni_education FOR SELECT
  USING (is_active_profile(alumni_id) AND is_active_alumni());

-- ── Step 3: Rewrite work experience read policy ────────────
DROP POLICY IF EXISTS "Active alumni read work" ON alumni_work_experience;
CREATE POLICY "Active alumni read work" ON alumni_work_experience FOR SELECT
  USING (is_active_profile(alumni_id) AND is_active_alumni());

-- ── Step 4: Drop the broad directory read policy ───────────
DROP POLICY IF EXISTS "Active alumni read directory" ON alumni_profiles;

-- ── Step 5: Create privacy-respecting directory view ───────
-- Owned by postgres (bypasses RLS on base table via security_invoker=false).
-- Access gated by is_active_alumni() in WHERE clause.
DROP VIEW IF EXISTS alumni_directory_view;

CREATE VIEW alumni_directory_view
WITH (security_invoker = false)
AS
SELECT
  p.id,
  p.full_name,
  p.display_name,
  p.avatar_url,
  p.cover_photo_url,
  p.batch_year,
  p.department,
  p.degree,
  p.graduation_year,
  p.gender,
  p.city,
  p.country,
  p.current_status,
  p.featured_education_summary,
  p.featured_work_summary,
  p.linkedin_url,
  p.facebook_url,
  p.portfolio_url,
  p.bio,
  p.skills,
  p.is_verified,
  p.status,
  p.created_at,
  CASE WHEN p.show_email = true THEN p.email ELSE NULL END AS email,
  CASE WHEN p.show_phone = true THEN p.phone ELSE NULL END AS phone,
  CASE WHEN p.show_dob = true THEN p.date_of_birth ELSE NULL END AS date_of_birth,
  p.show_email,
  p.show_phone,
  p.show_dob
FROM alumni_profiles p
WHERE p.status = 'active'
  AND public.is_active_alumni();

-- ── Step 6: Grant access ───────────────────────────────────
GRANT SELECT ON alumni_directory_view TO authenticated;
REVOKE ALL ON alumni_directory_view FROM anon;
