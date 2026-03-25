"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { formatPrice } from "@/lib/utils/format";
import type { Product } from "@/lib/types/product";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { ordersApi } from "@/lib/api/client";
import { Heart } from "lucide-react";

interface ProductCardProps {
  product:   Product;
  priority?: boolean;
  variant?:  "default" | "compact" | "featured";
}

export function ProductCard({ product, priority = false, variant = "default" }: ProductCardProps) {
  const primaryImage = product.images.find((i) => i.is_primary) ?? product.images[0];
  const secondImage  = product.images.find((i) => !i.is_primary && i !== primaryImage);
  const hasDiscount  = product.compare_at_price && product.compare_at_price > product.price;
  const discountPct  = hasDiscount
    ? Math.round(100 - (product.price / product.compare_at_price!) * 100)
    : null;

  const { addItem, openDrawer } = useCartStore();
  const { accessToken }         = useAuthStore();
  const { toggle: toggleWishlist, has: inWishlist } = useWishlistStore();
  const wishlisted = inWishlist(product.id);
  const reduced    = useReducedMotion();
  const router     = useRouter();

  async function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem({
      productId: product.id,
      slug:      product.slug,
      name:      product.name,
      imageUrl:  primaryImage?.url,
      quantity:  1,
      unitPrice: product.price,
    });
    openDrawer();
    if (accessToken) {
      try {
        await ordersApi.addToCart(accessToken, {
          productId: product.id,
          quantity:  1,
          unitPrice: product.price,
        });
      } catch { /* optimistic */ }
    }
  }

  const isFeatured = variant === "featured";

  return (
    <article className={`group relative flex flex-col bg-white dark:bg-charcoal-950 ${isFeatured ? "lg:flex-row" : ""}`}>

      {/* ── IMAGE ─────────────────────────────────────────────── */}
      <Link
        href={`/products/${product.slug}`}
        className={[
          "relative block overflow-hidden bg-cream dark:bg-charcoal-800 shrink-0",
          variant === "compact"  ? "aspect-square"        : "aspect-[4/5]",
          isFeatured             ? "lg:w-1/2 lg:aspect-auto lg:min-h-[500px]" : "",
        ].join(" ")}
        tabIndex={-1}
        aria-hidden="true"
      >
        {primaryImage ? (
          <>
            {/* Primary image — fades out on hover to reveal second */}
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt_text ?? product.name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className={`object-cover transition-opacity duration-500 ${secondImage ? "group-hover:opacity-0" : ""}`}
            />
            {/* Second image crossfade */}
            {secondImage && (
              <Image
                src={secondImage.url}
                alt={secondImage.alt_text ?? product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ProductPlaceholder />
          </div>
        )}

        {/* ── Flat text badges — visible always if present ── */}
        <div className="absolute top-0 left-0 flex flex-col gap-px pointer-events-none">
          {product.tags?.includes("bestseller") && (
            <span className="font-sans text-[8px] tracking-[0.22em] uppercase text-charcoal-950 bg-white/95 px-2.5 py-1">
              Best Seller
            </span>
          )}
          {product.tags?.includes("new") && (
            <span className="font-sans text-[8px] tracking-[0.22em] uppercase text-charcoal-950 bg-white/95 px-2.5 py-1">
              New
            </span>
          )}
          {discountPct && (
            <span className="font-sans text-[8px] tracking-[0.22em] uppercase text-cream bg-charcoal-950 px-2.5 py-1">
              −{discountPct}%
            </span>
          )}
        </div>

        {/* ── Wishlist — hidden at rest, fades in on hover ── */}
        <motion.button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist({
              productId: product.id,
              slug:      product.slug,
              name:      product.name,
              price:     product.price,
              currency:  product.currency,
              imageUrl:  primaryImage?.url,
              material:  product.material,
              addedAt:   Date.now(),
            });
          }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          initial={{ opacity: wishlisted ? 1 : 0 }}
          animate={{ opacity: wishlisted ? 1 : undefined }}
          whileHover={{ scale: reduced ? 1 : 1.1 }}
          whileTap={{ scale: reduced ? 1 : 0.92 }}
          className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center bg-white/90 dark:bg-charcoal-900/90 shadow-sm transition-opacity duration-200 ${wishlisted ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
        >
          <Heart className={`h-3.5 w-3.5 transition-colors ${wishlisted ? "fill-red-500 stroke-red-500" : "stroke-charcoal/55 dark:stroke-cream/55"}`} />
        </motion.button>

        {/* ── Quick-add panel — slides up on hover ── */}
        <motion.div
          className="absolute inset-x-0 bottom-0 pointer-events-none group-hover:pointer-events-auto"
          initial={false}
          animate={{ y: 0 }}
        >
          <div
            className="translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"
          >
            {/* Swatches + material strip */}
            {(product.finish_options.length > 0 || product.material) && (
              <div className="flex items-center justify-between bg-white/96 dark:bg-charcoal-900/96 backdrop-blur-sm px-3 py-2 border-t border-black/6 dark:border-white/6">
                {/* Swatches */}
                <div className="flex items-center gap-1.5">
                  {product.finish_options.slice(0, 5).map((finish) => (
                    <ColourSwatch key={finish} colour={FINISH_COLOUR[finish] ?? "#d4cfc9"} title={finish} />
                  ))}
                  {product.finish_options.length > 5 && (
                    <span className="font-sans text-[9px] text-charcoal/35 dark:text-cream/35">
                      +{product.finish_options.length - 5}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* CTA button — must be a <button>, not <Link>, because it lives inside an <a> */}
            {product.is_configurable ? (
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); router.push(`/configurator?product=${product.slug}`); }}
                className="flex w-full items-center justify-center bg-charcoal-950 dark:bg-cream py-3 font-sans text-[10px] tracking-[0.22em] uppercase text-cream dark:text-charcoal-950 hover:bg-gold transition-colors duration-200"
              >
                Configure & Add
              </button>
            ) : (
              <button
                type="button"
                className="w-full bg-charcoal-950 dark:bg-cream py-3 font-sans text-[10px] tracking-[0.22em] uppercase text-cream dark:text-charcoal-950 hover:bg-gold transition-colors duration-200"
                onClick={handleQuickAdd}
              >
                Quick Add
              </button>
            )}
          </div>
        </motion.div>
      </Link>

      {/* ── INFO — ultra-minimal, CB2 style ───────────────────── */}
      <div className={`flex flex-col gap-0.5 pt-3 pb-1 ${isFeatured ? "lg:px-10 lg:justify-center lg:pb-0" : "px-0.5"}`}>

        {/* Category — tiny gold uppercase */}
        {product.category && (
          <p className="font-sans text-[9px] tracking-[0.25em] uppercase text-gold">
            {product.category.name}
          </p>
        )}

        {/* Product name — serif, clean */}
        <h3 className={`font-serif text-charcoal dark:text-cream leading-snug ${isFeatured ? "text-2xl lg:text-3xl mt-1" : "text-[1rem]"}`}>
          <Link
            href={`/products/${product.slug}`}
            className="hover:text-gold transition-colors duration-200"
          >
            {product.name}
          </Link>
        </h3>

        {/* Featured variant: show material */}
        {isFeatured && product.material && (
          <p className="font-sans text-[12px] text-charcoal/45 dark:text-cream/45 mt-0.5">{product.material}</p>
        )}

        {/* Featured variant: description */}
        {isFeatured && product.description && (
          <p className="font-sans text-sm text-charcoal/55 dark:text-cream/55 leading-relaxed mt-2 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Price — same size as name, minimal */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-sans text-[0.9rem] text-charcoal dark:text-cream">
            {formatPrice(product.price, product.currency)}
          </span>
          {hasDiscount && (
            <span className="font-sans text-[0.8rem] text-charcoal/30 dark:text-cream/30 line-through">
              {formatPrice(product.compare_at_price!, product.currency)}
            </span>
          )}
        </div>

        {/* Configurable label — only shown if configurable, minimal */}
        {product.is_configurable && (
          <p className="font-sans text-[9px] tracking-[0.15em] uppercase text-charcoal/30 dark:text-cream/30">
            Customisable
          </p>
        )}
      </div>
    </article>
  );
}

/* ── Colour swatch — imperative DOM to avoid linter inline style rule ── */
function ColourSwatch({ colour, title }: { colour: string; title: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => { ref.current?.style.setProperty("background-color", colour); }, [colour]);
  return (
    <span
      ref={ref}
      title={title}
      className="h-3 w-3 rounded-full border border-black/10 dark:border-white/10 shrink-0 cursor-default"
    />
  );
}

/* Approximate hex values for common finish names */
const FINISH_COLOUR: Record<string, string> = {
  "Oatmeal": "#d4cfc9", "Slate": "#8a9099", "Warm Sand": "#c9b99a",
  "Natural Flax": "#c8b89a", "Stone": "#b5aca0", "Charcoal": "#3c3c3c",
  "Terracotta": "#c97b5a", "Cream": "#f5f0e8", "Sage": "#8fa882",
  "Blush": "#e8b4b8", "Forest Green": "#3a5a44", "Burnt Sienna": "#b25c3a",
  "Ink Blue": "#2c3a5a", "Chalk": "#f2ede8", "Cognac": "#9b5c2a",
  "Tan": "#c4915c", "Midnight Black": "#1a1a1a", "Matte Black": "#1a1a1a",
  "Aged Brass": "#b8974a", "Natural Rattan": "#c4a96e", "Bleached White": "#f0ede8",
  "Smoked Oak": "#8c7055", "Natural Oak": "#c4a06e", "Painted Chalk": "#f0ede8",
  "Calacatta White": "#f5f2ee", "Statuario Grey": "#c8c4be",
  "Roman Travertine": "#d4c8b2", "Black Marquina": "#2a2520",
  "Natural Oil": "#c4a06e", "Ebonised": "#2a2020",
  "Natural Travertine": "#d4c8b2", "Honed Marble": "#e8e4de",
};

function ProductPlaceholder() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-charcoal/12 dark:text-cream/12">
      <rect x="2" y="7" width="20" height="14" rx="1" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}
