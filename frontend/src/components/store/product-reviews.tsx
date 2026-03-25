"use client";

import { useState } from "react";

interface Review {
  id:       string;
  author:   string;
  date:     string;
  rating:   number;
  title:    string;
  body:     string;
  verified: boolean;
  helpful:  number;
  size?:    string;
  finish?:  string;
}

interface Props {
  productName:  string;
  overallRating: number;
  reviewCount:  number;
  reviews?:     Review[];
}

const STAR_DIST = [
  { stars: 5, pct: 68 },
  { stars: 4, pct: 20 },
  { stars: 3, pct: 7  },
  { stars: 2, pct: 3  },
  { stars: 1, pct: 2  },
];

const SORT_OPTIONS = ["Most Recent", "Most Helpful", "Highest Rated", "Lowest Rated"];
const FILTER_TAGS  = ["All Reviews", "With Photos", "Verified Buyers", "5 Stars", "4 Stars", "3 Stars & Below"];

export function ProductReviews({ productName, overallRating, reviewCount, reviews = DEMO_REVIEWS }: Props) {
  const [sortBy,      setSortBy]      = useState("Most Recent");
  const [filterTag,   setFilterTag]   = useState("All Reviews");
  const [helpfulMap,  setHelpfulMap]  = useState<Record<string, boolean>>({});
  const [expanded,    setExpanded]    = useState<Record<string, boolean>>({});

  const displayed = reviews.slice(0, 6);

  return (
    <section id="reviews" className="bg-white dark:bg-charcoal-950 py-14 lg:py-20 border-t border-black/6 dark:border-white/6">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">

        {/* ── Section header ─────────────────────────────────────── */}
        <div className="mb-10">
          <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-gold mb-2">Customer Reviews</p>
          <h2 className="font-serif text-3xl text-charcoal dark:text-cream">Reviews</h2>
        </div>

        {/* ── Rating summary + write review ──────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10 mb-10 pb-10 border-b border-black/8 dark:border-white/8">

          {/* Left: overall + bar breakdown */}
          <div>
            <div className="flex items-end gap-4 mb-6">
              <span className="font-serif text-6xl text-charcoal dark:text-cream leading-none">{overallRating}</span>
              <div className="pb-1">
                <StarRow rating={overallRating} size={16} />
                <p className="font-sans text-[11px] text-charcoal/40 dark:text-cream/40 mt-1">
                  Based on {reviewCount} reviews
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {STAR_DIST.map(({ stars, pct }) => (
                <div key={stars} className="flex items-center gap-3">
                  <span className="font-sans text-[11px] text-charcoal/50 dark:text-cream/50 w-8 shrink-0">
                    {stars}★
                  </span>
                  <div className="flex-1 h-1.5 bg-black/8 dark:bg-white/8">
                    <div
                      className="h-full bg-gold transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="font-sans text-[11px] text-charcoal/40 dark:text-cream/40 w-8 text-right shrink-0">
                    {pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: write a review CTA */}
          <div className="flex flex-col justify-center items-start lg:items-end gap-3">
            <p className="font-serif text-xl text-charcoal dark:text-cream">
              Share your experience with the {productName}
            </p>
            <p className="font-sans text-[13px] text-charcoal/50 dark:text-cream/50 max-w-sm lg:text-right">
              Your feedback helps other customers make confident decisions and helps us craft better pieces.
            </p>
            <button
              type="button"
              className="mt-2 h-11 px-8 border border-charcoal dark:border-cream font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal dark:text-cream hover:bg-charcoal hover:text-cream dark:hover:bg-cream dark:hover:text-charcoal-950 transition-colors duration-200"
            >
              Write a Review
            </button>
          </div>
        </div>

        {/* ── Filter chips + sort ──────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {FILTER_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setFilterTag(tag)}
                className={
                  filterTag === tag
                    ? "h-8 px-4 bg-charcoal-950 dark:bg-cream font-sans text-[10px] tracking-[0.15em] uppercase text-cream dark:text-charcoal-950"
                    : "h-8 px-4 border border-black/12 dark:border-white/12 font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal/55 dark:text-cream/55 hover:border-charcoal dark:hover:border-cream transition-colors"
                }
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="font-sans text-[11px] text-charcoal/40 dark:text-cream/40">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-8 border border-black/12 dark:border-white/12 bg-white dark:bg-charcoal-950 font-sans text-[11px] text-charcoal dark:text-cream px-3 outline-none"
            >
              {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>

        {/* ── Reviews list ──────────────────────────────────────────── */}
        <div className="divide-y divide-black/6 dark:divide-white/6">
          {displayed.map((review) => {
            const isExpanded = expanded[review.id];
            const bodyShort  = review.body.length > 280;
            return (
              <article key={review.id} className="py-8">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    {/* Avatar initial */}
                    <div className="h-9 w-9 bg-charcoal-950 dark:bg-cream flex items-center justify-center shrink-0">
                      <span className="font-serif text-[14px] text-cream dark:text-charcoal-950">
                        {review.author[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-sans text-[13px] text-charcoal dark:text-cream">{review.author}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {review.verified && (
                          <span className="font-sans text-[9px] tracking-[0.15em] uppercase text-gold">Verified Buyer</span>
                        )}
                        <span className="font-sans text-[10px] text-charcoal/30 dark:text-cream/30">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <StarRow rating={review.rating} size={12} />
                </div>

                {review.title && (
                  <h3 className="font-serif text-[1rem] text-charcoal dark:text-cream mb-2">{review.title}</h3>
                )}

                <p className="font-sans text-[13px] leading-relaxed text-charcoal/65 dark:text-cream/65">
                  {isExpanded || !bodyShort ? review.body : `${review.body.slice(0, 280)}…`}
                </p>

                {bodyShort && (
                  <button
                    type="button"
                    onClick={() => setExpanded((s) => ({ ...s, [review.id]: !s[review.id] }))}
                    className="mt-2 font-sans text-[11px] tracking-[0.1em] uppercase text-charcoal/40 dark:text-cream/40 hover:text-gold transition-colors"
                  >
                    {isExpanded ? "Show Less" : "Read More"}
                  </button>
                )}

                {/* Config details + helpful */}
                <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                  <div className="flex flex-wrap gap-3">
                    {review.size && (
                      <span className="font-sans text-[10px] text-charcoal/35 dark:text-cream/35">
                        Size: <span className="text-charcoal/55 dark:text-cream/55">{review.size}</span>
                      </span>
                    )}
                    {review.finish && (
                      <span className="font-sans text-[10px] text-charcoal/35 dark:text-cream/35">
                        Finish: <span className="text-charcoal/55 dark:text-cream/55">{review.finish}</span>
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setHelpfulMap((m) => ({ ...m, [review.id]: !m[review.id] }))}
                    className="flex items-center gap-1.5 font-sans text-[10px] tracking-[0.12em] uppercase text-charcoal/35 dark:text-cream/35 hover:text-gold transition-colors"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill={helpfulMap[review.id] ? "#c9a96e" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                    </svg>
                    Helpful ({helpfulMap[review.id] ? review.helpful + 1 : review.helpful})
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Load more */}
        {reviews.length > 6 && (
          <div className="mt-8 text-center">
            <button
              type="button"
              className="h-11 px-10 border border-black/15 dark:border-white/15 font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal/60 dark:text-cream/60 hover:border-charcoal dark:hover:border-cream hover:text-charcoal dark:hover:text-cream transition-colors"
            >
              Load More Reviews
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function StarRow({ rating, size }: { rating: number; size: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i < Math.round(rating) ? "#c9a96e" : "none"} stroke="#c9a96e" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

const DEMO_REVIEWS: Review[] = [
  {
    id: "r1", author: "Priya Sharma", date: "March 2026", rating: 5,
    title: "Absolutely stunning — exceeded every expectation",
    body: "We ordered the Arc Sofa in Oatmeal Boucle for our living room and it has completely transformed the space. The craftsmanship is extraordinary — you can feel the quality the moment you sit down. The springs have a beautiful give, the fabric is luxuriously soft, and the proportions are perfect for our 14×18ft room. Delivery was white-glove all the way, the team assembled it in under 30 minutes and took every bit of packaging. Couldn't recommend Modulas more highly.",
    verified: true, helpful: 24, size: "3-Seater", finish: "Oatmeal",
  },
  {
    id: "r2", author: "Rohan Kapoor", date: "February 2026", rating: 5,
    title: "Worth every rupee",
    body: "After visiting three showrooms and spending months deliberating, we chose Modulas for our modular kitchen and the master bedroom wardrobe. The difference in quality versus every other option at this price point is night and day. The hinges, the soft-close drawers, the finish on the cabinetry — everything is flawless. Our designer Rohan was incredibly patient and thorough. We've now ordered a dining table too.",
    verified: true, helpful: 18, finish: "Smoked Oak",
  },
  {
    id: "r3", author: "Ananya Mehta", date: "January 2026", rating: 4,
    title: "Beautiful piece, slight delivery delay",
    body: "The Linen Club Chair is gorgeous — exactly what I imagined from the website. The Belgian linen has a beautiful texture and the chair is incredibly comfortable for reading. I'm docking one star only because delivery took 3 days longer than the lead time quoted. The team was communicative about the delay and apologetic, and the end result is worth the wait.",
    verified: true, helpful: 11, size: "Standard", finish: "Oatmeal",
  },
  {
    id: "r4", author: "Vikram Singh", date: "December 2025", rating: 5,
    title: "Second purchase — same exceptional quality",
    body: "Bought the Slate Dining Table 18 months ago and it still looks brand new. Just ordered the matching sideboard. Modulas is the only furniture brand I recommend to friends without hesitation. The 25-year guarantee gives total peace of mind.",
    verified: true, helpful: 9,
  },
  {
    id: "r5", author: "Divya Nair", date: "November 2025", rating: 5,
    title: "Transformed our home",
    body: "The 3D configurator made it so easy to visualise exactly how the sofa would look in our space before ordering. The AR feature in the app is brilliant. Piece arrived perfectly, looks even better in person than on screen.",
    verified: false, helpful: 6, size: "Corner", finish: "Sage",
  },
  {
    id: "r6", author: "Amit Joshi", date: "October 2025", rating: 4,
    title: "Excellent quality, premium but fair pricing",
    body: "Coming from cheaper furniture that needed replacing every 3-4 years, investing in Modulas feels like the right long-term decision. The sofa is solid, beautifully proportioned, and the team was helpful throughout. Minor quibble: the assembly instructions could be clearer.",
    verified: true, helpful: 4, size: "2-Seater",
  },
];
