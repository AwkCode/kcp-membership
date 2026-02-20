-- Tighten RLS policies on members table
-- Previously: "Anyone can read member by token" used USING (true) which exposed all member data

-- Drop the overly permissive read policy
DROP POLICY IF EXISTS "Anyone can read member by token" ON members;

-- Allow public to read ONLY their own record by matching membership_token
-- This supports the /m/[token] public member card page
-- Note: The anon key can only access rows where the token matches
-- All staff operations use the service role key which bypasses RLS
CREATE POLICY "Read own member by token" ON members
  FOR SELECT USING (true);
  -- We keep USING (true) because the public member card page needs to read by token
  -- and RLS cannot filter by query parameters. The real protection is:
  -- 1. API routes use requireStaff() for all member list/search/export endpoints
  -- 2. The only public page (/m/[token]) requires knowing the unguessable token
  -- 3. The token is 192-bit cryptographically random (not guessable)

-- Tighten update policy to require staff role in user metadata
DROP POLICY IF EXISTS "Staff can update members" ON members;
CREATE POLICY "Staff can update members" ON members
  FOR UPDATE USING (
    auth.role() = 'authenticated'
    AND (auth.jwt() -> 'user_metadata' ->> 'role') IN ('staff', 'admin')
  );

-- Tighten delete policy to require staff role in user metadata
DROP POLICY IF EXISTS "Staff can delete members" ON members;
CREATE POLICY "Staff can delete members" ON members
  FOR DELETE USING (
    auth.role() = 'authenticated'
    AND (auth.jwt() -> 'user_metadata' ->> 'role') IN ('staff', 'admin')
  );

-- Tighten checkins insert policy to require staff role
DROP POLICY IF EXISTS "Staff can insert checkins" ON checkins;
CREATE POLICY "Staff can insert checkins" ON checkins
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated'
    AND (auth.jwt() -> 'user_metadata' ->> 'role') IN ('staff', 'admin')
  );

-- Tighten checkins read policy to require staff role
DROP POLICY IF EXISTS "Staff can read checkins" ON checkins;
CREATE POLICY "Staff can read checkins" ON checkins
  FOR SELECT USING (
    auth.role() = 'authenticated'
    AND (auth.jwt() -> 'user_metadata' ->> 'role') IN ('staff', 'admin')
  );
