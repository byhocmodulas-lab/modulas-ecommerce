import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Delivery & Lead Times — Modulas",
  description:
    "White Glove delivery across the UK, with international shipping available. Lead times by product type and delivery FAQs.",
};

const DELIVERY_OPTIONS = [
  {
    name: "White Glove",
    price: "From £95",
    description: "Our signature two-person service. We deliver to your room of choice, unpack, assemble, position, and remove all packaging. Available UK mainland.",
    features: ["Two-person delivery team", "Room-of-choice placement", "Full assembly included", "All packaging removed", "Timed delivery window (AM or PM)", "4-hour time slot confirmed 48hrs prior"],
    recommended: true,
  },
  {
    name: "Threshold",
    price: "From £55",
    description: "Delivery to your front door or ground-floor entrance. No assembly. Suitable for smaller items and self-assembly pieces.",
    features: ["Single-person delivery", "Ground floor only", "Packaging removal not included", "Timed delivery window"],
    recommended: false,
  },
  {
    name: "Click & Collect",
    price: "Free",
    description: "Collect from our Gurgaon Experience Centre. We'll contact you when your piece is ready for collection.",
    features: ["Gurgaon Experience Centre — Sector 95", "7-day collection window after notification", "Our team will assist with loading", "Van hire recommended for large pieces"],
    recommended: false,
  },
];

const LEAD_TIMES = [
  { category: "In-stock items", standard: "3–5 working days", configured: "—", bespoke: "—" },
  { category: "Upholstered seating", standard: "2–3 weeks", configured: "6–10 weeks", bespoke: "10–14 weeks" },
  { category: "Solid wood tables", standard: "2–4 weeks", configured: "6–8 weeks", bespoke: "8–12 weeks" },
  { category: "Storage & shelving", standard: "2–4 weeks", configured: "6–10 weeks", bespoke: "10–16 weeks" },
  { category: "Beds & headboards", standard: "2–3 weeks", configured: "6–8 weeks", bespoke: "8–12 weeks" },
  { category: "Lighting", standard: "1–2 weeks", configured: "4–6 weeks", bespoke: "6–10 weeks" },
];

const INTERNATIONAL = [
  { region: "Republic of Ireland", method: "White Glove (partner)", time: "7–10 working days", surcharge: "From £195" },
  { region: "France, Belgium, Netherlands", method: "Specialist freight", time: "10–15 working days", surcharge: "From £295" },
  { region: "Germany, Austria, Switzerland", method: "Specialist freight", time: "10–15 working days", surcharge: "From £350" },
  { region: "Rest of EU", method: "Specialist freight", time: "2–4 weeks", surcharge: "Quoted per order" },
  { region: "United States & Canada", method: "Air or sea freight", time: "3–6 weeks", surcharge: "Quoted per order" },
  { region: "UAE & Middle East", method: "Air freight", time: "1–2 weeks", surcharge: "Quoted per order" },
];

const FAQS = [
  {
    q: "Can I choose my delivery day?",
    a: "Yes. Once your order is ready for dispatch, we'll contact you to arrange a convenient day. We offer Monday–Saturday delivery with AM (8–12) and PM (12–17) windows. We'll confirm your 4-hour slot 48 hours in advance.",
  },
  {
    q: "What happens if I can't be home on the delivery day?",
    a: "Contact us at least 48 hours before your scheduled delivery to reschedule. If we arrive and you're not in, a re-delivery fee of £75 applies. We will not leave furniture unattended.",
  },
  {
    q: "What if my piece arrives damaged?",
    a: "Photograph the damage immediately and contact us within 48 hours at hello@modulas.com. We will arrange repair or replacement at our cost. Please do not sign for a delivery if you suspect significant damage.",
  },
  {
    q: "Can you deliver to upper floors?",
    a: "Yes — White Glove delivery includes navigating stairs. Please let us know about access constraints (narrow staircases, low ceilings, lifts) when ordering so we can plan appropriately.",
  },
  {
    q: "Do you remove old furniture?",
    a: "We don't offer removal as standard, but we can arrange it at an additional cost through our logistics partner. Mention this when placing your order.",
  },
  {
    q: "How are lead times calculated?",
    a: "Lead times run from the date we receive your order confirmation and deposit, to the date the piece is ready for dispatch. They do not include delivery time (typically 1–3 working days after dispatch).",
  },
  {
    q: "Can I track my order?",
    a: "Yes. You'll receive an email with tracking information when your order is dispatched. Configured and bespoke orders also receive progress photos at key production milestones.",
  },
  {
    q: "What if I live outside the UK?",
    a: "We ship internationally via specialist furniture freight partners. Surcharges vary by destination — see the international table above, or contact us for a quote.",
  },
];

export default function DeliveryPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-black/6 py-20 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-4 font-sans text-[11px] tracking-[0.35em] uppercase text-charcoal/40">Delivery</p>
          <h1 className="font-serif text-5xl text-charcoal md:text-6xl max-w-2xl leading-tight mb-6">
            Delivery & Lead Times
          </h1>
          <p className="font-sans text-[15px] text-charcoal/55 max-w-xl leading-relaxed">
            White Glove delivery to your room, UK-wide. International shipping available to 40+ countries. Every piece tracked from workshop to door.
          </p>
        </div>
      </section>

      {/* ── Delivery options ──────────────────────────────────────── */}
      <section className="bg-cream py-24 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-4 font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40">Delivery Options</p>
          <h2 className="font-serif text-4xl text-charcoal mb-14 max-w-lg">Choose how your piece arrives</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {DELIVERY_OPTIONS.map((opt) => (
              <div
                key={opt.name}
                className={`rounded-2xl p-8 flex flex-col ${opt.recommended ? "bg-charcoal-950" : "bg-white border border-black/8"}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className={`font-serif text-2xl ${opt.recommended ? "text-cream" : "text-charcoal"}`}>{opt.name}</h3>
                  {opt.recommended && (
                    <span className="font-sans text-[10px] tracking-[0.12em] uppercase bg-white/10 text-cream/60 px-2.5 py-1 rounded-full">Recommended</span>
                  )}
                </div>
                <p className={`font-serif text-3xl mb-4 ${opt.recommended ? "text-cream" : "text-charcoal"}`}>{opt.price}</p>
                <p className={`font-sans text-[13px] leading-relaxed mb-6 ${opt.recommended ? "text-cream/55" : "text-charcoal/55"}`}>{opt.description}</p>
                <div className="mt-auto space-y-2.5">
                  {opt.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={opt.recommended ? "text-cream/40" : "text-charcoal/30"}>
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                      <span className={`font-sans text-[12px] ${opt.recommended ? "text-cream/60" : "text-charcoal/55"}`}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lead times ────────────────────────────────────────────── */}
      <section className="bg-white py-24 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-4 font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40">Lead Times</p>
          <h2 className="font-serif text-4xl text-charcoal mb-6 max-w-lg">How long will my order take?</h2>
          <p className="font-sans text-[14px] text-charcoal/55 mb-12 max-w-2xl leading-relaxed">
            Lead times run from confirmed order to dispatch. They depend on whether you're buying an in-stock item, a configured piece (using our 3D Configurator), or a fully bespoke commission.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-black/8">
                  <th className="text-left font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal/40 pb-4 pr-8">Product type</th>
                  <th className="text-left font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal/40 pb-4 pr-8">Standard</th>
                  <th className="text-left font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal/40 pb-4 pr-8">Configured</th>
                  <th className="text-left font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal/40 pb-4">Bespoke</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {LEAD_TIMES.map((row) => (
                  <tr key={row.category}>
                    <td className="py-4 pr-8 font-sans text-[14px] text-charcoal">{row.category}</td>
                    <td className="py-4 pr-8 font-sans text-[13px] text-charcoal/60">{row.standard}</td>
                    <td className="py-4 pr-8 font-sans text-[13px] text-charcoal/60">{row.configured}</td>
                    <td className="py-4 font-sans text-[13px] text-charcoal/60">{row.bespoke}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 font-sans text-[12px] text-charcoal/35">
            Lead times are estimates based on current production capacity and may vary. Your Order Confirmation includes a specific estimated dispatch date.
          </p>
        </div>
      </section>

      {/* ── International ─────────────────────────────────────────── */}
      <section className="bg-cream py-24 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-4 font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40">International Shipping</p>
          <h2 className="font-serif text-4xl text-charcoal mb-12 max-w-lg">We ship worldwide</h2>
          <div className="overflow-hidden rounded-2xl border border-black/8 bg-white">
            <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-black/3 border-b border-black/6">
              {["Region", "Method", "Transit time", "Surcharge"].map((h) => (
                <span key={h} className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40">{h}</span>
              ))}
            </div>
            <div className="divide-y divide-black/5">
              {INTERNATIONAL.map((row) => (
                <div key={row.region} className="grid grid-cols-4 gap-4 px-6 py-4">
                  <span className="font-sans text-[13px] text-charcoal font-medium">{row.region}</span>
                  <span className="font-sans text-[13px] text-charcoal/60">{row.method}</span>
                  <span className="font-sans text-[13px] text-charcoal/60">{row.time}</span>
                  <span className="font-sans text-[13px] text-charcoal/60">{row.surcharge}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-5 font-sans text-[12px] text-charcoal/40">
            Import duties and local taxes are the buyer's responsibility. For a full international shipping quote, contact <a href="mailto:hello@modulas.com" className="text-charcoal underline underline-offset-2">hello@modulas.com</a>.
          </p>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section className="bg-white py-24 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px] grid lg:grid-cols-[1fr_2fr] gap-16">
          <div>
            <p className="mb-4 font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40">FAQ</p>
            <h2 className="font-serif text-4xl text-charcoal mb-6">Delivery questions</h2>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal/50 hover:text-charcoal transition-colors"
            >
              Ask us anything
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
          <div className="divide-y divide-black/6">
            {FAQS.map((faq) => (
              <div key={faq.q} className="py-6">
                <h3 className="font-sans font-semibold text-charcoal text-[14px] mb-2">{faq.q}</h3>
                <p className="font-sans text-[13px] leading-relaxed text-charcoal/60">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
