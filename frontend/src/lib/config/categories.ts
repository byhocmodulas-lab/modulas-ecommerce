export interface Subcategory {
  slug: string;
  name: string;
  description?: string;
}

export interface CategoryFAQItem {
  question: string;
  answer: string;
}

export interface CategoryConfig {
  slug: string;
  name: string;
  headline: string;
  sub: string;
  hero: string;
  accentColor: string;
  subcategories: Subcategory[];
  faqs: CategoryFAQItem[];
  seoTitle: string;
  seoDescription: string;
  highlightHeadline: string;
  highlightBody: string;
  highlightCta: string;
  highlightHref: string;
}

export const CATEGORIES: CategoryConfig[] = [
  {
    slug: "sofas",
    name: "Seating & Sofas",
    headline: "Seating & Sofas",
    sub: "Cloud-soft comfort over kiln-dried hardwood frames. Upholstered in boucle, linen, leather, and velvet — built to last decades.",
    hero: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=85",
    accentColor: "#B5926B",
    subcategories: [
      { slug: "sectional-sofas",   name: "Sectional Sofas",   description: "L-shaped and modular configurations for generous living rooms" },
      { slug: "2-seater-sofas",    name: "2-Seater Sofas",    description: "Compact elegance — perfect for apartments and reading nooks" },
      { slug: "3-seater-sofas",    name: "3-Seater Sofas",    description: "The family-room anchor — deep seats, broad arms" },
      { slug: "chesterfields",     name: "Chesterfields",     description: "Button-tufted backs and rolled arms — timeless British tailoring" },
      { slug: "modular-seating",   name: "Modular Seating",   description: "Reconfigure as your space evolves — add or remove units freely" },
      { slug: "accent-chairs",     name: "Accent Chairs",     description: "Statement singles: wingbacks, swivel bowls, and sculptural armchairs" },
      { slug: "ottomans-poufs",    name: "Ottomans & Poufs",  description: "Footrests and casual seats that anchor a seating arrangement" },
      { slug: "daybeds-chaises",   name: "Daybeds & Chaises", description: "Horizontal lounging reimagined — for sunlit corners and quiet afternoons" },
    ],
    faqs: [
      {
        question: "What sofa sizes does Modulas offer?",
        answer:
          "We offer 2-seater, 3-seater, sectional, and modular configurations. All sizes are listed per product and can be customised — contact us for non-standard dimensions.",
      },
      {
        question: "Which upholstery fabrics are available?",
        answer:
          "Our sofas are available in Belgian linen, boucle, full-grain leather, velvet, and performance fabric. Sample swatches can be ordered free of charge via our Bespoke page.",
      },
      {
        question: "Can I customise the leg finish on a sofa?",
        answer:
          "Yes. Most frames support solid oak, solid walnut, brushed brass, or matte black legs. Select your preference in the Configurator before adding to cart.",
      },
      {
        question: "What is the delivery lead time for sofas?",
        answer:
          "Standard in-stock pieces ship within 5–7 working days. Made-to-order and bespoke pieces are crafted within 6–10 weeks from order confirmation.",
      },
      {
        question: "Do you offer a sofa trial period?",
        answer:
          "We offer a 30-night comfort trial. If you are not satisfied, we will arrange a full collection and refund — no questions asked.",
      },
    ],
    seoTitle: "Luxury Sofas & Seating — Modulas",
    seoDescription:
      "Shop handcrafted sofas, sectionals, accent chairs, and modular seating. Upholstered in boucle, linen, leather, and velvet. Fully customisable. Crafted in India.",
    highlightHeadline: "Build your perfect sofa",
    highlightBody:
      "Choose your configuration, upholstery, leg finish, and seat depth. Our 3D Configurator lets you see every change in real time before you commit.",
    highlightCta: "Open Configurator",
    highlightHref: "/configurator",
  },

  {
    slug: "bedroom",
    name: "Beds & Bedroom",
    headline: "Beds & Bedroom",
    sub: "Beds, wardrobes, and nightstands that make mornings worth waking up for. Upholstered headboards in muted tones — serene by design.",
    hero: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=85",
    accentColor: "#8A9B8E",
    subcategories: [
      { slug: "bed-frames",          name: "Bed Frames",          description: "Platform, sleigh, and four-poster frames in solid hardwood" },
      { slug: "upholstered-beds",    name: "Upholstered Beds",    description: "Fabric headboards that turn the bed into the room's centrepiece" },
      { slug: "storage-beds",        name: "Storage Beds",        description: "Hydraulic lift or drawer bases — maximise every square inch" },
      { slug: "wardrobes",           name: "Wardrobes",           description: "Hinged and sliding-door wardrobes with bespoke interior fittings" },
      { slug: "nightstands",         name: "Nightstands",         description: "Bedside tables with concealed storage and integrated charging" },
      { slug: "dressers-vanities",   name: "Dressers & Vanities", description: "Vanity units with mirror and ample drawer storage" },
      { slug: "bedroom-benches",     name: "Bedroom Benches",     description: "End-of-bed bench seating — upholstered or solid wood" },
      { slug: "mattresses",          name: "Mattresses",          description: "Pocket-spring and hybrid mattresses curated to pair with our beds" },
    ],
    faqs: [
      {
        question: "What sizes are your beds available in?",
        answer:
          "All beds are available in Single (90×200 cm), Double (135×200 cm), Queen (150×200 cm), and King (180×200 cm). Custom sizes are available — inquire via Bespoke.",
      },
      {
        question: "Can I order a bed with a storage base?",
        answer:
          "Yes. Most bed frame designs can be built with an ottoman hydraulic lift base or standard drawer base. Select the option in the product configurator.",
      },
      {
        question: "What headboard fabrics are offered?",
        answer:
          "Upholstered headboards are available in boucle, velvet, linen, and leather. All fabrics are available in a curated palette of 12 colourways per material.",
      },
      {
        question: "Do your wardrobes come with interior fittings?",
        answer:
          "Yes. Our wardrobes include a standard rail-and-shelf interior. Bespoke interiors with shoe racks, pull-out trays, and integrated LED lighting can be added.",
      },
      {
        question: "How long does bedroom furniture take to deliver?",
        answer:
          "In-stock beds ship in 5–7 working days. Upholstered beds and wardrobes with bespoke interiors have an 8–12 week lead time.",
      },
    ],
    seoTitle: "Luxury Beds & Bedroom Furniture — Modulas",
    seoDescription:
      "Shop handcrafted beds, upholstered headboards, wardrobes, and nightstands. Custom sizes available. Crafted in India with solid hardwood and premium upholstery.",
    highlightHeadline: "Design your bedroom sanctuary",
    highlightBody:
      "Select your bed frame, headboard fabric, base type, and finish. Preview the full room ensemble in 3D — adjust until it's exactly right.",
    highlightCta: "Configure Your Bed",
    highlightHref: "/configurator",
  },

  {
    slug: "dining",
    name: "Dining",
    headline: "Dining",
    sub: "Tables and chairs that turn every meal into an occasion. Marble, solid oak, and brass — surfaces that age into heirlooms.",
    hero: "https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=1600",
    accentColor: "#C4A882",
    subcategories: [
      { slug: "dining-tables",       name: "Dining Tables",       description: "Round, rectangular, and oval tables in marble, oak, and walnut" },
      { slug: "dining-chairs",       name: "Dining Chairs",       description: "Upholstered, bentwood, and rattan seating to complement any table" },
      { slug: "dining-benches",      name: "Dining Benches",      description: "Long upholstered benches — maximise seating without crowding" },
      { slug: "extendable-tables",   name: "Extendable Tables",   description: "Leaf-extension mechanisms hidden in the base — seats 4 to 12" },
      { slug: "bar-stools",          name: "Bar Stools",          description: "Counter and bar-height stools for kitchen islands and breakfast bars" },
      { slug: "sideboards",          name: "Sideboards",          description: "Credenzas and sideboards for display and dining storage" },
      { slug: "bar-cabinets",        name: "Bar Cabinets",        description: "Drinks cabinets with lead-glass fronts and velvet-lined interiors" },
      { slug: "dining-sets",         name: "Dining Sets",         description: "Coordinated table-and-chair sets for a harmonious room" },
    ],
    faqs: [
      {
        question: "What dining table sizes do you offer?",
        answer:
          "We offer dining tables from 120 cm (seats 4) to 360 cm (seats 12). Extendable tables add 40–60 cm per leaf. Custom lengths are available via Bespoke.",
      },
      {
        question: "Which table top materials are available?",
        answer:
          "Table tops are available in Calacatta marble, honed travertine, solid oak, solid walnut, and tempered smoked glass. Each material page includes care instructions.",
      },
      {
        question: "Can I mix-and-match chairs and tables from different ranges?",
        answer:
          "Absolutely. Each chair lists its height and style family so you can confidently combine pieces. We also offer free styling consultations via our Architects programme.",
      },
      {
        question: "Are marble table tops heat and stain resistant?",
        answer:
          "Natural marble is porous and can stain if unsealed. Our marble tops come pre-sealed and include a care kit. We recommend resealing annually for longevity.",
      },
      {
        question: "Do you sell dining sets as a bundle?",
        answer:
          "Yes. Our curated dining sets offer a table paired with 4, 6, or 8 chairs at a bundle discount. Custom combinations are also available — contact us for a quote.",
      },
    ],
    seoTitle: "Luxury Dining Tables & Chairs — Modulas",
    seoDescription:
      "Shop marble dining tables, solid oak tables, upholstered dining chairs, sideboards, and bar stools. Custom sizes and finishes. Crafted in India.",
    highlightHeadline: "Set your table, your way",
    highlightBody:
      "Choose your table shape, top material, base finish, and chair upholstery. Our Configurator builds the full dining ensemble so you can see the result before you order.",
    highlightCta: "Configure Your Dining Set",
    highlightHref: "/configurator",
  },

  {
    slug: "study",
    name: "Study & Office",
    headline: "Study & Office",
    sub: "Desks, ergonomic chairs, and shelving systems designed around deep work. Quiet luxury for spaces where ideas take shape.",
    hero: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1600&q=85",
    accentColor: "#6B7A8D",
    subcategories: [
      { slug: "writing-desks",       name: "Writing Desks",       description: "Clean-lined desks in solid oak, walnut, and lacquered MDF" },
      { slug: "executive-desks",     name: "Executive Desks",     description: "Larger double-pedestal desks with integrated cable management" },
      { slug: "standing-desks",      name: "Standing Desks",      description: "Electric height-adjustable frames with solid wood tops" },
      { slug: "office-chairs",       name: "Office Chairs",       description: "Ergonomic task chairs upholstered in leather and mesh" },
      { slug: "bookshelves",         name: "Bookshelves",         description: "Freestanding and wall-mounted shelving in wood and metal" },
      { slug: "filing-cabinets",     name: "Filing & Storage",    description: "Lateral filing cabinets and pedestal drawers" },
      { slug: "study-armchairs",     name: "Study Armchairs",     description: "Reading chairs for libraries and quiet corners" },
      { slug: "desk-accessories",    name: "Desk Accessories",    description: "Leather desk pads, organiser trays, and pen cups" },
    ],
    faqs: [
      {
        question: "What desk depths are available?",
        answer:
          "Our desks range from 50 cm (compact writing desks) to 80 cm depth (executive desks). Custom depths are available — contact us for bespoke sizing.",
      },
      {
        question: "Do your standing desks have memory presets?",
        answer:
          "Yes. Our electric standing desks include a 4-position memory handset. The motor operates quietly and supports loads up to 80 kg.",
      },
      {
        question: "Are office chairs suitable for 8-hour use?",
        answer:
          "Our ergonomic task chairs feature lumbar support, seat-depth adjustment, 4D armrests, and tilt tension — all designed for extended use. Upholstered models add comfort for longer sessions.",
      },
      {
        question: "Can bookshelves be wall-mounted?",
        answer:
          "Yes. Our modular shelving units can be wall-mounted with a concealed French cleat or used freestanding with an anti-tip anchor kit included.",
      },
      {
        question: "What cable management options are available?",
        answer:
          "Most desks include a rear cable tray and optional grommet cutouts. Our executive desks add a centre modesty panel with integrated power strip housing.",
      },
    ],
    seoTitle: "Luxury Home Office & Study Furniture — Modulas",
    seoDescription:
      "Shop writing desks, standing desks, ergonomic office chairs, bookshelves, and study armchairs. Handcrafted in India. Designed for deep work and quiet luxury.",
    highlightHeadline: "Design your ideal workspace",
    highlightBody:
      "Configure your desk dimensions, top material, storage options, and chair upholstery. Build a study that works exactly the way you do.",
    highlightCta: "Configure Your Workspace",
    highlightHref: "/configurator",
  },

  {
    slug: "living",
    name: "Living Room",
    headline: "Living Room",
    sub: "Coffee tables, side tables, consoles, and shelving — the quiet layers that make a living room feel complete.",
    hero: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1600&q=85",
    accentColor: "#A0916F",
    subcategories: [
      { slug: "coffee-tables",       name: "Coffee Tables",       description: "Round, rectangular, and nested tables in marble, oak, and glass" },
      { slug: "side-tables",         name: "Side Tables",         description: "Slim end tables and C-shaped side tables for every sofa" },
      { slug: "console-tables",      name: "Console Tables",      description: "Entryway and living room consoles in solid wood and metal" },
      { slug: "tv-units",            name: "TV Units & Media",    description: "Low-profile media units with integrated cable management" },
      { slug: "display-shelving",    name: "Display Shelving",    description: "Wall-mounted and freestanding shelving for books and art" },
      { slug: "room-dividers",       name: "Room Dividers",       description: "Open shelving units and screens that define zones without walls" },
      { slug: "floor-lamps",         name: "Floor Lamps",         description: "Statement arc and tripod lamps for ambient living room light" },
      { slug: "poufs-footstools",    name: "Poufs & Footstools",  description: "Casual accent seating that doubles as extra storage" },
    ],
    faqs: [
      {
        question: "What coffee table heights work best with a sofa?",
        answer:
          "Coffee tables should sit 2–5 cm below the sofa seat height, typically 40–46 cm. All our product pages list exact heights to make pairing straightforward.",
      },
      {
        question: "Which TV unit sizes do you stock?",
        answer:
          "Our TV units range from 120 cm to 220 cm wide. They are rated for TVs up to 75 inches (170 cm) when wall-mounted above or placed on the unit surface.",
      },
      {
        question: "Can console tables be used as room dividers?",
        answer:
          "Yes. Tall console tables (90 cm+) placed behind a sofa create a natural room boundary. Our open-back shelving units serve the same purpose with added storage.",
      },
      {
        question: "Do you offer nested coffee table sets?",
        answer:
          "Yes. Several of our coffee tables come as a 2- or 3-piece nested set. They can be used stacked when space is tight or spread apart for a layered look.",
      },
      {
        question: "How do I choose between marble and wood for a coffee table?",
        answer:
          "Marble adds visual weight and works well as a focal point; solid wood is warmer and more forgiving of daily use. Both materials age beautifully — choose based on your lifestyle and the room's existing palette.",
      },
    ],
    seoTitle: "Luxury Living Room Furniture — Modulas",
    seoDescription:
      "Shop coffee tables, TV units, console tables, display shelving, and floor lamps. Marble, solid oak, and walnut. Crafted in India. Designed for quiet luxury living.",
    highlightHeadline: "Style your living room",
    highlightBody:
      "Layer a coffee table, side tables, and shelving that all speak the same material language. Our Configurator helps you match finishes across every piece.",
    highlightCta: "Explore Collections",
    highlightHref: "/products",
  },
];

/** Quick lookup by slug */
export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c])
) as Record<string, CategoryConfig>;

/** All category slugs */
export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);
