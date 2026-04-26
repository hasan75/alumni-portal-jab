-- ============================================================
-- Migration 010: Featured education/work + social URL fields
-- ============================================================

-- Featured flag on education and work records
ALTER TABLE alumni_education ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE alumni_work_experience ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;

-- Denormalized card display fields on profiles
ALTER TABLE alumni_profiles ADD COLUMN featured_education_summary TEXT;
ALTER TABLE alumni_profiles ADD COLUMN featured_work_summary TEXT;
ALTER TABLE alumni_profiles ADD COLUMN linkedin_url TEXT;
ALTER TABLE alumni_profiles ADD COLUMN facebook_url TEXT;
ALTER TABLE alumni_profiles ADD COLUMN portfolio_url TEXT;
