import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Materials & Finishes — Woods, Fabrics, Hardware | Modulas",
  description:
    "Explore every material and finish available across the Modulas range — sustainably sourced hardwoods, premium fabrics, hand-applied lacquers, and German hardware.",
};

const MATERIAL_GROUPS = [
  {
    category: "Wood Species",
    description:
      "All our solid wood is sourced from certified sustainable forests. Each species is kiln-dried for stability and hand-finished to bring out its natural character.",
    items: [
      {
        label: "Sheesham (Indian Rosewood)",
        body: "Rich grain, warm reddish-brown tones. Our most popular species. Highly durable, naturally oil-resistant.",
        tag: "Best Seller",
      },
      {
        label: "Teak",
        body: "The gold standard for outdoor and high-use furniture. Natural oils make it resistant to moisture and insects.",
        tag: "Premium",
      },
      {
        label: "Oak",
        body: "Light, clean grain with subtle figuring. Accepts stains beautifully — from blonde to deep espresso.",
        tag: "Versatile",
      },
      {
        label: "Walnut",
        body: "Dark, chocolatey grain with straight figure. The most luxurious of our standard species.",
        tag: "Luxury",
      },
      {
        label: "Mango Wood",
        body: "Sustainable by nature — mango trees are replanted after harvest. Distinctive grain with honey tones.",
        tag: "Sustainable",
      },
      {
        label: "Acacia",
        body: "Hard, dense, and beautifully figured. Natural colour variation from blonde to amber makes every piece unique.",
        tag: "Unique Grain",
      },
    ],
  },
  {
    category: "Upholstery Fabrics",
    description:
      "All fabrics are independently tested to minimum 30,000 Martindale rub cycles. Our premium and performance ranges exceed 50,000.",
    items: [
      {
        label: "Belgian Linen",
        body: "Natural, breathable, and beautifully textured. Ages gracefully. Available in 24 colours.",
        tag: "Natural",
      },
      {
        label: "Boucle",
        body: "The texture of the moment — looped yarn creates a soft, tactile surface that photographs beautifully.",
        tag: "Trending",
      },
      {
        label: "Performance Velvet",
        body: "Stain-resistant, fade-proof velvet for high-use family rooms. Wipes clean. 50,000 rubs tested.",
        tag: "Family Safe",
      },
      {
        label: "Cotton Canvas",
        body: "Crisp, clean, and durable. A workhorse fabric that softens beautifully with use.",
        tag: "Classic",
      },
      {
        label: "Outdoor Performance",
        body: "UV-stable, water-repellent, and mould-resistant. For balcony, terrace, and poolside furniture.",
        tag: "Outdoor",
      },
      {
        label: "Wool Blend",
        body: "Warm, rich, and naturally fire-resistant. Ideal for bedroom upholstery and headboards.",
        tag: "Cosy",
      },
    ],
  },
  {
    category: "Leathers",
    description:
      "We work with tanneries that use vegetable-based dyes and ethical sourcing practices. Every hide is graded before selection.",
    items: [
      {
        label: "Full-Grain Leather",
        body: "The highest quality — natural surface intact, no sanding or buffing. Develops a beautiful patina over time.",
        tag: "Premium",
      },
      {
        label: "Top-Grain Leather",
        body: "Lightly buffed for a consistent surface. More uniform look. Highly durable and easy to maintain.",
        tag: "Popular",
      },
      {
        label: "Aniline Leather",
        body: "Dyed through with no surface coating — the most natural look and feel. Shows character marks beautifully.",
        tag: "Natural",
      },
      {
        label: "Semi-Aniline",
        body: "Light protective coating over aniline dyeing. Retains natural look with added stain resistance.",
        tag: "Balanced",
      },
    ],
  },
  {
    category: "Lacquers & Finishes",
    description:
      "Hand-applied in our workshop. Water-based lacquers — no harmful VOCs. Multiple coats, hand-sanded between each application.",
    items: [
      {
        label: "Natural Oiled",
        body: "Penetrating oil enhances the wood's natural grain and colour. Re-oilable at home to maintain the finish.",
        tag: "Most Natural",
      },
      {
        label: "Matt Lacquer",
        body: "Low-sheen protective coating. Clean and contemporary. Hardwearing surface for kitchens and high-use pieces.",
        tag: "Kitchen Favourite",
      },
      {
        label: "Satin Lacquer",
        body: "Soft sheen that catches light subtly. The most popular finish across our furniture range.",
        tag: "Best Seller",
      },
      {
        label: "High Gloss",
        body: "Mirror finish for a bold, contemporary statement. Applied in 5 coats with polishing between each.",
        tag: "Statement",
      },
      {
        label: "Chalk Paint",
        body: "Matte, velvety finish with a slightly chalky texture. Available in 40 colours.",
        tag: "Colourful",
      },
      {
        label: "Ebonised",
        body: "Black-stained finish that allows wood grain to show through. Dramatic and luxurious.",
        tag: "Dramatic",
      },
    ],
  },
  {
    category: "Hardware",
    description:
      "We use Blum and Hettich hardware exclusively — the German engineering standard for kitchen and wardrobe fittings.",
    items: [
      {
        label: "Blum LEGRABOX",
        body: "Silent close drawers with full-extension and integrated push-to-open. The benchmark for drawer systems.",
        tag: "German Engineered",
      },
      {
        label: "Hettich Innotech",
        body: "Soft-close inner drawer systems. Rated for 30kg load. 15-year manufacturer warranty.",
        tag: "Wardrobe",
      },
      {
        label: "Blum AVENTOS",
        body: "Lift-up cabinet door systems for upper kitchen cabinets. Spring-loaded counterbalance.",
        tag: "Kitchen",
      },
      {
        label: "Concealed Hinges",
        body: "110° and 165° soft-close hinges. Adjustable in 3 planes for perfect door alignment.",
        tag: "Universal",
      },
    ],
  },
];

export default function MaterialsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-charcoal-950 py-32 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-3 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">
            Materials & Finishes
          </p>
          <h1 className="font-serif text-5xl text-cream md:text-7xl mb-6 max-w-3xl leading-tight">
            What your furniture is made of.
          </h1>
          <p className="font-sans text-[16px] text-cream/50 max-w-xl leading-relaxed">
            Every material we use is selected for quality, sustainability, and longevity.
            No compromises. No particle board. No veneers where solid wood should be.
          </p>
        </div>
      </section>

      {/* Material groups */}
      {MATERIAL_GROUPS.map((group, gi) => (
        <section
          key={group.category}
          className={`py-20 px-6 lg:px-12 ${gi % 2 === 0 ? "bg-white" : "bg-cream"}`}
        >
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-10 max-w-2xl">
              <p className="mb-2 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">
                {group.category}
              </p>
              <p className="font-sans text-[14px] text-charcoal/55 leading-relaxed">
                {group.description}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.items.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl bg-white border border-black/6 p-6"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-serif text-lg text-charcoal leading-tight">
                      {item.label}
                    </h3>
                    <span className="shrink-0 rounded-full bg-gold/10 px-2.5 py-1 font-sans text-[9px] tracking-[0.15em] uppercase text-gold">
                      {item.tag}
                    </span>
                  </div>
                  <p className="font-sans text-[13px] text-charcoal/50 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Samples CTA */}
      <section className="bg-charcoal-950 py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px] grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="mb-3 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">
              Sample Box
            </p>
            <h2 className="font-serif text-4xl text-cream mb-5">
              See and feel before you decide.
            </h2>
            <p className="font-sans text-[15px] text-cream/50 leading-relaxed mb-8">
              We send physical samples of woods, fabrics, and finishes to your home — free of charge.
              Touch them. See them in your light. Choose with confidence.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/book-consultation"
                className="rounded-full bg-gold px-8 py-4 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
              >
                Request Sample Box
              </Link>
              <Link
                href="/custom-furniture"
                className="rounded-full border border-cream/20 px-8 py-4 font-sans text-[12px] tracking-[0.15em] uppercase text-cream/60 hover:border-cream hover:text-cream transition-colors"
              >
                Custom Furniture
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img
                src="https://images.pexels.com/photos/129733/pexels-photo-129733.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Wood samples"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden mt-6">
              <img
                src="https://images.pexels.com/photos/4352247/pexels-photo-4352247.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Fabric samples"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
