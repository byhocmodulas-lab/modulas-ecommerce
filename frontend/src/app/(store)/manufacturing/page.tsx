import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manufacturing — How We Build Your Furniture | Modulas",
  description:
    "A behind-the-scenes look at how Modulas furniture is made — from sustainably sourced raw materials to hand-finished pieces delivered to your door.",
};

const STAGES = [
  {
    number: "01",
    label: "Sourcing",
    heading: "Responsibly sourced, every time",
    body: "We source timber only from FSC-certified forests and registered saw mills. Every shipment is checked for moisture content, grain quality, and dimensional accuracy before it enters our workshop.",
    stat: "100% certified timber",
  },
  {
    number: "02",
    label: "Kiln Drying",
    heading: "Stability starts before the first cut",
    body: "All solid wood is kiln-dried to 8–10% moisture content — the optimal range for furniture in Indian climate conditions. This prevents warping, cracking, and joint failure over time.",
    stat: "8–10% moisture content",
  },
  {
    number: "03",
    label: "Cutting & Milling",
    heading: "Precision from the first millimetre",
    body: "CNC machines cut every component to tolerance of ±0.5mm. Digital files ensure every piece matches the approved design exactly — whether it's the first unit or the fiftieth.",
    stat: "±0.5mm tolerance",
  },
  {
    number: "04",
    label: "Joinery",
    heading: "Joints built to outlast the piece",
    body: "Mortise-and-tenon, dovetail, and dowel joints — reinforced with PVA glue and stainless steel hardware. Every joint is designed to carry structural load, not just look good in a cross-section.",
    stat: "Traditional joinery techniques",
  },
  {
    number: "05",
    label: "Finishing",
    heading: "Up to 7 coats by hand",
    body: "Sanding through 80, 120, 180, and 240 grit before the first coat is applied. Each lacquer coat is hand-sanded and inspected before the next. Water-based finishes only — no harmful VOCs.",
    stat: "7 coats, hand-applied",
  },
  {
    number: "06",
    label: "Quality Control",
    heading: "Every piece signed off individually",
    body: "Dimensional check, finish inspection, joint test, and load test before any piece leaves the floor. Our QC team rejects approximately 3% of completed pieces — they're refinished or remade.",
    stat: "3-point inspection protocol",
  },
  {
    number: "07",
    label: "Delivery",
    heading: "White-glove to your room",
    body: "Furniture is wrapped in protective blankets — never cardboard alone. Two-person delivery teams place and level every piece. Final inspection with the customer before the team leaves.",
    stat: "White-glove installation",
  },
];

const STATS = [
  { value: "18,000+", label: "sq ft workshop" },
  { value: "85", label: "master craftsmen" },
  { value: "10 yr", label: "structural warranty" },
  { value: "97%", label: "quality pass rate" },
];

export default function ManufacturingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal-950 min-h-[60vh] flex items-end">
        <img
          src="https://images.pexels.com/photos/1248583/pexels-photo-1248583.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/10 via-transparent to-charcoal-950/95" />
        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12 pb-20 pt-40 w-full">
          <p className="mb-3 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">
            Manufacturing
          </p>
          <h1 className="font-serif text-5xl text-cream md:text-7xl mb-5 max-w-3xl leading-tight">
            Built by hand. Built to last.
          </h1>
          <p className="font-sans text-[15px] text-cream/50 max-w-xl leading-relaxed">
            Our 18,000 sq ft workshop in India is where every Modulas piece begins.
            Eighty-five master craftsmen. Seven stages. Zero compromises.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gold py-12 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px] grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-serif text-4xl text-charcoal-950 mb-1">{s.value}</p>
              <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal-950/60">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stages */}
      <section className="bg-white py-24 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-2 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">Process</p>
          <h2 className="font-serif text-4xl text-charcoal mb-16">
            From raw material to your room
          </h2>
          <div className="grid lg:grid-cols-2 gap-x-16 gap-y-0">
            {STAGES.map((stage, i) => (
              <div
                key={stage.number}
                className={`flex gap-6 py-8 ${
                  i < STAGES.length - 1 ? "border-b border-black/6" : ""
                }`}
              >
                <div className="shrink-0">
                  <span className="font-sans text-[10px] tracking-[0.25em] text-gold/50 uppercase block mb-1">
                    {stage.label}
                  </span>
                  <span className="font-serif text-4xl text-charcoal/10">{stage.number}</span>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-charcoal mb-2">{stage.heading}</h3>
                  <p className="font-sans text-[13px] text-charcoal/50 leading-relaxed mb-3">
                    {stage.body}
                  </p>
                  <span className="inline-block rounded-full bg-gold/10 px-3 py-1 font-sans text-[10px] tracking-[0.15em] uppercase text-gold">
                    {stage.stat}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Environmental commitment */}
      <section className="bg-cream py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px] grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="mb-3 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">
              Sustainability
            </p>
            <h2 className="font-serif text-4xl text-charcoal mb-5">
              Built responsibly
            </h2>
            <div className="space-y-5">
              {[
                {
                  label: "Zero-waste offcuts",
                  body: "Wood offcuts are used for smaller components or donated to local craft schools.",
                },
                {
                  label: "Water-based finishes",
                  body: "All lacquers and stains are water-based — no VOC emissions in our workshop or in your home.",
                },
                {
                  label: "Solar-powered facility",
                  body: "60% of our workshop electricity comes from rooftop solar panels installed in 2023.",
                },
                {
                  label: "Packaging from recycled material",
                  body: "All protective packaging uses recycled cardboard and paper — no single-use plastic.",
                },
              ].map((item) => (
                <div key={item.label} className="flex gap-3">
                  <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-gold" />
                  <div>
                    <h3 className="font-serif text-base text-charcoal mb-0.5">{item.label}</h3>
                    <p className="font-sans text-[13px] text-charcoal/50">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded-2xl">
            <img
              src="https://images.pexels.com/photos/129733/pexels-photo-129733.jpeg?auto=compress&cs=tinysrgb&w=900"
              alt="Workshop craftsmanship"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-charcoal-950 py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px] text-center">
          <h2 className="font-serif text-4xl text-cream mb-4">
            See the difference craftsmanship makes.
          </h2>
          <p className="font-sans text-[14px] text-cream/45 max-w-md mx-auto mb-8">
            Browse our furniture range or book a free design visit to see materials and samples in person.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/furniture"
              className="rounded-full bg-gold px-8 py-4 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
            >
              Shop Furniture
            </Link>
            <Link
              href="/materials"
              className="rounded-full border border-cream/20 px-8 py-4 font-sans text-[12px] tracking-[0.15em] uppercase text-cream/60 hover:border-cream hover:text-cream transition-colors"
            >
              Explore Materials
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
