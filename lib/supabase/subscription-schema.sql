-- ============================================================
-- SUBSCRIPTION + LEGACY: Run in Supabase SQL Editor after clerk-migration.sql
-- Adds subscription_tier, last_seen; creates legacy_stories and storage bucket.
-- ============================================================

-- 1. Add columns to profiles (run only if not already present)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'subscription_tier') THEN
    ALTER TABLE profiles ADD COLUMN subscription_tier TEXT NOT NULL DEFAULT 'FREE' CHECK (subscription_tier IN ('FREE', 'ACCESS', 'FAMILY_SHIELD', 'ELDER_ADVOCACY'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_seen') THEN
    ALTER TABLE profiles ADD COLUMN last_seen TIMESTAMPTZ;
  END IF;
END $$;

-- 2. Legacy stories (Elder recordings)
CREATE TABLE IF NOT EXISTS legacy_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'My Story',
  storage_path TEXT NOT NULL,
  duration_seconds INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE legacy_stories ENABLE ROW LEVEL SECURITY;

-- 3. Create storage bucket in Supabase Dashboard: Storage → New bucket → name: legacy-audio (private).
-- Your app uploads via service_role so no RLS policy needed for server-side uploads.
