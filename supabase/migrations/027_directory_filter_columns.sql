-- =============================================================================
-- Migration 027: Structured filter columns for alumni directory
--
-- Adds 4 denormalized columns to alumni_profiles so directory queries can
-- filter by profession, industry, institution, and field of study without
-- expensive JOINs across education/work tables.
-- Columns are kept in sync by the existing recalcFeatured* composable logic.
-- =============================================================================

ALTER TABLE alumni_profiles
  ADD COLUMN IF NOT EXISTS current_job_title      TEXT,
  ADD COLUMN IF NOT EXISTS current_industry       TEXT,
  ADD COLUMN IF NOT EXISTS current_institution    TEXT,
  ADD COLUMN IF NOT EXISTS current_field_of_study TEXT;

-- Backfill from featured work records
UPDATE alumni_profiles ap
SET
  current_job_title = w.job_title,
  current_industry  = w.industry
FROM alumni_work_experience w
WHERE w.alumni_id = ap.id
  AND w.is_featured = true;

-- Backfill from featured education records
UPDATE alumni_profiles ap
SET
  current_institution      = e.institution,
  current_field_of_study   = e.field_of_study
FROM alumni_education e
WHERE e.alumni_id = ap.id
  AND e.is_featured = true;

-- Recreate directory view to expose new columns (keep gate identical to 022)
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
  p.current_job_title,
  p.current_industry,
  p.current_institution,
  p.current_field_of_study,
  p.linkedin_url,
  p.facebook_url,
  p.portfolio_url,
  p.bio,
  p.skills,
  p.is_verified,
  p.status,
  p.created_at,
  CASE WHEN p.show_email  = true THEN p.email         ELSE NULL END AS email,
  CASE WHEN p.show_phone  = true THEN p.phone         ELSE NULL END AS phone,
  CASE WHEN p.show_dob    = true THEN p.date_of_birth ELSE NULL END AS date_of_birth,
  p.show_email,
  p.show_phone,
  p.show_dob
FROM alumni_profiles p
WHERE p.status = 'active'
  AND (public.is_active_alumni() OR public.is_admin_user());

GRANT SELECT ON alumni_directory_view TO authenticated;
REVOKE ALL   ON alumni_directory_view FROM anon;
