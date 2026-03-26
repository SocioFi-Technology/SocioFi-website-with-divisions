-- ============================================================
-- SocioFi Technology — MASTER MIGRATION
-- Run this ONE file in Supabase SQL Editor to set up everything.
-- Combines all 6 numbered migrations in the correct order.
-- Fully idempotent — safe to re-run on an existing database.
-- ============================================================
-- Order matters:
--   001 → core tables + enums + triggers (everything depends on this)
--   002 → CMS tables (depends on enums from 001)
--   003 → Studio + Portfolio (depends on CMS tables from 002)
--   004 → NEXUS agent tables (depends on contacts/submissions from 001)
--   005 → Newsletter (depends on approval_queue from 004)
--   006 → API keys (depends on core tables from 001)
-- ============================================================

-- ══════════════════════════════════════════════════════════════
-- 001 — CORE SCHEMA
-- ══════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN CREATE TYPE user_role AS ENUM ('super_admin', 'division_lead', 'editor', 'viewer'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE division_name AS ENUM ('studio', 'services', 'cloud', 'academy', 'ventures', 'labs', 'products', 'parent'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE submission_status AS ENUM ('new', 'reviewed', 'in_progress', 'converted', 'closed', 'archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE priority_level AS ENUM ('low', 'normal', 'high', 'urgent'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE lifecycle_stage AS ENUM ('lead', 'qualified', 'opportunity', 'client', 'churned'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE ticket_priority AS ENUM ('p1', 'p2', 'p3', 'p4'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE ticket_status AS ENUM ('open', 'acknowledged', 'in_progress', 'resolved', 'closed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE content_status AS ENUM ('draft', 'review', 'published', 'archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'viewer',
  divisions division_name[] NOT NULL DEFAULT '{}',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_team_members_auth_id ON team_members(auth_id);
CREATE INDEX IF NOT EXISTS idx_team_members_role ON team_members(role);
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "team_members_self_read" ON team_members FOR SELECT USING (auth.uid() = auth_id);
CREATE POLICY IF NOT EXISTS "team_members_admin_all" ON team_members FOR ALL USING (EXISTS (SELECT 1 FROM team_members tm WHERE tm.auth_id = auth.uid() AND tm.role = 'super_admin'));

CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL, name TEXT, company TEXT, phone TEXT, role TEXT, source TEXT,
  division_interest division_name[], tags TEXT[] NOT NULL DEFAULT '{}',
  lifecycle_stage lifecycle_stage NOT NULL DEFAULT 'lead',
  assigned_to UUID REFERENCES team_members(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_lifecycle ON contacts(lifecycle_stage);
CREATE INDEX IF NOT EXISTS idx_contacts_tags ON contacts USING GIN(tags);
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "contacts_admin_all" ON contacts FOR ALL USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  type TEXT NOT NULL, division division_name NOT NULL,
  status submission_status NOT NULL DEFAULT 'new',
  priority priority_level NOT NULL DEFAULT 'normal',
  data JSONB NOT NULL DEFAULT '{}',
  source_url TEXT, utm_source TEXT, utm_medium TEXT, utm_campaign TEXT,
  assigned_to UUID REFERENCES team_members(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ, reviewed_by UUID REFERENCES team_members(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_submissions_contact ON submissions(contact_id);
CREATE INDEX IF NOT EXISTS idx_submissions_division ON submissions(division);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created ON submissions(created_at DESC);
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "submissions_admin_all" ON submissions FOR ALL USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS pipeline_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES submissions(id) ON DELETE SET NULL,
  division division_name NOT NULL,
  stage TEXT NOT NULL DEFAULT 'discovery',
  value_estimate NUMERIC(12,2), probability SMALLINT CHECK (probability BETWEEN 0 AND 100),
  expected_close DATE,
  assigned_to UUID REFERENCES team_members(id) ON DELETE SET NULL,
  notes TEXT, won_at TIMESTAMPTZ, lost_at TIMESTAMPTZ, lost_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_pipeline_contact ON pipeline_entries(contact_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_division ON pipeline_entries(division);
CREATE INDEX IF NOT EXISTS idx_pipeline_stage ON pipeline_entries(stage);
ALTER TABLE pipeline_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "pipeline_admin_all" ON pipeline_entries FOR ALL USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
  actor_label TEXT,
  action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id UUID NOT NULL,
  details JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_activity_entity ON activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_log(created_at DESC);
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "activity_admin_read" ON activity_log FOR SELECT USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  plan TEXT, type TEXT NOT NULL,
  priority ticket_priority NOT NULL DEFAULT 'p3',
  title TEXT NOT NULL, description TEXT,
  status ticket_status NOT NULL DEFAULT 'open',
  assigned_to UUID REFERENCES team_members(id) ON DELETE SET NULL,
  acknowledged_at TIMESTAMPTZ, resolved_at TIMESTAMPTZ,
  resolution_notes TEXT, sla_response_deadline TIMESTAMPTZ, sla_met BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tickets_contact ON tickets(contact_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "tickets_admin_all" ON tickets FOR ALL USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS ventures_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  startup_name TEXT NOT NULL, stage TEXT NOT NULL, sector TEXT, pitch_deck_url TEXT,
  data JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'received',
  reviewer_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ, decision_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ventures_contact ON ventures_applications(contact_id);
CREATE INDEX IF NOT EXISTS idx_ventures_status ON ventures_applications(status);
ALTER TABLE ventures_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "ventures_admin_all" ON ventures_applications FOR ALL USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL, name TEXT,
  lists TEXT[] NOT NULL DEFAULT '{}',
  confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  confirm_token TEXT, confirmed_at TIMESTAMPTZ,
  unsubscribed BOOLEAN NOT NULL DEFAULT FALSE, unsub_at TIMESTAMPTZ,
  source TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_lists ON subscribers USING GIN(lists);
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "subscribers_public_insert" ON subscribers FOR INSERT WITH CHECK (TRUE);
CREATE POLICY IF NOT EXISTS "subscribers_admin_all" ON subscribers FOR ALL USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL, course_title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'course',
  status TEXT NOT NULL DEFAULT 'pending',
  price_paid NUMERIC(10,2), payment_ref TEXT,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ, certificate TEXT
);
CREATE INDEX IF NOT EXISTS idx_enrollments_contact ON enrollments(contact_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "enrollments_admin_all" ON enrollments FOR ALL USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY, value TEXT NOT NULL, description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "settings_admin_all" ON settings FOR ALL USING (auth.role() = 'authenticated');
INSERT INTO settings (key, value, description) VALUES
  ('email_studio',   'studio@sociofitechnology.com',   'Studio division email'),
  ('email_services', 'services@sociofitechnology.com', 'Services division email'),
  ('email_cloud',    'cloud@sociofitechnology.com',    'Cloud division email'),
  ('email_academy',  'academy@sociofitechnology.com',  'Academy division email'),
  ('email_ventures', 'ventures@sociofitechnology.com', 'Ventures division email'),
  ('email_labs',     'labs@sociofitechnology.com',     'Labs division email'),
  ('email_products', 'products@sociofitechnology.com', 'Products division email'),
  ('email_general',  'hello@sociofitechnology.com',    'General contact email'),
  ('pilot_enabled',  'true',                           'Enable PILOT AI assistant')
ON CONFLICT (key) DO NOTHING;

CREATE OR REPLACE TRIGGER trg_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER trg_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER trg_submissions_updated_at BEFORE UPDATE ON submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER trg_pipeline_updated_at BEFORE UPDATE ON pipeline_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER trg_tickets_updated_at BEFORE UPDATE ON tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER trg_ventures_updated_at BEFORE UPDATE ON ventures_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ══════════════════════════════════════════════════════════════
-- 002 — CMS SCHEMA
-- ══════════════════════════════════════════════════════════════

DO $$ BEGIN CREATE TYPE cms_content_type AS ENUM ('blog_post','case_study','testimonial','faq','course','workshop','experiment','open_source','announcement'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE cms_author_type AS ENUM ('human', 'agent'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE media_folder AS ENUM ('blog', 'portfolio', 'courses', 'logos', 'general'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE enrollment_status AS ENUM ('pending','active','completed','paused','cancelled','refunded'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS cms_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type cms_content_type NOT NULL DEFAULT 'blog_post',
  status content_status NOT NULL DEFAULT 'draft',
  title TEXT NOT NULL, slug TEXT UNIQUE NOT NULL,
  excerpt TEXT, body TEXT, content_json JSONB,
  division division_name,
  author TEXT NOT NULL DEFAULT 'SCRIBE',
  author_type cms_author_type NOT NULL DEFAULT 'agent',
  edited_by TEXT, tags TEXT[] NOT NULL DEFAULT '{}',
  seo_title TEXT, seo_description TEXT, cover_image TEXT,
  word_count INTEGER DEFAULT 0, featured BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cms_posts_status ON cms_posts(status);
CREATE INDEX IF NOT EXISTS idx_cms_posts_division ON cms_posts(division);
CREATE INDEX IF NOT EXISTS idx_cms_posts_slug ON cms_posts(slug);
CREATE INDEX IF NOT EXISTS idx_cms_posts_published ON cms_posts(published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_cms_posts_tags ON cms_posts USING GIN(tags);
ALTER TABLE cms_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "cms_posts_public_read" ON cms_posts FOR SELECT USING (status = 'published');
CREATE POLICY IF NOT EXISTS "cms_posts_admin_all" ON cms_posts FOR ALL USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS cms_content_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL, content_type cms_content_type NOT NULL,
  version INTEGER NOT NULL, author TEXT NOT NULL,
  author_type cms_author_type NOT NULL DEFAULT 'human',
  note TEXT, content_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cms_versions_content ON cms_content_versions(content_id);
ALTER TABLE cms_content_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "cms_versions_admin_all" ON cms_content_versions FOR ALL USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS cms_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL, original_name TEXT NOT NULL,
  public_url TEXT NOT NULL, storage_path TEXT NOT NULL,
  mime_type TEXT NOT NULL, size_bytes INTEGER NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image',
  folder media_folder NOT NULL DEFAULT 'general',
  alt_text TEXT, width INTEGER, height INTEGER,
  uploaded_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cms_media_folder ON cms_media(folder);
CREATE INDEX IF NOT EXISTS idx_cms_media_created ON cms_media(created_at DESC);
ALTER TABLE cms_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "cms_media_public_read" ON cms_media FOR SELECT USING (TRUE);
CREATE POLICY IF NOT EXISTS "cms_media_admin_all" ON cms_media FOR ALL USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS cms_faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL, answer TEXT NOT NULL,
  division division_name, order_index INTEGER NOT NULL DEFAULT 0,
  status content_status NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cms_faqs_division ON cms_faqs(division);
CREATE INDEX IF NOT EXISTS idx_cms_faqs_order ON cms_faqs(division, order_index);
ALTER TABLE cms_faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "cms_faqs_public_read" ON cms_faqs FOR SELECT USING (status = 'published');
CREATE POLICY IF NOT EXISTS "cms_faqs_admin_all" ON cms_faqs FOR ALL USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS cms_testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, title TEXT, company TEXT, content TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  division division_name, avatar_url TEXT,
  status content_status NOT NULL DEFAULT 'published',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cms_testimonials_division ON cms_testimonials(division);
ALTER TABLE cms_testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "cms_testimonials_public_read" ON cms_testimonials FOR SELECT USING (status = 'published');
CREATE POLICY IF NOT EXISTS "cms_testimonials_admin_all" ON cms_testimonials FOR ALL USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS cms_pricing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, division division_name NOT NULL,
  tier TEXT, price NUMERIC(10,2),
  billing_period TEXT NOT NULL DEFAULT 'month',
  tagline TEXT, features TEXT[] NOT NULL DEFAULT '{}',
  metadata JSONB NOT NULL DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  status content_status NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cms_pricing_division ON cms_pricing(division);
ALTER TABLE cms_pricing ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "cms_pricing_public_read" ON cms_pricing FOR SELECT USING (status = 'published');
CREATE POLICY IF NOT EXISTS "cms_pricing_admin_all" ON cms_pricing FOR ALL USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS cms_content_calendar (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL, brief TEXT,
  content_type cms_content_type NOT NULL DEFAULT 'blog_post',
  division division_name, due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'planned',
  assigned_to TEXT,
  post_id UUID REFERENCES cms_posts(id) ON DELETE SET NULL,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cms_calendar_due_date ON cms_content_calendar(due_date);
CREATE INDEX IF NOT EXISTS idx_cms_calendar_status ON cms_content_calendar(status);
ALTER TABLE cms_content_calendar ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "cms_calendar_admin_all" ON cms_content_calendar FOR ALL USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS cms_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, description TEXT,
  status content_status NOT NULL DEFAULT 'draft',
  category TEXT, audience TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  duration TEXT, duration_minutes INTEGER NOT NULL DEFAULT 0,
  outcomes TEXT[] NOT NULL DEFAULT '{}',
  modules JSONB NOT NULL DEFAULT '[]',
  thumbnail_url TEXT,
  thumbnail_gradient TEXT NOT NULL DEFAULT 'linear-gradient(135deg,#3A589E,#59A392)',
  enrollment_count INTEGER NOT NULL DEFAULT 0,
  agent_drafted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cms_courses_status ON cms_courses(status);
CREATE INDEX IF NOT EXISTS idx_cms_courses_category ON cms_courses(category);
ALTER TABLE cms_courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "cms_courses_public_read" ON cms_courses FOR SELECT USING (status = 'published');
CREATE POLICY IF NOT EXISTS "cms_courses_admin_all" ON cms_courses FOR ALL USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS cms_workshops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, description TEXT,
  instructor TEXT, date TIMESTAMPTZ, duration_hours NUMERIC(4,1),
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  max_seats INTEGER, enrolled_seats INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'upcoming',
  format TEXT NOT NULL DEFAULT 'online',
  meeting_url TEXT, location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cms_workshops_status ON cms_workshops(status);
CREATE INDEX IF NOT EXISTS idx_cms_workshops_date ON cms_workshops(date);
ALTER TABLE cms_workshops ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "cms_workshops_public_read" ON cms_workshops FOR SELECT USING (TRUE);
CREATE POLICY IF NOT EXISTS "cms_workshops_admin_all" ON cms_workshops FOR ALL USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS cms_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name TEXT NOT NULL, student_email TEXT NOT NULL,
  course_id UUID REFERENCES cms_courses(id) ON DELETE SET NULL,
  workshop_id UUID REFERENCES cms_workshops(id) ON DELETE SET NULL,
  status enrollment_status NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'unpaid',
  payment_amount_usd NUMERIC(10,2) NOT NULL DEFAULT 0,
  stripe_payment_id TEXT,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), completed_at TIMESTAMPTZ,
  CONSTRAINT enrollment_has_target CHECK (course_id IS NOT NULL OR workshop_id IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS idx_cms_enrollments_course ON cms_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_cms_enrollments_workshop ON cms_enrollments(workshop_id);
CREATE INDEX IF NOT EXISTS idx_cms_enrollments_email ON cms_enrollments(student_email);
ALTER TABLE cms_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "cms_enrollments_admin_all" ON cms_enrollments FOR ALL USING (auth.role() = 'authenticated');

CREATE OR REPLACE TRIGGER trg_cms_posts_updated_at BEFORE UPDATE ON cms_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER trg_cms_faqs_updated_at BEFORE UPDATE ON cms_faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER trg_cms_testimonials_updated_at BEFORE UPDATE ON cms_testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER trg_cms_pricing_updated_at BEFORE UPDATE ON cms_pricing FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER trg_cms_calendar_updated_at BEFORE UPDATE ON cms_content_calendar FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER trg_cms_courses_updated_at BEFORE UPDATE ON cms_courses FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER trg_cms_workshops_updated_at BEFORE UPDATE ON cms_workshops FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ══════════════════════════════════════════════════════════════
-- 003 — STUDIO & PORTFOLIO
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS cms_studio_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('service', 'highlight', 'process_step', 'differentiator')),
  title TEXT NOT NULL, description TEXT NOT NULL, body TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  status content_status NOT NULL DEFAULT 'draft',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cms_studio_type ON cms_studio_content(type);
CREATE INDEX IF NOT EXISTS idx_cms_studio_status ON cms_studio_content(status);
CREATE INDEX IF NOT EXISTS idx_cms_studio_order ON cms_studio_content(order_index);
ALTER TABLE cms_studio_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "cms_studio_content_select" ON cms_studio_content FOR SELECT USING (TRUE);
CREATE POLICY IF NOT EXISTS "cms_studio_content_modify" ON cms_studio_content FOR ALL USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS cms_portfolio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL, slug TEXT UNIQUE NOT NULL,
  client_name TEXT, client_industry TEXT,
  excerpt TEXT NOT NULL, challenge TEXT, solution TEXT,
  results TEXT[] NOT NULL DEFAULT '{}',
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  division division_name,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  status content_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cms_portfolio_status ON cms_portfolio(status);
CREATE INDEX IF NOT EXISTS idx_cms_portfolio_division ON cms_portfolio(division);
CREATE INDEX IF NOT EXISTS idx_cms_portfolio_featured ON cms_portfolio(featured);
CREATE INDEX IF NOT EXISTS idx_cms_portfolio_slug ON cms_portfolio(slug);
ALTER TABLE cms_portfolio ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "cms_portfolio_select" ON cms_portfolio FOR SELECT USING (TRUE);
CREATE POLICY IF NOT EXISTS "cms_portfolio_modify" ON cms_portfolio FOR ALL USING (auth.role() = 'authenticated');

INSERT INTO storage.buckets (id, name, public) VALUES ('cms', 'cms', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY IF NOT EXISTS "cms_storage_upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cms' AND auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "cms_storage_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'cms');
CREATE POLICY IF NOT EXISTS "cms_storage_delete" ON storage.objects FOR DELETE USING (bucket_id = 'cms' AND auth.role() = 'authenticated');

CREATE OR REPLACE TRIGGER cms_studio_content_updated_at BEFORE UPDATE ON cms_studio_content FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER cms_portfolio_updated_at BEFORE UPDATE ON cms_portfolio FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ══════════════════════════════════════════════════════════════
-- 004 — NEXUS AGENT TABLES
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS approval_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_name TEXT NOT NULL, action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL, entity_id UUID NOT NULL,
  title TEXT NOT NULL, context TEXT,
  payload JSONB NOT NULL DEFAULT '{}',
  confidence SMALLINT CHECK (confidence BETWEEN 0 AND 100),
  priority TEXT NOT NULL DEFAULT 'normal',
  status TEXT NOT NULL DEFAULT 'pending',
  decided_by UUID REFERENCES team_members(id) ON DELETE SET NULL,
  decided_at TIMESTAMPTZ, edited_payload JSONB, discard_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_approval_status ON approval_queue(status);
CREATE INDEX IF NOT EXISTS idx_approval_agent ON approval_queue(agent_name);
CREATE INDEX IF NOT EXISTS idx_approval_entity ON approval_queue(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_approval_created ON approval_queue(created_at DESC);
ALTER TABLE approval_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "approval_admin_all" ON approval_queue FOR ALL USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS followup_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  sequence_type TEXT NOT NULL, step_number INTEGER NOT NULL DEFAULT 1,
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  template_name TEXT NOT NULL, template_data JSONB NOT NULL DEFAULT '{}',
  sent_at TIMESTAMPTZ, error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_followup_contact ON followup_schedule(contact_id);
CREATE INDEX IF NOT EXISTS idx_followup_scheduled ON followup_schedule(scheduled_for) WHERE status = 'pending';
ALTER TABLE followup_schedule ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "followup_admin_all" ON followup_schedule FOR ALL USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS nexus_agent_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  run_id UUID NOT NULL UNIQUE, agent TEXT NOT NULL,
  service TEXT NOT NULL DEFAULT 'admin',
  trigger_type TEXT, status TEXT NOT NULL,
  input_summary TEXT, output_summary TEXT,
  approvals_created SMALLINT NOT NULL DEFAULT 0,
  tokens_used INTEGER NOT NULL DEFAULT 0,
  cost_usd NUMERIC(8,6), duration_ms INTEGER NOT NULL DEFAULT 0,
  error TEXT,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_nexus_runs_agent ON nexus_agent_runs(agent);
CREATE INDEX IF NOT EXISTS idx_nexus_runs_status ON nexus_agent_runs(status);
CREATE INDEX IF NOT EXISTS idx_nexus_runs_completed ON nexus_agent_runs(completed_at DESC);
ALTER TABLE nexus_agent_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "agent_runs_admin_read" ON nexus_agent_runs FOR SELECT USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS agent_deployments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL, service TEXT NOT NULL DEFAULT 'admin',
  description TEXT, enabled BOOLEAN NOT NULL DEFAULT TRUE,
  schedule TEXT, last_run_at TIMESTAMPTZ, last_status TEXT,
  config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE agent_deployments ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "agent_deployments_admin_all" ON agent_deployments FOR ALL USING (auth.role() = 'authenticated');
INSERT INTO agent_deployments (name, service, description, schedule) VALUES
  ('INTAKE',    'admin',   'Classifies inbound form submissions',      NULL),
  ('HERALD',    'admin',   'Sends emails and follow-up sequences',     '0 * * * *'),
  ('COMPASS',   'admin',   'Pipeline stage management',                '0 9 * * *'),
  ('WARDEN',    'admin',   'Support ticket handling',                  '*/15 * * * *'),
  ('SENTINEL',  'admin',   'Security monitoring',                      '0 */6 * * *'),
  ('SCRIBE',    'cms',     'Blog posts and newsletter drafts',         '0 8 * * 1'),
  ('CHRONICLE', 'cms',     'Audit logging',                            NULL),
  ('CURATOR',   'cms',     'Content calendar planning',                '0 9 * * 1'),
  ('PROFESSOR', 'academy', 'Course curriculum design',                 NULL),
  ('HUNTER',    'admin',   'Visitor analytics and insights',           '0 0 * * *')
ON CONFLICT (name) DO NOTHING;
CREATE OR REPLACE TRIGGER trg_agent_deployments_updated_at BEFORE UPDATE ON agent_deployments FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ══════════════════════════════════════════════════════════════
-- 005 — NEWSLETTER
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS newsletter_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_a TEXT NOT NULL, subject_b TEXT NOT NULL,
  editorial TEXT,
  selected_post_ids UUID[] NOT NULL DEFAULT '{}',
  division_highlights TEXT[] NOT NULL DEFAULT '{}',
  recommended_segment TEXT NOT NULL DEFAULT 'all',
  status TEXT NOT NULL DEFAULT 'draft',
  sent_at TIMESTAMPTZ,
  approval_id UUID REFERENCES approval_queue(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_issues(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_created ON newsletter_issues(created_at DESC);
ALTER TABLE newsletter_issues ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "newsletter_admin_all" ON newsletter_issues FOR ALL USING (auth.role() = 'authenticated');
CREATE OR REPLACE TRIGGER trg_newsletter_updated_at BEFORE UPDATE ON newsletter_issues FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ══════════════════════════════════════════════════════════════
-- 006 — API KEYS & USAGE (pay-as-you-go API product)
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key_hash TEXT UNIQUE NOT NULL, key_prefix TEXT NOT NULL,
  owner_email TEXT NOT NULL, owner_name TEXT, company TEXT,
  service TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'starter',
  monthly_limit INTEGER NOT NULL DEFAULT 1000,
  calls_this_month INTEGER NOT NULL DEFAULT 0,
  reset_date DATE NOT NULL DEFAULT (DATE_TRUNC('month', NOW()) + INTERVAL '1 month')::DATE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  revoked_at TIMESTAMPTZ, revoke_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_service ON api_keys(service);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(active) WHERE active = TRUE;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "api_keys_admin_all" ON api_keys FOR ALL USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS api_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  service TEXT NOT NULL, endpoint TEXT NOT NULL, agent TEXT,
  status_code SMALLINT, tokens_in INTEGER NOT NULL DEFAULT 0,
  tokens_out INTEGER NOT NULL DEFAULT 0, duration_ms INTEGER NOT NULL DEFAULT 0,
  cost_usd NUMERIC(8,6), error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_api_usage_key ON api_usage(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_created ON api_usage(created_at DESC);
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "api_usage_admin_all" ON api_usage FOR ALL USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS api_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL, service TEXT NOT NULL,
  monthly_limit INTEGER NOT NULL, price_usd NUMERIC(8,2) NOT NULL,
  overage_per_k NUMERIC(6,4), features TEXT[] NOT NULL DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE api_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "api_plans_public_read" ON api_plans FOR SELECT USING (active = TRUE);
CREATE POLICY IF NOT EXISTS "api_plans_admin_all" ON api_plans FOR ALL USING (auth.role() = 'authenticated');
INSERT INTO api_plans (name, service, monthly_limit, price_usd, overage_per_k, features) VALUES
  ('starter', 'nexus-admin',    1000,  49.00, 0.06, ARRAY['Lead classification','Email sequences','Pipeline tracking']),
  ('growth',  'nexus-admin',   10000, 199.00, 0.04, ARRAY['Everything in Starter','Slack notifications','Analytics']),
  ('scale',   'nexus-admin',   50000, 599.00, 0.02, ARRAY['Everything in Growth','Custom templates','SLA']),
  ('starter', 'nexus-cms',      1000,  49.00, 0.06, ARRAY['Blog drafts','Content calendar','Basic SEO']),
  ('growth',  'nexus-cms',     10000, 199.00, 0.04, ARRAY['Everything in Starter','Newsletter drafts','Analytics']),
  ('starter', 'nexus-academy',   500,  79.00, 0.10, ARRAY['Course curriculum','Lesson drafts','Quiz generation']),
  ('growth',  'nexus-academy',  5000, 299.00, 0.06, ARRAY['Everything in Starter','Workshop design','Bulk generation'])
ON CONFLICT (name) DO NOTHING;

CREATE OR REPLACE FUNCTION reset_monthly_api_counts() RETURNS void AS $$
BEGIN
  UPDATE api_keys SET calls_this_month = 0,
    reset_date = (DATE_TRUNC('month', NOW()) + INTERVAL '1 month')::DATE,
    updated_at = NOW()
  WHERE reset_date <= CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_api_keys_updated_at BEFORE UPDATE ON api_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ══════════════════════════════════════════════════════════════
-- REALTIME — enable on tables the admin panel subscribes to
-- ══════════════════════════════════════════════════════════════
-- Run these in Supabase dashboard → Database → Replication
-- OR uncomment here (requires superuser on self-hosted)
--
-- ALTER PUBLICATION supabase_realtime ADD TABLE submissions;
-- ALTER PUBLICATION supabase_realtime ADD TABLE contacts;
-- ALTER PUBLICATION supabase_realtime ADD TABLE approval_queue;
-- ALTER PUBLICATION supabase_realtime ADD TABLE pipeline_entries;
-- ALTER PUBLICATION supabase_realtime ADD TABLE activity_log;
-- ALTER PUBLICATION supabase_realtime ADD TABLE nexus_agent_runs;
