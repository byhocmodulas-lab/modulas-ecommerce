"use client";

import { useCartStore } from "@/lib/stores/cart-store";

export function CartIcon() {
  const { totalItems, openDrawer } = useCartStore();
  const count = totalItems();

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={count ? `Cart — ${count} items` : "Open cart"}
      className="relative flex h-9 w-9 items-center justify-center rounded-full text-charcoal/60 dark:text-cream/60 hover:text-charcoal dark:hover:text-cream hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
    >
      <BagIcon />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-sans font-semibold text-charcoal-950">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}

function BagIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
