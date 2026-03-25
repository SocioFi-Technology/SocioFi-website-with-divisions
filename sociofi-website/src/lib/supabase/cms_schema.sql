-- SocioFi Technology — CMS Tables Migration
-- Run after schema.sql. Creates all CMS tables used by the custom agent-powered CMS.

-- ─────────────────────────────────────────
-- ENUM TYPES (CMS)
-- ─────────────────────────────────────────

CREATE TYPE cms_content_type AS ENUM (
  'blog_post', 'case_study', 'testimonial', 'faq',
  'course', 'workshop', 'agent_catalog', 'experiment', 'open_source'
);

CREATE TYPE cms_author_type AS ENUM ('human', 'agent');

CREATE TYPE media_folder AS ENUM ('blog', 'portfolio', 'agents', 'courses', 'logos', 'general');

CREATE TYPE enrollment_status AS ENUM ('pending', 'active', 'completed', 'paused', 'cancelled', 'refunded');

-- ─────────────────────────────────────────
-- CMS POSTS
-- Blog posts, case studies, experiments, open-source writeups
-- ─────────────────────────────────────────

CREATE TABLE cms_posts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type            cms_content_type NOT NULL DEFAULT 'blog_post',
  status          content_status NOT NULL DEFAULT 'draft',
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  excerpt         TEXT,
  body            TEXT,                          -- raw markdown / plain text fallback
  content_json    JSONB,                         -- TipTap JSON document
  division        division_name,
  author          TEXT NOT NULL DEFAULT 'SCRIBE',
  author_type     cms_author_type NOT NULL DEFAULT 'agent',
  edited_by       TEXT,
  tags            TEXT[] DEFAULT '{}',
  seo_title       TEXT,
  seo_description TEXT,
  cover_image     TEXT,                          -- public URL
  word_count      INTEGER DEFAULT 0,
  featured        BOOLEAN DEFAULT FALSE,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cms_posts_status   ON cms_posts(status);
CREATE INDEX idx_cms_posts_division ON cms_posts(division);
CREATE INDEX idx_cms_posts_type     ON cms_posts(type);
CREATE INDEX idx_cms_posts_slug     ON cms_posts(slug);

-- ─────────────────────────────────────────
-- CMS CONTENT VERSIONS
-- Full version history for any content item (audit trail)
-- ─────────────────────────────────────────

CREATE TABLE cms_content_versions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id   UUID NOT NULL,                    -- references cms_posts.id (or course/faq)
  content_type cms_content_type NOT NULL,
  version      INTEGER NOT NULL,
  author       TEXT NOT NULL,
  author_type  cms_author_type NOT NULL DEFAULT 'human',
  note         TEXT,
  content_json JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cms_versions_content ON cms_content_versions(content_id);

-- ─────────────────────────────────────────
-- CMS MEDIA
-- Files stored in Supabase Storage, metadata here
-- ─────────────────────────────────────────

CREATE TABLE cms_media (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename      TEXT NOT NULL,
  original_name TEXT NOT NULL,
  public_url    TEXT NOT NULL,
  storage_path  TEXT NOT NULL,                   -- path in Supabase Storage bucket
  mime_type     TEXT NOT NULL,
  size_bytes    INTEGER NOT NULL,
  media_type    TEXT NOT NULL DEFAULT 'image',   -- 'image' | 'document' | 'video' | 'other'
  folder        media_folder NOT NULL DEFAULT 'general',
  alt_text      TEXT,
  width         INTEGER,
  height        INTEGER,
  uploaded_by   TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cms_media_folder ON cms_media(folder);

-- ─────────────────────────────────────────
-- CMS FAQS
-- Per-division FAQ items, ordered
-- ─────────────────────────────────────────

CREATE TABLE cms_faqs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question    TEXT NOT NULL,
  answer      TEXT NOT NULL,
  division    division_name,
  order_index INTEGER NOT NULL DEFAULT 0,
  status      content_status NOT NULL DEFAULT 'published',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cms_faqs_division ON cms_faqs(division);

-- ─────────────────────────────────────────
-- CMS TESTIMONIALS
-- ─────────────────────────────────────────

CREATE TABLE cms_testimonials (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  title      TEXT,
  company    TEXT,
  content    TEXT NOT NULL,
  rating     INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  division   division_name,
  avatar_url TEXT,
  status     content_status NOT NULL DEFAULT 'published',
  featured   BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cms_testimonials_division ON cms_testimonials(division);

-- ─────────────────────────────────────────
-- CMS PORTFOLIO
-- Case study / project showcase items
-- ─────────────────────────────────────────

CREATE TABLE cms_portfolio (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  client      TEXT,
  division    division_name,
  category    TEXT,
  description TEXT,
  outcomes    TEXT,
  cover_image TEXT,
  status      content_status NOT NULL DEFAULT 'draft',
  featured    BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cms_portfolio_division ON cms_portfolio(division);

-- ─────────────────────────────────────────
-- CMS PRICING PLANS
-- Editable pricing tiers per division
-- ─────────────────────────────────────────

CREATE TABLE cms_pricing (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           TEXT NOT NULL,
  division       division_name NOT NULL,
  tier           TEXT,                           -- 'starter' | 'growth' | 'scale' | 'enterprise'
  price          NUMERIC(10,2),
  billing_period TEXT DEFAULT 'month',           -- 'month' | 'year' | 'one-time'
  tagline        TEXT,
  features       TEXT[] DEFAULT '{}',
  metadata       JSONB DEFAULT '{}',
  is_featured    BOOLEAN DEFAULT FALSE,
  status         content_status NOT NULL DEFAULT 'published',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cms_pricing_division ON cms_pricing(division);

-- ─────────────────────────────────────────
-- CMS CONTENT CALENDAR
-- Planned content — SCRIBE picks these up automatically
-- ─────────────────────────────────────────

CREATE TABLE cms_content_calendar (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        TEXT NOT NULL,
  brief        TEXT,                             -- topic brief for SCRIBE
  content_type cms_content_type NOT NULL DEFAULT 'blog_post',
  division     division_name,
  due_date     DATE NOT NULL,
  status       TEXT NOT NULL DEFAULT 'planned',  -- 'planned' | 'drafting' | 'review' | 'published' | 'cancelled'
  assigned_to  TEXT,                             -- 'SCRIBE' or team member name
  post_id      UUID REFERENCES cms_posts(id),   -- linked draft once SCRIBE creates it
  created_by   TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cms_calendar_due_date ON cms_content_calendar(due_date);
CREATE INDEX idx_cms_calendar_status   ON cms_content_calendar(status);

-- ─────────────────────────────────────────
-- ACADEMY: COURSES
-- ─────────────────────────────────────────

CREATE TABLE cms_courses (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title               TEXT NOT NULL,
  slug                TEXT UNIQUE NOT NULL,
  description         TEXT,
  status              content_status NOT NULL DEFAULT 'draft',
  category            TEXT,                      -- 'ai-development' | 'product' | 'no-code' etc.
  audience            TEXT,                      -- 'founders' | 'developers' | 'businesses'
  price               NUMERIC(10,2) DEFAULT 0,
  duration            TEXT,                      -- human-readable e.g. "6 weeks"
  duration_minutes    INTEGER DEFAULT 0,
  outcomes            TEXT[] DEFAULT '{}',
  modules             JSONB DEFAULT '[]',         -- [{title, lessons:[{title,duration_min}]}]
  thumbnail_gradient  TEXT DEFAULT 'linear-gradient(135deg,#3A589E,#59A392)',
  enrollment_count    INTEGER DEFAULT 0,
  mentor_drafted      BOOLEAN DEFAULT FALSE,      -- TRUE if MENTOR agent created the draft
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cms_courses_status   ON cms_courses(status);
CREATE INDEX idx_cms_courses_category ON cms_courses(category);

-- ─────────────────────────────────────────
-- ACADEMY: WORKSHOPS
-- ─────────────────────────────────────────

CREATE TABLE cms_workshops (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  description      TEXT,
  instructor       TEXT,
  date             TIMESTAMPTZ,
  duration_hours   NUMERIC(4,1),
  price            NUMERIC(10,2) DEFAULT 0,
  max_seats        INTEGER,
  enrolled_seats   INTEGER DEFAULT 0,
  status           TEXT NOT NULL DEFAULT 'upcoming',  -- 'upcoming' | 'live' | 'completed' | 'cancelled'
  format           TEXT DEFAULT 'online',              -- 'online' | 'in-person' | 'hybrid'
  meeting_url      TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- ACADEMY: ENROLLMENTS
-- ─────────────────────────────────────────

CREATE TABLE cms_enrollments (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name         TEXT NOT NULL,
  student_email        TEXT NOT NULL,
  course_id            UUID REFERENCES cms_courses(id) ON DELETE SET NULL,
  workshop_id          UUID REFERENCES cms_workshops(id) ON DELETE SET NULL,
  status               enrollment_status NOT NULL DEFAULT 'pending',
  payment_status       TEXT DEFAULT 'unpaid',   -- 'unpaid' | 'paid' | 'refunded' | 'waived'
  payment_amount_usd   NUMERIC(10,2) DEFAULT 0,
  stripe_payment_id    TEXT,
  enrolled_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at         TIMESTAMPTZ,
  CONSTRAINT enrollment_has_target CHECK (course_id IS NOT NULL OR workshop_id IS NOT NULL)
);

CREATE INDEX idx_cms_enrollments_course   ON cms_enrollments(course_id);
CREATE INDEX idx_cms_enrollments_workshop ON cms_enrollments(workshop_id);
CREATE INDEX idx_cms_enrollments_email    ON cms_enrollments(student_email);

-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────

ALTER TABLE cms_posts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_content_versions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_media             ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_faqs              ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_testimonials      ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_portfolio         ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_pricing           ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_content_calendar  ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_courses           ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_workshops         ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_enrollments       ENABLE ROW LEVEL SECURITY;

-- Public read for published content (website RSC queries)
CREATE POLICY "public_read_published_posts"        ON cms_posts             FOR SELECT USING (status = 'published');
CREATE POLICY "public_read_faqs"                   ON cms_faqs              FOR SELECT USING (status = 'published');
CREATE POLICY "public_read_testimonials"           ON cms_testimonials      FOR SELECT USING (status = 'published');
CREATE POLICY "public_read_portfolio"              ON cms_portfolio         FOR SELECT USING (status = 'published');
CREATE POLICY "public_read_pricing"                ON cms_pricing           FOR SELECT USING (status = 'published');
CREATE POLICY "public_read_courses"                ON cms_courses           FOR SELECT USING (status = 'published');
CREATE POLICY "public_read_workshops"              ON cms_workshops         FOR SELECT;
CREATE POLICY "public_read_media"                  ON cms_media             FOR SELECT USING (TRUE);

-- Authenticated users (admin panel) — full access
CREATE POLICY "admin_all_posts"        ON cms_posts             FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_versions"     ON cms_content_versions  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_media"        ON cms_media             FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_faqs"         ON cms_faqs              FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_testimonials" ON cms_testimonials      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_portfolio"    ON cms_portfolio         FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_pricing"      ON cms_pricing           FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_calendar"     ON cms_content_calendar  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_courses"      ON cms_courses           FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_workshops"    ON cms_workshops         FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_enrollments"  ON cms_enrollments       FOR ALL USING (auth.role() = 'authenticated');

-- Service role (NEXUS agents) — bypass RLS
-- Agents use SUPABASE_SERVICE_KEY which bypasses all RLS policies

-- ─────────────────────────────────────────
-- UPDATED_AT TRIGGERS
-- ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_cms_posts_updated_at             BEFORE UPDATE ON cms_posts             FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_cms_faqs_updated_at              BEFORE UPDATE ON cms_faqs              FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_cms_testimonials_updated_at      BEFORE UPDATE ON cms_testimonials      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_cms_portfolio_updated_at         BEFORE UPDATE ON cms_portfolio         FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_cms_pricing_updated_at           BEFORE UPDATE ON cms_pricing           FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_cms_calendar_updated_at          BEFORE UPDATE ON cms_content_calendar  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_cms_courses_updated_at           BEFORE UPDATE ON cms_courses           FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_cms_workshops_updated_at         BEFORE UPDATE ON cms_workshops         FOR EACH ROW EXECUTE FUNCTION update_updated_at();
