# Modulas UI/UX Design Framework

> Derived from analysis of CB2, Anthropologie, Castlery, Poggenpohl, and LEICHT.
> Position: **Accessible ultra-luxury** — the sophistication of Poggenpohl/LEICHT with the shoppability of CB2/Castlery and the editorial warmth of Anthropologie.

---

## Design Philosophy

### The Five Pillars

| Pillar | Inspiration Source | Principle |
|---|---|---|
| **Architectural restraint** | Poggenpohl, LEICHT | Let the product be the protagonist. UI is the gallery wall, not the painting. |
| **Warm minimalism** | Castlery | Minimalism without coldness. Earth tones, natural textures, generous whitespace. |
| **Editorial storytelling** | Anthropologie | Products are presented in context — rooms, lifestyles, narratives — not just grids. |
| **Confident commerce** | CB2 | Unlike ultra-luxury "by appointment" brands, Modulas embraces direct purchase with clear pricing and CTAs. |
| **Tactile materiality** | All five | The screen should evoke the feel of wood grain, linen, leather. Photography and type do the heavy lifting. |

### The Luxury Hierarchy

```
Ultra-luxury (Poggenpohl/LEICHT)     → No prices, consultation-only, 80% whitespace
    ↓
Modulas target zone                  → Prices shown, direct purchase, 60% whitespace
    ↓
Premium mass (CB2/Castlery)          → Full commerce, 40-50% whitespace
    ↓
Mass market (IKEA/Wayfair)           → Dense grids, promotions, urgency tactics
```

**Key rule:** Never use urgency language ("Only 3 left!", "Sale ends tonight!"). Luxury is patient.

---

## 1. Homepage Structure

### Section Order (Top to Bottom)

```
┌─────────────────────────────────────────────────┐
│  TRANSPARENT NAV (becomes solid on scroll)       │  72px / 4.5rem
├─────────────────────────────────────────────────┤
│                                                  │
│  HERO — Full-bleed lifestyle image               │  100dvh
│  Serif headline + gold eyebrow + 2 CTAs          │
│  Gradient overlay from bottom                    │
│                                                  │
├─────────────────────────────────────────────────┤
│  MARQUEE STRIP — Scrolling value props           │  48px
│  "Handcrafted in Britain · Free Design..."       │
├─────────────────────────────────────────────────┤
│                                                  │
│  CATEGORY TILES — 3-4 col asymmetric grid        │  ~600px
│  "Modular Sofas" "Dining" "Storage" "Bedroom"    │
│  Full-bleed lifestyle images, text overlay        │
│                                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│  EDITORIAL FEATURE — Full-width split             │  ~500px
│  Left: lifestyle image | Right: copy + CTA       │
│  "The Configurator" or seasonal collection        │
│                                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│  FEATURED PRODUCTS — 4-col product cards          │  ~500px
│  Horizontal scroll on mobile                     │
│  "Bestsellers" or "New Arrivals"                 │
│                                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│  TRUST PILLARS — 4-col icon + text               │  ~200px
│  "Handcrafted" "Configurable" "10yr Warranty"    │
│                                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│  CONFIGURATOR CTA — Full-bleed dark section       │  ~450px
│  3D preview image + "Design Your Own" CTA        │
│                                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│  JOURNAL PREVIEW — 3-col article cards            │  ~400px
│  Latest blog/editorial content                   │
│                                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│  PRESS STRIP — Logo row + pull quote              │  ~200px
│  "Wallpaper*" "Dezeen" "Elle Decoration"         │
│                                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│  NEWSLETTER — Centered, minimal                   │  ~250px
│  Single email input + "Subscribe" CTA            │
│                                                  │
├─────────────────────────────────────────────────┤
│  FOOTER — 4-col links + bottom bar               │  ~350px
└─────────────────────────────────────────────────┘
```

### Key Patterns (from research)
- **Poggenpohl:** Three-pillar storytelling (Inspire / Experience / Plan) — Modulas adapts this as Browse / Configure / Collaborate
- **LEICHT:** Narrative-driven flow, not transactional — homepage reads like a magazine, not a catalog
- **CB2:** Strong category entry points with lifestyle photography
- **Castlery:** Region-first localization, warm serif branding
- **Anthropologie:** Editorial content mixed with commerce — journal articles sit alongside product features

---

## 2. Product Listing Page (PLP) Layout

### Desktop Layout (1440px)

```
┌──────────────────────────────────────────────────────────┐
│  Breadcrumb: Home / Collection / Sofas                   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  PAGE HEADER                                             │
│  Serif H1: "Modular Sofas"                               │
│  Subtitle: "Designed to evolve with your space"          │
│  [Optional: hero banner image, full-width, 3:1 ratio]   │
│                                                          │
├────────────┬─────────────────────────────────────────────┤
│            │                                             │
│  FILTERS   │  SORT BAR                                   │
│  280px     │  "48 products · Sort by: Featured ▾"        │
│  sticky    │                                             │
│            │  ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  Category  │  │         │ │         │ │         │       │
│  Material  │  │  CARD   │ │  CARD   │ │  CARD   │       │
│  Colour    │  │  3:4    │ │  3:4    │ │  3:4    │       │
│  Price     │  │         │ │         │ │         │       │
│  Config    │  ├─────────┤ ├─────────┤ ├─────────┤       │
│            │  │ name    │ │ name    │ │ name    │       │
│            │  │ material│ │ material│ │ material│       │
│            │  │ £2,450  │ │ £1,890  │ │ £3,200  │       │
│            │  └─────────┘ └─────────┘ └─────────┘       │
│            │                                             │
│            │  ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│            │  │         │ │         │ │         │       │
│            │  │  CARD   │ │  CARD   │ │  CARD   │       │
│            │  │         │ │         │ │         │       │
│            │  └─────────┘ └─────────┘ └─────────┘       │
│            │                                             │
│            │  ═══ EDITORIAL BREAK (every 2 rows) ═══     │
│            │  Full-width lifestyle image + quote          │
│            │                                             │
│            │  ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│            │  │  CARD   │ │  CARD   │ │  CARD   │       │
│            │  └─────────┘ └─────────┘ └─────────┘       │
│            │                                             │
├────────────┴─────────────────────────────────────────────┤
│  PAGINATION: ← 1 2 3 ... 8 →                            │
└──────────────────────────────────────────────────────────┘
```

### Product Card Anatomy

```
┌────────────────────────┐
│                        │
│    [Product Image]     │  Aspect ratio: 3:4 (portrait)
│    3:4 ratio           │  Hover: second image (room scene)
│                        │  Hover: +3% scale, 700ms ease
│    ┌──────┐   ┌────┐  │
│    │ New  │   │ AR │  │  Top-left: badges (gold bg)
│    └──────┘   └────┘  │  Top-right: AR cube icon
│                        │
│  ┌──────────────────┐  │
│  │  Quick Add       │  │  Bottom: slide-up overlay on hover
│  └──────────────────┘  │  Charcoal bg, cream text
│                        │
├────────────────────────┤
│  NATURAL OAK           │  Category/material: 10px, tracking 0.25em, uppercase, gold
│  Camden Modular Sofa   │  Name: serif, 18px, charcoal
│  ○ ○ ○ ○               │  Finish dots: 12px circles, border on selected
│  ★★★★★ (24)           │  Rating: gold stars, 11px count
│  £2,450                │  Price: sans, 16px, medium weight
│  Made to order · 4-6w  │  Lead time: 10px, muted
└────────────────────────┘
```

### Grid Specifications

| Breakpoint | Columns | Gap | Card Image Ratio |
|---|---|---|---|
| Mobile (< 640px) | 2 | 12px | 3:4 |
| Tablet (640–1024px) | 2–3 | 16px | 3:4 |
| Desktop (1024–1440px) | 3 | 24px | 3:4 |
| Wide (1440px+) | 3–4 | 32px | 3:4 |

### Key Patterns
- **Castlery:** Square (1:1) product images, zero border-radius cards, SanomatSans + Aime fonts, terracotta accent (#844025)
- **CB2:** 3–4 column grid, products categorized by shipping speed, strong filter sidebar
- **Anthropologie:** MasonryJS for varied card heights, editorial content mixed into grid (Goudy Old Style headings)
- **Modulas adaptation:** 3:4 portrait cards (furniture looks best vertical), editorial breaks every 2 rows, sticky 280px filter sidebar

---

## 3. Product Detail Page (PDP) Layout

### Desktop Layout (2-Column Split)

```
┌──────────────────────────────────────────────────────────────┐
│  Breadcrumb: Home / Sofas / Camden Modular Sofa              │
├──────────────────────────────────┬───────────────────────────┤
│                                  │                           │
│  IMAGE GALLERY (60%)             │  PRODUCT INFO (40%)       │
│                                  │  sticky, scrolls with     │
│  ┌────────────────────────────┐  │  content                  │
│  │                            │  │                           │
│  │   MAIN IMAGE               │  │  NATURAL OAK              │
│  │   Aspect: 4:5              │  │  Camden Modular Sofa      │
│  │   Click to zoom            │  │  ★★★★★ 4.8 (127 reviews) │
│  │   Swipe on mobile          │  │                           │
│  │                            │  │  £2,450                   │
│  └────────────────────────────┘  │  or from £204/mo with     │
│                                  │  Klarna                   │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐     │                           │
│  │01│ │02│ │03│ │04│ │05│     │  ─── Finish ────           │
│  └──┘ └──┘ └──┘ └──┘ └──┘     │  ○ Natural Oak             │
│  Thumbnails (bottom scroll)     │  ○ Smoked Oak              │
│                                  │  ○ Ebony                  │
│  ┌────────────────────────────┐  │  ○ White Ash              │
│  │                            │  │                           │
│  │   ROOM SCENE IMAGE         │  │  ─── Configuration ────   │
│  │   (lifestyle context)      │  │  [Start Configuring →]   │
│  │                            │  │  3-seat / L-shape / U     │
│  └────────────────────────────┘  │                           │
│                                  │  ─── Dimensions ────      │
│  ┌────────────────────────────┐  │  W: 240cm D: 95cm H: 82cm│
│  │                            │  │  [View dimension drawing] │
│  │   DETAIL CLOSE-UP          │  │                           │
│  │   (fabric/grain texture)   │  │  ┌─────────────────────┐ │
│  │                            │  │  │  ADD TO BAG — £2,450 │ │
│  └────────────────────────────┘  │  └─────────────────────┘ │
│                                  │  [♡ Save] [Share]        │
│  ┌────────────────────────────┐  │                           │
│  │   AR / 3D VIEWER           │  │  ✓ Free delivery         │
│  │   [View in Your Room]      │  │  ✓ 10-year warranty      │
│  │                            │  │  ✓ Made to order · 4-6wk │
│  └────────────────────────────┘  │  ✓ Free swatches         │
│                                  │                           │
├──────────────────────────────────┴───────────────────────────┤
│                                                              │
│  ═══ FULL-WIDTH SECTIONS BELOW ═══                           │
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │  STORY SECTION                                           ││
│  │  Full-bleed image + "The Camden Story" narrative          ││
│  │  Materials, craftsmanship, sustainability                 ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │  SPECIFICATIONS ACCORDION                                 ││
│  │  ▸ Materials & Construction                               ││
│  │  ▸ Dimensions & Weight                                    ││
│  │  ▸ Care Instructions                                      ││
│  │  ▸ Delivery & Returns                                     ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │  REVIEWS — Stars summary + written reviews                ││
│  │  Filter by: Most Recent | Highest | Photos               ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │  COMPLETE THE ROOM — 4-col related products               ││
│  │  Contextual cross-sell based on room type                 ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │  RECENTLY VIEWED — horizontal scroll                      ││
│  └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

### Image Gallery Requirements
- **Minimum 6 images per product:** 1 hero (cut-out), 2 room scenes, 1 detail/texture close-up, 1 dimension diagram, 1 AR/3D view
- **Main image:** 4:5 aspect ratio (portrait, like Castlery)
- **Thumbnails:** Horizontal strip below main image, 1:1 ratio, 64px
- **Zoom:** Click-to-zoom lightbox on desktop, pinch-to-zoom on mobile
- **360/3D:** Dedicated viewer panel for configurable products, inline with gallery

### Mobile PDP
- Full-width image carousel (swipe, dot indicators)
- Sticky bottom bar: "Add to Bag — £2,450" button
- Collapsible accordion for specs, reviews, delivery
- Image gallery becomes horizontal swipe carousel

---

## 4. Mega Navigation Design

### Structure

```
┌──────────────────────────────────────────────────────────────────────────┐
│  MODULAS                Collection  Configure  Architects  Workshops     │
│  Luxury Furniture       Journal     About                                │
│                                                           🔍 👤 ♡ 🛒   │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  MEGA MENU (on hover/click of "Collection")                              │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                                                                     │ │
│  │  SHOP BY ROOM        SHOP BY TYPE        MATERIALS       FEATURED  │ │
│  │                                                                     │ │
│  │  Living Room         Modular Sofas       Natural Oak     [IMAGE]   │ │
│  │  Dining Room         Dining Tables       Smoked Oak      New:      │ │
│  │  Bedroom             Dining Chairs       Walnut          Camden    │ │
│  │  Home Office         Beds & Frames       Marble          Collection│ │
│  │  Entryway            Storage Units       Brass           [Shop →]  │ │
│  │  Outdoor             Coffee Tables       Bouclé Fabric             │ │
│  │                      Side Tables         Velvet                    │ │
│  │  ─── Inspiration     Bookcases           Leather                   │ │
│  │  Room Gallery        Lighting                                      │ │
│  │  Designer Picks      Textiles            View All →                │ │
│  │  What's New          Accessories                                   │ │
│  │                      View All →                                    │ │
│  │                                                                     │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
```

### Nav Specifications

| Element | Style |
|---|---|
| **Nav height** | 72px (4.5rem) |
| **Logo** | `MODULAS` — serif, 24px, tracking 0.35em, uppercase |
| **Logo subtitle** | `Luxury Furniture` — sans, 10px, tracking 0.25em, gold/80% opacity |
| **Nav links** | Sans, 13px, tracking 0.12em, uppercase, charcoal/70% |
| **Active link** | Gold color + 1px gold underline |
| **Hover** | Color transitions 200ms, underline grows from left |
| **Mega panel** | 480px max height, white bg, 40px padding, luxury shadow |
| **Category headers** | Sans, 11px, tracking 0.2em, uppercase, gold, font-weight 600 |
| **Category links** | Sans, 14px, charcoal, weight 400, hover: gold |
| **Featured image** | 280px wide, 3:4 ratio, rounded-lg |
| **Transition** | Panel slides down 300ms ease, opacity fade-in |

### Behaviour
- **Desktop:** Hover to open mega menu, 200ms delay before close
- **Mobile:** Full-screen drawer from right, accordion sub-menus
- **Scroll:** Transparent → solid white/blur backdrop after 20px scroll
- **Shrink:** Nav shrinks from 72px to 60px on scroll (optional)

### Architecture vs. Mass-Market Nav
- **Poggenpohl pattern:** Products named by design concept (+MODO, +SEGMENTO), not by type
- **LEICHT pattern:** Navigation by philosophy (Aesthetics, Planning Principle)
- **Modulas adaptation:** Hybrid — type-based for commerce ("Sofas", "Tables") but design-concept naming for collections ("The Camden", "The Arden")

---

## 5. Luxury Typography System

### Font Pairing

```
HEADING:  Cormorant Garamond (serif)
          Elegant, high-contrast thick/thin strokes
          Weights: 300 (light), 400 (regular), 500 (medium)

BODY:     Inter (sans-serif)
          Clean, highly legible, geometric
          Weights: 300 (light), 400 (regular), 500 (medium), 600 (semibold)

MONO:     JetBrains Mono (for SKUs, order IDs, technical specs)
```

### Type Scale

| Token | Size | Line Height | Letter Spacing | Weight | Use Case |
|---|---|---|---|---|---|
| `display-2xl` | 72px / 4.5rem | 1.05 | -0.03em | 300 light | Homepage hero |
| `display-xl` | 60px / 3.75rem | 1.1 | -0.02em | 300 light | Section heroes |
| `display-lg` | 48px / 3rem | 1.15 | -0.01em | 400 regular | Page titles |
| `display-md` | 36px / 2.25rem | 1.2 | -0.01em | 400 regular | Card titles (featured) |
| `display-sm` | 30px / 1.875rem | 1.25 | 0 | 400 regular | Subsection titles |
| `heading-lg` | 24px / 1.5rem | 1.3 | 0 | 400 regular | Product name (PDP) |
| `heading-md` | 20px / 1.25rem | 1.35 | 0 | 500 medium | Card titles |
| `heading-sm` | 18px / 1.125rem | 1.4 | 0 | 500 medium | Widget headers |
| `body-lg` | 16px / 1rem | 1.6 | 0 | 400 regular | Long-form content |
| `body-md` | 14px / 0.875rem | 1.5 | 0 | 400 regular | Default body text |
| `body-sm` | 13px / 0.8125rem | 1.5 | 0 | 400 regular | Secondary text |
| `caption` | 12px / 0.75rem | 1.4 | 0 | 400 regular | Timestamps, meta |
| `eyebrow` | 11px / 0.6875rem | 1.3 | 0.25em | 500 medium | Category labels, uppercase |
| `overline` | 10px / 0.625rem | 1.3 | 0.3em | 500 medium | Tags, micro-labels |
| `price` | 16px / 1rem | 1.4 | 0.02em | 500 medium | Price display |

### Typography Rules

1. **Headings are always serif** (Cormorant Garamond), weight 300–400. Never bold serif.
2. **Body is always sans** (Inter), weight 400. Use 500 for emphasis, never 700+ (too aggressive for luxury).
3. **Uppercase only for eyebrows/overlines** — max 11px, always with 0.2em+ letter-spacing.
4. **Price is sans-serif**, medium weight, slightly larger than surrounding body text. Never bold, never red.
5. **Compare-at prices** use line-through, same size, 35% opacity. No red "SALE" badges.
6. **Line height increases as text gets smaller** — display (1.1) → body (1.5–1.6) → caption (1.4).
7. **Max line length:** 65ch for body text, 20ch for headings.

### Responsive Scaling

| Token | Mobile (< 640px) | Desktop (1024px+) |
|---|---|---|
| `display-2xl` | 36px | 72px |
| `display-xl` | 30px | 60px |
| `display-lg` | 28px | 48px |
| `body-lg` | 15px | 16px |
| `body-md` | 14px | 14px |

---

## 6. Spacing and Grid System

### Grid

| Property | Value |
|---|---|
| **Max content width** | 1440px (90rem) |
| **Horizontal padding** | 24px mobile, 48px desktop (6px → 12px in Tailwind: `px-6 lg:px-12`) |
| **Column grid** | 12-column on desktop, 4-column mobile |
| **Column gap** | 24px (1.5rem) desktop, 16px mobile |
| **Row gap** | 24px product grids, 32px editorial grids |

### Section Spacing

| Between | Gap |
|---|---|
| Major homepage sections | 96px (6rem) — `--section-gap` |
| Section header → content | 48px (3rem) |
| Content groups | 32px (2rem) |
| Card internal padding | 16–24px |
| Related elements (label → input) | 6–8px |

### Vertical Rhythm

Base unit: **8px**. All spacing is a multiple:

```
4px   → micro (icon-text gap)
8px   → tight (label to input, icon gaps)
12px  → compact (list items, badge spacing)
16px  → default (card padding mobile, between form fields)
24px  → comfortable (card padding desktop, column gaps)
32px  → spacious (between content blocks)
48px  → generous (section header to content)
64px  → airy (between feature sections)
96px  → dramatic (between major homepage sections)
```

### The 60% Whitespace Rule

From Poggenpohl/LEICHT analysis: on any given viewport, **~60% should be whitespace** (background, padding, margins). This is what separates premium from mass-market:

```
Mass market:   30-40% whitespace, content-dense
Premium:       50% whitespace (Castlery, CB2)
Modulas:       55-60% whitespace
Ultra-luxury:  70-80% whitespace (Poggenpohl, LEICHT)
```

---

## 7. Image Layout Guidelines

### Photography Style

| Type | Purpose | Aspect Ratio | Treatment |
|---|---|---|---|
| **Hero lifestyle** | Homepage hero, collection headers | 16:9 or full-bleed | Warm natural light, styled room, humans optional, gradient overlay allowed |
| **Room scene** | PDP gallery, editorial | 4:3 or 3:2 | Product in context, natural daylight, muted/warm color grade |
| **Product cut-out** | PDP main, product cards, admin | 3:4 (portrait) | White or light cream background, soft shadow, studio lighting |
| **Detail close-up** | PDP gallery, material showcase | 1:1 (square) | Macro lens, grain/texture visible, shallow depth of field |
| **Dimension diagram** | PDP gallery | 4:3 | Clean line drawing, charcoal on white, measurements in cm |
| **AR/3D preview** | PDP, configurator | 4:5 | Rendered, matched to room lighting |
| **Editorial** | Blog, journal | 2:3 or 3:4 | Magazine-quality, storytelling, may include people |
| **Category tile** | Homepage, nav | 3:4 or 1:1 | Atmospheric, single-product focus, text overlay ready |

### Image Rules

1. **Never use pure white (#fff) backgrounds** — always warm cream (#f9f5ed) or light linen.
2. **Color temperature: warm.** Daylight or warm tungsten. Never cool/blue fluorescent.
3. **Human presence: subtle.** Hands placing an object, a person sitting (not facing camera). Never stock-photo poses.
4. **Hover image swap:** Product cards show cut-out as default, room scene on hover. Transition: 400ms crossfade.
5. **Minimum resolution:** 2400px on longest edge (for retina/zoom).
6. **Lazy loading:** All images below the fold. Hero + first product row = eager.
7. **Alt text:** Always descriptive. "Modulas Camden sofa in natural oak finish, styled in a Scandinavian living room" — not "product image 1".

### Image Composition Grid

Homepage lifestyle images follow a **rule-of-thirds with product in the left or right third**, leaving breathing room:

```
┌─────────┬─────────┬─────────┐
│         │         │         │
│         │ PRODUCT │         │   Product anchored in center-left
│         │ HERE    │  (air)  │   or center-right third
│         │         │         │
│         │         │         │
└─────────┴─────────┴─────────┘
```

---

## 8. Color Palette

### Primary Palette

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  GOLD (Brand Accent)                                │
│                                                     │
│  50:  #fdf9f0  ░░░░░░  Tinted backgrounds          │
│  100: #f8efd9  ░░░░░░  Hover states                 │
│  200: #f0ddb3  ████░░  Light accent                  │
│  300: #e5c67d  ████░░  Gradient endpoint             │
│  400: #d9aa52  ██████  Highlight, star ratings        │
│  500: #c9903a  ██████  CTA hover                     │
│  DEFAULT: #c9a96e ████  PRIMARY BRAND GOLD            │
│  600: #b87d30  ██████  Dark gold                     │
│  700: #9a6328  ██████  Text on light bg              │
│  800: #7d4f22  ██████  Deep accent                   │
│  900: #68411e  ██████  Darkest gold                  │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  CHARCOAL (Neutral Foundation)                      │
│                                                     │
│  50:  #f5f5f5  ░░░░░░  Alternate background          │
│  100: #e0e0e0  ░░░░░░  Borders, dividers             │
│  200: #bdbdbd  ████░░  Disabled text                 │
│  300: #9e9e9e  ████░░  Placeholder text              │
│  400: #757575  ██████  Muted icons                   │
│  500: #616161  ██████  Secondary text                │
│  600: #424242  ██████  Body text (secondary)         │
│  700: #303030  ██████  Body text (primary on dark)   │
│  800: #222222  ██████  Card backgrounds (dark)       │
│  900: #1a1a1a  ██████  PRIMARY TEXT COLOR             │
│  950: #111111  ██████  Nav background (dark mode)    │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  CREAM (Warm Surfaces)                              │
│                                                     │
│  50:  #fdfcf9  ░░░░░░  Page background (lightest)   │
│  100: #f9f5ed  ░░░░░░  SECONDARY SURFACE             │
│  200: #f3ebda  ████░░  Card backgrounds              │
│  DEFAULT: #f5f0e8 ████  PRIMARY WARM SURFACE          │
│  300: #e8d9bf  ████░░  Hover states on cream         │
│  400: #d9c4a0  ██████  Borders on cream              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Semantic Tokens

```css
:root {
  /* Surfaces */
  --surface-primary:    #ffffff;        /* Default page bg */
  --surface-secondary:  #f9f5ed;        /* Cream sections, card bg */
  --surface-tertiary:   #f0ebdf;        /* Deeper cream, hover state */
  --surface-inverse:    #1a1a1a;        /* Dark sections (hero, CTA) */
  --surface-elevated:   #ffffff;        /* Cards, modals (with shadow) */

  /* Text */
  --text-primary:       #1a1a1a;        /* Headings, body */
  --text-secondary:     #4a4a4a;        /* Descriptions, secondary copy */
  --text-muted:         #8a8a8a;        /* Timestamps, meta, captions */
  --text-inverse:       #f5f0e8;        /* Text on dark backgrounds */
  --text-accent:        #c9a96e;        /* Gold links, eyebrows */

  /* Borders */
  --border-subtle:      rgba(26,26,26, 0.08);   /* Card borders, dividers */
  --border-default:     rgba(26,26,26, 0.15);   /* Input borders */
  --border-strong:      rgba(26,26,26, 0.25);   /* Hover borders */
  --border-accent:      #c9a96e;                 /* Focus rings, selected states */

  /* Feedback */
  --feedback-success:   #16a34a;        /* Order confirmed, in stock */
  --feedback-warning:   #d97706;        /* Low stock, pending */
  --feedback-error:     #dc2626;        /* Form errors only */
  --feedback-info:      #2563eb;        /* Informational */
}
```

### Color Usage Rules

1. **Gold is used sparingly** — only for: brand accent, eyebrow labels, active states, CTAs, focus rings, star ratings. Never as a large background.
2. **Charcoal 900 (#1a1a1a) is the primary text color**, not pure black (#000). Pure black is too harsh.
3. **Cream (#f5f0e8) alternates with white (#fff)** for section backgrounds, creating subtle warmth without monotony.
4. **Red is only for form validation errors.** Never for "Sale" badges or urgency. Discounts use charcoal text with line-through.
5. **Dark mode** inverts surfaces (charcoal) but keeps gold and cream accent tones.
6. **Button primary** is charcoal-900 (#1a1a1a) bg with cream text — not gold. Gold is for hover/accent, not primary CTA.

### Comparison with Researched Brands

| Brand | Primary | Accent | Background | Mood |
|---|---|---|---|---|
| **Poggenpohl** | Near-black (#201d1d) | None (monochrome) | White | Austere, architectural |
| **LEICHT** | Warm grey (#878683) | Dark navy (#22333b) | White | Restrained, sophisticated |
| **Castlery** | Deep burgundy (#3C101E) | Terracotta (#844025) | Off-white (#fbf9f4) | Warm, natural |
| **CB2** | Black | Minimal accent | White/grey | Bold, modern |
| **Anthropologie** | Charcoal | Muted multi-color | Warm white | Eclectic, editorial |
| **Modulas** | Charcoal (#1a1a1a) | Gold (#c9a96e) | Cream (#f5f0e8) | Warm luxury, artisanal |

---

## 9. Component Patterns

### Buttons

```
PRIMARY:      bg-charcoal-900, text-cream, rounded-full, h-12, px-8
              Hover: bg-charcoal-800
              Font: sans, 12px, tracking 0.15em, uppercase

SECONDARY:    border-charcoal/20, text-charcoal, rounded-full, h-12, px-8
              Hover: border-gold, text-gold

GHOST:        transparent, text-charcoal/70
              Hover: text-charcoal, bg-black/5

GOLD ACCENT:  bg-gold, text-charcoal-950, rounded-full, h-12, px-8
              Hover: bg-gold-400, shadow-gold
              Use ONLY for hero CTA, never in forms/dialogs

DISABLED:     opacity-50, cursor-not-allowed
```

### Cards

```
PRODUCT CARD:     bg-white, rounded-2xl, no border, shadow on hover (luxury-lg)
EDITORIAL CARD:   bg-cream, rounded-xl, border-subtle
STAT CARD:        bg-white, rounded-xl, border-charcoal-200
FEATURE CARD:     bg-transparent, no border, text only
```

### Form Inputs

```
DEFAULT:      border-charcoal/15, rounded-lg, h-11, px-3.5
              Focus: border-gold, ring-2 ring-gold/20
              Font: body-md (14px)
              Placeholder: charcoal-300

LABEL:        body-sm (13px), font-medium, charcoal-700, mb-1.5

ERROR:        border-red-300, text-red-700, bg-red-50 message below
```

### Badges

```
GOLD:         bg-gold, text-charcoal-950, rounded-full, px-2.5, py-0.5
              Font: overline (9px), tracking 0.15em, uppercase

CHARCOAL:     bg-charcoal-950, text-cream (same dimensions)

CREAM:        bg-cream, text-charcoal, border-black/10

STATUS:       success: bg-emerald-100/text-emerald-700
              warning: bg-amber-100/text-amber-700
              error:   bg-red-100/text-red-700
              info:    bg-blue-100/text-blue-700
```

---

## 10. Interaction & Motion

### Animation Principles

1. **Subtle, never decorative.** Motion serves function (feedback, transition, hierarchy).
2. **Duration: 200–400ms** for UI elements. 500–700ms for page transitions.
3. **Easing: ease-out** for entrances, **ease-in-out** for transforms.
4. **Respect `prefers-reduced-motion`** — reduce all animations to instant.

### Key Animations

| Interaction | Animation | Duration |
|---|---|---|
| Page section enter (scroll) | Fade up 8px + opacity | 400ms ease-out |
| Product card hover | Image scale to 1.03 | 700ms ease |
| Quick-add slide up | translateY(100%) → 0 | 300ms ease-out |
| Nav solidify on scroll | Background opacity 0 → 95% + blur | 300ms |
| Mega menu open | Slide down + fade in | 250ms ease-out |
| Mobile drawer open | Slide from right | 350ms cubic-bezier |
| Button hover | Background color transition | 200ms |
| Focus ring appear | Outline + offset | instant |
| Image zoom (PDP) | Scale 1 → 2 following cursor | real-time |

### Scroll Behaviour
- **Smooth scrolling** globally (`scroll-behavior: smooth`)
- **Parallax:** Subtle (0.95x speed) on hero background image only. No aggressive parallax.
- **Sticky elements:** Nav (always), PDP product info panel (desktop), mobile add-to-cart bar

---

## 11. Responsive Breakpoints

| Name | Tailwind | Min Width | Columns | Padding |
|---|---|---|---|---|
| Mobile | default | 0px | 4 | 24px |
| Mobile L | `sm` | 640px | 4 | 24px |
| Tablet | `md` | 768px | 8 | 32px |
| Desktop | `lg` | 1024px | 12 | 48px |
| Desktop L | `xl` | 1280px | 12 | 48px |
| Wide | `2xl` | 1536px | 12 | 48px |
| Ultra-wide | `3xl` | 1920px | 12 | auto (centered 1440px) |

### Mobile-First Rules

1. **Touch targets:** Minimum 44x44px (Apple HIG). All interactive elements.
2. **Thumb zone:** Primary CTAs in bottom 40% of screen.
3. **Sticky mobile bar:** "Add to Bag" sticks to bottom on PDP.
4. **Single-column product grid** on mobile < 380px, 2-column otherwise.
5. **Collapsible accordions** for all specification/detail sections on mobile.
6. **Bottom sheet** pattern for filters (not sidebar) on mobile.

---

## Summary: How This Framework Differs from Standard Ecommerce

| Standard Ecommerce | Modulas Framework |
|---|---|
| Dense product grids, maximize SKUs | Generous whitespace, editorial breaks every 2 rows |
| Bold sans-serif everywhere | Serif headings (warmth) + clean sans body (readability) |
| Red sale badges, urgency copy | Restrained pricing, no urgency, line-through only |
| White backgrounds | Alternating white/cream for warmth |
| Transactional navigation | Storytelling: Browse → Configure → Collaborate |
| Product photography only | 50/50 cut-out + lifestyle/room scenes |
| Cart popup + checkout | Considered flow: configure → bag → checkout |
| Generic footer | Magazine-style footer with journal links + brand story |
| Full price transparency | Prices shown (unlike Poggenpohl), but with "or from £X/mo" |
| Stock-photo people | Hands, silhouettes, natural moments — never stock poses |

---

*Framework version 1.0 — March 2026*
*Derived from: CB2, Anthropologie, Castlery, Poggenpohl, LEICHT*
*Target: Modulas luxury modular furniture ecosystem*