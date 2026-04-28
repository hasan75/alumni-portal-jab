-- =============================================================================
-- Alumni Association — Seed Data
-- Run automatically by: supabase db reset
-- Run manually via:     supabase db push (does NOT run seed.sql)
--                       Paste into Supabase SQL Editor to run manually
-- =============================================================================

-- =============================================================================
-- app_config defaults
-- =============================================================================

INSERT INTO app_config (key, value, description) VALUES
  ('app_name', 'JAB Alumni', 'The name of this alumni association portal'),
  ('institution_name', 'Janata Adarsha Bidyapith', 'Full name of the institution'),
  ('primary_color', '#2563EB', 'Primary brand color (hex)'),
  ('logo_url', '', 'URL to the institution logo'),
  ('founded_year', '1969', 'Year the institution was founded'),
  ('tagline', 'Connecting the alumni of Janata Adarsha Bidyapith since 1969', 'Short tagline for the portal'),
  ('contact_email', '', 'Primary contact email for alumni inquiries'),
  ('contact_phone', '', 'Primary contact phone number'),
  ('website_url', '', 'Official institution website URL')
ON CONFLICT (key) DO NOTHING;

-- =============================================================================
-- social_platforms
-- =============================================================================

INSERT INTO social_platforms (slug, name, icon, base_url, color, placeholder, sort_order) VALUES
  ('facebook', 'Facebook', 'pi pi-facebook', 'https://facebook.com/', '#1877F2', 'https://facebook.com/username', 1),
  ('linkedin', 'LinkedIn', 'pi pi-linkedin', 'https://linkedin.com/in/', '#0A66C2', 'https://linkedin.com/in/username', 2),
  ('twitter', 'X (Twitter)', 'pi pi-twitter', 'https://x.com/', '#000000', 'https://x.com/username', 3),
  ('github', 'GitHub', 'pi pi-github', 'https://github.com/', '#24292e', 'https://github.com/username', 4),
  ('instagram', 'Instagram', 'pi pi-instagram', 'https://instagram.com/', '#E4405F', 'https://instagram.com/username', 5),
  ('youtube', 'YouTube', 'pi pi-youtube', 'https://youtube.com/', '#FF0000', 'https://youtube.com/@channel', 6),
  ('website', 'Website', 'pi pi-globe', NULL, '#6366F1', 'https://yourwebsite.com', 7),
  ('email', 'Email', 'pi pi-envelope', 'mailto:', '#EA4335', 'you@example.com', 8)
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- article_categories
-- =============================================================================

INSERT INTO article_categories (code, name, description, display_order) VALUES
  ('news', 'News', 'General alumni news and updates', 1),
  ('achievement', 'Achievement', 'Alumni achievements and milestones', 2),
  ('announcement', 'Announcement', 'Official announcements from the association', 3),
  ('story', 'Story', 'Alumni stories and features', 4),
  ('research', 'Research', 'Academic research and publications', 5),
  ('opinion', 'Opinion', 'Opinion pieces and editorials', 6)
ON CONFLICT (code) DO NOTHING;

-- =============================================================================
-- job_categories
-- =============================================================================

INSERT INTO job_categories (code, name, display_order) VALUES
  ('technology', 'Technology', 1),
  ('finance', 'Finance', 2),
  ('healthcare', 'Healthcare', 3),
  ('education', 'Education', 4),
  ('engineering', 'Engineering', 5),
  ('marketing', 'Marketing', 6),
  ('legal', 'Legal', 7),
  ('consulting', 'Consulting', 8),
  ('design', 'Design', 9),
  ('other', 'Other', 10)
ON CONFLICT (code) DO NOTHING;

-- =============================================================================
-- Sample batches
-- =============================================================================

INSERT INTO batches (year, label) VALUES
  (2015, 'Class of 2015'),
  (2016, 'Class of 2016'),
  (2017, 'Class of 2017'),
  (2018, 'Class of 2018'),
  (2019, 'Class of 2019'),
  (2020, 'Class of 2020'),
  (2021, 'Class of 2021'),
  (2022, 'Class of 2022'),
  (2023, 'Class of 2023'),
  (2024, 'Class of 2024')
ON CONFLICT (year) DO NOTHING;
