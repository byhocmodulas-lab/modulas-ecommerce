"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils/format";
import type { Subcategory } from "@/lib/config/categories";

interface SubcategoryNavProps {
  subcategories: Subcategory[];
  activeSubcategory?: string;
}

export function SubcategoryNav({ subcategories, activeSubcategory }: SubcategoryNavProps) {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();

  const setSubcategory = useCallback(
    (slug: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (slug) params.set("subcategory", slug);
      else      params.delete("subcategory");
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  if (subcategories.length === 0) return null;

  return (
    <div className="relative border-b border-black/6 bg-white dark:bg-charcoal-950">
      {/* fade edge — right */}
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-white dark:from-charcoal-950" aria-hidden />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div
          className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none"
          style={{ scrollbarWidth: "none" }}
          role="list"
          aria-label="Filter by subcategory"
        >
          {/* All */}
          <button
            type="button"
            role="listitem"
            onClick={() => setSubcategory(null)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 font-sans text-[11px] tracking-[0.08em] uppercase transition-colors",
              !activeSubcategory
                ? "border-charcoal bg-charcoal text-cream dark:border-cream dark:bg-cream dark:text-charcoal"
                : "border-black/12 text-charcoal/60 hover:border-black/25 hover:text-charcoal dark:border-white/12 dark:text-cream/60 dark:hover:border-white/25 dark:hover:text-cream",
            )}
          >
            All
          </button>

          {subcategories.map((sub) => (
            <button
              key={sub.slug}
              type="button"
              role="listitem"
              title={sub.description}
              onClick={() => setSubcategory(sub.slug)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 font-sans text-[11px] tracking-[0.08em] uppercase transition-colors",
                activeSubcategory === sub.slug
                  ? "border-charcoal bg-charcoal text-cream dark:border-cream dark:bg-cream dark:text-charcoal"
                  : "border-black/12 text-charcoal/60 hover:border-black/25 hover:text-charcoal dark:border-white/12 dark:text-cream/60 dark:hover:border-white/25 dark:hover:text-cream",
              )}
            >
              {sub.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
