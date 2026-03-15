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

  -- Optional: enable RLS and allow anonymous inserts for the form
  ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Allow anonymous insert for leads" ON leads
    FOR INSERT TO anon WITH CHECK (true);
*/
