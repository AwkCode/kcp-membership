-- Members table
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  membership_token TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Checkins table
CREATE TABLE IF NOT EXISTS checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  checked_in_by UUID, -- staff user id from supabase auth
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_members_token ON members(membership_token);
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_members_name ON members(LOWER(first_name), LOWER(last_name));
CREATE INDEX idx_checkins_member ON checkins(member_id);
CREATE INDEX idx_checkins_created ON checkins(created_at DESC);

-- Enable RLS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;

-- Public can insert members (for /join)
CREATE POLICY "Anyone can insert members" ON members
  FOR INSERT WITH CHECK (true);

-- Public can read member by token (for /m/[token])
CREATE POLICY "Anyone can read member by token" ON members
  FOR SELECT USING (true);

-- Authenticated staff can do anything
CREATE POLICY "Staff can update members" ON members
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can delete members" ON members
  FOR DELETE USING (auth.role() = 'authenticated');

-- Checkins: staff only
CREATE POLICY "Staff can insert checkins" ON checkins
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Staff can read checkins" ON checkins
  FOR SELECT USING (auth.role() = 'authenticated');

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
