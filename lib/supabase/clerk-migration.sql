-- ============================================================
-- CLERK AUTH: Run this in Supabase SQL Editor after switching to Clerk
-- This replaces auth.users-based profiles with clerk_user_id.
-- ============================================================

-- Drop dependent tables first (they reference profiles)
DROP TABLE IF EXISTS family_messages;
DROP TABLE IF EXISTS elder_check_ins;
DROP TABLE IF EXISTS profiles;

-- Recreate profiles with Clerk user id
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('OPTIMIZER', 'ELDER')),
  parent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  onboarding_complete BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Only backend (service_role) should access; no anon policies
-- Your Next.js server uses SUPABASE_SERVICE_ROLE_KEY for profile operations

-- Elder check-ins
CREATE TABLE elder_check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  checked_in_at TIMESTAMPTZ DEFAULT now()
);

DROP INDEX IF EXISTS elder_check_ins_one_per_day;
CREATE UNIQUE INDEX elder_check_ins_one_per_day
  ON elder_check_ins (profile_id, ((checked_in_at AT TIME ZONE 'UTC')::date));

ALTER TABLE elder_check_ins ENABLE ROW LEVEL SECURITY;

-- Family messages
CREATE TABLE family_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  elder_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE family_messages ENABLE ROW LEVEL SECURITY;
