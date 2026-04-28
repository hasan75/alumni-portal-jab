-- Drop the global unique constraint on student_id.
-- Roll numbers restart each batch, so uniqueness is only meaningful
-- within a (student_id, batch_year) pair where both are present.
ALTER TABLE alumni_profiles DROP CONSTRAINT IF EXISTS alumni_profiles_student_id_key;

-- Partial composite unique index: enforces no duplicate roll numbers
-- within the same batch, but ignores rows where either value is NULL.
CREATE UNIQUE INDEX alumni_profiles_student_id_batch_year_key
  ON alumni_profiles (student_id, batch_year)
  WHERE student_id IS NOT NULL AND batch_year IS NOT NULL;
