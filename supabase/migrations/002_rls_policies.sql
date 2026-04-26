-- =============================================================================
-- Alumni Association — RLS Policies
-- Migration 002
-- =============================================================================

-- =============================================================================
-- Helper functions (SECURITY DEFINER to avoid infinite recursion)
-- =============================================================================

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
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

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
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

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
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- =============================================================================
-- Enable RLS on all tables
-- =============================================================================

ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumni_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumni_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumni_work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tag_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- app_config — public read, admin write
-- =============================================================================

CREATE POLICY "Public read app_config" ON app_config FOR SELECT USING (true);
CREATE POLICY "Admin write app_config" ON app_config FOR ALL
  USING (is_admin_user()) WITH CHECK (is_admin_user());

-- =============================================================================
-- batches — public read, admin write
-- =============================================================================

CREATE POLICY "Public read batches" ON batches FOR SELECT USING (true);
CREATE POLICY "Admin write batches" ON batches FOR ALL
  USING (is_admin_user()) WITH CHECK (is_admin_user());

-- =============================================================================
-- alumni_profiles — tiered access
-- Public: limited fields (handled at query level)
-- Authenticated active alumni: read all active profiles + their own
-- Admin: full access
-- =============================================================================

-- Anyone can read active profiles (query-level filtering of sensitive columns)
CREATE POLICY "Public read active alumni" ON alumni_profiles FOR SELECT
  USING (status = 'active');

-- Alumni can always read their own profile (regardless of status)
CREATE POLICY "Alumni read own profile" ON alumni_profiles FOR SELECT
  USING (auth.uid() = id);

-- Alumni can update their own profile
CREATE POLICY "Alumni update own profile" ON alumni_profiles FOR UPDATE
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Admin full access
CREATE POLICY "Admin manage alumni" ON alumni_profiles FOR ALL
  USING (is_admin_user()) WITH CHECK (is_admin_user());

-- Service role can insert (registration handler)
CREATE POLICY "Service role insert alumni" ON alumni_profiles FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR auth.uid() = id);

-- =============================================================================
-- alumni_education — active alumni + own records
-- =============================================================================

CREATE POLICY "Active alumni read education" ON alumni_education FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM alumni_profiles p
      WHERE p.id = alumni_id AND p.status = 'active'
    )
  );

CREATE POLICY "Alumni manage own education" ON alumni_education FOR ALL
  USING (auth.uid() = alumni_id) WITH CHECK (auth.uid() = alumni_id);

CREATE POLICY "Admin manage education" ON alumni_education FOR ALL
  USING (is_admin_user()) WITH CHECK (is_admin_user());

-- =============================================================================
-- alumni_work_experience
-- =============================================================================

CREATE POLICY "Active alumni read work" ON alumni_work_experience FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM alumni_profiles p
      WHERE p.id = alumni_id AND p.status = 'active'
    )
  );

CREATE POLICY "Alumni manage own work" ON alumni_work_experience FOR ALL
  USING (auth.uid() = alumni_id) WITH CHECK (auth.uid() = alumni_id);

CREATE POLICY "Admin manage work" ON alumni_work_experience FOR ALL
  USING (is_admin_user()) WITH CHECK (is_admin_user());

-- =============================================================================
-- social_platforms & social_links
-- =============================================================================

CREATE POLICY "Public read platforms" ON social_platforms FOR SELECT USING (is_active = true);
CREATE POLICY "Admin manage platforms" ON social_platforms FOR ALL
  USING (is_admin_user()) WITH CHECK (is_admin_user());

CREATE POLICY "Active alumni read social links" ON social_links FOR SELECT
  USING (is_active_alumni() OR is_admin_user());

CREATE POLICY "Alumni manage own social links" ON social_links FOR ALL
  USING (
    entity_type = 'alumni' AND entity_id = auth.uid()::text
    OR is_admin_user()
  )
  WITH CHECK (
    entity_type = 'alumni' AND entity_id = auth.uid()::text
    OR is_admin_user()
  );

-- =============================================================================
-- events — public read published, member RSVP, admin full
-- =============================================================================

CREATE POLICY "Public read published events" ON events FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admin manage events" ON events FOR ALL
  USING (is_admin_user()) WITH CHECK (is_admin_user());

-- =============================================================================
-- event_rsvps — active alumni only
-- =============================================================================

CREATE POLICY "Active alumni read rsvps" ON event_rsvps FOR SELECT
  USING (is_active_alumni() OR is_admin_user());

CREATE POLICY "Active alumni manage own rsvp" ON event_rsvps FOR ALL
  USING (auth.uid() = alumni_id AND is_active_alumni())
  WITH CHECK (auth.uid() = alumni_id AND is_active_alumni());

CREATE POLICY "Admin manage rsvps" ON event_rsvps FOR ALL
  USING (is_admin_user()) WITH CHECK (is_admin_user());

-- =============================================================================
-- article_categories & article_tags — public read
-- =============================================================================

CREATE POLICY "Public read article_categories" ON article_categories FOR SELECT USING (true);
CREATE POLICY "Admin manage article_categories" ON article_categories FOR ALL
  USING (is_admin_user()) WITH CHECK (is_admin_user());

CREATE POLICY "Public read article_tags" ON article_tags FOR SELECT USING (true);
CREATE POLICY "Admin manage article_tags" ON article_tags FOR ALL
  USING (is_admin_user()) WITH CHECK (is_admin_user());

-- =============================================================================
-- articles — public reads published, admin full
-- =============================================================================

CREATE POLICY "Public read published articles" ON articles FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admin manage articles" ON articles FOR ALL
  USING (is_admin_user()) WITH CHECK (is_admin_user());

CREATE POLICY "Public read article_tag_relations" ON article_tag_relations FOR SELECT
  USING (true);

CREATE POLICY "Admin manage article_tag_relations" ON article_tag_relations FOR ALL
  USING (is_admin_user()) WITH CHECK (is_admin_user());

-- =============================================================================
-- job_categories & jobs
-- =============================================================================

CREATE POLICY "Public read job_categories" ON job_categories FOR SELECT USING (true);
CREATE POLICY "Admin manage job_categories" ON job_categories FOR ALL
  USING (is_admin_user()) WITH CHECK (is_admin_user());

CREATE POLICY "Public read published jobs" ON jobs FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admin manage jobs" ON jobs FOR ALL
  USING (is_admin_user()) WITH CHECK (is_admin_user());

-- =============================================================================
-- feed_posts — active alumni only
-- =============================================================================

CREATE POLICY "Active alumni read published posts" ON feed_posts FOR SELECT
  USING (status = 'published' AND is_active_alumni());

CREATE POLICY "Active alumni read own posts" ON feed_posts FOR SELECT
  USING (auth.uid() = author_id AND is_active_alumni());

CREATE POLICY "Active alumni create posts" ON feed_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id AND is_active_alumni());

CREATE POLICY "Active alumni update own posts" ON feed_posts FOR UPDATE
  USING (auth.uid() = author_id AND is_active_alumni())
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Admin manage feed_posts" ON feed_posts FOR ALL
  USING (is_admin_user()) WITH CHECK (is_admin_user());

-- =============================================================================
-- feed_reactions
-- =============================================================================

CREATE POLICY "Active alumni read reactions" ON feed_reactions FOR SELECT
  USING (is_active_alumni());

CREATE POLICY "Active alumni manage own reactions" ON feed_reactions FOR ALL
  USING (auth.uid() = alumni_id AND is_active_alumni())
  WITH CHECK (auth.uid() = alumni_id AND is_active_alumni());

CREATE POLICY "Admin manage reactions" ON feed_reactions FOR ALL
  USING (is_admin_user()) WITH CHECK (is_admin_user());

-- =============================================================================
-- feed_comments
-- =============================================================================

CREATE POLICY "Active alumni read published comments" ON feed_comments FOR SELECT
  USING (status = 'published' AND is_active_alumni());

CREATE POLICY "Active alumni create comments" ON feed_comments FOR INSERT
  WITH CHECK (auth.uid() = author_id AND is_active_alumni());

CREATE POLICY "Active alumni update own comments" ON feed_comments FOR UPDATE
  USING (auth.uid() = author_id AND is_active_alumni())
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Admin manage comments" ON feed_comments FOR ALL
  USING (is_admin_user()) WITH CHECK (is_admin_user());

-- =============================================================================
-- admin_users
-- =============================================================================

CREATE POLICY "Admin users read own" ON admin_users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Super admin read all" ON admin_users FOR SELECT
  USING (is_super_admin());

CREATE POLICY "Super admin manage" ON admin_users FOR ALL
  USING (is_super_admin()) WITH CHECK (is_super_admin());

-- =============================================================================
-- audit_log — admin only
-- =============================================================================

CREATE POLICY "Admin read audit_log" ON audit_log FOR SELECT
  USING (is_admin_user());

CREATE POLICY "Admin insert audit_log" ON audit_log FOR INSERT
  WITH CHECK (is_admin_user() OR auth.role() = 'service_role');
