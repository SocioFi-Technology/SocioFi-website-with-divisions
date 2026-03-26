-- ============================================================
-- SocioFi Technology — Migration 006: API Keys & Usage Tracking
-- Run after 001_core_schema.sql
-- Enables the pay-as-you-go API product:
--   nexus-admin, nexus-cms, nexus-academy sold as external APIs
-- ============================================================

-- ─────────────────────────────────────────
-- API KEYS
-- One row per external client subscription
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS api_keys (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key_hash        TEXT UNIQUE NOT NULL,        -- SHA-256 of the actual key (never store plaintext)
  key_prefix      TEXT NOT NULL,               -- first 8 chars for display: 'sk_live_abcd1234'
  owner_email     TEXT NOT NULL,
  owner_name      TEXT,
  company         TEXT,
  service         TEXT NOT NULL,               -- 'nexus-admin' | 'nexus-cms' | 'nexus-academy'
  plan            TEXT NOT NULL DEFAULT 'starter',
  -- plans: starter | growth | scale | enterprise
  monthly_limit   INTEGER NOT NULL DEFAULT 1000,  -- API calls per month
  calls_this_month INTEGER NOT NULL DEFAULT 0,
  reset_date      DATE NOT NULL DEFAULT (DATE_TRUNC('month', NOW()) + INTERVAL '1 month')::DATE,
  active          BOOLEAN NOT NULL DEFAULT TRUE,
  revoked_at      TIMESTAMPTZ,
  revoke_reason   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_keys_hash    ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_owner   ON api_keys(owner_email);
CREATE INDEX IF NOT EXISTS idx_api_keys_service ON api_keys(service);
CREATE INDEX IF NOT EXISTS idx_api_keys_active  ON api_keys(active) WHERE active = TRUE;

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
-- Only admins see API keys (never expose key_hash to public)
CREATE POLICY IF NOT EXISTS "api_keys_admin_all" ON api_keys
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- API USAGE
-- One row per API call. Used for billing and analytics.
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS api_usage (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  api_key_id   UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  service      TEXT NOT NULL,                  -- 'nexus-admin' | 'nexus-cms' | 'nexus-academy'
  endpoint     TEXT NOT NULL,                  -- '/admin/intake' | '/cms/draft-post' etc.
  agent        TEXT,                           -- which agent handled it
  status_code  SMALLINT,
  tokens_in    INTEGER NOT NULL DEFAULT 0,
  tokens_out   INTEGER NOT NULL DEFAULT 0,
  duration_ms  INTEGER NOT NULL DEFAULT 0,
  cost_usd     NUMERIC(8,6),                   -- calculated: (tokens_in * rate_in) + (tokens_out * rate_out)
  error        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_usage_key      ON api_usage(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_service  ON api_usage(service);
CREATE INDEX IF NOT EXISTS idx_api_usage_created  ON api_usage(created_at DESC);
-- Partial index for billing: last 30 days
CREATE INDEX IF NOT EXISTS idx_api_usage_billing  ON api_usage(api_key_id, created_at DESC)
  WHERE created_at > NOW() - INTERVAL '31 days';

ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "api_usage_admin_all" ON api_usage
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- API PLANS
-- Pricing tiers — update these to change what you sell
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS api_plans (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT UNIQUE NOT NULL,
  service       TEXT NOT NULL,                 -- which NEXUS service
  monthly_limit INTEGER NOT NULL,
  price_usd     NUMERIC(8,2) NOT NULL,
  overage_per_k NUMERIC(6,4),                  -- price per 1000 calls over limit
  features      TEXT[] NOT NULL DEFAULT '{}',
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE api_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "api_plans_public_read" ON api_plans
  FOR SELECT USING (active = TRUE);
CREATE POLICY IF NOT EXISTS "api_plans_admin_all" ON api_plans
  FOR ALL USING (auth.role() = 'authenticated');

-- Seed default plans
INSERT INTO api_plans (name, service, monthly_limit, price_usd, overage_per_k, features) VALUES
  ('starter',    'nexus-admin',   1000,  49.00, 0.06, ARRAY['Lead classification','Email sequences','Pipeline tracking']),
  ('growth',     'nexus-admin',  10000, 199.00, 0.04, ARRAY['Everything in Starter','Priority processing','Slack notifications','Analytics']),
  ('scale',      'nexus-admin',  50000, 599.00, 0.02, ARRAY['Everything in Growth','Custom templates','Dedicated support','SLA']),
  ('starter',    'nexus-cms',     1000,  49.00, 0.06, ARRAY['Blog drafts','Content calendar','Basic SEO']),
  ('growth',     'nexus-cms',    10000, 199.00, 0.04, ARRAY['Everything in Starter','Newsletter drafts','Social posts','Analytics']),
  ('starter',    'nexus-academy',  500,  79.00, 0.10, ARRAY['Course curriculum','Lesson drafts','Quiz generation']),
  ('growth',     'nexus-academy', 5000, 299.00, 0.06, ARRAY['Everything in Starter','Workshop design','Assessment rubrics','Bulk generation'])
ON CONFLICT (name) DO NOTHING;

-- ─────────────────────────────────────────
-- MONTHLY RESET FUNCTION
-- Call via pg_cron or Supabase Edge Function on 1st of each month
-- ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION reset_monthly_api_counts()
RETURNS void AS $$
BEGIN
  UPDATE api_keys
  SET
    calls_this_month = 0,
    reset_date = (DATE_TRUNC('month', NOW()) + INTERVAL '1 month')::DATE,
    updated_at = NOW()
  WHERE reset_date <= CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_api_keys_updated_at
  BEFORE UPDATE ON api_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at();
