-- Run this in the Supabase SQL editor to create the portfolios table.

create table portfolios (
  id uuid primary key default gen_random_uuid(),
  subdomain text unique not null,
  portfolio_data jsonb not null,
  layout_config jsonb not null,
  created_at timestamptz default now()
);

create index on portfolios (subdomain);

-- Run this if the table already exists to add editor columns:
-- ALTER TABLE portfolios
--   ADD COLUMN IF NOT EXISTS accent_color TEXT DEFAULT '#FF3B00',
--   ADD COLUMN IF NOT EXISTS template_id  TEXT DEFAULT 'template-2',
--   ADD COLUMN IF NOT EXISTS updated_at   TIMESTAMPTZ DEFAULT now();

-- ── Auth + publish status (run in Supabase SQL editor) ──────────────────────
-- Requires Supabase Auth to be enabled in your project.
ALTER TABLE portfolios
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS status  TEXT DEFAULT 'draft'
    CHECK (status IN ('draft', 'live'));

CREATE INDEX IF NOT EXISTS portfolios_user_id_idx ON portfolios (user_id);

-- Optional: RLS policy — users can only read/update their own portfolios
-- (Enable RLS on the table first via the Supabase dashboard)
-- ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users manage own portfolios" ON portfolios
--   USING (user_id = auth.uid())
--   WITH CHECK (user_id = auth.uid());
