"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

interface SearchBarProps {
  defaultValue?: string;
}

export function SearchBar({ defaultValue = "" }: SearchBarProps) {
  const router     = useRouter();
  const pathname   = usePathname();
  const [value,    setValue]    = useState(defaultValue);
  const [pending,  startTransition] = useTransition();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setValue(q);
    startTransition(() => {
      const params = new URLSearchParams(window.location.search);
      if (q) params.set("q", q);
      else   params.delete("q");
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [pathname, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex-1 max-w-sm" role="search">
      <label htmlFor="product-search" className="sr-only">
        Search products
      </label>
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/35 dark:text-cream/35 pointer-events-none" />
        <input
          id="product-search"
          type="search"
          value={value}
          onChange={handleChange}
          placeholder="Search collection…"
          className="w-full h-10 rounded-full border border-charcoal/12 dark:border-cream/12 bg-white dark:bg-charcoal-900 pl-10 pr-4 font-sans text-sm text-charcoal dark:text-cream placeholder:text-charcoal/30 dark:placeholder:text-cream/30 outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/20 transition-all"
        />
        {pending && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            <SpinnerIcon />
          </span>
        )}
      </div>
    </form>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className}>
      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin text-gold">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
