-- SocioFi Technology — Migration 003
-- Adds cms_studio_content and cms_portfolio tables
-- Run after cms_schema.sql

-- ─────────────────────────────────────────
-- CMS STUDIO CONTENT
-- Service descriptions, highlights, process steps, differentiators
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS cms_studio_content (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type         TEXT NOT NULL CHECK (type IN ('service', 'highlight', 'process_step', 'differentiator')),
  title        TEXT NOT NULL,
  description  TEXT NOT NULL,
  body         TEXT,                          -- extended content (optional)
  order_index  INTEGER NOT NULL DEFAULT 0,
  status       content_status NOT NULL DEFAULT 'draft',
  tags         TEXT[] DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_studio_type   ON cms_studio_content(type);
CREATE INDEX IF NOT EXISTS idx_cms_studio_status ON cms_studio_content(status);
CREATE INDEX IF NOT EXISTS idx_cms_studio_order  ON cms_studio_content(order_index);

-- auto-update updated_at
CREATE OR REPLACE TRIGGER cms_studio_content_updated_at
  BEFORE UPDATE ON cms_studio_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row-Level Security
ALTER TABLE cms_studio_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cms_studio_content_select" ON cms_studio_content
  FOR SELECT USING (true);                   -- public read (published content)

CREATE POLICY "cms_studio_content_modify" ON cms_studio_content
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- CMS PORTFOLIO
-- Case studies and project showcases
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS cms_portfolio (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  client_name      TEXT,                     -- nullable: anonymous clients
  client_industry  TEXT,
  excerpt          TEXT NOT NULL,
  challenge        TEXT,                     -- what problem the client had
  solution         TEXT,                     -- what SocioFi built
  results          TEXT[] DEFAULT '{}',      -- outcome bullets
  tech_stack       TEXT[] DEFAULT '{}',
  division         division_name,
  featured         BOOLEAN NOT NULL DEFAULT FALSE,
  status           content_status NOT NULL DEFAULT 'draft',
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_portfolio_status   ON cms_portfolio(status);
CREATE INDEX IF NOT EXISTS idx_cms_portfolio_division ON cms_portfolio(division);
CREATE INDEX IF NOT EXISTS idx_cms_portfolio_featured ON cms_portfolio(featured);
CREATE INDEX IF NOT EXISTS idx_cms_portfolio_slug     ON cms_portfolio(slug);

-- auto-update updated_at
CREATE OR REPLACE TRIGGER cms_portfolio_updated_at
  BEFORE UPDATE ON cms_portfolio
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row-Level Security
ALTER TABLE cms_portfolio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cms_portfolio_select" ON cms_portfolio
  FOR SELECT USING (true);

CREATE POLICY "cms_portfolio_modify" ON cms_portfolio
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- SUPABASE STORAGE BUCKET
-- Ensure cms bucket exists (idempotent — safe to re-run)
-- ─────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public)
VALUES ('cms', 'cms', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated uploads
CREATE POLICY IF NOT EXISTS "cms_storage_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'cms' AND auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "cms_storage_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'cms');

CREATE POLICY IF NOT EXISTS "cms_storage_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'cms' AND auth.role() = 'authenticated');
