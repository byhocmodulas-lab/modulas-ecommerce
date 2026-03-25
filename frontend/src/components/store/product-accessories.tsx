import { ProductCard }   from "./product-card";
import { SectionHeader } from "@/components/ui/section-header";
import { fetchWithTimeout } from "@/lib/utils/fetch-with-timeout";
import type { Product }  from "@/lib/types/product";

interface ProductAccessoriesProps {
  productId:   string;
  productTags?: string[];
}

async function fetchAccessories(productId: string, tags: string[]): Promise<Product[]> {
  try {
    const params = new URLSearchParams({ limit: "4", sort: "popular" });

    // Try tags-based fetch first, fall back to a general accessory category
    if (tags.length > 0) {
      params.set("tags", tags.slice(0, 3).join(","));
    } else {
      params.set("category", "accessories");
    }

    const res = await fetchWithTimeout(
      `${process.env.API_URL ?? "http://localhost:4000"}/api/v1/products?${params}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) throw new Error("fetch failed");
    const { products } = await res.json() as { products: Product[] };
    return products.filter((p) => p.id !== productId).slice(0, 4);
  } catch {
    return PLACEHOLDER_ACCESSORIES.filter((p) => p.id !== productId).slice(0, 4);
  }
}

const PLACEHOLDER_ACCESSORIES: Product[] = Array.from({ length: 4 }, (_, i) => ({
  id:             `accessory-${i}`,
  sku:            `ACC-00${i + 1}`,
  slug:           `accessory-${i + 1}`,
  name:           ["Brass Table Lamp", "Linen Cushion Pair", "Ceramic Planter", "Wool Throw"][i] ?? "Accessory",
  description:    "The perfect finishing touch for your space.",
  category:       { id: "cat-acc", name: "Accessories", slug: "accessories" },
  price:          [280, 120, 65, 195][i] ?? 150,
  compare_at_price: undefined,
  currency:       "GBP",
  material:       ["Brushed Brass", "Belgian Linen", "Stoneware", "Merino Wool"][i] ?? "Mixed",
  finish_options: [],
  dimensions:     null,
  is_configurable: false,
  is_featured:    false,
  tags:           [],
  images:         [],
  lead_time_days: 7,
  rating:         4.3,
  review_count:   15 + i * 5,
}));

export async function ProductAccessories({ productId, productTags = [] }: ProductAccessoriesProps) {
  const accessories = await fetchAccessories(productId, productTags);
  if (accessories.length === 0) return null;

  return (
    <section
      className="py-section mx-auto max-w-[1440px] px-6 lg:px-12 space-y-10"
      aria-labelledby="accessories-heading"
    >
      <SectionHeader
        eyebrow="Complete the look"
        title="Recommended accessories"
        subtitle="Curated pieces that pair beautifully with your selection."
        cta={{ label: "Shop all accessories", href: "/products?category=accessories" }}
      />

      <ul
        role="list"
        className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4"
      >
        {accessories.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
