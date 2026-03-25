"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import { useAuthStore } from "@/lib/stores/auth-store";
import { ordersApi } from "@/lib/api/client";

// Cart item shape from the API
interface CartItemData {
  productId: string;
  configurationId?: string;
  quantity: number;
  unitPrice: number;
  finish?: string;
  name?: string;
  slug?: string;
  imageUrl?: string;
}

interface CartData {
  id: string;
  userId: string;
  items: CartItemData[];
  updatedAt: string;
}

export default function CartPage() {
  const { accessToken, user } = useAuthStore();
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    ordersApi.getCart(accessToken)
      .then((data) => setCart(data as CartData))
      .catch(() => setCart(null))
      .finally(() => setLoading(false));
  }, [accessToken]);

  async function handleRemove(productId: string) {
    if (!accessToken) return;
    setUpdatingId(productId);
    try {
      const updated = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"}/orders/cart/items/${productId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${accessToken}` }, credentials: "include" },
      );
      if (updated.ok) {
        const data = await updated.json();
        setCart(data as CartData);
      }
    } finally {
      setUpdatingId(null);
    }
  }

  const subtotal = cart?.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0) ?? 0;
  const shippingFree = subtotal >= 500;
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount;

  // ── Empty / loading states ──────────────────────────────────────

  if (!accessToken) {
    return (
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 py-24 text-center">
        <ShoppingBag className="mx-auto mb-6 h-16 w-16 text-charcoal/15" />
        <h1 className="font-serif text-3xl text-charcoal dark:text-cream mb-4">Your cart</h1>
        <p className="font-sans text-sm text-charcoal/50 dark:text-cream/50 mb-8">
          Sign in to view your saved items.
        </p>
        <Link
          href="/login?next=/cart"
          className="inline-flex h-12 items-center rounded-full bg-charcoal px-8 font-sans text-[12px] tracking-[0.12em] uppercase text-cream hover:bg-charcoal-800 transition-colors"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 py-16">
        <div className="h-8 w-48 animate-pulse rounded bg-charcoal/8 mb-10" />
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-5 rounded-2xl border border-black/5 p-5">
                <div className="h-28 w-28 animate-pulse rounded-xl bg-charcoal/8 shrink-0" />
                <div className="flex-1 space-y-3 pt-1">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-charcoal/8" />
                  <div className="h-3 w-1/3 animate-pulse rounded bg-charcoal/8" />
                  <div className="h-4 w-1/4 animate-pulse rounded bg-charcoal/8" />
                </div>
              </div>
            ))}
          </div>
          <div className="h-80 animate-pulse rounded-2xl bg-charcoal/5" />
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 py-24 text-center">
        <ShoppingBag className="mx-auto mb-6 h-16 w-16 text-charcoal/15 dark:text-cream/15" />
        <h1 className="font-serif text-3xl text-charcoal dark:text-cream mb-3">Your cart is empty</h1>
        <p className="font-sans text-sm text-charcoal/50 dark:text-cream/50 mb-8 max-w-sm mx-auto">
          Discover our handcrafted collection and find the perfect piece for your home.
        </p>
        <Link
          href="/products"
          className="inline-flex h-12 items-center gap-2 rounded-full bg-gold px-8 font-sans text-[12px] tracking-[0.12em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
        >
          Browse Collection
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  // ── Filled cart ─────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-[1440px] px-6 lg:px-12 py-10">
      <h1 className="mb-8 font-serif text-3xl text-charcoal dark:text-cream">
        Your cart{" "}
        <span className="font-sans text-base text-charcoal/40 dark:text-cream/40">
          ({cart.items.length} {cart.items.length === 1 ? "item" : "items"})
        </span>
      </h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* ── Item list ─────────────────────────────────────────── */}
        <ul className="space-y-4" role="list">
          {cart.items.map((item) => (
            <li
              key={`${item.productId}-${item.configurationId ?? "std"}`}
              className="flex gap-5 rounded-2xl border border-black/6 dark:border-white/6 bg-white dark:bg-charcoal-900 p-5"
            >
              {/* Image */}
              <Link
                href={`/products/${item.slug ?? item.productId}`}
                className="relative h-28 w-28 shrink-0 overflow-hidden rounded-none bg-cream dark:bg-charcoal-800"
              >
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.name ?? "Product"} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ShoppingBag className="h-8 w-8 text-charcoal/20 dark:text-cream/20" />
                  </div>
                )}
              </Link>

              {/* Info */}
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/products/${item.slug ?? item.productId}`}
                      className="font-serif text-lg leading-tight text-charcoal dark:text-cream hover:text-gold transition-colors"
                    >
                      {item.name ?? "Product"}
                    </Link>
                    {item.finish && (
                      <p className="mt-0.5 font-sans text-xs text-charcoal/40 dark:text-cream/40">
                        Finish: {item.finish}
                      </p>
                    )}
                    {item.configurationId && (
                      <p className="mt-0.5 font-sans text-xs text-gold/70">
                        Custom configuration
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(item.productId)}
                    disabled={updatingId === item.productId}
                    className="shrink-0 rounded-lg p-1.5 text-charcoal/30 dark:text-cream/30 hover:text-red-500 transition-colors disabled:opacity-40"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Qty + price row */}
                <div className="mt-auto flex items-center justify-between">
                  {/* Quantity stepper (display only — add mutation here if needed) */}
                  <div className="flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 px-3 py-1.5">
                    <button
                      type="button"
                      className="text-charcoal/40 dark:text-cream/40 hover:text-charcoal dark:hover:text-cream transition-colors disabled:opacity-30"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center font-sans text-sm text-charcoal dark:text-cream">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      className="text-charcoal/40 dark:text-cream/40 hover:text-charcoal dark:hover:text-cream transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-sans text-base font-medium text-charcoal dark:text-cream">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="font-sans text-xs text-charcoal/40 dark:text-cream/40">
                        {formatPrice(item.unitPrice)} each
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* ── Order summary ─────────────────────────────────────── */}
        <aside className="sticky top-24 h-fit rounded-2xl border border-black/6 dark:border-white/6 bg-white dark:bg-charcoal-900 p-6">
          <h2 className="mb-5 font-serif text-xl text-charcoal dark:text-cream">Order summary</h2>

          {/* Line items */}
          <dl className="space-y-3 font-sans text-sm">
            <div className="flex justify-between">
              <dt className="text-charcoal/60 dark:text-cream/60">Subtotal</dt>
              <dd className="font-medium text-charcoal dark:text-cream">{formatPrice(subtotal)}</dd>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <dt>Promo discount (10%)</dt>
                <dd>−{formatPrice(discount)}</dd>
              </div>
            )}

            <div className="flex justify-between">
              <dt className="text-charcoal/60 dark:text-cream/60">Shipping</dt>
              <dd className={shippingFree ? "text-emerald-600 font-medium" : "text-charcoal dark:text-cream"}>
                {shippingFree ? "Free" : "Calculated at checkout"}
              </dd>
            </div>

            {!shippingFree && (
              <div>
                <dd className="text-xs text-charcoal/40 dark:text-cream/40">
                  Free white-glove delivery on orders over £500
                </dd>
              </div>
            )}

            <div className="my-2 border-t border-black/6 dark:border-white/6" />

            <div className="flex justify-between text-base">
              <dt className="font-medium text-charcoal dark:text-cream">Total</dt>
              <dd className="font-serif text-xl text-charcoal dark:text-cream">{formatPrice(total)}</dd>
            </div>
          </dl>

          {/* Promo code */}
          <div className="mt-5">
            <label className="mb-1.5 block font-sans text-xs font-medium text-charcoal/60 dark:text-cream/60">
              Promo code
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-charcoal/30 dark:text-cream/30" />
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="MODULAS10"
                  className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent py-2 pl-8 pr-3 font-sans text-sm text-charcoal dark:text-cream placeholder:text-charcoal/25 dark:placeholder:text-cream/25 focus:border-gold/60 focus:outline-none transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (promoCode === "MODULAS10") setPromoApplied(true);
                }}
                className="rounded-lg border border-black/10 dark:border-white/10 px-3 font-sans text-sm text-charcoal/60 dark:text-cream/60 hover:border-gold hover:text-gold transition-colors"
              >
                Apply
              </button>
            </div>
            {promoApplied && (
              <p className="mt-1.5 font-sans text-xs text-emerald-600">
                Code applied — 10% off your order
              </p>
            )}
          </div>

          {/* CTA */}
          <Link
            href="/checkout"
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gold font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal-950 hover:bg-gold-400 transition-all active:scale-[0.98]"
          >
            Proceed to Checkout
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/products"
            className="mt-3 flex h-10 w-full items-center justify-center font-sans text-[11px] tracking-[0.1em] uppercase text-charcoal/40 dark:text-cream/40 hover:text-charcoal dark:hover:text-cream transition-colors"
          >
            Continue Shopping
          </Link>

          {/* Trust signals */}
          <ul className="mt-5 space-y-2 border-t border-black/6 dark:border-white/6 pt-5 font-sans text-xs text-charcoal/40 dark:text-cream/40">
            <li className="flex items-center gap-2">
              <span className="text-gold">✓</span> Free white-glove delivery over £500
            </li>
            <li className="flex items-center gap-2">
              <span className="text-gold">✓</span> 30-day returns on undamaged items
            </li>
            <li className="flex items-center gap-2">
              <span className="text-gold">✓</span> 25-year structural frame guarantee
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
