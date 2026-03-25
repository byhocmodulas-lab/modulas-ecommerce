"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

const TABS = [
  { value: "",            label: "All Spaces" },
  { value: "living-room", label: "Living Room" },
  { value: "bedroom",     label: "Bedroom" },
  { value: "kitchen",     label: "Kitchen" },
  { value: "dining-room", label: "Dining" },
  { value: "study",       label: "Study & Office" },
  { value: "outdoor",     label: "Outdoor" },
] as const;

interface SpacesFilterTabsProps {
  active?: string;
}

export function SpacesFilterTabs({ active = "" }: SpacesFilterTabsProps) {
  const router   = useRouter();
  const pathname = usePathname();
  const params   = useSearchParams();

  function handleSelect(value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set("room", value);
    else       next.delete("room");
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  return (
    <div
      className="flex items-center gap-2 overflow-x-auto pb-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label="Filter by room type"
    >
      {TABS.map((tab) => {
        const isActive = tab.value === active;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive ? "true" : "false"}
            onClick={() => handleSelect(tab.value)}
            className={[
              "flex-none rounded-full border px-4 py-2 font-sans text-[11px] tracking-[0.12em] uppercase transition-all duration-200 whitespace-nowrap",
              isActive
                ? "border-charcoal bg-charcoal text-cream dark:border-cream dark:bg-cream dark:text-charcoal"
                : "border-black/15 dark:border-white/15 text-charcoal/55 dark:text-cream/55 hover:border-charcoal/40 dark:hover:border-cream/40 hover:text-charcoal dark:hover:text-cream",
            ].join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
