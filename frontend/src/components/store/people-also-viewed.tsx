import Link from "next/link";
import Image from "next/image";
import { fetchWithTimeout } from "@/lib/utils/fetch-with-timeout";
import { formatPrice } from "@/lib/utils/format";
import type { Product } from "@/lib/types/product";

interface Props {
  categorySlug?: string;
  excludeId:     string;
}

async function fetchAlsoViewed(categorySlug?: string, excludeId?: string): Promise<Product[]> {
  try {
    const params = new URLSearchParams({ limit: "8", sort: "popular" });
    if (categorySlug) params.set("category", categorySlug);
    const res = await fetchWithTimeout(
      `${process.env.API_URL ?? "http://localhost:4000"}/api/v1/products?${params}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) throw new Error();
    const { products } = await res.json() as { products: Product[] };
    return products.filter((p) => p.id !== excludeId).slice(0, 8);
  } catch {
    return PLACEHOLDER.filter((p) => p.id !== excludeId);
  }
}

export async function PeopleAlsoViewed({ categorySlug, excludeId }: Props) {
  const products = await fetchAlsoViewed(categorySlug, excludeId);
  if (products.length === 0) return null;

  return (
    <section className="bg-white dark:bg-charcoal-950 py-14" aria-labelledby="also-viewed-heading">
      <div className="mx-auto max-w-[1440px]">
        {/* Header */}
        <div className="flex items-end justify-between px-6 lg:px-12 mb-8">
          <div>
            <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-gold mb-2">Customers Also Loved</p>
            <h2 id="also-viewed-heading" className="font-serif text-2xl lg:text-3xl text-charcoal dark:text-cream">
              People Also Viewed
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-1.5 font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40 dark:text-cream/40 hover:text-charcoal dark:hover:text-cream transition-colors border-b border-charcoal/15 hover:border-charcoal/50 pb-0.5"
          >
            Browse All
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Horizontal scroll — 4 cards visible on desktop */}
        <div
          className="flex gap-px overflow-x-auto pb-1 scrollbar-none"
        >
          {products.map((p) => (
            <AlsoViewedCard key={p.id} product={p} />
          ))}
          {/* View more tile */}
          <Link
            href="/products"
            className="group flex-none w-[140px] flex flex-col items-center justify-center gap-3 bg-cream dark:bg-charcoal-900 hover:bg-gold/10 transition-colors px-4 py-8"
          >
            <div className="flex h-9 w-9 items-center justify-center border border-black/10 dark:border-white/10 group-hover:border-gold group-hover:text-gold transition-colors text-charcoal/40 dark:text-cream/40">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
            <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-charcoal/40 dark:text-cream/40 group-hover:text-gold transition-colors text-center leading-snug">
              View All
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function AlsoViewedCard({ product }: { product: Product }) {
  const img = product.images.find((i) => i.is_primary) ?? product.images[0];
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex-none w-[220px] lg:w-[calc(100vw/4.5)] max-w-[280px] flex flex-col bg-white dark:bg-charcoal-950"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-cream dark:bg-charcoal-800">
        {img?.url ? (
          <Image
            src={img.url}
            alt={img.alt_text ?? product.name}
            fill
            sizes="280px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-cream dark:bg-charcoal-800">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" className="text-charcoal/12">
              <rect x="2" y="7" width="20" height="14" rx="1" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
          </div>
        )}
        {/* New / Sale badge */}
        {product.tags?.includes("new") && (
          <span className="absolute top-0 left-0 font-sans text-[8px] tracking-[0.2em] uppercase text-charcoal-950 bg-white/95 px-2 py-1">New</span>
        )}
        {hasDiscount && (
          <span className="absolute top-0 left-0 font-sans text-[8px] tracking-[0.2em] uppercase text-cream bg-charcoal-950 px-2 py-1">
            Sale
          </span>
        )}
      </div>

      {/* Info */}
      <div className="px-0.5 pt-3 pb-2">
        {product.category && (
          <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-gold mb-0.5">{product.category.name}</p>
        )}
        <h3 className="font-serif text-[0.9rem] text-charcoal dark:text-cream leading-snug group-hover:text-gold transition-colors duration-200 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="font-sans text-[0.85rem] text-charcoal dark:text-cream">
            {formatPrice(product.price, product.currency)}
          </span>
          {hasDiscount && (
            <span className="font-sans text-[0.78rem] text-charcoal/30 dark:text-cream/30 line-through">
              {formatPrice(product.compare_at_price!, product.currency)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

const PLACEHOLDER: Product[] = Array.from({ length: 7 }, (_, i) => ({
  id:              `pav-${i}`,
  sku:             `PAV-00${i}`,
  slug:            `viewed-item-${i + 1}`,
  name:            ["Arc Sofa", "Slate Table", "Linen Chair", "Oak Shelf", "Boucle Bench", "Rattan Lamp", "Marble Bowl"][i] ?? "Product",
  description:     "",
  category:        { id: "c1", name: ["Sofas", "Tables", "Seating", "Storage", "Seating", "Lighting", "Accessories"][i] ?? "Home", slug: "home" },
  price:           [240000, 320000, 180000, 95000, 75000, 42000, 18000][i] ?? 100000,
  compare_at_price: i === 0 ? 300000 : undefined,
  currency:        "INR",
  material:        "mixed",
  finish_options:  [],
  dimensions:      null,
  is_configurable: false,
  is_featured:     false,
  tags:            i === 2 ? ["new"] : [],
  images:          [],
  lead_time_days:  14,
  rating:          4.4 + i * 0.1,
  review_count:    8 + i * 7,
}));
