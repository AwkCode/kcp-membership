-- Add Levia sub-tiers: executive, premium, platinum
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_tier_check;
ALTER TABLE members ADD CONSTRAINT members_tier_check
  CHECK (tier IN ('free', 'levia', 'levia-executive', 'levia-premium', 'levia-platinum', 'zyprun'));
