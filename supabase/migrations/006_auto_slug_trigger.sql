-- =============================================================================
-- Alumni Association — Auto Slug Generation
-- Migration 006: BEFORE INSERT trigger for events, articles, jobs
-- =============================================================================

-- Reusable function: generates a unique slug from title on INSERT
-- For jobs, combines title + company. Handles collisions with -2, -3, etc.
-- If slug is already provided, leaves it as-is.

CREATE OR REPLACE FUNCTION generate_unique_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
  slug_exists BOOLEAN;
BEGIN
  -- Only generate if slug is empty or null
  IF NEW.slug IS NOT NULL AND NEW.slug != '' THEN
    RETURN NEW;
  END IF;

  -- Build source text: title + company for jobs, title for others
  IF TG_TABLE_NAME = 'jobs' AND NEW.company IS NOT NULL AND NEW.company != '' THEN
    base_slug := NEW.title || ' ' || NEW.company;
  ELSE
    base_slug := NEW.title;
  END IF;

  -- Slugify: lowercase, strip non-alphanumeric, collapse hyphens, trim
  base_slug := lower(trim(base_slug));
  base_slug := regexp_replace(base_slug, '[^a-z0-9\s-]', '', 'g');
  base_slug := regexp_replace(base_slug, '[\s_-]+', '-', 'g');
  base_slug := regexp_replace(base_slug, '^-+|-+$', '', 'g');

  -- Truncate to reasonable length (max 80 chars before suffix)
  IF length(base_slug) > 80 THEN
    base_slug := left(base_slug, 80);
    base_slug := regexp_replace(base_slug, '-+$', '');
  END IF;

  -- Find unique slug with collision handling
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

-- Attach to events
CREATE TRIGGER trg_events_auto_slug
  BEFORE INSERT ON events
  FOR EACH ROW EXECUTE FUNCTION generate_unique_slug();

-- Attach to articles
CREATE TRIGGER trg_articles_auto_slug
  BEFORE INSERT ON articles
  FOR EACH ROW EXECUTE FUNCTION generate_unique_slug();

-- Attach to jobs
CREATE TRIGGER trg_jobs_auto_slug
  BEFORE INSERT ON jobs
  FOR EACH ROW EXECUTE FUNCTION generate_unique_slug();
