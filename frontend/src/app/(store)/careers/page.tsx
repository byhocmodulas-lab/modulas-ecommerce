import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Careers — Modulas",
  description:
    "Join the team building India's most considered luxury furniture studio. Open roles in design, craft, technology, and more.",
};

const OPEN_ROLES = [
  {
    title: "Senior Furniture Designer",
    department: "Design Studio",
    location: "Gurgaon / Hybrid",
    type: "Full-time",
    description:
      "Lead the development of new modular product lines from concept through to production-ready specification. You'll collaborate closely with our workshop team and material suppliers.",
  },
  {
    title: "Front-End Engineer",
    department: "Technology",
    location: "Remote (India)",
    type: "Full-time",
    description:
      "Build and refine our customer-facing configurator and e-commerce platform using Next.js, Three.js, and TypeScript. You care deeply about performance and accessibility.",
  },
  {
    title: "Master Joiner",
    department: "Workshop",
    location: "Gurgaon",
    type: "Full-time",
    description:
      "Hand-cut mortise and tenon, dovetails, and bridle joints on solid hardwood furniture pieces. 5+ years of traditional bench joinery experience required.",
  },
  {
    title: "Interior Design Consultant",
    department: "Trade & Architects",
    location: "Gurgaon Experience Centre",
    type: "Full-time",
    description:
      "Work with architects, interior designers, and high-net-worth clients to specify and configure bespoke Modulas pieces for residential and commercial projects.",
  },
  {
    title: "Brand & Content Manager",
    department: "Marketing",
    location: "Gurgaon / Remote",
    type: "Full-time",
    description:
      "Own the Modulas editorial voice across the journal, social channels, and campaign communications. You write beautifully and understand luxury positioning.",
  },
  {
    title: "Production Co-ordinator",
    department: "Operations",
    location: "Gurgaon",
    type: "Full-time",
    description:
      "Manage the flow of orders through our workshop — liaising between the design, joinery, and upholstery teams to keep production on schedule.",
  },
];

const BENEFITS = [
  {
    title: "Craft Allowance",
    body: "£500 annual allowance to spend on tools, courses, or materials that support your craft — whatever that means to you.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    title: "Furniture Discount",
    body: "40% off all Modulas pieces for you and your immediate family. We want you to live with what we make.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    title: "Flexible Working",
    body: "Core hours of 10–3. We trust our people to manage their own time. Remote-first for non-workshop roles.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: "Learning Budget",
    body: "£1,000 per year for conferences, courses, books, or anything that makes you better at what you do.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    title: "Pension & Healthcare",
    body: "6% employer pension contribution. Comprehensive private health insurance from day one, including dental and optical.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    title: "Workshop Visits",
    body: "All team members — including remote staff — visit our Gurgaon workshop at least twice a year. We make it a proper trip.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="10" r="3" /><path d="M12 2a8 8 0 0 0-8 8c0 5.4 7.05 11.5 7.35 11.76a1 1 0 0 0 1.3 0C12.95 21.5 20 15.4 20 10a8 8 0 0 0-8-8z" />
      </svg>
    ),
  },
];

const VALUES = [
  { label: "Make things properly", body: "We take our time. We don't cut corners. If something isn't right, we fix it." },
  { label: "Own your craft", body: "Whatever your role — design, code, joinery, marketing — we expect deep expertise and genuine pride in the work." },
  { label: "Speak plainly", body: "No corporate language. No politics. Say what you mean, mean what you say." },
  { label: "Think long-term", body: "We build furniture to last 50 years. We apply the same logic to our team and our decisions." },
];

export default function CareersPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative h-[60vh] min-h-[460px] overflow-hidden bg-charcoal-950">
        <img
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=90"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-charcoal-950/80" />
        <div className="relative flex h-full flex-col justify-end px-6 pb-16 lg:px-20 lg:pb-24 max-w-[1440px] mx-auto">
          <p className="mb-4 font-sans text-[11px] tracking-[0.35em] uppercase text-cream/40">Work With Us</p>
          <h1 className="font-serif text-5xl leading-tight text-cream md:text-6xl max-w-2xl">
            Build something that lasts.
          </h1>
        </div>
      </section>

      {/* ── Intro ─────────────────────────────────────────────────── */}
      <section className="bg-white py-20 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px] grid lg:grid-cols-[1fr_2fr] gap-16">
          <div>
            <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40 mb-4">Why Modulas</p>
            <div className="space-y-1">
              {["Small, senior team", "Craft-first culture", "Remote-friendly", "No corporate nonsense"].map((item) => (
                <div key={item} className="flex items-center gap-3 py-3 border-b border-black/6">
                  <span className="block h-1.5 w-1.5 rounded-full bg-charcoal/30 shrink-0" />
                  <span className="font-sans text-[13px] text-charcoal/70">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-5 font-sans text-[15px] leading-relaxed text-charcoal/65">
            <p>
              We are a small team of people who care, deeply, about what we make and how we make it. That applies whether you're shaping a tenon joint at the workbench or writing a line of TypeScript at your kitchen table.
            </p>
            <p>
              We don't have a HR department. We don't do performance reviews for the sake of them. We hire slowly, treat people like adults, and try to build an environment where excellent work happens naturally because the people doing it are proud of it.
            </p>
            <p>
              We're growing carefully — adding roles where we genuinely need them, not to hit a headcount target. If you see yourself in one of the roles below and you're serious about craft, we'd like to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────────── */}
      <section className="bg-cream py-20 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-4 font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40">How We Work</p>
          <h2 className="font-serif text-4xl text-charcoal mb-12 max-w-lg">Four things we believe in</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.label} className="bg-white rounded-2xl p-7">
                <h3 className="font-serif text-lg text-charcoal mb-3">{v.label}</h3>
                <p className="font-sans text-[13px] leading-relaxed text-charcoal/55">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open Roles ────────────────────────────────────────────── */}
      <section className="bg-white py-24 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-4 font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40">Open Positions</p>
          <h2 className="font-serif text-4xl text-charcoal mb-14 max-w-lg">
            {OPEN_ROLES.length} open roles
          </h2>
          <div className="divide-y divide-black/6">
            {OPEN_ROLES.map((role) => (
              <div
                key={role.title}
                className="group py-8 grid lg:grid-cols-[1fr_auto] gap-6 items-start hover:bg-cream/40 -mx-6 px-6 lg:-mx-12 lg:px-12 transition-colors"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40">{role.department}</span>
                    <span className="h-px w-4 bg-black/15" />
                    <span className="font-sans text-[11px] text-charcoal/35">{role.location}</span>
                    <span className="font-sans text-[10px] tracking-[0.1em] uppercase bg-black/5 text-charcoal/45 px-2.5 py-0.5 rounded-full">{role.type}</span>
                  </div>
                  <h3 className="font-serif text-xl text-charcoal mb-2">{role.title}</h3>
                  <p className="font-sans text-[13px] leading-relaxed text-charcoal/55 max-w-2xl">{role.description}</p>
                </div>
                <a
                  href={`mailto:careers@modulas.com?subject=Application: ${role.title}`}
                  className="shrink-0 inline-flex items-center gap-2 border border-black/15 px-6 py-3 font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/60 hover:border-charcoal hover:text-charcoal transition-colors"
                >
                  Apply
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ──────────────────────────────────────────────── */}
      <section className="bg-cream py-24 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-4 font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40">What We Offer</p>
          <h2 className="font-serif text-4xl text-charcoal mb-14 max-w-lg">Benefits that reflect our values</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div key={b.title} className="bg-white rounded-2xl p-7 flex gap-5">
                <div className="shrink-0 h-10 w-10 rounded-full bg-charcoal/6 flex items-center justify-center text-charcoal/50">
                  {b.icon}
                </div>
                <div>
                  <h3 className="font-sans text-[13px] font-semibold text-charcoal mb-1.5">{b.title}</h3>
                  <p className="font-sans text-[13px] leading-relaxed text-charcoal/55">{b.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Culture photo strip ───────────────────────────────────── */}
      <section className="bg-white py-16 px-6 lg:px-20 overflow-hidden">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-3 gap-3 h-64">
            <img src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80" alt="" aria-hidden className="w-full h-full object-cover rounded-xl" />
            <img src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=600&q=80" alt="" aria-hidden className="w-full h-full object-cover rounded-xl" />
            <img src="https://images.unsplash.com/photo-1542621334-a254cf47733d?w=600&q=80" alt="" aria-hidden className="w-full h-full object-cover rounded-xl" />
          </div>
        </div>
      </section>

      {/* ── Speculative CTA ──────────────────────────────────────── */}
      <section className="bg-charcoal-950 py-20 px-6 text-center">
        <p className="mb-4 font-sans text-[11px] tracking-[0.3em] uppercase text-cream/30">Don't See Your Role?</p>
        <h2 className="font-serif text-3xl text-cream mb-5 max-w-lg mx-auto">
          We always want to hear from exceptional people
        </h2>
        <p className="font-sans text-[14px] text-cream/50 mb-8 max-w-md mx-auto">
          If you're brilliant at something relevant to what we do, send us a note. We keep speculative applications on file and reach out when the right opportunity opens.
        </p>
        <a
          href="mailto:careers@modulas.com?subject=Speculative Application"
          className="inline-flex items-center justify-center gap-2 bg-white px-8 py-4 font-sans text-[12px] tracking-[0.2em] uppercase text-charcoal hover:bg-cream transition-colors"
        >
          Get in Touch
        </a>
      </section>
    </>
  );
}
