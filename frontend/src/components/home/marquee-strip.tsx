/* Continuously scrolling brand-value strip */

const DEFAULT_ITEMS = [
  "Bespoke Furniture · Elevated Interiors",
  "Modular by Design",
  "Fully Customised Solutions",
  "Premium Materials & Finishes",
  "White-Glove Delivery",
  "Made to Order",
  "850+ Projects Completed",
  "98% Client Satisfaction",
];

export function MarqueeStrip({ items = DEFAULT_ITEMS }: { items?: string[] }) {
  const doubled = [...items, ...items];

  return (
    <div
      className="overflow-hidden border-y border-black/6 dark:border-white/6 bg-cream dark:bg-charcoal-900 py-4"
      aria-hidden
    >
      <div className="flex w-max animate-[marquee_42s_linear_infinite] hover:[animation-play-state:paused]">
        {doubled.map((text, i) => (
          <span
            key={i}
            className="flex items-center gap-10 px-10 font-sans text-[10px] tracking-[0.32em] uppercase text-charcoal/38 dark:text-cream/38 whitespace-nowrap"
          >
            {text}
            <Diamond />
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[marquee_42s_linear_infinite\\] { animation: none; }
        }
      `}</style>
    </div>
  );
}

function Diamond() {
  return (
    <svg
      width="5" height="5" viewBox="0 0 10 10"
      fill="currentColor"
      className="text-gold/55 shrink-0 rotate-45"
    >
      <rect width="10" height="10" />
    </svg>
  );
}
