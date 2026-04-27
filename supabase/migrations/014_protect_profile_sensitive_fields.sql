-- Prevent alumni from modifying sensitive profile columns (status, approved_by, approved_at, is_verified).
-- Service role and admin users are exempt.

CREATE OR REPLACE FUNCTION protect_sensitive_profile_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Service role (server API routes) can change anything
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  -- Admin users can change anything
  IF EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true) THEN
    RETURN NEW;
  END IF;

  -- Regular users: revert sensitive fields to their original values
  NEW.status := OLD.status;
  NEW.approved_by := OLD.approved_by;
  NEW.approved_at := OLD.approved_at;
  NEW.is_verified := OLD.is_verified;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER protect_profile_sensitive_fields
  BEFORE UPDATE ON alumni_profiles
  FOR EACH ROW
  EXECUTE FUNCTION protect_sensitive_profile_fields();
