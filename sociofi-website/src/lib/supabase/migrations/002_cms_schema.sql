-- ============================================================
-- SocioFi Technology — Migration 002: CMS Schema
-- Run after 001_core_schema.sql
-- Note: cms_portfolio is defined in 003_studio_portfolio.sql
--       (richer schema with client_industry, challenge, solution, tech_stack)
-- ============================================================

-- ── CMS ENUM TYPES ────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE cms_content_type AS ENUM (
    'blog_post', 'case_study', 'testimonial', 'faq',
    'course', 'workshop', 'experiment', 'open_source', 'announcement'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE cms_author_type AS ENUM ('human', 'agent');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE media_folder AS ENUM ('blog', 'portfolio', 'courses', 'logos', 'general');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE enrollment_status AS ENUM ('pending', 'active', 'completed', 'paused', 'cancelled', 'refunded');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─────────────────────────────────────────
-- CMS POSTS
-- Blog posts, case studies, experiments, open-source writeups
-- Written by SCRIBE agent or human editors
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS cms_posts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type            cms_content_type NOT NULL DEFAULT 'blog_post',
  status          content_status NOT NULL DEFAULT 'draft',
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  excerpt         TEXT,
  body            TEXT,                        -- raw markdown
  content_json    JSONB,                       -- TipTap JSON (source of truth for editor)
  division        division_name,
  author          TEXT NOT NULL DEFAULT 'SCRIBE',
  author_type     cms_author_type NOT NULL DEFAULT 'agent',
  edited_by       TEXT,                        -- human editor name if reviewed
  tags            TEXT[] NOT NULL DEFAULT '{}',
  seo_title       TEXT,
  seo_description TEXT,
  cover_image     TEXT,
  word_count      INTEGER DEFAULT 0,
  featured        BOOLEAN NOT NULL DEFAULT FALSE,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_posts_status      ON cms_posts(status);
CREATE INDEX IF NOT EXISTS idx_cms_posts_division    ON cms_posts(division);
CREATE INDEX IF NOT EXISTS idx_cms_posts_type        ON cms_posts(type);
CREATE INDEX IF NOT EXISTS idx_cms_posts_slug        ON cms_posts(slug);
CREATE INDEX IF NOT EXISTS idx_cms_posts_published   ON cms_posts(published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_cms_posts_tags        ON cms_posts USING GIN(tags);

ALTER TABLE cms_posts ENABLE ROW LEVEL SECURITY;
-- Public website reads published posts without auth
CREATE POLICY IF NOT EXISTS "cms_posts_public_read" ON cms_posts
  FOR SELECT USING (status = 'published');
CREATE POLICY IF NOT EXISTS "cms_posts_admin_all" ON cms_posts
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- CMS CONTENT VERSIONS
-- Full history of every content change (who changed what, when)
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS cms_content_versions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id   UUID NOT NULL,                  -- references cms_posts.id (or other content)
  content_type cms_content_type NOT NULL,
  version      INTEGER NOT NULL,
  author       TEXT NOT NULL,
  author_type  cms_author_type NOT NULL DEFAULT 'human',
  note         TEXT,
  content_json JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_versions_content ON cms_content_versions(content_id);
CREATE INDEX IF NOT EXISTS idx_cms_versions_created ON cms_content_versions(created_at DESC);

ALTER TABLE cms_content_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "cms_versions_admin_all" ON cms_content_versions
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- CMS MEDIA
-- File metadata. Actual files stored in Supabase Storage bucket 'cms'.
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS cms_media (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename      TEXT NOT NULL,
  original_name TEXT NOT NULL,
  public_url    TEXT NOT NULL,
  storage_path  TEXT NOT NULL,
  mime_type     TEXT NOT NULL,
  size_bytes    INTEGER NOT NULL,
  media_type    TEXT NOT NULL DEFAULT 'image',  -- 'image' | 'document' | 'video' | 'other'
  folder        media_folder NOT NULL DEFAULT 'general',
  alt_text      TEXT,
  width         INTEGER,
  height        INTEGER,
  uploaded_by   TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_media_folder     ON cms_media(folder);
CREATE INDEX IF NOT EXISTS idx_cms_media_type       ON cms_media(media_type);
CREATE INDEX IF NOT EXISTS idx_cms_media_created    ON cms_media(created_at DESC);

ALTER TABLE cms_media ENABLE ROW LEVEL SECURITY;
-- Public read — images are served directly from Supabase CDN anyway
CREATE POLICY IF NOT EXISTS "cms_media_public_read" ON cms_media
  FOR SELECT USING (TRUE);
CREATE POLICY IF NOT EXISTS "cms_media_admin_all" ON cms_media
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- CMS FAQS
-- Per-division FAQ items, ordered
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS cms_faqs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question    TEXT NOT NULL,
  answer      TEXT NOT NULL,
  division    division_name,
  order_index INTEGER NOT NULL DEFAULT 0,
  status      content_status NOT NULL DEFAULT 'published',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_faqs_division ON cms_faqs(division);
CREATE INDEX IF NOT EXISTS idx_cms_faqs_order    ON cms_faqs(division, order_index);

ALTER TABLE cms_faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "cms_faqs_public_read" ON cms_faqs
  FOR SELECT USING (status = 'published');
CREATE POLICY IF NOT EXISTS "cms_faqs_admin_all" ON cms_faqs
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- CMS TESTIMONIALS
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS cms_testimonials (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  title      TEXT,
  company    TEXT,
  content    TEXT NOT NULL,
  rating     INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  division   division_name,
  avatar_url TEXT,
  status     content_status NOT NULL DEFAULT 'published',
  featured   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_testimonials_division ON cms_testimonials(division);
CREATE INDEX IF NOT EXISTS idx_cms_testimonials_featured ON cms_testimonials(featured);

ALTER TABLE cms_testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "cms_testimonials_public_read" ON cms_testimonials
  FOR SELECT USING (status = 'published');
CREATE POLICY IF NOT EXISTS "cms_testimonials_admin_all" ON cms_testimonials
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- CMS PRICING PLANS
-- Editable pricing tiers per division
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS cms_pricing (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           TEXT NOT NULL,
  division       division_name NOT NULL,
  tier           TEXT,                         -- 'starter' | 'growth' | 'scale' | 'enterprise'
  price          NUMERIC(10,2),
  billing_period TEXT NOT NULL DEFAULT 'month',-- 'month' | 'year' | 'one-time'
  tagline        TEXT,
  features       TEXT[] NOT NULL DEFAULT '{}',
  metadata       JSONB NOT NULL DEFAULT '{}',  -- badge, cta_text, highlight color, etc.
  is_featured    BOOLEAN NOT NULL DEFAULT FALSE,
  status         content_status NOT NULL DEFAULT 'published',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_pricing_division ON cms_pricing(division);
CREATE INDEX IF NOT EXISTS idx_cms_pricing_status   ON cms_pricing(status);

ALTER TABLE cms_pricing ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "cms_pricing_public_read" ON cms_pricing
  FOR SELECT USING (status = 'published');
CREATE POLICY IF NOT EXISTS "cms_pricing_admin_all" ON cms_pricing
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- CMS CONTENT CALENDAR
-- Planned content — CURATOR/SCRIBE agents pick these up
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS cms_content_calendar (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        TEXT NOT NULL,
  brief        TEXT,                           -- topic brief for SCRIBE
  content_type cms_content_type NOT NULL DEFAULT 'blog_post',
  division     division_name,
  due_date     DATE NOT NULL,
  status       TEXT NOT NULL DEFAULT 'planned',
  -- statuses: planned | drafting | review | published | cancelled
  assigned_to  TEXT,                           -- 'SCRIBE' or team member name
  post_id      UUID REFERENCES cms_posts(id) ON DELETE SET NULL,
  created_by   TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_calendar_due_date ON cms_content_calendar(due_date);
CREATE INDEX IF NOT EXISTS idx_cms_calendar_status   ON cms_content_calendar(status);

ALTER TABLE cms_content_calendar ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "cms_calendar_admin_all" ON cms_content_calendar
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- ACADEMY: COURSES
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS cms_courses (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title              TEXT NOT NULL,
  slug               TEXT UNIQUE NOT NULL,
  description        TEXT,
  status             content_status NOT NULL DEFAULT 'draft',
  category           TEXT,                    -- 'ai-development' | 'product' | 'no-code' etc.
  audience           TEXT,                    -- 'founders' | 'developers' | 'businesses'
  price              NUMERIC(10,2) NOT NULL DEFAULT 0,
  duration           TEXT,                    -- human-readable: '6 weeks', '3 hours'
  duration_minutes   INTEGER NOT NULL DEFAULT 0,
  outcomes           TEXT[] NOT NULL DEFAULT '{}',
  modules            JSONB NOT NULL DEFAULT '[]',
  -- [{title, lessons:[{title, duration_min, video_url}]}]
  thumbnail_url      TEXT,
  thumbnail_gradient TEXT NOT NULL DEFAULT 'linear-gradient(135deg,#3A589E,#59A392)',
  enrollment_count   INTEGER NOT NULL DEFAULT 0,
  agent_drafted      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_courses_status   ON cms_courses(status);
CREATE INDEX IF NOT EXISTS idx_cms_courses_category ON cms_courses(category);
CREATE INDEX IF NOT EXISTS idx_cms_courses_slug     ON cms_courses(slug);

ALTER TABLE cms_courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "cms_courses_public_read" ON cms_courses
  FOR SELECT USING (status = 'published');
CREATE POLICY IF NOT EXISTS "cms_courses_admin_all" ON cms_courses
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- ACADEMY: WORKSHOPS
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS cms_workshops (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  description     TEXT,
  instructor      TEXT,
  date            TIMESTAMPTZ,
  duration_hours  NUMERIC(4,1),
  price           NUMERIC(10,2) NOT NULL DEFAULT 0,
  max_seats       INTEGER,
  enrolled_seats  INTEGER NOT NULL DEFAULT 0,
  status          TEXT NOT NULL DEFAULT 'upcoming',
  -- statuses: upcoming | live | completed | cancelled
  format          TEXT NOT NULL DEFAULT 'online',  -- 'online' | 'in-person' | 'hybrid'
  meeting_url     TEXT,
  location        TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_workshops_status ON cms_workshops(status);
CREATE INDEX IF NOT EXISTS idx_cms_workshops_date   ON cms_workshops(date);

ALTER TABLE cms_workshops ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "cms_workshops_public_read" ON cms_workshops
  FOR SELECT USING (TRUE);
CREATE POLICY IF NOT EXISTS "cms_workshops_admin_all" ON cms_workshops
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- ACADEMY: CMS ENROLLMENTS
-- Fine-grained enrollment tracking (course/workshop specific)
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS cms_enrollments (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name       TEXT NOT NULL,
  student_email      TEXT NOT NULL,
  course_id          UUID REFERENCES cms_courses(id) ON DELETE SET NULL,
  workshop_id        UUID REFERENCES cms_workshops(id) ON DELETE SET NULL,
  status             enrollment_status NOT NULL DEFAULT 'pending',
  payment_status     TEXT NOT NULL DEFAULT 'unpaid',
  -- 'unpaid' | 'paid' | 'refunded' | 'waived'
  payment_amount_usd NUMERIC(10,2) NOT NULL DEFAULT 0,
  stripe_payment_id  TEXT,
  enrolled_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at       TIMESTAMPTZ,
  CONSTRAINT enrollment_has_target CHECK (course_id IS NOT NULL OR workshop_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_cms_enrollments_course   ON cms_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_cms_enrollments_workshop ON cms_enrollments(workshop_id);
CREATE INDEX IF NOT EXISTS idx_cms_enrollments_email    ON cms_enrollments(student_email);

ALTER TABLE cms_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "cms_enrollments_admin_all" ON cms_enrollments
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- UPDATED_AT TRIGGERS
-- ─────────────────────────────────────────

CREATE OR REPLACE TRIGGER trg_cms_posts_updated_at
  BEFORE UPDATE ON cms_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER trg_cms_faqs_updated_at
  BEFORE UPDATE ON cms_faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER trg_cms_testimonials_updated_at
  BEFORE UPDATE ON cms_testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER trg_cms_pricing_updated_at
  BEFORE UPDATE ON cms_pricing FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER trg_cms_calendar_updated_at
  BEFORE UPDATE ON cms_content_calendar FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER trg_cms_courses_updated_at
  BEFORE UPDATE ON cms_courses FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER trg_cms_workshops_updated_at
  BEFORE UPDATE ON cms_workshops FOR EACH ROW EXECUTE FUNCTION update_updated_at();
