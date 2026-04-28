-- =============================================================================
-- Migration 018: Split editor/admin RLS — restrict admin-only tables
--
-- Replaces is_admin_user() with is_super_admin() on tables that only
-- full admins (role='admin') should manage. Editors retain access to
-- content tables (events, articles, jobs, feed, batches).
--
-- Self-management policies (alumni manage own education/work/links)
-- are NOT affected — members can still edit their own data.
-- =============================================================================

-- ── app_config (site settings — admin only) ──────────────
DROP POLICY IF EXISTS "Admin write app_config" ON app_config;
CREATE POLICY "Admin write app_config" ON app_config FOR ALL
  USING (is_super_admin()) WITH CHECK (is_super_admin());

-- ── alumni_profiles (member management — admin only) ─────
DROP POLICY IF EXISTS "Admin manage alumni" ON alumni_profiles;
CREATE POLICY "Admin manage alumni" ON alumni_profiles FOR ALL
  USING (is_super_admin()) WITH CHECK (is_super_admin());

-- ── alumni_education (admin management — admin only) ─────
DROP POLICY IF EXISTS "Admin manage education" ON alumni_education;
CREATE POLICY "Admin manage education" ON alumni_education FOR ALL
  USING (is_super_admin()) WITH CHECK (is_super_admin());

-- ── alumni_work_experience (admin management — admin only)
DROP POLICY IF EXISTS "Admin manage work" ON alumni_work_experience;
CREATE POLICY "Admin manage work" ON alumni_work_experience FOR ALL
  USING (is_super_admin()) WITH CHECK (is_super_admin());

-- ── social_platforms (platform definitions — admin only) ─
DROP POLICY IF EXISTS "Admin manage platforms" ON social_platforms;
CREATE POLICY "Admin manage platforms" ON social_platforms FOR ALL
  USING (is_super_admin()) WITH CHECK (is_super_admin());

-- ── audit_log (sensitive logs — admin only) ──────────────
DROP POLICY IF EXISTS "Admin read audit_log" ON audit_log;
CREATE POLICY "Admin read audit_log" ON audit_log FOR SELECT
  USING (is_super_admin());

DROP POLICY IF EXISTS "Admin insert audit_log" ON audit_log;
CREATE POLICY "Admin insert audit_log" ON audit_log FOR INSERT
  WITH CHECK (is_super_admin() OR auth.role() = 'service_role');
