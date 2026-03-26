-- ============================================================
-- SocioFi Technology — Migration 001: Core Schema
-- Run first. All other migrations depend on this.
-- Idempotent: safe to re-run (uses IF NOT EXISTS / OR REPLACE)
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- fast ILIKE search on text fields

-- ── Shared updated_at trigger function ───────────────────────
-- Single canonical definition. All migrations reference this name.
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ── ENUM TYPES ────────────────────────────────────────────────
-- Guards: create only if not already present

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('super_admin', 'division_lead', 'editor', 'viewer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE division_name AS ENUM (
    'studio', 'services', 'cloud', 'academy', 'ventures', 'labs', 'products', 'parent'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE submission_status AS ENUM ('new', 'reviewed', 'in_progress', 'converted', 'closed', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE priority_level AS ENUM ('low', 'normal', 'high', 'urgent');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE lifecycle_stage AS ENUM ('lead', 'qualified', 'opportunity', 'client', 'churned');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE ticket_priority AS ENUM ('p1', 'p2', 'p3', 'p4');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE ticket_status AS ENUM ('open', 'acknowledged', 'in_progress', 'resolved', 'closed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE content_status AS ENUM ('draft', 'review', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─────────────────────────────────────────
-- TEAM MEMBERS
-- Maps Supabase auth users to internal roles
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS team_members (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id     UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  role        user_role NOT NULL DEFAULT 'viewer',
  divisions   division_name[] NOT NULL DEFAULT '{}',
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_members_auth_id ON team_members(auth_id);
CREATE INDEX IF NOT EXISTS idx_team_members_role    ON team_members(role);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "team_members_self_read" ON team_members
  FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY IF NOT EXISTS "team_members_admin_all" ON team_members
  FOR ALL USING (
    EXISTS (SELECT 1 FROM team_members tm WHERE tm.auth_id = auth.uid() AND tm.role = 'super_admin')
  );

-- ─────────────────────────────────────────
-- CONTACTS
-- Unified record: leads, clients, subscribers
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS contacts (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email             TEXT UNIQUE NOT NULL,
  name              TEXT,
  company           TEXT,
  phone             TEXT,
  role              TEXT,
  source            TEXT,
  division_interest division_name[],
  tags              TEXT[] NOT NULL DEFAULT '{}',
  lifecycle_stage   lifecycle_stage NOT NULL DEFAULT 'lead',
  assigned_to       UUID REFERENCES team_members(id) ON DELETE SET NULL,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contacts_email     ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_lifecycle ON contacts(lifecycle_stage);
CREATE INDEX IF NOT EXISTS idx_contacts_assigned  ON contacts(assigned_to);
CREATE INDEX IF NOT EXISTS idx_contacts_tags      ON contacts USING GIN(tags);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "contacts_admin_all" ON contacts
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- SUBMISSIONS
-- Every form submission from the public website
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS submissions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id   UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  type         TEXT NOT NULL,          -- 'studio-project' | 'services-inquiry' | 'academy-enroll' etc.
  division     division_name NOT NULL,
  status       submission_status NOT NULL DEFAULT 'new',
  priority     priority_level NOT NULL DEFAULT 'normal',
  data         JSONB NOT NULL DEFAULT '{}',
  source_url   TEXT,
  utm_source   TEXT,
  utm_medium   TEXT,
  utm_campaign TEXT,
  assigned_to  UUID REFERENCES team_members(id) ON DELETE SET NULL,
  reviewed_at  TIMESTAMPTZ,
  reviewed_by  UUID REFERENCES team_members(id) ON DELETE SET NULL,
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_submissions_contact  ON submissions(contact_id);
CREATE INDEX IF NOT EXISTS idx_submissions_division ON submissions(division);
CREATE INDEX IF NOT EXISTS idx_submissions_status   ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created  ON submissions(created_at DESC);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "submissions_admin_all" ON submissions
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- PIPELINE ENTRIES
-- Sales and project pipeline tracking
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS pipeline_entries (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id     UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  submission_id  UUID REFERENCES submissions(id) ON DELETE SET NULL,
  division       division_name NOT NULL,
  stage          TEXT NOT NULL DEFAULT 'discovery',
  -- stages: discovery | proposal | negotiation | won | lost
  value_estimate NUMERIC(12,2),
  probability    SMALLINT CHECK (probability BETWEEN 0 AND 100),
  expected_close DATE,
  assigned_to    UUID REFERENCES team_members(id) ON DELETE SET NULL,
  notes          TEXT,
  won_at         TIMESTAMPTZ,
  lost_at        TIMESTAMPTZ,
  lost_reason    TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pipeline_contact  ON pipeline_entries(contact_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_division ON pipeline_entries(division);
CREATE INDEX IF NOT EXISTS idx_pipeline_stage    ON pipeline_entries(stage);

ALTER TABLE pipeline_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "pipeline_admin_all" ON pipeline_entries
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- ACTIVITY LOG
-- Immutable audit trail — never UPDATE or DELETE rows here
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS activity_log (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id    UUID REFERENCES team_members(id) ON DELETE SET NULL,
  actor_label TEXT,                     -- 'INTAKE', 'HERALD', or team member name
  action      TEXT NOT NULL,            -- 'submission.status_changed', 'pipeline.stage_moved' etc.
  entity_type TEXT NOT NULL,
  entity_id   UUID NOT NULL,
  details     JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_actor   ON activity_log(actor_id);
CREATE INDEX IF NOT EXISTS idx_activity_entity  ON activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_log(created_at DESC);

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "activity_admin_read" ON activity_log
  FOR SELECT USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- TICKETS
-- Support tickets (Services / Cloud SLA)
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS tickets (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id            UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  plan                  TEXT,
  type                  TEXT NOT NULL,           -- 'bug' | 'feature' | 'incident' | 'question'
  priority              ticket_priority NOT NULL DEFAULT 'p3',
  title                 TEXT NOT NULL,
  description           TEXT,
  status                ticket_status NOT NULL DEFAULT 'open',
  assigned_to           UUID REFERENCES team_members(id) ON DELETE SET NULL,
  acknowledged_at       TIMESTAMPTZ,
  resolved_at           TIMESTAMPTZ,
  resolution_notes      TEXT,
  sla_response_deadline TIMESTAMPTZ,
  sla_met               BOOLEAN,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tickets_contact  ON tickets(contact_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status   ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned ON tickets(assigned_to);

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "tickets_admin_all" ON tickets
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- VENTURES APPLICATIONS
-- Startup applications for SocioFi Ventures
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ventures_applications (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id     UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  startup_name   TEXT NOT NULL,
  stage          TEXT NOT NULL,       -- 'idea' | 'mvp' | 'early_revenue' | 'growth'
  sector         TEXT,
  pitch_deck_url TEXT,
  data           JSONB NOT NULL DEFAULT '{}',
  status         TEXT NOT NULL DEFAULT 'received',
  -- statuses: received | screening | interview | due_diligence | approved | rejected
  reviewer_id    UUID REFERENCES team_members(id) ON DELETE SET NULL,
  reviewed_at    TIMESTAMPTZ,
  decision_notes TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ventures_contact ON ventures_applications(contact_id);
CREATE INDEX IF NOT EXISTS idx_ventures_status  ON ventures_applications(status);

ALTER TABLE ventures_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "ventures_admin_all" ON ventures_applications
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- SUBSCRIBERS
-- Email list. Canonical definition — do not redefine in later migrations.
-- The nexus migration uses IF NOT EXISTS and will skip if this exists.
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS subscribers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT UNIQUE NOT NULL,
  name          TEXT,
  lists         TEXT[] NOT NULL DEFAULT '{}',    -- ['newsletter','academy','labs'] etc.
  confirmed     BOOLEAN NOT NULL DEFAULT FALSE,
  confirm_token TEXT,
  confirmed_at  TIMESTAMPTZ,
  unsubscribed  BOOLEAN NOT NULL DEFAULT FALSE,
  unsub_at      TIMESTAMPTZ,
  source        TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscribers_email  ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_lists  ON subscribers USING GIN(lists);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
-- Public can subscribe (INSERT) — no auth required
CREATE POLICY IF NOT EXISTS "subscribers_public_insert" ON subscribers
  FOR INSERT WITH CHECK (TRUE);
CREATE POLICY IF NOT EXISTS "subscribers_admin_all" ON subscribers
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- ENROLLMENTS
-- Academy course / workshop enrollments
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS enrollments (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id   UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  course_id    TEXT NOT NULL,
  course_title TEXT NOT NULL,
  type         TEXT NOT NULL DEFAULT 'course',   -- 'course' | 'workshop' | 'cohort'
  status       TEXT NOT NULL DEFAULT 'pending',  -- 'pending' | 'active' | 'completed' | 'refunded'
  price_paid   NUMERIC(10,2),
  payment_ref  TEXT,
  enrolled_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  certificate  TEXT
);

CREATE INDEX IF NOT EXISTS idx_enrollments_contact ON enrollments(contact_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course  ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status  ON enrollments(status);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "enrollments_admin_all" ON enrollments
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- SETTINGS
-- Global configurable settings (email routing, feature flags)
-- Avoids hardcoding values like division email addresses in code
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "settings_admin_all" ON settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Seed default settings (ON CONFLICT = safe to re-run)
INSERT INTO settings (key, value, description) VALUES
  ('email_studio',    'studio@sociofitechnology.com',    'Notification email for Studio division'),
  ('email_services',  'services@sociofitechnology.com',  'Notification email for Services division'),
  ('email_cloud',     'cloud@sociofitechnology.com',     'Notification email for Cloud division'),
  ('email_academy',   'academy@sociofitechnology.com',   'Notification email for Academy division'),
  ('email_ventures',  'ventures@sociofitechnology.com',  'Notification email for Ventures division'),
  ('email_labs',      'labs@sociofitechnology.com',      'Notification email for Labs division'),
  ('email_products',  'products@sociofitechnology.com',  'Notification email for Products division'),
  ('email_general',   'hello@sociofitechnology.com',     'General contact email'),
  ('slack_channel',   '#leads',                          'Slack channel for lead notifications'),
  ('pilot_enabled',   'true',                            'Enable/disable PILOT AI assistant')
ON CONFLICT (key) DO NOTHING;

-- ─────────────────────────────────────────
-- UPDATED_AT TRIGGERS
-- ─────────────────────────────────────────

CREATE OR REPLACE TRIGGER trg_team_members_updated_at
  BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_contacts_updated_at
  BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_submissions_updated_at
  BEFORE UPDATE ON submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_pipeline_updated_at
  BEFORE UPDATE ON pipeline_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_tickets_updated_at
  BEFORE UPDATE ON tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_ventures_updated_at
  BEFORE UPDATE ON ventures_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at();
