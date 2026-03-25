import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Sale — Modulas",
  description: "Terms and conditions governing purchases made on modulas.com.",
};

const SECTIONS = [
  { id: "about",          label: "About These Terms" },
  { id: "ordering",       label: "Placing an Order" },
  { id: "pricing",        label: "Pricing & Payment" },
  { id: "bespoke",        label: "Bespoke & Configured Orders" },
  { id: "delivery",       label: "Delivery" },
  { id: "returns",        label: "Returns & Cancellations" },
  { id: "warranty",       label: "Warranty" },
  { id: "liability",      label: "Liability" },
  { id: "governing-law",  label: "Governing Law" },
  { id: "contact",        label: "Contact" },
];

export default function TermsOfSalePage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="border-b border-black/6 px-6 py-16 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-3 font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40">Legal</p>
          <h1 className="font-serif text-5xl text-charcoal mb-4">Terms of Sale</h1>
          <p className="font-sans text-[13px] text-charcoal/40">Last updated: 1 March 2026 · Applies to orders placed from 1 March 2026</p>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-20 lg:grid lg:grid-cols-[220px_1fr] lg:gap-20">

        {/* TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-[calc(var(--nav-height)+2rem)] space-y-1">
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-charcoal/35 mb-4">Contents</p>
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="block font-sans text-[12px] text-charcoal/45 hover:text-charcoal transition-colors py-0.5">
                {s.label}
              </a>
            ))}
          </div>
        </aside>

        <article className="max-w-2xl space-y-12 font-sans text-[15px] leading-relaxed text-charcoal/70">

          <section id="about">
            <h2 className="font-serif text-2xl text-charcoal mb-4">About These Terms</h2>
            <p>These Terms of Sale ("Terms") govern purchases of products from Modulas Ltd ("Modulas", "we", "us"), registered in India (CIN: U36100HR2021PTC000001), operating from Opp. Newtown Square Mall, Sector 95, Gurgaon, Haryana – 122505, India.</p>
            <p className="mt-3">By placing an order you agree to these Terms. Please read them carefully before purchasing. These Terms do not affect your statutory consumer rights under the Consumer Rights Act 2015 and the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013.</p>
          </section>

          <section id="ordering">
            <h2 className="font-serif text-2xl text-charcoal mb-4">Placing an Order</h2>
            <div className="space-y-3">
              <p>When you place an order on modulas.com, you are making an offer to purchase. We accept your offer when we send an <strong className="text-charcoal">Order Confirmation</strong> email. A contract is formed at that point.</p>
              <p>We reserve the right to decline any order — for example, if a product is out of stock, there is an error in the listed price, or we suspect fraudulent activity. If we decline your order after payment, we will refund you in full within 5 business days.</p>
              <p>You must be 18 or over to place an order and resident in a country we ship to. A list of shipping destinations is available at <a href="/delivery" className="text-charcoal underline underline-offset-2">/delivery</a>.</p>
            </div>
          </section>

          <section id="pricing">
            <h2 className="font-serif text-2xl text-charcoal mb-4">Pricing & Payment</h2>
            <div className="space-y-3">
              <p>All prices shown on our website are in GBP and include UK VAT (20%) unless otherwise stated. Prices for international orders may exclude local taxes and import duties, which are the buyer's responsibility.</p>
              <p>We accept Visa, Mastercard, American Express, Apple Pay, Google Pay, and bank transfer (for orders over £5,000). Payment is processed securely by Stripe. We do not store your card details.</p>
              <p>For bespoke or configured orders we require a <strong className="text-charcoal">50% deposit</strong> at time of order, with the remaining 50% due before dispatch. Payment links for the balance will be sent 2 weeks before your estimated dispatch date.</p>
              <p>We will correct any pricing errors that occur on our website. If a product is listed at an incorrect price and you have already paid, we will offer you the corrected price or a full refund.</p>
            </div>
          </section>

          <section id="bespoke">
            <h2 className="font-serif text-2xl text-charcoal mb-4">Bespoke & Configured Orders</h2>
            <div className="space-y-3">
              <p>Products ordered through our 3D Configurator or as bespoke commissions are <strong className="text-charcoal">made to order</strong> and are not eligible for return or exchange under the Consumer Contracts Regulations (Regulation 28(1)(b) — goods made to the consumer's specification).</p>
              <p>You may cancel a configured order within <strong className="text-charcoal">48 hours</strong> of the Order Confirmation, before production begins, for a full refund. After this window, cancellations are subject to our production costs — typically 25–50% of the order value.</p>
              <p>Lead times for configured products are stated in your Order Confirmation. While we do our best to meet these estimates, delays caused by material supply issues or circumstances beyond our control do not entitle you to cancel or claim compensation beyond a refund of any unearned deposit.</p>
            </div>
          </section>

          <section id="delivery">
            <h2 className="font-serif text-2xl text-charcoal mb-4">Delivery</h2>
            <div className="space-y-3">
              <p>All Modulas pieces are delivered by our two-person White Glove delivery service (UK mainland). This includes unpacking, placement in your chosen room, and removal of all packaging.</p>
              <p>Delivery windows are confirmed by email 2 days before your delivery date. If you are not available to receive delivery, please contact us at least 48 hours in advance to reschedule. Additional charges may apply for failed deliveries.</p>
              <p>Risk of loss or damage passes to you on delivery. If your piece arrives damaged, photograph it immediately and notify us within 48 hours at <a href="mailto:hello@modulas.com" className="text-charcoal underline underline-offset-2">hello@modulas.com</a>.</p>
            </div>
          </section>

          <section id="returns">
            <h2 className="font-serif text-2xl text-charcoal mb-4">Returns & Cancellations</h2>
            <div className="space-y-4">
              <div className="border-l-2 border-black/10 pl-5">
                <h3 className="font-sans font-semibold text-charcoal text-[14px] mb-1">Standard (in-stock) products</h3>
                <p>You have 14 days from delivery to notify us that you wish to return a standard product, and a further 14 days to return it. The product must be in its original condition and packaging. Return postage costs are your responsibility unless the item is faulty.</p>
              </div>
              <div className="border-l-2 border-black/10 pl-5">
                <h3 className="font-sans font-semibold text-charcoal text-[14px] mb-1">Configured & bespoke products</h3>
                <p>Not eligible for return except in the case of a manufacturing defect. See the Bespoke section above.</p>
              </div>
              <div className="border-l-2 border-black/10 pl-5">
                <h3 className="font-sans font-semibold text-charcoal text-[14px] mb-1">Refunds</h3>
                <p>Refunds are issued to your original payment method within 10 business days of us receiving and inspecting the returned item.</p>
              </div>
            </div>
            <p className="mt-4">To initiate a return, email <a href="mailto:hello@modulas.com" className="text-charcoal underline underline-offset-2">hello@modulas.com</a> with your order number and reason for return.</p>
          </section>

          <section id="warranty">
            <h2 className="font-serif text-2xl text-charcoal mb-4">Warranty</h2>
            <div className="space-y-3">
              <p>All Modulas products come with the following warranties from the date of delivery:</p>
              <div className="overflow-hidden rounded-xl border border-black/8 divide-y divide-black/6">
                {[
                  ["Structural frame", "Lifetime — covers joinery, welds, and structural integrity."],
                  ["Upholstery & fabric", "5 years — covers stitching, springs, and foam degradation under normal use."],
                  ["Timber surfaces", "10 years — covers delamination, veneer lifting, and structural splitting."],
                  ["Metal components", "5 years — covers corrosion and mechanical failure."],
                  ["Electrical (lighting)", "2 years — covers component failure."],
                ].map(([component, coverage]) => (
                  <div key={component as string} className="grid grid-cols-[180px_1fr] gap-4 px-6 py-4">
                    <span className="font-sans font-semibold text-charcoal text-[13px]">{component}</span>
                    <span className="text-[13px]">{coverage}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2">Warranties do not cover normal wear and tear, damage from improper use or cleaning, or modifications made by third parties. Warranties are non-transferable.</p>
              <p>To make a warranty claim, email <a href="mailto:hello@modulas.com" className="text-charcoal underline underline-offset-2">hello@modulas.com</a> with your order number and photographs of the issue.</p>
            </div>
          </section>

          <section id="liability">
            <h2 className="font-serif text-2xl text-charcoal mb-4">Liability</h2>
            <div className="space-y-3">
              <p>Nothing in these Terms limits our liability for death or personal injury caused by negligence, fraudulent misrepresentation, or any other liability that cannot be excluded by law.</p>
              <p>Subject to the above, our total liability to you for any claim arising out of or in connection with a purchase shall not exceed the price you paid for the relevant product.</p>
              <p>We are not liable for indirect or consequential losses including loss of profit, loss of business, or damage to data or reputation.</p>
            </div>
          </section>

          <section id="governing-law">
            <h2 className="font-serif text-2xl text-charcoal mb-4">Governing Law</h2>
            <p>These Terms are governed by the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales, without prejudice to your right to bring proceedings in the country where you are resident if you are a consumer.</p>
            <p className="mt-3">For disputes we cannot resolve directly, you may use the EU Online Dispute Resolution platform at <a href="https://ec.europa.eu/odr" className="text-charcoal underline underline-offset-2">ec.europa.eu/odr</a>.</p>
          </section>

          <section id="contact">
            <h2 className="font-serif text-2xl text-charcoal mb-4">Contact</h2>
            <p>For questions about your order or these Terms:</p>
            <div className="mt-4 rounded-xl border border-black/8 p-6 space-y-1">
              <p className="font-sans font-semibold text-charcoal">Modulas Ltd — Customer Services</p>
              <p>Opp. Newtown Square Mall, Sector 95, Gurgaon, Haryana – 122505, India</p>
              <a href="mailto:hello@modulas.com" className="text-charcoal underline underline-offset-2">hello@modulas.com</a>
              <p className="font-sans text-[13px] text-charcoal/50 mt-1">+44 20 7123 4567 · Mon–Fri 9:00–17:30 GMT</p>
            </div>
          </section>

        </article>
      </div>
    </div>
  );
}
