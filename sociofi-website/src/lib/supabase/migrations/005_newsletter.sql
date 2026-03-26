-- ============================================================
-- SocioFi Technology — Migration 005: Newsletter
-- Run after 004_nexus_tables.sql
-- CURATOR agent creates newsletter drafts here for human approval
-- ============================================================

CREATE TABLE IF NOT EXISTS newsletter_issues (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_a           TEXT NOT NULL,          -- A/B test subject line A
  subject_b           TEXT NOT NULL,          -- A/B test subject line B
  editorial           TEXT,                   -- opening paragraph
  selected_post_ids   UUID[] NOT NULL DEFAULT '{}',
  division_highlights TEXT[] NOT NULL DEFAULT '{}',
  recommended_segment TEXT NOT NULL DEFAULT 'all',
  -- 'all' | 'founders' | 'technical' | 'investors'
  status              TEXT NOT NULL DEFAULT 'draft',
  -- statuses: draft | approved | sent | cancelled
  sent_at             TIMESTAMPTZ,
  approval_id         UUID REFERENCES approval_queue(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_status  ON newsletter_issues(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_created ON newsletter_issues(created_at DESC);

ALTER TABLE newsletter_issues ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "newsletter_admin_all" ON newsletter_issues
  FOR ALL USING (auth.role() = 'authenticated');

CREATE OR REPLACE TRIGGER trg_newsletter_updated_at
  BEFORE UPDATE ON newsletter_issues FOR EACH ROW EXECUTE FUNCTION update_updated_at();
