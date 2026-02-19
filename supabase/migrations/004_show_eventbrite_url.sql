-- Add eventbrite_url to shows table
ALTER TABLE shows ADD COLUMN IF NOT EXISTS eventbrite_url TEXT DEFAULT '';
