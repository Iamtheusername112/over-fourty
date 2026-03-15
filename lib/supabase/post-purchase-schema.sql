-- ============================================================
-- POST-PURCHASE FLOW: Run after subscription-schema.sql
-- Adds subscription_status, onboarding_step, invite_code, audit_completed.
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'subscription_status') THEN
    ALTER TABLE profiles ADD COLUMN subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('inactive', 'active', 'canceled', 'past_due'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'onboarding_step') THEN
    ALTER TABLE profiles ADD COLUMN onboarding_step TEXT DEFAULT NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'invite_code') THEN
    ALTER TABLE profiles ADD COLUMN invite_code TEXT UNIQUE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'audit_completed') THEN
    ALTER TABLE profiles ADD COLUMN audit_completed BOOLEAN NOT NULL DEFAULT false;
  END IF;
END $$;

-- Optional: index for invite code lookups when elder joins
CREATE INDEX IF NOT EXISTS idx_profiles_invite_code ON profiles(invite_code) WHERE invite_code IS NOT NULL;
