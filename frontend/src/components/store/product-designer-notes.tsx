import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/format";

export interface DesignerProfile {
  name: string;
  title: string;
  studioName: string;
  portraitUrl?: string;
  profileHref?: string;
  notes: string[];
  /** Optional material/inspiration photograph shown alongside notes */
  inspirationImageUrl?: string;
  inspirationImageAlt?: string;
}

interface ProductDesignerNotesProps {
  designer?: DesignerProfile;
  className?: string;
}

export function ProductDesignerNotes({ designer, className }: ProductDesignerNotesProps) {
  if (!designer) return null;

  return (
    <div className={cn("space-y-8", className)}>

      {/* Section label */}
      <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-gold">
        Designer Notes
      </p>

      {/* Designer identity */}
      <div className="flex items-center gap-4">
        {/* Portrait */}
        <div className="relative h-14 w-14 shrink-0 rounded-full overflow-hidden ring-2 ring-gold/20 ring-offset-2 ring-offset-white dark:ring-offset-charcoal-900">
          {designer.portraitUrl ? (
            <Image
              src={designer.portraitUrl}
              alt={designer.name}
              fill
              sizes="56px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
              <PersonIcon />
            </div>
          )}
        </div>
        {/* Name + title */}
        <div>
          <p className="font-serif text-lg text-charcoal dark:text-cream leading-snug">
            {designer.name}
          </p>
          <p className="font-sans text-[11px] text-gold mt-0.5">
            {designer.title}
          </p>
          <p className="font-sans text-[11px] text-charcoal/40 dark:text-cream/40">
            {designer.studioName}
          </p>
        </div>
      </div>

      {/* Quote marks + notes */}
      <div className="relative">
        {/* Large decorative quote */}
        <span
          className="absolute -top-2 -left-1 font-serif text-6xl text-gold/15 dark:text-gold/10 leading-none select-none"
          aria-hidden
        >
          &#8220;
        </span>
        <div className="pl-5 space-y-4">
          {designer.notes.map((paragraph, i) => (
            <p
              key={i}
              className={cn(
                "font-sans leading-relaxed",
                i === 0
                  ? "text-base text-charcoal dark:text-cream italic font-light"
                  : "text-sm text-charcoal/60 dark:text-cream/60",
              )}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Inspiration image */}
      {designer.inspirationImageUrl && (
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-cream dark:bg-charcoal-800">
          <Image
            src={designer.inspirationImageUrl}
            alt={designer.inspirationImageAlt ?? "Design inspiration"}
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/30 to-transparent" />
          <span className="absolute bottom-3 left-4 font-sans text-[9px] tracking-[0.2em] uppercase text-cream/60">
            Studio Inspiration
          </span>
        </div>
      )}

      {/* Link to designer profile */}
      {designer.profileHref && (
        <Link
          href={designer.profileHref}
          className="inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.15em] uppercase text-gold hover:gap-3.5 transition-all duration-200"
        >
          Meet {designer.name.split(" ")[0]}
          <ArrowRightIcon />
        </Link>
      )}
    </div>
  );
}

function PersonIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold/40">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function ArrowRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
