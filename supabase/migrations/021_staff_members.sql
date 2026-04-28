-- ============================================================
-- Migration 021: Staff Members
-- ============================================================

-- 1. Create table
CREATE TABLE staff_members (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  designation TEXT NOT NULL
    CHECK (designation IN (
      'headmaster',
      'assistant_headmaster',
      'senior_teacher',
      'assistant_teacher',
      'physical_education_teacher',
      'librarian',
      'office_assistant',
      'night_guard',
      'peon'
    )),
  employment_status TEXT NOT NULL DEFAULT 'current'
    CHECK (employment_status IN ('current', 'left', 'retired', 'deceased')),
  photo_url       TEXT,
  phone           TEXT,
  subject         TEXT,
  joining_year    INTEGER,
  sort_order      INTEGER DEFAULT 0,
  is_featured     BOOLEAN DEFAULT FALSE,
  bio             TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_staff_members_designation ON staff_members(designation);
CREATE INDEX idx_staff_members_status      ON staff_members(employment_status);
CREATE INDEX idx_staff_members_sort        ON staff_members(sort_order, designation);

-- 2. Auto-update updated_at (reuse existing function from migration 003)
CREATE TRIGGER update_staff_members_updated_at
  BEFORE UPDATE ON staff_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. RLS
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read staff_members"
  ON staff_members FOR SELECT
  USING (true);

CREATE POLICY "Admin manage staff_members"
  ON staff_members FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- 4. Storage bucket for staff photos
INSERT INTO storage.buckets (id, name, public) VALUES ('staff', 'staff', true);

CREATE POLICY "Anyone can view staff images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'staff');

CREATE POLICY "Admins can upload staff images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'staff' AND public.is_admin_user());

CREATE POLICY "Admins can update staff images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'staff' AND public.is_admin_user());

CREATE POLICY "Admins can delete staff images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'staff' AND public.is_admin_user());
