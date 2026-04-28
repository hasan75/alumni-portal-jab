-- Migration 015: Add SET search_path = public to all SECURITY DEFINER functions
-- Prevents privilege escalation via schema shadowing (search_path injection)
-- See: https://supabase.com/docs/guides/database/functions#security-definer-vs-invoker

-- ============================================================
-- RLS helper functions (from 002_rls_policies.sql)
-- ============================================================

CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM admin_users
  WHERE id = auth.uid() AND is_active = TRUE;
  RETURN user_role IN ('admin', 'editor');
EXCEPTION
  WHEN NO_DATA_FOUND THEN RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = public;

CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM admin_users
  WHERE id = auth.uid() AND is_active = TRUE;
  RETURN user_role = 'admin';
EXCEPTION
  WHEN NO_DATA_FOUND THEN RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = public;

CREATE OR REPLACE FUNCTION is_active_alumni()
RETURNS BOOLEAN AS $$
DECLARE
  alumni_status TEXT;
BEGIN
  SELECT status INTO alumni_status
  FROM alumni_profiles
  WHERE id = auth.uid();
  RETURN alumni_status = 'active';
EXCEPTION
  WHEN NO_DATA_FOUND THEN RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = public;

-- ============================================================
-- Counter trigger functions (from 003_functions_triggers.sql)
-- ============================================================

CREATE OR REPLACE FUNCTION update_event_rsvp_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT' AND NEW.status = 'going') THEN
    UPDATE events SET rsvp_count = rsvp_count + 1 WHERE id = NEW.event_id;
  ELSIF (TG_OP = 'DELETE' AND OLD.status = 'going') THEN
    UPDATE events SET rsvp_count = GREATEST(0, rsvp_count - 1) WHERE id = OLD.event_id;
  ELSIF (TG_OP = 'UPDATE') THEN
    IF OLD.status != 'going' AND NEW.status = 'going' THEN
      UPDATE events SET rsvp_count = rsvp_count + 1 WHERE id = NEW.event_id;
    ELSIF OLD.status = 'going' AND NEW.status != 'going' THEN
      UPDATE events SET rsvp_count = GREATEST(0, rsvp_count - 1) WHERE id = NEW.event_id;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

CREATE OR REPLACE FUNCTION update_feed_reaction_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE feed_posts SET reaction_count = reaction_count + 1 WHERE id = NEW.post_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE feed_posts SET reaction_count = GREATEST(0, reaction_count - 1) WHERE id = OLD.post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

CREATE OR REPLACE FUNCTION update_feed_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT' AND NEW.status = 'published') THEN
    UPDATE feed_posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
  ELSIF (TG_OP = 'DELETE' AND OLD.status = 'published') THEN
    UPDATE feed_posts SET comment_count = GREATEST(0, comment_count - 1) WHERE id = OLD.post_id;
  ELSIF (TG_OP = 'UPDATE') THEN
    IF OLD.status = 'published' AND NEW.status != 'published' THEN
      UPDATE feed_posts SET comment_count = GREATEST(0, comment_count - 1) WHERE id = NEW.post_id;
    ELSIF OLD.status != 'published' AND NEW.status = 'published' THEN
      UPDATE feed_posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

CREATE OR REPLACE FUNCTION update_batch_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE') THEN
    IF OLD.status != 'active' AND NEW.status = 'active' AND NEW.batch_year IS NOT NULL THEN
      UPDATE batches SET member_count = member_count + 1 WHERE year = NEW.batch_year;
    ELSIF OLD.status = 'active' AND NEW.status != 'active' AND OLD.batch_year IS NOT NULL THEN
      UPDATE batches SET member_count = GREATEST(0, member_count - 1) WHERE year = OLD.batch_year;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- ============================================================
-- Slug generation (from 006_auto_slug_trigger.sql)
-- ============================================================

CREATE OR REPLACE FUNCTION generate_unique_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
  slug_exists BOOLEAN;
BEGIN
  IF NEW.slug IS NOT NULL AND NEW.slug != '' THEN
    RETURN NEW;
  END IF;

  IF TG_TABLE_NAME = 'jobs' AND NEW.company IS NOT NULL AND NEW.company != '' THEN
    base_slug := NEW.title || ' ' || NEW.company;
  ELSE
    base_slug := NEW.title;
  END IF;

  base_slug := lower(trim(base_slug));
  base_slug := regexp_replace(base_slug, '[^a-z0-9\s-]', '', 'g');
  base_slug := regexp_replace(base_slug, '[\s_-]+', '-', 'g');
  base_slug := regexp_replace(base_slug, '^-+|-+$', '', 'g');

  IF length(base_slug) > 80 THEN
    base_slug := left(base_slug, 80);
    base_slug := regexp_replace(base_slug, '-+$', '');
  END IF;

  final_slug := base_slug;
  LOOP
    EXECUTE format('SELECT EXISTS(SELECT 1 FROM %I WHERE slug = $1)', TG_TABLE_NAME)
      INTO slug_exists USING final_slug;
    EXIT WHEN NOT slug_exists;
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;

  NEW.slug := final_slug;
  RETURN NEW;
END;
$$;

-- ============================================================
-- Profile sensitive field protection (from 014_protect_profile_sensitive_fields.sql)
-- ============================================================

CREATE OR REPLACE FUNCTION protect_sensitive_profile_fields()
RETURNS TRIGGER AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  IF EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true) THEN
    RETURN NEW;
  END IF;

  NEW.status := OLD.status;
  NEW.approved_by := OLD.approved_by;
  NEW.approved_at := OLD.approved_at;
  NEW.is_verified := OLD.is_verified;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;
