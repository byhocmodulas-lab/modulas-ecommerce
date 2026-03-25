import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accessibility — Modulas",
  description: "Our commitment to making modulas.com accessible to everyone.",
};

const SECTIONS = [
  { id: "commitment",   label: "Our Commitment" },
  { id: "standards",    label: "Standards We Follow" },
  { id: "features",     label: "Accessibility Features" },
  { id: "known-issues", label: "Known Issues" },
  { id: "tools",        label: "Assistive Technology" },
  { id: "feedback",     label: "Feedback & Contact" },
];

export default function AccessibilityPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="border-b border-black/6 px-6 py-16 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-3 font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40">Legal</p>
          <h1 className="font-serif text-5xl text-charcoal mb-4">Accessibility Statement</h1>
          <p className="font-sans text-[13px] text-charcoal/40">Last reviewed: 1 March 2026 · Applies to modulas.com</p>
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

          <section id="commitment">
            <h2 className="font-serif text-2xl text-charcoal mb-4">Our Commitment</h2>
            <p>Modulas is committed to making our website usable by as many people as possible. We believe that good design is accessible design — and that a website that excludes people is a website that has failed.</p>
            <p className="mt-3">We work to ensure that modulas.com is perceivable, operable, understandable, and robust for all visitors — including those using screen readers, keyboard navigation, voice control, or other assistive technologies.</p>
            <p className="mt-3">This statement covers the website at <strong className="text-charcoal">modulas.com</strong>. It was prepared in accordance with the Public Sector Bodies (Websites and Mobile Applications) Accessibility Regulations 2018, though we apply the same standards as a private sector retailer as a matter of good practice.</p>
          </section>

          <section id="standards">
            <h2 className="font-serif text-2xl text-charcoal mb-4">Standards We Follow</h2>
            <p>We aim to conform to <strong className="text-charcoal">WCAG 2.2 Level AA</strong> — the Web Content Accessibility Guidelines published by the W3C. These guidelines explain how to make web content more accessible to people with disabilities.</p>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              {[
                ["Perceivable", "Content is presented in ways that all users can perceive — including text alternatives for images and captions for media."],
                ["Operable", "All functionality is accessible via keyboard as well as mouse. No time limits on essential actions."],
                ["Understandable", "Text is readable, pages behave predictably, and errors are clearly identified and explained."],
                ["Robust", "Content is compatible with current and future assistive technologies, including screen readers."],
              ].map(([title, desc]) => (
                <div key={title as string} className="rounded-xl border border-black/8 p-5">
                  <h3 className="font-sans font-semibold text-charcoal text-[14px] mb-2">{title}</h3>
                  <p className="font-sans text-[13px] text-charcoal/60 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="features">
            <h2 className="font-serif text-2xl text-charcoal mb-4">Accessibility Features</h2>
            <p className="mb-4">We have built the following accessibility features into modulas.com:</p>
            <div className="space-y-3">
              {[
                ["Skip to content link", "A visible 'Skip to main content' link appears at the top of every page when you tab to it, letting keyboard users bypass the navigation."],
                ["Semantic HTML", "We use proper heading hierarchy (h1–h4), landmark regions (header, nav, main, footer), and ARIA labels to help screen readers understand page structure."],
                ["Keyboard navigation", "Every interactive element — buttons, links, form fields, and modals — is reachable and operable with a keyboard alone. Focus indicators are clearly visible."],
                ["Colour contrast", "Text and interactive elements meet or exceed the WCAG AA minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text."],
                ["Alt text", "All meaningful images have descriptive alt attributes. Decorative images use empty alt=\"\" so screen readers skip them."],
                ["Form labels", "Every form field is associated with a visible label. Required fields and error messages are communicated both visually and to assistive technologies."],
                ["Resizable text", "Our layouts work correctly at up to 200% browser zoom without loss of content or functionality."],
                ["Reduced motion", "Animations and transitions respect the prefers-reduced-motion media query — users who have reduced motion enabled in their OS will see a simplified experience."],
                ["Dark mode", "The site honours the prefers-color-scheme system setting, providing a high-contrast dark theme automatically for users who prefer it."],
                ["Focus management", "Dialogs and drawers (such as the cart and mobile menu) trap focus correctly and restore focus to the trigger element when closed."],
              ].map(([feature, desc]) => (
                <div key={feature as string} className="flex gap-4 py-4 border-b border-black/6 last:border-0">
                  <svg className="shrink-0 mt-0.5 text-charcoal/30" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <div>
                    <p className="font-sans font-semibold text-charcoal text-[14px] mb-1">{feature}</p>
                    <p className="font-sans text-[13px] text-charcoal/60 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="known-issues">
            <h2 className="font-serif text-2xl text-charcoal mb-4">Known Issues</h2>
            <p className="mb-4">We are continuously improving. The following known issues are in our backlog:</p>
            <div className="rounded-xl border border-black/8 overflow-hidden divide-y divide-black/6">
              {[
                ["3D Product Configurator", "Medium", "The WebGL canvas used in the 3D configurator is not accessible to screen reader users. We are developing a structured text-based alternative interface. Target: Q3 2026."],
                ["Video content (Journal)", "Low", "Some embedded video content in journal articles lacks captions. We are retroactively adding captions and have made it mandatory for all new video content from January 2026."],
                ["PDF product data sheets", "Low", "Some downloadable product specification PDFs are not tagged for accessibility. We are working through these systematically."],
              ].map(([area, severity, desc]) => (
                <div key={area as string} className="p-5 grid sm:grid-cols-[1fr_auto] gap-3">
                  <div>
                    <p className="font-sans font-semibold text-charcoal text-[14px] mb-1">{area}</p>
                    <p className="font-sans text-[13px] text-charcoal/60">{desc}</p>
                  </div>
                  <span className={`shrink-0 self-start font-sans text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full ${severity === "Medium" ? "bg-amber-50 text-amber-700" : "bg-black/5 text-charcoal/50"}`}>
                    {severity}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section id="tools">
            <h2 className="font-serif text-2xl text-charcoal mb-4">Assistive Technology We Test With</h2>
            <p className="mb-4">We test modulas.com with the following assistive technologies as part of our regular QA process:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                ["NVDA", "Windows screen reader"],
                ["JAWS", "Windows screen reader"],
                ["VoiceOver", "macOS / iOS screen reader"],
                ["TalkBack", "Android screen reader"],
                ["Dragon NaturallySpeaking", "Voice control"],
                ["Keyboard only", "Chrome, Firefox, Safari"],
              ].map(([tool, desc]) => (
                <div key={tool as string} className="rounded-xl border border-black/8 p-4">
                  <p className="font-sans font-semibold text-charcoal text-[13px] mb-0.5">{tool}</p>
                  <p className="font-sans text-[12px] text-charcoal/50">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="feedback">
            <h2 className="font-serif text-2xl text-charcoal mb-4">Feedback & Contact</h2>
            <p>If you experience any accessibility barriers on our website, or if you need content in a different format (such as large print, audio, or easy read), please contact us:</p>
            <div className="mt-5 rounded-xl border border-black/8 p-6 space-y-1">
              <p className="font-sans font-semibold text-charcoal">Modulas Accessibility Team</p>
              <a href="mailto:accessibility@modulas.com" className="text-charcoal underline underline-offset-2">accessibility@modulas.com</a>
              <p className="font-sans text-[13px] text-charcoal/50 mt-1">We aim to respond within 2 working days.</p>
            </div>
            <p className="mt-5">If you are not satisfied with our response, you can contact the <a href="https://www.equalityhumanrights.com" className="text-charcoal underline underline-offset-2">Equality and Human Rights Commission (EHRC)</a> — the enforcement body for the Equality Act 2010 in England, Scotland, and Wales.</p>
            <div className="mt-8 rounded-xl bg-cream p-6">
              <p className="font-sans text-[13px] text-charcoal/70">
                Alternatively, you can use our standard <Link href="/contact" className="text-charcoal underline underline-offset-2">contact page</Link> and select "Accessibility" as the enquiry type. We are committed to resolving accessibility issues as a priority.
              </p>
            </div>
          </section>

        </article>
      </div>
    </div>
  );
}
