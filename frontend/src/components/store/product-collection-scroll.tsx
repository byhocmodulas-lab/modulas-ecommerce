import Link from "next/link";
import Image from "next/image";
import { fetchWithTimeout } from "@/lib/utils/fetch-with-timeout";
import { formatPrice } from "@/lib/utils/format";
import type { Product } from "@/lib/types/product";

interface Props {
  collectionTag: string;   // e.g. "arc-collection"
  excludeId:     string;
  productName:   string;
}

async function fetchCollection(collectionTag: string, excludeId: string): Promise<Product[]> {
  try {
    const params = new URLSearchParams({ limit: "8", tag: collectionTag });
    const res = await fetchWithTimeout(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"}/products?${params}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) throw new Error();
    const { products } = await res.json() as { products: Product[] };
    return products.filter((p) => p.id !== excludeId).slice(0, 8);
  } catch {
    return PLACEHOLDER.filter((p) => p.id !== excludeId);
  }
}

export async function ProductCollectionScroll({ collectionTag, excludeId, productName }: Props) {
  const products = await fetchCollection(collectionTag, excludeId);
  if (products.length === 0) return null;

  return (
    <section className="bg-cream dark:bg-charcoal-900 py-14" aria-labelledby="collection-heading">
      <div className="mx-auto max-w-[1440px]">
        {/* Header */}
        <div className="flex items-end justify-between px-6 lg:px-12 mb-8">
          <div>
            <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-gold mb-2">Part of a Collection</p>
            <h2 id="collection-heading" className="font-serif text-2xl lg:text-3xl text-charcoal dark:text-cream">
              More like {productName}
            </h2>
          </div>
          <Link
            href="/collections"
            className="hidden sm:inline-flex items-center gap-1.5 font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40 dark:text-cream/40 hover:text-charcoal dark:hover:text-cream transition-colors border-b border-charcoal/15 hover:border-charcoal/50 pb-0.5"
          >
            View Collection
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Horizontal scroll */}
        <div
          className="flex gap-3 overflow-x-auto px-6 lg:px-12 pb-2 scrollbar-none"
        >
          {products.map((p) => (
            <CollectionCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CollectionCard({ product }: { product: Product }) {
  const img = product.images.find((i) => i.is_primary) ?? product.images[0];
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex-none w-[220px] lg:w-[260px] flex flex-col"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-cream dark:bg-charcoal-800">
        {img?.url ? (
          <Image
            src={img.url}
            alt={img.alt_text ?? product.name}
            fill
            sizes="260px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" className="text-charcoal/12 dark:text-cream/12">
              <rect x="2" y="7" width="20" height="14" rx="1" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
          </div>
        )}
      </div>
      <div className="pt-3 pb-1">
        <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-gold mb-1">
          {product.category?.name}
        </p>
        <h3 className="font-serif text-[0.95rem] text-charcoal dark:text-cream leading-snug group-hover:text-gold transition-colors duration-200">
          {product.name}
        </h3>
        <p className="font-sans text-[0.85rem] text-charcoal/60 dark:text-cream/60 mt-1">
          {formatPrice(product.price, product.currency)}
        </p>
      </div>
    </Link>
  );
}

const PLACEHOLDER: Product[] = Array.from({ length: 6 }, (_, i) => ({
  id:              `col-${i}`,
  sku:             `COL-00${i}`,
  slug:            `collection-item-${i + 1}`,
  name:            ["Linen Armchair", "Oak Side Table", "Boucle Ottoman", "Walnut Shelf", "Leather Stool", "Marble Lamp"][i] ?? "Collection Item",
  description:     "Part of the same curated collection.",
  category:        { id: "c1", name: "Living", slug: "living" },
  price:           [95000, 120000, 65000, 88000, 72000, 45000][i] ?? 80000,
  compare_at_price: undefined,
  currency:        "INR",
  material:        "mixed",
  finish_options:  [],
  dimensions:      null,
  is_configurable: false,
  is_featured:     false,
  tags:            [],
  images:          [],
  lead_time_days:  14,
  rating:          4.6,
  review_count:    12 + i * 5,
}));
