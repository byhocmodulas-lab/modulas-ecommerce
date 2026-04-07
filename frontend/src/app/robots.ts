import type { MetadataRoute } from "next";

/**
 * robots.txt — controls crawler access.
 *
 * Public store pages: fully indexable.
 * Portal dashboards, admin, auth pages: disallowed.
 * API routes: disallowed.
 */
export default function robots(): MetadataRoute.Robots {
  const base = "https://modulas.in";

  return {
    rules: [
      {
        // Default: allow all public pages
        userAgent: "*",
        allow: "/",
        disallow: [
          // Role portals — dashboards are private, only login pages are public
          "/architect/",
          "/vendor/",
          "/creator/",
          "/intern/",
          "/master-admin/",

          // Auth pages — no indexing value
          "/login",
          "/signup",
          "/forgot-password",
          "/reset-password",

          // Portal login pages — branded but no indexing value
          "/architect/login",
          "/vendor/login",
          "/creator/login",
          "/workshop/login",

          // Account / private
          "/account/",
          "/checkout/",

          // API routes
          "/api/",

          // Internal Next.js
          "/_next/",
        ],
      },
      {
        // Block AI scrapers that don't respect noindex (opt-in basis)
        // Remove lines for scrapers you want to allow
        userAgent: "GPTBot",
        allow: [
          "/products/",
          "/modular-solutions/",
          "/spaces/",
          "/collections/",
          "/blog/",
          "/journal/",
          "/about",
          "/our-story",
          "/architects",
          "/for-designers",
          "/bespoke",
          "/how-it-works",
          "/sustainability",
          "/manufacturing",
        ],
        disallow: "/",
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: [
          "/architect/",
          "/vendor/",
          "/creator/",
          "/intern/",
          "/master-admin/",
          "/account/",
          "/checkout/",
          "/api/",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
