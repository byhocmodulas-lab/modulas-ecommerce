import { ProductCard } from "@/components/store/product-card";
import { SectionHeader } from "@/components/ui/section-header";
import { fetchWithTimeout } from "@/lib/utils/fetch-with-timeout";
import type { Product } from "@/lib/types/product";

/* ── Data fetch ─────────────────────────────────────────────────── */
async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetchWithTimeout(
      `${process.env.API_URL ?? "http://localhost:4000"}/api/v1/products?sort=popular&limit=8`,
      { next: { revalidate: 300, tags: ["products"] } },
    );
    if (!res.ok) return FEATURED_PRODUCTS;
    const { products } = await res.json();
    return products?.length ? products : FEATURED_PRODUCTS;
  } catch {
    return FEATURED_PRODUCTS;
  }
}

/* ── Async server component — renders directly, no inner Suspense ── */
export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return (
    <section
      className="py-section bg-white dark:bg-charcoal-950"
      aria-labelledby="featured-heading"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 space-y-10">
        <SectionHeader
          eyebrow="Bestsellers"
          title="Crafted to Last"
          subtitle="Our most celebrated pieces — each designed to outlast trends and configure around your life."
          cta={{ label: "Shop all products", href: "/products" }}
        />

        <ul role="list" className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {products.slice(0, 8).map((product, i) => (
            <li key={product.id}>
              <ProductCard product={product} priority={i < 2} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── Featured catalog (CB2-inspired luxury furniture) ───────────── */
const FEATURED_PRODUCTS: Product[] = [
  {
    id: "fp-1", sku: "MOD-AVC-001", slug: "avec-modular-sofa",
    name: "Avec Modular Sofa",
    description: "A cloud-soft modular sofa upholstered in performance boucle over a kiln-dried hardwood frame with hand-tied springs. Fully reconfigurable.",
    category: { id: "cat-sofas", name: "Sofas", slug: "sofas" },
    price: 385000, compare_at_price: 480000, currency: "INR",
    material: "Boucle Fabric", finish_options: ["Oatmeal", "Slate", "Warm Sand"],
    dimensions: { width: 268, height: 80, depth: 102, unit: "cm" },
    is_configurable: true, is_featured: true, tags: ["bestseller"],
    lead_time_days: 28, rating: 4.9, review_count: 124,
    images: [
      { url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85", is_primary: true, alt_text: "Avec Modular Sofa in Oatmeal Boucle" },
      { url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=85", is_primary: false, alt_text: "Avec Sofa — living room setting" },
    ],
  },
  {
    id: "fp-2", sku: "MOD-SPD-002", slug: "span-dining-table",
    name: "Span Dining Table",
    description: "Honed Italian marble top on a precision-welded brushed brass base. Seats eight generously. A centrepiece that lasts generations.",
    category: { id: "cat-tables", name: "Tables", slug: "tables" },
    price: 420000, currency: "INR",
    material: "Calacatta Marble & Brass", finish_options: ["Calacatta White", "Statuario Grey"],
    dimensions: { width: 240, height: 75, depth: 100, unit: "cm" },
    is_configurable: false, is_featured: true, tags: ["new"],
    lead_time_days: 35, rating: 4.8, review_count: 67,
    images: [
      { url: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=800&q=85", is_primary: true, alt_text: "Span Dining Table — marble with brass base" },
      { url: "https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=800", is_primary: false, alt_text: "Span Table — styled with linen chairs" },
    ],
  },
  {
    id: "fp-3", sku: "MOD-CAT-003", slug: "cate-swivel-chair",
    name: "Cate Swivel Chair",
    description: "A fully upholstered swivel lounge chair on a polished brass disc base. Sink-in comfort with a 360° silhouette that works from every angle.",
    category: { id: "cat-sofas", name: "Sofas", slug: "sofas" },
    price: 128000, compare_at_price: 158000, currency: "INR",
    material: "Velvet", finish_options: ["Forest Green", "Burnt Sienna", "Ink Blue", "Chalk"],
    dimensions: { width: 78, height: 82, depth: 78, unit: "cm" },
    is_configurable: false, is_featured: true, tags: ["bestseller"],
    lead_time_days: 21, rating: 4.7, review_count: 89,
    images: [
      { url: "https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=800&q=85", is_primary: true, alt_text: "Cate Swivel Chair in Forest Green Velvet" },
      { url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=85", is_primary: false, alt_text: "Cate Chair — brass base detail" },
    ],
  },
  {
    id: "fp-4", sku: "MOD-ARC-004", slug: "arc-side-table",
    name: "Arc Side Table",
    description: "Roman travertine disc on a hand-turned brass stem. Quietly beautiful and effortlessly versatile — works beside a sofa or in an entryway.",
    category: { id: "cat-tables", name: "Tables", slug: "tables" },
    price: 79000, compare_at_price: 99000, currency: "INR",
    material: "Travertine & Brass", finish_options: ["Roman Travertine", "Black Marquina"],
    dimensions: { width: 48, height: 58, depth: 48, unit: "cm" },
    is_configurable: false, is_featured: false, tags: ["sale"],
    lead_time_days: 14, rating: 4.6, review_count: 57,
    images: [
      { url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=85", is_primary: true, alt_text: "Arc Side Table — travertine with brass stem" },
      { url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=85", is_primary: false, alt_text: "Arc Side Table — room context" },
    ],
  },
  {
    id: "fp-5", sku: "MOD-MLW-005", slug: "mellow-sectional",
    name: "Mellow Sectional",
    description: "A generously scaled L-shape sectional in performance linen. Deep cushions, wide arms, and a frame built to last 25 years. Completely reconfigurable.",
    category: { id: "cat-sofas", name: "Sofas", slug: "sofas" },
    price: 640000, currency: "INR",
    material: "Performance Linen", finish_options: ["Natural Flax", "Stone", "Charcoal", "Terracotta"],
    dimensions: { width: 310, height: 82, depth: 160, unit: "cm" },
    is_configurable: true, is_featured: true, tags: ["new", "bestseller"],
    lead_time_days: 42, rating: 4.9, review_count: 41,
    images: [
      { url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=85", is_primary: true, alt_text: "Mellow Sectional in Natural Flax Linen" },
      { url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85", is_primary: false, alt_text: "Mellow Sectional — cushion detail" },
    ],
  },
  {
    id: "fp-6", sku: "MOD-NRL-006", slug: "noir-arc-lamp",
    name: "Noir Arc Lamp",
    description: "Sculpted matte-black steel arc with a hand-thrown marble base and linen shade. Dimmable LED, warm 2700K glow.",
    category: { id: "cat-lighting", name: "Lighting", slug: "lighting" },
    price: 52000, currency: "INR",
    material: "Steel, Marble & Linen", finish_options: ["Matte Black", "Aged Brass"],
    dimensions: { width: 45, height: 190, depth: 45, unit: "cm" },
    is_configurable: false, is_featured: false, tags: [],
    lead_time_days: 10, rating: 4.7, review_count: 92,
    images: [
      { url: "https://images.unsplash.com/photo-1513506003901-1e6a35eb0e1d?w=800&q=85", is_primary: true, alt_text: "Noir Arc Lamp — matte black with marble base" },
      { url: "https://images.pexels.com/photos/6444348/pexels-photo-6444348.jpeg?auto=compress&cs=tinysrgb&w=800", is_primary: false, alt_text: "Noir Lamp — linen shade lit" },
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
      { url: "https://images.unsplash.com/photo-1595347097560-69238724e7ad?w=800&q=85", is_primary: true, alt_text: "Grid Shelving System in Smoked Oak" },
      { url: "https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=800", is_primary: false, alt_text: "Grid Shelving — drawer detail" },
    ],
  },
  {
    id: "fp-8", sku: "MOD-RBN-008", slug: "ribbon-pendant",
    name: "Ribbon Pendant",
    description: "Hand-woven rattan shade with solid brass fittings and a fabric-wrapped cord. Warm ambient light for dining rooms and kitchen islands.",
    category: { id: "cat-lighting", name: "Lighting", slug: "lighting" },
    price: 38000, currency: "INR",
    material: "Rattan & Solid Brass", finish_options: ["Natural Rattan", "Bleached White"],
    dimensions: { width: 52, height: 42, depth: 52, unit: "cm" },
    is_configurable: false, is_featured: false, tags: [],
    lead_time_days: 10, rating: 4.5, review_count: 76,
    images: [
      { url: "https://images.pexels.com/photos/6444348/pexels-photo-6444348.jpeg?auto=compress&cs=tinysrgb&w=800", is_primary: true, alt_text: "Ribbon Pendant — natural rattan over dining table" },
      { url: "https://images.unsplash.com/photo-1513506003901-1e6a35eb0e1d?w=800&q=85", is_primary: false, alt_text: "Ribbon Pendant — brass fitting detail" },
    ],
  },
];
