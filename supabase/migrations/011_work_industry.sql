-- ============================================================
-- Migration 011: Add industry to work experience
-- ============================================================

ALTER TABLE alumni_work_experience ADD COLUMN industry TEXT;
