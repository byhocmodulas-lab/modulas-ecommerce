import type { CategoryFAQItem } from "@/lib/config/categories";

interface CategoryFAQProps {
  items: CategoryFAQItem[];
  categoryName: string;
  categoryUrl: string;
}

export function CategoryFAQ({ items, categoryName, categoryUrl }: CategoryFAQProps) {
  if (items.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="bg-cream dark:bg-charcoal-900 py-16 px-6 lg:px-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="mx-auto max-w-[1440px]">
        <div className="mb-10">
          <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-gold mb-2">
            Frequently Asked
          </p>
          <h2 className="font-serif text-3xl text-charcoal dark:text-cream">
            Questions about {categoryName}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-x-16 gap-y-0">
          {items.map((item, i) => (
            <details
              key={i}
              className="group border-b border-black/8 dark:border-white/8 py-5 open:pb-6"
            >
              <summary className="flex cursor-pointer items-start justify-between gap-4 list-none">
                <span className="font-sans text-sm font-medium text-charcoal dark:text-cream leading-snug pr-4">
                  {item.question}
                </span>
                <span
                  className="mt-0.5 shrink-0 text-charcoal/30 dark:text-cream/30 transition-transform duration-200 group-open:rotate-45"
                  aria-hidden
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 font-sans text-sm leading-relaxed text-charcoal/55 dark:text-cream/55">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
