-- ============================================================
-- ELDER DASHBOARD: Help alerts and preferences
-- Run after clerk-migration.sql (profiles must exist).
-- ============================================================

-- When an elder taps "I need help", we store an alert so the linked Optimizer can see it.
CREATE TABLE IF NOT EXISTS elder_help_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_elder_help_alerts_profile ON elder_help_alerts(profile_id);
CREATE INDEX IF NOT EXISTS idx_elder_help_alerts_created ON elder_help_alerts(created_at DESC);

-- Optional: emergency contact and "where are my papers" for peace of mind.
CREATE TABLE IF NOT EXISTS elder_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  important_papers_note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_elder_preferences_profile ON elder_preferences(profile_id);
