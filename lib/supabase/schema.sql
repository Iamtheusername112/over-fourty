/*
  SUPABASE 'leads' TABLE SCHEMA
  Run this in Supabase SQL Editor to create the table.

  CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    source TEXT DEFAULT 'family_audit_modal',
    created_at TIMESTAMPTZ DEFAULT now()
  );

  ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Allow anonymous insert for leads" ON leads
    FOR INSERT TO anon WITH CHECK (true);
*/

/*
  SUPABASE 'profiles' TABLE (Auth + Dashboard roles)
  Run in Supabase SQL Editor after enabling Auth.

  CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('OPTIMIZER', 'ELDER')),
    parent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    onboarding_complete BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
  );

  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

  -- Users can read/update their own profile
  CREATE POLICY "Users can read own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);
  CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);
  CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

  -- Trigger: create profile on signup (run after first login or via Edge Function)
  -- Alternatively, create profile in app when user completes onboarding.

  -- Optional: elder_check_ins for Daily Check-in timestamp
  CREATE TABLE IF NOT EXISTS elder_check_ins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    checked_in_at TIMESTAMPTZ DEFAULT now()
  );
  CREATE UNIQUE INDEX IF NOT EXISTS elder_check_ins_one_per_day
    ON elder_check_ins (profile_id, ((checked_in_at AT TIME ZONE 'UTC')::date));
  -- Allow Elders to insert their own check-in (one per day)
  ALTER TABLE elder_check_ins ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Elders insert own check-in" ON elder_check_ins
    FOR INSERT WITH CHECK (auth.uid() = profile_id);

  -- Optional: family_messages for Elder dashboard feed
  CREATE TABLE IF NOT EXISTS family_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    elder_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
  );
  ALTER TABLE family_messages ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Elders read own messages" ON family_messages
    FOR SELECT USING (auth.uid() = elder_id);
  CREATE POLICY "Optimizers insert messages for their elder" ON family_messages
    FOR INSERT WITH CHECK (
      auth.uid() = author_id AND
      EXISTS (SELECT 1 FROM profiles p WHERE p.id = author_id AND p.parent_id = family_messages.elder_id)
    );
*/
