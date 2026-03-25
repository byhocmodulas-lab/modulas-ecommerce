# Modulas — Luxury Furniture Ecommerce Ecosystem
## System Architecture

---

## 1. Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | Next.js 14 (App Router) | SSR/SSG, SEO, streaming, image optimization |
| 3D / AR | Three.js, React Three Fiber, WebXR | Browser-native 3D + AR without native app |
| Styling | Tailwind CSS + Radix UI | Headless, accessible, design-token driven |
| State | Zustand + TanStack Query | Lightweight global state + server cache |
| Backend Gateway | NestJS (Node.js) | Opinionated, modular, decorator-driven |
| Microservices | NestJS modules (deployable independently) | Domain isolation, independent scaling |
| Auth | Clerk / Auth.js + JWT + RBAC | Multi-role: customer, architect, creator, admin |
| Database (primary) | PostgreSQL (Supabase) | Relational integrity for orders, users, products |
| Database (content) | MongoDB | Flexible schema for blog, configs, reviews |
| Database (search) | Elasticsearch | Full-text, faceted search, SEO intelligence |
| Database (cache) | Redis | Sessions, rate limiting, job queues (BullMQ) |
| Vector Store | Pinecone / pgvector | AI embeddings for design assistant + search |
| File Storage | Cloudflare R2 + CDN | Assets, 3D models, AR files |
| AI Orchestration | LangChain.js + Anthropic Claude API | RAG pipelines, agents, content generation |
| AI Vision | OpenAI Vision / Replicate | Room analysis for interior design assistant |
| 3D Processing | Blender Python API (headless) | GLTF optimization, LOD generation |
| Queue / Jobs | BullMQ (Redis-backed) | Background jobs, scraping, AI generation |
| Search | Elasticsearch + Typesense | Product search + competitor intelligence |
| Email | Resend | Transactional + marketing |
| Payments | Stripe | Checkout, subscriptions, affiliate payouts |
| Analytics | PostHog + Plausible | Product analytics + privacy-first web analytics |
| Monitoring | Sentry + OpenTelemetry | Error tracking + distributed tracing |
| Infrastructure | Docker + Docker Compose (dev) / K8s (prod) | Container orchestration |
| CI/CD | GitHub Actions | Automated test, build, deploy pipeline |

---

## 2. Domain Model

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│  Store  │  Configurator  │  Architect Portal  │  Creator Hub   │
│  Blog   │  Workshop      │  Collab Hub        │  AR Viewer     │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS / GraphQL / REST / WS
┌────────────────────────▼────────────────────────────────────────┐
│                      API GATEWAY (NestJS)                       │
│  Auth Guard │ Rate Limiting │ Request Routing │ Response Cache  │
└──┬──────┬────────┬────────┬────────┬────────┬────────┬─────────┘
   │      │        │        │        │        │        │
   ▼      ▼        ▼        ▼        ▼        ▼        ▼
 [Catalog] [Orders] [Config] [Collab] [Content] [AI]  [Intel] [Vendor] [Social]
 Service   Service  Service  Service  Service  Svc   Service  Service  Monitor
   │          │        │        │        │        │        │
   └──────────┴────────┴────────┴────────┴────────┴────────┘
                              │
              ┌───────────────▼───────────────┐
              │         DATA LAYER            │
              │  PostgreSQL │ MongoDB │ Redis  │
              │  Elastic    │ Pinecone│  R2    │
              └───────────────────────────────┘
```

---

## 3. Service Domains

### 3.1 Catalog Service
- Product CRUD (furniture items, variants, materials, finishes)
- Collection & category management
- Pricing rules (volume, role-based: architect discount)
- Inventory tracking
- 3D model & AR asset registry

### 3.2 Order Service
- Cart & checkout flow
- Stripe payment processing
- Order lifecycle (placed → confirmed → produced → shipped → delivered)
- Returns & refunds
- Custom order requests (bespoke pieces)

### 3.3 User & Auth Service
- Roles: `customer`, `architect`, `creator`, `vendor`, `workshop_member`, `editor`, `admin`
- Architect verification workflow
- Creator onboarding & approval
- Profile management

### 3.4 Configurator Service
- Module rule engine (which parts combine legally)
- Real-time price calculation from configuration
- Save/load configurations
- Share configuration links (public or private)
- Export configuration as PDF/3D file

### 3.5 Affiliate & Creator Service
- Creator registration & approval
- Referral link generation & tracking
- Commission calculation & ledger
- Payout scheduling via Stripe Connect
- Affiliate dashboard analytics

### 3.6 Collaboration Hub Service
- Project rooms (architects + clients)
- Real-time presence (WebSockets)
- Moodboard builder
- Product pinning to projects
- Comment threads on products/configs
- File sharing (room renders, plans)

### 3.7 Workshop Platform Service
- Course / session CRUD
- Enrollment & attendance
- Video content delivery (Mux)
- Certificate generation
- Community discussion threads

### 3.8 Content Service (Blog & Magazine)
- Article CMS (rich editor → MDX)
- Author management
- Editorial workflow (draft → review → published)
- Tag / topic taxonomy
- SEO metadata per article

### 3.9 SEO / AEO / GEO Service
- Structured data generation (JSON-LD: Product, Organization, FAQ, HowTo)
- Sitemap & robots.txt automation
- AI-generated meta descriptions, FAQ blocks (AEO)
- Localized content variants (GEO targeting)
- Core Web Vitals monitoring pipeline
- Search console integration

### 3.10 Competitor Intelligence Service
- Scheduled scrapers (Playwright headless)
- Price monitoring across competitor catalogs
- Product gap analysis
- Trend detection from social + search data
- Report generation → internal dashboard

### 3.11 AI Service
- Interior design assistant (RAG over product catalog + vision)
- Style recommendation engine
- AI-generated product descriptions
- Automated blog content drafts
- Embedding generation pipeline
- Prompt management & versioning

### 3.12 Vendor & Brand Collaboration Service
- Vendor onboarding & contract management
- Vendor team RBAC (owner, admin, member, viewer)
- Product-to-vendor mapping with wholesale pricing
- Brand collection curation & launch scheduling
- Vendor sales analytics dashboard
- Multi-vendor order routing

### 3.13 Social Media Monitoring Service
- Track own + competitor + influencer social accounts
- Platform scrapers: Instagram, Pinterest, TikTok, YouTube, LinkedIn, X
- Brand mention detection via keyword matching
- AI-powered sentiment analysis (Claude Haiku batch)
- Engagement metrics aggregation & trend detection
- Alert system for negative mentions requiring response
- Social listening reports for marketing team

### 3.14 Internship & Workshop Extended Portal
- Internship application workflow (submit → review → interview → accept/reject)
- Mentor assignment for accepted interns
- Position listings linked to vendors (craft workshops at partner studios)
- Certificate verification via public URL + unique certificate number
- Community discussion threads per workshop

### 3.15 AR / 3D Asset Pipeline
- GLTF/GLB optimization (Blender headless)
- LOD (Level of Detail) generation
- USDZ export for iOS QuickLook
- Texture compression (KTX2/Basis)
- Asset CDN distribution

---

## 4. Data Flow: Key Scenarios

### Furniture Configuration → Purchase
```
User selects modules → Configurator Service validates rules
  → Real-time price from Catalog Service
  → Save config (MongoDB) → Add to Cart (Order Service)
  → Stripe Checkout → Order confirmed → Webhook triggers
  → Inventory update → Production queue notification
```

### AI Interior Design Session
```
User uploads room photo → AI Service (vision model analyzes room)
  → Extract style, colors, dimensions
  → Vector search over product catalog (Pinecone)
  → Rank by style match + budget
  → Return curated product recommendations + mood narrative
  → User saves products to Collaboration Hub project
```

### Architect Portal Flow
```
Architect registers → Verification workflow (license upload)
  → Admin approves → Role upgraded → Trade pricing unlocked
  → Creates client project in Collab Hub
  → Invites client → Shared moodboard + product selection
  → Exports quote PDF → Custom order submitted
```

### Creator Affiliate Flow
```
Creator applies → Approval → Unique referral links generated
  → Creator shares link → Customer clicks → Cookie set
  → Purchase completes → Commission calculated (Catalog rules)
  → Ledger entry created → Payout on monthly cycle (Stripe Connect)
```

### Vendor Collaboration Flow
```
Vendor applies / Admin onboards → Contract terms set
  → Vendor team invited → Portal access granted
  → Vendor uploads products + wholesale pricing
  → Admin reviews → Products go live with markup
  → Orders containing vendor products → routed to vendor
  → Vendor fulfills → Order status updates
  → Monthly settlement via Stripe Connect
```

### Social Media Monitoring Flow
```
BullMQ cron job (every 6h) → Social Scraper (Playwright)
  → Scrapes tracked accounts + keyword mentions
  → Posts stored in social_posts / social_mentions tables
  → Claude Haiku batch sentiment analysis
  → Alerts generated for negative/high-reach mentions
  → Dashboard updated → Marketing team notified (Slack/email)
```

### Blog Content Pipeline
```
Editor creates draft → AI drafts suggestions (Claude)
  → Editor refines → Links products to article
  → Submits for review → Reviewer approves
  → Published → Elasticsearch indexed → Sitemap updated
  → SEO metadata auto-generated (AI) → JSON-LD injected
  → Social share images auto-generated
```

---

## 5. Infrastructure Architecture

```
                        ┌─────────────┐
                        │  Cloudflare │  (DNS, WAF, CDN, R2)
                        └──────┬──────┘
                               │
                    ┌──────────▼──────────┐
                    │   Load Balancer      │
                    └──┬──────────────┬───┘
                       │              │
              ┌────────▼───┐   ┌──────▼──────┐
              │  Frontend  │   │  API Gateway │
              │  (Next.js) │   │  (NestJS)   │
              │  Vercel /  │   │  K8s Pod    │
              │  K8s       │   └──────┬──────┘
              └────────────┘          │
                                ┌─────▼──────────────────┐
                                │   Service Mesh          │
                                │  (individual NestJS     │
                                │   microservice pods)    │
                                └─────┬──────────────────┘
                                      │
                    ┌─────────────────▼─────────────────┐
                    │           Managed Data Layer        │
                    │  Supabase(PG) │ MongoDB Atlas       │
                    │  Redis Cloud  │ Elastic Cloud       │
                    │  Pinecone     │ Cloudflare R2       │
                    └────────────────────────────────────┘
```

---

## 6. Security Model

- **Auth**: JWT (short-lived) + refresh tokens (httpOnly cookie)
- **RBAC**: Role-based guards on every service endpoint
- **API Gateway**: Rate limiting per IP + per user
- **Input validation**: class-validator + zod on all boundaries
- **Secrets**: environment variables via Doppler / Vault
- **CORS**: strict origin allowlist per environment
- **CSP headers**: enforced via Next.js middleware
- **File uploads**: virus scan (ClamAV) + type whitelist + size limits
- **3rd party scripts**: SRI hashes enforced
- **PII**: encrypted at rest, GDPR-compliant deletion flows

---

## 7. Scaling Strategy

| Service | Scale Trigger | Strategy |
|---|---|---|
| Frontend | Traffic spikes | Edge/CDN (Vercel) + ISR caching |
| API Gateway | RPS > 1000 | Horizontal pod scaling |
| AI Service | Queue depth | Worker pool autoscale |
| Scraper (Intel) | Schedule | Cron-triggered ephemeral containers |
| 3D Pipeline | Asset uploads | Queue + dedicated GPU worker |
| Search | Query volume | Elastic autoscale replicas |
| WebSockets (Collab) | Connection count | Sticky sessions + Redis pub/sub |
| Social Monitor | Cron schedule | Ephemeral containers + BullMQ rate limiting |
| Vendor Portal | Vendor count | Shared with catalog service scaling |
| Content/Blog | Published articles | CDN + ISR revalidation |
