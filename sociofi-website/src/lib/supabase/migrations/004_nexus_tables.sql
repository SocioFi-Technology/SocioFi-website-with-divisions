-- ============================================================
-- SocioFi Technology — Migration 004: NEXUS Agent Tables
-- Run after 001_core_schema.sql
-- Agent infrastructure: approval queue, email schedules, agent runs
-- ============================================================

-- ─────────────────────────────────────────
-- APPROVAL QUEUE
-- Agents put actions here for human review before executing
-- e.g. "HERALD wants to send this email — approve?"
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS approval_queue (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_name     TEXT NOT NULL,               -- 'INTAKE' | 'HERALD' | 'SCRIBE' etc.
  action_type    TEXT NOT NULL,               -- 'send_email' | 'publish_content' | 'move_pipeline'
  entity_type    TEXT NOT NULL,               -- 'submission' | 'contact' | 'cms_post'
  entity_id      UUID NOT NULL,
  title          TEXT NOT NULL,               -- short human-readable description
  context        TEXT,                        -- why the agent wants to do this
  payload        JSONB NOT NULL DEFAULT '{}', -- the data to act on if approved
  confidence     SMALLINT CHECK (confidence BETWEEN 0 AND 100),
  priority       TEXT NOT NULL DEFAULT 'normal',
  status         TEXT NOT NULL DEFAULT 'pending',
  -- statuses: pending | approved | edited | discarded
  decided_by     UUID REFERENCES team_members(id) ON DELETE SET NULL,
  decided_at     TIMESTAMPTZ,
  edited_payload JSONB,                       -- admin-modified version of payload
  discard_reason TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_approval_status   ON approval_queue(status);
CREATE INDEX IF NOT EXISTS idx_approval_agent    ON approval_queue(agent_name);
CREATE INDEX IF NOT EXISTS idx_approval_entity   ON approval_queue(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_approval_created  ON approval_queue(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_approval_priority ON approval_queue(priority) WHERE status = 'pending';

ALTER TABLE approval_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "approval_admin_all" ON approval_queue
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- FOLLOWUP SCHEDULE
-- HERALD-managed email sequence scheduling
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS followup_schedule (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id     UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  submission_id  UUID REFERENCES submissions(id) ON DELETE CASCADE,
  sequence_type  TEXT NOT NULL,               -- 'welcome' | 'nurture' | 'followup'
  step_number    INTEGER NOT NULL DEFAULT 1,
  scheduled_for  TIMESTAMPTZ NOT NULL,
  status         TEXT NOT NULL DEFAULT 'pending',
  -- statuses: pending | sent | skipped | failed
  template_name  TEXT NOT NULL,
  template_data  JSONB NOT NULL DEFAULT '{}',
  sent_at        TIMESTAMPTZ,
  error          TEXT,                        -- error message if status = 'failed'
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_followup_contact    ON followup_schedule(contact_id);
CREATE INDEX IF NOT EXISTS idx_followup_scheduled  ON followup_schedule(scheduled_for)
  WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_followup_sequence   ON followup_schedule(contact_id, sequence_type);

ALTER TABLE followup_schedule ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "followup_admin_all" ON followup_schedule
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- NEXUS AGENT RUNS
-- Every agent execution is logged here
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS nexus_agent_runs (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  run_id            UUID NOT NULL UNIQUE,
  agent             TEXT NOT NULL,
  service           TEXT NOT NULL DEFAULT 'admin',  -- 'admin' | 'cms' | 'academy'
  trigger_type      TEXT,                           -- 'webhook' | 'scheduled' | 'manual'
  status            TEXT NOT NULL,
  -- statuses: success | failed | pending_review | running
  input_summary     TEXT,
  output_summary    TEXT,
  approvals_created SMALLINT NOT NULL DEFAULT 0,
  tokens_used       INTEGER NOT NULL DEFAULT 0,
  cost_usd          NUMERIC(8,6),                   -- calculated from tokens
  duration_ms       INTEGER NOT NULL DEFAULT 0,
  error             TEXT,
  completed_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nexus_runs_agent     ON nexus_agent_runs(agent);
CREATE INDEX IF NOT EXISTS idx_nexus_runs_service   ON nexus_agent_runs(service);
CREATE INDEX IF NOT EXISTS idx_nexus_runs_status    ON nexus_agent_runs(status);
CREATE INDEX IF NOT EXISTS idx_nexus_runs_completed ON nexus_agent_runs(completed_at DESC);

ALTER TABLE nexus_agent_runs ENABLE ROW LEVEL SECURITY;
-- Agents write via service role (bypasses RLS). Admin reads via authenticated.
CREATE POLICY IF NOT EXISTS "agent_runs_admin_read" ON nexus_agent_runs
  FOR SELECT USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- AGENT DEPLOYMENTS
-- Which agents are enabled, their schedules, last health check
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS agent_deployments (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT UNIQUE NOT NULL,          -- 'INTAKE' | 'HERALD' | 'SCRIBE' etc.
  service      TEXT NOT NULL DEFAULT 'admin', -- which NEXUS service it belongs to
  description  TEXT,
  enabled      BOOLEAN NOT NULL DEFAULT TRUE,
  schedule     TEXT,                          -- cron expression if scheduled
  last_run_at  TIMESTAMPTZ,
  last_status  TEXT,                          -- last known run status
  config       JSONB NOT NULL DEFAULT '{}',   -- agent-specific config overrides
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_deployments_service ON agent_deployments(service);
CREATE INDEX IF NOT EXISTS idx_agent_deployments_enabled ON agent_deployments(enabled);

ALTER TABLE agent_deployments ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "agent_deployments_admin_all" ON agent_deployments
  FOR ALL USING (auth.role() = 'authenticated');

-- Seed initial agent registry
INSERT INTO agent_deployments (name, service, description, schedule) VALUES
  ('INTAKE',    'admin',   'Classifies and scores inbound form submissions',         NULL),
  ('HERALD',    'admin',   'Sends personalized emails and follow-up sequences',      '0 * * * *'),
  ('COMPASS',   'admin',   'Manages pipeline stages and follow-up reminders',        '0 9 * * *'),
  ('WARDEN',    'admin',   'Handles support tickets and SLA monitoring',             '*/15 * * * *'),
  ('SENTINEL',  'admin',   'Security monitoring and anomaly detection',              '0 */6 * * *'),
  ('SCRIBE',    'cms',     'Writes blog posts and newsletter issues',                '0 8 * * 1'),
  ('CHRONICLE', 'cms',     'Audit logging and activity summarization',               NULL),
  ('CURATOR',   'cms',     'Plans content calendar and research briefs',             '0 9 * * 1'),
  ('PROFESSOR', 'academy', 'Designs course curricula and module structures',         NULL),
  ('HUNTER',    'admin',   'Visitor analytics, conversion tracking, insights',       '0 0 * * *')
ON CONFLICT (name) DO NOTHING;

CREATE OR REPLACE TRIGGER trg_agent_deployments_updated_at
  BEFORE UPDATE ON agent_deployments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
