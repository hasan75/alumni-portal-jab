-- Prevent alumni from modifying admin-only fields on their own feed posts.
-- Protects: is_pinned, status, removed_by, removal_reason

CREATE OR REPLACE FUNCTION protect_feed_post_admin_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Service role can change anything
  IF current_setting('request.jwt.claims', true)::json->>'role' = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- Admin users can change anything
  IF EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true) THEN
    RETURN NEW;
  END IF;

  -- Regular users: revert admin-only fields
  NEW.is_pinned := OLD.is_pinned;
  NEW.status := OLD.status;
  NEW.removed_by := OLD.removed_by;
  NEW.removal_reason := OLD.removal_reason;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER protect_feed_post_admin_fields
  BEFORE UPDATE ON feed_posts
  FOR EACH ROW
  EXECUTE FUNCTION protect_feed_post_admin_fields();
