import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works — Free Home Visit to Installation | Modulas",
  description: "From first enquiry to installation in 4 simple steps. Book a free home visit, get a 3D design, confirm your order, and sit back while we install it.",
};

const STEPS = [
  {
    number: "01",
    title: "Book a free home visit",
    body: "Fill in the form or call us. We'll send a designer to your home at a time that suits you. No charge. No obligation. No pressure.",
    detail: "Available Mon–Sat, 9am–7pm. Same-week appointments usually available.",
    imageUrl: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
    cta: { label: "Book Now", href: "/book-consultation" },
  },
  {
    number: "02",
    title: "We design your space in 3D",
    body: "Your designer takes precise measurements, discusses your needs and budget, and then creates a full 3D render of your space — usually ready within 48 hours.",
    detail: "You'll see exactly what your kitchen, wardrobe, or storage will look like before committing to anything.",
    imageUrl: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800",
    cta: null,
  },
  {
    number: "03",
    title: "Review, revise, confirm",
    body: "We review the design together. Change the finish, tweak a dimension, swap a unit — as many revisions as you need until it's perfect. Then you confirm with a 50% deposit.",
    detail: "We never rush this stage. Getting the design right means installation goes smoothly.",
    imageUrl: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
    cta: null,
  },
  {
    number: "04",
    title: "We manufacture and install",
    body: "Your order goes straight to our factory. In 14–21 days (depending on product), our installation team arrives, fits everything, and leaves your home spotless.",
    detail: "Lead times: Wardrobes 10–14 days · Kitchens 14–21 days · Storage 7–10 days.",
    imageUrl: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800",
    cta: null,
  },
];

const FAQS = [
  { q: "Is the home visit really free?", a: "Yes, completely. We cover the cost of the designer's time and travel. There's no obligation to purchase and no hard sell." },
  { q: "How long does a home visit take?", a: "Usually 60–90 minutes. The designer will measure your space, discuss your needs, and answer any questions you have." },
  { q: "How long before I receive my 3D design?", a: "Within 48 hours of the home visit for most products. Complex kitchens may take up to 72 hours." },
  { q: "Can I make changes after I've confirmed my order?", a: "Minor changes are possible within 48 hours of confirmation. After production begins, structural changes cannot be made, but finishing details may still be adjustable." },
  { q: "What areas do you cover?", a: "We currently serve Mumbai, Delhi NCR, Bengaluru, Pune, Hyderabad, Chennai, Ahmedabad, and Chandigarh. Expanding to more cities in 2025." },
  { q: "What is the warranty?", a: "All Modulas products come with a 10-year structural warranty. Mechanisms and hardware carry manufacturer warranties (Hettich/Blum: 5 years)." },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="bg-cream py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-2 font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40">The Process</p>
          <h1 className="font-serif text-5xl text-charcoal md:text-6xl mb-5 max-w-2xl">How it works</h1>
          <p className="font-sans text-[15px] text-charcoal/55 max-w-xl leading-relaxed">
            From your first enquiry to a perfectly fitted kitchen or wardrobe — in four straightforward steps. No surprises, no delays.
          </p>
        </div>
      </section>

      {/* ── Steps ─────────────────────────────────────────────── */}
      <section className="bg-white py-14 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px] space-y-16">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              {/* Image */}
              <div className="relative">
                <div className="absolute -top-5 -left-5 font-serif text-[100px] leading-none text-charcoal/5 select-none">
                  {step.number}
                </div>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <img src={step.imageUrl} alt={step.title} className="h-full w-full object-cover" />
                </div>
              </div>
              {/* Text */}
              <div>
                <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-gold mb-2">Step {step.number}</p>
                <h2 className="font-serif text-3xl text-charcoal mb-4">{step.title}</h2>
                <p className="font-sans text-[15px] text-charcoal/60 leading-relaxed mb-4">{step.body}</p>
                <p className="font-sans text-[12px] text-charcoal/40 italic mb-6">{step.detail}</p>
                {step.cta && (
                  <Link
                    href={step.cta.href}
                    className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
                  >
                    {step.cta.label}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section className="bg-cream py-16 px-6 lg:px-12">
        <div className="mx-auto max-w-[900px]">
          <p className="mb-2 font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40">Common Questions</p>
          <h2 className="font-serif text-4xl text-charcoal mb-12">Frequently asked</h2>
          <div className="divide-y divide-black/8">
            {FAQS.map((faq) => (
              <div key={faq.q} className="py-6">
                <h3 className="font-serif text-lg text-charcoal mb-2">{faq.q}</h3>
                <p className="font-sans text-[14px] text-charcoal/60 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="bg-charcoal-950 py-16 px-6 lg:px-12 text-center">
        <div className="mx-auto max-w-lg">
          <h2 className="font-serif text-4xl text-cream mb-4">Ready to start?</h2>
          <p className="font-sans text-[14px] text-cream/50 mb-8">Book a free home visit. It costs nothing and commits you to nothing.</p>
          <Link
            href="/book-consultation"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
          >
            Book Free Home Visit
          </Link>
        </div>
      </section>
    </>
  );
}
