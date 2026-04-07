import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchWithTimeout } from "@/lib/utils/fetch-with-timeout";

/* ── Types ──────────────────────────────────────────────────────────── */

interface Author {
  fullName:   string;
  avatarUrl:  string;
  role?:      string;
}

interface ArticleBlock {
  type:    "paragraph" | "heading" | "quote" | "image";
  content: string;
  caption?: string;
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
  author:         Author;
  tags?:          string[];
  body?:          ArticleBlock[];
  bodyHtml?:      string;
}

interface RelatedArticle {
  id:             string;
  slug:           string;
  title:          string;
  excerpt:        string;
  coverImage:     string;
  category:       string;
  readingTimeMin: number;
}

/* ── Placeholder data ───────────────────────────────────────────────── */

const PLACEHOLDER_ARTICLES: Article[] = [
  {
    id:             "art-1",
    slug:           "designing-for-longevity",
    title:          "Designing for Longevity: Why Heirloom Furniture Matters",
    excerpt:        "In an age of disposable design, we explore why investing in pieces built to last is better for your home, your wallet, and the planet.",
    coverImage:     "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=85",
    category:       "Design Philosophy",
    publishedAt:    "2026-02-28",
    readingTimeMin: 7,
    author:         { fullName: "Eleanor Whitfield", avatarUrl: "", role: "Creative Director" },
    tags:           ["sustainability", "craftsmanship", "heirloom"],
    body: [
      { type: "paragraph",  content: "There is something quietly radical about buying a piece of furniture you intend to pass on. In a culture that optimises for speed — fast delivery, fast trends, fast obsolescence — the decision to invest in an object that will outlast you is almost an act of defiance." },
      { type: "heading",    content: "The Cost of Cheap" },
      { type: "paragraph",  content: "The economics of disposable furniture are deceptive. A ₹15,000 sofa feels like a bargain until you replace it four times in a decade. The true cost — financial, environmental, emotional — is rarely calculated at the point of purchase." },
      { type: "quote",      content: "The most sustainable piece of furniture is the one you never have to replace." },
      { type: "paragraph",  content: "At Modulas, we build to a different standard. Every joint is designed to be repaired, not discarded. Every material is selected for how it ages, not just how it photographs. Sheesham deepens with use. Linen softens with washing. Marble gains character with time." },
      { type: "image",      content: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1200", caption: "Solid sheesham joinery in the Arc dining collection." },
      { type: "heading",    content: "What Longevity Looks Like" },
      { type: "paragraph",  content: "Heirloom furniture is not about formality or stiffness. It is about the confidence of an object that knows what it is. A well-made sofa does not announce itself — it simply holds the room, season after season, decade after decade." },
      { type: "paragraph",  content: "The pieces in our Modern Living and Luxury Residence collections are designed with this in mind. Forms that will not date. Materials that improve. Construction that can be serviced rather than discarded." },
    ],
  },
  {
    id:             "art-2",
    slug:           "spring-styling-guide",
    title:          "Spring Styling: Light, Texture, and Natural Tones",
    excerpt:        "Our creative director shares five effortless ways to refresh your living space for the warmer months.",
    coverImage:     "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=1600",
    category:       "Styling Guides",
    publishedAt:    "2026-03-05",
    readingTimeMin: 5,
    author:         { fullName: "James Harlow", avatarUrl: "", role: "Senior Stylist" },
    tags:           ["styling", "spring", "interiors"],
    body: [
      { type: "paragraph",  content: "As the light shifts and the days lengthen, there is a natural instinct to refresh the spaces we live in. Spring styling does not require a renovation — it requires attention to light, texture, and the small objects that carry meaning." },
      { type: "heading",    content: "Let Light Lead" },
      { type: "paragraph",  content: "The first move in any spring refresh is to consider how light moves through the room across the day. A sofa facing east catches the morning; a dining table near a south window will hold warmth through the afternoon. Work with your light before you add anything." },
      { type: "quote",      content: "Light is not decoration. It is the material that makes all other materials visible." },
      { type: "heading",    content: "Texture Over Pattern" },
      { type: "paragraph",  content: "Spring styling responds best to natural texture — linen throws, cane chairs, bare oak. These surfaces catch raking light beautifully and create depth without visual noise. Resist the urge to introduce pattern; instead, layer textures in the same tonal family." },
    ],
  },
  {
    id:             "art-3",
    slug:           "the-art-of-joinery",
    title:          "The Art of Craft: Inside the Modulas Design Studio",
    excerpt:        "A behind-the-scenes look at the traditional hand-cut joinery techniques used in every Modulas piece.",
    coverImage:     "https://images.pexels.com/photos/3214064/pexels-photo-3214064.jpeg?auto=compress&cs=tinysrgb&w=1600",
    category:       "Craftsmanship",
    publishedAt:    "2026-03-10",
    readingTimeMin: 9,
    author:         { fullName: "Thomas Webb", avatarUrl: "", role: "Head of Production" },
    tags:           ["craftsmanship", "joinery", "process"],
    body: [
      { type: "paragraph",  content: "In the Modulas workshop in Rajasthan, the day begins before sunrise. The craftsmen who cut, plane, and join our furniture have been trained in a tradition that predates industrial production — and they work with a precision that no machine has yet replicated." },
      { type: "heading",    content: "The Mortise and Tenon" },
      { type: "paragraph",  content: "The mortise and tenon is the foundational joint in fine furniture. It is what makes a table leg hold under load without fasteners, what makes a frame square after a decade of use. At Modulas, every joint is hand-fitted and glued — no screws, no dowels." },
      { type: "quote",      content: "A joint that cannot be seen is the signature of a craftsman who cares about the piece after it leaves his hands." },
      { type: "image",      content: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=85", caption: "Hand-fitting a mortise-and-tenon joint in the Arc dining table base." },
      { type: "heading",    content: "From Sketch to Studio" },
      { type: "paragraph",  content: "Every piece in the Modulas collection begins as a sketch drawn by our design team in conversation with the craftsmen who will build it. This dialogue — between what a designer imagines and what a craftsman can execute — is where our furniture finds its form." },
    ],
  },
  {
    id:             "art-4",
    slug:           "small-space-solutions",
    title:          "Small Space, Big Impact: Modular Furniture for Compact Living",
    excerpt:        "How to make the most of every square metre with configurable, multi-functional furniture.",
    coverImage:     "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1600",
    category:       "Styling Guides",
    publishedAt:    "2026-03-12",
    readingTimeMin: 6,
    author:         { fullName: "Sophie Chen", avatarUrl: "", role: "Interior Consultant" },
    tags:           ["compact living", "modular", "small spaces"],
    body: [
      { type: "paragraph",  content: "The 1 and 2 BHK apartment is where most urban Indians live. Not a constraint to work around — but a design challenge that rewards intelligence over scale. Small spaces reward precision, commitment, and furniture that earns its position." },
      { type: "heading",    content: "The Multi-Purpose Imperative" },
      { type: "paragraph",  content: "In a compact home, every piece of furniture must justify its footprint. A dining table that seats two and extends to six. A sofa that configures as a daybed. Storage that doubles as a room divider. These are not compromises — they are design decisions." },
      { type: "quote",      content: "The question is never how much space you have. It is how well you use the space you have." },
      { type: "heading",    content: "Storage as Architecture" },
      { type: "paragraph",  content: "Floor-to-ceiling storage is the single most impactful intervention in a small home. It draws the eye upward, creates apparent volume, and resolves the clutter that makes small spaces feel smaller. Our modular wardrobe and kitchen systems are designed to fit any wall." },
    ],
  },
];

const PLACEHOLDER_RELATED: RelatedArticle[] = [
  {
    id: "art-2", slug: "spring-styling-guide",
    title: "Spring Styling: Light, Texture, and Natural Tones",
    excerpt: "Five effortless ways to refresh your living space for the warmer months.",
    coverImage: "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Styling Guides", readingTimeMin: 5,
  },
  {
    id: "art-3", slug: "the-art-of-joinery",
    title: "The Art of Craft: Inside the Modulas Design Studio",
    excerpt: "Behind-the-scenes at the traditional hand-cut joinery workshop.",
    coverImage: "https://images.pexels.com/photos/3214064/pexels-photo-3214064.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Craftsmanship", readingTimeMin: 9,
  },
  {
    id: "art-4", slug: "small-space-solutions",
    title: "Small Space, Big Impact: Modular Furniture",
    excerpt: "Make the most of every square metre with configurable furniture.",
    coverImage: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Styling Guides", readingTimeMin: 6,
  },
];

/* ── Data fetch ──────────────────────────────────────────────────────── */

async function fetchArticle(slug: string): Promise<Article | null> {
  try {
    const res = await fetchWithTimeout(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"}/cms/articles/${slug}`,
      { next: { revalidate: 60, tags: [`article-${slug}`] } },
    );
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("fetch failed");
    return await res.json() as Article;
  } catch {
    return PLACEHOLDER_ARTICLES.find((a) => a.slug === slug) ?? null;
  }
}

async function fetchRelated(slug: string, category: string): Promise<RelatedArticle[]> {
  try {
    const res = await fetchWithTimeout(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"}/cms/articles/related?slug=${slug}&category=${encodeURIComponent(category)}&limit=3`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) throw new Error("fetch failed");
    const data = await res.json();
    return data.data ?? data.articles ?? [];
  } catch {
    return PLACEHOLDER_RELATED.filter((a) => a.slug !== slug).slice(0, 3);
  }
}

/* ── Metadata ────────────────────────────────────────────────────────── */

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticle(slug);
  if (!article) return { title: "Article Not Found" };
  const canonicalUrl = `https://modulas.in/blog/${article.slug}`;
  return {
    title:       `${article.title} — Modulas Journal`,
    description: article.excerpt,
    keywords:    article.tags,
    alternates:  { canonical: canonicalUrl },
    openGraph: {
      title:         article.title,
      description:   article.excerpt,
      type:          "article",
      publishedTime: article.publishedAt,
      authors:       [article.author.fullName],
      tags:          article.tags,
      images:        article.coverImage ? [{ url: article.coverImage, width: 1200, height: 630, alt: article.title }] : [],
      url:           canonicalUrl,
    },
    twitter: {
      card:        "summary_large_image",
      title:       article.title,
      description: article.excerpt,
      images:      article.coverImage ? [article.coverImage] : [],
    },
  };
}

/* ── Page ────────────────────────────────────────────────────────────── */

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const [article, related] = await Promise.all([
    fetchArticle(slug),
    fetchArticle(slug).then((a) => a ? fetchRelated(slug, a.category) : []),
  ]);

  if (!article) notFound();

  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    day:   "numeric",
    month: "long",
    year:  "numeric",
  }).format(new Date(article.publishedAt));

  /* JSON-LD */
  const articleUrl = `https://modulas.in/blog/${article.slug}`;
  const jsonLd = {
    "@context":        "https://schema.org",
    "@type":           "Article",
    headline:          article.title,
    description:       article.excerpt,
    image:             article.coverImage,
    datePublished:     article.publishedAt,
    dateModified:      article.publishedAt,
    mainEntityOfPage:  { "@type": "WebPage", "@id": articleUrl },
    url:               articleUrl,
    keywords:          article.tags?.join(", "),
    articleSection:    article.category,
    inLanguage:        "en-IN",
    author: {
      "@type": "Person",
      name:    article.author.fullName,
      jobTitle: article.author.role,
    },
    publisher: {
      "@type": "Organization",
      name:    "Modulas",
      url:     "https://modulas.in",
      logo: {
        "@type": "ImageObject",
        url:     "https://modulas.in/logo-full-dark.png",
        width:   200,
        height:  60,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-charcoal-950 min-h-[65vh] flex items-end">
        {article.coverImage && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={article.coverImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/50 to-charcoal-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/60 to-transparent" />

        <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-12 pb-16 pt-32 w-full">

          {/* Breadcrumb */}
          <nav
            className="mb-6 flex items-center gap-2 font-sans text-[11px] tracking-[0.2em] uppercase text-cream/25"
            aria-label="Breadcrumb"
          >
            <Link href="/blog" className="hover:text-gold transition-colors">Journal</Link>
            <span aria-hidden="true">/</span>
            <span className="text-cream/45">{article.category}</span>
          </nav>

          {/* Category pill */}
          <p className="mb-4 font-sans text-[10px] tracking-[0.35em] uppercase text-gold">
            {article.category}
          </p>

          {/* Title */}
          <h1 className="font-serif text-4xl text-cream leading-[1.1] md:text-6xl lg:text-7xl max-w-4xl mb-6">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="font-sans text-[15px] text-cream/50 max-w-xl leading-relaxed mb-10">
            {article.excerpt}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6">
            {/* Author */}
            <div className="flex items-center gap-3">
              {article.author.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={article.author.avatarUrl}
                  alt={article.author.fullName}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-gold/20 flex items-center justify-center">
                  <span className="font-serif text-sm text-gold">
                    {article.author.fullName.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <p className="font-sans text-[12px] text-cream/70">{article.author.fullName}</p>
                {article.author.role && (
                  <p className="font-sans text-[10px] text-cream/30">{article.author.role}</p>
                )}
              </div>
            </div>

            <div className="h-4 w-px bg-white/12" aria-hidden="true" />

            <p className="font-sans text-[11px] text-cream/35">{formattedDate}</p>

            <div className="h-4 w-px bg-white/12" aria-hidden="true" />

            <p className="font-sans text-[11px] text-cream/35">{article.readingTimeMin} min read</p>
          </div>
        </div>
      </section>

      {/* ── Article body ─────────────────────────────────────────── */}
      <div className="bg-white dark:bg-charcoal-950 py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_320px] gap-16 xl:gap-24">

            {/* Main content */}
            <article aria-label={article.title}>
              {article.bodyHtml ? (
                <div
                  className="prose-modulas"
                  dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
                />
              ) : article.body ? (
                <ArticleBody blocks={article.body} />
              ) : (
                <p className="font-sans text-[15px] text-charcoal/60 dark:text-cream/60 leading-relaxed">
                  {article.excerpt}
                </p>
              )}

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-14 pt-8 border-t border-black/8 dark:border-white/8">
                  <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-charcoal/30 dark:text-cream/30 mb-4">
                    Topics
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog?tag=${encodeURIComponent(tag)}`}
                        className="border border-black/12 dark:border-white/12 px-3 py-1.5 font-sans text-[10px] tracking-[0.1em] uppercase text-charcoal/50 dark:text-cream/50 hover:border-gold hover:text-gold transition-colors duration-200"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Author card */}
              <div className="mt-14 bg-cream dark:bg-charcoal-900 p-8 flex gap-6 items-start">
                {article.author.avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={article.author.avatarUrl}
                    alt={article.author.fullName}
                    className="h-14 w-14 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                    <span className="font-serif text-xl text-gold">
                      {article.author.fullName.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-1">
                    Written by
                  </p>
                  <p className="font-serif text-lg text-charcoal dark:text-cream">
                    {article.author.fullName}
                  </p>
                  {article.author.role && (
                    <p className="font-sans text-[12px] text-charcoal/45 dark:text-cream/45 mt-0.5">
                      {article.author.role}, Modulas
                    </p>
                  )}
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block space-y-10">
              {/* Back to journal */}
              <div>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal/35 dark:text-cream/35 hover:text-gold transition-colors duration-200"
                >
                  <ArrowLeftIcon />
                  All articles
                </Link>
              </div>

              {/* Sticky reading marker — visual only */}
              <div className="sticky top-28 space-y-8">

                {/* Article details */}
                <div className="space-y-5 border-l-2 border-gold/30 pl-5">
                  <div>
                    <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-charcoal/30 dark:text-cream/30 mb-1">
                      Category
                    </p>
                    <p className="font-sans text-[13px] text-charcoal dark:text-cream">{article.category}</p>
                  </div>
                  <div>
                    <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-charcoal/30 dark:text-cream/30 mb-1">
                      Published
                    </p>
                    <p className="font-sans text-[13px] text-charcoal dark:text-cream">{formattedDate}</p>
                  </div>
                  <div>
                    <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-charcoal/30 dark:text-cream/30 mb-1">
                      Reading time
                    </p>
                    <p className="font-sans text-[13px] text-charcoal dark:text-cream">
                      {article.readingTimeMin} min
                    </p>
                  </div>
                </div>

                {/* Explore CTA */}
                <div className="bg-charcoal-950 dark:bg-charcoal-900 p-6 space-y-4">
                  <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-gold">
                    Explore
                  </p>
                  <p className="font-serif text-lg text-cream leading-snug">
                    Find the pieces that inspired this story.
                  </p>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 bg-gold px-5 py-2.5 font-sans text-[10px] tracking-[0.18em] uppercase text-charcoal-950 hover:bg-cream transition-colors duration-200"
                  >
                    Shop the collection
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* ── Related articles ──────────────────────────────────────── */}
      {related.length > 0 && (
        <section
          className="bg-cream dark:bg-charcoal-900 py-20 lg:py-28"
          aria-labelledby="related-heading"
        >
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">

            <div className="mb-12 flex items-end justify-between">
              <div>
                <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold mb-3">
                  Continue Reading
                </p>
                <h2
                  id="related-heading"
                  className="font-serif text-4xl text-charcoal dark:text-cream"
                >
                  More from the Journal.
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden sm:inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.18em] uppercase text-charcoal/40 dark:text-cream/40 hover:text-gold transition-colors border-b border-black/10 dark:border-white/10 hover:border-gold pb-0.5"
              >
                All articles
                <ArrowRightIcon />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {related.map((rel) => (
                <RelatedCard key={rel.id} article={rel} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="bg-charcoal-950 py-16 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-2xl text-cream mb-1">
              Inspired by what you read?
            </h2>
            <p className="font-sans text-[13px] text-cream/40">
              Book a free consultation with a Modulas designer.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              href="/book-consultation"
              className="inline-flex h-11 items-center gap-2 bg-gold px-7 font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal-950 hover:bg-cream transition-colors"
            >
              Book Free Visit
            </Link>
            <Link
              href="/products"
              className="inline-flex h-11 items-center gap-2 border border-cream/15 px-7 font-sans text-[11px] tracking-[0.15em] uppercase text-cream/60 hover:border-cream hover:text-cream transition-colors"
            >
              Shop
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Article body renderer ───────────────────────────────────────────── */

function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="space-y-8">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p
                key={i}
                className="font-sans text-[16px] text-charcoal/70 dark:text-cream/65 leading-[1.85] tracking-[0.01em]"
              >
                {block.content}
              </p>
            );

          case "heading":
            return (
              <h2
                key={i}
                className="font-serif text-2xl text-charcoal dark:text-cream mt-12 mb-2 lg:text-3xl"
              >
                {block.content}
              </h2>
            );

          case "quote":
            return (
              <blockquote
                key={i}
                className="relative my-10 border-l-2 border-gold pl-8 py-2"
              >
                <p className="font-serif italic text-xl text-charcoal/55 dark:text-cream/50 leading-relaxed lg:text-2xl">
                  &ldquo;{block.content}&rdquo;
                </p>
              </blockquote>
            );

          case "image":
            return (
              <figure key={i} className="my-12">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={block.content}
                  alt={block.caption ?? ""}
                  className="w-full object-cover"
                />
                {block.caption && (
                  <figcaption className="mt-3 font-sans text-[11px] text-charcoal/35 dark:text-cream/35 tracking-[0.05em] italic">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

/* ── Related article card ────────────────────────────────────────────── */

function RelatedCard({ article }: { article: RelatedArticle }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex flex-col overflow-hidden"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-charcoal-800">
        {article.coverImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={article.coverImage}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="h-full w-full bg-charcoal-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/50 via-transparent to-transparent" />
        {/* Hover pill */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="inline-flex items-center gap-2 bg-white/90 dark:bg-charcoal-950/90 px-4 py-2 font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal dark:text-cream">
            Read article
          </span>
        </div>
      </div>

      <div className="pt-5 pb-3 flex flex-col gap-2">
        <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-gold">
          {article.category}
        </p>
        <h3 className="font-serif text-lg text-charcoal dark:text-cream leading-snug group-hover:text-gold transition-colors duration-200 line-clamp-2">
          {article.title}
        </h3>
        <p className="font-sans text-[12px] text-charcoal/40 dark:text-cream/40 leading-relaxed line-clamp-2">
          {article.excerpt}
        </p>
        <p className="font-sans text-[11px] text-charcoal/30 dark:text-cream/30 mt-1">
          {article.readingTimeMin} min read
        </p>
      </div>

      {/* Gold underline wipe */}
      <div className="h-px bg-black/6 dark:bg-white/6 overflow-hidden mt-auto">
        <div className="h-full w-0 bg-gold transition-all duration-500 group-hover:w-full" />
      </div>
    </Link>
  );
}

/* ── Icons ───────────────────────────────────────────────────────────── */

function ArrowRightIcon() {
  return (
    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}
