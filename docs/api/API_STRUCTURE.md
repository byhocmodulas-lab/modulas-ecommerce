# Modulas API Structure

Base: `POST/GET/PUT/PATCH/DELETE /api/v1/...`
Auth: Bearer JWT (Clerk) on all non-public routes
Gateway port: 4000

---

## 1. Auth & Users (`/api/v1/auth`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/webhook/clerk` | Clerk webhook | Sync user creation/updates from Clerk |
| GET | `/auth/me` | Authenticated | Current user profile + role |
| PATCH | `/auth/me` | Authenticated | Update profile |
| GET | `/auth/users` | Admin | List all users (paginated, filterable) |
| PATCH | `/auth/users/:id/role` | Admin | Change user role |
| POST | `/auth/verify/architect` | Architect | Submit license for verification |
| PATCH | `/auth/verify/architect/:id` | Admin | Approve/reject architect |

---

## 2. Catalog (`/api/v1/catalog`)

### Products
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/catalog/products` | Public | Search/filter/paginate products (Elasticsearch) |
| GET | `/catalog/products/:slug` | Public | Product detail + related |
| POST | `/catalog/products` | Admin/Vendor | Create product |
| PATCH | `/catalog/products/:id` | Admin/Vendor | Update product |
| DELETE | `/catalog/products/:id` | Admin | Soft-delete product |
| GET | `/catalog/products/:id/pricing` | Authenticated | Role-aware pricing (architect discount) |

### Categories & Collections
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/catalog/categories` | Public | Category tree |
| POST | `/catalog/categories` | Admin | Create category |
| GET | `/catalog/collections` | Public | Curated collections |
| GET | `/catalog/collections/:slug` | Public | Collection detail + products |
| POST | `/catalog/collections` | Admin | Create collection |

### 3D Assets
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/catalog/assets/:productId` | Public | Get 3D model URLs (GLB, USDZ) |
| POST | `/catalog/assets/:productId/upload` | Admin | Upload 3D model → triggers optimization queue |
| GET | `/catalog/assets/:productId/lod/:level` | Public | Get specific LOD model |

---

## 3. Configurator (`/api/v1/configurator`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/configurator/products/:productId/modules` | Public | Available modules for product |
| GET | `/configurator/products/:productId/rules` | Public | Combination rules |
| POST | `/configurator/validate` | Public | Validate a configuration against rules |
| POST | `/configurator/price` | Public | Calculate price for configuration |
| POST | `/configurator/save` | Authenticated | Save configuration |
| GET | `/configurator/configs` | Authenticated | My saved configurations |
| GET | `/configurator/configs/:id` | Auth/Public link | Load configuration |
| POST | `/configurator/configs/:id/share` | Authenticated | Generate shareable link |
| POST | `/configurator/configs/:id/export/pdf` | Authenticated | Export as PDF spec sheet |
| POST | `/configurator/configs/:id/export/3d` | Authenticated | Export combined 3D model |

---

## 4. Orders (`/api/v1/orders`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/orders/cart` | Authenticated | Get current cart |
| POST | `/orders/cart/items` | Authenticated | Add item to cart |
| PATCH | `/orders/cart/items/:id` | Authenticated | Update quantity |
| DELETE | `/orders/cart/items/:id` | Authenticated | Remove item |
| POST | `/orders/checkout` | Authenticated | Create Stripe checkout session |
| POST | `/orders/webhook/stripe` | Stripe webhook | Payment confirmation |
| GET | `/orders` | Authenticated | My orders (paginated) |
| GET | `/orders/:id` | Authenticated | Order detail |
| GET | `/orders/admin` | Admin | All orders (filterable) |
| PATCH | `/orders/:id/status` | Admin | Update order status |
| POST | `/orders/:id/refund` | Admin | Process refund |

---

## 5. Affiliate / Creator Hub (`/api/v1/affiliate`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/affiliate/apply` | Authenticated | Apply to become creator |
| GET | `/affiliate/profile` | Creator | My creator profile |
| GET | `/affiliate/links` | Creator | My referral links |
| POST | `/affiliate/links` | Creator | Generate new referral link |
| GET | `/affiliate/commissions` | Creator | Commission history |
| GET | `/affiliate/earnings` | Creator | Earnings summary + charts |
| GET | `/affiliate/payouts` | Creator | Payout history |
| POST | `/affiliate/payouts/request` | Creator | Request manual payout |
| PATCH | `/affiliate/creators/:id` | Admin | Approve/suspend creator |
| GET | `/affiliate/admin/overview` | Admin | All creators + revenue stats |

---

## 6. Collaboration Hub (`/api/v1/collab`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/collab/rooms` | Authenticated | My rooms |
| POST | `/collab/rooms` | Architect/Admin | Create project room |
| GET | `/collab/rooms/:id` | Room member | Room detail + products + comments |
| PATCH | `/collab/rooms/:id` | Room owner | Update room settings |
| POST | `/collab/rooms/:id/invite` | Room owner | Invite member (email) |
| DELETE | `/collab/rooms/:id/members/:userId` | Room owner | Remove member |
| POST | `/collab/rooms/:id/products` | Room member | Pin product to room |
| DELETE | `/collab/rooms/:id/products/:productId` | Room member | Unpin product |
| GET | `/collab/rooms/:id/comments` | Room member | Comment thread |
| POST | `/collab/rooms/:id/comments` | Room member | Add comment |
| WS | `/collab/ws` | Authenticated | WebSocket: presence, real-time updates |

### Moodboards
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/collab/rooms/:id/moodboards` | Room member | Room moodboards |
| POST | `/collab/rooms/:id/moodboards` | Room member | Create moodboard |
| PATCH | `/collab/moodboards/:id` | Room member | Update moodboard layout |
| POST | `/collab/moodboards/:id/items` | Room member | Add item (product, image, note) |

---

## 7. Vendor & Brand Portal (`/api/v1/vendors`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/vendors` | Admin | List vendors |
| POST | `/vendors` | Admin | Onboard vendor |
| GET | `/vendors/:id` | Vendor member | Vendor profile |
| PATCH | `/vendors/:id` | Vendor admin | Update vendor info |
| GET | `/vendors/:id/products` | Vendor member | Vendor's product catalog |
| POST | `/vendors/:id/products` | Vendor admin | Add product to catalog |
| GET | `/vendors/:id/orders` | Vendor member | Orders containing vendor products |
| GET | `/vendors/:id/analytics` | Vendor member | Sales analytics |
| GET | `/vendors/:id/collections` | Public | Brand collections |
| POST | `/vendors/:id/collections` | Vendor admin | Create brand collection |
| POST | `/vendors/:id/invite` | Vendor owner | Invite team member |

---

## 8. Workshop & Internship (`/api/v1/workshops`)

### Workshops & Courses
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/workshops` | Public | Browse workshops (filterable) |
| GET | `/workshops/:slug` | Public | Workshop detail |
| POST | `/workshops` | Admin/Vendor | Create workshop |
| PATCH | `/workshops/:id` | Admin/Instructor | Update workshop |
| POST | `/workshops/:id/enroll` | Authenticated | Enroll in workshop |
| GET | `/workshops/my-enrollments` | Authenticated | My enrollments |
| POST | `/workshops/enrollments/:id/complete` | Admin/Instructor | Mark completed, issue cert |
| GET | `/workshops/certificates/:number` | Public | Verify certificate |

### Internships
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/workshops/internships` | Public | Open positions |
| POST | `/workshops/internships/apply` | Authenticated | Submit application |
| GET | `/workshops/internships/my-applications` | Authenticated | My applications |
| GET | `/workshops/internships/admin` | Admin | All applications |
| PATCH | `/workshops/internships/:id` | Admin | Update application status |

### Community
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/workshops/:id/discussions` | Enrolled | Discussion threads |
| POST | `/workshops/:id/discussions` | Enrolled | Create thread |
| POST | `/workshops/discussions/:id/replies` | Enrolled | Reply to thread |

---

## 9. Content / Blog CMS (`/api/v1/content`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/content/articles` | Public | Published articles (paginated) |
| GET | `/content/articles/:slug` | Public | Article detail |
| POST | `/content/articles` | Editor/Admin | Create article |
| PATCH | `/content/articles/:id` | Editor/Admin | Update article |
| PATCH | `/content/articles/:id/status` | Editor/Admin | Change workflow status |
| DELETE | `/content/articles/:id` | Admin | Archive article |
| GET | `/content/articles/drafts` | Editor | My drafts |
| POST | `/content/articles/:id/products` | Editor | Link products to article |
| GET | `/content/authors` | Public | Author profiles |
| GET | `/content/tags` | Public | Tag cloud / taxonomy |
| POST | `/content/media/upload` | Editor | Upload media asset |

---

## 10. SEO / AEO / GEO (`/api/v1/seo`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/seo/sitemap.xml` | Public | Dynamic XML sitemap |
| GET | `/seo/pages` | Admin | All tracked SEO pages |
| GET | `/seo/pages/:id` | Admin | Page SEO detail + rankings |
| PATCH | `/seo/pages/:id` | Admin | Update meta/title/description |
| POST | `/seo/pages/:id/generate-meta` | Admin | AI-generate meta description |
| GET | `/seo/pages/:id/faqs` | Admin | FAQ blocks for page |
| POST | `/seo/pages/:id/faqs/generate` | Admin | AI-generate FAQ (AEO) |
| POST | `/seo/pages/:id/geo-variants` | Admin | Generate locale variants (GEO) |
| GET | `/seo/rankings` | Admin | Keyword ranking dashboard |
| POST | `/seo/audit` | Admin | Trigger site-wide SEO audit |
| GET | `/seo/structured-data/:pageType/:id` | Internal | Get JSON-LD for entity |

---

## 11. Competitor Intelligence (`/api/v1/intel`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/intel/competitors` | Admin | List tracked competitors |
| POST | `/intel/competitors` | Admin | Add competitor to track |
| PATCH | `/intel/competitors/:id` | Admin | Update scrape config |
| GET | `/intel/competitors/:id/prices` | Admin | Price history |
| GET | `/intel/price-comparison` | Admin | Side-by-side price matrix |
| GET | `/intel/alerts` | Admin | Recent alerts |
| PATCH | `/intel/alerts/:id/read` | Admin | Mark alert read |
| POST | `/intel/scrape/:competitorId` | Admin | Trigger manual scrape |
| GET | `/intel/trends` | Admin | Market trend analysis |
| GET | `/intel/reports` | Admin | Generated reports |
| POST | `/intel/reports/generate` | Admin | AI-generate market report |

---

## 12. Social Media Monitoring (`/api/v1/social`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/social/accounts` | Admin | Tracked social accounts |
| POST | `/social/accounts` | Admin | Add account to monitor |
| DELETE | `/social/accounts/:id` | Admin | Stop monitoring |
| GET | `/social/feed` | Admin | Aggregated social feed |
| GET | `/social/mentions` | Admin | Brand mentions |
| PATCH | `/social/mentions/:id/respond` | Admin | Mark as responded |
| GET | `/social/analytics` | Admin | Engagement metrics + trends |
| GET | `/social/sentiment` | Admin | Sentiment analysis dashboard |
| GET | `/social/top-posts` | Admin | Highest engagement posts |
| POST | `/social/scrape` | Admin | Trigger manual scrape cycle |

---

## 13. AI Services (`/api/v1/ai`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/ai/assistant/chat` | Authenticated | Design assistant (streaming) |
| POST | `/ai/assistant/room-analysis` | Authenticated | Analyze room photo |
| POST | `/ai/recommendations` | Public | Product recommendations |
| POST | `/ai/content/description` | Editor/Admin | Generate product description |
| POST | `/ai/content/blog-draft` | Editor/Admin | Generate blog draft |
| POST | `/ai/embeddings/reindex` | Admin | Re-index product embeddings |

---

## Cross-Cutting Concerns

### Rate Limiting
| Tier | Limit |
|------|-------|
| Public | 60 req/min |
| Authenticated | 300 req/min |
| Admin | 1000 req/min |
| AI endpoints | 10 req/min per user |
| Webhooks | Unlimited (signature verified) |

### Pagination
All list endpoints accept: `?page=1&limit=24&sort=field:asc`

### Response Format
```json
{
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 24,
    "total": 156,
    "totalPages": 7
  }
}
```

### Error Format
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "details": [{ "field": "email", "issue": "must be a valid email" }]
}
```
