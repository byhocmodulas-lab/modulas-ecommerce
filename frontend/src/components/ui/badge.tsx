import { cn } from "@/lib/utils/format";

type Variant = "gold" | "charcoal" | "cream" | "success" | "warning" | "error";

interface BadgeProps {
  variant?:  Variant;
  children:  React.ReactNode;
  className?: string;
  dot?:      boolean;
}

const STYLES: Record<Variant, string> = {
  gold:     "bg-gold/10 text-gold border-gold/20",
  charcoal: "bg-charcoal/8 text-charcoal dark:bg-cream/8 dark:text-cream border-charcoal/12 dark:border-cream/12",
  cream:    "bg-cream text-charcoal border-black/10",
  success:  "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400",
  warning:  "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400",
  error:    "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400",
};

export function Badge({ variant = "charcoal", children, className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5",
        "font-sans text-[10px] tracking-[0.12em] uppercase",
        STYLES[variant],
        className,
      )}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full bg-current")}
          aria-hidden
        />
      )}
      {children}
    </span>
  );
}
