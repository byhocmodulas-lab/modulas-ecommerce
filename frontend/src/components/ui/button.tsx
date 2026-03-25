import { forwardRef } from "react";
import { cn } from "@/lib/utils/format";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size    = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant;
  size?:     Size;
  loading?:  boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?:  boolean;
}

const VARIANT: Record<Variant, string> = {
  primary:   "bg-gold text-charcoal-950 hover:bg-gold-400 focus-visible:ring-gold/40 active:scale-[0.98]",
  secondary: "bg-charcoal dark:bg-cream text-cream dark:text-charcoal hover:bg-charcoal-700 dark:hover:bg-cream-300 focus-visible:ring-charcoal/30",
  outline:   "border border-charcoal/20 dark:border-cream/20 text-charcoal dark:text-cream hover:border-gold hover:text-gold focus-visible:ring-gold/30",
  ghost:     "text-charcoal/70 dark:text-cream/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-charcoal dark:hover:text-cream focus-visible:ring-charcoal/20",
  danger:    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500/40 active:scale-[0.98]",
};

const SIZE: Record<Size, string> = {
  sm: "h-8  px-4  text-[11px] gap-1.5",
  md: "h-10 px-6  text-[12px] gap-2",
  lg: "h-12 px-8  text-[12px] gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant  = "primary",
      size     = "md",
      loading  = false,
      leftIcon,
      rightIcon,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-sans tracking-[0.1em] uppercase transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          VARIANT[variant],
          SIZE[size],
          className,
        )}
        {...props}
      >
        {loading ? (
          <>
            <SpinnerIcon />
            <span>{children}</span>
          </>
        ) : (
          <>
            {leftIcon}
            <span>{children}</span>
            {rightIcon}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

function SpinnerIcon() {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2"
      className="animate-spin shrink-0"
      aria-hidden
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
