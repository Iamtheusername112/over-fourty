-- ============================================================
-- RUN THIS IN SUPABASE SQL EDITOR BEFORE TESTING LOGIN
-- Supabase Dashboard → SQL Editor → New query → paste → Run
-- ============================================================

-- 1. PROFILES (required for login + onboarding + dashboards)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('OPTIMIZER', 'ELDER')),
  parent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  onboarding_complete BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. ELDER CHECK-INS (for Elder dashboard "I am okay" button)
CREATE TABLE IF NOT EXISTS elder_check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  checked_in_at TIMESTAMPTZ DEFAULT now()
);

DROP INDEX IF EXISTS elder_check_ins_one_per_day;
CREATE UNIQUE INDEX elder_check_ins_one_per_day
  ON elder_check_ins (profile_id, ((checked_in_at AT TIME ZONE 'UTC')::date));

ALTER TABLE elder_check_ins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Elders insert own check-in" ON elder_check_ins;
CREATE POLICY "Elders insert own check-in" ON elder_check_ins
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- 3. FAMILY MESSAGES (for Elder dashboard feed)
CREATE TABLE IF NOT EXISTS family_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  elder_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE family_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Elders read own messages" ON family_messages;
CREATE POLICY "Elders read own messages" ON family_messages
  FOR SELECT USING (auth.uid() = elder_id);

DROP POLICY IF EXISTS "Optimizers insert messages for elder" ON family_messages;
CREATE POLICY "Optimizers insert messages for elder" ON family_messages
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- 4. LEADS (optional – for "Start Your Family Audit" modal on landing)
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  source TEXT DEFAULT 'family_audit_modal',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous insert for leads" ON leads;
CREATE POLICY "Allow anonymous insert for leads" ON leads
  FOR INSERT TO anon WITH CHECK (true);
