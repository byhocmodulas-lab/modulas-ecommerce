import Link from "next/link";
import { cn } from "@/lib/utils/format";

interface SectionHeaderProps {
  eyebrow?:  string;
  title:     string | React.ReactNode;
  subtitle?: string;
  cta?:      { label: string; href: string };
  align?:    "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  cta,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-gold">
          {eyebrow}
        </p>
      )}

      <div className={cn("flex items-end gap-8", align === "center" && "flex-col gap-0")}>
        <h2 className="font-serif text-display-md text-charcoal dark:text-cream">
          {title}
        </h2>

        {cta && align === "left" && (
          <Link
            href={cta.href}
            className="hidden sm:inline-flex shrink-0 items-center gap-2 pb-1 font-sans text-[12px] tracking-[0.12em] uppercase text-charcoal/50 dark:text-cream/50 hover:text-gold transition-colors"
          >
            {cta.label}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>

      {subtitle && (
        <p className={cn(
          "font-sans text-sm text-charcoal/55 dark:text-cream/55 leading-relaxed",
          align === "center" && "max-w-xl",
        )}>
          {subtitle}
        </p>
      )}

      {cta && align === "center" && (
        <Link
          href={cta.href}
          className="mt-2 inline-flex items-center gap-2 font-sans text-[12px] tracking-[0.12em] uppercase text-charcoal/50 dark:text-cream/50 hover:text-gold transition-colors"
        >
          {cta.label}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}
