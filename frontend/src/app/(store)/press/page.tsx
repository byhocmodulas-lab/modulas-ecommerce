import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Press — Modulas",
  description:
    "Media coverage, press enquiries, and downloadable assets for Modulas — India's contemporary luxury furniture studio redefining bespoke interiors.",
};

const FEATURED_COVERAGE = [
  {
    publication: "Architectural Digest India",
    date: "February 2026",
    headline: "The Indian luxury furniture studio making bespoke interiors accessible",
    excerpt:
      "Modulas has achieved something rare in the Indian market: a fully bespoke furniture studio with a seamless digital configurator, architectural-grade precision, and a 98% client satisfaction record across 850+ projects.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=85",
    category: "Design Review",
  },
  {
    publication: "Elle Decor India",
    date: "December 2025",
    headline: "Why discerning Indian homeowners are choosing Modulas",
    excerpt:
      "In a market saturated with generic modular solutions, Modulas stands apart — offering fully customised furniture that begins with the client's vision and ends with a space that is unmistakably personal.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85",
    category: "Feature",
  },
  {
    publication: "Dezeen",
    date: "October 2025",
    headline: "Modulas launches real-time 3D furniture configurator for Indian homes",
    excerpt:
      "The Gurgaon-based luxury furniture studio has unveiled a browser-based 3D configurator that lets clients design bespoke pieces to the centimetre, choosing from premium material and finish options in real time.",
    image: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800&q=85",
    category: "Technology",
  },
];

const MORE_COVERAGE = [
  { publication: "Design Pataki",         date: "Sep 2025", headline: "10 Indian studios redefining luxury interiors" },
  { publication: "Architectural Digest",  date: "Jul 2025", headline: "30 Under 30: Design Innovators — India" },
  { publication: "Wallpaper* India",      date: "May 2025", headline: "The new names in Indian bespoke furniture" },
  { publication: "Condé Nast Traveller",  date: "Mar 2025", headline: "The most beautiful homes in Delhi-NCR" },
  { publication: "India Today Homes",     date: "Jan 2025", headline: "Best modular furniture studios 2025" },
  { publication: "Forbes India",          date: "Nov 2024", headline: "Luxury interior brands to watch in India" },
];

const AWARDS = [
  { award: "Best Luxury Furniture Studio",    year: "2025", body: "India Design Awards" },
  { award: "Innovation in Interior Design",   year: "2025", body: "Architectural Digest India Awards" },
  { award: "5+ Innovation Awards",            year: "2024", body: "Design Council of India" },
  { award: "Best Emerging Design Brand",      year: "2023", body: "Elle Decor India" },
];

export default function PressPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-black/6 py-24 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px] grid lg:grid-cols-2 gap-16 items-end">
          <div>
            <p className="mb-4 font-sans text-[11px] tracking-[0.35em] uppercase text-charcoal/40">Press & Media</p>
            <h1 className="font-serif text-6xl text-charcoal leading-tight mb-6">
              Modulas in the media
            </h1>
            <p className="font-sans text-[15px] leading-relaxed text-charcoal/60 max-w-md">
              We welcome press enquiries from journalists, editors, and broadcasters. For images, samples, interviews, or data, our team responds within 24 hours.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
            <a
              href="mailto:press@modulas.com"
              className="inline-flex items-center justify-center gap-2 bg-charcoal-950 px-7 py-4 font-sans text-[12px] tracking-[0.2em] uppercase text-cream hover:bg-charcoal-800 transition-colors"
            >
              Contact Press Team
            </a>
            <a
              href="#press-kit"
              className="inline-flex items-center justify-center gap-2 border border-black/20 px-7 py-4 font-sans text-[12px] tracking-[0.2em] uppercase text-charcoal/70 hover:border-charcoal hover:text-charcoal transition-colors"
            >
              Download Press Kit
            </a>
          </div>
        </div>
      </section>

      {/* ── Publication logos strip ────────────────────────────────── */}
      <section className="bg-cream py-12 px-6 lg:px-20 border-b border-black/6">
        <div className="mx-auto max-w-[1440px]">
          <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-charcoal/30 text-center mb-8">As Featured In</p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
            {["Wallpaper*", "Financial Times", "Dezeen", "The Guardian", "House & Garden", "Architectural Digest", "Monocle"].map((pub) => (
              <span
                key={pub}
                className="font-serif text-[15px] text-charcoal/25 hover:text-charcoal/50 transition-colors cursor-default tracking-wide"
              >
                {pub}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured coverage ──────────────────────────────────────── */}
      <section className="bg-white py-24 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-4 font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40">Featured Coverage</p>
          <h2 className="font-serif text-4xl text-charcoal mb-14 max-w-lg">Recent highlights</h2>
          <div className="space-y-8">
            {FEATURED_COVERAGE.map((item) => (
              <article
                key={item.headline}
                className="group grid lg:grid-cols-[280px_1fr] gap-0 overflow-hidden rounded-2xl border border-black/8 hover:border-black/20 transition-colors"
              >
                <div className="overflow-hidden h-52 lg:h-auto">
                  <img
                    src={item.image}
                    alt=""
                    aria-hidden
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-8 lg:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal/40">{item.publication}</span>
                    <span className="h-px w-6 bg-black/15" />
                    <span className="font-sans text-[11px] text-charcoal/30">{item.date}</span>
                    <span className="ml-auto font-sans text-[10px] tracking-[0.15em] uppercase bg-black/5 text-charcoal/50 px-2.5 py-1 rounded-full hidden sm:block">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl text-charcoal mb-3 leading-snug">{item.headline}</h3>
                  <p className="font-sans text-[13px] leading-relaxed text-charcoal/55 line-clamp-3">{item.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── More coverage ─────────────────────────────────────────── */}
      <section className="bg-cream py-20 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-4 font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40">More Coverage</p>
          <h2 className="font-serif text-4xl text-charcoal mb-12">Also in the press</h2>
          <div className="divide-y divide-black/6">
            {MORE_COVERAGE.map((item) => (
              <div key={item.headline} className="flex items-start gap-6 py-5">
                <span className="font-sans text-[11px] text-charcoal/35 shrink-0 w-28 pt-0.5">{item.date}</span>
                <div>
                  <p className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40 mb-0.5">{item.publication}</p>
                  <p className="font-sans text-[14px] text-charcoal/70">{item.headline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Awards ────────────────────────────────────────────────── */}
      <section className="bg-white py-20 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-4 font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40">Recognition</p>
          <h2 className="font-serif text-4xl text-charcoal mb-12">Awards & accolades</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {AWARDS.map((a) => (
              <div key={a.award} className="border border-black/8 rounded-xl p-6">
                <p className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/35 mb-3">{a.year}</p>
                <h3 className="font-serif text-lg text-charcoal mb-1 leading-snug">{a.award}</h3>
                <p className="font-sans text-[12px] text-charcoal/45">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Press kit ─────────────────────────────────────────────── */}
      <section id="press-kit" className="bg-charcoal-950 py-24 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px] grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="mb-4 font-sans text-[11px] tracking-[0.3em] uppercase text-cream/30">Press Resources</p>
            <h2 className="font-serif text-4xl text-cream mb-6">Everything you need to cover Modulas</h2>
            <p className="font-sans text-[14px] leading-relaxed text-cream/55 mb-8">
              Our press kit includes high-resolution product photography, brand guidelines, founder biography, company fact sheet, and product data sheets — all cleared for editorial use.
            </p>
            <div className="space-y-3">
              {[
                "High-res product images (300 dpi, TIFF & JPG)",
                "Brand logos in all formats (SVG, PNG, EPS)",
                "Founder & workshop photography",
                "Company fact sheet & product data",
                "Sustainability credentials document",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="block h-px w-4 bg-cream/20 shrink-0" />
                  <span className="font-sans text-[13px] text-cream/55">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <a
              href="mailto:press@modulas.com"
              className="flex items-center justify-between w-full border border-white/10 rounded-xl p-6 hover:border-white/25 hover:bg-white/5 transition-colors group"
            >
              <div>
                <p className="font-sans text-[13px] font-medium text-cream mb-0.5">Request Press Kit</p>
                <p className="font-sans text-[12px] text-cream/40">press@modulas.com — 24hr response</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-cream/30 group-hover:text-cream/60 transition-colors">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="tel:+441234567890"
              className="flex items-center justify-between w-full border border-white/10 rounded-xl p-6 hover:border-white/25 hover:bg-white/5 transition-colors group"
            >
              <div>
                <p className="font-sans text-[13px] font-medium text-cream mb-0.5">Press Hotline</p>
                <p className="font-sans text-[12px] text-cream/40">+44 1234 567 890 · Mon–Fri 9–6 GMT</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-cream/30 group-hover:text-cream/60 transition-colors">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <div className="border border-white/10 rounded-xl p-6">
              <p className="font-sans text-[13px] font-medium text-cream mb-1">Press Contact</p>
              <p className="font-sans text-[12px] text-cream/40">Sophie Harlow, Head of Communications</p>
              <p className="font-sans text-[12px] text-cream/40 mt-0.5">press@modulas.com</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
