import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Modulas",
};

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      {/* Number */}
      <p className="font-serif text-[10rem] leading-none text-charcoal/8 dark:text-cream/8 select-none">
        404
      </p>

      <div className="-mt-8 space-y-4 max-w-md">
        <h1 className="font-serif text-display-sm text-charcoal dark:text-cream">
          Page not found
        </h1>
        <p className="font-sans text-sm text-charcoal/55 dark:text-cream/55 leading-relaxed">
          The page you're looking for has moved, been removed, or never existed.
          Browse the collection instead.
        </p>

        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <Link
            href="/products"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-gold px-8 font-sans text-[12px] tracking-[0.12em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
          >
            Browse Collection
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-full border border-charcoal/20 dark:border-cream/20 px-8 font-sans text-[12px] tracking-[0.12em] uppercase text-charcoal dark:text-cream hover:border-gold hover:text-gold transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
