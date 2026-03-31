import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Clock } from "lucide-react";
import { fetchWithTimeout } from "@/lib/utils/fetch-with-timeout";

export const metadata: Metadata = {
  title: "Journal — Design Stories & Inspiration | Modulas",
  description:
    "Read our latest design stories, material guides, craftsmanship features and home inspiration from the Modulas studio.",
};

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  category: string;
  publishedAt: string;
  readingTimeMin: number;
  author: { fullName: string; avatarUrl?: string };
}

const CATEGORIES = ["All", "Design Philosophy", "Craftsmanship", "Styling Guides", "Materials", "Architects"];

const PLACEHOLDER_ARTICLES: Article[] = [
  {
    id: "art-1", slug: "designing-for-longevity",
    title: "Designing for Longevity: Why Heirloom Furniture Matters",
    excerpt: "In an age of disposable design, we explore why investing in pieces built to last is better for your home, your wallet, and the planet.",
    coverImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=85",
    category: "Design Philosophy", publishedAt: "2026-02-28", readingTimeMin: 7,
    author: { fullName: "Eleanor Whitfield" },
  },
  {
    id: "art-2", slug: "return-of-boucle",
    title: "The Return of Boucle: Why Texture is the New Neutral",
    excerpt: "Once the preserve of 1970s living rooms, boucle has staged a quiet but decisive comeback. We explore why, and how to use it.",
    coverImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=700&q=85",
    category: "Materials", publishedAt: "2026-03-05", readingTimeMin: 6,
    author: { fullName: "James Harlow" },
  },
  {
    id: "art-3", slug: "the-art-of-joinery",
    title: "The Art of Craft: Inside the Modulas Design Studio",
    excerpt: "A behind-the-scenes look at the traditional hand-cut joinery techniques used in every Modulas piece, passed down through generations.",
    coverImage: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=700&q=85",
    category: "Craftsmanship", publishedAt: "2026-03-10", readingTimeMin: 9,
    author: { fullName: "Thomas Webb" },
  },
  {
    id: "art-4", slug: "spring-styling-guide",
    title: "Spring Styling: Light, Texture, and Natural Tones",
    excerpt: "Our creative director shares five effortless ways to refresh your living space for the warmer months using materials and light.",
    coverImage: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=700",
    category: "Styling Guides", publishedAt: "2026-03-05", readingTimeMin: 5,
    author: { fullName: "James Harlow" },
  },
  {
    id: "art-5", slug: "small-space-solutions",
    title: "Small Space, Big Impact: Modular Furniture for Compact Living",
    excerpt: "How to make the most of every square metre with configurable, multi-functional furniture that adapts as your life changes.",
    coverImage: "https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=700",
    category: "Styling Guides", publishedAt: "2026-03-12", readingTimeMin: 6,
    author: { fullName: "Sophie Chen" },
  },
  {
    id: "art-6", slug: "oak-vs-walnut",
    title: "Oak vs. Walnut: Choosing the Right Hardwood for Your Home",
    excerpt: "Both are beautiful, both are durable — but they suit very different interiors. Our woodworkers break down the differences.",
    coverImage: "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=700&q=85",
    category: "Materials", publishedAt: "2026-03-01", readingTimeMin: 5,
    author: { fullName: "Thomas Webb" },
  },
  {
    id: "art-7", slug: "architect-spotlight-studio-sable",
    title: "Architect Spotlight: Studio Sablé's Approach to Considered Interiors",
    excerpt: "We visit Studio Sablo's Gurgaon studio to discuss their philosophy on furniture-first interior design in Indian homes.",
    coverImage: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=700&q=85",
    category: "Architects", publishedAt: "2026-02-20", readingTimeMin: 8,
    author: { fullName: "Eleanor Whitfield" },
  },
];

async function fetchArticles(): Promise<Article[]> {
  try {
    const res = await fetchWithTimeout(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"}/content/articles?limit=20`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) throw new Error("fetch failed");
    const data = await res.json();
    return data.articles ?? PLACEHOLDER_ARTICLES;
  } catch {
    return PLACEHOLDER_ARTICLES;
  }
}

function CategoryTag({ label }: { label: string }) {
  return (
    <span className="font-sans text-[10px] tracking-[0.12em] uppercase text-gold">
      {label}
    </span>
  );
}

function AuthorRow({ author, date, time }: { author: Article["author"]; date: string; time: number }) {
  const formatted = new Date(date).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
  const initials = author.fullName.split(" ").map((n) => n[0]).join("");
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 font-serif text-[10px] text-gold">
        {initials}
      </div>
      <span className="font-sans text-xs text-charcoal/40">{author.fullName}</span>
      <span className="font-sans text-xs text-charcoal/25">·</span>
      <span className="font-sans text-xs text-charcoal/40">{formatted}</span>
      <span className="font-sans text-xs text-charcoal/25">·</span>
      <span className="flex items-center gap-1 font-sans text-xs text-charcoal/40">
        <Clock className="h-3 w-3" /> {time} min
      </span>
    </div>
  );
}

function FeaturedCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/journal/${article.slug}`}
      className="group grid overflow-hidden rounded-2xl border border-black/6 bg-white dark:bg-charcoal-900 transition-shadow hover:shadow-luxury md:grid-cols-[1fr_420px]"
    >
      {/* Cover image */}
      <div className="aspect-[4/3] overflow-hidden bg-cream dark:bg-charcoal-800 md:aspect-auto">
        {article.coverImage ? (
          <img
            src={article.coverImage}
            alt={article.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center opacity-10">
            <div className="grid grid-cols-3 gap-2">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-10 w-10 rounded bg-charcoal" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center p-8 lg:p-10">
        <CategoryTag label={article.category} />
        <h2 className="mt-2 font-serif text-2xl text-charcoal dark:text-cream leading-snug group-hover:text-gold transition-colors lg:text-3xl">
          {article.title}
        </h2>
        <p className="mt-3 font-sans text-sm text-charcoal/50 dark:text-cream/50 leading-relaxed line-clamp-3">
          {article.excerpt}
        </p>
        <div className="mt-5">
          <AuthorRow author={article.author} date={article.publishedAt} time={article.readingTimeMin} />
        </div>
        <div className="mt-5 inline-flex items-center gap-1.5 font-sans text-[11px] tracking-[0.1em] uppercase text-charcoal/40 group-hover:text-gold transition-colors">
          Read article <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </Link>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/journal/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/6 bg-white dark:bg-charcoal-900 transition-shadow hover:shadow-luxury"
    >
      {/* Cover image */}
      <div className="aspect-[16/10] overflow-hidden bg-cream dark:bg-charcoal-800">
        {article.coverImage ? (
          <img
            src={article.coverImage}
            alt={article.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center opacity-10">
            <div className="grid grid-cols-4 gap-1">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-6 w-6 rounded bg-charcoal" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <CategoryTag label={article.category} />
        <h3 className="mt-2 font-serif text-lg text-charcoal dark:text-cream leading-snug group-hover:text-gold transition-colors">
          {article.title}
        </h3>
        <p className="mt-2 font-sans text-sm text-charcoal/50 dark:text-cream/50 leading-relaxed line-clamp-2">
          {article.excerpt}
        </p>
        <div className="mt-auto pt-4">
          <AuthorRow author={article.author} date={article.publishedAt} time={article.readingTimeMin} />
        </div>
      </div>
    </Link>
  );
}

export default async function JournalPage() {
  const articles = await fetchArticles();
  const [featured, ...rest] = articles;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-gold mb-3">Journal</p>
        <h1 className="font-serif text-4xl text-charcoal dark:text-cream lg:text-5xl">
          Design Stories
        </h1>
        <p className="mt-4 font-sans text-base text-charcoal/50 dark:text-cream/50 leading-relaxed">
          Inspiration, craftsmanship, and the ideas behind the pieces we make.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap justify-center">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={cat === "All" ? "/journal" : `/journal?category=${cat.toLowerCase().replace(/ /g, "-")}`}
            className="rounded-full border border-black/8 px-4 py-1.5 font-sans text-[11px] tracking-[0.08em] uppercase text-charcoal/50 hover:border-gold hover:text-gold transition-colors dark:border-white/8 dark:text-cream/50"
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Featured article */}
      {featured && <FeaturedCard article={featured} />}

      {/* Article grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {/* Load more */}
      <div className="flex justify-center pt-4">
        <button
          type="button"
          className="rounded-full border border-black/10 px-8 py-3 font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal/50 hover:border-gold hover:text-gold transition-colors dark:border-white/10 dark:text-cream/50"
        >
          Load more articles
        </button>
      </div>
    </div>
  );
}
