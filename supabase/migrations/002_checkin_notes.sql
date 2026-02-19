-- Add notes column to checkins table
ALTER TABLE checkins ADD COLUMN IF NOT EXISTS notes text;
