"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils/format";
import type { ProductFilters } from "@/lib/types/product";

const CATEGORIES = [
  { slug: "sofas",   label: "Sofas & Seating" },
  { slug: "bedroom", label: "Beds & Bedroom"  },
  { slug: "dining",  label: "Dining"          },
  { slug: "study",   label: "Study & Office"  },
  { slug: "living",  label: "Living Room"     },
];

const MATERIALS = [
  { value: "solid-oak",    label: "Solid Oak" },
  { value: "solid-walnut", label: "Solid Walnut" },
  { value: "marble",       label: "Marble" },
  { value: "boucle",       label: "Boucle Fabric" },
  { value: "leather",      label: "Full-Grain Leather" },
  { value: "linen",        label: "Belgian Linen" },
  { value: "velvet",       label: "Velvet" },
  { value: "travertine",   label: "Travertine" },
];

const BRANDS = [
  { value: "modulas-originals", label: "Modulas Originals" },
  { value: "atelier-series",    label: "Atelier Series" },
  { value: "heritage",          label: "Heritage Collection" },
  { value: "outdoor-terrace",   label: "Outdoor & Terrace" },
];

const PRICE_RANGES = [
  { label: "Under ₹50,000",          min: "",       max: "50000"  },
  { label: "₹50,000 – ₹1,50,000",   min: "50000",  max: "150000" },
  { label: "₹1,50,000 – ₹5,00,000", min: "150000", max: "500000" },
  { label: "₹5,00,000+",             min: "500000", max: ""       },
];

interface FilterSidebarProps {
  searchParams:  ProductFilters;
  mobileOpen?:   boolean;
  onMobileClose?: () => void;
}

export function FilterSidebar({ searchParams, mobileOpen = false, onMobileClose }: FilterSidebarProps) {
  const router   = useRouter();
  const pathname = usePathname();

  const updateFilter = useCallback((key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    if (value) params.set(key, value);
    else       params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const clearAll   = () => router.push(pathname, { scroll: false });
  const hasFilters = !!(
    searchParams.category ||
    searchParams.material ||
    searchParams.brand    ||
    searchParams.min      ||
    searchParams.max      ||
    searchParams.configurable
  );

  const filterContent = (
    <FilterContent
      searchParams={searchParams}
      hasFilters={hasFilters}
      onClearAll={clearAll}
      onUpdateFilter={updateFilter}
      onPriceRange={(min, max, active) => {
        const p = new URLSearchParams(searchParams as Record<string, string>);
        if (active) {
          p.delete("min");
          p.delete("max");
        } else {
          if (min) p.set("min", min); else p.delete("min");
          if (max) p.set("max", max); else p.delete("max");
        }
        p.delete("page");
        router.push(`${pathname}?${p.toString()}`, { scroll: false });
      }}
    />
  );

  return (
    <>
      {/* ── Desktop sticky sidebar ───────────────────────────────── */}
      <aside
        className="hidden lg:flex w-56 xl:w-64 shrink-0 flex-col gap-6 self-start sticky top-24"
        aria-label="Product filters"
      >
        {filterContent}
      </aside>

      {/* ── Mobile drawer overlay ────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-charcoal-950/50 backdrop-blur-sm animate-fade-in"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          <div className="relative ml-auto w-80 max-w-full h-full bg-white dark:bg-charcoal-950 overflow-y-auto animate-slide-in-left flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/6 dark:border-white/6">
              <h2 className="font-serif text-lg text-charcoal dark:text-cream">Filter</h2>
              <button
                type="button"
                onClick={onMobileClose}
                aria-label="Close filters"
                className="flex h-9 w-9 items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {filterContent}
            </div>
            {hasFilters && (
              <div className="p-5 border-t border-black/6 dark:border-white/6">
                <button
                  type="button"
                  onClick={() => { clearAll(); onMobileClose?.(); }}
                  className="w-full border border-charcoal/15 dark:border-cream/15 py-2.5 font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/60 dark:text-cream/60 hover:border-gold hover:text-gold transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ── Filter content ────────────────────────────────────────────────── */
interface FilterContentProps {
  searchParams:   ProductFilters;
  hasFilters:     boolean;
  onClearAll:     () => void;
  onUpdateFilter: (key: string, value: string | undefined) => void;
  onPriceRange:   (min: string, max: string, active: boolean) => void;
}

function FilterContent({ searchParams, hasFilters, onClearAll, onUpdateFilter, onPriceRange }: FilterContentProps) {
  const isConfigurable = searchParams.configurable === "true";

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg text-charcoal dark:text-cream">Filter</h2>
        {hasFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="font-sans text-[10px] tracking-[0.12em] uppercase text-gold hover:opacity-70 transition-opacity"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <CollapsibleGroup title="Category" defaultOpen>
        {CATEGORIES.map(({ slug, label }) => (
          <FilterChip
            key={slug}
            label={label}
            active={searchParams.category === slug}
            onClick={() => onUpdateFilter("category", searchParams.category === slug ? undefined : slug)}
          />
        ))}
      </CollapsibleGroup>

      {/* Material */}
      <CollapsibleGroup title="Material">
        {MATERIALS.map(({ value, label }) => (
          <FilterChip
            key={value}
            label={label}
            active={searchParams.material === value}
            onClick={() => onUpdateFilter("material", searchParams.material === value ? undefined : value)}
          />
        ))}
      </CollapsibleGroup>

      {/* Brand */}
      <CollapsibleGroup title="Brand">
        {BRANDS.map(({ value, label }) => (
          <FilterChip
            key={value}
            label={label}
            active={searchParams.brand === value}
            onClick={() => onUpdateFilter("brand", searchParams.brand === value ? undefined : value)}
          />
        ))}
      </CollapsibleGroup>

      {/* Price */}
      <CollapsibleGroup title="Price">
        {PRICE_RANGES.map(({ label, min, max }) => {
          const active =
            searchParams.min === (min || undefined) &&
            searchParams.max === (max || undefined);
          return (
            <FilterChip
              key={label}
              label={label}
              active={active}
              onClick={() => onPriceRange(min, max, active)}
            />
          );
        })}
      </CollapsibleGroup>

      {/* Configurable toggle */}
      <label className="flex items-center gap-3 pt-1 cursor-pointer">
        <input
          type="checkbox"
          className="sr-only"
          checked={isConfigurable}
          onChange={() => onUpdateFilter("configurable", isConfigurable ? undefined : "true")}
        />
        <span
          className={cn(
            "relative inline-flex h-5 w-9 shrink-0 items-center transition-colors",
            isConfigurable ? "bg-gold" : "bg-charcoal/15 dark:bg-cream/15",
          )}
        >
          <span
            className={cn(
              "inline-block h-3.5 w-3.5 bg-white shadow transition-transform",
              isConfigurable ? "translate-x-[18px]" : "translate-x-0.5",
            )}
          />
        </span>
        <span className="font-sans text-sm text-charcoal/65 dark:text-cream/65 select-none">
          Customisable only
        </span>
      </label>
    </>
  );
}

/* ── Helpers ────────────────────────────────────────────────────────── */
function CollapsibleGroup({
  title,
  children,
  defaultOpen = false,
}: {
  title:       string;
  children:    React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className="group border-t border-black/6 dark:border-white/6 pt-4 space-y-3"
      open={defaultOpen || undefined}
    >
      <summary className="flex w-full items-center justify-between cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <h3 className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal/50 dark:text-cream/50 hover:text-charcoal dark:hover:text-cream transition-colors">
          {title}
        </h3>
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="text-charcoal/25 dark:text-cream/25 transition-transform duration-200 group-open:rotate-180"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </summary>
      <div className="flex flex-wrap gap-2">{children}</div>
    </details>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <label
      className={cn(
        "rounded-full px-3 py-1.5 font-sans text-[11px] tracking-[0.06em] transition-all cursor-pointer",
        active
          ? "bg-charcoal dark:bg-cream text-cream dark:text-charcoal"
          : "border border-charcoal/12 dark:border-cream/12 text-charcoal/65 dark:text-cream/65 hover:border-gold/50 hover:text-gold",
      )}
    >
      <input type="checkbox" className="sr-only" checked={active} onChange={() => onClick()} />
      {label}
    </label>
  );
}
