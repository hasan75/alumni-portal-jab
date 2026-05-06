-- =============================================================================
-- Migration 028: Full-history search columns for directory
--
-- current_institution / current_job_title (from 027) only capture the
-- featured record, so searching "NDC" or "Apple" misses alumni who attended
-- or worked there in the past. These two columns aggregate ALL records so
-- every institution and every company is searchable.
-- =============================================================================

ALTER TABLE alumni_profiles
  ADD COLUMN IF NOT EXISTS all_institutions TEXT,
  ADD COLUMN IF NOT EXISTS all_companies    TEXT;

-- Backfill all_institutions from every education record per alumni
UPDATE alumni_profiles ap
SET all_institutions = sub.names
FROM (
  SELECT alumni_id, string_agg(institution, ' | ' ORDER BY start_year DESC NULLS LAST) AS names
  FROM alumni_education
  GROUP BY alumni_id
) sub
WHERE ap.id = sub.alumni_id;

-- Backfill all_companies from every work experience record per alumni
UPDATE alumni_profiles ap
SET all_companies = sub.names
FROM (
  SELECT alumni_id, string_agg(company, ' | ' ORDER BY start_date DESC NULLS LAST) AS names
  FROM alumni_work_experience
  GROUP BY alumni_id
) sub
WHERE ap.id = sub.alumni_id;

-- Recreate directory view to expose new columns (gate identical to 027)
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
  p.all_institutions,
  p.all_companies,
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
