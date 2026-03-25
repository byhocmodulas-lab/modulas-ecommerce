import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils/format";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  coverImageUrl: string;
  coverImageAlt: string;
  author: {
    name: string;
    avatarUrl?: string;
  };
  publishedAt: string;
  readTimeMinutes: number;
}

interface BlogCardProps {
  post: BlogPost;
  variant?: "vertical" | "horizontal" | "featured";
  priority?: boolean;
}

/** Formats a date string as "12 Mar 2025" */
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function BlogCard({ post, variant = "vertical", priority = false }: BlogCardProps) {
  if (variant === "horizontal") {
    return <BlogCardHorizontal post={post} priority={priority} />;
  }
  if (variant === "featured") {
    return <BlogCardFeatured post={post} priority={priority} />;
  }
  return <BlogCardVertical post={post} priority={priority} />;
}

/* ── Vertical card (default grid card) ───────────────────────── */
function BlogCardVertical({ post, priority }: { post: BlogPost; priority: boolean }) {
  return (
    <article className="group flex flex-col">
      {/* Image */}
      <Link
        href={`/journal/${post.slug}`}
        className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-cream dark:bg-charcoal-800 mb-5"
        tabIndex={-1}
        aria-hidden
      >
        <Image
          src={post.coverImageUrl}
          alt={post.coverImageAlt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Category pill */}
        <span className="absolute top-4 left-4 inline-flex items-center rounded-full bg-gold px-3 py-1 font-sans text-[9px] tracking-[0.2em] uppercase text-charcoal-950">
          {post.category}
        </span>
      </Link>

      {/* Meta */}
      <div className="flex items-center gap-3 mb-3">
        {post.author.avatarUrl && (
          <div className="relative h-7 w-7 rounded-full overflow-hidden ring-1 ring-gold/30 shrink-0">
            <Image src={post.author.avatarUrl} alt={post.author.name} fill sizes="28px" className="object-cover" />
          </div>
        )}
        <span className="font-sans text-[11px] text-charcoal/50 dark:text-cream/50">
          {post.author.name}
        </span>
        <span className="font-sans text-[11px] text-charcoal/25 dark:text-cream/25">·</span>
        <span className="font-sans text-[11px] text-charcoal/50 dark:text-cream/50">
          {formatDate(post.publishedAt)}
        </span>
        <span className="ml-auto font-sans text-[11px] text-charcoal/35 dark:text-cream/35">
          {post.readTimeMinutes} min
        </span>
      </div>

      {/* Title */}
      <h3 className="font-serif text-xl text-charcoal dark:text-cream leading-snug mb-2">
        <Link
          href={`/journal/${post.slug}`}
          className="hover:text-gold transition-colors"
        >
          {post.title}
        </Link>
      </h3>

      {/* Excerpt */}
      <p className="font-sans text-sm text-charcoal/55 dark:text-cream/55 leading-relaxed line-clamp-2 mb-4">
        {post.excerpt}
      </p>

      {/* Read more */}
      <Link
        href={`/journal/${post.slug}`}
        className="mt-auto inline-flex items-center gap-1.5 font-sans text-[11px] tracking-[0.15em] uppercase text-gold hover:gap-3 transition-all duration-200"
      >
        Read Article
        <ArrowRightIcon />
      </Link>
    </article>
  );
}

/* ── Horizontal card ─────────────────────────────────────────── */
function BlogCardHorizontal({ post, priority }: { post: BlogPost; priority: boolean }) {
  return (
    <article className="group flex gap-5 sm:gap-7">
      {/* Image */}
      <Link
        href={`/journal/${post.slug}`}
        className="relative block w-36 sm:w-48 shrink-0 aspect-[3/4] overflow-hidden rounded-xl bg-cream dark:bg-charcoal-800"
        tabIndex={-1}
        aria-hidden
      >
        <Image
          src={post.coverImageUrl}
          alt={post.coverImageAlt}
          fill
          priority={priority}
          sizes="192px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-col justify-center min-w-0">
        <span className="mb-2 inline-block font-sans text-[9px] tracking-[0.25em] uppercase text-gold">
          {post.category}
        </span>
        <h3 className="font-serif text-lg sm:text-xl text-charcoal dark:text-cream leading-snug mb-2">
          <Link href={`/journal/${post.slug}`} className="hover:text-gold transition-colors line-clamp-2">
            {post.title}
          </Link>
        </h3>
        <p className="font-sans text-sm text-charcoal/50 dark:text-cream/50 leading-relaxed line-clamp-2 mb-3">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-2.5 text-charcoal/40 dark:text-cream/40">
          <span className="font-sans text-[11px]">{post.author.name}</span>
          <span className="font-sans text-[11px]">·</span>
          <span className="font-sans text-[11px]">{formatDate(post.publishedAt)}</span>
          <span className="font-sans text-[11px]">· {post.readTimeMinutes} min</span>
        </div>
      </div>
    </article>
  );
}

/* ── Featured card (large editorial hero card) ───────────────── */
function BlogCardFeatured({ post, priority }: { post: BlogPost; priority: boolean }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl aspect-[16/9] md:aspect-[21/9] bg-charcoal-900">
      {/* Background image */}
      <Image
        src={post.coverImageUrl}
        alt={post.coverImageAlt}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-103"
      />

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/80 via-charcoal-950/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 p-7 md:p-10 max-w-xl">
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-gold px-3 py-1 font-sans text-[9px] tracking-[0.2em] uppercase text-charcoal-950">
            {post.category}
          </span>
          <span className="font-sans text-[11px] text-cream/50">{post.readTimeMinutes} min read</span>
        </div>
        <h2 className="font-serif text-2xl md:text-display-sm text-cream leading-snug mb-3 group-hover:text-gold transition-colors">
          <Link href={`/journal/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="font-sans text-sm text-cream/60 leading-relaxed line-clamp-2 mb-5 hidden sm:block">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-4">
          {post.author.avatarUrl && (
            <div className="relative h-8 w-8 rounded-full overflow-hidden ring-1 ring-gold/40 shrink-0">
              <Image src={post.author.avatarUrl} alt={post.author.name} fill sizes="32px" className="object-cover" />
            </div>
          )}
          <div>
            <p className="font-sans text-[12px] text-cream/80">{post.author.name}</p>
            <p className="font-sans text-[11px] text-cream/40">{formatDate(post.publishedAt)}</p>
          </div>
          <Link
            href={`/journal/${post.slug}`}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-cream/30 px-5 py-2 font-sans text-[11px] tracking-[0.12em] uppercase text-cream hover:border-gold hover:text-gold transition-colors"
          >
            Read
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ── Blog card grid helper ────────────────────────────────────── */
interface BlogCardGridProps {
  posts: BlogPost[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function BlogCardGrid({ posts, columns = 3, className }: BlogCardGridProps) {
  const colClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <div className={cn("grid gap-8 lg:gap-10", colClass, className)}>
      {posts.map((post, i) => (
        <BlogCard key={post.slug} post={post} priority={i < 3} />
      ))}
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
