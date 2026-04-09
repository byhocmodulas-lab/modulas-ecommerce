import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchWithTimeout } from "@/lib/utils/fetch-with-timeout";
import {
  generateProductSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from "@/lib/seo/structured-data";
import { ProductGallery }          from "@/components/store/product-gallery";
import { ProductInfo }             from "@/components/store/product-info";
import { ProductBreadcrumb }       from "@/components/store/product-breadcrumb";
import { ProductRoomVisuals }      from "@/components/store/product-room-visuals";
import { ProductDesignerNotes }    from "@/components/store/product-designer-notes";
import { ProductSpecifications }   from "@/components/store/product-specifications";
import { ProductAccessories }      from "@/components/store/product-accessories";
import { ProductCollectionScroll } from "@/components/store/product-collection-scroll";
import { PeopleAlsoViewed }        from "@/components/store/people-also-viewed";
import { ProductReviews }          from "@/components/store/product-reviews";
import { RecentlyViewed, TrackView } from "@/components/store/recently-viewed";
import type { Product }            from "@/lib/types/product";
import type { RoomVisualImage }    from "@/components/store/product-room-visuals";
import type { DesignerProfile }    from "@/components/store/product-designer-notes";
import type { SpecGroup, SpecDownload } from "@/components/store/product-specifications";
import type { MaterialOption, SizeOption } from "@/components/store/product-info";

/* ── Extended product shape ──────────────────────────────────── */
interface ProductWithDetails extends Product {
  room_visuals?:     RoomVisualImage[];
  designer?:         DesignerProfile;
  spec_groups?:      SpecGroup[];
  spec_downloads?:   SpecDownload[];
  material_options?: MaterialOption[];
  size_options?:     SizeOption[];
}

/* ── Data fetch ─────────────────────────────────────────────── */
async function fetchProduct(slug: string): Promise<ProductWithDetails | null> {
  try {
    const res = await fetchWithTimeout(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"}/catalog/products/slug/${slug}`,
      { next: { revalidate: 60, tags: [`product-${slug}`] } },
    );
    if (res.ok) {
      const product = await res.json() as Product;
      return enrichProductDetails(product);
    }
    // Fall through to demo fallback for any non-OK status (including 404)
    throw new Error(`API ${res.status}`);
  } catch {
    // Return a matching demo product, or the first demo as last resort
    const demo = DEMO_PRODUCTS.find((p) => p.slug === slug);
    return demo ? enrichProductDetails(demo) : enrichProductDetails(DEMO_PRODUCTS[0]);
  }
}

/* ── Detail enrichment ───────────────────────────────────────── */
function enrichProductDetails(product: Product): ProductWithDetails {
  return {
    ...product,
    material_options: deriveMaterialOptions(product),
    size_options:     deriveSizeOptions(product),
    room_visuals:     deriveRoomVisuals(product),
    designer:         deriveDesigner(product),
    spec_groups:      buildSpecGroups(product),
    spec_downloads:   buildSpecDownloads(product),
  };
}

function deriveMaterialOptions(product: Product): MaterialOption[] {
  if (!product.material) return [];

  const MATERIAL_MAP: Record<string, Omit<MaterialOption, "id">> = {
    "solid-oak":    { name: "Solid Oak",           hexColor: "#C8A96E" },
    "solid-walnut": { name: "Solid Walnut",        hexColor: "#6B4423" },
    "marble":       { name: "Calacatta Marble",    hexColor: "#F0EDE8" },
    "boucle":       { name: "Boucle Fabric",       hexColor: "#EDE8E0" },
    "leather":      { name: "Full-Grain Leather",  hexColor: "#3C2415" },
    "linen":        { name: "Belgian Linen",       hexColor: "#D4C8B4" },
  };

  // Offer a few variants around the primary material
  const variants: MaterialOption[] = [];
  const primary = product.material;
  if (MATERIAL_MAP[primary]) {
    variants.push({ id: primary, ...MATERIAL_MAP[primary] });
  }

  // Add complementary options based on category
  const category = product.category?.slug ?? "";
  if (["sofas", "seating"].includes(category)) {
    ["boucle", "linen", "leather"].forEach((m) => {
      if (m !== primary && MATERIAL_MAP[m]) variants.push({ id: m, ...MATERIAL_MAP[m] });
    });
  } else if (["tables", "storage"].includes(category)) {
    ["solid-oak", "solid-walnut", "marble"].forEach((m) => {
      if (m !== primary && MATERIAL_MAP[m]) variants.push({ id: m, ...MATERIAL_MAP[m] });
    });
  }

  return variants.slice(0, 5);
}

function deriveSizeOptions(product: Product): SizeOption[] {
  if (!product.is_configurable && !product.dimensions) return [];

  const category = product.category?.slug ?? "";

  if (["sofas", "seating"].includes(category)) {
    return [
      { id: "2s",  label: "2-Seater",  description: "Compact & versatile",   dimensionSummary: "168 × 82 × 98 cm" },
      { id: "3s",  label: "3-Seater",  description: "Classic proportions",   dimensionSummary: "215 × 82 × 98 cm", priceDelta: 85000 },
      { id: "cor", label: "Corner",    description: "L-shape configuration", dimensionSummary: "265 × 82 × 155 cm", priceDelta: 195000 },
      { id: "4s",  label: "4-Seater",  description: "Grand living",          dimensionSummary: "295 × 82 × 98 cm", priceDelta: 245000 },
    ];
  }
  if (["tables"].includes(category)) {
    return [
      { id: "4p",  label: "4 Person",  description: "Intimate dining",       dimensionSummary: "160 × 75 × 90 cm" },
      { id: "6p",  label: "6 Person",  description: "Everyday entertaining", dimensionSummary: "200 × 75 × 90 cm", priceDelta: 55000 },
      { id: "8p",  label: "8 Person",  description: "Generous host",         dimensionSummary: "240 × 75 × 90 cm", priceDelta: 110000 },
    ];
  }

  // Generic: use actual dimensions as the only option
  if (product.dimensions) {
    const { width, height, depth, unit } = product.dimensions;
    return [{ id: "std", label: "Standard", description: "As shown", dimensionSummary: `${width} × ${height} × ${depth} ${unit}` }];
  }
  return [];
}

function deriveRoomVisuals(product: Product): RoomVisualImage[] {
  // In production these would come from the product's room_images field
  // For now, derive plausible room context labels from category
  if (!product.images.length) return [];

  const category = product.category?.slug ?? "";
  const ROOMS: Record<string, string[]> = {
    sofas:        ["Living Room",    "Open-Plan Kitchen", "Reading Corner",  "Master Bedroom"],
    tables:       ["Dining Room",    "Kitchen",           "Garden Room",     "Conservatory"],
    storage:      ["Hallway",        "Living Room",       "Home Office",     "Bedroom"],
    lighting:     ["Living Room",    "Dining Room",       "Bedroom",         "Study"],
    rugs:         ["Living Room",    "Dining Room",       "Bedroom",         "Hallway"],
    accessories:  ["Living Room",    "Entrance Hall",     "Bathroom",        "Study"],
  };

  const rooms = ROOMS[category] ?? ["Living Room", "Bedroom", "Dining Room", "Study"];

  return product.images.slice(0, 4).map((img, i) => ({
    url:       img.url,
    alt:       img.alt_text ?? `${product.name} in ${rooms[i] ?? "room"}`,
    roomLabel: rooms[i] ?? `View ${i + 1}`,
  }));
}

function deriveDesigner(product: Product): DesignerProfile {
  // Brand-level fallback — would be product.designer from API in production
  return {
    name:       "Rohan Mehta",
    title:      "Founder & Head of Design, Modulas",
    studioName: "Gurgaon, India",
    profileHref: "/about",
    notes: [
      `The ${product.name} began with a single question: what does truly personalised furniture feel like in a contemporary Indian home?`,
      "Every dimension is refined through consultation with the client — the proportions, the material palette, the finish. We wanted a piece that feels completely natural the moment it enters your space.",
      "Each Modulas piece is configured exactly to the client's brief. We use both time-honoured craft techniques and precision manufacturing to ensure every piece performs and looks identical to what was designed.",
    ],
  };
}

function buildSpecGroups(product: Product): SpecGroup[] {
  const groups: SpecGroup[] = [];

  // Dimensions
  if (product.dimensions) {
    const { width, height, depth, unit } = product.dimensions;
    groups.push({
      heading: "Dimensions",
      items: [
        { label: "Width",  value: `${width} ${unit}` },
        { label: "Height", value: `${height} ${unit}` },
        { label: "Depth",  value: `${depth} ${unit}` },
        ...((product as any).weight_kg ? [{ label: "Weight", value: `${(product as any).weight_kg} kg` }] : []),
      ],
    });
  }

  // Materials & finish
  if (product.material || product.finish_options.length > 0) {
    groups.push({
      heading: "Materials & Finish",
      items: [
        ...(product.material ? [{ label: "Primary material", value: product.material.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) }] : []),
        ...(product.finish_options.length ? [{ label: "Available finishes", value: product.finish_options.join(", ") }] : []),
      ],
    });
  }

  // Construction & sustainability
  groups.push({
    heading: "Construction",
    items: [
      { label: "Frame",       value: "Kiln-dried hardwood, hand-morticed" },
      { label: "Suspension",  value: "8-way hand-tied springs" },
      { label: "Joinery",     value: "Traditional dovetail & mortice-tenon" },
      { label: "Lead time",   value: `${product.lead_time_days}–${product.lead_time_days + 7} business days` },
    ],
  });

  // Care
  groups.push({
    heading: "Care & Maintenance",
    items: [
      { label: "Cleaning",    value: "Spot clean with mild soap and water" },
      { label: "Conditioning", value: "Annual treatment with natural wood oil recommended" },
      { label: "Guarantee",   value: "25-year structural frame guarantee" },
    ],
  });

  return groups;
}

function buildSpecDownloads(product: Product): SpecDownload[] {
  const slug = product.slug;
  return [
    {
      label:       "Product Data Sheet",
      description: "Full specifications, care guide, and compliance certificates",
      url:         `https://assets.modulas.com/specs/${slug}-datasheet.pdf`,
      fileType:    "pdf",
      fileSizeKb:  1240,
    },
    {
      label:       "CAD Drawing Pack",
      description: "Floor plan symbols and elevations for trade use",
      url:         `https://assets.modulas.com/cad/${slug}-drawings.dwg`,
      fileType:    "dwg",
      fileSizeKb:  3820,
    },
  ];
}

/* ── Demo products (when API is unreachable) ────────────────── */
const DEMO_PRODUCTS: Product[] = [
  {
    id: "demo-1", sku: "MOD-ARC-001", slug: "sample-product-1",
    name: "Arc Modular Sofa",
    description: "A sculptural modular sofa that adapts to every room and every moment. The Arc features hand-tied springs, kiln-dried hardwood framing, and sumptuous boucle upholstery — a piece designed to be handed down.",
    category: { id: "cat-1", name: "Sofas", slug: "sofas" },
    price: 240000, compare_at_price: 300000, currency: "INR",
    material: "boucle", finish_options: ["natural", "walnut-stain"],
    dimensions: { width: 215, height: 82, depth: 98, unit: "cm" },
    is_configurable: true, is_featured: true,
    tags: ["modular", "living-room", "bestseller"], images: [],
    lead_time_days: 21, rating: 4.8, review_count: 124,
  },
  {
    id: "demo-2", sku: "MOD-SLT-002", slug: "sample-product-2",
    name: "Slate Dining Table",
    description: "A generous dining table in honed Welsh slate and solid oak. Seats six comfortably with an extension leaf for eight. The bevelled edge gives it a contemporary profile that works in traditional and modern settings alike.",
    category: { id: "cat-2", name: "Tables", slug: "tables" },
    price: 320000, compare_at_price: undefined, currency: "INR",
    material: "solid-oak", finish_options: ["natural-oil", "white-oil"],
    dimensions: { width: 200, height: 75, depth: 90, unit: "cm" },
    is_configurable: true, is_featured: true,
    tags: ["dining", "oak", "slate"], images: [],
    lead_time_days: 28, rating: 4.9, review_count: 67,
  },
  {
    id: "demo-3", sku: "MOD-LCC-003", slug: "sample-product-3",
    name: "Linen Club Chair",
    description: "An enveloping club chair with a low-slung silhouette. Upholstered in stonewashed Belgian linen over a sprung hardwood frame. Perfect for curling up with a book.",
    category: { id: "cat-1", name: "Sofas", slug: "sofas" },
    price: 180000, compare_at_price: 220000, currency: "INR",
    material: "linen", finish_options: ["oatmeal", "charcoal", "sage"],
    dimensions: { width: 88, height: 76, depth: 92, unit: "cm" },
    is_configurable: false, is_featured: true,
    tags: ["seating", "linen", "bedroom"], images: [],
    lead_time_days: 14, rating: 4.7, review_count: 89,
  },
];

/* ── Dynamic metadata ────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) return { title: "Product Not Found" };

  const image = product.images.find((i) => i.is_primary)?.url;

  return {
    title:       (product as any).seo_title ?? `${product.name} | Modulas`,
    description: (product as any).seo_description ?? product.description,
    openGraph: {
      title:       product.name,
      description: product.description,
      images:      image ? [{ url: image, width: 1200, height: 900 }] : [],
    },
  };
}

/* ── Page ────────────────────────────────────────────────────── */
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) notFound();

  const primaryImage = product.images.find((i) => i.is_primary)?.url ?? product.images[0]?.url ?? "";
  const productUrl   = `https://modulas.in/products/${product.slug}`;

  const productSchema = generateProductSchema({
    name:         product.name,
    description:  product.description ?? "",
    image:        product.images.map((i) => i.url).filter(Boolean),
    price:        product.price,
    currency:     "INR",
    sku:          (product as any).sku ?? product.id,
    brand:        (product as any).brand ?? "Modulas",
    availability: product.is_active !== false ? "InStock" : "OutOfStock",
    reviewCount:  (product as any).review_count,
    ratingValue:  (product as any).rating_avg,
    url:          productUrl,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home",     url: "https://modulas.in/" },
    { name: "Products", url: "https://modulas.in/products" },
    ...(product.category ? [{ name: product.category.name, url: `https://modulas.in/products?category=${encodeURIComponent(product.category.slug)}` }] : []),
    { name: product.name, url: productUrl },
  ]);

  const productFAQ = generateFAQSchema([
    {
      question: `What materials is the ${product.name} available in?`,
      answer: product.material_options?.length
        ? `The ${product.name} is available in ${product.material_options.map((m) => m.name).join(", ")}. Each material option can be selected in the configurator with live pricing updates.`
        : `The ${product.name} is crafted from premium materials. Contact our studio for full material specifications.`,
    },
    {
      question: `Can the ${product.name} be customised?`,
      answer: `Yes. The ${product.name} is fully configurable — choose your material, finish, and dimensions using the 3D Configurator. Our studio team is available to assist with bespoke requirements.`,
    },
    {
      question: `What is the delivery time for the ${product.name}?`,
      answer: `Standard delivery for the ${product.name} is 6–8 weeks from order confirmation, including white-glove installation. Complex configurations may take up to 12 weeks.`,
    },
  ]);

  return (
    <>
      {/* ── JSON-LD: Product + Breadcrumb + FAQ ─────────────────── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productFAQ) }} />

      {/* ── Hero zone: gallery + configurator ───────────────────── */}
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 pt-8 pb-16">
        <ProductBreadcrumb product={product} />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_500px] lg:gap-16">
          <ProductGallery product={product} />
          <ProductInfo
            product={product}
            materialOptions={product.material_options}
            sizeOptions={product.size_options}
          />
        </div>
      </div>

      {/* ── Room visualisations ─────────────────────────────────── */}
      {product.room_visuals && product.room_visuals.length > 0 && (
        <ProductRoomVisuals
          productName={product.name}
          images={product.room_visuals}
        />
      )}

      {/* ── Designer Notes + Specifications ─────────────────────── */}
      {(product.designer || (product.spec_groups && product.spec_groups.length > 0)) && (
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 py-section">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">

            {/* Designer notes */}
            {product.designer && (
              <ProductDesignerNotes designer={product.designer} />
            )}

            {/* Specifications */}
            {product.spec_groups && product.spec_groups.length > 0 && (
              <ProductSpecifications
                specGroups={product.spec_groups}
                downloads={product.spec_downloads}
              />
            )}

          </div>
        </div>
      )}

      {/* ── Recommended Accessories ─────────────────────────────── */}
      <div className="border-t border-black/5 dark:border-white/5">
        <ProductAccessories
          productId={product.id}
          productTags={product.tags}
        />
      </div>

      {/* ── Part of a Collection ─────────────────────────────────── */}
      {product.tags?.length > 0 && (
        <ProductCollectionScroll
          collectionTag={product.tags[0]}
          excludeId={product.id}
          productName={product.name}
        />
      )}

      {/* ── People Also Viewed ───────────────────────────────────── */}
      <PeopleAlsoViewed
        categorySlug={product.category?.slug}
        excludeId={product.id}
      />

      {/* ── Reviews ─────────────────────────────────────────────── */}
      <ProductReviews
        productName={product.name}
        overallRating={product.rating ?? 4.8}
        reviewCount={product.review_count ?? 0}
      />

      {/* ── Recently Viewed ──────────────────────────────────────── */}
      <RecentlyViewed excludeId={product.id} />

      {/* ── Track this view (client, silent) ─────────────────────── */}
      <TrackView
        item={{
          id:       product.id,
          slug:     product.slug,
          name:     product.name,
          price:    product.price,
          currency: product.currency,
          imageUrl: product.images.find((i) => i.is_primary)?.url ?? product.images[0]?.url,
          category: product.category?.name,
        }}
      />
    </>
  );
}