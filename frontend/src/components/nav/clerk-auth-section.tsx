"use client";

import Link from "next/link";

/** Simple sign-in link — no Clerk dependency. */
export default function ClerkAuthSection() {
  return (
    <Link
      href="/login"
      className="hidden sm:inline-flex items-center gap-2 rounded-full border border-charcoal/20 dark:border-cream/20 px-4 py-1.5 font-sans text-[12px] tracking-[0.1em] uppercase transition-all hover:border-gold hover:text-gold"
    >
      Sign In
    </Link>
  );
}
