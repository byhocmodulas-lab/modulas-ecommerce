-- ================================================================
-- Modulas Luxury Furniture — Full Ecosystem Schema
-- Migration: 002_full_ecosystem_schema.sql
-- Depends on: 001_core_schema.sql (extensions, base tables)
-- ================================================================
-- Domain map:
--   §1  Roles & Users
--   §2  Products & Catalog
--   §3  Inventory & Reviews
--   §4  Orders & Shipping
--   §5  Payments & Refunds
--   §6  Campaigns & Discount Codes
--   §7  Architect Projects
--   §8  Workshops
--   §9  Blog Articles
--   §10 Competitor Intelligence
--   §11 SEO / AEO / GEO Data
--   §12 Indexes
-- ================================================================

-- ────────────────────────────────────────────────────────────────
-- §1  ROLES & USERS
-- ────────────────────────────────────────────────────────────────

-- Canonical role definitions (admin-managed, referenced by users.role)
CREATE TABLE roles (
  id          SMALLSERIAL PRIMARY KEY,
  name        VARCHAR(50)  UNIQUE NOT NULL,   -- 'customer' | 'architect' | 'creator' | 'editor' | 'admin'
  label       VARCHAR(100) NOT NULL,           -- display name
  description TEXT,
  permissions JSONB        NOT NULL DEFAULT '[]',  -- e.g. ["products:write","orders:read:all"]
  is_system   BOOLEAN      DEFAULT TRUE,           -- system roles cannot be deleted
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);

INSERT INTO roles (name, label, description, permissions) VALUES
  ('customer',  'Customer',          'End-consumer placing orders',
   '["orders:write:own","orders:read:own","products:read"]'),
  ('architect', 'Architect',         'Trade professional with project tools and trade discount',
   '["orders:write:own","orders:read:own","products:read","projects:write","collab:write"]'),
  ('creator',   'Creator / Affiliate','Content creator earning commission on referred orders',
   '["orders:read:own","products:read","campaigns:read:own","workshops:read"]'),
  ('editor',    'Content Editor',    'Internal staff managing catalog and content',
   '["products:write","blog:write","workshops:write","seo:write"]'),
  ('admin',     'Administrator',     'Full system access',
   '["*"]');

-- Extend users table (adds columns absent in 001)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS phone           VARCHAR(30),
  ADD COLUMN IF NOT EXISTS date_of_birth   DATE,
  ADD COLUMN IF NOT EXISTS preferred_currency CHAR(3) DEFAULT 'GBP',
  ADD COLUMN IF NOT EXISTS marketing_opt_in   BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS last_login_at      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS login_count        INTEGER DEFAULT 0;

-- Creator / affiliate profiles
CREATE TABLE creator_profiles (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  display_name      VARCHAR(255),
  bio               TEXT,
  social_links      JSONB DEFAULT '{}',      -- { instagram, tiktok, youtube, ... }
  audience_size     INTEGER,
  niche_tags        TEXT[],
  affiliate_code    VARCHAR(50) UNIQUE NOT NULL,
  stripe_account_id TEXT,
  commission_rate   NUMERIC(5,4) NOT NULL DEFAULT 0.10,
  pending_balance   NUMERIC(12,2) DEFAULT 0.00,
  paid_balance      NUMERIC(12,2) DEFAULT 0.00,
  status            VARCHAR(30) NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','active','suspended','terminated')),
  approved_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Active sessions / refresh tokens (used alongside Clerk in hybrid setups)
CREATE TABLE user_sessions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token TEXT UNIQUE NOT NULL,
  ip_address    INET,
  user_agent    TEXT,
  expires_at    TIMESTAMPTZ NOT NULL,
  revoked_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────────
-- §2  PRODUCTS & CATALOG
-- ────────────────────────────────────────────────────────────────

-- Extend categories (adds SEO fields absent in 001)
ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS meta_title       VARCHAR(255),
  ADD COLUMN IF NOT EXISTS meta_description TEXT,
  ADD COLUMN IF NOT EXISTS is_active        BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS featured         BOOLEAN DEFAULT FALSE;

-- Extend products (adds missing commercial fields)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS compare_at_price  NUMERIC(10,2),       -- RRP / crossed-out price
  ADD COLUMN IF NOT EXISTS cost_price        NUMERIC(10,2),       -- internal margin calc
  ADD COLUMN IF NOT EXISTS lead_time_days    SMALLINT DEFAULT 21,  -- made-to-order lead time
  ADD COLUMN IF NOT EXISTS is_featured       BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS architect_price   NUMERIC(10,2),       -- trade price (auto from discount %)
  ADD COLUMN IF NOT EXISTS seo_title         VARCHAR(255),
  ADD COLUMN IF NOT EXISTS seo_description   TEXT,
  ADD COLUMN IF NOT EXISTS embedding         vector(1536);         -- pgvector for semantic search

-- Product variants (e.g. fabric colours, leg finishes with separate SKUs)
CREATE TABLE product_variants (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku             VARCHAR(255) UNIQUE NOT NULL,
  name            VARCHAR(255) NOT NULL,       -- e.g. "Oatmeal Boucle / Walnut Legs"
  options         JSONB NOT NULL DEFAULT '{}', -- { colour: "oatmeal", leg: "walnut" }
  price_modifier  NUMERIC(10,2) DEFAULT 0.00,  -- added to base_price
  stock_qty       INTEGER DEFAULT 0,
  is_active       BOOLEAN DEFAULT TRUE,
  image_url       TEXT,
  weight_kg       NUMERIC(6,2)
);

-- ────────────────────────────────────────────────────────────────
-- §3  INVENTORY & REVIEWS
-- ────────────────────────────────────────────────────────────────

-- Stock ledger — append-only for auditable inventory
CREATE TABLE inventory_movements (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id    UUID NOT NULL REFERENCES products(id),
  variant_id    UUID REFERENCES product_variants(id),
  movement_type VARCHAR(30) NOT NULL
                CHECK (movement_type IN ('restock','sale','return','adjustment','reserved','released')),
  quantity      INTEGER NOT NULL,              -- positive = in, negative = out
  reference_id  UUID,                          -- order_id / adjustment_id
  note          TEXT,
  created_by    UUID REFERENCES users(id),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Materialised current stock (updated by trigger or application)
CREATE TABLE inventory (
  product_id  UUID NOT NULL REFERENCES products(id),
  variant_id  UUID REFERENCES product_variants(id),
  qty_on_hand INTEGER NOT NULL DEFAULT 0,
  qty_reserved INTEGER NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (product_id, COALESCE(variant_id, '00000000-0000-0000-0000-000000000000'::UUID))
);

-- Customer reviews
CREATE TABLE product_reviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES users(id),
  order_id    UUID REFERENCES orders(id),        -- verified purchase FK
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title       VARCHAR(255),
  body        TEXT,
  images      TEXT[],
  is_verified BOOLEAN DEFAULT FALSE,             -- set TRUE when order_id is present
  is_approved BOOLEAN DEFAULT FALSE,             -- editor approval gate
  helpful_count INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (product_id, user_id)                   -- one review per product per user
);

-- ────────────────────────────────────────────────────────────────
-- §4  ORDERS & SHIPPING
-- ────────────────────────────────────────────────────────────────

-- Extend orders (adds discount and tax tracking)
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS subtotal          NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS discount_amount   NUMERIC(10,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS tax_amount        NUMERIC(10,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS shipping_amount   NUMERIC(10,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS discount_code_id  UUID,   -- FK added after discount_codes table
  ADD COLUMN IF NOT EXISTS billing_address   JSONB;

-- Shipping / fulfilment tracking
CREATE TABLE shipments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id        UUID NOT NULL REFERENCES orders(id),
  carrier         VARCHAR(100),                   -- 'DHL' | 'UPS' | 'DPD' | 'White Glove'
  service_type    VARCHAR(100),                   -- 'express' | 'standard' | 'white-glove'
  tracking_number TEXT,
  tracking_url    TEXT,
  estimated_delivery DATE,
  shipped_at      TIMESTAMPTZ,
  delivered_at    TIMESTAMPTZ,
  status          VARCHAR(50) DEFAULT 'pending'
                  CHECK (status IN ('pending','dispatched','in_transit','out_for_delivery','delivered','failed','returned')),
  events          JSONB DEFAULT '[]',             -- webhook event history from carrier
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Order status history (audit trail)
CREATE TABLE order_status_history (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  from_status VARCHAR(50),
  to_status   VARCHAR(50) NOT NULL,
  changed_by  UUID REFERENCES users(id),
  note        TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────────
-- §5  PAYMENTS & REFUNDS
-- ────────────────────────────────────────────────────────────────

CREATE TABLE payments (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id                UUID NOT NULL REFERENCES orders(id),
  user_id                 UUID NOT NULL REFERENCES users(id),

  -- Stripe identifiers
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_charge_id         TEXT,
  stripe_customer_id       TEXT,
  stripe_payment_method_id TEXT,

  -- Amounts (in minor currency units where ambiguous → use decimals here)
  amount                  NUMERIC(12,2) NOT NULL,
  currency                CHAR(3) NOT NULL DEFAULT 'GBP',
  amount_received         NUMERIC(12,2),            -- may differ (FX, partial)
  application_fee         NUMERIC(12,2),            -- Stripe connect fee

  -- Status lifecycle
  status                  VARCHAR(30) NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending','processing','succeeded','failed','cancelled','refunded','partially_refunded')),
  payment_method_type     VARCHAR(50),              -- 'card' | 'bank_transfer' | 'klarna' | 'paypal'
  failure_code            VARCHAR(100),
  failure_message         TEXT,

  -- Timestamps
  authorised_at           TIMESTAMPTZ,
  captured_at             TIMESTAMPTZ,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE refunds (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id            UUID NOT NULL REFERENCES payments(id),
  order_id              UUID NOT NULL REFERENCES orders(id),
  stripe_refund_id      TEXT UNIQUE,
  amount                NUMERIC(12,2) NOT NULL,
  reason                VARCHAR(50) NOT NULL
                        CHECK (reason IN ('duplicate','fraudulent','customer_request','defective','other')),
  notes                 TEXT,
  status                VARCHAR(30) NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','succeeded','failed','cancelled')),
  initiated_by          UUID REFERENCES users(id),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  processed_at          TIMESTAMPTZ
);

-- Stripe Connect payouts to creators
CREATE TABLE creator_payouts (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_profile_id  UUID NOT NULL REFERENCES creator_profiles(id),
  stripe_transfer_id  TEXT UNIQUE,
  amount              NUMERIC(12,2) NOT NULL,
  currency            CHAR(3) NOT NULL DEFAULT 'GBP',
  status              VARCHAR(30) DEFAULT 'pending'
                      CHECK (status IN ('pending','in_transit','paid','failed','cancelled')),
  period_start        DATE NOT NULL,
  period_end          DATE NOT NULL,
  commission_ids      UUID[],                     -- array of commissions included
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  paid_at             TIMESTAMPTZ
);

-- ────────────────────────────────────────────────────────────────
-- §6  CAMPAIGNS & DISCOUNT CODES
-- ────────────────────────────────────────────────────────────────

CREATE TABLE campaigns (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(255) NOT NULL,
  slug            VARCHAR(255) UNIQUE NOT NULL,
  description     TEXT,
  type            VARCHAR(50) NOT NULL
                  CHECK (type IN ('seasonal','flash_sale','influencer','trade','loyalty','launch')),
  status          VARCHAR(30) NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft','scheduled','active','paused','ended','archived')),

  -- Targeting
  target_roles    TEXT[]  DEFAULT ARRAY['customer'],  -- roles eligible
  target_user_ids UUID[]  DEFAULT NULL,               -- NULL = all in target_roles

  -- Discount mechanics
  discount_type   VARCHAR(30)
                  CHECK (discount_type IN ('percentage','fixed_amount','free_shipping','buy_x_get_y')),
  discount_value  NUMERIC(10,2),                      -- % or GBP amount
  min_order_value NUMERIC(10,2) DEFAULT 0.00,
  max_discount    NUMERIC(10,2),                      -- cap for percentage discounts

  -- Budget / usage
  budget          NUMERIC(12,2),                      -- NULL = unlimited
  usage_limit     INTEGER,                            -- NULL = unlimited
  usage_count     INTEGER DEFAULT 0,
  per_user_limit  INTEGER DEFAULT 1,

  -- Schedule
  starts_at       TIMESTAMPTZ NOT NULL,
  ends_at         TIMESTAMPTZ,

  -- Tracking
  impressions     INTEGER DEFAULT 0,
  clicks          INTEGER DEFAULT 0,
  conversions     INTEGER DEFAULT 0,
  revenue         NUMERIC(12,2) DEFAULT 0.00,

  created_by      UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Products/categories scoped to a campaign (NULL rows = sitewide)
CREATE TABLE campaign_products (
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id),
  category_id UUID REFERENCES categories(id),
  CHECK (product_id IS NOT NULL OR category_id IS NOT NULL),
  PRIMARY KEY (campaign_id, COALESCE(product_id,'00000000-0000-0000-0000-000000000000'::UUID),
               COALESCE(category_id,'00000000-0000-0000-0000-000000000000'::UUID))
);

CREATE TABLE discount_codes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id     UUID REFERENCES campaigns(id),
  code            VARCHAR(50) UNIQUE NOT NULL,
  description     TEXT,
  discount_type   VARCHAR(30) NOT NULL
                  CHECK (discount_type IN ('percentage','fixed_amount','free_shipping')),
  discount_value  NUMERIC(10,2) NOT NULL,
  min_order_value NUMERIC(10,2) DEFAULT 0.00,
  max_discount    NUMERIC(10,2),
  usage_limit     INTEGER,
  usage_count     INTEGER DEFAULT 0,
  per_user_limit  INTEGER DEFAULT 1,
  is_active       BOOLEAN DEFAULT TRUE,
  starts_at       TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ,
  created_by      UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Back-fill FK now that discount_codes exists
ALTER TABLE orders
  ADD CONSTRAINT fk_orders_discount_code
  FOREIGN KEY (discount_code_id) REFERENCES discount_codes(id);

-- Per-user code redemption log
CREATE TABLE discount_code_usages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discount_code_id UUID NOT NULL REFERENCES discount_codes(id),
  user_id         UUID NOT NULL REFERENCES users(id),
  order_id        UUID NOT NULL REFERENCES orders(id),
  discount_applied NUMERIC(10,2) NOT NULL,
  used_at         TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────────
-- §7  ARCHITECT PROJECTS
-- ────────────────────────────────────────────────────────────────

CREATE TABLE architect_projects (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  architect_id    UUID NOT NULL REFERENCES users(id),
  client_id       UUID REFERENCES users(id),           -- optional client user account
  name            VARCHAR(255) NOT NULL,
  description     TEXT,
  project_type    VARCHAR(50)
                  CHECK (project_type IN ('residential','commercial','hospitality','retail','office','other')),
  status          VARCHAR(30) NOT NULL DEFAULT 'briefing'
                  CHECK (status IN ('briefing','concept','design','approval','procurement','complete','archived')),

  -- Project details
  location        JSONB,                              -- { address, city, country, postcode }
  total_area_sqm  NUMERIC(10,2),
  budget_gbp      NUMERIC(12,2),
  deadline_at     DATE,

  -- Collaboration
  collab_room_id  UUID REFERENCES collab_rooms(id),
  is_shared_with_client BOOLEAN DEFAULT FALSE,

  -- Files
  brief_doc_key   TEXT,                               -- R2 key for brief PDF
  floor_plan_key  TEXT,                               -- R2 key for floor plan
  mood_board_keys TEXT[],

  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

-- Rooms within a project
CREATE TABLE project_rooms (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id      UUID NOT NULL REFERENCES architect_projects(id) ON DELETE CASCADE,
  name            VARCHAR(255) NOT NULL,               -- 'Master Bedroom', 'Reception'
  room_type       VARCHAR(100),
  area_sqm        NUMERIC(8,2),
  height_m        NUMERIC(5,2),
  notes           TEXT,
  floor_plan_data JSONB,                              -- 2D layout JSON (canvas positions)
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Products placed inside rooms (configurator output)
CREATE TABLE project_items (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id          UUID NOT NULL REFERENCES project_rooms(id) ON DELETE CASCADE,
  product_id       UUID NOT NULL REFERENCES products(id),
  variant_id       UUID REFERENCES product_variants(id),
  configuration_id TEXT,                              -- MongoDB config doc ID
  quantity         INTEGER NOT NULL DEFAULT 1,
  unit_price       NUMERIC(10,2) NOT NULL,
  position         JSONB,                             -- { x, y, rotation, scale }
  notes            TEXT,
  is_approved      BOOLEAN DEFAULT FALSE,             -- client approved this item
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- People who can view / edit a project
CREATE TABLE project_collaborators (
  project_id  UUID NOT NULL REFERENCES architect_projects(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES users(id),
  access_level VARCHAR(20) NOT NULL DEFAULT 'viewer'
               CHECK (access_level IN ('viewer','commenter','editor','owner')),
  invited_by  UUID REFERENCES users(id),
  invited_at  TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  PRIMARY KEY (project_id, user_id)
);

-- ────────────────────────────────────────────────────────────────
-- §8  WORKSHOPS
-- ────────────────────────────────────────────────────────────────

CREATE TABLE workshops (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            VARCHAR(255) UNIQUE NOT NULL,
  title           VARCHAR(255) NOT NULL,
  subtitle        TEXT,
  description     TEXT,
  thumbnail_url   TEXT,
  trailer_url     TEXT,

  -- Categorisation
  topic           VARCHAR(100),                       -- 'interior-design' | 'material-care' | 'cad'
  skill_level     VARCHAR(30) DEFAULT 'all'
                  CHECK (skill_level IN ('all','beginner','intermediate','advanced')),
  tags            TEXT[],

  -- Access
  is_free         BOOLEAN DEFAULT FALSE,
  price_gbp       NUMERIC(10,2),
  enrolled_count  INTEGER DEFAULT 0,

  -- Instructor
  instructor_id   UUID REFERENCES users(id),
  instructor_bio  TEXT,

  -- Status
  status          VARCHAR(30) NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft','published','archived')),
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Individual video sessions / lessons within a workshop
CREATE TABLE workshop_sessions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id     UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  title           VARCHAR(255) NOT NULL,
  description     TEXT,
  sort_order      SMALLINT NOT NULL DEFAULT 0,

  -- Mux video
  mux_asset_id    TEXT,
  mux_playback_id TEXT,
  duration_secs   INTEGER,

  -- Attachments (R2 keys)
  resources       JSONB DEFAULT '[]',                 -- [{ label, file_key, url }]

  is_preview      BOOLEAN DEFAULT FALSE,              -- free preview even in paid workshop
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollment records
CREATE TABLE workshop_enrollments (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id  UUID NOT NULL REFERENCES workshops(id),
  user_id      UUID NOT NULL REFERENCES users(id),
  payment_id   UUID REFERENCES payments(id),
  enrolled_at  TIMESTAMPTZ DEFAULT NOW(),
  expires_at   TIMESTAMPTZ,                           -- NULL = lifetime
  UNIQUE (workshop_id, user_id)
);

-- Per-session watch progress
CREATE TABLE workshop_progress (
  enrollment_id    UUID NOT NULL REFERENCES workshop_enrollments(id) ON DELETE CASCADE,
  session_id       UUID NOT NULL REFERENCES workshop_sessions(id),
  watched_secs     INTEGER DEFAULT 0,
  is_completed     BOOLEAN DEFAULT FALSE,
  completed_at     TIMESTAMPTZ,
  last_watched_at  TIMESTAMPTZ,
  PRIMARY KEY (enrollment_id, session_id)
);

-- ────────────────────────────────────────────────────────────────
-- §9  BLOG ARTICLES
-- ────────────────────────────────────────────────────────────────

CREATE TABLE blog_categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        VARCHAR(255) UNIQUE NOT NULL,
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  parent_id   UUID REFERENCES blog_categories(id),
  sort_order  SMALLINT DEFAULT 0
);

CREATE TABLE blog_articles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            VARCHAR(255) UNIQUE NOT NULL,
  title           VARCHAR(255) NOT NULL,
  subtitle        TEXT,
  excerpt         TEXT,
  body            TEXT NOT NULL,                      -- rich-text / MDX content
  cover_image_url TEXT,

  -- Authorship
  author_id       UUID NOT NULL REFERENCES users(id),
  co_author_ids   UUID[] DEFAULT '{}',

  -- Classification
  category_id     UUID REFERENCES blog_categories(id),
  tags            TEXT[] DEFAULT '{}',
  reading_time_min SMALLINT,

  -- SEO
  seo_title       VARCHAR(255),
  seo_description TEXT,
  og_image_url    TEXT,
  canonical_url   TEXT,
  embedding       vector(1536),                       -- semantic search / AEO

  -- Status
  status          VARCHAR(30) NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft','in_review','scheduled','published','archived')),
  published_at    TIMESTAMPTZ,
  scheduled_for   TIMESTAMPTZ,

  -- Engagement
  view_count      INTEGER DEFAULT 0,
  like_count      INTEGER DEFAULT 0,
  share_count     INTEGER DEFAULT 0,
  comment_count   INTEGER DEFAULT 0,

  -- Linked products (for shoppable articles)
  featured_product_ids UUID[] DEFAULT '{}',

  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

CREATE TABLE article_comments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id  UUID NOT NULL REFERENCES blog_articles(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES users(id),
  parent_id   UUID REFERENCES article_comments(id),  -- threading
  body        TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────────
-- §10 COMPETITOR INTELLIGENCE
-- ────────────────────────────────────────────────────────────────

CREATE TABLE competitor_brands (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(255) NOT NULL,
  website_url     TEXT NOT NULL,
  country         CHAR(2),                            -- ISO 3166-1 alpha-2
  tier            VARCHAR(30) DEFAULT 'premium'
                  CHECK (tier IN ('budget','mid','premium','ultra-luxury')),
  is_active       BOOLEAN DEFAULT TRUE,               -- actively scraped
  scrape_config   JSONB DEFAULT '{}',                 -- Playwright selectors / rules
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE competitor_products (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id            UUID NOT NULL REFERENCES competitor_brands(id),
  external_id         TEXT,                           -- their product ID / URL slug
  name                VARCHAR(255) NOT NULL,
  url                 TEXT NOT NULL,
  category_guess      VARCHAR(100),
  material_guess      VARCHAR(100),
  current_price       NUMERIC(10,2),
  currency            CHAR(3) DEFAULT 'GBP',
  in_stock            BOOLEAN,
  images              TEXT[],
  description_excerpt TEXT,
  raw_data            JSONB DEFAULT '{}',             -- full scraped payload
  first_seen_at       TIMESTAMPTZ DEFAULT NOW(),
  last_scraped_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (brand_id, external_id)
);

CREATE TABLE competitor_price_history (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competitor_product_id UUID NOT NULL REFERENCES competitor_products(id) ON DELETE CASCADE,
  price                 NUMERIC(10,2) NOT NULL,
  currency              CHAR(3) DEFAULT 'GBP',
  in_stock              BOOLEAN,
  scraped_at            TIMESTAMPTZ DEFAULT NOW()
);

-- Scrape job log (ties to BullMQ job IDs)
CREATE TABLE scrape_jobs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id        UUID NOT NULL REFERENCES competitor_brands(id),
  bull_job_id     TEXT,
  status          VARCHAR(30) NOT NULL DEFAULT 'queued'
                  CHECK (status IN ('queued','running','completed','failed','cancelled')),
  pages_scraped   INTEGER DEFAULT 0,
  products_found  INTEGER DEFAULT 0,
  price_changes   INTEGER DEFAULT 0,
  error_message   TEXT,
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────────
-- §11 SEO / AEO / GEO DATA
-- ────────────────────────────────────────────────────────────────

-- Page-level SEO metadata (covers products, categories, blog, landing pages)
CREATE TABLE seo_metadata (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Entity reference (only one non-null at a time)
  entity_type       VARCHAR(50) NOT NULL
                    CHECK (entity_type IN ('product','category','blog_article','workshop','landing_page','custom')),
  entity_id         UUID,                             -- FK resolved in application layer
  url_path          VARCHAR(1000) UNIQUE NOT NULL,

  -- Classic SEO
  meta_title        VARCHAR(255),
  meta_description  TEXT,
  og_title          VARCHAR(255),
  og_description    TEXT,
  og_image_url      TEXT,
  canonical_url     TEXT,
  robots_directive  VARCHAR(100) DEFAULT 'index, follow',

  -- Structured data (JSON-LD blobs, one per schema type)
  structured_data   JSONB DEFAULT '[]',               -- [{ "@type": "Product", ... }]

  -- AEO (Answer Engine Optimization — featured snippet / AI answer targeting)
  target_question   TEXT,                             -- "What is the best modular sofa?"
  answer_snippet    TEXT,                             -- concise answer paragraph
  faq_schema        JSONB DEFAULT '[]',               -- [{ q, a }] → FAQPage JSON-LD

  -- GEO (Generative Engine Optimization — citations in LLM outputs)
  geo_summary       TEXT,                             -- authoritative summary for AI citations
  geo_entities      JSONB DEFAULT '[]',               -- named entities: [{ name, type, wikidata_id }]
  geo_citations     TEXT[],                           -- authoritative source URLs

  -- Keyword targeting
  primary_keyword   VARCHAR(255),
  secondary_keywords TEXT[],

  -- Performance snapshots (updated by weekly cron)
  last_crawled_at   TIMESTAMPTZ,
  indexing_status   VARCHAR(30) DEFAULT 'unknown'
                    CHECK (indexing_status IN ('unknown','indexed','not_indexed','excluded')),

  created_by        UUID REFERENCES users(id),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Keyword universe tracked for ranking
CREATE TABLE seo_keywords (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  keyword         VARCHAR(500) NOT NULL UNIQUE,
  intent          VARCHAR(30)
                  CHECK (intent IN ('informational','navigational','transactional','commercial')),
  search_volume   INTEGER,                            -- monthly UK searches
  difficulty      SMALLINT,                           -- 0-100
  cpc_gbp         NUMERIC(8,2),                       -- avg cost per click
  category        VARCHAR(100),                       -- internal grouping
  is_tracked      BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Weekly ranking snapshots per keyword / URL
CREATE TABLE keyword_rankings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  keyword_id      UUID NOT NULL REFERENCES seo_keywords(id),
  url_path        VARCHAR(1000) NOT NULL,
  position        SMALLINT,                           -- NULL = not ranking in top 100
  previous_position SMALLINT,
  search_engine   VARCHAR(30) DEFAULT 'google'
                  CHECK (search_engine IN ('google','bing','perplexity','chatgpt','gemini')),
  country_code    CHAR(2) DEFAULT 'GB',
  device          VARCHAR(20) DEFAULT 'desktop'
                  CHECK (device IN ('desktop','mobile')),
  snapshot_date   DATE NOT NULL,
  UNIQUE (keyword_id, url_path, search_engine, country_code, device, snapshot_date)
);

-- Content embeddings for semantic / vector search and RAG (AEO/GEO)
CREATE TABLE content_embeddings (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type   VARCHAR(50) NOT NULL,               -- matches seo_metadata.entity_type
  entity_id     UUID NOT NULL,
  chunk_index   SMALLINT NOT NULL DEFAULT 0,         -- for chunked long-form content
  chunk_text    TEXT NOT NULL,
  embedding     vector(1536) NOT NULL,               -- OpenAI / Anthropic embedding
  model         VARCHAR(100) DEFAULT 'text-embedding-3-large',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (entity_type, entity_id, chunk_index)
);

-- ────────────────────────────────────────────────────────────────
-- §12 INDEXES
-- ────────────────────────────────────────────────────────────────

-- §1 Users & Roles
CREATE INDEX idx_user_sessions_user      ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires   ON user_sessions(expires_at) WHERE revoked_at IS NULL;
CREATE INDEX idx_creator_profiles_code   ON creator_profiles(affiliate_code);
CREATE INDEX idx_creator_profiles_status ON creator_profiles(status);

-- §2 Products
CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_products_embedding       ON products USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);    -- pgvector ANN index

-- §3 Inventory & Reviews
CREATE INDEX idx_inventory_movements_product ON inventory_movements(product_id);
CREATE INDEX idx_product_reviews_product     ON product_reviews(product_id);
CREATE INDEX idx_product_reviews_approved    ON product_reviews(is_approved) WHERE is_approved = TRUE;

-- §4 Orders & Shipping
CREATE INDEX idx_shipments_order    ON shipments(order_id);
CREATE INDEX idx_shipments_tracking ON shipments(tracking_number);
CREATE INDEX idx_order_history_order ON order_status_history(order_id);

-- §5 Payments
CREATE INDEX idx_payments_order         ON payments(order_id);
CREATE INDEX idx_payments_stripe_intent ON payments(stripe_payment_intent_id);
CREATE INDEX idx_payments_status        ON payments(status);
CREATE INDEX idx_refunds_payment        ON refunds(payment_id);
CREATE INDEX idx_creator_payouts_creator ON creator_payouts(creator_profile_id);

-- §6 Campaigns
CREATE INDEX idx_campaigns_status    ON campaigns(status);
CREATE INDEX idx_campaigns_dates     ON campaigns(starts_at, ends_at);
CREATE INDEX idx_discount_codes_code ON discount_codes(code);
CREATE INDEX idx_discount_usages_user ON discount_code_usages(user_id);
CREATE INDEX idx_discount_usages_code ON discount_code_usages(discount_code_id);

-- §7 Architect Projects
CREATE INDEX idx_projects_architect ON architect_projects(architect_id);
CREATE INDEX idx_projects_status    ON architect_projects(status);
CREATE INDEX idx_project_rooms_project ON project_rooms(project_id);
CREATE INDEX idx_project_items_room    ON project_items(room_id);
CREATE INDEX idx_project_items_product ON project_items(product_id);

-- §8 Workshops
CREATE INDEX idx_workshops_status      ON workshops(status);
CREATE INDEX idx_workshop_sessions_wid ON workshop_sessions(workshop_id);
CREATE INDEX idx_enrollments_user      ON workshop_enrollments(user_id);
CREATE INDEX idx_enrollments_workshop  ON workshop_enrollments(workshop_id);

-- §9 Blog
CREATE INDEX idx_articles_status    ON blog_articles(status);
CREATE INDEX idx_articles_author    ON blog_articles(author_id);
CREATE INDEX idx_articles_category  ON blog_articles(category_id);
CREATE INDEX idx_articles_published ON blog_articles(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_articles_tags      ON blog_articles USING GIN(tags);
CREATE INDEX idx_articles_embedding ON blog_articles USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 50);
CREATE INDEX idx_article_comments_article ON article_comments(article_id);

-- §10 Competitor Intel
CREATE INDEX idx_comp_products_brand    ON competitor_products(brand_id);
CREATE INDEX idx_comp_price_history_pid ON competitor_price_history(competitor_product_id);
CREATE INDEX idx_comp_price_history_at  ON competitor_price_history(scraped_at DESC);
CREATE INDEX idx_scrape_jobs_brand      ON scrape_jobs(brand_id);
CREATE INDEX idx_scrape_jobs_status     ON scrape_jobs(status);

-- §11 SEO
CREATE INDEX idx_seo_metadata_entity   ON seo_metadata(entity_type, entity_id);
CREATE INDEX idx_seo_metadata_url      ON seo_metadata(url_path);
CREATE INDEX idx_keyword_rankings_kid  ON keyword_rankings(keyword_id);
CREATE INDEX idx_keyword_rankings_date ON keyword_rankings(snapshot_date DESC);
CREATE INDEX idx_content_embeddings_entity ON content_embeddings(entity_type, entity_id);
CREATE INDEX idx_content_embeddings_vec    ON content_embeddings
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ================================================================
-- END OF MIGRATION 002
-- ================================================================
