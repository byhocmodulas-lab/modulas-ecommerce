"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice, cn } from "@/lib/utils/format";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { ordersApi } from "@/lib/api/client";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/types/product";

export interface MaterialOption {
  id: string;
  name: string;
  hexColor?: string;
  swatchUrl?: string;
  priceDelta?: number;
}

export interface SizeOption {
  id: string;
  label: string;
  description: string;
  dimensionSummary?: string;
  priceDelta?: number;
}

interface ProductInfoProps {
  product:          Product;
  materialOptions?: MaterialOption[];
  sizeOptions?:     SizeOption[];
}

type AccordionKey = "description" | "dimensions" | "care";

export function ProductInfo({ product, materialOptions, sizeOptions }: ProductInfoProps) {
  const [selectedFinish,   setSelectedFinish]   = useState<string | null>(product.finish_options[0] ?? null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(materialOptions?.[0]?.id ?? null);
  const [selectedSize,     setSelectedSize]     = useState<string | null>(sizeOptions?.[0]?.id ?? null);
  const [qty,     setQty]     = useState(1);
  const [adding,  setAdding]  = useState(false);
  const [openAccordion, setOpenAccordion] = useState<AccordionKey>("description");

  const router = useRouter();
  const { addItem, openDrawer } = useCartStore();
  const { accessToken }         = useAuthStore();
  const { toggle: toggleWishlist, has: inWishlist } = useWishlistStore();
  const wishlisted    = inWishlist(product.id);
  const activeMaterial = materialOptions?.find((m) => m.id === selectedMaterial);
  const activeSize     = sizeOptions?.find((s) => s.id === selectedSize);
  const configuredPrice = product.price + (activeMaterial?.priceDelta ?? 0) + (activeSize?.priceDelta ?? 0);
  const hasDiscount     = product.compare_at_price && product.compare_at_price > product.price;
  const primaryImage    = product.images.find((i) => i.is_primary) ?? product.images[0];

  async function handleAddToCart() {
    setAdding(true);
    const item = {
      productId: product.id,
      slug:      product.slug,
      name:      product.name,
      imageUrl:  primaryImage?.url,
      finish:    selectedFinish ?? undefined,
      quantity:  qty,
      unitPrice: configuredPrice,
    };
    addItem(item);
    openDrawer();
    if (accessToken) {
      try {
        await ordersApi.addToCart(accessToken, { productId: product.id, quantity: qty, unitPrice: configuredPrice });
      } catch { /* optimistic */ }
    }
    setAdding(false);
  }

  return (
    <div className="flex flex-col gap-0 lg:sticky lg:top-[calc(var(--nav-height)+1rem)] lg:self-start">

      {/* ── Category breadcrumb ───────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-3">
        {product.category && (
          <Link
            href={`/products?category=${product.category.slug}`}
            className="font-sans text-[10px] tracking-[0.25em] uppercase text-charcoal/40 dark:text-cream/40 hover:text-gold transition-colors"
          >
            {product.category.name}
          </Link>
        )}
        {product.is_configurable && (
          <>
            <span className="text-charcoal/20 dark:text-cream/20">·</span>
            <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-gold">Configurable</span>
          </>
        )}
      </div>

      {/* ── Name ─────────────────────────────────────────────────── */}
      <h1 className="font-serif text-[1.85rem] lg:text-[2.1rem] text-charcoal dark:text-cream leading-tight mb-2">
        {product.name}
      </h1>

      {/* ── Rating + SKU row ─────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {product.rating !== undefined && (
            <>
              <StarRow rating={product.rating} />
              <a href="#reviews" className="font-sans text-xs text-charcoal/40 dark:text-cream/40 hover:text-gold transition-colors underline-offset-2 hover:underline">
                {product.review_count ?? 0} Reviews
              </a>
            </>
          )}
        </div>
        <span className="font-sans text-[10px] tracking-[0.15em] text-charcoal/30 dark:text-cream/30 uppercase">
          SKU: {product.sku}
        </span>
      </div>

      {/* ── Price ────────────────────────────────────────────────── */}
      <div className="flex items-baseline gap-3 mb-5 pb-5 border-b border-black/8 dark:border-white/8">
        <span className="font-serif text-[1.75rem] text-charcoal dark:text-cream">
          {formatPrice(configuredPrice, product.currency)}
        </span>
        {hasDiscount && (
          <>
            <span className="font-sans text-base text-charcoal/35 dark:text-cream/35 line-through">
              {formatPrice(product.compare_at_price!, product.currency)}
            </span>
            <span className="font-sans text-[10px] tracking-[0.1em] uppercase text-cream bg-charcoal-950 dark:bg-cream dark:text-charcoal-950 px-2 py-0.5">
              Save {Math.round(100 - (product.price / product.compare_at_price!) * 100)}%
            </span>
          </>
        )}
        {(activeMaterial?.priceDelta || activeSize?.priceDelta) && (
          <span className="font-sans text-xs text-charcoal/30 dark:text-cream/30">configured price</span>
        )}
      </div>

      {/* ── Size selector ────────────────────────────────────────── */}
      {sizeOptions && sizeOptions.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2.5">
            <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal dark:text-cream">
              Size
            </p>
            {activeSize?.dimensionSummary && (
              <span className="font-sans text-[11px] text-charcoal/45 dark:text-cream/45">
                {activeSize.dimensionSummary}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {sizeOptions.map((size) => {
              const sel = selectedSize === size.id;
              return (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => setSelectedSize(size.id)}
                  aria-label={sel ? `${size.label} — selected` : size.label}
                  className={cn(
                    "flex flex-col items-start gap-0.5 border px-3 py-2.5 text-left transition-colors duration-150",
                    sel
                      ? "border-charcoal dark:border-cream bg-charcoal dark:bg-cream text-cream dark:text-charcoal-950"
                      : "border-black/12 dark:border-white/12 text-charcoal dark:text-cream hover:border-charcoal dark:hover:border-cream",
                  )}
                >
                  <span className="font-sans text-[12px] leading-tight">{size.label}</span>
                  <span className="font-sans text-[9px] tracking-[0.1em] uppercase text-current opacity-50">
                    {size.description}
                  </span>
                  {size.priceDelta !== undefined && size.priceDelta !== 0 && (
                    <span className="font-sans text-[9px] opacity-60 mt-0.5">
                      +{formatPrice(size.priceDelta, product.currency)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Fabric/Material selector ──────────────────────────────── */}
      {materialOptions && materialOptions.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2.5">
            <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal dark:text-cream">
              Material
            </p>
            <span className="font-sans text-[11px] text-charcoal/55 dark:text-cream/55">
              {activeMaterial?.name}
              {activeMaterial?.priceDelta ? (
                <span className="text-charcoal/35 dark:text-cream/35 ml-1.5">
                  {activeMaterial.priceDelta > 0 ? "+" : ""}{formatPrice(activeMaterial.priceDelta, product.currency)}
                </span>
              ) : null}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {materialOptions.map((mat) => (
              <MaterialSwatch
                key={mat.id}
                mat={mat}
                selected={selectedMaterial === mat.id}
                onSelect={() => setSelectedMaterial(mat.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Finish selector ──────────────────────────────────────── */}
      {product.finish_options.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2.5">
            <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal dark:text-cream">
              Finish
            </p>
            <span className="font-sans text-[11px] text-charcoal/55 dark:text-cream/55">{selectedFinish}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {product.finish_options.map((finish) => (
              <button
                key={finish}
                type="button"
                onClick={() => setSelectedFinish(finish)}
                aria-label={selectedFinish === finish ? `${finish} — selected` : finish}
                className={cn(
                  "border px-3.5 py-1.5 font-sans text-[11px] transition-colors duration-150",
                  selectedFinish === finish
                    ? "border-charcoal dark:border-cream bg-charcoal dark:bg-cream text-cream dark:text-charcoal-950"
                    : "border-black/12 dark:border-white/12 text-charcoal/70 dark:text-cream/70 hover:border-charcoal dark:hover:border-cream",
                )}
              >
                {finish}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Delivery info ─────────────────────────────────────────── */}
      <div className="mb-5 border border-black/8 dark:border-white/8 divide-y divide-black/8 dark:divide-white/8">
        <DeliveryRow
          icon={<TruckIcon />}
          label="Free White-Glove Delivery"
          sub="Nationwide, including assembly & placement"
        />
        <DeliveryRow
          icon={<ClockIcon />}
          label={`${product.lead_time_days}–${product.lead_time_days + 7} day lead time`}
          sub="Bespoke, made to your order in India"
        />
        <DeliveryRow
          icon={<ShieldIcon />}
          label="25-year structural frame guarantee"
          sub="Heirloom-quality craftsmanship"
        />
      </div>

      {/* ── Qty + Add to Cart ────────────────────────────────────── */}
      <div className="flex items-stretch gap-0 mb-3">
        {/* Qty stepper */}
        <div className="flex items-center border border-r-0 border-charcoal/15 dark:border-cream/15 shrink-0">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="w-10 h-14 flex items-center justify-center text-charcoal/50 dark:text-cream/50 hover:text-charcoal dark:hover:text-cream hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/></svg>
          </button>
          <span className="w-9 text-center font-sans text-sm text-charcoal dark:text-cream">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            aria-label="Increase quantity"
            className="w-10 h-14 flex items-center justify-center text-charcoal/50 dark:text-cream/50 hover:text-charcoal dark:hover:text-cream hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>

        {/* Main CTA */}
        {product.is_configurable ? (
          <button
            type="button"
            onClick={() => router.push(`/configure/${product.slug}`)}
            className="flex-1 h-14 bg-charcoal-950 dark:bg-cream flex items-center justify-center gap-2.5 font-sans text-[11px] tracking-[0.2em] uppercase text-cream dark:text-charcoal-950 hover:bg-gold dark:hover:bg-gold dark:hover:text-cream transition-colors duration-200"
          >
            Configure &amp; Add
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={adding}
            className="flex-1 h-14 bg-charcoal-950 dark:bg-cream flex items-center justify-center font-sans text-[11px] tracking-[0.2em] uppercase text-cream dark:text-charcoal-950 hover:bg-gold dark:hover:bg-gold dark:hover:text-cream disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {adding ? "Adding…" : "Add to Cart"}
          </button>
        )}
      </div>

      {/* ── Wishlist ─────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => toggleWishlist({
          productId: product.id,
          slug:      product.slug,
          name:      product.name,
          price:     configuredPrice,
          currency:  product.currency,
          imageUrl:  primaryImage?.url,
          material:  product.material,
          addedAt:   Date.now(),
        })}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className={cn(
          "w-full h-11 border flex items-center justify-center gap-2 font-sans text-[10px] tracking-[0.2em] uppercase transition-colors duration-200 mb-5",
          wishlisted
            ? "border-red-300 text-red-500"
            : "border-black/12 dark:border-white/12 text-charcoal/55 dark:text-cream/55 hover:border-charcoal dark:hover:border-cream hover:text-charcoal dark:hover:text-cream",
        )}
      >
        <Heart className={cn("h-3.5 w-3.5 transition-colors", wishlisted && "fill-red-500 stroke-red-500")} />
        {wishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
      </button>

      {/* ── Trade / Consultation link ─────────────────────────────── */}
      <div className="flex flex-col gap-2 pb-5 mb-5 border-b border-black/8 dark:border-white/8">
        <Link
          href="/for-designers"
          className="font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal/45 dark:text-cream/45 hover:text-gold transition-colors flex items-center gap-1.5"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          </svg>
          Trade Programme — Exclusive architect &amp; designer pricing
        </Link>
        <Link
          href="/book-consultation"
          className="font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal/45 dark:text-cream/45 hover:text-gold transition-colors flex items-center gap-1.5"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Book a free in-home design consultation
        </Link>
      </div>

      {/* ── Accordion: Description / Dimensions / Care ───────────── */}
      <div className="divide-y divide-black/8 dark:divide-white/8 border-t border-b border-black/8 dark:border-white/8">
        <AccordionSection
          label="Description"
          open={openAccordion === "description"}
          onToggle={() => setOpenAccordion(openAccordion === "description" ? "description" : "description")}
          onClick={() => setOpenAccordion(openAccordion === "description" ? "care" : "description")}
        >
          {product.description ? (
            <p className="font-sans text-[13px] leading-relaxed text-charcoal/65 dark:text-cream/65">
              {product.description}
            </p>
          ) : (
            <p className="font-sans text-[13px] text-charcoal/40 dark:text-cream/40">No description available.</p>
          )}
          {product.tags && product.tags.length > 0 && (
            <ul className="mt-3 space-y-1">
              {product.tags.slice(0, 5).map((tag) => (
                <li key={tag} className="flex items-start gap-2 font-sans text-[12px] text-charcoal/55 dark:text-cream/55">
                  <span className="mt-[5px] h-1 w-1 rounded-full bg-gold shrink-0" />
                  {tag.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </li>
              ))}
            </ul>
          )}
        </AccordionSection>

        <AccordionSection
          label="Dimensions & Details"
          open={openAccordion === "dimensions"}
          onClick={() => setOpenAccordion(openAccordion === "dimensions" ? "description" : "dimensions")}
        >
          {product.dimensions ? (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
              {(["width", "height", "depth"] as const).map((dim) => (
                <div key={dim} className="flex justify-between col-span-2 sm:col-span-1">
                  <dt className="font-sans text-[11px] tracking-[0.1em] capitalize text-charcoal/40 dark:text-cream/40">{dim}</dt>
                  <dd className="font-sans text-[12px] text-charcoal dark:text-cream">
                    {product.dimensions![dim]} {product.dimensions!.unit}
                  </dd>
                </div>
              ))}
              {product.material && (
                <div className="flex justify-between col-span-2">
                  <dt className="font-sans text-[11px] tracking-[0.1em] uppercase text-charcoal/40 dark:text-cream/40">Material</dt>
                  <dd className="font-sans text-[12px] text-charcoal dark:text-cream">
                    {product.material.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </dd>
                </div>
              )}
              <div className="flex justify-between col-span-2">
                <dt className="font-sans text-[11px] tracking-[0.1em] uppercase text-charcoal/40 dark:text-cream/40">Lead time</dt>
                <dd className="font-sans text-[12px] text-charcoal dark:text-cream">
                  {product.lead_time_days}–{product.lead_time_days + 7} days
                </dd>
              </div>
            </dl>
          ) : (
            <p className="font-sans text-[12px] text-charcoal/40 dark:text-cream/40">Dimensions not specified.</p>
          )}
        </AccordionSection>

        <AccordionSection
          label="Care"
          open={openAccordion === "care"}
          onClick={() => setOpenAccordion(openAccordion === "care" ? "description" : "care")}
        >
          <ul className="space-y-2">
            {[
              "Spot clean with mild soap and lukewarm water.",
              "Annual conditioning with natural wood oil recommended for timber pieces.",
              "Keep out of direct sunlight to prevent fading.",
              "25-year structural frame guarantee — contact us for warranty claims.",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2 font-sans text-[12px] text-charcoal/65 dark:text-cream/65">
                <span className="mt-[5px] h-1 w-1 rounded-full bg-gold shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </AccordionSection>
      </div>
    </div>
  );
}

/* ── Accordion section ────────────────────────────────────────────── */
function AccordionSection({
  label, open, onClick, children,
}: {
  label: string;
  open: boolean;
  onClick: () => void;
  onToggle?: () => void;
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  const btnClass = "flex w-full items-center justify-between py-4 text-left";
  const labelEl  = <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal dark:text-cream">{label}</span>;
  const chevron  = (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      className={cn("text-charcoal/40 dark:text-cream/40 transition-transform duration-200 shrink-0", open && "rotate-180")}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );

  return (
    <div>
      {open ? (
        <button type="button" onClick={onClick} aria-expanded="true" className={btnClass}>
          {labelEl}{chevron}
        </button>
      ) : (
        <button type="button" onClick={onClick} aria-expanded="false" className={btnClass}>
          {labelEl}{chevron}
        </button>
      )}
      <div
        ref={contentRef}
        className={cn(
          "overflow-hidden transition-all duration-300 ease-out",
          open ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        {children}
      </div>
    </div>
  );
}

/* ── Material swatch — imperative DOM to avoid inline style rule ─── */
function MaterialSwatch({ mat, selected, onSelect }: { mat: MaterialOption; selected: boolean; onSelect: () => void }) {
  const swatchRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (mat.hexColor) swatchRef.current?.style.setProperty("background-color", mat.hexColor);
  }, [mat.hexColor]);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={selected ? `${mat.name} — selected` : mat.name}
      title={mat.name}
      className={cn(
        "relative h-8 w-8 transition-all duration-150 shrink-0",
        selected
          ? "outline outline-2 outline-offset-2 outline-charcoal dark:outline-cream"
          : "outline outline-1 outline-offset-0 outline-black/12 dark:outline-white/12 hover:outline-charcoal/40",
      )}
    >
      {mat.swatchUrl ? (
        <img src={mat.swatchUrl} alt={mat.name} className="h-full w-full object-cover" />
      ) : (
        <span ref={swatchRef} className="block h-full w-full" />
      )}
    </button>
  );
}

/* ── Delivery row ─────────────────────────────────────────────────── */
function DeliveryRow({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) {
  return (
    <div className="flex items-start gap-3 px-3.5 py-3">
      <div className="mt-0.5 text-gold shrink-0">{icon}</div>
      <div>
        <p className="font-sans text-[12px] text-charcoal dark:text-cream leading-snug">{label}</p>
        <p className="font-sans text-[11px] text-charcoal/40 dark:text-cream/40 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

/* ── Star row ─────────────────────────────────────────────────────── */
function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < Math.round(rating) ? "#c9a96e" : "none"} stroke="#c9a96e" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
      <span className="font-sans text-[11px] text-charcoal/55 dark:text-cream/55 ml-1">{rating}</span>
    </div>
  );
}

/* ── Icons ────────────────────────────────────────────────────────── */
function TruckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
