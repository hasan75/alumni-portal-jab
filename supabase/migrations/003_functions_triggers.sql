-- =============================================================================
-- Alumni Association — Functions & Triggers
-- Migration 003
-- =============================================================================

-- =============================================================================
-- update_updated_at_column — reused pattern from RajnitiXpress
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_alumni_profiles_updated_at
  BEFORE UPDATE ON alumni_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_rsvps_updated_at
  BEFORE UPDATE ON event_rsvps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feed_posts_updated_at
  BEFORE UPDATE ON feed_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feed_comments_updated_at
  BEFORE UPDATE ON feed_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_links_updated_at
  BEFORE UPDATE ON social_links
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_app_config_updated_at
  BEFORE UPDATE ON app_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- RSVP count trigger
-- =============================================================================

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
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_event_rsvp_count
  AFTER INSERT OR UPDATE OR DELETE ON event_rsvps
  FOR EACH ROW EXECUTE FUNCTION update_event_rsvp_count();

-- =============================================================================
-- Feed reaction count trigger
-- =============================================================================

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
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_feed_reaction_count
  AFTER INSERT OR DELETE ON feed_reactions
  FOR EACH ROW EXECUTE FUNCTION update_feed_reaction_count();

-- =============================================================================
-- Feed comment count trigger
-- =============================================================================

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
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_feed_comment_count
  AFTER INSERT OR UPDATE OR DELETE ON feed_comments
  FOR EACH ROW EXECUTE FUNCTION update_feed_comment_count();

-- =============================================================================
-- Batch member count trigger
-- =============================================================================

CREATE OR REPLACE FUNCTION update_batch_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE') THEN
    -- When a profile becomes active, increment batch count
    IF OLD.status != 'active' AND NEW.status = 'active' AND NEW.batch_year IS NOT NULL THEN
      UPDATE batches SET member_count = member_count + 1 WHERE year = NEW.batch_year;
    -- When a profile is deactivated, decrement
    ELSIF OLD.status = 'active' AND NEW.status != 'active' AND OLD.batch_year IS NOT NULL THEN
      UPDATE batches SET member_count = GREATEST(0, member_count - 1) WHERE year = OLD.batch_year;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_batch_member_count
  AFTER UPDATE ON alumni_profiles
  FOR EACH ROW EXECUTE FUNCTION update_batch_member_count();
