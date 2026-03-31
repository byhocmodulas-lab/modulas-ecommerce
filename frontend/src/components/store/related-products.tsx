import { ProductCard }   from "./product-card";
import { SectionHeader } from "@/components/ui/section-header";
import { fetchWithTimeout } from "@/lib/utils/fetch-with-timeout";
import type { Product }  from "@/lib/types/product";

interface RelatedProductsProps {
  categorySlug?: string;
  excludeId:     string;
}

async function fetchRelated(categorySlug?: string, excludeId?: string): Promise<Product[]> {
  try {
    const params = new URLSearchParams({ limit: "4" });
    if (categorySlug) params.set("category", categorySlug);
    const res = await fetchWithTimeout(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"}/products?${params}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) throw new Error("fetch failed");
    const { products } = await res.json() as { products: Product[] };
    return products.filter((p) => p.id !== excludeId).slice(0, 4);
  } catch {
    return PLACEHOLDER_PRODUCTS.filter((p) => p.id !== excludeId).slice(0, 4);
  }
}

const PLACEHOLDER_PRODUCTS: Product[] = Array.from({ length: 4 }, (_, i) => ({
  id:             `related-${i}`,
  sku:            `REL-00${i + 1}`,
  slug:           `related-product-${i + 1}`,
  name:           ["Linen Cushion Set", "Oak Coffee Table", "Wool Throw Blanket", "Ceramic Vase"][i] ?? "Related Product",
  description:    "A beautifully crafted companion piece.",
  category:       { id: "cat-1", name: "Accessories", slug: "accessories" },
  price:          [320, 890, 180, 95][i] ?? 200,
  compare_at_price: undefined,
  currency:       "GBP",
  material:       ["Belgian Linen", "Solid Oak", "Merino Wool", "Hand-thrown Ceramic"][i] ?? "Mixed",
  finish_options: [],
  dimensions:     null,
  is_configurable: false,
  is_featured:    false,
  tags:           [],
  images:         [],
  lead_time_days: 14,
  rating:         4.5,
  review_count:   8 + i * 3,
}));

export async function RelatedProducts({ categorySlug, excludeId }: RelatedProductsProps) {
  const products = await fetchRelated(categorySlug, excludeId);
  if (products.length === 0) return null;

  return (
    <section
      className="py-section mx-auto max-w-[1440px] px-6 lg:px-12 space-y-10"
      aria-labelledby="related-heading"
    >
      <SectionHeader
        eyebrow="You may also like"
        title="Complete the look"
        cta={{ label: "View all", href: "/products" }}
      />

      <ul
        role="list"
        className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4"
      >
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
