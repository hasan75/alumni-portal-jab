-- =============================================================================
-- Migration 022: Allow admin users to access alumni directory view
--
-- The alumni_directory_view gates access with is_active_alumni(), which
-- excludes admin users who don't have an alumni_profiles row.
-- Add is_admin_user() as an alternative gate so admins can browse the
-- directory from the public site.
-- =============================================================================

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
  AND (public.is_active_alumni() OR public.is_admin_user());

GRANT SELECT ON alumni_directory_view TO authenticated;
REVOKE ALL ON alumni_directory_view FROM anon;
