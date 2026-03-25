import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy — Modulas",
  description: "How Modulas uses cookies and how to manage your preferences.",
};

const SECTIONS = [
  { id: "what-are-cookies",   label: "What Are Cookies" },
  { id: "cookies-we-use",     label: "Cookies We Use" },
  { id: "third-party",        label: "Third-Party Cookies" },
  { id: "manage",             label: "Managing Cookies" },
  { id: "updates",            label: "Policy Updates" },
  { id: "contact",            label: "Contact" },
];

const COOKIE_TABLE = [
  {
    category: "Strictly Necessary",
    canOptOut: false,
    description: "Essential for the website to function. Cannot be disabled.",
    cookies: [
      { name: "modulas_token", purpose: "Authentication — keeps you signed in", duration: "Session" },
      { name: "modulas_cart",  purpose: "Stores your cart contents between pages", duration: "30 days" },
      { name: "__csrf",        purpose: "Cross-site request forgery protection", duration: "Session" },
    ],
  },
  {
    category: "Functional",
    canOptOut: true,
    description: "Remember your preferences to improve your experience.",
    cookies: [
      { name: "modulas_currency",  purpose: "Remembers your chosen currency", duration: "1 year" },
      { name: "modulas_locale",    purpose: "Remembers your language preference", duration: "1 year" },
      { name: "modulas_theme",     purpose: "Remembers light/dark mode preference", duration: "1 year" },
    ],
  },
  {
    category: "Analytics",
    canOptOut: true,
    description: "Help us understand how visitors use our website. All data is anonymised.",
    cookies: [
      { name: "_ga",    purpose: "Google Analytics — distinguishes users", duration: "2 years" },
      { name: "_ga_*",  purpose: "Google Analytics — session state", duration: "2 years" },
      { name: "_gcl_au", purpose: "Google Ads — conversion tracking", duration: "90 days" },
    ],
  },
  {
    category: "Marketing",
    canOptOut: true,
    description: "Used to show you relevant ads on other websites and measure ad effectiveness.",
    cookies: [
      { name: "_fbp",   purpose: "Meta Pixel — ad measurement and retargeting", duration: "90 days" },
      { name: "_pin_unauth", purpose: "Pinterest — anonymous ad measurement", duration: "1 year" },
    ],
  },
];

export default function CookiePolicyPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="border-b border-black/6 px-6 py-16 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-3 font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40">Legal</p>
          <h1 className="font-serif text-5xl text-charcoal mb-4">Cookie Policy</h1>
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
        <article className="max-w-2xl space-y-12 font-sans text-[15px] leading-relaxed text-charcoal/70">

          <section id="what-are-cookies">
            <h2 className="font-serif text-2xl text-charcoal mb-4">What Are Cookies?</h2>
            <p>Cookies are small text files placed on your device when you visit a website. They allow the site to remember information about your visit — such as whether you are logged in, what's in your cart, or your display preferences.</p>
            <p className="mt-3">Similar technologies — such as local storage, session storage, and pixel tags — work in comparable ways and are covered by this policy.</p>
          </section>

          <section id="cookies-we-use">
            <h2 className="font-serif text-2xl text-charcoal mb-4">Cookies We Use</h2>
            <p className="mb-6">We group our cookies into four categories. Only strictly necessary cookies are active without your consent.</p>
            <div className="space-y-6">
              {COOKIE_TABLE.map((group) => (
                <div key={group.category} className="rounded-2xl border border-black/8 overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 bg-cream/50 border-b border-black/6">
                    <div>
                      <h3 className="font-sans font-semibold text-charcoal text-[14px]">{group.category}</h3>
                      <p className="font-sans text-[12px] text-charcoal/50 mt-0.5">{group.description}</p>
                    </div>
                    <span className={`shrink-0 font-sans text-[10px] tracking-[0.12em] uppercase px-3 py-1 rounded-full ${group.canOptOut ? "bg-black/5 text-charcoal/50" : "bg-charcoal-950 text-cream"}`}>
                      {group.canOptOut ? "Optional" : "Required"}
                    </span>
                  </div>
                  <div className="divide-y divide-black/5">
                    {group.cookies.map((cookie) => (
                      <div key={cookie.name} className="grid grid-cols-[1fr_auto] gap-4 px-6 py-4">
                        <div>
                          <p className="font-mono text-[12px] text-charcoal bg-black/4 inline-block px-2 py-0.5 rounded mb-1">{cookie.name}</p>
                          <p className="font-sans text-[13px] text-charcoal/60">{cookie.purpose}</p>
                        </div>
                        <span className="shrink-0 font-sans text-[11px] text-charcoal/40 whitespace-nowrap pt-0.5">{cookie.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="third-party">
            <h2 className="font-serif text-2xl text-charcoal mb-4">Third-Party Cookies</h2>
            <p>Some cookies are set by third-party services that appear on our pages. We do not control these cookies — they are governed by the privacy policies of those third parties:</p>
            <div className="mt-4 space-y-3">
              {[
                ["Google", "analytics.google.com/analytics/terms", "Analytics and advertising"],
                ["Meta (Facebook/Instagram)", "www.facebook.com/privacy/policy", "Advertising and measurement"],
                ["Pinterest", "policy.pinterest.com/privacy-policy", "Advertising and measurement"],
                ["Stripe", "stripe.com/privacy", "Payment security"],
                ["Clerk", "clerk.com/privacy", "Authentication"],
              ].map(([name, , purpose]) => (
                <div key={name as string} className="flex gap-3">
                  <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-charcoal/25" />
                  <p><strong className="text-charcoal">{name}:</strong> {purpose}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="manage">
            <h2 className="font-serif text-2xl text-charcoal mb-4">Managing Your Cookie Preferences</h2>
            <p className="mb-4">You can change your cookie preferences at any time:</p>
            <div className="space-y-4">
              <div className="border-l-2 border-black/10 pl-5">
                <h3 className="font-sans font-semibold text-charcoal text-[14px] mb-1">Cookie banner</h3>
                <p>When you first visit our site, a cookie banner lets you accept all, reject optional, or customise your choices. You can reopen this at any time using the "Cookie Settings" link in our footer.</p>
              </div>
              <div className="border-l-2 border-black/10 pl-5">
                <h3 className="font-sans font-semibold text-charcoal text-[14px] mb-1">Browser settings</h3>
                <p>Most browsers allow you to block or delete cookies via their settings. Note that blocking strictly necessary cookies will prevent the website from functioning correctly.</p>
              </div>
              <div className="border-l-2 border-black/10 pl-5">
                <h3 className="font-sans font-semibold text-charcoal text-[14px] mb-1">Opt-out tools</h3>
                <p>For analytics cookies, you can install the <a href="https://tools.google.com/dlpage/gaoptout" className="text-charcoal underline underline-offset-2">Google Analytics opt-out browser add-on</a>. For advertising cookies, visit <a href="https://www.youronlinechoices.com" className="text-charcoal underline underline-offset-2">Your Online Choices</a>.</p>
              </div>
            </div>
          </section>

          <section id="updates">
            <h2 className="font-serif text-2xl text-charcoal mb-4">Policy Updates</h2>
            <p>We may update this Cookie Policy from time to time to reflect changes in the cookies we use or applicable law. When we make significant changes, we will update the date at the top of this page and, where appropriate, notify you via email or a banner on our website.</p>
          </section>

          <section id="contact">
            <h2 className="font-serif text-2xl text-charcoal mb-4">Contact</h2>
            <p>If you have questions about our use of cookies, please contact:</p>
            <div className="mt-4 rounded-xl border border-black/8 p-6 space-y-1">
              <p className="font-sans font-semibold text-charcoal">Modulas Home Solutions Pvt. Ltd.</p>
              <p>Opp. Newtown Square Mall, Sector 95, Gurgaon, Haryana – 122505, India</p>
              <a href="mailto:info@modulas.in" className="text-charcoal underline underline-offset-2">info@modulas.in</a>
            </div>
          </section>

        </article>
      </div>
    </div>
  );
}
