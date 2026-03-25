import { cn } from "@/lib/utils/format";

interface SkeletonProps {
  className?: string;
  rounded?:   "sm" | "md" | "lg" | "full";
}

const ROUNDED = {
  sm:   "rounded",
  md:   "rounded-md",
  lg:   "rounded-xl",
  full: "rounded-full",
};

export function Skeleton({ className, rounded = "md" }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn("shimmer-bg", ROUNDED[rounded], className)}
    />
  );
}
