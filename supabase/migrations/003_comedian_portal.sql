-- ============================================
-- Kings Court Boston — Comedian Portal & Booking
-- Migration 003
-- ============================================

-- Comedians table (profiles linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS comedians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE, -- links to Supabase Auth user
  display_name TEXT NOT NULL,
  legal_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  city TEXT,
  state TEXT,
  bio TEXT DEFAULT '',
  instagram TEXT,
  video_links TEXT[] DEFAULT '{}', -- array of URLs
  tags TEXT[] DEFAULT '{}', -- e.g. clean, improv, musical
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'banned')),
  notes TEXT DEFAULT '', -- staff internal notes
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Shows table (staff-managed schedule)
CREATE TABLE IF NOT EXISTS shows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  show_name TEXT NOT NULL, -- e.g. "Friday 10pm", "Saturday 9pm"
  show_date DATE NOT NULL,
  start_time TIME NOT NULL,
  venue TEXT DEFAULT 'Kings Court Boston',
  capacity_slots INTEGER NOT NULL DEFAULT 8,
  notes TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'canceled', 'closed')),
  created_by UUID, -- staff auth id
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Booking requests (comedian → show)
CREATE TABLE IF NOT EXISTS booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  show_id UUID NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
  comedian_id UUID NOT NULL REFERENCES comedians(id) ON DELETE CASCADE,
  requested_set_length INTEGER, -- minutes, optional
  message TEXT DEFAULT '', -- message to booker
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'waitlisted', 'approved', 'rejected', 'canceled')),
  reviewed_by UUID, -- staff auth id
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(show_id, comedian_id) -- prevent duplicate requests
);

-- Show lineup (confirmed performers + order)
CREATE TABLE IF NOT EXISTS show_lineup (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  show_id UUID NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
  comedian_id UUID NOT NULL REFERENCES comedians(id) ON DELETE CASCADE,
  slot_order INTEGER NOT NULL DEFAULT 0,
  set_length_minutes INTEGER DEFAULT 10,
  role TEXT DEFAULT 'performer' CHECK (role IN ('host', 'feature', 'headliner', 'guest', 'performer')),
  internal_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(show_id, comedian_id), -- one spot per comic per show
  UNIQUE(show_id, slot_order) -- unique order per show
);

-- Comedian check-ins at venue (optional but valuable)
CREATE TABLE IF NOT EXISTS comedian_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  show_id UUID NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
  comedian_id UUID NOT NULL REFERENCES comedians(id) ON DELETE CASCADE,
  checked_in_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  checked_in_by UUID, -- staff auth id
  UNIQUE(show_id, comedian_id)
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX idx_comedians_auth ON comedians(auth_id);
CREATE INDEX idx_comedians_email ON comedians(email);
CREATE INDEX idx_comedians_status ON comedians(status);
CREATE INDEX idx_shows_date ON shows(show_date);
CREATE INDEX idx_shows_status ON shows(status);
CREATE INDEX idx_booking_requests_show ON booking_requests(show_id);
CREATE INDEX idx_booking_requests_comedian ON booking_requests(comedian_id);
CREATE INDEX idx_booking_requests_status ON booking_requests(status);
CREATE INDEX idx_show_lineup_show ON show_lineup(show_id);
CREATE INDEX idx_comedian_checkins_show ON comedian_checkins(show_id);

-- ============================================
-- RLS Policies
-- ============================================

ALTER TABLE comedians ENABLE ROW LEVEL SECURITY;
ALTER TABLE shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE show_lineup ENABLE ROW LEVEL SECURITY;
ALTER TABLE comedian_checkins ENABLE ROW LEVEL SECURITY;

-- COMEDIANS: anyone can insert (signup), authenticated can read all, owner can update own
CREATE POLICY "Anyone can create comedian profile" ON comedians
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated can read comedians" ON comedians
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Comedian can update own profile" ON comedians
  FOR UPDATE USING (auth.uid() = auth_id);

CREATE POLICY "Staff can update any comedian" ON comedians
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can delete comedians" ON comedians
  FOR DELETE USING (auth.role() = 'authenticated');

-- SHOWS: anyone authenticated can read, staff can manage
CREATE POLICY "Authenticated can read shows" ON shows
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can insert shows" ON shows
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Staff can update shows" ON shows
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can delete shows" ON shows
  FOR DELETE USING (auth.role() = 'authenticated');

-- BOOKING REQUESTS: authenticated can read own, staff can manage all
CREATE POLICY "Authenticated can read booking requests" ON booking_requests
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can insert booking requests" ON booking_requests
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update booking requests" ON booking_requests
  FOR UPDATE USING (auth.role() = 'authenticated');

-- SHOW LINEUP: authenticated can read, staff can manage
CREATE POLICY "Authenticated can read lineup" ON show_lineup
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can insert lineup" ON show_lineup
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Staff can update lineup" ON show_lineup
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can delete lineup" ON show_lineup
  FOR DELETE USING (auth.role() = 'authenticated');

-- COMEDIAN CHECKINS: staff only
CREATE POLICY "Staff can insert comedian checkins" ON comedian_checkins
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can read comedian checkins" ON comedian_checkins
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================
-- Updated_at triggers
-- ============================================
CREATE TRIGGER comedians_updated_at
  BEFORE UPDATE ON comedians
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER shows_updated_at
  BEFORE UPDATE ON shows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER booking_requests_updated_at
  BEFORE UPDATE ON booking_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER show_lineup_updated_at
  BEFORE UPDATE ON show_lineup
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
