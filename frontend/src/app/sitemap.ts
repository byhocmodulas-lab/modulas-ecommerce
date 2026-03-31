import type { MetadataRoute } from "next";

const BASE = "https://modulas.in";
const API  = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

/* ─────────────────────────────────────────────────────────────
 *  Static public routes — grouped by priority + change frequency
 * ───────────────────────────────────────────────────────────── */
const STATIC_ROUTES: MetadataRoute.Sitemap = [
  // ── Tier 1: Core conversion pages ───────────────────────────
  { url: `${BASE}/`,                     priority: 1.0, changeFrequency: "weekly"  },
  { url: `${BASE}/products`,             priority: 0.9, changeFrequency: "daily"   },
  { url: `${BASE}/modular-solutions`,    priority: 0.9, changeFrequency: "weekly"  },
  { url: `${BASE}/spaces`,               priority: 0.8, changeFrequency: "weekly"  },
  { url: `${BASE}/collections`,          priority: 0.8, changeFrequency: "weekly"  },
  { url: `${BASE}/book-consultation`,    priority: 0.8, changeFrequency: "monthly" },

  // ── Tier 2: Category landing pages ──────────────────────────
  { url: `${BASE}/modular-solutions/kitchens`,  priority: 0.8, changeFrequency: "weekly" },
  { url: `${BASE}/modular-solutions/wardrobes`, priority: 0.8, changeFrequency: "weekly" },
  { url: `${BASE}/modular-solutions/storage`,   priority: 0.7, changeFrequency: "weekly" },
  { url: `${BASE}/furniture`,                   priority: 0.7, changeFrequency: "weekly" },

  // ── Tier 3: Brand + discovery ───────────────────────────────
  { url: `${BASE}/projects`,       priority: 0.7, changeFrequency: "weekly"  },
  { url: `${BASE}/journal`,        priority: 0.7, changeFrequency: "daily"   },
  { url: `${BASE}/for-designers`,  priority: 0.6, changeFrequency: "monthly" },
  { url: `${BASE}/architects`,     priority: 0.6, changeFrequency: "monthly" },
  { url: `${BASE}/our-story`,      priority: 0.6, changeFrequency: "monthly" },
  { url: `${BASE}/about`,          priority: 0.5, changeFrequency: "monthly" },
  { url: `${BASE}/sustainability`, priority: 0.5, changeFrequency: "monthly" },
  { url: `${BASE}/press`,          priority: 0.5, changeFrequency: "monthly" },
  { url: `${BASE}/bespoke`,        priority: 0.6, changeFrequency: "monthly" },

  // ── Tier 4: Join / careers (indexable landing pages) ─────────
  { url: `${BASE}/careers`,         priority: 0.5, changeFrequency: "weekly"  },
  { url: `${BASE}/join/vendor`,     priority: 0.5, changeFrequency: "monthly" },
  { url: `${BASE}/join/creator`,    priority: 0.4, changeFrequency: "monthly" },
  { url: `${BASE}/join/intern`,     priority: 0.4, changeFrequency: "monthly" },
  { url: `${BASE}/workshops`,       priority: 0.4, changeFrequency: "weekly"  },

  // ── Tier 5: Legal / support ──────────────────────────────────
  { url: `${BASE}/contact`,         priority: 0.4, changeFrequency: "yearly"  },
  { url: `${BASE}/delivery`,        priority: 0.4, changeFrequency: "monthly" },
  { url: `${BASE}/terms-of-sale`,   priority: 0.3, changeFrequency: "yearly"  },
  { url: `${BASE}/privacy-policy`,  priority: 0.3, changeFrequency: "yearly"  },
  { url: `${BASE}/cookie-policy`,   priority: 0.3, changeFrequency: "yearly"  },
  { url: `${BASE}/accessibility`,   priority: 0.3, changeFrequency: "yearly"  },
  { url: `${BASE}/how-it-works`,    priority: 0.5, changeFrequency: "monthly" },
];

/* ─────────────────────────────────────────────────────────────
 *  Dynamic routes — fetched from API at build/revalidation time
 * ───────────────────────────────────────────────────────────── */
async function fetchProductSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${API}/products?fields=slug&limit=2000&published=true`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json() as { items?: Array<{ slug: string }> };
    return (data.items ?? []).map((p) => p.slug).filter(Boolean);
  } catch {
    return [];
  }
}

async function fetchArticleSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${API}/articles?fields=slug&limit=500&published=true`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json() as { items?: Array<{ slug: string }> };
    return (data.items ?? []).map((a) => a.slug).filter(Boolean);
  } catch {
    return [];
  }
}

async function fetchCollectionSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${API}/collections?fields=slug&limit=200`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json() as { items?: Array<{ slug: string }> };
    return (data.items ?? []).map((c) => c.slug).filter(Boolean);
  } catch {
    return [];
  }
}

/* ─────────────────────────────────────────────────────────────
 *  Sitemap export
 * ───────────────────────────────────────────────────────────── */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productSlugs, articleSlugs, collectionSlugs] = await Promise.all([
    fetchProductSlugs(),
    fetchArticleSlugs(),
    fetchCollectionSlugs(),
  ]);

  const productRoutes: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url:             `${BASE}/products/${slug}`,
    priority:        0.8,
    changeFrequency: "weekly",
  }));

  const articleRoutes: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({
    url:             `${BASE}/journal/${slug}`,
    priority:        0.6,
    changeFrequency: "monthly",
  }));

  const collectionRoutes: MetadataRoute.Sitemap = collectionSlugs.map((slug) => ({
    url:             `${BASE}/collections/${slug}`,
    priority:        0.7,
    changeFrequency: "weekly",
  }));

  return [
    ...STATIC_ROUTES,
    ...productRoutes,
    ...articleRoutes,
    ...collectionRoutes,
  ];
}
