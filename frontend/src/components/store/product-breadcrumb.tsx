import Link from "next/link";
import type { Product } from "@/lib/types/product";

export function ProductBreadcrumb({ product }: { product: Product }) {
  const crumbs = [
    { label: "Home",       href: "/" },
    { label: "Collection", href: "/products" },
    product.category && { label: product.category.name, href: `/products?category=${product.category.slug}` },
    { label: product.name, href: null },
  ].filter(Boolean) as { label: string; href: string | null }[];

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2">
        {crumbs.map((crumb, i) => (
          <li key={crumb.label} className="flex items-center gap-2">
            {i > 0 && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-charcoal/25 dark:text-cream/25" aria-hidden>
                <path d="M9 18l6-6-6-6" />
              </svg>
            )}
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="font-sans text-xs text-charcoal/45 dark:text-cream/45 hover:text-charcoal dark:hover:text-cream transition-colors"
              >
                {crumb.label}
              </Link>
            ) : (
              <span
                className="font-sans text-xs text-charcoal/70 dark:text-cream/70"
                aria-current="page"
              >
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
