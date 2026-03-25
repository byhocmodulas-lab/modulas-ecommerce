"use client";

import { useRouter, usePathname } from "next/navigation";

const OPTIONS = [
  { value: "relevance",   label: "Most Relevant" },
  { value: "newest",      label: "Newest" },
  { value: "popular",     label: "Most Popular" },
  { value: "price-asc",   label: "Price: Low to High" },
  { value: "price-desc",  label: "Price: High to Low" },
] as const;

export function SortSelect({ value = "relevance" }: { value?: string }) {
  const router   = useRouter();
  const pathname = usePathname();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(window.location.search);
    params.set("sort", e.target.value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="relative">
      <label htmlFor="sort-select" className="sr-only">Sort by</label>
      <select
        id="sort-select"
        value={value}
        onChange={handleChange}
        className="h-10 rounded-full border border-charcoal/12 dark:border-cream/12 bg-white dark:bg-charcoal-900 pl-4 pr-9 font-sans text-sm text-charcoal dark:text-cream outline-none focus:border-gold/60 cursor-pointer appearance-none transition-colors hover:border-gold/40"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {/* Custom chevron */}
      <svg
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal/35 dark:text-cream/35"
        width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}
