-- Add auth_id column to members table to link members to Supabase Auth accounts
ALTER TABLE members ADD COLUMN auth_id uuid REFERENCES auth.users(id);
CREATE INDEX idx_members_auth_id ON members(auth_id);
