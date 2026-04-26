-- ============================================================
-- Migration 009: Member current status + URL fields
-- ============================================================

-- Add current_status to profiles
ALTER TABLE alumni_profiles
ADD COLUMN current_status TEXT DEFAULT 'other'
CHECK (current_status IN ('studying', 'working', 'business', 'studying_and_working', 'other'));

-- Denormalized fields for directory card display (avoids JOINs)
ALTER TABLE alumni_profiles ADD COLUMN current_institution TEXT;
ALTER TABLE alumni_profiles ADD COLUMN current_degree TEXT;

-- Optional URL on education records (institution website)
ALTER TABLE alumni_education ADD COLUMN url TEXT;

-- Optional URL on work experience records (company/business website)
ALTER TABLE alumni_work_experience ADD COLUMN url TEXT;
