import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils/format";

export interface CategoryBannerItem {
  slug: string;
  label: string;
  description?: string;
  href: string;
  imageUrl: string;
  imageAlt: string;
  /** Overlay text colour theme */
  theme?: "dark" | "light";
}

interface CategoryBannerGridProps {
  items: CategoryBannerItem[];
  /** "hero" = 1 large + 2 smaller; "grid" = equal grid; "row" = single horizontal row */
  layout?: "hero" | "grid" | "row";
  className?: string;
}

/** Full-bleed category banner grid — hero, equal-grid, or scrollable row layouts */
export function CategoryBannerGrid({
  items,
  layout = "hero",
  className,
}: CategoryBannerGridProps) {
  if (layout === "row") {
    return (
      <div className={cn("flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory", className)}>
        {items.map((item) => (
          <div key={item.slug} className="snap-start shrink-0 w-64">
            <CategoryBannerCard item={item} aspectRatio="aspect-[3/4]" />
          </div>
        ))}
      </div>
    );
  }

  if (layout === "grid") {
    return (
      <div
        className={cn(
          "grid gap-4",
          items.length === 2 && "grid-cols-1 sm:grid-cols-2",
          items.length === 3 && "grid-cols-1 sm:grid-cols-3",
          items.length >= 4 && "grid-cols-2 lg:grid-cols-4",
          className,
        )}
      >
        {items.map((item) => (
          <CategoryBannerCard key={item.slug} item={item} aspectRatio="aspect-[3/4]" />
        ))}
      </div>
    );
  }

  // Hero layout: first item is large, rest stack in a column
  const [hero, ...rest] = items;
  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-4", className)}>
      {/* Large hero banner */}
      {hero && (
        <CategoryBannerCard
          item={hero}
          aspectRatio="aspect-[3/4] lg:aspect-auto lg:min-h-[560px]"
          titleSize="large"
        />
      )}
      {/* Stacked smaller banners */}
      {rest.length > 0 && (
        <div className="flex flex-col gap-4">
          {rest.slice(0, 2).map((item) => (
            <CategoryBannerCard
              key={item.slug}
              item={item}
              aspectRatio="aspect-[16/9] lg:flex-1"
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Single category banner card ─────────────────────────────── */
interface CategoryBannerCardProps {
  item: CategoryBannerItem;
  aspectRatio?: string;
  titleSize?: "default" | "large";
}

export function CategoryBannerCard({
  item,
  aspectRatio = "aspect-[3/4]",
  titleSize = "default",
}: CategoryBannerCardProps) {
  const isDark = item.theme !== "light";

  return (
    <Link
      href={item.href}
      className={cn(
        "group relative block overflow-hidden rounded-2xl",
        "bg-cream dark:bg-charcoal-800",
        aspectRatio,
      )}
    >
      {/* Background image */}
      <Image
        src={item.imageUrl}
        alt={item.imageAlt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Gradient overlay */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-300",
          isDark
            ? "bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/20 to-transparent group-hover:from-charcoal-950/90"
            : "bg-gradient-to-t from-white/70 via-white/10 to-transparent",
        )}
      />

      {/* Content */}
      <div className="absolute bottom-0 inset-x-0 p-6 lg:p-7">
        {/* Category eyebrow */}
        <p
          className={cn(
            "mb-2 font-sans text-[10px] tracking-[0.3em] uppercase transition-colors duration-200",
            isDark ? "text-gold" : "text-gold-600",
          )}
        >
          {item.label}
        </p>

        {/* Description if given */}
        {item.description && (
          <h3
            className={cn(
              "font-serif leading-tight transition-colors duration-200",
              titleSize === "large" ? "text-2xl lg:text-3xl" : "text-xl",
              isDark
                ? "text-cream group-hover:text-gold"
                : "text-charcoal-900 group-hover:text-gold-700",
            )}
          >
            {item.description}
          </h3>
        )}

        {/* CTA */}
        <span
          className={cn(
            "mt-3 inline-flex items-center gap-1.5 font-sans text-[11px] tracking-[0.15em] uppercase transition-all duration-200",
            isDark
              ? "text-cream/60 group-hover:text-gold group-hover:gap-2.5"
              : "text-charcoal/60 group-hover:text-gold-600 group-hover:gap-2.5",
          )}
        >
          Shop Now
          <ArrowRightIcon />
        </span>
      </div>

      {/* Top-right item count badge (optional, pass via description slot) */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="flex h-7 items-center rounded-full bg-gold px-3 font-sans text-[9px] tracking-[0.15em] uppercase text-charcoal-950">
          Explore
        </span>
      </div>
    </Link>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
