-- SocioFi Technology — Supabase Database Schema
-- Run this in the Supabase SQL editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────
-- ENUM TYPES
-- ─────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('super_admin', 'division_lead', 'editor', 'viewer');
CREATE TYPE division_name AS ENUM ('studio', 'agents', 'services', 'cloud', 'academy', 'ventures', 'labs', 'parent');
CREATE TYPE submission_status AS ENUM ('new', 'reviewed', 'in_progress', 'converted', 'closed', 'archived');
CREATE TYPE priority_level AS ENUM ('low', 'normal', 'high', 'urgent');
CREATE TYPE lifecycle_stage AS ENUM ('lead', 'qualified', 'opportunity', 'client', 'churned');
CREATE TYPE ticket_priority AS ENUM ('p1', 'p2', 'p3', 'p4');
CREATE TYPE ticket_status AS ENUM ('open', 'acknowledged', 'in_progress', 'resolved', 'closed');
CREATE TYPE content_status AS ENUM ('draft', 'review', 'published', 'archived');

-- ─────────────────────────────────────────
-- TEAM MEMBERS
-- Maps Supabase auth users to internal roles/divisions
-- ─────────────────────────────────────────

CREATE TABLE team_members (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id       UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  role          user_role NOT NULL DEFAULT 'viewer',
  divisions     division_name[] NOT NULL DEFAULT '{}',
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_team_members_auth_id ON team_members(auth_id);
CREATE INDEX idx_team_members_role ON team_members(role);

-- ─────────────────────────────────────────
-- CONTACTS
-- Unified contact record for all leads, clients, subscribers
-- ─────────────────────────────────────────

CREATE TABLE contacts (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email             TEXT UNIQUE NOT NULL,
  name              TEXT,
  company           TEXT,
  phone             TEXT,
  role              TEXT,                          -- job title / role at their company
  source            TEXT,                          -- referral, organic, paid, partner, etc.
  division_interest division_name[],
  tags              TEXT[] DEFAULT '{}',
  lifecycle_stage   lifecycle_stage NOT NULL DEFAULT 'lead',
  assigned_to       UUID REFERENCES team_members(id) ON DELETE SET NULL,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_lifecycle ON contacts(lifecycle_stage);
CREATE INDEX idx_contacts_assigned ON contacts(assigned_to);

-- ─────────────────────────────────────────
-- SUBMISSIONS
-- Form submissions from the public website (contact, project brief, etc.)
-- ─────────────────────────────────────────

CREATE TABLE submissions (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id     UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  type           TEXT NOT NULL,                   -- e.g. 'studio-project', 'services-inquiry', 'academy-enroll'
  division       division_name NOT NULL,
  status         submission_status NOT NULL DEFAULT 'new',
  priority       priority_level NOT NULL DEFAULT 'normal',
  data           JSONB NOT NULL DEFAULT '{}',     -- raw form payload
  source_url     TEXT,
  utm_source     TEXT,
  utm_medium     TEXT,
  utm_campaign   TEXT,
  assigned_to    UUID REFERENCES team_members(id) ON DELETE SET NULL,
  reviewed_at    TIMESTAMPTZ,
  reviewed_by    UUID REFERENCES team_members(id) ON DELETE SET NULL,
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_submissions_contact ON submissions(contact_id);
CREATE INDEX idx_submissions_division ON submissions(division);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_created ON submissions(created_at DESC);

-- ─────────────────────────────────────────
-- PIPELINE ENTRIES
-- Sales/project pipeline tracking
-- ─────────────────────────────────────────

CREATE TABLE pipeline_entries (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id      UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  submission_id   UUID REFERENCES submissions(id) ON DELETE SET NULL,
  division        division_name NOT NULL,
  stage           TEXT NOT NULL DEFAULT 'discovery', -- discovery, proposal, negotiation, won, lost
  value_estimate  NUMERIC(12, 2),                    -- estimated deal value in USD
  probability     SMALLINT CHECK (probability BETWEEN 0 AND 100),
  expected_close  DATE,
  assigned_to     UUID REFERENCES team_members(id) ON DELETE SET NULL,
  notes           TEXT,
  won_at          TIMESTAMPTZ,
  lost_at         TIMESTAMPTZ,
  lost_reason     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pipeline_contact ON pipeline_entries(contact_id);
CREATE INDEX idx_pipeline_division ON pipeline_entries(division);
CREATE INDEX idx_pipeline_stage ON pipeline_entries(stage);

-- ─────────────────────────────────────────
-- ACTIVITY LOG
-- Immutable audit trail of all admin actions
-- ─────────────────────────────────────────

CREATE TABLE activity_log (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id     UUID REFERENCES team_members(id) ON DELETE SET NULL,
  action       TEXT NOT NULL,           -- 'submission.status_changed', 'contact.assigned', etc.
  entity_type  TEXT NOT NULL,           -- 'submission', 'contact', 'pipeline_entry', etc.
  entity_id    UUID NOT NULL,
  details      JSONB DEFAULT '{}',      -- diff / contextual data
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activity_actor ON activity_log(actor_id);
CREATE INDEX idx_activity_entity ON activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_created ON activity_log(created_at DESC);

-- ─────────────────────────────────────────
-- CONTENT
-- Managed content items (supplements Sanity CMS for operational data)
-- ─────────────────────────────────────────

CREATE TABLE content (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type         TEXT NOT NULL,           -- 'testimonial', 'faq', 'case_study', 'announcement'
  division     division_name,
  title        TEXT NOT NULL,
  slug         TEXT,
  body         JSONB NOT NULL DEFAULT '{}',
  status       content_status NOT NULL DEFAULT 'draft',
  author_id    UUID REFERENCES team_members(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  metadata     JSONB DEFAULT '{}',      -- SEO, tags, etc.
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_content_type ON content(type);
CREATE INDEX idx_content_division ON content(division);
CREATE INDEX idx_content_status ON content(status);
CREATE UNIQUE INDEX idx_content_slug ON content(slug) WHERE slug IS NOT NULL;

-- ─────────────────────────────────────────
-- SUBSCRIBERS
-- Email list (newsletter + division-specific lists)
-- ─────────────────────────────────────────

CREATE TABLE subscribers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT UNIQUE NOT NULL,
  name          TEXT,
  lists         TEXT[] NOT NULL DEFAULT '{}',    -- e.g. ['newsletter', 'academy', 'labs']
  confirmed     BOOLEAN NOT NULL DEFAULT FALSE,
  confirm_token TEXT,
  confirmed_at  TIMESTAMPTZ,
  unsubscribed  BOOLEAN NOT NULL DEFAULT FALSE,
  unsub_at      TIMESTAMPTZ,
  source        TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_lists ON subscribers USING GIN(lists);

-- ─────────────────────────────────────────
-- ENROLLMENTS
-- Academy course / workshop enrollments
-- ─────────────────────────────────────────

CREATE TABLE enrollments (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id    UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  course_id     TEXT NOT NULL,                   -- Sanity document ID or slug
  course_title  TEXT NOT NULL,
  type          TEXT NOT NULL DEFAULT 'course',  -- 'course', 'workshop', 'cohort'
  status        TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'active', 'completed', 'refunded'
  price_paid    NUMERIC(10, 2),
  payment_ref   TEXT,
  enrolled_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at  TIMESTAMPTZ,
  certificate   TEXT                             -- certificate URL if issued
);

CREATE INDEX idx_enrollments_contact ON enrollments(contact_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);

-- ─────────────────────────────────────────
-- VENTURES APPLICATIONS
-- Startup applications for SocioFi Ventures
-- ─────────────────────────────────────────

CREATE TABLE ventures_applications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id      UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  startup_name    TEXT NOT NULL,
  stage           TEXT NOT NULL,                   -- 'idea', 'mvp', 'early_revenue', 'growth'
  sector          TEXT,
  pitch_deck_url  TEXT,
  data            JSONB NOT NULL DEFAULT '{}',     -- full application payload
  status          TEXT NOT NULL DEFAULT 'received', -- 'received', 'screening', 'interview', 'due_diligence', 'approved', 'rejected'
  reviewer_id     UUID REFERENCES team_members(id) ON DELETE SET NULL,
  reviewed_at     TIMESTAMPTZ,
  decision_notes  TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ventures_contact ON ventures_applications(contact_id);
CREATE INDEX idx_ventures_status ON ventures_applications(status);

-- ─────────────────────────────────────────
-- TICKETS
-- Support tickets for Services / Cloud / SLA tracking
-- ─────────────────────────────────────────

CREATE TABLE tickets (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id            UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  plan                  TEXT,                          -- service plan reference
  type                  TEXT NOT NULL,                 -- 'bug', 'feature', 'incident', 'question'
  priority              ticket_priority NOT NULL DEFAULT 'p3',
  title                 TEXT NOT NULL,
  description           TEXT,
  status                ticket_status NOT NULL DEFAULT 'open',
  assigned_to           UUID REFERENCES team_members(id) ON DELETE SET NULL,
  acknowledged_at       TIMESTAMPTZ,
  resolved_at           TIMESTAMPTZ,
  resolution_notes      TEXT,
  sla_response_deadline TIMESTAMPTZ,                  -- calculated from priority + plan
  sla_met               BOOLEAN,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tickets_contact ON tickets(contact_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_assigned ON tickets(assigned_to);

-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY
-- Enable RLS on all tables; policies defined per role
-- ─────────────────────────────────────────

ALTER TABLE team_members         ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_entries     ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log         ENABLE ROW LEVEL SECURITY;
ALTER TABLE content              ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventures_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets              ENABLE ROW LEVEL SECURITY;

-- Service-role bypass (used by Next.js API routes with SUPABASE_SERVICE_KEY)
-- All other access is denied by default; add specific policies as needed.

-- Allow authenticated users to read their own team_member record
CREATE POLICY "team_members_self_read" ON team_members
  FOR SELECT USING (auth.uid() = auth_id);

-- Allow super_admins to read all team members
CREATE POLICY "team_members_admin_read" ON team_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.auth_id = auth.uid() AND tm.role = 'super_admin'
    )
  );

-- ─────────────────────────────────────────
-- UPDATED_AT TRIGGER
-- Auto-update updated_at on row modification
-- ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_team_members_updated_at
  BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_contacts_updated_at
  BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_submissions_updated_at
  BEFORE UPDATE ON submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_pipeline_updated_at
  BEFORE UPDATE ON pipeline_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_content_updated_at
  BEFORE UPDATE ON content FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_ventures_updated_at
  BEFORE UPDATE ON ventures_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_tickets_updated_at
  BEFORE UPDATE ON tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at();
