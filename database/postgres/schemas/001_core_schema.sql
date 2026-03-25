-- ============================================================
-- Modulas Core PostgreSQL Schema
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- trigram search
CREATE EXTENSION IF NOT EXISTS "vector";    -- pgvector for embeddings

-- ─── Users & Auth ────────────────────────────────────────────

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id      VARCHAR(255) UNIQUE NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  full_name     VARCHAR(255),
  avatar_url    TEXT,
  role          VARCHAR(50) NOT NULL DEFAULT 'customer'
                CHECK (role IN ('customer','architect','creator','editor','admin')),
  is_verified   BOOLEAN DEFAULT FALSE,
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ
);

CREATE TABLE architect_profiles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID UNIQUE NOT NULL REFERENCES users(id),
  company_name    VARCHAR(255),
  license_number  VARCHAR(255),
  license_doc_key TEXT,
  verification_status VARCHAR(50) DEFAULT 'pending'
                  CHECK (verification_status IN ('pending','approved','rejected')),
  trade_discount_pct NUMERIC(5,2) DEFAULT 15.00,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Catalog ─────────────────────────────────────────────────

CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        VARCHAR(255) UNIQUE NOT NULL,
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  parent_id   UUID REFERENCES categories(id),
  sort_order  INTEGER DEFAULT 0,
  image_url   TEXT
);

CREATE TABLE products (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku             VARCHAR(255) UNIQUE NOT NULL,
  slug            VARCHAR(255) UNIQUE NOT NULL,
  name            VARCHAR(255) NOT NULL,
  description     TEXT,
  category_id     UUID REFERENCES categories(id),
  base_price      NUMERIC(10,2) NOT NULL,
  currency        CHAR(3) DEFAULT 'GBP',
  material        VARCHAR(100),
  finish_options  TEXT[],
  dimensions      JSONB,          -- { width, height, depth, unit }
  weight_kg       NUMERIC(6,2),
  is_configurable BOOLEAN DEFAULT FALSE,
  has_ar_model    BOOLEAN DEFAULT FALSE,
  tags            TEXT[],
  is_active       BOOLEAN DEFAULT TRUE,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

CREATE TABLE product_images (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  file_key    TEXT NOT NULL,
  url         TEXT NOT NULL,
  alt_text    TEXT,
  sort_order  INTEGER DEFAULT 0,
  is_primary  BOOLEAN DEFAULT FALSE
);

CREATE TABLE product_assets_3d (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID UNIQUE NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  glb_key     TEXT,           -- GLTF Binary (web)
  gltf_key    TEXT,           -- GLTF JSON
  usdz_key    TEXT,           -- iOS AR QuickLook
  lod_keys    JSONB,          -- { low, medium, high } file keys
  file_size_kb INTEGER,
  poly_count  INTEGER,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE module_types (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES products(id),
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  base_price  NUMERIC(10,2) NOT NULL,
  model_key   TEXT,
  position_constraints JSONB,
  max_count   INTEGER DEFAULT 1
);

CREATE TABLE module_rules (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id            UUID NOT NULL REFERENCES products(id),
  type                  VARCHAR(50) NOT NULL CHECK (type IN ('REQUIRES','EXCLUDES','MAX_COUNT','POSITION')),
  source_module_type_id UUID REFERENCES module_types(id),
  target_module_type_id UUID REFERENCES module_types(id),
  max_count             INTEGER,
  rule_data             JSONB
);

-- ─── Orders ──────────────────────────────────────────────────

CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id),
  status          VARCHAR(50) NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','confirmed','in_production','shipped','delivered','cancelled','refunded')),
  total_amount    NUMERIC(10,2) NOT NULL,
  currency        CHAR(3) DEFAULT 'GBP',
  stripe_payment_intent_id TEXT,
  shipping_address JSONB NOT NULL,
  notes           TEXT,
  affiliate_code  VARCHAR(100),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id      UUID NOT NULL REFERENCES products(id),
  configuration_id UUID,       -- FK to MongoDB config
  quantity        INTEGER NOT NULL DEFAULT 1,
  unit_price      NUMERIC(10,2) NOT NULL,
  finish          VARCHAR(100),
  custom_specs    JSONB
);

-- ─── Affiliate ───────────────────────────────────────────────

CREATE TABLE creators (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID UNIQUE NOT NULL REFERENCES users(id),
  affiliate_code    VARCHAR(50) UNIQUE NOT NULL,
  stripe_account_id TEXT,
  commission_rate   NUMERIC(5,4) DEFAULT 0.10,
  pending_balance   NUMERIC(10,2) DEFAULT 0,
  paid_balance      NUMERIC(10,2) DEFAULT 0,
  status            VARCHAR(50) DEFAULT 'pending',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE commissions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id  UUID NOT NULL REFERENCES creators(id),
  order_id    UUID NOT NULL REFERENCES orders(id),
  amount      NUMERIC(10,2) NOT NULL,
  rate        NUMERIC(5,4) NOT NULL,
  status      VARCHAR(50) DEFAULT 'pending'
              CHECK (status IN ('pending','approved','paid','reversed')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Collaboration Hub ───────────────────────────────────────

CREATE TABLE collab_rooms (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(255) NOT NULL,
  owner_id    UUID NOT NULL REFERENCES users(id),
  client_id   UUID REFERENCES users(id),
  status      VARCHAR(50) DEFAULT 'active',
  settings    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE collab_room_members (
  room_id     UUID NOT NULL REFERENCES collab_rooms(id),
  user_id     UUID NOT NULL REFERENCES users(id),
  role        VARCHAR(50) DEFAULT 'viewer',
  joined_at   TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (room_id, user_id)
);

-- ─── Indexes ─────────────────────────────────────────────────

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_tags ON products USING GIN(tags);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_commissions_creator ON commissions(creator_id);
CREATE INDEX idx_users_clerk ON users(clerk_id);
