import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ModularHighlightProps {
  headline: string;
  body: string;
  cta: string;
  href: string;
  /** Hex or CSS colour used as the subtle background accent */
  accentColor?: string;
}

export function ModularHighlight({
  headline,
  body,
  cta,
  href,
  accentColor = "#B5926B",
}: ModularHighlightProps) {
  return (
    <section
      className="relative overflow-hidden py-20 px-6 lg:px-12"
      style={{
        background: `linear-gradient(135deg, ${accentColor}0f 0%, transparent 60%)`,
      }}
    >
      {/* Decorative circle */}
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full opacity-[0.06]"
        style={{ background: accentColor }}
        aria-hidden
      />

      <div className="mx-auto max-w-[1440px] flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Text */}
        <div className="max-w-xl">
          <p
            className="font-sans text-[10px] tracking-[0.35em] uppercase mb-3"
            style={{ color: accentColor }}
          >
            Modulas Configurator
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl text-charcoal dark:text-cream leading-tight">
            {headline}
          </h2>
          <p className="mt-4 font-sans text-sm leading-relaxed text-charcoal/55 dark:text-cream/55 max-w-md">
            {body}
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center lg:items-start gap-4 shrink-0">
          <Link
            href={href}
            className="inline-flex items-center gap-3 rounded-full px-8 py-4 font-sans text-[12px] tracking-[0.15em] uppercase text-cream transition-opacity hover:opacity-85"
            style={{ backgroundColor: accentColor }}
          >
            {cta}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <p className="font-sans text-[10px] text-charcoal/30 dark:text-cream/30 tracking-wide">
            No account required &nbsp;·&nbsp; Free to explore
          </p>
        </div>
      </div>

      {/* Three feature pills */}
      <div className="mx-auto max-w-[1440px] mt-12 flex flex-wrap gap-3">
        {[
          "Real-time 3D preview",
          "Material & finish selector",
          "Instant price update",
          "PDF export",
          "Share with your architect",
        ].map((feature) => (
          <span
            key={feature}
            className="rounded-full border border-black/8 dark:border-white/8 bg-white/60 dark:bg-white/5 px-4 py-1.5 font-sans text-[11px] text-charcoal/50 dark:text-cream/50 backdrop-blur-sm"
          >
            {feature}
          </span>
        ))}
      </div>
    </section>
  );
}
