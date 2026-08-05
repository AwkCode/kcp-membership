-- Add membership tier column
ALTER TABLE members ADD COLUMN tier TEXT NOT NULL DEFAULT 'free'
  CHECK (tier IN ('free'));

-- Fix outdated status CHECK constraint
-- Original migration only allowed (active, suspended, cancelled)
-- but the app already uses vip, staff, comp, expired
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_status_check;
ALTER TABLE members ADD CONSTRAINT members_status_check
  CHECK (status IN ('active', 'vip', 'staff', 'comp', 'suspended', 'cancelled', 'expired'));

-- Index for filtering by tier
CREATE INDEX idx_members_tier ON members(tier);
