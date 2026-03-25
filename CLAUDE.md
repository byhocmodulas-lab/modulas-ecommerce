# 🎨 PRODUCT LAYOUT & PAGE ARCHITECTURE (SOURCE OF TRUTH)

This defines the full platform structure.
All UI, API, and feature work MUST align with this.

---

# 🌐 PUBLIC WEBSITE

## 1. Home Page (/)

Purpose:
- Brand positioning (luxury furniture)
- Drive product discovery
- Highlight configurator + AI + architects

Sections:
1. Hero (visual + CTA → explore / customize)
2. Featured collections
3. 3D configurator highlight
4. Architect showcase
5. Trending products
6. Content (blogs/magazine)
7. Footer

---

## 2. Product Listing (/products)

Purpose:
- Browse catalog with filtering

Features:
- Filters: category, price, material, brand
- Sorting
- Pagination
- Search integration (Elasticsearch)

---

## 3. Product Detail (/product/[slug])

Purpose:
- Conversion-focused product view

Sections:
- Image/3D viewer (GLTF/AR)
- Product details
- Pricing
- Configurator entry
- Reviews
- Related products

---

## 4. Configurator (/configurator/[id])

Purpose:
- Customize product

Features:
- Material selection
- Dimensions
- Live 3D preview
- Price recalculation
- Export (PDF/3D)

---

## 5. Cart & Checkout

Pages:
- /cart
- /checkout

Features:
- Order summary
- Address
- Payment (Stripe)
- Confirmation

---

## 6. Content

Pages:
- /blog
- /article/[slug]

Purpose:
- SEO + brand authority

---

# 🧑‍💼 ROLE-BASED PORTALS

---

# 🛠️ ADMIN PANEL `(admin)`

Purpose:
Platform control

Pages:

## Dashboard
- KPIs
- Revenue
- Orders
- Users

## Catalog Management
- Products CRUD
- Categories
- 3D assets

## User Management
- All roles
- Permissions

## Vendor Management
- Approvals
- Performance

## AI Studio
- Prompt configs
- AI modules control

## Analytics
- Traffic
- Conversions

---

# 🏗️ ARCHITECT PORTAL `(architect-portal)`

Purpose:
Professional workspace

Pages:

## Dashboard
- Active projects
- Client interactions

## Projects
- Create/manage designs
- Attach products

## Quotes
- Generate quotations
- Share with clients

## Collaboration
- Real-time rooms
- Moodboards

---

# 🏪 VENDOR PORTAL `(vendor-portal)`

Purpose:
Seller operations

Pages:

## Dashboard
- Sales metrics
- Orders overview

## Product Management
- Add/edit products
- Upload assets

## Orders
- Fulfillment tracking

## Brand Management
- Collections

---

# 🎥 CREATOR HUB `(creator-hub)`

Purpose:
Affiliate + content monetization

Pages:

## Dashboard
- Earnings
- Performance

## Affiliate Links
- Generate/share links

## Campaigns
- Promotions

---

# 🎓 WORKSHOP / INTERN SYSTEM

Pages:

## Dashboard
- Courses
- Progress

## Applications
- Internship tracking

## Certificates
- Download/share

---

# 🧩 SHARED COMPONENT SYSTEM

All UI must use reusable components:

- Buttons
- Cards
- Modals
- Forms
- Tables

Rules:
- No duplicate components
- Centralized design system
- Consistent spacing, typography, colors

---

# 🔄 USER FLOWS (CRITICAL)

## Purchase Flow
Home → Product → Configurator (optional) → Cart → Checkout → Payment → Confirmation

## Architect Flow
Login → Dashboard → Projects → Quote → Client

## Vendor Flow
Login → Products → Orders → Fulfillment

## Creator Flow
Login → Links → Share → Earn

---

# 📡 DATA CONTRACT THINKING

Each page MUST:

- Define required API data
- Avoid over-fetching
- Use pagination where needed
- Maintain separation of concerns

---

# 🎯 DESIGN RULES (STRICT)

- Luxury minimal UI (no clutter)
- High-quality visuals prioritized
- Performance over animations
- Consistent spacing system
- No random UI experiments

---

# ⚠️ UI FAILURE PATTERNS

- Inconsistent layouts across portals
- Mixing admin and user UI styles
- Overloaded pages
- Missing loading/error states
- Hardcoded data

---

# ✅ PAGE COMPLETION STANDARD

A page is complete ONLY if:

- Matches defined purpose
- Uses correct data contracts
- Follows design system
- Handles loading + error states
- Fully responsive