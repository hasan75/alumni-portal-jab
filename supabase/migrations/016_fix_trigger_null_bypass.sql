-- Fix: check for service_role JWT claim instead of NULL auth.uid()
-- NULL auth.uid() also matches anonymous/unauthenticated requests, not just service role.

CREATE OR REPLACE FUNCTION protect_sensitive_profile_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Service role (server API routes) can change anything
  IF current_setting('request.jwt.claims', true)::json->>'role' = 'service_role' THEN
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
