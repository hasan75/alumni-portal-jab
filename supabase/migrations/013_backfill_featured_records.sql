-- ============================================================
-- Migration 013: Backfill featured records for existing members
-- ============================================================

-- Auto-feature the first is_current education for members who have no featured education
UPDATE alumni_education SET is_featured = true
WHERE id IN (
  SELECT DISTINCT ON (alumni_id) id
  FROM alumni_education
  WHERE alumni_id NOT IN (
    SELECT alumni_id FROM alumni_education WHERE is_featured = true
  )
  ORDER BY alumni_id, is_current DESC, start_year DESC NULLS LAST
);

-- Build featured_education_summary for newly featured education records
UPDATE alumni_profiles SET featured_education_summary = sub.summary
FROM (
  SELECT
    e.alumni_id,
    CASE
      WHEN e.degree IS NOT NULL AND e.field_of_study IS NOT NULL THEN e.degree || ' ' || e.field_of_study || ' · ' || e.institution
      WHEN e.degree IS NOT NULL THEN e.degree || ' · ' || e.institution
      WHEN e.field_of_study IS NOT NULL THEN e.field_of_study || ' · ' || e.institution
      ELSE e.institution
    END AS summary
  FROM alumni_education e
  WHERE e.is_featured = true
) sub
WHERE alumni_profiles.id = sub.alumni_id
AND alumni_profiles.featured_education_summary IS NULL;

-- Auto-feature the first is_current work for members who have no featured work
UPDATE alumni_work_experience SET is_featured = true
WHERE id IN (
  SELECT DISTINCT ON (alumni_id) id
  FROM alumni_work_experience
  WHERE alumni_id NOT IN (
    SELECT alumni_id FROM alumni_work_experience WHERE is_featured = true
  )
  ORDER BY alumni_id, is_current DESC, start_date DESC NULLS LAST
);

-- Build featured_work_summary for newly featured work records
UPDATE alumni_profiles SET featured_work_summary = sub.summary
FROM (
  SELECT
    w.alumni_id,
    w.job_title || ' at ' || w.company AS summary
  FROM alumni_work_experience w
  WHERE w.is_featured = true
) sub
WHERE alumni_profiles.id = sub.alumni_id
AND alumni_profiles.featured_work_summary IS NULL;
