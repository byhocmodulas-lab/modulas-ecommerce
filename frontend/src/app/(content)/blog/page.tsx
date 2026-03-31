import Link from "next/link";
import { Suspense } from "react";
import { fetchWithTimeout } from "@/lib/utils/fetch-with-timeout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal — Modulas",
  description:
    "Interior design inspiration, furniture craftsmanship stories, and styling guides from Modulas.",
  openGraph: {
    title:       "Journal — Modulas",
    description: "Interior design inspiration, furniture craftsmanship stories, and styling guides.",
    images: [{ url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=85", width: 1200, height: 630 }],
  },
};

/* ── Types ──────────────────────────────────────────────────────────── */

interface BlogFilters {
  category?: string;
  tag?:      string;
  page?:     string;
}

interface Article {
  id:             string;
  slug:           string;
  title:          string;
  excerpt:        string;
  coverImage:     string;
  category:       string;
  publishedAt:    string;
  readingTimeMin: number;
  author: {
    fullName:  string;
    avatarUrl: string;
  };
}

/* ── Placeholder data ───────────────────────────────────────────────── */

const PLACEHOLDER_ARTICLES: Article[] = [
  {
    id: "art-1", slug: "designing-for-longevity",
    title:   "Designing for Longevity: Why Heirloom Furniture Matters",
    excerpt: "In an age of disposable design, we explore why investing in pieces built to last is better for your home, your wallet, and the planet.",
    coverImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=85",
    category: "Design Philosophy", publishedAt: "2026-02-28", readingTimeMin: 7,
    author: { fullName: "Eleanor Whitfield", avatarUrl: "" },
  },
  {
    id: "art-2", slug: "spring-styling-guide",
    title:   "Spring Styling: Light, Texture, and Natural Tones",
    excerpt: "Our creative director shares five effortless ways to refresh your living space for the warmer months using materials and light.",
    coverImage: "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=1200",
    category: "Styling Guides", publishedAt: "2026-03-05", readingTimeMin: 5,
    author: { fullName: "James Harlow", avatarUrl: "" },
  },
  {
    id: "art-3", slug: "the-art-of-joinery",
    title:   "The Art of Craft: Inside the Modulas Design Studio",
    excerpt: "A behind-the-scenes look at the traditional hand-cut joinery techniques used in every Modulas piece.",
    coverImage: "https://images.pexels.com/photos/3214064/pexels-photo-3214064.jpeg?auto=compress&cs=tinysrgb&w=1200",
    category: "Craftsmanship", publishedAt: "2026-03-10", readingTimeMin: 9,
    author: { fullName: "Thomas Webb", avatarUrl: "" },
  },
  {
    id: "art-4", slug: "small-space-solutions",
    title:   "Small Space, Big Impact: Modular Furniture for Compact Living",
    excerpt: "How to make the most of every square metre with configurable, multi-functional furniture.",
    coverImage: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200",
    category: "Styling Guides", publishedAt: "2026-03-12", readingTimeMin: 6,
    author: { fullName: "Sophie Chen", avatarUrl: "" },
  },
  {
    id: "art-5", slug: "colour-theory-for-interiors",
    title:   "Colour Theory for Interiors: How to Build a Palette That Lasts",
    excerpt: "The difference between a room that feels right and one that feels restless is almost always colour. Our guide to building a palette that ages well.",
    coverImage: "https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=1200",
    category: "Design Philosophy", publishedAt: "2026-03-18", readingTimeMin: 8,
    author: { fullName: "Eleanor Whitfield", avatarUrl: "" },
  },
  {
    id: "art-6", slug: "the-case-for-natural-materials",
    title:   "The Case for Natural Materials in a Synthetic World",
    excerpt: "Wood, stone, linen, cane — why natural materials outperform synthetics in comfort, longevity, and the way they make a room feel alive.",
    coverImage: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1200",
    category: "Craftsmanship", publishedAt: "2026-03-22", readingTimeMin: 6,
    author: { fullName: "Thomas Webb", avatarUrl: "" },
  },
];

const CATEGORIES = ["All", "Design Philosophy", "Styling Guides", "Craftsmanship"];

/* ── Data fetch ──────────────────────────────────────────────────────── */

async function getArticles(filters: BlogFilters): Promise<Article[]> {
  try {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== "All") params.set("category", filters.category);
    if (filters.tag)      params.set("tag",      filters.tag);
    if (filters.page)     params.set("page",     filters.page);

    const res = await fetchWithTimeout(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"}/cms/articles/published?${params}`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) throw new Error("fetch failed");
    const data = await res.json();
    return data.data ?? data.articles ?? [];
  } catch {
    let list = PLACEHOLDER_ARTICLES;
    if (filters.category && filters.category !== "All") {
      list = list.filter((a) => a.category === filters.category);
    }
    if (filters.tag) {
      // tag filter — placeholder fallback just returns all
    }
    return list;
  }
}

/* ── Article grid (async) ────────────────────────────────────────────── */

async function ArticleGrid({ filters }: { filters: BlogFilters }) {
  const articles = await getArticles(filters);

  if (!articles.length) {
    return (
      <div className="py-20 text-center">
        <p className="font-serif text-xl text-charcoal/40 dark:text-cream/40">No articles yet.</p>
      </div>
    );
  }

  const [featured, ...rest] = articles;

  return (
    <>
      {/* Featured — full-width editorial card */}
      <FeaturedArticle article={featured} />

      {/* Grid */}
      {rest.length > 0 && (
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rest.map((a: Article) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </>
  );
}

/* ── Featured article card ───────────────────────────────────────────── */

function FeaturedArticle({ article }: { article: Article }) {
  const date = new Intl.DateTimeFormat("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  }).format(new Date(article.publishedAt));

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group relative grid overflow-hidden bg-charcoal-800 lg:grid-cols-[3fr_2fr] min-h-[460px]"
      aria-label={`Featured: ${article.title}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        {article.coverImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={article.coverImage}
            alt={article.title}
            className="h-full w-full object-cover min-h-[300px] lg:min-h-full transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="h-full min-h-[300px] bg-charcoal-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-charcoal-950/50 hidden lg:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 to-transparent lg:hidden" />

        {/* Featured badge */}
        <div className="absolute top-5 left-5">
          <span className="inline-block bg-gold px-3 py-1.5 font-sans text-[9px] tracking-[0.25em] uppercase text-charcoal-950">
            Featured
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative flex flex-col justify-end bg-charcoal-950 p-8 lg:p-10 xl:p-12">
        <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-gold mb-4">
          {article.category}
        </p>
        <h2 className="font-serif text-2xl text-cream leading-snug group-hover:text-gold transition-colors duration-300 lg:text-3xl">
          {article.title}
        </h2>
        <p className="mt-4 font-sans text-[13px] text-cream/45 leading-relaxed line-clamp-3">
          {article.excerpt}
        </p>

        <div className="mt-8 flex items-center gap-4 pt-6 border-t border-white/8">
          <p className="font-sans text-[11px] text-cream/35">{article.author.fullName}</p>
          <span className="h-3 w-px bg-white/15" aria-hidden="true" />
          <p className="font-sans text-[11px] text-cream/35">{date}</p>
          <span className="h-3 w-px bg-white/15" aria-hidden="true" />
          <p className="font-sans text-[11px] text-cream/35">{article.readingTimeMin} min</p>
        </div>

        {/* Read CTA */}
        <div className="mt-6">
          <span className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.2em] uppercase text-cream/35 group-hover:text-gold transition-colors duration-200 border-b border-transparent group-hover:border-gold pb-0.5">
            Read article
            <ArrowRight size={9} />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Standard article card ───────────────────────────────────────────── */

function ArticleCard({ article }: { article: Article }) {
  const date = new Intl.DateTimeFormat("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  }).format(new Date(article.publishedAt));

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex flex-col overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-[3/2] overflow-hidden bg-charcoal-800">
        {article.coverImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={article.coverImage}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="h-full bg-charcoal-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/40 via-transparent to-transparent" />
        {/* Hover pill */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="inline-flex items-center gap-2 bg-white/90 dark:bg-charcoal-950/90 px-4 py-2 font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal dark:text-cream">
            Read article
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="pt-5 pb-3 flex flex-col gap-2 flex-1">
        <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-gold">
          {article.category}
        </p>
        <h3 className="font-serif text-lg text-charcoal dark:text-cream leading-snug group-hover:text-gold transition-colors duration-200 line-clamp-2">
          {article.title}
        </h3>
        <p className="font-sans text-[12px] text-charcoal/40 dark:text-cream/40 leading-relaxed line-clamp-2">
          {article.excerpt}
        </p>
        <p className="font-sans text-[11px] text-charcoal/30 dark:text-cream/30 mt-auto pt-3">
          {article.author.fullName} · {date} · {article.readingTimeMin} min
        </p>
      </div>

      {/* Gold underline wipe */}
      <div className="h-px bg-black/6 dark:bg-white/6 overflow-hidden">
        <div className="h-full w-0 bg-gold transition-all duration-500 group-hover:w-full" />
      </div>
    </Link>
  );
}

/* ── Grid skeleton ───────────────────────────────────────────────────── */

function GridSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-[3fr_2fr] min-h-[460px] bg-charcoal-100 dark:bg-charcoal-800 animate-pulse" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-[3/2] bg-charcoal-100 dark:bg-charcoal-800 animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 w-16 bg-charcoal-100 dark:bg-charcoal-800 animate-pulse" />
              <div className="h-5 w-3/4 bg-charcoal-100 dark:bg-charcoal-800 animate-pulse" />
              <div className="h-3 w-full bg-charcoal-100 dark:bg-charcoal-800 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────── */

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<BlogFilters>;
}) {
  const filters = await searchParams;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context":  "https://schema.org",
            "@type":     "Blog",
            name:        "Modulas Journal",
            description: "Interior design inspiration, furniture craftsmanship stories, and styling guides.",
            publisher: { "@type": "Organization", name: "Modulas" },
          }),
        }}
      />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-charcoal-950 min-h-[55vh] flex items-end"
        aria-labelledby="journal-hero-heading"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1800&q=85"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/60 to-charcoal-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/70 to-transparent" />

        <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-12 pb-16 pt-36 w-full">
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold mb-4">
            Journal
          </p>
          <h1
            id="journal-hero-heading"
            className="font-serif text-5xl text-cream leading-[1.05] lg:text-7xl max-w-3xl"
          >
            Ideas About Living Well.
          </h1>
          <p className="mt-5 font-sans text-[15px] text-cream/40 max-w-lg leading-relaxed">
            Design philosophy, craftsmanship stories, and styling guides — written
            by the people who make Modulas furniture.
          </p>
        </div>
      </section>

      {/* ── Category filter ────────────────────────────────────── */}
      <div className="bg-white dark:bg-charcoal-950 border-b border-black/8 dark:border-white/8">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="flex items-center gap-1 overflow-x-auto py-4 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const active = (!filters.category && cat === "All") || filters.category === cat;
              const href   = cat === "All" ? "/blog" : `/blog?category=${encodeURIComponent(cat)}`;
              return (
                <Link
                  key={cat}
                  href={href}
                  className={[
                    "shrink-0 px-5 py-2 font-sans text-[10px] tracking-[0.18em] uppercase transition-colors duration-200",
                    active
                      ? "bg-charcoal-950 dark:bg-cream text-cream dark:text-charcoal-950"
                      : "text-charcoal/40 dark:text-cream/40 hover:text-charcoal dark:hover:text-cream",
                  ].join(" ")}
                >
                  {cat}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Article grid ───────────────────────────────────────── */}
      <section className="bg-white dark:bg-charcoal-950 py-16 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <Suspense fallback={<GridSkeleton />}>
            <ArticleGrid filters={filters} />
          </Suspense>
        </div>
      </section>

      {/* ── Newsletter CTA ──────────────────────────────────────── */}
      <section
        className="bg-cream dark:bg-charcoal-900 py-20 px-6 lg:px-12"
        aria-labelledby="journal-newsletter-heading"
      >
        <div className="mx-auto max-w-[1440px] grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold mb-3">
              Stay informed
            </p>
            <h2
              id="journal-newsletter-heading"
              className="font-serif text-4xl text-charcoal dark:text-cream lg:text-5xl"
            >
              Ideas, delivered.
            </h2>
            <p className="mt-4 font-sans text-[14px] text-charcoal/50 dark:text-cream/50 leading-relaxed max-w-md">
              New articles on design, craft, and the art of living well — delivered
              to your inbox once a month. No noise.
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3 max-w-md"
            aria-label="Newsletter signup"
          >
            <input
              type="email"
              placeholder="your@email.com"
              required
              className="flex-1 border border-black/15 dark:border-white/15 bg-white dark:bg-charcoal-950 px-5 py-3 font-sans text-[13px] text-charcoal dark:text-cream placeholder:text-charcoal/30 dark:placeholder:text-cream/30 focus:outline-none focus:border-gold"
            />
            <button
              type="submit"
              className="shrink-0 bg-charcoal-950 dark:bg-cream px-7 py-3 font-sans text-[10px] tracking-[0.18em] uppercase text-cream dark:text-charcoal-950 hover:bg-gold dark:hover:bg-gold dark:hover:text-charcoal-950 transition-colors duration-200"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

/* ── Icon ────────────────────────────────────────────────────────────── */

function ArrowRight({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
