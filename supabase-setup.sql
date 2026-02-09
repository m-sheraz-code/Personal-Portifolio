-- =========================================
-- Portfolio Website Database Setup
-- Run this in Supabase SQL Editor
-- =========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================
-- PORTFOLIOS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  featured_image TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- SERVICES TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  short_description TEXT,
  description TEXT,
  icon TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- AUTO-UPDATE TRIGGER FOR updated_at
-- =========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to portfolios
DROP TRIGGER IF EXISTS portfolios_updated_at ON portfolios;
CREATE TRIGGER portfolios_updated_at
  BEFORE UPDATE ON portfolios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Apply trigger to services
DROP TRIGGER IF EXISTS services_updated_at ON services;
CREATE TRIGGER services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =========================================
-- ROW LEVEL SECURITY (RLS)
-- =========================================

-- Enable RLS on both tables
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Public read for published items
CREATE POLICY "Public can view published portfolios"
  ON portfolios FOR SELECT
  USING (status = 'published');

CREATE POLICY "Public can view published services"
  ON services FOR SELECT
  USING (status = 'published');

-- Authenticated users have full access
CREATE POLICY "Authenticated users have full access to portfolios"
  ON portfolios FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users have full access to services"
  ON services FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- =========================================
-- STORAGE BUCKET (Run in Supabase Dashboard)
-- =========================================
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create a new bucket named: portfolio-images
-- 3. Make it PUBLIC (enable public access)
-- 4. Add the following RLS policies:
--
--    For SELECT (anyone can view):
--    true
--
--    For INSERT (authenticated only):
--    auth.role() = 'authenticated'
--
--    For DELETE (authenticated only):
--    auth.role() = 'authenticated'

-- =========================================
-- INDEXES FOR BETTER PERFORMANCE
-- =========================================
CREATE INDEX IF NOT EXISTS idx_portfolios_order ON portfolios(order_index);
CREATE INDEX IF NOT EXISTS idx_portfolios_status ON portfolios(status);
CREATE INDEX IF NOT EXISTS idx_portfolios_slug ON portfolios(slug);

CREATE INDEX IF NOT EXISTS idx_services_order ON services(order_index);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
