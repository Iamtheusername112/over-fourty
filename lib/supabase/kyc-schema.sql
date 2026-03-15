-- ============================================================
-- KYC FLOW: Run after clerk-migration.sql (profiles must exist)
-- One KYC submission per profile; documents stored in Storage.
-- ============================================================

CREATE TABLE IF NOT EXISTS kyc_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  full_name TEXT,
  ssn TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'US',
  government_id_path TEXT,
  drivers_license_path TEXT,
  utility_doc_path TEXT,
  owns_property BOOLEAN,
  property_types TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'verified')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(profile_id)
);

CREATE INDEX IF NOT EXISTS idx_kyc_submissions_profile ON kyc_submissions(profile_id);
CREATE INDEX IF NOT EXISTS idx_kyc_submissions_status ON kyc_submissions(status);

-- Storage: In Supabase Dashboard → Storage → New bucket → name: kyc-documents (private).
--
-- Recommended bucket settings (in Dashboard → Storage → kyc-documents → Settings / Policies):
--
--   File size limit:  10 MB  (enough for high-res ID photos and multi-page PDFs)
--   Allowed MIME types (restrict these for security):
--     image/jpeg
--     image/png
--     image/webp
--     application/pdf
--
-- The app accepts the same types in the upload form (accept="image/*,application/pdf").
