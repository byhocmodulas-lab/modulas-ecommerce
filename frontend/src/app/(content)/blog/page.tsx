import { Suspense } from "react";
import { fetchWithTimeout } from "@/lib/utils/fetch-with-timeout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Modulas",
  description:
    "Interior design inspiration, furniture craftsmanship stories, and styling guides from Modulas.",
};

interface BlogFilters {
  category?: string;
  tag?: string;
  page?: string;
}

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  publishedAt: string;
  readingTimeMin: number;
  author: {
    fullName: string;
    avatarUrl: string;
  };
}

async function ArticleGrid({ filters }: { filters: BlogFilters }) {
  let articles: Article[] = [];

  try {
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.tag) params.set("tag", filters.tag);
    if (filters.page) params.set("page", filters.page);

    const res = await fetchWithTimeout(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"}/cms/articles/published?${params}`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) throw new Error("fetch failed");
    const data = await res.json();
    articles = data.data ?? data.articles ?? [];
  } catch {
    articles = PLACEHOLDER_ARTICLES;
  }

  if (!articles.length) {
    return <p className="text-neutral-500">No articles yet.</p>;
  }

  const [featured, ...rest] = articles;

  return (
    <>
      {featured && <FeaturedArticle article={featured} />}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((a: Article) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </>
  );
}

const PLACEHOLDER_ARTICLES: Article[] = [
  {
    id: "art-1", slug: "designing-for-longevity", title: "Designing for Longevity: Why Heirloom Furniture Matters",
    excerpt: "In an age of disposable design, we explore why investing in pieces built to last is better for your home, your wallet, and the planet.",
    coverImage: "", category: "Design Philosophy", publishedAt: "2026-02-28",
    readingTimeMin: 7, author: { fullName: "Eleanor Whitfield", avatarUrl: "" },
  },
  {
    id: "art-2", slug: "spring-styling-guide", title: "Spring Styling: Light, Texture, and Natural Tones",
    excerpt: "Our creative director shares five effortless ways to refresh your living space for the warmer months using materials and light.",
    coverImage: "", category: "Styling Guides", publishedAt: "2026-03-05",
    readingTimeMin: 5, author: { fullName: "James Harlow", avatarUrl: "" },
  },
  {
    id: "art-3", slug: "the-art-of-joinery", title: "The Art of Craft: Inside the Modulas Design Studio",
    excerpt: "A behind-the-scenes look at the traditional hand-cut joinery techniques used in every Modulas piece.",
    coverImage: "", category: "Craftsmanship", publishedAt: "2026-03-10",
    readingTimeMin: 9, author: { fullName: "Thomas Webb", avatarUrl: "" },
  },
  {
    id: "art-4", slug: "small-space-solutions", title: "Small Space, Big Impact: Modular Furniture for Compact Living",
    excerpt: "How to make the most of every square metre with configurable, multi-functional furniture.",
    coverImage: "", category: "Styling Guides", publishedAt: "2026-03-12",
    readingTimeMin: 6, author: { fullName: "Sophie Chen", avatarUrl: "" },
  },
];

function FeaturedArticle({ article }: { article: Article }) {
  return (
    <a
      href={`/blog/${article.slug}`}
      className="group grid overflow-hidden rounded-2xl border border-neutral-200 bg-white md:grid-cols-2"
    >
      {article.coverImage && (
        <div className="aspect-video overflow-hidden bg-neutral-100 md:aspect-auto">
          <img
            src={article.coverImage}
            alt={article.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-col justify-center p-8">
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
          {article.category}
        </span>
        <h2 className="mt-2 text-2xl font-bold tracking-tight group-hover:underline">
          {article.title}
        </h2>
        <p className="mt-3 text-neutral-600 line-clamp-3">{article.excerpt}</p>
        <div className="mt-4 flex items-center gap-3 text-sm text-neutral-500">
          <span>{article.author.fullName}</span>
          <span>{article.readingTimeMin} min read</span>
        </div>
      </div>
    </a>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <a
      href={`/blog/${article.slug}`}
      className="group overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:shadow-md"
    >
      {article.coverImage && (
        <div className="aspect-video overflow-hidden bg-neutral-100">
          <img
            src={article.coverImage}
            alt={article.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-5">
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
          {article.category}
        </span>
        <h3 className="mt-1 text-lg font-semibold group-hover:underline line-clamp-2">
          {article.title}
        </h3>
        <p className="mt-2 text-sm text-neutral-600 line-clamp-2">{article.excerpt}</p>
        <div className="mt-3 text-xs text-neutral-400">
          {article.readingTimeMin} min read
        </div>
      </div>
    </a>
  );
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<BlogFilters>;
}) {
  const resolvedParams = await searchParams;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Modulas Blog",
            description: metadata.description,
            publisher: {
              "@type": "Organization",
              name: "Modulas",
            },
          }),
        }}
      />
      <div className="mx-auto max-w-screen-xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
          <p className="mt-2 text-neutral-600">
            Design inspiration, craftsmanship, and styling guides.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="space-y-6">
              <div className="h-64 animate-pulse rounded-2xl bg-neutral-100" />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-72 animate-pulse rounded-xl bg-neutral-100" />
                ))}
              </div>
            </div>
          }
        >
          <ArticleGrid filters={resolvedParams} />
        </Suspense>
      </div>
    </>
  );
}
