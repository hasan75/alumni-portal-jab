-- Enforce case-insensitive email uniqueness at the database level.
-- Registration normalizes to lowercase, but direct inserts could bypass it.

CREATE UNIQUE INDEX IF NOT EXISTS alumni_profiles_email_lower
  ON alumni_profiles (LOWER(email));
