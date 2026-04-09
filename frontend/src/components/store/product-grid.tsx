import Link            from "next/link";
import { ProductCard } from "./product-card";
import { fetchWithTimeout } from "@/lib/utils/fetch-with-timeout";
import type { Product, ProductFilters } from "@/lib/types/product";

interface ProductGridProps {
  searchParams: ProductFilters;
}

async function fetchProducts(filters: ProductFilters): Promise<{ products: Product[]; total: number }> {
  const params = new URLSearchParams();
  if (filters.q)        params.set("q",        filters.q);
  if (filters.category) params.set("category", filters.category);
  if (filters.material) params.set("material", filters.material);
  if (filters.min)      params.set("min",      filters.min);
  if (filters.max)      params.set("max",      filters.max);
  if (filters.sort)     params.set("sort",     filters.sort);
  if (filters.page)     params.set("page",     filters.page);

  try {
    const res = await fetchWithTimeout(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"}/products?${params}`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  } catch {
    const filtered = applyFilters(PLACEHOLDER_PRODUCTS, filters);
    return { products: filtered, total: filtered.length };
  }
}

/* ── Client-side filter + sort (used when API is unreachable) ─────── */
function applyFilters(products: Product[], filters: ProductFilters): Product[] {
  let result = [...products];

  // Category
  if (filters.category) {
    result = result.filter((p) => p.category?.slug === filters.category);
  }

  // Material (partial match, case-insensitive)
  if (filters.material) {
    const mat = filters.material.toLowerCase();
    result = result.filter((p) => p.material?.toLowerCase().includes(mat));
  }

  // Full-text search across name, description, material
  if (filters.q) {
    const q = filters.q.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.material?.toLowerCase().includes(q) ||
        p.category?.name.toLowerCase().includes(q),
    );
  }

  // Price range
  if (filters.min) result = result.filter((p) => p.price >= Number(filters.min));
  if (filters.max) result = result.filter((p) => p.price <= Number(filters.max));

  // Configurable toggle (stored as string "true" in query)
  if ((filters as any).configurable === "true") {
    result = result.filter((p) => p.is_configurable);
  }

  // Sort
  switch (filters.sort) {
    case "price-asc":  result.sort((a, b) => a.price - b.price);  break;
    case "price-desc": result.sort((a, b) => b.price - a.price);  break;
    case "popular":    result.sort((a, b) => (b.review_count ?? 0) - (a.review_count ?? 0)); break;
    case "newest":     result.sort((a, b) => (b.id > a.id ? 1 : -1)); break;
    default: break; // relevance — keep insertion order
  }

  return result;
}

export async function ProductGrid({ searchParams }: ProductGridProps) {
  const { products, total } = await fetchProducts(searchParams);
  const page = Number(searchParams.page ?? 1);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="font-serif text-2xl text-charcoal/30 dark:text-cream/30 mb-2">No products found</p>
        <p className="font-sans text-sm text-charcoal/40 dark:text-cream/40">
          Try adjusting your filters or search query.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 mt-8">
      {/* Result count */}
      <p className="font-sans text-[11px] text-charcoal/35 dark:text-cream/35">
        {total.toLocaleString("en-IN")} {total === 1 ? "item" : "items"}
      </p>

      {/* Grid */}
      <ul
        role="list"
        className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 lg:grid-cols-3 xl:grid-cols-4"
      >
        {products.map((product, i) => (
          <li key={product.id}>
            <ProductCard product={product} priority={i < 4} />
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <Pagination current={page} total={total} perPage={24} searchParams={searchParams} />
    </div>
  );
}

/* ── Placeholder catalog (CB2-inspired luxury furniture) ──────────── */
const PLACEHOLDER_PRODUCTS: Product[] = [
  {
    id: "fp-1", sku: "MOD-SOF-001", slug: "luxe-verona-3-seater-sofa",
    name: "Luxe Verona 3-Seater Sofa",
    description: "A cloud-soft modular sofa upholstered in performance boucle over a kiln-dried hardwood frame with hand-tied springs.",
    category: { id: "cat-sofas", name: "Sofas & Seating", slug: "sofas" },
    price: 385000, compare_at_price: 480000, currency: "INR",
    material: "Boucle Fabric", finish_options: ["Oatmeal", "Slate", "Warm Sand"],
    dimensions: { width: 268, height: 80, depth: 102, unit: "cm" },
    is_configurable: true, is_featured: true, tags: ["bestseller"],
    lead_time_days: 28, rating: 4.9, review_count: 124,
    images: [
      { url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=85", is_primary: true, alt_text: "Avec Modular Sofa in Oatmeal Boucle" },
      { url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=700&q=85", is_primary: false, alt_text: "Avec Sofa — living room setting" },
    ],
  },
  {
    id: "fp-2", sku: "MOD-SPD-002", slug: "span-dining-table",
    name: "Span Dining Table",
    description: "Honed Italian marble top on a precision-welded brushed brass base. Seats eight generously.",
    category: { id: "cat-tables", name: "Tables", slug: "tables" },
    price: 420000, currency: "INR",
    material: "Calacatta Marble & Brass", finish_options: ["Calacatta White", "Statuario Grey"],
    dimensions: { width: 240, height: 75, depth: 100, unit: "cm" },
    is_configurable: false, is_featured: true, tags: [],
    lead_time_days: 35, rating: 4.8, review_count: 67,
    images: [
      { url: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=700&q=85", is_primary: true, alt_text: "Span Dining Table — marble with brass base" },
      { url: "https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=700", is_primary: false, alt_text: "Span Table — styled with linen chairs" },
    ],
  },
  {
    id: "fp-3", sku: "MOD-CAT-003", slug: "cate-swivel-chair",
    name: "Cate Swivel Chair",
    description: "A fully upholstered swivel lounge chair on a polished brass disc base. Sink-in comfort with a 360° silhouette.",
    category: { id: "cat-sofas", name: "Sofas & Seating", slug: "sofas" },
    price: 128000, compare_at_price: 158000, currency: "INR",
    material: "Velvet", finish_options: ["Forest Green", "Burnt Sienna", "Ink Blue", "Chalk"],
    dimensions: { width: 78, height: 82, depth: 78, unit: "cm" },
    is_configurable: false, is_featured: true, tags: ["bestseller"],
    lead_time_days: 21, rating: 4.7, review_count: 89,
    images: [
      { url: "https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=700&q=85", is_primary: true, alt_text: "Cate Swivel Chair in Forest Green Velvet" },
      { url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=700&q=85", is_primary: false, alt_text: "Cate Chair — brass base detail" },
    ],
  },
  {
    id: "fp-4", sku: "MOD-ARC-004", slug: "arc-side-table",
    name: "Arc Side Table",
    description: "Roman travertine disc on a hand-turned brass stem. Quietly beautiful and effortlessly versatile.",
    category: { id: "cat-tables", name: "Tables", slug: "tables" },
    price: 79000, compare_at_price: 99000, currency: "INR",
    material: "Travertine & Brass", finish_options: ["Roman Travertine", "Black Marquina"],
    dimensions: { width: 48, height: 58, depth: 48, unit: "cm" },
    is_configurable: false, is_featured: false, tags: ["sale"],
    lead_time_days: 14, rating: 4.6, review_count: 57,
    images: [
      { url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=700&q=85", is_primary: true, alt_text: "Arc Side Table — travertine with brass stem" },
      { url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=700&q=85", is_primary: false, alt_text: "Arc Side Table — room context" },
    ],
  },
  {
    id: "fp-5", sku: "MOD-MLW-005", slug: "mellow-sectional",
    name: "Mellow Sectional",
    description: "A generously scaled L-shape sectional in performance linen. Deep cushions, wide arms, 25-year frame guarantee.",
    category: { id: "cat-sofas", name: "Sofas & Seating", slug: "sofas" },
    price: 640000, currency: "INR",
    material: "Performance Linen", finish_options: ["Natural Flax", "Stone", "Charcoal", "Terracotta"],
    dimensions: { width: 310, height: 82, depth: 160, unit: "cm" },
    is_configurable: true, is_featured: true, tags: ["new"],
    lead_time_days: 42, rating: 4.9, review_count: 41,
    images: [
      { url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=700&q=85", is_primary: true, alt_text: "Mellow Sectional in Natural Flax Linen" },
      { url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=85", is_primary: false, alt_text: "Mellow Sectional — cushion detail" },
    ],
  },
  {
    id: "fp-6", sku: "MOD-NRL-006", slug: "noir-arc-lamp",
    name: "Noir Arc Lamp",
    description: "Sculpted matte-black steel arc with a hand-thrown marble base and linen shade. Dimmable LED, 2700K warmth.",
    category: { id: "cat-lighting", name: "Lighting", slug: "lighting" },
    price: 52000, currency: "INR",
    material: "Steel, Marble & Linen", finish_options: ["Matte Black", "Aged Brass"],
    dimensions: { width: 45, height: 190, depth: 45, unit: "cm" },
    is_configurable: false, is_featured: false, tags: [],
    lead_time_days: 10, rating: 4.7, review_count: 92,
    images: [
      { url: "https://images.unsplash.com/photo-1513506003901-1e6a35eb0e1d?w=700&q=85", is_primary: true, alt_text: "Noir Arc Lamp — matte black with marble base" },
      { url: "https://images.pexels.com/photos/6444348/pexels-photo-6444348.jpeg?auto=compress&cs=tinysrgb&w=700", is_primary: false, alt_text: "Noir Lamp — linen shade lit" },
    ],
  },
  {
    id: "fp-7", sku: "MOD-GRD-007", slug: "grid-shelving-system",
    name: "Grid Shelving System",
    description: "Fully modular wall-mounted shelving in smoked solid oak. Configure shelves, drawers, and cabinet doors in any combination.",
    category: { id: "cat-storage", name: "Storage", slug: "storage" },
    price: 210000, currency: "INR",
    material: "Smoked Solid Oak", finish_options: ["Smoked Oak", "Natural Oak", "Painted Chalk"],
    dimensions: { width: 180, height: 210, depth: 32, unit: "cm" },
    is_configurable: true, is_featured: false, tags: [],
    lead_time_days: 35, rating: 4.8, review_count: 38,
    images: [
      { url: "https://images.unsplash.com/photo-1595347097560-69238724e7ad?w=700&q=85", is_primary: true, alt_text: "Grid Shelving System in Smoked Oak" },
      { url: "https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=700", is_primary: false, alt_text: "Grid Shelving — drawer detail" },
    ],
  },
  {
    id: "fp-8", sku: "MOD-RBN-008", slug: "ribbon-pendant",
    name: "Ribbon Pendant",
    description: "Hand-woven rattan shade with solid brass fittings and a fabric-wrapped cord. Warm ambient light for dining rooms.",
    category: { id: "cat-lighting", name: "Lighting", slug: "lighting" },
    price: 38000, currency: "INR",
    material: "Rattan & Solid Brass", finish_options: ["Natural Rattan", "Bleached White"],
    dimensions: { width: 52, height: 42, depth: 52, unit: "cm" },
    is_configurable: false, is_featured: false, tags: [],
    lead_time_days: 10, rating: 4.5, review_count: 76,
    images: [
      { url: "https://images.pexels.com/photos/6444348/pexels-photo-6444348.jpeg?auto=compress&cs=tinysrgb&w=700", is_primary: true, alt_text: "Ribbon Pendant — natural rattan over dining table" },
      { url: "https://images.unsplash.com/photo-1513506003901-1e6a35eb0e1d?w=700&q=85", is_primary: false, alt_text: "Ribbon Pendant — brass fitting detail" },
    ],
  },
  {
    id: "fp-9", sku: "MOD-FRM-009", slug: "form-leather-sofa",
    name: "Form Leather Sofa",
    description: "Two-seat sofa in full-grain aniline leather. Solid ash frame, pocket-sprung seat, feather-back cushions. Ages beautifully.",
    category: { id: "cat-sofas", name: "Sofas & Seating", slug: "sofas" },
    price: 295000, currency: "INR",
    material: "Full-Grain Leather", finish_options: ["Cognac", "Tan", "Midnight Black"],
    dimensions: { width: 178, height: 78, depth: 90, unit: "cm" },
    is_configurable: false, is_featured: false, tags: [],
    lead_time_days: 35, rating: 4.8, review_count: 39,
    images: [
      { url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=700&q=85", is_primary: true, alt_text: "Form Leather Sofa in Cognac" },
      { url: "https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=700&q=85", is_primary: false, alt_text: "Form Sofa — styled in open-plan living room" },
    ],
  },
  {
    id: "fp-10", sku: "MOD-LNR-010", slug: "linear-credenza",
    name: "Linear Credenza",
    description: "Mid-century inspired solid walnut credenza with push-to-open cane-front doors, interior shelving, and blackened steel hairpin legs.",
    category: { id: "cat-storage", name: "Storage", slug: "storage" },
    price: 198000, currency: "INR",
    material: "Solid Walnut & Steel", finish_options: ["Natural Oil", "Ebonised"],
    dimensions: { width: 165, height: 55, depth: 45, unit: "cm" },
    is_configurable: false, is_featured: false, tags: [],
    lead_time_days: 35, rating: 4.7, review_count: 22,
    images: [
      { url: "https://images.unsplash.com/photo-1595347097560-69238724e7ad?w=700&q=85", is_primary: true, alt_text: "Linear Credenza in Natural Walnut" },
      { url: "https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=700", is_primary: false, alt_text: "Linear Credenza — cane door detail" },
    ],
  },
  {
    id: "fp-11", sku: "MOD-RND-011", slug: "round-coffee-table",
    name: "Round Coffee Table",
    description: "Sculptural round coffee table in honed travertine on a solid oak base with mortise-and-tenon joinery. A room-defining centrepiece.",
    category: { id: "cat-tables", name: "Tables", slug: "tables" },
    price: 168000, compare_at_price: 198000, currency: "INR",
    material: "Travertine & Solid Oak", finish_options: ["Natural Travertine", "Honed Marble"],
    dimensions: { width: 90, height: 38, depth: 90, unit: "cm" },
    is_configurable: false, is_featured: true, tags: ["sale"],
    lead_time_days: 21, rating: 4.9, review_count: 44,
    images: [
      { url: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=700&q=85", is_primary: true, alt_text: "Round Coffee Table in Travertine" },
      { url: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=700", is_primary: false, alt_text: "Round Coffee Table — room view with sofa" },
    ],
  },
  {
    id: "fp-12", sku: "MOD-OTM-012", slug: "boucle-round-ottoman",
    name: "Boucle Round Ottoman",
    description: "Generous round form in chunky boucle on a solid oak plinth. Functions as a footrest, extra seating, or coffee table with a tray.",
    category: { id: "cat-sofas", name: "Sofas & Seating", slug: "sofas" },
    price: 68000, currency: "INR",
    material: "Boucle & Solid Oak", finish_options: ["Cream", "Charcoal", "Sage", "Blush"],
    dimensions: { width: 75, height: 42, depth: 75, unit: "cm" },
    is_configurable: false, is_featured: false, tags: [],
    lead_time_days: 14, rating: 4.5, review_count: 108,
    images: [
      { url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=700&q=85", is_primary: true, alt_text: "Boucle Round Ottoman in Cream" },
      { url: "https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=700&q=85", is_primary: false, alt_text: "Boucle Ottoman — styled with Arc Sofa" },
    ],
  },
  // ── Beds & Bedroom ─────────────────────────────────────────────
  {
    id: "fp-13", sku: "MOD-DWN-013", slug: "dawn-upholstered-bed",
    name: "Dawn Upholstered Bed",
    description: "Fluted boucle headboard on a solid oak frame. Deep-buttoned back panel, platform base with optional hydraulic storage lift.",
    category: { id: "cat-bedroom", name: "Beds & Bedroom", slug: "bedroom" },
    price: 245000, compare_at_price: 295000, currency: "INR",
    material: "Boucle & Solid Oak", finish_options: ["Warm White", "Slate", "Sage", "Caramel"],
    dimensions: { width: 180, height: 130, depth: 210, unit: "cm" },
    is_configurable: true, is_featured: true, tags: ["bestseller"],
    lead_time_days: 35, rating: 4.9, review_count: 86,
    images: [
      { url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&q=85", is_primary: true, alt_text: "Dawn Upholstered Bed in Warm White Boucle" },
      { url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=700&q=85", is_primary: false, alt_text: "Dawn Bed — headboard detail" },
    ],
  },
  {
    id: "fp-14", sku: "MOD-NVL-014", slug: "novel-nightstand",
    name: "Novel Nightstand",
    description: "Solid walnut nightstand with a cane-front drawer and integrated wireless charging pad. Slim profile, generous depth.",
    category: { id: "cat-bedroom", name: "Beds & Bedroom", slug: "bedroom" },
    price: 42000, currency: "INR",
    material: "Solid Walnut & Cane", finish_options: ["Natural Walnut", "Ebonised"],
    dimensions: { width: 50, height: 55, depth: 40, unit: "cm" },
    is_configurable: false, is_featured: false, tags: [],
    lead_time_days: 14, rating: 4.7, review_count: 54,
    images: [
      { url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=700&q=85", is_primary: true, alt_text: "Novel Nightstand in Natural Walnut" },
      { url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&q=85", is_primary: false, alt_text: "Novel Nightstand — room context" },
    ],
  },
  {
    id: "fp-15", sku: "MOD-HAV-015", slug: "haven-wardrobe",
    name: "Haven Wardrobe",
    description: "Two-door hinged wardrobe in solid oak with smoked glass inserts. Interior includes full-height hanging, three shelves, and a shoe rack.",
    category: { id: "cat-bedroom", name: "Beds & Bedroom", slug: "bedroom" },
    price: 385000, currency: "INR",
    material: "Solid Oak & Smoked Glass", finish_options: ["Natural Oak", "Painted White", "Smoked Oak"],
    dimensions: { width: 120, height: 220, depth: 60, unit: "cm" },
    is_configurable: true, is_featured: true, tags: ["new"],
    lead_time_days: 42, rating: 4.8, review_count: 29,
    images: [
      { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=85", is_primary: true, alt_text: "Haven Wardrobe in Natural Oak" },
      { url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&q=85", is_primary: false, alt_text: "Haven Wardrobe — interior detail" },
    ],
  },
  // ── Dining ─────────────────────────────────────────────────────
  {
    id: "fp-16", sku: "MOD-OAK-016", slug: "oak-extendable-dining-table",
    name: "Oak Extendable Dining Table",
    description: "Solid oak dining table with concealed butterfly leaf extension. Seats 6 compact, extends to seat 10. Hand-rubbed oil finish.",
    category: { id: "cat-dining", name: "Dining", slug: "dining" },
    price: 318000, compare_at_price: 378000, currency: "INR",
    material: "Solid Oak", finish_options: ["Natural Oil", "Whitened Oak", "Dark Smoked"],
    dimensions: { width: 180, height: 75, depth: 90, unit: "cm" },
    is_configurable: true, is_featured: true, tags: ["sale"],
    lead_time_days: 28, rating: 4.9, review_count: 73,
    images: [
      { url: "https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=700", is_primary: true, alt_text: "Oak Extendable Dining Table — 8-seater setting" },
      { url: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=700&q=85", is_primary: false, alt_text: "Oak Table — grain and finish detail" },
    ],
  },
  {
    id: "fp-17", sku: "MOD-LNR-017", slug: "linen-dining-chair",
    name: "Linen Dining Chair",
    description: "Fully upholstered dining chair in Belgian linen with a solid ash frame and webbed seat. Stackable. Sold individually or in sets.",
    category: { id: "cat-dining", name: "Dining", slug: "dining" },
    price: 38000, currency: "INR",
    material: "Belgian Linen & Solid Ash", finish_options: ["Natural Linen", "Stone", "Sage Green", "Dusty Pink"],
    dimensions: { width: 50, height: 85, depth: 52, unit: "cm" },
    is_configurable: false, is_featured: false, tags: [],
    lead_time_days: 14, rating: 4.7, review_count: 112,
    images: [
      { url: "https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=700&q=85", is_primary: true, alt_text: "Linen Dining Chair in Natural" },
      { url: "https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=700", is_primary: false, alt_text: "Linen Chair — around oak dining table" },
    ],
  },
  {
    id: "fp-18", sku: "MOD-MRB-018", slug: "marble-dining-table",
    name: "Calacatta Marble Dining Table",
    description: "Honed Calacatta marble top on a hand-welded powder-coated steel base. A statement piece that anchors any dining room.",
    category: { id: "cat-dining", name: "Dining", slug: "dining" },
    price: 520000, currency: "INR",
    material: "Calacatta Marble & Steel", finish_options: ["Calacatta White / Matte Black", "Calacatta White / Brushed Brass"],
    dimensions: { width: 220, height: 75, depth: 100, unit: "cm" },
    is_configurable: false, is_featured: true, tags: ["new"],
    lead_time_days: 42, rating: 4.8, review_count: 31,
    images: [
      { url: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=700&q=85", is_primary: true, alt_text: "Calacatta Marble Dining Table" },
      { url: "https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=700", is_primary: false, alt_text: "Marble Table — dining room setting" },
    ],
  },
  // ── Study & Office ─────────────────────────────────────────────
  {
    id: "fp-19", sku: "MOD-WRT-019", slug: "writer-desk",
    name: "Writer Desk",
    description: "Clean-lined writing desk in solid oak with a single leather-lined drawer. Grommet cutout and rear cable tray included.",
    category: { id: "cat-study", name: "Study & Office", slug: "study" },
    price: 98000, currency: "INR",
    material: "Solid Oak & Leather", finish_options: ["Natural Oak", "Walnut", "White Lacquer"],
    dimensions: { width: 140, height: 75, depth: 65, unit: "cm" },
    is_configurable: true, is_featured: true, tags: ["bestseller"],
    lead_time_days: 21, rating: 4.8, review_count: 67,
    images: [
      { url: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=700&q=85", is_primary: true, alt_text: "Writer Desk in Natural Oak" },
      { url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=700&q=85", is_primary: false, alt_text: "Writer Desk — drawer detail" },
    ],
  },
  {
    id: "fp-20", sku: "MOD-STD-020", slug: "standing-desk-pro",
    name: "Standing Desk Pro",
    description: "Electric height-adjustable frame with a solid walnut top. 4-memory preset handset, whisper-quiet motor, 80 kg capacity.",
    category: { id: "cat-study", name: "Study & Office", slug: "study" },
    price: 185000, compare_at_price: 215000, currency: "INR",
    material: "Solid Walnut & Steel", finish_options: ["Walnut / Black Frame", "Walnut / White Frame"],
    dimensions: { width: 160, height: 72, depth: 80, unit: "cm" },
    is_configurable: false, is_featured: true, tags: ["sale"],
    lead_time_days: 14, rating: 4.9, review_count: 44,
    images: [
      { url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=700&q=85", is_primary: true, alt_text: "Standing Desk Pro in Walnut" },
      { url: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=700&q=85", is_primary: false, alt_text: "Standing Desk — height-adjusted view" },
    ],
  },
  {
    id: "fp-21", sku: "MOD-BKS-021", slug: "open-bookshelf",
    name: "Open Bookshelf",
    description: "Modular wall-mounted shelving in solid oak. Each module mounts independently — stack vertically or spread horizontally.",
    category: { id: "cat-study", name: "Study & Office", slug: "study" },
    price: 142000, currency: "INR",
    material: "Solid Oak", finish_options: ["Natural Oak", "Black Stained", "Whitened"],
    dimensions: { width: 100, height: 180, depth: 28, unit: "cm" },
    is_configurable: true, is_featured: false, tags: [],
    lead_time_days: 28, rating: 4.7, review_count: 38,
    images: [
      { url: "https://images.unsplash.com/photo-1595347097560-69238724e7ad?w=700&q=85", is_primary: true, alt_text: "Open Bookshelf in Natural Oak" },
      { url: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=700&q=85", is_primary: false, alt_text: "Bookshelf — styled with books" },
    ],
  },
  // ── Living Room ────────────────────────────────────────────────
  {
    id: "fp-22", sku: "MOD-CFT-022", slug: "travertine-coffee-table",
    name: "Travertine Coffee Table",
    description: "Round honed travertine top on a solid oak base with mortise-and-tenon joinery. A quietly confident centrepiece.",
    category: { id: "cat-living", name: "Living Room", slug: "living" },
    price: 168000, compare_at_price: 198000, currency: "INR",
    material: "Travertine & Solid Oak", finish_options: ["Natural Travertine", "Dark Travertine"],
    dimensions: { width: 90, height: 38, depth: 90, unit: "cm" },
    is_configurable: false, is_featured: true, tags: ["sale"],
    lead_time_days: 21, rating: 4.9, review_count: 61,
    images: [
      { url: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=700&q=85", is_primary: true, alt_text: "Travertine Coffee Table — round" },
      { url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=700&q=85", is_primary: false, alt_text: "Travertine Table — living room context" },
    ],
  },
  {
    id: "fp-23", sku: "MOD-TVU-023", slug: "low-profile-tv-unit",
    name: "Low-Profile TV Unit",
    description: "Solid walnut media unit with push-to-open cane-front doors and internal cable management. For TVs up to 75 inches.",
    category: { id: "cat-living", name: "Living Room", slug: "living" },
    price: 175000, currency: "INR",
    material: "Solid Walnut & Cane", finish_options: ["Natural Walnut", "Ebonised Walnut"],
    dimensions: { width: 180, height: 48, depth: 45, unit: "cm" },
    is_configurable: false, is_featured: true, tags: ["new"],
    lead_time_days: 28, rating: 4.8, review_count: 47,
    images: [
      { url: "https://images.unsplash.com/photo-1595347097560-69238724e7ad?w=700&q=85", is_primary: true, alt_text: "Low-Profile TV Unit in Natural Walnut" },
      { url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=700&q=85", is_primary: false, alt_text: "TV Unit — styled in living room" },
    ],
  },
  {
    id: "fp-24", sku: "MOD-CNS-024", slug: "console-table-brass",
    name: "Console Table",
    description: "Solid oak console with a hand-finished brass hairpin base. Narrow profile — ideal behind a sofa or in an entryway.",
    category: { id: "cat-living", name: "Living Room", slug: "living" },
    price: 92000, currency: "INR",
    material: "Solid Oak & Brass", finish_options: ["Natural Oak / Brass", "Smoked Oak / Brass", "White / Black"],
    dimensions: { width: 130, height: 78, depth: 38, unit: "cm" },
    is_configurable: false, is_featured: false, tags: [],
    lead_time_days: 14, rating: 4.6, review_count: 33,
    images: [
      { url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=700&q=85", is_primary: true, alt_text: "Console Table in Natural Oak with Brass base" },
      { url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=700&q=85", is_primary: false, alt_text: "Console Table — entryway styling" },
    ],
  },
];

/* ── Pagination ────────────────────────────────────────────────── */
function Pagination({
  current,
  total,
  perPage,
  searchParams,
}: {
  current:      number;
  total:        number;
  perPage:      number;
  searchParams: ProductFilters;
}) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  function pageHref(p: number) {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    params.set("page", String(p));
    return `?${params.toString()}`;
  }

  // Build visible page numbers with ellipsis: always show first, last, current ±2
  function getVisiblePages(): (number | "…")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "…")[] = [];
    const around = new Set([1, totalPages, current - 1, current, current + 1].filter((p) => p >= 1 && p <= totalPages));
    let prev = 0;
    for (const p of [...around].sort((a, b) => a - b)) {
      if (p - prev > 1) pages.push("…");
      pages.push(p);
      prev = p;
    }
    return pages;
  }

  const visible = getVisiblePages();

  return (
    <nav className="flex items-center justify-center gap-1 pt-6 border-t border-black/6 dark:border-white/6" aria-label="Pagination">
      {/* Prev */}
      {current > 1 ? (
        <Link
          href={pageHref(current - 1)}
          className="flex h-9 items-center gap-1 px-3 font-sans text-[11px] tracking-[0.1em] uppercase text-charcoal/50 dark:text-cream/50 hover:text-charcoal dark:hover:text-cream transition-colors"
          aria-label="Previous page"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Prev
        </Link>
      ) : (
        <span className="flex h-9 items-center gap-1 px-3 font-sans text-[11px] uppercase text-charcoal/20 dark:text-cream/20 cursor-not-allowed select-none" aria-hidden>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Prev
        </span>
      )}

      {/* Page numbers */}
      {visible.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="flex h-9 w-9 items-center justify-center font-sans text-sm text-charcoal/25 dark:text-cream/25 select-none">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={pageHref(p)}
            aria-current={p === current ? "page" : undefined}
            className={[
              "flex h-9 w-9 items-center justify-center font-sans text-sm transition-colors",
              p === current
                ? "bg-charcoal dark:bg-cream text-cream dark:text-charcoal"
                : "text-charcoal/55 dark:text-cream/55 hover:bg-black/5 dark:hover:bg-white/5",
            ].join(" ")}
          >
            {p}
          </Link>
        ),
      )}

      {/* Next */}
      {current < totalPages ? (
        <Link
          href={pageHref(current + 1)}
          className="flex h-9 items-center gap-1 px-3 font-sans text-[11px] tracking-[0.1em] uppercase text-charcoal/50 dark:text-cream/50 hover:text-charcoal dark:hover:text-cream transition-colors"
          aria-label="Next page"
        >
          Next
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      ) : (
        <span className="flex h-9 items-center gap-1 px-3 font-sans text-[11px] uppercase text-charcoal/20 dark:text-cream/20 cursor-not-allowed select-none" aria-hidden>
          Next
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </span>
      )}
    </nav>
  );
}
