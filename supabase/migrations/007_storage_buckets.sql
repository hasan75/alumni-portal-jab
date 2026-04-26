-- ============================================================
-- Migration 007: Supabase Storage buckets for image uploads
-- ============================================================

-- Create storage buckets (public so images are accessible without auth tokens)
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('covers', 'covers', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('events', 'events', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('news', 'news', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('jobs', 'jobs', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('feed', 'feed', true);

-- ── RLS Policies ─────────────────────────────────────────────

-- Helper: reuse existing is_admin_user() from migration 002

-- AVATARS bucket
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload their own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'avatars' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'avatars' AND (auth.uid())::text = (storage.foldername(name))[1]);

-- COVERS bucket
CREATE POLICY "Anyone can view covers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'covers');

CREATE POLICY "Authenticated users can upload their own cover"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'covers' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own cover"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'covers' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own cover"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'covers' AND (auth.uid())::text = (storage.foldername(name))[1]);

-- EVENTS bucket (admin-only uploads)
CREATE POLICY "Anyone can view event images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'events');

CREATE POLICY "Admins can upload event images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'events' AND public.is_admin_user());

CREATE POLICY "Admins can update event images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'events' AND public.is_admin_user());

CREATE POLICY "Admins can delete event images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'events' AND public.is_admin_user());

-- NEWS bucket (admin-only uploads)
CREATE POLICY "Anyone can view news images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'news');

CREATE POLICY "Admins can upload news images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'news' AND public.is_admin_user());

CREATE POLICY "Admins can update news images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'news' AND public.is_admin_user());

CREATE POLICY "Admins can delete news images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'news' AND public.is_admin_user());

-- JOBS bucket (admin-only uploads)
CREATE POLICY "Anyone can view job images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'jobs');

CREATE POLICY "Admins can upload job images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'jobs' AND public.is_admin_user());

CREATE POLICY "Admins can update job images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'jobs' AND public.is_admin_user());

CREATE POLICY "Admins can delete job images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'jobs' AND public.is_admin_user());

-- FEED bucket (authenticated users upload to their own folder)
CREATE POLICY "Anyone can view feed images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'feed');

CREATE POLICY "Authenticated users can upload feed images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'feed' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own feed images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'feed' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own feed images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'feed' AND (auth.uid())::text = (storage.foldername(name))[1]);

-- Admin override: admins can manage all storage objects
CREATE POLICY "Admins can manage all storage objects"
  ON storage.objects FOR ALL
  TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());
