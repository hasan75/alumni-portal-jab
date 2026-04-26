-- =============================================================================
-- Alumni Association — Initial Schema
-- Migration 001: Core Tables
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- app_config — key/value branding & settings
-- =============================================================================

CREATE TABLE app_config (
  key TEXT PRIMARY KEY,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- batches — graduation year groups
-- =============================================================================

CREATE TABLE batches (
  id SERIAL PRIMARY KEY,
  year INTEGER UNIQUE NOT NULL,
  label TEXT,                        -- "Class of 2015"
  description TEXT,
  member_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_batches_year ON batches(year);

-- =============================================================================
-- alumni_profiles — FK to auth.users
-- =============================================================================

CREATE TABLE alumni_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  cover_photo_url TEXT,
  student_id TEXT UNIQUE,
  batch_year INTEGER REFERENCES batches(year),
  department TEXT,
  degree TEXT,
  graduation_year INTEGER,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  phone TEXT,
  city TEXT,
  country TEXT DEFAULT 'Unknown',
  current_job_title TEXT,
  current_company TEXT,
  industry TEXT,
  bio TEXT,
  skills TEXT[],
  -- Privacy flags
  show_email BOOLEAN DEFAULT FALSE,
  show_phone BOOLEAN DEFAULT FALSE,
  show_dob BOOLEAN DEFAULT FALSE,
  -- Status
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'suspended', 'rejected')),
  is_verified BOOLEAN DEFAULT FALSE,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alumni_profiles_status ON alumni_profiles(status);
CREATE INDEX idx_alumni_profiles_batch ON alumni_profiles(batch_year);
CREATE INDEX idx_alumni_profiles_email ON alumni_profiles(email);

-- =============================================================================
-- alumni_education — multiple degrees per alumni
-- =============================================================================

CREATE TABLE alumni_education (
  id SERIAL PRIMARY KEY,
  alumni_id UUID NOT NULL REFERENCES alumni_profiles(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  degree TEXT,
  field_of_study TEXT,
  start_year INTEGER,
  end_year INTEGER,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alumni_education_alumni ON alumni_education(alumni_id);

-- =============================================================================
-- alumni_work_experience
-- =============================================================================

CREATE TABLE alumni_work_experience (
  id SERIAL PRIMARY KEY,
  alumni_id UUID NOT NULL REFERENCES alumni_profiles(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  job_title TEXT NOT NULL,
  location TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alumni_work_alumni ON alumni_work_experience(alumni_id);

-- =============================================================================
-- social_platforms & social_links (reuse RajnitiXpress pattern)
-- entity_type: 'alumni' | 'organization'
-- entity_id: TEXT (UUID for alumni, 'org' for institution-level)
-- =============================================================================

CREATE TABLE social_platforms (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  base_url TEXT,
  color TEXT,
  placeholder TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE social_links (
  id SERIAL PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('alumni', 'organization')),
  entity_id TEXT NOT NULL,           -- UUID string for alumni, 'org' for institution
  platform_slug TEXT NOT NULL REFERENCES social_platforms(slug) ON DELETE CASCADE,
  url TEXT NOT NULL,
  username TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(entity_type, entity_id, platform_slug, url)
);

CREATE INDEX idx_social_links_entity ON social_links(entity_type, entity_id);

-- =============================================================================
-- events
-- =============================================================================

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ,
  location_name TEXT,
  location_address TEXT,
  is_online BOOLEAN DEFAULT FALSE,
  online_meeting_url TEXT,
  event_type TEXT NOT NULL DEFAULT 'general'
    CHECK (event_type IN ('reunion', 'seminar', 'networking', 'workshop', 'sports', 'cultural', 'general')),
  batch_year INTEGER REFERENCES batches(year),  -- NULL = all batches
  max_attendees INTEGER,
  cover_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
  rsvp_enabled BOOLEAN DEFAULT TRUE,
  rsvp_deadline TIMESTAMPTZ,
  rsvp_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_status ON events(status, start_datetime);
CREATE INDEX idx_events_batch ON events(batch_year);
CREATE INDEX idx_events_slug ON events(slug);

-- =============================================================================
-- event_rsvps
-- =============================================================================

CREATE TABLE event_rsvps (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  alumni_id UUID NOT NULL REFERENCES alumni_profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('going', 'maybe', 'not_going')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, alumni_id)
);

CREATE INDEX idx_event_rsvps_event ON event_rsvps(event_id);
CREATE INDEX idx_event_rsvps_alumni ON event_rsvps(alumni_id);

-- =============================================================================
-- article_categories, article_tags, articles, article_tag_relations
-- =============================================================================

CREATE TABLE article_categories (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE article_tags (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  excerpt TEXT,
  content TEXT,
  featured_image_url TEXT,
  og_image_url TEXT,
  category_id INTEGER REFERENCES article_categories(id),
  author_name TEXT,
  author_bio TEXT,
  author_avatar_url TEXT,
  author_alumni_id UUID REFERENCES alumni_profiles(id),
  meta_title TEXT,
  meta_description TEXT,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  reading_time_minutes INTEGER,
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_breaking BOOLEAN DEFAULT FALSE,
  editor_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_articles_status ON articles(status, published_at);
CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_articles_slug ON articles(slug);

CREATE TABLE article_tag_relations (
  id SERIAL PRIMARY KEY,
  article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES article_tags(id) ON DELETE CASCADE,
  UNIQUE(article_id, tag_id)
);

-- =============================================================================
-- job_categories, jobs
-- =============================================================================

CREATE TABLE job_categories (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  company_logo_url TEXT,
  company_website TEXT,
  category_id INTEGER REFERENCES job_categories(id),
  description TEXT,
  requirements TEXT,
  benefits TEXT,
  location TEXT,
  is_remote BOOLEAN DEFAULT FALSE,
  job_type TEXT NOT NULL DEFAULT 'full_time'
    CHECK (job_type IN ('full_time', 'part_time', 'contract', 'internship', 'freelance')),
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT DEFAULT 'USD',
  is_salary_visible BOOLEAN DEFAULT TRUE,
  apply_url TEXT,
  apply_email TEXT,
  application_deadline DATE,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'closed', 'archived')),
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  posted_by UUID REFERENCES auth.users(id),
  alumni_posted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_jobs_status ON jobs(status, created_at);
CREATE INDEX idx_jobs_category ON jobs(category_id);
CREATE INDEX idx_jobs_slug ON jobs(slug);

-- =============================================================================
-- feed_posts, feed_reactions, feed_comments
-- =============================================================================

CREATE TABLE feed_posts (
  id SERIAL PRIMARY KEY,
  author_id UUID NOT NULL REFERENCES alumni_profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_urls TEXT[],
  post_scope TEXT NOT NULL DEFAULT 'general'
    CHECK (post_scope IN ('general', 'batch')),
  batch_year INTEGER REFERENCES batches(year),
  reaction_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'published'
    CHECK (status IN ('published', 'hidden', 'removed')),
  removed_by UUID REFERENCES auth.users(id),
  removal_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feed_posts_author ON feed_posts(author_id);
CREATE INDEX idx_feed_posts_scope ON feed_posts(post_scope, batch_year, created_at);
CREATE INDEX idx_feed_posts_status ON feed_posts(status);

CREATE TABLE feed_reactions (
  post_id INTEGER NOT NULL REFERENCES feed_posts(id) ON DELETE CASCADE,
  alumni_id UUID NOT NULL REFERENCES alumni_profiles(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'love', 'celebrate', 'support')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY(post_id, alumni_id)
);

CREATE INDEX idx_feed_reactions_post ON feed_reactions(post_id);

CREATE TABLE feed_comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES feed_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES alumni_profiles(id) ON DELETE CASCADE,
  parent_comment_id INTEGER REFERENCES feed_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published'
    CHECK (status IN ('published', 'hidden', 'removed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feed_comments_post ON feed_comments(post_id);
CREATE INDEX idx_feed_comments_parent ON feed_comments(parent_comment_id);

-- =============================================================================
-- admin_users & audit_log (identical to RajnitiXpress)
-- =============================================================================

CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'editor'
    CHECK (role IN ('admin', 'editor', 'viewer')),
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete')),
  table_name TEXT NOT NULL,
  record_id TEXT,
  old_values JSONB,
  new_values JSONB,
  changed_fields TEXT[],
  description TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_log_table ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_user ON audit_log(user_id, created_at);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);
