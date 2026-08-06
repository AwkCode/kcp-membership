-- Members no longer create a login account. They join with a phone OR an
-- email (at least one), and receive a membership card by text and/or email.
--
-- Run this in the Supabase SQL Editor BEFORE deploying the matching app code,
-- otherwise phone-only signups fail the old NOT NULL constraint on email.

-- 1. Email is no longer mandatory (phone-only signups store email = NULL).
--    The existing UNIQUE constraint still applies; Postgres allows multiple
--    NULLs under a UNIQUE column, so phone-only members don't collide.
ALTER TABLE members ALTER COLUMN email DROP NOT NULL;

-- 2. Require at least one contact method so a member is always reachable.
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_contact_present;
ALTER TABLE members ADD CONSTRAINT members_contact_present
  CHECK (email IS NOT NULL OR phone IS NOT NULL);
