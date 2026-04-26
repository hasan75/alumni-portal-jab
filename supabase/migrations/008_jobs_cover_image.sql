-- ============================================================
-- Migration 008: Add cover_image_url to jobs table
-- ============================================================

ALTER TABLE jobs ADD COLUMN cover_image_url TEXT;
