-- ============================================================
-- Migration 012: Drop deprecated profile columns
-- ============================================================

ALTER TABLE alumni_profiles DROP COLUMN IF EXISTS current_job_title;
ALTER TABLE alumni_profiles DROP COLUMN IF EXISTS current_company;
ALTER TABLE alumni_profiles DROP COLUMN IF EXISTS current_institution;
ALTER TABLE alumni_profiles DROP COLUMN IF EXISTS current_degree;
ALTER TABLE alumni_profiles DROP COLUMN IF EXISTS industry;
