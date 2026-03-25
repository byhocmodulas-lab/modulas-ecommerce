"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, ArrowRight, Trash2, X } from "lucide-react";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { useCartStore } from "@/lib/stores/cart-store";
import { formatPrice } from "@/lib/utils/format";

export default function WishlistPage() {
  const { items, remove, clear } = useWishlistStore();
  const { addItem, openDrawer }  = useCartStore();

  function handleAddToCart(item: typeof items[number]) {
    addItem({
      productId: item.productId,
      slug:      item.slug,
      name:      item.name,
      imageUrl:  item.imageUrl,
      quantity:  1,
      unitPrice: item.price,
    });
    openDrawer();
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-black/6 dark:border-white/6 bg-white dark:bg-charcoal-900 py-24 text-center">
        <Heart className="mx-auto mb-4 h-12 w-12 text-charcoal/12 dark:text-cream/12" />
        <p className="font-serif text-xl text-charcoal dark:text-cream mb-2">Your wishlist is empty</p>
        <p className="font-sans text-sm text-charcoal/40 dark:text-cream/40 mb-6 max-w-xs">
          Save pieces you love and come back to them any time.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
        >
          Browse Collection <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="font-sans text-sm text-charcoal/40 dark:text-cream/40">
          {items.length} {items.length === 1 ? "item" : "items"} saved
        </p>
        <button
          type="button"
          onClick={clear}
          className="font-sans text-[11px] tracking-[0.1em] uppercase text-charcoal/30 dark:text-cream/30 hover:text-red-500 transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Grid */}
      <ul className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item.productId}
            className="group relative rounded-2xl border border-black/6 dark:border-white/6 bg-white dark:bg-charcoal-900 overflow-hidden"
          >
            {/* Remove button */}
            <button
              type="button"
              onClick={() => remove(item.productId)}
              className="absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 dark:bg-charcoal-900/90 text-charcoal/30 dark:text-cream/30 hover:text-red-500 transition-colors shadow-sm"
              aria-label="Remove from wishlist"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            {/* Image */}
            <Link href={`/products/${item.slug}`} className="block">
              <div className="relative aspect-[4/3] overflow-hidden bg-cream dark:bg-charcoal-800">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ShoppingBag className="h-8 w-8 text-charcoal/20 dark:text-cream/20" />
                  </div>
                )}
              </div>
            </Link>

            {/* Info */}
            <div className="p-4">
              <Link
                href={`/products/${item.slug}`}
                className="font-serif text-lg leading-tight text-charcoal dark:text-cream hover:text-gold transition-colors"
              >
                {item.name}
              </Link>
              {item.material && (
                <p className="font-sans text-xs text-charcoal/40 dark:text-cream/40 mt-0.5">{item.material}</p>
              )}
              <div className="flex items-center justify-between mt-3">
                <p className="font-sans text-base font-medium text-charcoal dark:text-cream">
                  {formatPrice(item.price, item.currency)}
                </p>
                <button
                  type="button"
                  onClick={() => handleAddToCart(item)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 font-sans text-[10px] tracking-[0.12em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
                >
                  <ShoppingBag className="h-3 w-3" />
                  Add to cart
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
