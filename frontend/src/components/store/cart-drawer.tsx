"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { formatPrice } from "@/lib/utils/format";
import { ordersApi } from "@/lib/api/client";

export function CartDrawer() {
  const { drawerOpen, closeDrawer, items, removeItem, updateQty, subtotal, totalItems } = useCartStore();
  const { accessToken } = useAuthStore();
  const overlayRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const sub = subtotal();

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = `${Math.min(100, (sub / 500) * 100)}%`;
    }
  }, [sub]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  // Sync remove with API
  async function handleRemove(productId: string, configurationId?: string) {
    removeItem(productId, configurationId);
    if (!accessToken) return;
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"}/orders/cart/items/${productId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${accessToken}` } },
      );
    } catch {
      // optimistic — ignore network error in drawer
    }
  }

  // Sync qty change with API
  async function handleQtyChange(productId: string, quantity: number, configurationId?: string) {
    updateQty(productId, quantity, configurationId);
    if (!accessToken) return;
    try {
      const item = items.find((i) => i.productId === productId && i.configurationId === configurationId);
      if (!item) return;
      await ordersApi.addToCart(accessToken, {
        productId,
        configurationId,
        quantity,
        unitPrice: item.unitPrice,
        finish: item.finish,
      });
    } catch {
      // optimistic
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={closeDrawer}
        className={[
          "fixed inset-0 z-40 bg-charcoal-950/40 backdrop-blur-sm transition-opacity duration-300",
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
        className={[
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white dark:bg-charcoal-950",
          "shadow-2xl transition-transform duration-300 ease-out",
          drawerOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/6 dark:border-white/6">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-5 w-5 text-charcoal dark:text-cream" />
            <h2 className="font-serif text-xl text-charcoal dark:text-cream">
              Cart
              {totalItems() > 0 && (
                <span className="ml-2 font-sans text-sm text-charcoal/40 dark:text-cream/40">
                  ({totalItems()})
                </span>
              )}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="flex h-8 w-8 items-center justify-center rounded-full text-charcoal/40 dark:text-cream/40 hover:text-charcoal dark:hover:text-cream hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Close cart"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center px-6">
              <ShoppingBag className="h-14 w-14 text-charcoal/12 dark:text-cream/12 mb-5" />
              <p className="font-serif text-xl text-charcoal dark:text-cream mb-2">Your cart is empty</p>
              <p className="font-sans text-sm text-charcoal/40 dark:text-cream/40 mb-6">
                Discover our handcrafted collection.
              </p>
              <Link
                href="/products"
                onClick={closeDrawer}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
              >
                Browse Collection <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-black/5 dark:divide-white/5">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.configurationId ?? "std"}`}
                  className="flex gap-4 px-6 py-4"
                >
                  {/* Image */}
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeDrawer}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-none bg-cream dark:bg-charcoal-800"
                  >
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-charcoal/20 dark:text-cream/20" />
                      </div>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={closeDrawer}
                        className="font-serif text-base leading-tight text-charcoal dark:text-cream hover:text-gold transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.productId, item.configurationId)}
                        className="shrink-0 p-1 rounded text-charcoal/25 dark:text-cream/25 hover:text-red-500 transition-colors"
                        aria-label="Remove"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {item.finish && (
                      <p className="font-sans text-[11px] text-charcoal/40 dark:text-cream/40">
                        {item.finish}
                      </p>
                    )}

                    <div className="mt-auto flex items-center justify-between">
                      {/* Qty stepper */}
                      <div className="flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 px-2.5 py-1">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(item.productId, item.quantity - 1, item.configurationId)}
                          className="text-charcoal/40 dark:text-cream/40 hover:text-charcoal dark:hover:text-cream transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-5 text-center font-sans text-xs text-charcoal dark:text-cream">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(item.productId, item.quantity + 1, item.configurationId)}
                          className="text-charcoal/40 dark:text-cream/40 hover:text-charcoal dark:hover:text-cream transition-colors"
                          aria-label="Increase"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <p className="font-sans text-sm font-medium text-charcoal dark:text-cream">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer — only show when there are items */}
        {items.length > 0 && (
          <div className="border-t border-black/6 dark:border-white/6 px-6 py-5 space-y-4">
            {/* Free shipping indicator */}
            {sub < 500 && (
              <div className="rounded-xl bg-gold/8 px-4 py-3">
                <p className="font-sans text-xs text-charcoal dark:text-cream">
                  Add{" "}
                  <span className="font-medium text-gold">{formatPrice(500 - sub)}</span>
                  {" "}more for free white-glove delivery
                </p>
                <div className="mt-2 h-1 rounded-full bg-black/8 dark:bg-white/8">
                  <div
                    ref={progressRef}
                    className="h-1 rounded-full bg-gold transition-all"
                  />
                </div>
              </div>
            )}
            {sub >= 500 && (
              <p className="font-sans text-xs text-emerald-600 text-center">
                ✓ Free white-glove delivery included
              </p>
            )}

            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="font-sans text-sm text-charcoal/60 dark:text-cream/60">Subtotal</span>
              <span className="font-serif text-xl text-charcoal dark:text-cream">{formatPrice(sub)}</span>
            </div>

            {/* CTAs */}
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gold font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal-950 hover:bg-gold-400 transition-all active:scale-[0.98]"
            >
              Checkout <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/cart"
              onClick={closeDrawer}
              className="flex h-10 w-full items-center justify-center font-sans text-[11px] tracking-[0.1em] uppercase text-charcoal/40 dark:text-cream/40 hover:text-charcoal dark:hover:text-cream transition-colors"
            >
              View full cart
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
