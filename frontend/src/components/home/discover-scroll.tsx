import Link from "next/link";
import { DiscoverScrollRow } from "./discover-scroll-row";

interface DiscoverItem {
  label:    string;
  headline: string;
  image:    string;
  href:     string;
  tag:      string;
}

export type { DiscoverItem };

const FALLBACK_ITEMS: DiscoverItem[] = [
  {
    label:    "Design Philosophy",
    headline: "Why Heirloom Furniture Matters",
    image:    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    href:     "/journal/designing-for-longevity",
    tag:      "Journal",
  },
  {
    label:    "Materials",
    headline: "The Return of Boucle",
    image:    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80",
    href:     "/journal/return-of-boucle",
    tag:      "Materials",
  },
  {
    label:    "Craftsmanship",
    headline: "Inside the Modulas Studio",
    image:    "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80",
    href:     "/journal/the-art-of-joinery",
    tag:      "Craftsmanship",
  },
  {
    label:    "Styling",
    headline: "Small Space, Big Impact",
    image:    "https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=600",
    href:     "/journal/small-space-solutions",
    tag:      "Styling Guides",
  },
  {
    label:    "Wood",
    headline: "Oak vs Walnut: Choosing the Right Hardwood",
    image:    "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=600&q=80",
    href:     "/journal/oak-vs-walnut",
    tag:      "Materials",
  },
];

async function getArticles(): Promise<DiscoverItem[]> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";
    const res = await fetch(`${api}/articles?status=published&limit=6`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return FALLBACK_ITEMS;
    const data = await res.json() as { articles?: Array<{ title: string; slug: string; coverImageUrl?: string; category?: string }> };
    if (!data.articles?.length) return FALLBACK_ITEMS;
    return data.articles.map(a => ({
      label:    a.category ?? "Journal",
      headline: a.title,
      image:    a.coverImageUrl ?? FALLBACK_ITEMS[0].image,
      href:     `/journal/${a.slug}`,
      tag:      a.category ?? "Journal",
    }));
  } catch {
    return FALLBACK_ITEMS;
  }
}

export async function DiscoverScroll() {
  const items = await getArticles();

  return (
    <section className="bg-white dark:bg-charcoal-950 py-24 lg:py-32" aria-labelledby="discover-heading">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 mb-8 flex items-end justify-between">
        <div>
          <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-gold mb-2">
            Stories
          </p>
          <h2 id="discover-heading" className="font-serif text-3xl text-charcoal dark:text-cream lg:text-4xl">
            More to Discover
          </h2>
        </div>
        <Link
          href="/journal"
          className="hidden sm:inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.18em] uppercase text-charcoal/40 dark:text-cream/40 hover:text-gold transition-colors border-b border-black/10 dark:border-white/10 hover:border-gold pb-0.5"
        >
          View all stories
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      <DiscoverScrollRow items={items} />
    </section>
  );
}
