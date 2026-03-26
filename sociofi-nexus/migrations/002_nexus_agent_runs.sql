-- Migration 002: nexus_agent_runs — persists agent execution history to Supabase
-- Run this in your Supabase SQL editor or via the Supabase CLI.

CREATE TABLE IF NOT EXISTS nexus_agent_runs (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  run_id           UUID NOT NULL UNIQUE,
  agent            TEXT NOT NULL,
  status           TEXT NOT NULL,          -- 'success' | 'failed' | 'pending_review'
  input_summary    TEXT,
  output_summary   TEXT,
  approvals_created SMALLINT DEFAULT 0,
  tokens_used      INTEGER DEFAULT 0,
  duration_ms      INTEGER DEFAULT 0,
  error            TEXT,
  completed_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nexus_runs_agent       ON nexus_agent_runs(agent);
CREATE INDEX IF NOT EXISTS idx_nexus_runs_status      ON nexus_agent_runs(status);
CREATE INDEX IF NOT EXISTS idx_nexus_runs_completed   ON nexus_agent_runs(completed_at DESC);

ALTER TABLE nexus_agent_runs ENABLE ROW LEVEL SECURITY;
-- Agents write via service role (bypasses RLS). Admin panel reads via authenticated role.
CREATE POLICY "admin_read_agent_runs" ON nexus_agent_runs FOR SELECT USING (auth.role() = 'authenticated');
