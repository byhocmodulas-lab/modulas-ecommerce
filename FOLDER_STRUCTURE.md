# Modulas — Complete Folder Structure

```
modulas-ecommerce/
│
├── ARCHITECTURE.md                    # Full system architecture doc
├── FOLDER_STRUCTURE.md                # This file
├── package.json                       # Monorepo root (npm workspaces)
├── .env.example                       # All environment variables documented
│
├── frontend/                          # Next.js 14 App Router
│   ├── next.config.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── public/
│   │   ├── models/                    # Static 3D models (fallback)
│   │   ├── textures/                  # Static texture maps
│   │   ├── images/
│   │   └── fonts/
│   └── src/
│       ├── app/                       # App Router pages
│       │   ├── layout.tsx             # Root layout (Clerk, Query, Analytics)
│       │   ├── (store)/               # Public storefront route group
│       │   │   ├── [locale]/          # i18n: en, fr, de, ...
│       │   │   ├── products/          # Product listing (search + filter)
│       │   │   │   ├── page.tsx
│       │   │   │   └── [slug]/        # Product detail + AR viewer
│       │   │   ├── collections/       # Curated collections
│       │   │   ├── cart/
│       │   │   ├── checkout/
│       │   │   └── account/           # Order history, saved configs
│       │   │
│       │   ├── (configurator)/        # Full-screen 3D configurator
│       │   │   └── page.tsx
│       │   │
│       │   ├── (architect-portal)/    # Role-gated: architect
│       │   │   ├── projects/          # Client project management
│       │   │   ├── clients/
│       │   │   └── quotes/            # PDF quote generation
│       │   │
│       │   ├── (creator-hub)/         # Role-gated: creator/affiliate
│       │   │   ├── dashboard/         # Earnings, conversions
│       │   │   ├── links/             # Affiliate link generator
│       │   │   └── earnings/          # Commission history + payouts
│       │   │
│       │   ├── (collab)/              # Collaboration hub
│       │   │   ├── rooms/             # Real-time project rooms
│       │   │   └── moodboards/        # Visual moodboard builder
│       │   │
│       │   ├── (workshop)/            # Workshop platform
│       │   │   ├── courses/           # Video courses + enrollment
│       │   │   └── community/         # Discussion forums
│       │   │
│       │   ├── (content)/             # Blog & magazine
│       │   │   ├── blog/
│       │   │   └── magazine/
│       │   │
│       │   ├── (vendor-portal)/       # Role-gated: vendor
│       │   │   ├── dashboard/         # Vendor analytics + quicklinks
│       │   │   ├── products/          # Vendor product management
│       │   │   ├── orders/            # Orders containing vendor products
│       │   │   └── collections/       # Brand collection curation
│       │   │
│       │   ├── (admin)/               # Role-gated: admin
│       │   │   ├── catalog/
│       │   │   ├── orders/
│       │   │   ├── users/
│       │   │   ├── vendors/           # Vendor onboarding + management
│       │   │   ├── intel/             # Competitor intelligence dashboard
│       │   │   ├── social/            # Social media monitoring dashboard
│       │   │   └── ai-studio/         # AI content generation tools
│       │   │
│       │   └── api/                   # API route handlers (edge/Node)
│       │       ├── ai/assistant/      # Streams design assistant responses
│       │       ├── configurator/save/
│       │       ├── webhooks/stripe/
│       │       └── webhooks/clerk/
│       │
│       ├── components/
│       │   ├── ui/                    # Base design system (Radix + Tailwind CVA)
│       │   │   ├── button.tsx
│       │   │   ├── dialog.tsx
│       │   │   ├── select.tsx
│       │   │   ├── slider.tsx
│       │   │   ├── toast.tsx
│       │   │   └── toaster.tsx
│       │   ├── layout/                # Header, footer, nav, sidebar
│       │   ├── store/                 # Product grid, filter, search, cart
│       │   ├── configurator/          # 3D canvas, module panel, config summary
│       │   ├── ar/                    # AR button, AR overlay
│       │   ├── architect/             # Project list, client cards, quote builder
│       │   ├── creator/               # Earnings summary, links, charts
│       │   ├── collab/                # Room view, moodboard, presence indicators
│       │   ├── workshop/              # Course card, video player, enrollment
│       │   ├── blog/                  # Article card, rich content renderer
│       │   ├── ai-assistant/          # Chat UI, room upload, product suggestions
│       │   └── seo/                   # JSON-LD injectors, breadcrumbs
│       │
│       ├── lib/
│       │   ├── api/                   # Typed API client (wraps fetch)
│       │   ├── auth/                  # require-role, session helpers
│       │   ├── hooks/                 # use-chat, use-ar, use-products
│       │   ├── stores/                # Zustand stores
│       │   │   ├── cart-store.ts
│       │   │   ├── configurator-store.tsx
│       │   │   └── ui-store.ts
│       │   ├── utils/                 # cn, format-price, slugify
│       │   ├── three/                 # Three.js helpers, material utils
│       │   ├── ar/                    # WebXR session management
│       │   ├── seo/                   # JSON-LD generators, sitemap utils
│       │   ├── analytics/             # PostHog event tracking
│       │   ├── i18n.ts                # next-intl config
│       │   └── providers/             # React context providers
│       │
│       ├── styles/
│       │   └── globals.css
│       └── types/                     # Shared TypeScript types
│           ├── api.ts
│           ├── product.ts
│           ├── order.ts
│           └── configurator.ts
│
├── backend/                           # NestJS monorepo
│   ├── apps/
│   │   ├── gateway/                   # API Gateway — routing, auth, rate limiting
│   │   │   └── src/
│   │   │       ├── main.ts
│   │   │       ├── gateway.module.ts
│   │   │       └── modules/           # Route proxies + middleware
│   │   │
│   │   ├── catalog/                   # Product, category, assets, pricing
│   │   │   └── src/modules/
│   │   │       ├── products/          # CRUD + Elastic indexing
│   │   │       ├── collections/
│   │   │       ├── assets/            # 3D asset registry
│   │   │       └── pricing/           # Role-based + volume pricing
│   │   │
│   │   ├── orders/                    # Cart, checkout, Stripe, fulfillment
│   │   │   └── src/modules/
│   │   │       ├── cart/
│   │   │       ├── checkout/
│   │   │       ├── payments/          # Stripe integration
│   │   │       ├── fulfillment/       # Order lifecycle
│   │   │       └── returns/
│   │   │
│   │   ├── auth/                      # Users, RBAC, sessions, verification
│   │   │   └── src/modules/
│   │   │       ├── users/
│   │   │       ├── roles/
│   │   │       ├── sessions/
│   │   │       └── verification/      # Architect license review workflow
│   │   │
│   │   ├── configurator/              # Rule engine, config storage, pricing, PDF/3D export
│   │   │   └── src/modules/
│   │   │       ├── rules/             # Module combination validation
│   │   │       ├── configurations/    # Save/load/share configs
│   │   │       ├── pricing/           # Real-time config price calc
│   │   │       └── export/            # PDF + 3D file export
│   │   │
│   │   ├── affiliate/                 # Creator onboarding, links, commissions, payouts
│   │   │   └── src/modules/
│   │   │       ├── creators/
│   │   │       ├── links/             # Referral tracking
│   │   │       ├── commissions/       # Ledger + calculation
│   │   │       └── payouts/           # Stripe Connect payout scheduling
│   │   │
│   │   ├── collab/                    # Realtime rooms, moodboards, presence
│   │   │   └── src/modules/
│   │   │       ├── rooms/
│   │   │       ├── moodboards/
│   │   │       ├── comments/
│   │   │       └── presence/          # WebSocket presence (Redis pub/sub)
│   │   │
│   │   ├── workshop/                  # Courses, enrollment, certificates, community
│   │   │   └── src/modules/
│   │   │       ├── courses/
│   │   │       ├── enrollments/
│   │   │       ├── certificates/      # PDF cert generation
│   │   │       └── community/
│   │   │
│   │   ├── content/                   # Blog/magazine CMS
│   │   │   └── src/modules/
│   │   │       ├── articles/
│   │   │       ├── authors/
│   │   │       ├── media/
│   │   │       └── taxonomy/
│   │   │
│   │   ├── seo/                       # Sitemap, structured data, meta, GEO/AEO
│   │   │   └── src/modules/
│   │   │       ├── sitemap/
│   │   │       ├── structured-data/
│   │   │       ├── meta/
│   │   │       ├── geo/               # Locale-specific content variants
│   │   │       └── aeo/               # FAQ block generation
│   │   │
│   │   ├── vendor/                    # Vendor & brand collaboration
│   │   │   └── src/modules/
│   │   │       ├── vendors/           # Vendor CRUD, onboarding
│   │   │       ├── members/           # Vendor team management
│   │   │       ├── collections/       # Brand collection management
│   │   │       └── analytics/         # Vendor sales analytics
│   │   │
│   │   ├── social/                    # Social media monitoring
│   │   │   └── src/modules/
│   │   │       ├── accounts/          # Tracked social accounts
│   │   │       ├── scraper/           # Scheduled social scrapers
│   │   │       ├── mentions/          # Brand mention detection
│   │   │       ├── sentiment/         # AI sentiment analysis
│   │   │       └── analytics/         # Engagement metrics + trends
│   │   │
│   │   ├── intel/                     # Competitor intelligence
│   │   │   └── src/modules/
│   │   │       ├── scrapers/          # Scheduled Playwright scrapers
│   │   │       ├── pricing-monitor/   # Price change detection + alerts
│   │   │       ├── trends/            # Search trend analysis
│   │   │       └── reports/           # Intelligence report generation
│   │   │
│   │   └── ai/                        # AI orchestration service
│   │       └── src/modules/
│   │           ├── assistant/         # Design assistant endpoint
│   │           ├── recommendations/   # Product recommendation engine
│   │           ├── content-gen/       # AI blog/description generation
│   │           ├── embeddings/        # Embedding pipeline (catalog indexing)
│   │           └── prompts/           # Prompt versioning + management
│   │
│   └── libs/                          # Shared NestJS libraries
│       ├── common/                    # Decorators, guards, interceptors, pipes, filters
│       ├── database/                  # Database connection modules
│       │   ├── postgres/              # TypeORM config
│       │   ├── mongo/                 # Mongoose config
│       │   ├── redis/                 # ioredis config
│       │   ├── elastic/               # @nestjs/elasticsearch config
│       │   └── vector/                # Pinecone client
│       ├── messaging/                 # Event definitions + BullMQ queues
│       │   ├── events/                # Typed domain events
│       │   └── queues/                # Queue definitions
│       ├── storage/                   # Cloudflare R2 / S3 client
│       ├── email/                     # Resend templates + sender
│       └── analytics/                 # Server-side analytics helpers
│
├── database/
│   ├── postgres/
│   │   ├── migrations/                # TypeORM migrations
│   │   ├── seeds/                     # Dev seed data
│   │   └── schemas/
│   │       ├── 001_core_schema.sql    # Users, catalog, orders, affiliates, collab
│   │       └── 002_extended_schema.sql # Vendors, workshops, content, SEO, social
│   ├── mongo/
│   │   ├── schemas/                   # Mongoose schema definitions
│   │   │   ├── configuration.schema.ts
│   │   │   ├── moodboard.schema.ts
│   │   │   └── article.schema.ts
│   │   └── seeds/
│   ├── elastic/
│   │   ├── mappings/                  # Index mappings (products, articles)
│   │   └── templates/                 # Index templates
│   ├── redis/
│   │   └── scripts/                   # Lua scripts for atomic ops
│   ├── vector/
│   │   └── schemas/                   # Pinecone index configs
│   └── backups/
│       └── scripts/                   # Automated backup scripts
│
├── ai-modules/
│   ├── interior-assistant/            # AI design assistant agent
│   │   └── src/
│   │       ├── agents/
│   │       │   └── design-agent.ts    # Agentic loop (Claude + tools)
│   │       ├── tools/                 # Tool implementations
│   │       │   ├── product-search-tool.ts
│   │       │   ├── room-analysis-tool.ts
│   │       │   └── style-match-tool.ts
│   │       ├── prompts/
│   │       │   └── design-system-prompt.ts
│   │       ├── vision/                # Room image analysis
│   │       └── rag/                   # Retrieval augmented generation
│   │
│   ├── recommendations/               # Product recommendation engine
│   │   └── src/
│   │       ├── models/                # Collaborative filtering model
│   │       ├── features/              # Feature engineering
│   │       ├── training/              # Model training pipeline
│   │       └── serving/               # Inference API
│   │
│   ├── content-generator/             # AI content pipeline
│   │   └── src/
│   │       ├── templates/             # Article/description templates
│   │       ├── pipelines/             # LangChain pipelines
│   │       └── validators/            # Content quality checks
│   │
│   ├── seo-optimizer/                 # AI SEO content generation
│   │   └── src/
│   │       ├── meta/
│   │       │   └── meta-generator.ts  # Title, description, FAQ generation
│   │       ├── faq-gen/               # People Also Ask optimization
│   │       └── geo-variant/           # Locale-specific SEO variants
│   │
│   ├── competitor-intel/              # Competitor monitoring
│   │   └── src/
│   │       ├── scrapers/
│   │       │   └── price-scraper.ts   # Playwright headless scraper
│   │       ├── parsers/               # HTML → structured data
│   │       ├── analyzers/             # Price gap, trend analysis
│   │       └── reporters/             # Report generation
│   │
│   ├── social-monitor/                # Social media monitoring + sentiment
│   │   └── src/
│   │       ├── scrapers/
│   │       │   └── social-scraper.ts  # Playwright social scraper
│   │       ├── sentiment/             # Claude-powered sentiment analysis
│   │       └── reporters/             # Engagement report generation
│   │
│   └── asset-pipeline/                # 3D asset processing
│       ├── src/
│       │   ├── optimizer/
│       │   │   └── gltf-optimizer.py  # Blender headless optimization
│       │   ├── lod-gen/               # Level-of-detail generation
│       │   └── ar-export/             # USDZ / WebXR export
│       └── blender-scripts/           # Blender Python utilities
│
├── infrastructure/
│   ├── docker/
│   │   ├── docker-compose.dev.yml     # Full dev stack (PG, Mongo, Redis, Elastic)
│   │   └── services/                  # Per-service Dockerfiles
│   ├── k8s/
│   │   ├── base/                      # Base Kustomize manifests
│   │   └── overlays/
│   │       ├── dev/
│   │       ├── staging/
│   │       └── prod/
│   ├── terraform/
│   │   ├── modules/                   # Reusable infra modules
│   │   └── environments/              # dev / staging / prod
│   ├── nginx/                         # Reverse proxy config
│   └── monitoring/
│       ├── grafana/dashboards/        # Pre-built dashboards
│       ├── prometheus/                # Scrape configs
│       └── alerts/                    # Alert rules
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                     # Type check, lint, test, build
│   │   ├── deploy-staging.yml
│   │   └── deploy-prod.yml
│   └── ISSUE_TEMPLATE/
│
├── scripts/
│   ├── setup/                         # First-time setup scripts
│   ├── seed/                          # Database seed runners
│   └── deploy/                        # Deployment helpers
│
└── docs/
    ├── api/                           # OpenAPI specs
    ├── architecture/                  # ADRs (Architecture Decision Records)
    └── runbooks/                      # Ops runbooks
```
