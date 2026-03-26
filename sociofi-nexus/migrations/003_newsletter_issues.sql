-- Migration 003: newsletter_issues — stores CURATOR drafts before sending
-- Run in Supabase SQL editor or via CLI after running 001 and 002.

CREATE TABLE IF NOT EXISTS newsletter_issues (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_a           TEXT NOT NULL,                    -- A/B test subject variant A
  subject_b           TEXT NOT NULL,                    -- A/B test subject variant B
  editorial           TEXT,                             -- opening editorial paragraph
  selected_post_ids   UUID[]   DEFAULT '{}',            -- cms_posts IDs included
  division_highlights TEXT[]   DEFAULT '{}',            -- division names highlighted
  recommended_segment TEXT     DEFAULT 'all',           -- subscriber segment to send to
  status              TEXT     NOT NULL DEFAULT 'draft', -- 'draft' | 'approved' | 'sent'
  sent_at             TIMESTAMPTZ,
  approval_id         UUID,                             -- references approval_queue.id
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_status     ON newsletter_issues(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_created    ON newsletter_issues(created_at DESC);

ALTER TABLE newsletter_issues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_all_newsletters" ON newsletter_issues FOR ALL USING (auth.role() = 'authenticated');

-- subscribers table (if not already created by cms_schema)
CREATE TABLE IF NOT EXISTS subscribers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT NOT NULL UNIQUE,
  name        TEXT,
  list        TEXT NOT NULL DEFAULT 'general',   -- 'general' | 'founders' | 'technical' | 'investors'
  status      TEXT NOT NULL DEFAULT 'active',    -- 'active' | 'unsubscribed' | 'bounced'
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscribers_email  ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_list   ON subscribers(list);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers(status);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_all_subscribers" ON subscribers FOR ALL USING (auth.role() = 'authenticated');
