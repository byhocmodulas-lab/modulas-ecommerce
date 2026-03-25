"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SortSelect } from "@/components/store/sort-select";
import type { ProductFilters } from "@/lib/types/product";

interface ProductsToolbarProps {
  searchParams:  ProductFilters;
  total?:        number;
  onFilterOpen?: () => void;
}

const QUICK_FILTERS = [
  { label: "In Stock",     param: "instock",      value: "true" },
  { label: "Configurable", param: "configurable",  value: "true" },
  { label: "On Sale",      param: "sale",          value: "true" },
] as const;

const MATERIAL_OPTIONS = ["All", "Solid Wood", "Marble", "Boucle", "Leather", "Velvet", "Rattan", "Steel"];

export function ProductsToolbar({ searchParams, total, onFilterOpen }: ProductsToolbarProps) {
  const router   = useRouter();
  const pathname = usePathname();
  const params   = useSearchParams();

  function updateParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value); else next.delete(key);
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  const activeQuickCount = QUICK_FILTERS.filter(
    (f) => (searchParams as Record<string, string>)[f.param] === f.value,
  ).length;
  const activeMat    = searchParams.material;
  const hasAnyFilter = activeQuickCount > 0 || !!activeMat;

  return (
    <div className="space-y-4">
      {/* ── Row: filter button + quick chips + sort ─────────────── */}
      <div className="flex items-center gap-2 flex-wrap">

        {/* Mobile filter button — hidden on lg (sidebar handles it) */}
        <button
          type="button"
          onClick={onFilterOpen}
          className={[
            "lg:hidden flex items-center gap-2 rounded-full border px-4 py-2 font-sans text-[11px] tracking-[0.12em] uppercase transition-colors",
            hasAnyFilter
              ? "border-charcoal bg-charcoal text-cream dark:border-cream dark:bg-cream dark:text-charcoal"
              : "border-black/15 dark:border-white/15 text-charcoal/60 dark:text-cream/60 hover:border-charcoal dark:hover:border-cream hover:text-charcoal dark:hover:text-cream",
          ].join(" ")}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="4" y1="6"  x2="20" y2="6" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="11" y1="18" x2="13" y2="18" />
          </svg>
          Filters
          {activeQuickCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gold text-charcoal-950 font-sans text-[9px]">
              {activeQuickCount}
            </span>
          )}
        </button>

        {/* Quick filter chips */}
        {QUICK_FILTERS.map((f) => {
          const active = (searchParams as Record<string, string>)[f.param] === f.value;
          return (
            <label
              key={f.param}
              className={[
                "rounded-full border px-4 py-2 font-sans text-[11px] tracking-[0.12em] uppercase transition-colors cursor-pointer",
                active
                  ? "border-charcoal bg-charcoal text-cream dark:border-cream dark:bg-cream dark:text-charcoal"
                  : "border-black/15 dark:border-white/15 text-charcoal/55 dark:text-cream/55 hover:border-charcoal/40 dark:hover:border-cream/40 hover:text-charcoal dark:hover:text-cream",
              ].join(" ")}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={active}
                onChange={() => updateParam(f.param, active ? null : f.value)}
              />
              {f.label}
            </label>
          );
        })}

        {/* Material quick-dropdown */}
        <MaterialDropdown
          active={activeMat}
          onSelect={(mat) => updateParam("material", mat === "All" ? null : mat)}
        />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Result count */}
        {total !== undefined && (
          <span className="hidden sm:block font-sans text-[11px] text-charcoal/35 dark:text-cream/35 whitespace-nowrap">
            {total.toLocaleString("en-IN")} {total === 1 ? "item" : "items"}
          </span>
        )}

        {/* Sort */}
        <SortSelect value={searchParams.sort} />
      </div>

      {/* Divider */}
      <div className="h-px bg-black/6 dark:bg-white/6" />
    </div>
  );
}

/* ── Material quick-dropdown ──────────────────────────────────────── */
function MaterialDropdown({ active, onSelect }: { active?: string; onSelect: (v: string) => void }) {
  return (
    <div className="relative group/mat">
      <button
        type="button"
        className={[
          "flex items-center gap-1.5 rounded-full border px-4 py-2 font-sans text-[11px] tracking-[0.12em] uppercase transition-colors",
          active
            ? "border-charcoal bg-charcoal text-cream dark:border-cream dark:bg-cream dark:text-charcoal"
            : "border-black/15 dark:border-white/15 text-charcoal/55 dark:text-cream/55 hover:border-charcoal/40 dark:hover:border-cream/40 hover:text-charcoal dark:hover:text-cream",
        ].join(" ")}
      >
        {active ?? "Material"}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          className="transition-transform group-hover/mat:[&:not(:focus-within)]:rotate-180">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div className="absolute left-0 top-full mt-1.5 z-20 min-w-[160px] border border-black/8 dark:border-white/8 bg-white dark:bg-charcoal-900 shadow-luxury py-1.5 overflow-hidden
        invisible opacity-0 group-hover/mat:visible group-hover/mat:opacity-100 transition-[opacity,visibility] duration-150">
        {MATERIAL_OPTIONS.map((mat) => (
          <button
            key={mat}
            type="button"
            onClick={() => onSelect(mat)}
            className={[
              "w-full px-4 py-2.5 text-left font-sans text-[11px] tracking-[0.08em] uppercase transition-colors",
              "hover:bg-cream dark:hover:bg-charcoal-800",
              (mat === "All" && !active) || mat === active
                ? "text-charcoal dark:text-cream font-medium"
                : "text-charcoal/55 dark:text-cream/55",
            ].join(" ")}
          >
            {mat}
          </button>
        ))}
      </div>
    </div>
  );
}
