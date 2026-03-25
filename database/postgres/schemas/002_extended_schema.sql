-- ============================================================
-- Modulas Extended Schema — Workshops, Content, Vendors,
-- Internships, SEO, Social Monitoring
-- ============================================================

-- ─── Vendor & Brand Collaboration ──────────────────────────

CREATE TABLE vendors (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(255) NOT NULL,
  slug            VARCHAR(255) UNIQUE NOT NULL,
  logo_url        TEXT,
  description     TEXT,
  contact_email   VARCHAR(255),
  website         TEXT,
  tier            VARCHAR(50) DEFAULT 'standard'
                  CHECK (tier IN ('standard','premium','exclusive')),
  commission_rate NUMERIC(5,4) DEFAULT 0.20,
  contract_start  DATE,
  contract_end    DATE,
  is_active       BOOLEAN DEFAULT TRUE,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vendor_users (
  vendor_id   UUID NOT NULL REFERENCES vendors(id),
  user_id     UUID NOT NULL REFERENCES users(id),
  role        VARCHAR(50) DEFAULT 'member'
              CHECK (role IN ('owner','admin','member','viewer')),
  invited_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (vendor_id, user_id)
);

CREATE TABLE vendor_products (
  vendor_id   UUID NOT NULL REFERENCES vendors(id),
  product_id  UUID NOT NULL REFERENCES products(id),
  vendor_sku  VARCHAR(255),
  wholesale_price NUMERIC(10,2),
  lead_time_days INTEGER DEFAULT 14,
  PRIMARY KEY (vendor_id, product_id)
);

CREATE TABLE brand_collections (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id   UUID NOT NULL REFERENCES vendors(id),
  name        VARCHAR(255) NOT NULL,
  slug        VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  hero_image  TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  launch_date DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Workshop & Internship Portal ──────────────────────────

CREATE TABLE workshops (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       VARCHAR(255) NOT NULL,
  slug        VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  type        VARCHAR(50) NOT NULL
              CHECK (type IN ('course','workshop','masterclass','internship')),
  instructor_id UUID REFERENCES users(id),
  vendor_id   UUID REFERENCES vendors(id),
  max_seats   INTEGER DEFAULT 20,
  price       NUMERIC(10,2) DEFAULT 0,
  currency    CHAR(3) DEFAULT 'GBP',
  duration_hours NUMERIC(6,1),
  skill_level VARCHAR(50) DEFAULT 'beginner'
              CHECK (skill_level IN ('beginner','intermediate','advanced')),
  is_online   BOOLEAN DEFAULT TRUE,
  location    TEXT,
  starts_at   TIMESTAMPTZ,
  ends_at     TIMESTAMPTZ,
  status      VARCHAR(50) DEFAULT 'draft'
              CHECK (status IN ('draft','published','full','completed','cancelled')),
  thumbnail   TEXT,
  video_url   TEXT,
  syllabus    JSONB DEFAULT '[]',
  tags        TEXT[],
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE workshop_enrollments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id UUID NOT NULL REFERENCES workshops(id),
  user_id     UUID NOT NULL REFERENCES users(id),
  status      VARCHAR(50) DEFAULT 'enrolled'
              CHECK (status IN ('enrolled','attended','completed','cancelled','no_show')),
  payment_id  TEXT,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(workshop_id, user_id)
);

CREATE TABLE certificates (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID UNIQUE NOT NULL REFERENCES workshop_enrollments(id),
  user_id       UUID NOT NULL REFERENCES users(id),
  workshop_id   UUID NOT NULL REFERENCES workshops(id),
  certificate_number VARCHAR(50) UNIQUE NOT NULL,
  pdf_key       TEXT,
  issued_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE internship_applications (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id),
  vendor_id     UUID REFERENCES vendors(id),
  position      VARCHAR(255) NOT NULL,
  cover_letter  TEXT,
  resume_key    TEXT,
  portfolio_url TEXT,
  status        VARCHAR(50) DEFAULT 'submitted'
                CHECK (status IN ('submitted','reviewed','interview','accepted','rejected','completed')),
  start_date    DATE,
  end_date      DATE,
  mentor_id     UUID REFERENCES users(id),
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Blog & Content CMS ────────────────────────────────────

CREATE TABLE authors (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID UNIQUE NOT NULL REFERENCES users(id),
  bio         TEXT,
  avatar_url  TEXT,
  social_links JSONB DEFAULT '{}',
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE articles (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          VARCHAR(255) UNIQUE NOT NULL,
  title         VARCHAR(500) NOT NULL,
  subtitle      TEXT,
  content       TEXT NOT NULL,
  excerpt       TEXT,
  author_id     UUID NOT NULL REFERENCES authors(id),
  category      VARCHAR(100),
  tags          TEXT[],
  cover_image   TEXT,
  status        VARCHAR(50) DEFAULT 'draft'
                CHECK (status IN ('draft','in_review','published','archived')),
  published_at  TIMESTAMPTZ,
  seo_title     VARCHAR(255),
  seo_description TEXT,
  seo_keywords  TEXT[],
  reading_time_min INTEGER,
  view_count    INTEGER DEFAULT 0,
  featured      BOOLEAN DEFAULT FALSE,
  content_type  VARCHAR(50) DEFAULT 'blog'
                CHECK (content_type IN ('blog','magazine','guide','case_study','news')),
  locale        VARCHAR(10) DEFAULT 'en',
  canonical_url TEXT,
  schema_markup JSONB,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE article_products (
  article_id  UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id),
  context     TEXT,
  sort_order  INTEGER DEFAULT 0,
  PRIMARY KEY (article_id, product_id)
);

-- ─── SEO / AEO / GEO Tracking ──────────────────────────────

CREATE TABLE seo_pages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url_path        TEXT UNIQUE NOT NULL,
  page_type       VARCHAR(50) NOT NULL
                  CHECK (page_type IN ('product','collection','article','landing','category')),
  entity_id       UUID,
  title           VARCHAR(255),
  meta_description TEXT,
  h1              VARCHAR(255),
  canonical_url   TEXT,
  og_image        TEXT,
  schema_types    TEXT[],
  locale          VARCHAR(10) DEFAULT 'en',
  is_indexed      BOOLEAN DEFAULT TRUE,
  last_crawled_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE seo_rankings (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id     UUID NOT NULL REFERENCES seo_pages(id),
  keyword     VARCHAR(255) NOT NULL,
  position    INTEGER,
  search_engine VARCHAR(20) DEFAULT 'google',
  locale      VARCHAR(10) DEFAULT 'en',
  tracked_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE faq_blocks (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id     UUID NOT NULL REFERENCES seo_pages(id),
  question    TEXT NOT NULL,
  answer      TEXT NOT NULL,
  sort_order  INTEGER DEFAULT 0,
  is_ai_generated BOOLEAN DEFAULT FALSE,
  source      VARCHAR(50) DEFAULT 'manual',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Competitor Intelligence ────────────────────────────────

CREATE TABLE competitors (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(255) NOT NULL,
  domain      TEXT UNIQUE NOT NULL,
  logo_url    TEXT,
  category    VARCHAR(100),
  is_active   BOOLEAN DEFAULT TRUE,
  scrape_config JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE competitor_prices (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competitor_id   UUID NOT NULL REFERENCES competitors(id),
  product_name    VARCHAR(255) NOT NULL,
  matched_product_id UUID REFERENCES products(id),
  price           NUMERIC(10,2) NOT NULL,
  currency        CHAR(3) DEFAULT 'GBP',
  url             TEXT,
  scraped_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE competitor_alerts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competitor_id   UUID NOT NULL REFERENCES competitors(id),
  alert_type      VARCHAR(50) NOT NULL
                  CHECK (alert_type IN ('price_drop','new_product','out_of_stock','new_collection','site_change')),
  title           VARCHAR(255) NOT NULL,
  details         JSONB,
  is_read         BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Social Media Monitoring ────────────────────────────────

CREATE TABLE social_accounts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform    VARCHAR(50) NOT NULL
              CHECK (platform IN ('instagram','tiktok','pinterest','youtube','linkedin','x')),
  account_type VARCHAR(50) NOT NULL
              CHECK (account_type IN ('own','competitor','influencer','hashtag')),
  handle      VARCHAR(255) NOT NULL,
  external_id TEXT,
  metadata    JSONB DEFAULT '{}',
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(platform, handle)
);

CREATE TABLE social_posts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id      UUID NOT NULL REFERENCES social_accounts(id),
  platform        VARCHAR(50) NOT NULL,
  external_post_id TEXT,
  content         TEXT,
  media_urls      TEXT[],
  post_type       VARCHAR(50),
  likes           INTEGER DEFAULT 0,
  comments        INTEGER DEFAULT 0,
  shares          INTEGER DEFAULT 0,
  engagement_rate NUMERIC(8,4),
  sentiment       VARCHAR(20)
                  CHECK (sentiment IN ('positive','neutral','negative','mixed')),
  mentions_brand  BOOLEAN DEFAULT FALSE,
  posted_at       TIMESTAMPTZ,
  scraped_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE social_mentions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform    VARCHAR(50) NOT NULL,
  post_url    TEXT,
  author      VARCHAR(255),
  content     TEXT,
  sentiment   VARCHAR(20)
              CHECK (sentiment IN ('positive','neutral','negative','mixed')),
  reach       INTEGER,
  product_id  UUID REFERENCES products(id),
  requires_response BOOLEAN DEFAULT FALSE,
  responded   BOOLEAN DEFAULT FALSE,
  detected_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Extended Indexes ───────────────────────────────────────

CREATE INDEX idx_workshops_status ON workshops(status);
CREATE INDEX idx_workshops_type ON workshops(type);
CREATE INDEX idx_enrollments_user ON workshop_enrollments(user_id);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_published ON articles(published_at) WHERE status = 'published';
CREATE INDEX idx_articles_tags ON articles USING GIN(tags);
CREATE INDEX idx_seo_rankings_keyword ON seo_rankings(keyword);
CREATE INDEX idx_seo_rankings_page ON seo_rankings(page_id);
CREATE INDEX idx_competitor_prices_competitor ON competitor_prices(competitor_id);
CREATE INDEX idx_social_posts_account ON social_posts(account_id);
CREATE INDEX idx_social_mentions_platform ON social_mentions(platform);
CREATE INDEX idx_social_mentions_sentiment ON social_mentions(sentiment);
CREATE INDEX idx_vendors_slug ON vendors(slug);
CREATE INDEX idx_internship_status ON internship_applications(status);
