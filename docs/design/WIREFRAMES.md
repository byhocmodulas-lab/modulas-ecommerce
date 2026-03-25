# Modulas Platform — Visual Wireframes

> All wireframes follow the [UI/UX Framework](./UI_UX_FRAMEWORK.md): 12-column grid, 8px spacing base, 60% whitespace, Cormorant Garamond + Inter typography, gold/charcoal/cream palette.

---

## 1. Homepage

> Full wireframe in UI_UX_FRAMEWORK.md § 1. Summary below.

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  TRANSPARENT NAV (72px) — logo left, links center, icons right  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  HERO — 100dvh full-bleed lifestyle image                       │
│  Bottom-left: serif display-2xl headline (72px)                 │
│  Gold eyebrow "THE COLLECTION" above headline                   │
│  Two CTAs: [Explore Collection] (gold) + [Start Configuring]    │
│  Gradient overlay: transparent → charcoal-950/60%               │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  MARQUEE STRIP — 48px, cream bg, scrolling value props          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CATEGORY TILES — 12-col grid, asymmetric 3-4 columns           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ Modular  │ │  Dining  │ │ Storage  │ │ Bedroom  │           │
│  │ Sofas    │ │          │ │          │ │          │           │
│  │ 3:4      │ │  3:4     │ │  3:4     │ │  3:4     │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
│  Text overlay on image, serif heading, gold "Shop →" link       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  EDITORIAL FEATURE — Full-width 50/50 split                     │
│  ┌──────────────────────┬──────────────────────┐                │
│  │                      │  Eyebrow: THE         │                │
│  │  Lifestyle image     │  CONFIGURATOR         │                │
│  │  (4:3 ratio)         │                       │                │
│  │                      │  Serif heading         │                │
│  │                      │  Body paragraph        │                │
│  │                      │  [Discover →] CTA      │                │
│  └──────────────────────┴──────────────────────┘                │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FEATURED PRODUCTS — "Bestsellers" section                      │
│  4-col grid of ProductCards (3:4 images)                        │
│  Mobile: horizontal scroll carousel                             │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TRUST PILLARS — 4-col, icon + heading + description            │
│  Handcrafted | Configurable | 10yr Warranty | Free Delivery     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CONFIGURATOR CTA — charcoal-950 bg, full-bleed                 │
│  3D preview left, serif heading + CTA right                     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  JOURNAL PREVIEW — 3-col article cards                          │
│  Image (3:4) + category eyebrow + serif title + excerpt         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  PRESS STRIP — Logo row: Wallpaper*, Dezeen, Elle Decoration    │
├─────────────────────────────────────────────────────────────────┤
│  NEWSLETTER — Centered, serif heading, email input + Subscribe  │
├─────────────────────────────────────────────────────────────────┤
│  FOOTER — 4-col links: Collection / Services / Company / Legal  │
│  Bottom bar: © Modulas 2026 · social icons · region selector    │
└─────────────────────────────────────────────────────────────────┘
```

### Grid Breakdown
- **Hero:** Span all 12 columns, 100dvh
- **Category tiles:** Each 3 cols (4-up) desktop, 6 cols (2-up) tablet, full-width stack mobile
- **Editorial split:** 6 cols image + 6 cols content
- **Product cards:** 3 cols each (4-up), horizontal scroll mobile
- **Trust pillars:** 3 cols each (4-up), 2x2 grid mobile
- **Section spacing:** 96px between major sections

### Responsive
- Mobile: single-column stack, hero text centered, product carousel, trust 2x2
- Tablet: 2-col grids, editorial stacks vertically
- Desktop: full 12-col layout as wireframed

---

## 2. Category Listing Page (PLP)

> Full wireframe in UI_UX_FRAMEWORK.md § 2.

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  SOLID NAV (72px)                                               │
├─────────────────────────────────────────────────────────────────┤
│  Breadcrumb: Home / Collection / Modular Sofas                  │  body-sm
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PAGE HEADER — Full width                                       │
│  Serif display-lg: "Modular Sofas"                              │
│  Subtitle: "Designed to evolve with your space"                 │
│  Optional: 3:1 hero banner                                      │
│                                                                 │
├────────────┬────────────────────────────────────────────────────┤
│            │                                                    │
│  FILTERS   │  SORT BAR: "48 products · Sort by: Featured ▾"    │
│  280px     │                                                    │
│  sticky    │  ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  col 1-3   │  │  Card    │ │  Card    │ │  Card    │           │
│            │  │  3:4 img │ │  3:4 img │ │  3:4 img │           │
│  ☐ Category│  │  Name    │ │  Name    │ │  Name    │           │
│  ☐ Material│  │  £2,450  │ │  £1,890  │ │  £3,200  │           │
│  ☐ Colour  │  └──────────┘ └──────────┘ └──────────┘           │
│  ☐ Price   │                                                    │
│  ☐ Config  │  ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│            │  │  Card    │ │  Card    │ │  Card    │           │
│  [Clear]   │  └──────────┘ └──────────┘ └──────────┘           │
│            │                                                    │
│            │  ═══ EDITORIAL BREAK (full-width lifestyle) ═══    │
│            │                                                    │
│            │  ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│            │  │  Card    │ │  Card    │ │  Card    │           │
│            │  └──────────┘ └──────────┘ └──────────┘           │
│            │                                                    │
├────────────┴────────────────────────────────────────────────────┤
│  PAGINATION: ← 1 2 3 … 8 →  (centered, body-md)               │
└─────────────────────────────────────────────────────────────────┘
```

### Grid Breakdown
- **Filters:** Cols 1–3 (280px), sticky top 96px
- **Product grid:** Cols 4–12, 3-column card grid with 24px gap
- **Editorial break:** Spans cols 4–12, every 2 rows
- **Card images:** 3:4 portrait ratio, hover: +3% scale + second image

### Responsive
- Mobile: filters as bottom sheet drawer, 2-col product grid, no editorial breaks
- Tablet: collapsible filter sidebar, 2-col grid
- Desktop: persistent sidebar, 3-col grid

---

## 3. Product Detail Page (PDP)

> Full wireframe in UI_UX_FRAMEWORK.md § 3.

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  SOLID NAV (72px)                                               │
├─────────────────────────────────────────────────────────────────┤
│  Breadcrumb: Home / Sofas / Camden Modular Sofa                 │
├──────────────────────────────┬──────────────────────────────────┤
│                              │                                  │
│  IMAGE GALLERY (60%)         │  PRODUCT INFO (40%)              │
│  cols 1–7                    │  cols 8–12, sticky               │
│                              │                                  │
│  ┌────────────────────────┐  │  Eyebrow: NATURAL OAK            │
│  │                        │  │  Serif heading-lg: Camden         │
│  │  MAIN IMAGE (4:5)      │  │  Modular Sofa                    │
│  │  Click-to-zoom          │  │  ★★★★★ 4.8 (127 reviews)        │
│  │                        │  │                                  │
│  └────────────────────────┘  │  Price: £2,450                    │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐  │  or from £204/mo with Klarna     │
│  │  │ │  │ │  │ │  │ │  │  │                                  │
│  └──┘ └──┘ └──┘ └──┘ └──┘  │  ── Finish ──────────────────     │
│  Thumbnails (1:1, 64px)     │  ○ Natural Oak  ○ Smoked Oak      │
│                              │  ○ Ebony  ○ White Ash             │
│  ┌────────────────────────┐  │                                  │
│  │  ROOM SCENE IMAGE      │  │  ── Configuration ──────────     │
│  └────────────────────────┘  │  [Start Configuring →]           │
│  ┌────────────────────────┐  │  3-seat / L-shape / U-shape      │
│  │  DETAIL CLOSE-UP       │  │                                  │
│  └────────────────────────┘  │  ── Dimensions ──────────────    │
│  ┌────────────────────────┐  │  W: 240cm  D: 95cm  H: 82cm     │
│  │  AR / 3D VIEWER        │  │                                  │
│  │  [View in Your Room]   │  │  ┌────────────────────────────┐  │
│  └────────────────────────┘  │  │  ADD TO BAG — £2,450       │  │
│                              │  └────────────────────────────┘  │
│                              │  [♡ Save]  [Share]               │
│                              │                                  │
│                              │  ✓ Free delivery                 │
│                              │  ✓ 10-year warranty              │
│                              │  ✓ Made to order · 4-6wk         │
│                              │  ✓ Free swatches                 │
│                              │                                  │
├──────────────────────────────┴──────────────────────────────────┤
│                                                                 │
│  STORY SECTION — Full-bleed image + narrative text              │
│  "The Camden Story" — materials, craftsmanship, sustainability  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  SPECIFICATIONS ACCORDION                                       │
│  ▸ Materials & Construction                                     │
│  ▸ Dimensions & Weight                                          │
│  ▸ Care Instructions                                            │
│  ▸ Delivery & Returns                                           │
├─────────────────────────────────────────────────────────────────┤
│  REVIEWS — Star distribution bar + written reviews              │
│  Filter by: Most Recent | Highest | With Photos                 │
├─────────────────────────────────────────────────────────────────┤
│  COMPLETE THE ROOM — 4-col related product cards                │
│  "Pair with the Camden Coffee Table and Arden Bookcase"         │
├─────────────────────────────────────────────────────────────────┤
│  RECENTLY VIEWED — Horizontal scroll, 5 product thumbnails      │
└─────────────────────────────────────────────────────────────────┘
```

### Grid Breakdown
- **Image gallery:** Cols 1–7 (58%), vertical stack of images
- **Product info:** Cols 8–12 (42%), sticky at top 96px
- **Full-width sections below:** All span 12 cols, max-w-4xl centered for text

### Responsive
- Mobile: full-width image carousel (swipe), product info below, sticky bottom CTA bar
- Tablet: 55/45 split or stacked
- Desktop: 60/40 split as wireframed

---

## 4. Cart & Checkout

### 4A. Cart Page

```
┌─────────────────────────────────────────────────────────────────┐
│  SOLID NAV (72px) — minimal: logo + close/continue shopping     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Serif display-lg: "Your Bag" (3 items)                         │
│                                                                 │
├──────────────────────────────────────────┬──────────────────────┤
│                                          │                      │
│  CART ITEMS (cols 1–8)                   │  ORDER SUMMARY       │
│                                          │  (cols 9–12)         │
│  ┌─────────────────────────────────────┐ │  sticky              │
│  │ ┌────────┐                          │ │                      │
│  │ │        │  Camden Modular Sofa     │ │  Subtotal    £6,640  │
│  │ │  img   │  Natural Oak · 3-seat    │ │  Delivery      Free  │
│  │ │  1:1   │  £2,450                  │ │  ──────────────────  │
│  │ │ 120px  │  Qty: [ - ] 1 [ + ]     │ │  Total       £6,640  │
│  │ │        │  Est. delivery: 4-6 wk   │ │  or £553/mo          │
│  │ └────────┘  [♡ Save] · [Remove]     │ │                      │
│  ├─────────────────────────────────────┤ │  ┌──────────────────┐│
│  │  ─── subtle divider ───             │ │  │ CHECKOUT — £6,640││
│  ├─────────────────────────────────────┤ │  └──────────────────┘│
│  │ ┌────────┐                          │ │                      │
│  │ │        │  Arden Bookcase          │ │  Promo code           │
│  │ │  img   │  Smoked Oak              │ │  [          ] Apply   │
│  │ │        │  £1,890                  │ │                      │
│  │ └────────┘  Qty: [ - ] 1 [ + ]     │ │  ✓ Free delivery     │
│  ├─────────────────────────────────────┤ │  ✓ 14-day returns    │
│  │ ┌────────┐                          │ │  ✓ Secure payment    │
│  │ │        │  Camden Coffee Table     │ │                      │
│  │ │  img   │  Natural Oak             │ │  ── PAYMENT ICONS── │
│  │ │        │  £2,300                  │ │  Visa MC Amex Klarna │
│  │ └────────┘  Qty: [ - ] 1 [ + ]     │ │                      │
│  └─────────────────────────────────────┘ │                      │
│                                          │                      │
├──────────────────────────────────────────┴──────────────────────┤
│                                                                 │
│  YOU MIGHT ALSO LIKE — 4-col product cards, horizontal scroll   │
│  Based on cart contents: "Complete the Camden collection"        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4B. Checkout Page (Multi-Step)

```
┌─────────────────────────────────────────────────────────────────┐
│  MINIMAL NAV — Logo centered, [← Back to bag] left             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PROGRESS STEPS (centered, max-w-lg)                            │
│  ●━━━━━━━━○━━━━━━━━○━━━━━━━━○                                  │
│  Contact    Delivery   Payment   Review                         │
│                                                                 │
├────────────────────────────────────────┬────────────────────────┤
│                                        │                        │
│  FORM AREA (cols 1–7, max-w-xl)        │  ORDER SUMMARY         │
│                                        │  (cols 8–12)           │
│  ┌──────────────────────────────────┐  │  sticky, collapsible   │
│  │                                  │  │                        │
│  │  STEP 1: CONTACT                 │  │  ┌───────┐ Camden     │
│  │                                  │  │  │ thumb │ Sofa ×1    │
│  │  Email *                         │  │  └───────┘ £2,450     │
│  │  [                            ]  │  │  ┌───────┐ Arden      │
│  │                                  │  │  │ thumb │ Bookcase   │
│  │  ☐ Create account for order      │  │  └───────┘ £1,890     │
│  │    tracking                      │  │  ┌───────┐ Coffee     │
│  │                                  │  │  │ thumb │ Table ×1   │
│  │  ── or continue with ──          │  │  └───────┘ £2,300     │
│  │  [G Google]  [  Apple  ]         │  │                        │
│  │                                  │  │  ─────────────────    │
│  └──────────────────────────────────┘  │  Subtotal    £6,640   │
│                                        │  Delivery      Free   │
│  ┌──────────────────────────────────┐  │  ─────────────────    │
│  │                                  │  │  Total       £6,640   │
│  │  STEP 2: DELIVERY                │  │                        │
│  │                                  │  │                        │
│  │  First name *    Last name *     │  │                        │
│  │  [            ]  [            ]  │  │                        │
│  │                                  │  │                        │
│  │  Address line 1 *                │  │                        │
│  │  [                            ]  │  │                        │
│  │  Address line 2                  │  │                        │
│  │  [                            ]  │  │                        │
│  │  City *          Postcode *      │  │                        │
│  │  [            ]  [            ]  │  │                        │
│  │  Country *                       │  │                        │
│  │  [United Kingdom           ▾]   │  │                        │
│  │  Phone *                         │  │                        │
│  │  [                            ]  │  │                        │
│  │                                  │  │                        │
│  │  ☐ Save for future orders        │  │                        │
│  │                                  │  │                        │
│  │  Delivery method:                │  │                        │
│  │  ◉ White Glove (Free · 4-6 wk)  │  │                        │
│  │  ○ Standard (Free · 6-8 wk)     │  │                        │
│  │                                  │  │                        │
│  └──────────────────────────────────┘  │                        │
│                                        │                        │
│  ┌──────────────────────────────────┐  │                        │
│  │                                  │  │                        │
│  │  STEP 3: PAYMENT                 │  │                        │
│  │                                  │  │                        │
│  │  ◉ Credit/Debit Card             │  │                        │
│  │  ○ Klarna (from £553/mo)         │  │                        │
│  │  ○ Bank Transfer                 │  │                        │
│  │                                  │  │                        │
│  │  Card number                     │  │                        │
│  │  [                      💳]     │  │                        │
│  │  Expiry        CVC               │  │                        │
│  │  [  MM/YY  ]   [  ···  ]        │  │                        │
│  │  Name on card                    │  │                        │
│  │  [                            ]  │  │                        │
│  │                                  │  │                        │
│  │  🔒 Secured by Stripe            │  │                        │
│  │                                  │  │                        │
│  └──────────────────────────────────┘  │                        │
│                                        │                        │
│  ┌──────────────────────────────────┐  │                        │
│  │  STEP 4: REVIEW                  │  │                        │
│  │  Order summary + [Place Order]   │  │                        │
│  └──────────────────────────────────┘  │                        │
│                                        │                        │
│  [← Back]               [Continue →]  │                        │
│                                        │                        │
├────────────────────────────────────────┴────────────────────────┤
│  FOOTER — Minimal: © Modulas · Privacy · Terms · Contact        │
└─────────────────────────────────────────────────────────────────┘
```

### Grid Breakdown
- **Cart:** Items cols 1–8, summary cols 9–12 (sticky)
- **Checkout:** Form cols 1–7 (max-w-xl), summary cols 8–12 (sticky, collapsible on mobile)
- **Progress bar:** Centered, max-w-lg, 4 steps with connecting line

### Responsive
- **Mobile cart:** Full-width items stack, summary collapses to sticky bottom bar showing total + checkout CTA
- **Mobile checkout:** Single-column, order summary in collapsible accordion at top, sticky [Continue] button at bottom
- **Form inputs:** Full-width on mobile, side-by-side pairs (first/last, city/postcode) on desktop

### UX Patterns
- Cart item images: 1:1 ratio, 120px on desktop, 80px on mobile
- Quantity: inline stepper, not dropdown
- Remove: text link, not icon — confirm with undo toast (not modal)
- Promo code: single-line input, revealed on click ("Have a promo code?")
- Empty cart: serif heading "Your bag is empty" + [Continue Shopping] CTA + recently viewed

---

## 5. Architect Portal

```
┌─────────────────────────────────────────────────────────────────┐
│  PORTAL NAV (72px) — charcoal-950 bg                            │
│  Logo · Dashboard · Projects · Clients · Library · Settings     │
│                                               🔔 notifications  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  WELCOME BAR — cols 1–12                                    ││
│  │  "Good morning, Sarah" (serif heading-lg)                   ││
│  │  "You have 3 active projects and 2 pending client approvals"││
│  │                              [+ New Project]  [Browse Catalog]│
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐       │
│  │ STAT CARD │ │ STAT CARD │ │ STAT CARD │ │ STAT CARD │       │
│  │           │ │           │ │           │ │           │       │
│  │  Active   │ │  Pending  │ │  Revenue  │ │ Commission│       │
│  │ Projects  │ │ Approvals │ │  This Mo  │ │  Earned   │       │
│  │    12     │ │     2     │ │  £34,200  │ │  £2,736   │       │
│  │  +3 MTD   │ │           │ │  +18%     │ │  +22%     │       │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘       │
│  cols: 3 each                                                   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────┬──────────────────────────┐│
│  │                                  │                          ││
│  │  ACTIVE PROJECTS (cols 1–8)      │  RECENT ACTIVITY         ││
│  │                                  │  (cols 9–12)             ││
│  │  ┌────────────────────────────┐  │                          ││
│  │  │ PROJECT CARD               │  │  ○ Client approved       ││
│  │  │ ┌────────┐                 │  │    Wilton Residence      ││
│  │  │ │ room   │ Wilton Residence│  │    2 hours ago           ││
│  │  │ │ render │ Living + Dining │  │                          ││
│  │  │ │ 16:9   │ Budget: £45,000 │  │  ○ New message from      ││
│  │  │ │        │ Status: ● Active│  │    James T.              ││
│  │  │ └────────┘ Updated: 2d ago │  │    "Can we add a..."     ││
│  │  │ ━━━━━━━━━━━━━━━▓▓▓▓░░ 72% │  │    5 hours ago           ││
│  │  │ [Open] [Share with Client] │  │                          ││
│  │  └────────────────────────────┘  │  ○ Order shipped          ││
│  │                                  │    Camden Sofa ×2         ││
│  │  ┌────────────────────────────┐  │    Yesterday              ││
│  │  │ PROJECT CARD               │  │                          ││
│  │  │ Kensington Penthouse       │  │  ○ Commission paid        ││
│  │  │ Full home · Budget: £120k  │  │    £1,200                 ││
│  │  │ Status: ● Awaiting approval│  │    3 days ago             ││
│  │  │ ━━━━━━━━━━▓░░░░░░░░░░ 45% │  │                          ││
│  │  └────────────────────────────┘  │  [View All →]             ││
│  │                                  │                          ││
│  │  [View All Projects →]           │                          ││
│  │                                  │                          ││
│  └──────────────────────────────────┴──────────────────────────┘│
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CURATED FOR YOU — 4-col product cards                          │
│  "Based on your active projects" — personalized product recs    │
│  Horizontal scroll on mobile                                    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TRADE TOOLS — 3-col cards                                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│  │ Material     │ │ Mood Board   │ │ Price List   │             │
│  │ Library      │ │ Creator      │ │ Download     │             │
│  │ Browse 3D    │ │ Drag & drop  │ │ PDF export   │             │
│  │ textures &   │ │ room layouts │ │ for clients  │             │
│  │ swatches     │ │              │ │              │             │
│  │ [Open →]     │ │ [Create →]   │ │ [Download]   │             │
│  └──────────────┘ └──────────────┘ └──────────────┘             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Grid Breakdown
- **Stat cards:** 4×3-col on desktop, 2×2 on tablet, horizontal scroll on mobile
- **Projects + Activity:** 8-col + 4-col split
- **Project cards:** Horizontal layout (image left, details right) within the 8-col area
- **Trade tools:** 3×4-col cards

### Responsive
- Mobile: stat cards as horizontal scroll, projects stack vertically, activity moves below projects
- Tablet: 2-col stat cards, projects full-width
- Desktop: full layout as wireframed

### UX Patterns
- Portal nav uses charcoal-950 bg to differentiate from storefront
- Project progress bars use gold fill on charcoal-100 track
- Client sharing opens a link-based preview (no login required for clients)
- Commission earnings use green accent for positive change

---

## 6. Creator Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  PORTAL NAV (72px) — charcoal-950 bg                            │
│  Logo · Dashboard · Links · Content · Earnings · Settings       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  CREATOR HEADER — cols 1–12                                 ││
│  │  ┌────────┐  "Welcome back, Alex"                           ││
│  │  │ avatar │  Creator since Jan 2025 · Tier: Gold            ││
│  │  │  80px  │  Unique link: modulas.com/c/alexdesigns          ││
│  │  └────────┘  [Copy Link]  [Share]  [QR Code]                ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐       │
│  │           │ │           │ │           │ │           │       │
│  │  Clicks   │ │  Orders   │ │ Conversion│ │ Earnings  │       │
│  │  This Mo  │ │  This Mo  │ │   Rate    │ │  This Mo  │       │
│  │   2,341   │ │    47     │ │   2.01%   │ │  £1,880   │       │
│  │  +12%     │ │  +8%      │ │  -0.3%    │ │  +15%     │       │
│  │  ▁▂▃▅▆▇  │ │  ▁▃▂▅▇▆  │ │  ▅▆▃▂▅▇  │ │  ▁▂▅▃▆▇  │       │
│  │  sparkline│ │  sparkline│ │  sparkline│ │  sparkline│       │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────┬──────────────────────────┐│
│  │                                  │                          ││
│  │  EARNINGS CHART (cols 1–8)       │  TOP PRODUCTS            ││
│  │                                  │  (cols 9–12)             ││
│  │  [7d] [30d] [90d] [12mo]        │                          ││
│  │                                  │  1. Camden Sofa          ││
│  │  £                               │     18 orders · £720     ││
│  │  2k ┤      ╭──╮                 │                          ││
│  │     ┤   ╭──╯  │                 │  2. Arden Bookcase       ││
│  │  1k ┤╭──╯     ╰──╮             │     12 orders · £480     ││
│  │     ┤│           ╰──           │                          ││
│  │   0 ┤╯                         │  3. Willow Dining Set     ││
│  │     └─┬──┬──┬──┬──┬──┬──      │     8 orders · £320      ││
│  │     Mon Tue Wed Thu Fri Sat     │                          ││
│  │                                  │  4. Oslo Side Table      ││
│  │  Earnings ━━  Clicks ─ ─        │     6 orders · £180      ││
│  │                                  │                          ││
│  └──────────────────────────────────┴──────────────────────────┘│
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  AFFILIATE LINKS — Full width table                             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  [+ Create Link]                [Search links...]           ││
│  │                                                             ││
│  │  Link Name        URL              Clicks  Orders  Earned   ││
│  │  ─────────────────────────────────────────────────────────  ││
│  │  Spring Campaign  /c/alex?s=spr    892     19     £760     ││
│  │  Instagram Bio    /c/alex?s=ig     634     12     £480     ││
│  │  YouTube Review   /c/alex?s=yt     445      9     £360     ││
│  │  Blog Post        /c/alex?s=blog   370      7     £280     ││
│  │                                                             ││
│  │  ← 1 2 3 →                                                  ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PAYOUT HISTORY                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Date         Amount    Method     Status                   ││
│  │  01 Mar 2026  £1,640    Bank       ● Paid                   ││
│  │  01 Feb 2026  £1,420    Bank       ● Paid                   ││
│  │  01 Jan 2026  £980      Bank       ● Paid                   ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Grid Breakdown
- **Stat cards:** 4×3-col, each with inline sparkline chart
- **Earnings chart + Top products:** 8-col + 4-col split
- **Tables:** Full 12-col width, horizontally scrollable on mobile

### Responsive
- Mobile: stat cards 2×2, chart full-width, top products below chart, table switches to card view
- Tablet: 2-col stats, chart full-width
- Desktop: full layout as wireframed

### UX Patterns
- Sparkline charts in stat cards for trend visibility at a glance
- Copy-to-clipboard on affiliate links with toast confirmation
- QR code generation for offline sharing (modal)
- Payout status: green ● Paid, gold ● Pending, charcoal ● Processing

---

## 7. Admin Dashboard

```
┌────────────────────────────────────────────────────────────────────┐
│  ADMIN NAV (72px) — charcoal-950 bg, gold accent                   │
│  Logo · Dashboard · Catalog · Orders · Users · Content · Settings  │
├─────┬──────────────────────────────────────────────────────────────┤
│     │                                                              │
│ S   │  DASHBOARD HEADER                                            │
│ I   │  Serif display-sm: "Dashboard"                               │
│ D   │  "Tuesday, 13 March 2026"                                    │
│ E   │                                                              │
│ B   │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│ A   │  │  Revenue │ │  Orders  │ │  Users   │ │  Conv.   │        │
│ R   │  │  Today   │ │  Today   │ │  Active  │ │  Rate    │        │
│     │  │  £8,240  │ │    12    │ │   342    │ │  3.2%    │        │
│ 60px│  │  +14%    │ │  +3      │ │  +28     │ │  +0.4%   │        │
│     │  └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
│ w   │                                                              │
│ i   │  ┌──────────────────────────────┬────────────────────────┐   │
│ d   │  │                              │                        │   │
│ t   │  │  REVENUE CHART (cols 2–8)    │  QUICK ACTIONS         │   │
│ h   │  │                              │  (cols 9–12)           │   │
│     │  │  Revenue (30 days)           │                        │   │
│ D   │  │  ┌────────────────────────┐  │  [+ Add Product]       │   │
│ r   │  │  │ ▁▂▃▅▆▇▅▆▇█▇▅▆▇█▇    │  │  [📦 Process Orders]   │   │
│ a   │  │  │ Area chart, gold fill  │  │  [👤 Manage Users]     │   │
│ w   │  │  │ with cream overlay     │  │  [📝 New Article]      │   │
│ e   │  │  └────────────────────────┘  │  [📊 Export Report]    │   │
│ r   │  │                              │                        │   │
│     │  └──────────────────────────────┴────────────────────────┘   │
│ │   │                                                              │
│ ▾   │  ┌──────────────────────────────────────────────────────┐   │
│ D   │  │  RECENT ORDERS                                       │   │
│ a   │  │                                                      │   │
│ s   │  │  Order       Customer       Items  Total    Status   │   │
│ h   │  │  #MOD-4521   Sarah Chen     3      £6,640   ● New    │   │
│ b   │  │  #MOD-4520   James T.       1      £2,450   ● Prod.  │   │
│ o   │  │  #MOD-4519   Emily R.       2      £4,190   ● Ship.  │   │
│ a   │  │  #MOD-4518   Michael K.     1      £1,890   ● Deliv. │   │
│ r   │  │  #MOD-4517   Anna L.        4      £8,900   ● Deliv. │   │
│ d   │  │                                                      │   │
│     │  │  [View All Orders →]                                  │   │
│ C   │  └──────────────────────────────────────────────────────┘   │
│ a   │                                                              │
│ t   │  ┌─────────────────────────┬────────────────────────────┐   │
│ a   │  │                         │                            │   │
│ l   │  │  LOW STOCK ALERTS       │  PENDING APPROVALS         │   │
│ o   │  │  (cols 2–7)             │  (cols 8–12)               │   │
│ g   │  │                         │                            │   │
│     │  │  ⚠ Camden Sofa — 3 left│  Vendor: Oak & Stone Co    │   │
│ O   │  │  ⚠ Oslo Table — 2 left │  "Request to list 12 new   │   │
│ r   │  │  ⚠ Willow Chair — 5    │   products"                │   │
│ d   │  │                         │  [Approve] [Review]        │   │
│ e   │  │                         │                            │   │
│ r   │  │                         │  Creator: Alex D.          │   │
│ s   │  │                         │  "Affiliate application"   │   │
│     │  │                         │  [Approve] [Reject]        │   │
│ U   │  │                         │                            │   │
│ s   │  └─────────────────────────┴────────────────────────────┘   │
│ e   │                                                              │
│ r   │                                                              │
│ s   │                                                              │
│     │                                                              │
│ ⚙   │                                                              │
│     │                                                              │
├─────┴──────────────────────────────────────────────────────────────┤
│  ADMIN FOOTER — Version · Last sync: 2 min ago · System status ●  │
└────────────────────────────────────────────────────────────────────┘
```

### Grid Breakdown
- **Sidebar:** Fixed 60px collapsed (icons only), expands to 240px on hover/click
- **Content area:** Cols 2–12 (with sidebar collapsed)
- **Stat cards:** 4×~2.5-col each
- **Revenue + Quick actions:** ~7-col + ~3-col
- **Orders table:** Full content width
- **Low stock + Approvals:** 6-col + 5-col split

### Responsive
- Mobile: sidebar becomes bottom tab bar (5 icons), full-width stacked content, tables become card lists
- Tablet: sidebar collapsed (icons), 2-col stat cards
- Desktop: expandable sidebar, full layout as wireframed

### UX Patterns
- Sidebar uses icon + label, highlights active section with gold left border
- Stat cards: value is display-sm serif, percentage change uses green/red text
- Order status badges: ● New (blue), ● Production (gold), ● Shipped (charcoal), ● Delivered (green)
- Revenue chart: area chart with gold-500 fill, cream-100 gradient underneath
- Tables have hover row highlight (cream-50 bg)

---

## 8. Workshop Portal

```
┌─────────────────────────────────────────────────────────────────┐
│  STORE NAV (72px) — standard storefront navigation              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  HERO BANNER — full-width, 50vh                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  Background: workshop/studio lifestyle image                ││
│  │  Gradient overlay bottom                                    ││
│  │                                                             ││
│  │  Eyebrow: THE MODULAS WORKSHOP                              ││
│  │  Serif display-xl: "Learn the Art of Furniture Design"      ││
│  │  Subtitle: "Hands-on courses from master craftspeople"      ││
│  │  [Browse Courses]  [My Learning]                            ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FILTER CHIPS (horizontally scrollable)                         │
│  [All] [Woodworking] [Upholstery] [Design] [Finishing]         │
│  [Business] [Online] [In-Person] [Free]                        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FEATURED COURSE — full-width card                              │
│  ┌──────────────────────────┬──────────────────────────────────┐│
│  │                          │                                  ││
│  │  Course thumbnail        │  FEATURED                        ││
│  │  16:9 video preview      │  "Mastering Wood Joinery"        ││
│  │  with play button        │  By Thomas Heatherwick           ││
│  │                          │  8 lessons · 4.5 hours · £149    ││
│  │                          │  ★★★★★ (89 reviews)              ││
│  │                          │                                  ││
│  │                          │  "Learn the fundamental joints   ││
│  │                          │   used in luxury furniture..."   ││
│  │                          │                                  ││
│  │                          │  [Enroll Now]  [Preview]         ││
│  └──────────────────────────┴──────────────────────────────────┘│
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  COURSE GRID — 3 columns                                        │
│                                                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│  │ ┌──────────┐ │ │ ┌──────────┐ │ │ ┌──────────┐ │             │
│  │ │ 16:9 img │ │ │ │ 16:9 img │ │ │ │ 16:9 img │ │             │
│  │ │          │ │ │ │          │ │ │ │          │ │             │
│  │ └──────────┘ │ │ └──────────┘ │ │ └──────────┘ │             │
│  │ WOODWORKING  │ │ UPHOLSTERY   │ │ DESIGN       │             │
│  │ "Intro to    │ │ "Fabric      │ │ "Space       │             │
│  │  CNC Routing"│ │  Selection"  │ │  Planning"   │             │
│  │ By James H.  │ │ By Maria L.  │ │ By Sarah K.  │             │
│  │ 6 lessons    │ │ 4 lessons    │ │ 10 lessons   │             │
│  │ £99          │ │ £79          │ │ Free          │             │
│  │ ★★★★☆ (42)  │ │ ★★★★★ (67)  │ │ ★★★★★ (124) │             │
│  │              │ │              │ │              │             │
│  │ [Enroll]     │ │ [Enroll]     │ │ [Start Free] │             │
│  └──────────────┘ └──────────────┘ └──────────────┘             │
│                                                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│  │  ... more    │ │  ... more    │ │  ... more    │             │
│  │  courses     │ │  courses     │ │  courses     │             │
│  └──────────────┘ └──────────────┘ └──────────────┘             │
│                                                                 │
│  [Load More Courses]  (centered CTA)                            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  INSTRUCTOR SPOTLIGHT — 4-col                                    │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│  │ ┌─────┐ │ │ ┌─────┐ │ │ ┌─────┐ │ │ ┌─────┐ │               │
│  │ │photo│ │ │ │photo│ │ │ │photo│ │ │ │photo│ │               │
│  │ │ 1:1 │ │ │ │ 1:1 │ │ │ │ 1:1 │ │ │ │ 1:1 │ │               │
│  │ │round│ │ │ │round│ │ │ │round│ │ │ │round│ │               │
│  │ └─────┘ │ │ └─────┘ │ │ └─────┘ │ │ └─────┘ │               │
│  │ Thomas  │ │ Maria   │ │ James   │ │ Sarah   │               │
│  │ Heather.│ │ Lopez   │ │ Harris  │ │ Kim     │               │
│  │ Master  │ │ Textile │ │ CNC     │ │ Interior│               │
│  │ Joiner  │ │ Artist  │ │ Expert  │ │ Designer│               │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CERTIFICATE BANNER — cream bg, full-width                      │
│  "Earn a Modulas Certificate of Craftsmanship"                  │
│  Body text about certification program                          │
│  [Learn About Certificates]                                     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  FOOTER                                                         │
└─────────────────────────────────────────────────────────────────┘
```

### Grid Breakdown
- **Hero:** 12-col full-bleed, 50vh
- **Featured course:** 5-col image + 7-col content
- **Course grid:** 3×4-col cards, 24px gap
- **Instructors:** 4×3-col centered
- **Certificate banner:** 12-col, max-w-2xl text centered

### Responsive
- Mobile: filter chips horizontal scroll, course cards 1-col, featured course stacks (image top, content below), instructors 2×2
- Tablet: course cards 2-col
- Desktop: 3-col as wireframed

### UX Patterns
- Course cards: 16:9 thumbnail (not 3:4 — distinguishes from product cards)
- Category eyebrow: uppercase, gold, 11px
- Free courses highlighted with green "Free" badge
- Progress bar on enrolled courses (shown in "My Learning" view)
- Video preview: play button overlay on thumbnail hover

---

## 9. Blog / Journal Page

```
┌─────────────────────────────────────────────────────────────────┐
│  STORE NAV (72px) — "Journal" link active (gold underline)      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PAGE HEADER — centered                                         │
│  Serif display-lg: "The Modulas Journal"                        │
│  Subtitle: "Stories of craft, design, and considered living"    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FEATURED ARTICLE — full-width hero card                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  ┌──────────────────────────┬──────────────────────────────┐││
│  │  │                          │                              │││
│  │  │  Hero image              │  CRAFTSMANSHIP               │││
│  │  │  16:9 or 3:2             │                              │││
│  │  │  Full-bleed              │  Serif display-md:            │││
│  │  │                          │  "The Lost Art of             │││
│  │  │                          │   Hand-Cut Dovetails"         │││
│  │  │                          │                              │││
│  │  │                          │  "In our Cotswolds workshop,  │││
│  │  │                          │   master joiner Thomas..."    │││
│  │  │                          │                              │││
│  │  │                          │  By Thomas Heatherwick        │││
│  │  │                          │  12 Mar 2026 · 8 min read    │││
│  │  │                          │                              │││
│  │  │                          │  [Read Article →]             │││
│  │  │                          │                              │││
│  │  └──────────────────────────┴──────────────────────────────┘││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CATEGORY TABS                                                  │
│  [All]  [Craftsmanship]  [Design]  [Living]  [Behind the Scenes]│
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ARTICLE GRID — 3 columns                                       │
│                                                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│  │ ┌──────────┐ │ │ ┌──────────┐ │ │ ┌──────────┐ │             │
│  │ │  3:4 img │ │ │ │  3:4 img │ │ │ │  3:4 img │ │             │
│  │ │          │ │ │ │          │ │ │ │          │ │             │
│  │ └──────────┘ │ │ └──────────┘ │ │ └──────────┘ │             │
│  │ DESIGN       │ │ LIVING       │ │ CRAFT        │             │
│  │              │ │              │ │              │             │
│  │ "Colour      │ │ "Five Ways   │ │ "Meet Our    │             │
│  │  Theory for  │ │  to Style    │ │  Upholstery  │             │
│  │  Modular     │ │  a Modular   │ │  Team"       │             │
│  │  Living"     │ │  Bookcase"   │ │              │             │
│  │              │ │              │ │              │             │
│  │ 8 Mar · 5min│ │ 5 Mar · 4min│ │ 1 Mar · 6min│             │
│  └──────────────┘ └──────────────┘ └──────────────┘             │
│                                                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│  │  ...         │ │  ...         │ │  ...         │             │
│  └──────────────┘ └──────────────┘ └──────────────┘             │
│                                                                 │
│  ── EDITORIAL INTERSTITIAL (every 2 rows) ──                    │
│  Full-width: product feature or newsletter signup               │
│                                                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│  │  ...         │ │  ...         │ │  ...         │             │
│  └──────────────┘ └──────────────┘ └──────────────┘             │
│                                                                 │
│  [Load More Articles]  (centered)                               │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  NEWSLETTER SIGNUP — cream bg section                           │
│  Serif heading: "Stay Inspired"                                 │
│  "Design tips, new arrivals, and stories from the workshop"     │
│  [email input] [Subscribe]                                      │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  FOOTER                                                         │
└─────────────────────────────────────────────────────────────────┘
```

### Grid Breakdown
- **Featured article:** 6-col image + 6-col content (50/50 split)
- **Article grid:** 3×4-col cards, 24px column gap, 32px row gap
- **Editorial interstitial:** Full 12-col span, every 2 rows
- **Newsletter:** 12-col, max-w-md input centered

### Responsive
- Mobile: featured article stacks (image top), article grid 1-col, category tabs horizontal scroll
- Tablet: article grid 2-col
- Desktop: 3-col as wireframed

### UX Patterns
- Article cards: 3:4 image (matching product cards for visual consistency)
- Category as gold eyebrow text above article title
- Read time shown as "X min read" — no word count
- No author avatar on cards (clean), author shown on article detail page
- Editorial interstitials alternate: product feature / newsletter / collection promo
- schema.org Article structured data for SEO

---

## 10. Collaboration Portal

```
┌─────────────────────────────────────────────────────────────────┐
│  PORTAL NAV (72px) — charcoal-950 bg                            │
│  Logo · Rooms · Projects · Messages · Files · Settings          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PAGE HEADER                                                    │
│  Serif display-sm: "Collaboration Rooms"                        │
│  "Real-time design collaboration with your team"                │
│  [+ Create Room]                                                │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ACTIVE ROOMS — 3-col cards                                     │
│                                                                 │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ │
│  │                  │ │                  │ │                  │ │
│  │  ROOM CARD       │ │  ROOM CARD       │ │  ROOM CARD       │ │
│  │                  │ │                  │ │                  │ │
│  │  ┌──────────────┐│ │  ┌──────────────┐│ │  ┌──────────────┐│ │
│  │  │ Preview      ││ │  │ Preview      ││ │  │ Preview      ││ │
│  │  │ thumbnail    ││ │  │ thumbnail    ││ │  │ thumbnail    ││ │
│  │  │ 16:9         ││ │  │ 16:9         ││ │  │ 16:9         ││ │
│  │  │ (room render)││ │  │ (mood board) ││ │  │ (floor plan) ││ │
│  │  └──────────────┘│ │  └──────────────┘│ │  └──────────────┘│ │
│  │                  │ │                  │ │                  │ │
│  │  Wilton Living   │ │  Kensington      │ │  Mayfair Office  │ │
│  │  Room            │ │  Master Bedroom  │ │  Reception       │ │
│  │                  │ │                  │ │                  │ │
│  │  ┌──┐┌──┐┌──┐+2 │ │  ┌──┐┌──┐      │ │  ┌──┐┌──┐┌──┐┌──┐│ │
│  │  │av││av││av│    │ │  │av││av│      │ │  │av││av││av││av││ │
│  │  └──┘└──┘└──┘    │ │  └──┘└──┘      │ │  └──┘└──┘└──┘└──┘│ │
│  │  Member avatars  │ │               │ │                  │ │
│  │                  │ │                  │ │                  │ │
│  │  ● 2 online now  │ │  Last active 1h  │ │  ● 1 online now  │ │
│  │  Updated 15m ago │ │  Updated 3d ago  │ │  Updated 2h ago  │ │
│  │                  │ │                  │ │                  │ │
│  │  [Enter Room]    │ │  [Enter Room]    │ │  [Enter Room]    │ │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘ │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ROOM INTERIOR (expanded when "Enter Room" clicked)             │
│                                                                 │
│  ┌──────────────────────────────────────────┬──────────────────┐│
│  │                                          │                  ││
│  │  CANVAS AREA (cols 1–9)                  │  SIDEBAR         ││
│  │                                          │  (cols 10–12)    ││
│  │  ┌──────────────────────────────────┐    │                  ││
│  │  │                                  │    │  ── MEMBERS ──   ││
│  │  │                                  │    │  ● Sarah (you)   ││
│  │  │  SHARED DESIGN CANVAS            │    │  ● James T.      ││
│  │  │                                  │    │  ○ Emily R.      ││
│  │  │  Room layout / mood board /      │    │  [+ Invite]      ││
│  │  │  3D configurator view            │    │                  ││
│  │  │                                  │    │  ── PRODUCT ──   ││
│  │  │  Multiple cursors visible        │    │  LIST             ││
│  │  │  (real-time collaboration)       │    │                  ││
│  │  │                                  │    │  Camden Sofa     ││
│  │  │  ┌─────────────┐                 │    │   £2,450 ×1     ││
│  │  │  │ product     │  ← drag from   │    │  Arden Book.     ││
│  │  │  │ placed in   │    sidebar      │    │   £1,890 ×1     ││
│  │  │  │ room        │                 │    │  Oslo Table      ││
│  │  │  └─────────────┘                 │    │   £980 ×2       ││
│  │  │                                  │    │                  ││
│  │  └──────────────────────────────────┘    │  ─────────────  ││
│  │                                          │  Total: £8,200   ││
│  │  TOOLBAR:                                │  [Add to Bag]    ││
│  │  [Select] [Pan] [Add Product] [Annotate] │                  ││
│  │  [Measure] [Screenshot] [Share]          │  ── CHAT ──     ││
│  │                                          │  Inline thread   ││
│  │                                          │  with members    ││
│  │                                          │                  ││
│  │                                          │  Sarah: "What    ││
│  │                                          │  about the oak   ││
│  │                                          │  finish?"        ││
│  │                                          │                  ││
│  │                                          │  James: "Let's   ││
│  │                                          │  try smoked"     ││
│  │                                          │                  ││
│  │                                          │  [Type message]  ││
│  │                                          │                  ││
│  └──────────────────────────────────────────┴──────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Grid Breakdown
- **Room cards listing:** 3×4-col, 24px gap
- **Room interior canvas:** Cols 1–9 (75%)
- **Room interior sidebar:** Cols 10–12 (25%), with members, product list, and chat

### Responsive
- Mobile: room cards 1-col, room interior is full-screen with sidebar as bottom drawer (swipe up)
- Tablet: room cards 2-col, room interior canvas full-width with sidebar as right drawer (toggle)
- Desktop: full layout as wireframed

### UX Patterns
- Room cards show member avatars (stacked circles, 28px, max 4 + overflow count)
- Online status: green ● dot next to avatar
- Canvas supports: drag-and-drop products from sidebar, multi-cursor collaboration, annotations
- Product list in sidebar acts as room's "mini cart" — can convert to real cart
- Chat is threaded, inline in sidebar — not a separate page
- Invite flow: email input or shareable link with role selection (Editor/Viewer)
- Room preview thumbnail auto-generates from canvas state

---

## Cross-Page Design Consistency

### Shared Elements Across All Pages

| Element | Specification |
|---|---|
| **Nav height** | 72px (all pages) |
| **Max content width** | 1440px centered |
| **Horizontal padding** | 24px mobile, 48px desktop |
| **Section spacing** | 96px between major sections |
| **Font: headings** | Cormorant Garamond, 300–400 weight |
| **Font: body** | Inter, 400–500 weight |
| **Primary CTA** | charcoal-900 bg, cream text, rounded-full, h-12 |
| **Focus ring** | gold border, 2px ring, gold/20% |
| **Card radius** | rounded-2xl (product), rounded-xl (editorial/admin) |
| **Image lazy loading** | Below-the-fold only |
| **Transitions** | 200–400ms, ease-out for entrances |

### Portal vs Storefront Differentiation

| Aspect | Storefront (Home, PLP, PDP, Cart, Blog, Workshop) | Portal (Architect, Creator, Admin, Collab) |
|---|---|---|
| **Nav bg** | White/transparent | Charcoal-950 |
| **Layout** | Full-width editorial | Sidebar + content area |
| **Typography** | Editorial serif headings | Functional sans headings |
| **Whitespace** | 60% (luxury feel) | 45–50% (information density) |
| **Cards** | Lifestyle imagery, 3:4 ratio | Data-focused, stat numbers |
| **CTAs** | Gold accent allowed | Charcoal primary only |

---

*Wireframes version 1.0 — March 2026*
*Based on: [UI/UX Framework](./UI_UX_FRAMEWORK.md)*
*Target: Modulas luxury modular furniture ecosystem*