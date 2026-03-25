"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft, ChevronRight, Check, ShoppingBag,
  RotateCcw, Eye, Ruler, Palette, Layers, ArrowLeft,
  Info, Zap,
} from "lucide-react";
import { useCartStore } from "@/lib/stores/cart-store";
import { formatPrice } from "@/lib/utils/format";
import { configuratorApi } from "@/lib/api/client";

// ── Types ─────────────────────────────────────────────────────
interface ConfigOption {
  id: string;
  label: string;
  description?: string;
  price?: number;        // additional cost above base
  swatch?: string;       // hex colour or image url
  available: boolean;
}

interface ConfigStep {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  type: "swatch" | "size" | "select" | "dimension";
  options: ConfigOption[];
  required: boolean;
}

interface ProductConfig {
  slug: string;
  name: string;
  basePrice: number;
  currency: string;
  leadTime: string;
  primaryImage: string;
  steps: ConfigStep[];
}

// ── Demo product configs ───────────────────────────────────────
const CONFIGS: Record<string, ProductConfig> = {
  default: {
    slug: "modular-sofa-oslo",
    name: "Oslo Modular Sofa",
    basePrice: 2800,
    currency: "GBP",
    leadTime: "8–10 weeks",
    primaryImage: "",
    steps: [
      {
        id: "size",
        label: "Configuration",
        icon: Layers,
        description: "Choose the number of seats and whether you'd like a chaise extension.",
        type: "select",
        required: true,
        options: [
          { id: "2seat",        label: "2-Seat",             price: 0,    available: true },
          { id: "3seat",        label: "3-Seat",             price: 400,  available: true },
          { id: "4seat",        label: "4-Seat",             price: 800,  available: true },
          { id: "3seat-chaise", label: "3-Seat + Chaise",   price: 700,  available: true },
          { id: "4seat-chaise", label: "4-Seat + Chaise",   price: 1200, available: true },
        ],
      },
      {
        id: "fabric",
        label: "Fabric",
        icon: Palette,
        description: "All fabrics are woven in Portugal from natural fibres. Swatches available on request.",
        type: "swatch",
        required: true,
        options: [
          { id: "oatmeal-boucle",   label: "Oatmeal Boucle",    price: 0,   swatch: "#E8DDD0", available: true },
          { id: "slate-boucle",     label: "Slate Boucle",      price: 0,   swatch: "#8B9098", available: true },
          { id: "forest-boucle",    label: "Forest Green",      price: 0,   swatch: "#3D5A45", available: true },
          { id: "ivory-linen",      label: "Ivory Linen",       price: 0,   swatch: "#F5F0E8", available: true },
          { id: "navy-linen",       label: "Navy Linen",        price: 0,   swatch: "#1E2D4A", available: true },
          { id: "rust-velvet",      label: "Rust Velvet",       price: 200, swatch: "#8B4513", available: true },
          { id: "emerald-velvet",   label: "Emerald Velvet",    price: 200, swatch: "#1B5E4B", available: true },
          { id: "blush-velvet",     label: "Blush Velvet",      price: 200, swatch: "#D4A0A0", available: false },
          { id: "charcoal-wool",    label: "Charcoal Wool",     price: 150, swatch: "#3A3A3A", available: true },
        ],
      },
      {
        id: "legs",
        label: "Leg finish",
        icon: Ruler,
        description: "All legs are individually turned from solid English oak or walnut and oil-finished.",
        type: "swatch",
        required: true,
        options: [
          { id: "oak-natural",  label: "Oak — Natural",  price: 0,   swatch: "#C8A96E", available: true },
          { id: "oak-smoked",   label: "Oak — Smoked",   price: 0,   swatch: "#6B5843", available: true },
          { id: "walnut",       label: "Walnut",         price: 150, swatch: "#4A3728", available: true },
          { id: "oak-white",    label: "Oak — White",    price: 0,   swatch: "#E8E0D6", available: true },
          { id: "black-steel",  label: "Black Steel",    price: 100, swatch: "#1A1A1A", available: true },
        ],
      },
      {
        id: "cushions",
        label: "Cushion piping",
        icon: Palette,
        description: "Optional contrast piping adds a tailored, bespoke detail. Matching is always included.",
        type: "swatch",
        required: false,
        options: [
          { id: "matching",   label: "Matching (included)", price: 0,   swatch: "",        available: true },
          { id: "black",      label: "Black contrast",      price: 80,  swatch: "#1A1A1A", available: true },
          { id: "gold",       label: "Gold contrast",       price: 80,  swatch: "#C4A85A", available: true },
          { id: "ivory",      label: "Ivory contrast",      price: 80,  swatch: "#F5F0E8", available: true },
          { id: "no-piping",  label: "No piping",           price: 0,   swatch: "",        available: true },
        ],
      },
    ],
  },
};

function getConfig(slug: string): ProductConfig {
  return CONFIGS[slug] ?? { ...CONFIGS.default, slug };
}

// ── Step indicator ────────────────────────────────────────────
function StepIndicator({
  steps,
  currentIndex,
  selections,
  onJump,
}: {
  steps: ConfigStep[];
  currentIndex: number;
  selections: Record<string, string>;
  onJump: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => {
        const done    = selections[step.id] !== undefined;
        const active  = i === currentIndex;
        const reachable = i <= currentIndex || done || (i > 0 && selections[steps[i - 1].id] !== undefined);
        return (
          <div key={step.id} className="flex items-center">
            <button
              type="button"
              disabled={!reachable}
              onClick={() => reachable && onJump(i)}
              className={[
                "flex h-8 w-8 items-center justify-center rounded-full font-sans text-xs font-medium transition-colors",
                active   ? "bg-charcoal text-cream" :
                done     ? "bg-gold text-charcoal-950" :
                reachable ? "bg-black/8 text-charcoal/50 hover:bg-black/12" :
                            "bg-black/4 text-charcoal/25 cursor-not-allowed",
              ].join(" ")}
              aria-label={step.label}
            >
              {done && !active ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </button>
            {i < steps.length - 1 && (
              <div className={`h-px w-8 mx-1 transition-colors ${done ? "bg-gold/50" : "bg-black/8"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Swatch dot (sets color imperatively to avoid inline style) ─
function SwatchSpan({ color, className }: { color: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => { if (ref.current) ref.current.style.backgroundColor = color; }, [color]);
  return <span ref={ref} className={className} />;
}

// ── Option cards ──────────────────────────────────────────────
function SwatchOption({
  option,
  selected,
  onClick,
}: {
  option: ConfigOption;
  selected: boolean;
  onClick: () => void;
}) {
  const swatchRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (swatchRef.current && option.swatch) swatchRef.current.style.backgroundColor = option.swatch;
  }, [option.swatch]);

  return (
    <button
      type="button"
      disabled={!option.available}
      onClick={onClick}
      title={option.label}
      className={[
        "group relative flex flex-col items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed",
      ].join(" ")}
    >
      <div
        ref={swatchRef}
        className={[
          "h-12 w-12 rounded-full border-2 transition-all",
          selected
            ? "border-charcoal ring-2 ring-charcoal/20 scale-110"
            : "border-transparent hover:border-charcoal/20",
          option.swatch ? "" : "bg-black/6 flex items-center justify-center",
        ].join(" ")}
      >
        {!option.swatch && (
          <Palette className="h-4 w-4 text-charcoal/30" />
        )}
        {selected && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Check className="h-4 w-4 text-white drop-shadow" />
          </div>
        )}
      </div>
      <span className={`font-sans text-[10px] text-center leading-tight max-w-[72px] ${selected ? "text-charcoal font-medium" : "text-charcoal/50"}`}>
        {option.label}
        {option.price && option.price > 0 && (
          <span className="block text-gold">+{formatPrice(option.price)}</span>
        )}
      </span>
    </button>
  );
}

function SelectOption({
  option,
  selected,
  onClick,
}: {
  option: ConfigOption;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={!option.available}
      onClick={onClick}
      className={[
        "relative flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-all disabled:opacity-40 disabled:cursor-not-allowed",
        selected
          ? "border-charcoal bg-charcoal/3 ring-1 ring-charcoal/10"
          : "border-black/8 bg-white hover:border-charcoal/20",
      ].join(" ")}
    >
      {selected && (
        <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-charcoal">
          <Check className="h-3 w-3 text-white" />
        </div>
      )}
      <p className={`font-sans text-sm font-medium ${selected ? "text-charcoal" : "text-charcoal/70"}`}>
        {option.label}
      </p>
      {option.description && (
        <p className="font-sans text-xs text-charcoal/40">{option.description}</p>
      )}
      {option.price !== undefined && option.price > 0 ? (
        <p className="font-sans text-xs text-gold font-medium">+{formatPrice(option.price)}</p>
      ) : option.price === 0 ? (
        <p className="font-sans text-xs text-charcoal/30">Included</p>
      ) : null}
    </button>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function ConfiguratorPage() {
  const params = useParams();
  const router = useRouter();
  const slug   = typeof params?.slug === "string" ? params.slug : "modular-sofa-oslo";
  const [config, setConfig]             = useState<ProductConfig>(() => getConfig(slug));

  const [stepIndex, setStepIndex]       = useState(0);
  const [selections, setSelections]     = useState<Record<string, string>>({});
  const [adding, setAdding]             = useState(false);

  // Fetch real finish options from API; overlay onto demo config
  useEffect(() => {
    configuratorApi.getOptions(slug)
      .then((res) => {
        setConfig((prev) => {
          const finishStep = prev.steps.find((s) => s.id === "finish");
          if (!finishStep || res.finishOptions.length === 0) {
            // Just update name and price from API
            return { ...prev, name: res.name || prev.name, basePrice: res.basePrice || prev.basePrice };
          }
          const updatedSteps = prev.steps.map((s) =>
            s.id === "finish"
              ? {
                  ...s,
                  options: res.finishOptions.map((f) => ({
                    id: f.id,
                    label: f.label,
                    price: f.priceDelta,
                    available: true,
                  })),
                }
              : s
          );
          return { ...prev, name: res.name || prev.name, basePrice: res.basePrice || prev.basePrice, steps: updatedSteps };
        });
      })
      .catch(() => {/* keep demo config on error */});
  }, [slug]);

  const { addItem, openDrawer } = useCartStore();

  const currentStep = config.steps[stepIndex];
  const isLast      = stepIndex === config.steps.length - 1;
  const isFirst     = stepIndex === 0;

  // Price calculation
  const additionalCost = config.steps.reduce((total, step) => {
    const selectedId = selections[step.id];
    if (!selectedId) return total;
    const opt = step.options.find((o) => o.id === selectedId);
    return total + (opt?.price ?? 0);
  }, 0);
  const totalPrice = config.basePrice + additionalCost;

  // All required steps complete?
  const allRequired = config.steps
    .filter((s) => s.required)
    .every((s) => selections[s.id] !== undefined);

  function select(stepId: string, optionId: string) {
    setSelections((prev) => ({ ...prev, [stepId]: optionId }));
  }

  function handleNext() {
    if (!isLast) setStepIndex((i) => i + 1);
  }

  function handleBack() {
    if (!isFirst) setStepIndex((i) => i - 1);
  }

  function handleAddToCart() {
    setAdding(true);
    const finishParts = config.steps.map((step) => {
      const sel = step.options.find((o) => o.id === selections[step.id]);
      return sel ? `${step.label}: ${sel.label}` : null;
    }).filter(Boolean);

    addItem({
      productId: config.slug,
      slug:      config.slug,
      name:      config.name,
      imageUrl:  config.primaryImage || undefined,
      finish:    finishParts.join(" · "),
      quantity:  1,
      unitPrice: totalPrice,
    });
    setTimeout(() => {
      setAdding(false);
      openDrawer();
    }, 600);
  }

  const canProceed = !currentStep.required || selections[currentStep.id] !== undefined;

  return (
    <div className="min-h-screen bg-cream dark:bg-charcoal-950">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-black/6 bg-white/90 dark:bg-charcoal-900/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            href={`/products/${slug}`}
            className="flex items-center gap-1.5 font-sans text-sm text-charcoal/50 hover:text-charcoal transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to product
          </Link>

          <div className="flex flex-col items-center gap-1">
            <p className="font-serif text-sm text-charcoal">{config.name}</p>
            <StepIndicator
              steps={config.steps}
              currentIndex={stepIndex}
              selections={selections}
              onJump={setStepIndex}
            />
          </div>

          <div className="text-right">
            <p className="font-serif text-lg text-charcoal">{formatPrice(totalPrice, config.currency)}</p>
            <p className="font-sans text-[10px] text-charcoal/35 uppercase tracking-[0.08em]">
              Lead time {config.leadTime}
            </p>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:grid lg:grid-cols-[1fr_380px] lg:gap-10 lg:py-12">
        {/* Left — preview */}
        <div className="mb-8 lg:mb-0">
          <div className="sticky top-[88px] space-y-4">
            {/* Product preview */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white dark:bg-charcoal-900 border border-black/6">
              {config.primaryImage ? (
                <Image
                  src={config.primaryImage}
                  alt={config.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <div className="grid grid-cols-3 gap-1.5 opacity-20">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className={`h-8 w-8 rounded bg-charcoal ${(["opacity-30", "opacity-50", "opacity-70"] as const)[i % 3]}`} />
                    ))}
                  </div>
                  <p className="font-sans text-sm text-charcoal/30">3D preview coming soon</p>
                  <p className="font-sans text-xs text-charcoal/20 max-w-[200px]">
                    Real-time 3D rendering will show your configuration live
                  </p>
                </div>
              )}

            </div>

            {/* Current selections summary */}
            {Object.keys(selections).length > 0 && (
              <div className="rounded-2xl border border-black/6 bg-white dark:bg-charcoal-900 p-4">
                <p className="font-sans text-[10px] tracking-[0.1em] uppercase text-charcoal/40 mb-3">
                  Your configuration
                </p>
                <dl className="space-y-1.5">
                  {config.steps.map((step) => {
                    const opt = step.options.find((o) => o.id === selections[step.id]);
                    if (!opt) return null;
                    return (
                      <div key={step.id} className="flex items-center justify-between gap-4">
                        <dt className="font-sans text-xs text-charcoal/40">{step.label}</dt>
                        <dd className="flex items-center gap-1.5 font-sans text-xs text-charcoal">
                          {opt.swatch && (
                            <SwatchSpan color={opt.swatch} className="h-3.5 w-3.5 rounded-full border border-black/10" />
                          )}
                          {opt.label}
                          {opt.price ? (
                            <span className="text-gold">+{formatPrice(opt.price)}</span>
                          ) : null}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Right — step panel */}
        <div className="space-y-6">
          {/* Step header */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-sans text-[10px] tracking-[0.12em] uppercase text-charcoal/35">
                Step {stepIndex + 1} of {config.steps.length}
                {!currentStep.required && " · Optional"}
              </span>
            </div>
            <h1 className="font-serif text-2xl text-charcoal dark:text-cream">
              {currentStep.label}
            </h1>
            {currentStep.description && (
              <p className="font-sans text-sm text-charcoal/50 dark:text-cream/50 mt-1 leading-relaxed">
                {currentStep.description}
              </p>
            )}
          </div>

          {/* Options */}
          {currentStep.type === "swatch" && (
            <div className="flex flex-wrap gap-4">
              {currentStep.options.map((option) => (
                <SwatchOption
                  key={option.id}
                  option={option}
                  selected={selections[currentStep.id] === option.id}
                  onClick={() => select(currentStep.id, option.id)}
                />
              ))}
            </div>
          )}

          {currentStep.type === "select" && (
            <div className="grid gap-2 sm:grid-cols-2">
              {currentStep.options.map((option) => (
                <SelectOption
                  key={option.id}
                  option={option}
                  selected={selections[currentStep.id] === option.id}
                  onClick={() => select(currentStep.id, option.id)}
                />
              ))}
            </div>
          )}

          {/* Unavailable note */}
          {currentStep.options.some((o) => !o.available) && (
            <p className="flex items-center gap-1.5 font-sans text-xs text-charcoal/40">
              <Info className="h-3.5 w-3.5" />
              Greyed options are temporarily unavailable. Contact us for lead time.
            </p>
          )}

          {/* Navigation */}
          <div className="flex items-center gap-3 pt-2">
            {!isFirst && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 rounded-full border border-black/10 px-5 py-2.5 font-sans text-[11px] tracking-[0.1em] uppercase text-charcoal/50 hover:border-gold hover:text-gold transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Back
              </button>
            )}

            {!isLast ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed}
                className="inline-flex items-center gap-1.5 rounded-full bg-charcoal px-6 py-2.5 font-sans text-[11px] tracking-[0.12em] uppercase text-cream hover:bg-charcoal/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next: {config.steps[stepIndex + 1]?.label}
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!allRequired || adding}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors disabled:opacity-50"
              >
                {adding ? (
                  <><Zap className="h-3.5 w-3.5 animate-pulse" /> Adding…</>
                ) : (
                  <><ShoppingBag className="h-3.5 w-3.5" /> Add to cart · {formatPrice(totalPrice, config.currency)}</>
                )}
              </button>
            )}

            {!currentStep.required && !isLast && (
              <button
                type="button"
                onClick={handleNext}
                className="font-sans text-sm text-charcoal/35 hover:text-charcoal transition-colors"
              >
                Skip
              </button>
            )}
          </div>

          {/* Reset */}
          {Object.keys(selections).length > 0 && (
            <button
              type="button"
              onClick={() => { setSelections({}); setStepIndex(0); }}
              className="flex items-center gap-1.5 font-sans text-[11px] text-charcoal/25 hover:text-charcoal/50 transition-colors"
            >
              <RotateCcw className="h-3 w-3" /> Reset configuration
            </button>
          )}

          {/* Price breakdown */}
          {additionalCost > 0 && (
            <div className="rounded-xl border border-black/6 bg-white dark:bg-charcoal-900 p-4 space-y-2">
              <p className="font-sans text-[10px] tracking-[0.1em] uppercase text-charcoal/35">Price breakdown</p>
              <div className="flex justify-between font-sans text-sm text-charcoal/60">
                <span>Base price</span>
                <span>{formatPrice(config.basePrice, config.currency)}</span>
              </div>
              {config.steps.map((step) => {
                const opt = step.options.find((o) => o.id === selections[step.id]);
                if (!opt || !opt.price) return null;
                return (
                  <div key={step.id} className="flex justify-between font-sans text-sm text-charcoal/60">
                    <span>{opt.label}</span>
                    <span className="text-gold">+{formatPrice(opt.price)}</span>
                  </div>
                );
              })}
              <div className="flex justify-between border-t border-black/5 pt-2 font-sans text-sm font-medium text-charcoal">
                <span>Total</span>
                <span>{formatPrice(totalPrice, config.currency)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
