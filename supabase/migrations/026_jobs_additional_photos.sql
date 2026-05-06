-- =============================================================================
-- Migration 026: Add additional_photos to jobs table
-- Stores an ordered array of public storage URLs for gallery images shown
-- on the job detail page. Hard-capped at 4 photos via a CHECK constraint.
-- =============================================================================

ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS additional_photos TEXT[] NOT NULL DEFAULT '{}';

-- array_length returns NULL for an empty array, so allow NULL (= empty array)
ALTER TABLE jobs
  ADD CONSTRAINT jobs_additional_photos_max_4
  CHECK (array_length(additional_photos, 1) IS NULL OR array_length(additional_photos, 1) <= 4);
