import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Modulas",
  description: "How Modulas collects, uses, and protects your personal data.",
};

const SECTIONS = [
  { id: "who-we-are",         label: "Who We Are" },
  { id: "data-we-collect",    label: "Data We Collect" },
  { id: "how-we-use-data",    label: "How We Use Your Data" },
  { id: "legal-basis",        label: "Legal Basis" },
  { id: "sharing-data",       label: "Sharing Your Data" },
  { id: "cookies",            label: "Cookies" },
  { id: "retention",          label: "Retention" },
  { id: "your-rights",        label: "Your Rights" },
  { id: "international",      label: "International Transfers" },
  { id: "contact",            label: "Contact & Complaints" },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="border-b border-black/6 px-6 py-16 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-3 font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40">Legal</p>
          <h1 className="font-serif text-5xl text-charcoal mb-4">Privacy Policy</h1>
          <p className="font-sans text-[13px] text-charcoal/40">Last updated: 1 March 2026</p>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-20 lg:grid lg:grid-cols-[220px_1fr] lg:gap-20">

        {/* Sticky TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-[calc(var(--nav-height)+2rem)] space-y-1">
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-charcoal/35 mb-4">Contents</p>
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block font-sans text-[12px] text-charcoal/45 hover:text-charcoal transition-colors py-0.5"
              >
                {s.label}
              </a>
            ))}
          </div>
        </aside>

        {/* Content */}
        <article className="prose-legal max-w-2xl space-y-12 font-sans text-[15px] leading-relaxed text-charcoal/70">

          <section id="who-we-are">
            <h2 className="font-serif text-2xl text-charcoal mb-4">Who We Are</h2>
            <p>Modulas Ltd ("Modulas", "we", "us", "our") is a company registered in India (CIN: U36100HR2021PTC000001) with its registered office at Opp. Newtown Square Mall, Sector 95, Gurgaon, Haryana – 122505, India.</p>
            <p className="mt-3">We operate the website <strong className="text-charcoal">modulas.in</strong> and are the data controller responsible for your personal data processed through our website, showrooms, and associated services.</p>
            <p className="mt-3">Our Data Protection Officer can be contacted at <a href="mailto:privacy@modulas.in" className="text-charcoal underline underline-offset-2">privacy@modulas.in</a>.</p>
          </section>

          <section id="data-we-collect">
            <h2 className="font-serif text-2xl text-charcoal mb-4">Data We Collect</h2>
            <p>We collect personal data in the following ways:</p>
            <div className="mt-4 space-y-4">
              <div className="border-l-2 border-black/10 pl-5">
                <h3 className="font-sans font-semibold text-charcoal text-[14px] mb-1">Data you give us directly</h3>
                <p>Name, email address, phone number, postal address, payment details (processed via Stripe — we do not store card numbers), account credentials, product configuration preferences, and any messages you send us.</p>
              </div>
              <div className="border-l-2 border-black/10 pl-5">
                <h3 className="font-sans font-semibold text-charcoal text-[14px] mb-1">Data collected automatically</h3>
                <p>IP address, browser type and version, operating system, pages visited, time spent, referring URL, and device identifiers — collected via cookies and server logs when you use our website.</p>
              </div>
              <div className="border-l-2 border-black/10 pl-5">
                <h3 className="font-sans font-semibold text-charcoal text-[14px] mb-1">Data from third parties</h3>
                <p>If you sign in via a social account (Google, Apple), we receive the profile data permitted by that platform. If you interact with our ads on Instagram or Pinterest, we may receive event data from those platforms.</p>
              </div>
            </div>
          </section>

          <section id="how-we-use-data">
            <h2 className="font-serif text-2xl text-charcoal mb-4">How We Use Your Data</h2>
            <div className="space-y-3">
              {[
                ["Fulfil your orders", "Process purchases, arrange delivery, and handle returns and warranty claims."],
                ["Manage your account", "Create and maintain your Modulas account, including saved configurations and order history."],
                ["Customer service", "Respond to your enquiries, resolve disputes, and provide after-sales support."],
                ["Marketing communications", "Send you emails about new products, design stories, and offers — only with your consent."],
                ["Personalisation", "Remember your preferences and show you relevant products and content on our website."],
                ["Analytics", "Understand how visitors use our website so we can improve it. Data is aggregated where possible."],
                ["Legal compliance", "Meet our legal obligations, including fraud prevention, tax record-keeping, and responding to lawful requests."],
              ].map(([title, body]) => (
                <div key={title as string} className="flex gap-3">
                  <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-charcoal/25" />
                  <p><strong className="text-charcoal">{title}:</strong> {body}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="legal-basis">
            <h2 className="font-serif text-2xl text-charcoal mb-4">Legal Basis for Processing</h2>
            <p>Under UK GDPR, we rely on the following legal bases:</p>
            <div className="mt-4 overflow-hidden rounded-xl border border-black/8">
              {[
                ["Contract", "Processing your orders and managing your account."],
                ["Legitimate interests", "Analytics, fraud prevention, and improving our services — where these don't override your rights."],
                ["Consent", "Marketing emails and non-essential cookies. You may withdraw consent at any time."],
                ["Legal obligation", "Tax records, anti-money-laundering checks, and other statutory requirements."],
              ].map(([basis, use], i, arr) => (
                <div key={basis as string} className={`grid grid-cols-[140px_1fr] gap-4 p-4 ${i < arr.length - 1 ? "border-b border-black/6" : ""}`}>
                  <span className="font-sans font-semibold text-charcoal text-[13px]">{basis}</span>
                  <span className="text-[13px]">{use}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="sharing-data">
            <h2 className="font-serif text-2xl text-charcoal mb-4">Sharing Your Data</h2>
            <p>We do not sell your personal data. We share it only where necessary:</p>
            <div className="mt-4 space-y-3">
              {[
                ["Stripe", "Payment processing. Stripe is PCI-DSS Level 1 certified."],
                ["Delivery partners", "Your name and address are shared with our couriers (DHL, Parcelforce) to fulfil your order."],
                ["Cloudflare", "Our CDN and DDoS protection provider processes traffic data."],
                ["Clerk", "Authentication and user account management."],
                ["Google Analytics / Meta Pixel", "Aggregated analytics and ad measurement — only with your cookie consent."],
                ["Professional advisors", "Our lawyers, accountants, and insurers where necessary for legitimate business purposes."],
                ["Law enforcement", "Where we are legally required to disclose data by a court order or regulatory authority."],
              ].map(([partner, reason]) => (
                <div key={partner as string} className="flex gap-3">
                  <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-charcoal/25" />
                  <p><strong className="text-charcoal">{partner}:</strong> {reason}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="cookies">
            <h2 className="font-serif text-2xl text-charcoal mb-4">Cookies</h2>
            <p>We use cookies and similar technologies. See our <a href="/cookie-policy" className="text-charcoal underline underline-offset-2">Cookie Policy</a> for full details on which cookies we use and how to manage them.</p>
          </section>

          <section id="retention">
            <h2 className="font-serif text-2xl text-charcoal mb-4">Retention</h2>
            <p>We keep your personal data only for as long as necessary:</p>
            <div className="mt-4 space-y-3">
              {[
                ["Order data", "7 years (UK tax law requirement)."],
                ["Account data", "For the life of your account, plus 2 years after closure."],
                ["Marketing data", "Until you unsubscribe or withdraw consent."],
                ["Cookie data", "Per the cookie-specific retention periods in our Cookie Policy."],
                ["CCTV (showrooms)", "30 days, then deleted."],
              ].map(([type, period]) => (
                <div key={type as string} className="flex gap-3">
                  <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-charcoal/25" />
                  <p><strong className="text-charcoal">{type}:</strong> {period}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="your-rights">
            <h2 className="font-serif text-2xl text-charcoal mb-4">Your Rights</h2>
            <p>Under UK GDPR you have the right to:</p>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {[
                ["Access", "Request a copy of the personal data we hold about you."],
                ["Rectification", "Ask us to correct inaccurate or incomplete data."],
                ["Erasure", "Ask us to delete your data where we have no lawful reason to keep it."],
                ["Restriction", "Ask us to pause processing while a complaint is resolved."],
                ["Portability", "Receive your data in a machine-readable format."],
                ["Object", "Object to processing based on legitimate interests or for direct marketing."],
                ["Withdraw consent", "Withdraw marketing consent at any time via unsubscribe links or by emailing us."],
                ["Lodge a complaint", "Contact the ICO (ico.org.uk) if you believe we have mishandled your data."],
              ].map(([right, desc]) => (
                <div key={right as string} className="rounded-xl border border-black/6 p-4">
                  <p className="font-sans font-semibold text-charcoal text-[13px] mb-1">{right}</p>
                  <p className="text-[13px] text-charcoal/60">{desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4">To exercise any of these rights, email <a href="mailto:privacy@modulas.in" className="text-charcoal underline underline-offset-2">privacy@modulas.in</a>. We will respond within 30 days.</p>
          </section>

          <section id="international">
            <h2 className="font-serif text-2xl text-charcoal mb-4">International Transfers</h2>
            <p>Some of our service providers (including Stripe and Cloudflare) may process data outside the UK or EEA. Where this occurs, we ensure appropriate safeguards are in place — including UK adequacy decisions, Standard Contractual Clauses, or equivalent protections — in accordance with UK GDPR Chapter V.</p>
          </section>

          <section id="contact">
            <h2 className="font-serif text-2xl text-charcoal mb-4">Contact & Complaints</h2>
            <p>For any privacy-related questions or requests, contact our Data Protection Officer:</p>
            <div className="mt-4 rounded-xl border border-black/8 p-6 space-y-1">
              <p className="font-sans font-semibold text-charcoal">Modulas Ltd — Data Protection Officer</p>
              <p>Opp. Newtown Square Mall, Sector 95, Gurgaon, Haryana – 122505, India</p>
              <a href="mailto:privacy@modulas.in" className="text-charcoal underline underline-offset-2">privacy@modulas.in</a>
            </div>
            <p className="mt-4">If you are not satisfied with our response, you have the right to lodge a complaint with the Information Commissioner's Office (ICO) at <a href="https://ico.org.uk" className="text-charcoal underline underline-offset-2">ico.org.uk</a> or by calling 0303 123 1113.</p>
          </section>

        </article>
      </div>
    </div>
  );
}
