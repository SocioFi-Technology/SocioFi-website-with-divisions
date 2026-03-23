-- NEXUS Agent Server — Required tables
-- Run in Supabase SQL editor after the main schema.sql

-- ── approval_queue ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS approval_queue (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_name     TEXT NOT NULL,
  action_type    TEXT NOT NULL,         -- 'send_email', 'publish_content', etc.
  entity_type    TEXT NOT NULL,
  entity_id      UUID NOT NULL,
  title          TEXT NOT NULL,
  context        TEXT,
  payload        JSONB NOT NULL DEFAULT '{}',
  confidence     SMALLINT CHECK (confidence BETWEEN 0 AND 100),
  priority       TEXT NOT NULL DEFAULT 'normal',
  status         TEXT NOT NULL DEFAULT 'pending',  -- 'pending','approved','edited','discarded'
  decided_by     UUID REFERENCES team_members(id) ON DELETE SET NULL,
  decided_at     TIMESTAMPTZ,
  discard_reason TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_approval_status  ON approval_queue(status);
CREATE INDEX IF NOT EXISTS idx_approval_agent   ON approval_queue(agent_name);
CREATE INDEX IF NOT EXISTS idx_approval_entity  ON approval_queue(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_approval_created ON approval_queue(created_at DESC);

ALTER TABLE approval_queue ENABLE ROW LEVEL SECURITY;

-- ── followup_schedule ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS followup_schedule (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id      UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  submission_id   UUID REFERENCES submissions(id) ON DELETE CASCADE,
  sequence_type   TEXT NOT NULL,    -- 'welcome', 'nurture', 'followup'
  step_number     INTEGER NOT NULL DEFAULT 1,
  scheduled_for   TIMESTAMPTZ NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending',  -- 'pending','sent','skipped','failed'
  template_name   TEXT NOT NULL,
  template_data   JSONB NOT NULL DEFAULT '{}',
  sent_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_followup_contact   ON followup_schedule(contact_id);
CREATE INDEX IF NOT EXISTS idx_followup_scheduled ON followup_schedule(scheduled_for) WHERE status = 'pending';

ALTER TABLE followup_schedule ENABLE ROW LEVEL SECURITY;

-- ── Enable Realtime on key tables (for admin panel live updates) ───────────
-- Run in Supabase dashboard: Replication → enable for:
-- submissions, contacts, approval_queue, pipeline_entries
