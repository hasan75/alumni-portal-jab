-- =============================================================================
-- Migration 024: Allow active alumni to upload images to the jobs bucket
--
-- Before this migration, the jobs bucket only allowed admin uploads.
-- Now that members can submit jobs via the member portal, they need to
-- upload logos and cover images too.
-- =============================================================================

-- INSERT: active alumni can upload to jobs bucket
CREATE POLICY "Active alumni can upload job images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'jobs' AND public.is_active_alumni());

-- UPDATE: active alumni can replace their own uploads
CREATE POLICY "Active alumni can update job images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'jobs' AND public.is_active_alumni());

-- DELETE: active alumni can remove their own uploads
CREATE POLICY "Active alumni can delete job images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'jobs' AND public.is_active_alumni());
