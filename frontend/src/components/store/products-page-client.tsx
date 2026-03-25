"use client";

import { useState } from "react";
import { FilterSidebar }   from "@/components/store/filter-sidebar";
import { ProductsToolbar } from "@/components/store/products-toolbar";
import type { ProductFilters } from "@/lib/types/product";

interface ProductsPageClientProps {
  searchParams: ProductFilters;
  children: React.ReactNode;
}

/**
 * Client shell for the products listing page.
 * Owns the mobile-filter-drawer open/close state and renders the
 * two-column layout (desktop sidebar ← → sort+grid) without
 * forcing the product grid itself into a client component.
 */
export function ProductsPageClient({ searchParams, children }: ProductsPageClientProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="mx-auto max-w-[1440px] px-6 lg:px-12 py-10">
      <div className="lg:flex lg:gap-12 lg:items-start">

        {/* ── Left: persistent desktop filter sidebar ─────────────── */}
        <FilterSidebar
          searchParams={searchParams}
          mobileOpen={drawerOpen}
          onMobileClose={() => setDrawerOpen(false)}
        />

        {/* ── Right: sort bar + product grid ───────────────────────── */}
        <div className="flex-1 min-w-0">
          <ProductsToolbar
            searchParams={searchParams}
            onFilterOpen={() => setDrawerOpen(true)}
          />
          {children}
        </div>

      </div>
    </div>
  );
}
