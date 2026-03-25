"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils/format";
import { formatPrice } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import type { CartItem } from "@/types/order";

/* ── Types ────────────────────────────────────────────────────── */
interface ContactFields {
  email: string;
  phone: string;
}
interface AddressFields {
  fullName: string;
  line1: string;
  line2: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
}
interface DeliveryOption {
  id: string;
  label: string;
  description: string;
  price: number;
  estimatedDays: string;
}

const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: "standard",
    label: "Standard Delivery",
    description: "Tracked courier, white-glove room placement",
    price: 0,
    estimatedDays: "10–14 business days",
  },
  {
    id: "express",
    label: "Express Delivery",
    description: "Priority dispatch, two-person installation team",
    price: 9500,
    estimatedDays: "5–7 business days",
  },
  {
    id: "premium",
    label: "Premium Concierge",
    description: "Dedicated installation & styling appointment",
    price: 24900,
    estimatedDays: "3–5 business days",
  },
];

const COUNTRIES = ["United Kingdom", "Ireland", "France", "Germany", "Netherlands", "Belgium", "Luxembourg"];

type Step = "contact" | "delivery" | "payment";

const STEPS: { key: Step; label: string }[] = [
  { key: "contact",  label: "Contact & Shipping" },
  { key: "delivery", label: "Delivery" },
  { key: "payment",  label: "Payment" },
];

/* ── Main component ───────────────────────────────────────────── */
interface CheckoutFormProps {
  cartItems: CartItem[];
  /** Called when payment is successfully submitted */
  onComplete?: (data: { contact: ContactFields; address: AddressFields; deliveryId: string }) => void;
}

export function CheckoutForm({ cartItems, onComplete }: CheckoutFormProps) {
  const [step,     setStep]     = useState<Step>("contact");
  const [loading,  setLoading]  = useState(false);
  const [contact,  setContact]  = useState<ContactFields>({ email: "", phone: "" });
  const [address,  setAddress]  = useState<AddressFields>({
    fullName: "", line1: "", line2: "", city: "", county: "", postcode: "", country: "United Kingdom",
  });
  const [delivery, setDelivery] = useState("standard");
  const [errors,   setErrors]   = useState<Partial<Record<keyof ContactFields | keyof AddressFields, string>>>({});

  const currency   = cartItems[0]?.product.currency ?? "GBP";
  const subtotal   = cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const deliveryFee = DELIVERY_OPTIONS.find((d) => d.id === delivery)?.price ?? 0;
  const total      = subtotal + deliveryFee;
  const stepIndex  = STEPS.findIndex((s) => s.key === step);

  /* ── Validation ─────────────────────────────────────────────── */
  function validateContact(): boolean {
    const e: typeof errors = {};
    if (!contact.email.includes("@")) e.email = "Enter a valid email address";
    if (!contact.phone.trim())        e.phone = "Phone number is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateAddress(): boolean {
    const e: typeof errors = {};
    if (!address.fullName.trim()) e.fullName = "Full name is required";
    if (!address.line1.trim())    e.line1    = "Address line 1 is required";
    if (!address.city.trim())     e.city     = "City is required";
    if (!address.postcode.trim()) e.postcode = "Postcode is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* ── Step navigation ────────────────────────────────────────── */
  function handleContinue() {
    if (step === "contact") {
      if (validateContact() && validateAddress()) setStep("delivery");
    } else if (step === "delivery") {
      setStep("payment");
    } else if (step === "payment") {
      handlePlaceOrder();
    }
  }

  async function handlePlaceOrder() {
    setLoading(true);
    // Simulate async payment processing
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    onComplete?.({ contact, address, deliveryId: delivery });
  }

  return (
    <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 lg:gap-14">

      {/* ── Left column: steps ──────────────────────────────────── */}
      <div>
        {/* Step indicator */}
        <StepIndicator steps={STEPS} currentIndex={stepIndex} />

        <div className="mt-8">
          {step === "contact" && (
            <ContactStep
              contact={contact}
              address={address}
              errors={errors}
              onContactChange={(field, value) => setContact((c) => ({ ...c, [field]: value }))}
              onAddressChange={(field, value) => setAddress((a) => ({ ...a, [field]: value }))}
            />
          )}
          {step === "delivery" && (
            <DeliveryStep
              options={DELIVERY_OPTIONS}
              selected={delivery}
              onSelect={setDelivery}
              currency={currency}
            />
          )}
          {step === "payment" && (
            <PaymentStep />
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center gap-4">
          {stepIndex > 0 && (
            <Button
              variant="ghost"
              onClick={() => setStep(STEPS[stepIndex - 1].key)}
              leftIcon={<ChevronLeftIcon />}
            >
              Back
            </Button>
          )}
          <Button
            variant="primary"
            size="lg"
            loading={loading}
            onClick={handleContinue}
            className="ml-auto"
            rightIcon={step !== "payment" ? <ChevronRightIcon /> : undefined}
          >
            {step === "payment" ? "Place Order" : "Continue"}
          </Button>
        </div>

        {/* Trust signals */}
        <div className="mt-8 flex flex-wrap gap-5 pt-6 border-t border-black/6 dark:border-white/6">
          {[
            { icon: <LockIcon />, label: "256-bit SSL secured" },
            { icon: <ShieldIcon />, label: "Buyer protection" },
            { icon: <RefundIcon />, label: "30-day returns" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-charcoal/40 dark:text-cream/40">
              <span>{icon}</span>
              <span className="font-sans text-[11px]">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right column: order summary ─────────────────────────── */}
      <OrderSummary
        items={cartItems}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        total={total}
        currency={currency}
        deliveryLabel={DELIVERY_OPTIONS.find((d) => d.id === delivery)?.label}
      />
    </div>
  );
}

/* ── Step indicator ───────────────────────────────────────────── */
function StepIndicator({ steps, currentIndex }: { steps: typeof STEPS; currentIndex: number }) {
  return (
    <div className="flex items-center gap-0">
      {steps.map(({ key, label }, i) => {
        const isDone    = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={key} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center shrink-0">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full font-sans text-[12px] transition-all duration-300",
                  isDone    && "bg-gold text-charcoal-950",
                  isCurrent && "bg-charcoal dark:bg-cream text-cream dark:text-charcoal ring-2 ring-charcoal/20 dark:ring-cream/20",
                  !isDone && !isCurrent && "bg-black/6 dark:bg-white/6 text-charcoal/40 dark:text-cream/40",
                )}
              >
                {isDone ? <CheckIcon /> : i + 1}
              </div>
              <span className={cn(
                "mt-1.5 font-sans text-[10px] tracking-[0.05em] whitespace-nowrap hidden sm:block",
                isCurrent ? "text-charcoal dark:text-cream font-medium" : "text-charcoal/40 dark:text-cream/40",
              )}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("h-px flex-1 mx-3 transition-colors duration-300", isDone ? "bg-gold" : "bg-black/10 dark:bg-white/10")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Contact & Shipping step ──────────────────────────────────── */
interface ContactStepProps {
  contact: ContactFields;
  address: AddressFields;
  errors: Record<string, string>;
  onContactChange: (field: keyof ContactFields, value: string) => void;
  onAddressChange: (field: keyof AddressFields, value: string) => void;
}

function ContactStep({ contact, address, errors, onContactChange, onAddressChange }: ContactStepProps) {
  return (
    <div className="space-y-8">
      {/* Contact info */}
      <FormSection title="Contact Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Email address" error={errors.email} required>
            <input
              type="email"
              value={contact.email}
              onChange={(e) => onContactChange("email", e.target.value)}
              placeholder="you@example.com"
              className={cn(inputBase, errors.email && inputError)}
              autoComplete="email"
            />
          </FormField>
          <FormField label="Phone number" error={errors.phone}>
            <input
              type="tel"
              value={contact.phone}
              onChange={(e) => onContactChange("phone", e.target.value)}
              placeholder="+44 7700 900000"
              className={cn(inputBase, errors.phone && inputError)}
              autoComplete="tel"
            />
          </FormField>
        </div>
      </FormSection>

      {/* Shipping address */}
      <FormSection title="Shipping Address">
        <FormField label="Full name" error={errors.fullName} required>
          <input
            type="text"
            value={address.fullName}
            onChange={(e) => onAddressChange("fullName", e.target.value)}
            placeholder="Jane Smith"
            className={cn(inputBase, errors.fullName && inputError)}
            autoComplete="name"
          />
        </FormField>
        <FormField label="Address line 1" error={errors.line1} required>
          <input
            type="text"
            value={address.line1}
            onChange={(e) => onAddressChange("line1", e.target.value)}
            placeholder="12 Luxury Lane"
            className={cn(inputBase, errors.line1 && inputError)}
            autoComplete="address-line1"
          />
        </FormField>
        <FormField label="Address line 2 (optional)">
          <input
            type="text"
            value={address.line2}
            onChange={(e) => onAddressChange("line2", e.target.value)}
            placeholder="Apartment, suite, etc."
            className={inputBase}
            autoComplete="address-line2"
          />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="City" error={errors.city} required>
            <input
              type="text"
              value={address.city}
              onChange={(e) => onAddressChange("city", e.target.value)}
              placeholder="London"
              className={cn(inputBase, errors.city && inputError)}
              autoComplete="address-level2"
            />
          </FormField>
          <FormField label="County (optional)">
            <input
              type="text"
              value={address.county}
              onChange={(e) => onAddressChange("county", e.target.value)}
              placeholder="Surrey"
              className={inputBase}
              autoComplete="address-level1"
            />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Postcode" error={errors.postcode} required>
            <input
              type="text"
              value={address.postcode}
              onChange={(e) => onAddressChange("postcode", e.target.value.toUpperCase())}
              placeholder="SW1A 2AA"
              className={cn(inputBase, errors.postcode && inputError)}
              autoComplete="postal-code"
            />
          </FormField>
          <FormField label="Country">
            <select
              aria-label="Country"
              value={address.country}
              onChange={(e) => onAddressChange("country", e.target.value)}
              className={cn(inputBase, "cursor-pointer")}
              autoComplete="country-name"
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </FormField>
        </div>
      </FormSection>
    </div>
  );
}

/* ── Delivery step ────────────────────────────────────────────── */
function DeliveryStep({
  options,
  selected,
  onSelect,
  currency,
}: {
  options: DeliveryOption[];
  selected: string;
  onSelect: (id: string) => void;
  currency: string;
}) {
  return (
    <FormSection title="Delivery Method">
      <div className="space-y-3">
        {options.map((opt) => (
          <label
            key={opt.id}
            className={cn(
              "flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-all duration-200",
              selected === opt.id
                ? "border-gold bg-gold/4 dark:bg-gold/6"
                : "border-black/8 dark:border-white/8 hover:border-gold/40",
            )}
          >
            {/* Radio */}
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200 border-current">
              <input
                type="radio"
                name="delivery"
                value={opt.id}
                checked={selected === opt.id}
                onChange={() => onSelect(opt.id)}
                className="sr-only"
              />
              {selected === opt.id && (
                <div className="h-2.5 w-2.5 rounded-full bg-gold" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-sans text-[13px] font-medium text-charcoal dark:text-cream">
                  {opt.label}
                </span>
                <span className="font-sans text-[13px] font-medium text-charcoal dark:text-cream shrink-0">
                  {opt.price === 0 ? "Free" : formatPrice(opt.price / 100, currency)}
                </span>
              </div>
              <p className="mt-0.5 font-sans text-[11px] text-charcoal/50 dark:text-cream/50">
                {opt.description}
              </p>
              <p className="mt-1 font-sans text-[11px] text-charcoal/40 dark:text-cream/40">
                {opt.estimatedDays}
              </p>
            </div>
          </label>
        ))}
      </div>
    </FormSection>
  );
}

/* ── Payment step ─────────────────────────────────────────────── */
function PaymentStep() {
  return (
    <FormSection title="Payment Details">
      <div className="rounded-xl border border-black/8 dark:border-white/8 bg-cream/40 dark:bg-charcoal-800/40 p-5">
        <div className="flex items-center gap-2 mb-5">
          <LockIcon />
          <span className="font-sans text-[11px] text-charcoal/50 dark:text-cream/50">
            Secured by Stripe · 256-bit SSL encryption
          </span>
          {/* Card brand icons */}
          <div className="ml-auto flex gap-1.5">
            {["Visa", "MC", "Amex"].map((b) => (
              <span
                key={b}
                className="inline-flex items-center rounded border border-black/8 dark:border-white/8 px-2 py-0.5 font-sans text-[9px] text-charcoal/50 dark:text-cream/50"
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Stripe card element placeholder */}
        <div className="space-y-3">
          <FormField label="Card number">
            <div className={cn(inputBase, "flex items-center gap-2 text-charcoal/30 dark:text-cream/30")}>
              <CreditCardIcon />
              <span className="font-sans text-[13px]">Card number · Stripe element loads here</span>
            </div>
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Expiry">
              <div className={cn(inputBase, "text-charcoal/30 dark:text-cream/30 font-sans text-[13px]")}>
                MM / YY
              </div>
            </FormField>
            <FormField label="CVC">
              <div className={cn(inputBase, "text-charcoal/30 dark:text-cream/30 font-sans text-[13px]")}>
                •••
              </div>
            </FormField>
          </div>
          <FormField label="Name on card">
            <input
              type="text"
              placeholder="Jane Smith"
              className={inputBase}
              autoComplete="cc-name"
            />
          </FormField>
        </div>
      </div>

      <p className="mt-4 font-sans text-[11px] text-charcoal/35 dark:text-cream/35 leading-relaxed">
        By placing your order you agree to our{" "}
        <a href="/terms" className="underline hover:text-gold transition-colors">Terms of Sale</a>
        {" "}and{" "}
        <a href="/privacy" className="underline hover:text-gold transition-colors">Privacy Policy</a>.
        Your card will be charged upon order confirmation.
      </p>
    </FormSection>
  );
}

/* ── Order summary sidebar ────────────────────────────────────── */
interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  currency: string;
  deliveryLabel?: string;
}

function OrderSummary({ items, subtotal, deliveryFee, total, currency, deliveryLabel }: OrderSummaryProps) {
  return (
    <div className="rounded-2xl border border-black/6 dark:border-white/6 bg-cream/30 dark:bg-charcoal-900 p-6 lg:sticky lg:top-[calc(var(--nav-height)+1.5rem)] h-fit">
      <h3 className="font-serif text-xl text-charcoal dark:text-cream mb-6">Your Order</h3>

      {/* Items */}
      <ul className="space-y-4 mb-6">
        {items.map((item) => (
          <li key={`${item.productId}-${item.configurationId ?? ""}`} className="flex gap-3.5">
            {/* Thumbnail */}
            <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-cream dark:bg-charcoal-800 ring-1 ring-black/6 dark:ring-white/6">
              {item.product.primaryImage ? (
                <Image src={item.product.primaryImage} alt={item.product.name} fill sizes="64px" className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ProductIcon />
                </div>
              )}
              {/* Qty badge */}
              {item.quantity > 1 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-charcoal dark:bg-cream text-cream dark:text-charcoal font-sans text-[10px] flex items-center justify-center">
                  {item.quantity}
                </span>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="font-serif text-[15px] text-charcoal dark:text-cream leading-snug truncate">
                {item.product.name}
              </p>
              {item.finish && (
                <p className="font-sans text-[11px] text-charcoal/40 dark:text-cream/40 mt-0.5">
                  Finish: {item.finish}
                </p>
              )}
            </div>

            <span className="font-sans text-[13px] font-medium text-charcoal dark:text-cream shrink-0">
              {formatPrice(item.product.price * item.quantity, currency)}
            </span>
          </li>
        ))}
      </ul>

      {/* Totals */}
      <div className="space-y-2.5 pt-5 border-t border-black/8 dark:border-white/8">
        <div className="flex justify-between">
          <span className="font-sans text-[13px] text-charcoal/55 dark:text-cream/55">Subtotal</span>
          <span className="font-sans text-[13px] text-charcoal dark:text-cream">{formatPrice(subtotal, currency)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-sans text-[13px] text-charcoal/55 dark:text-cream/55">
            {deliveryLabel ?? "Delivery"}
          </span>
          <span className="font-sans text-[13px] text-charcoal dark:text-cream">
            {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee / 100, currency)}
          </span>
        </div>
        <div className="flex justify-between pt-3 border-t border-black/8 dark:border-white/8">
          <span className="font-serif text-lg text-charcoal dark:text-cream">Total</span>
          <span className="font-serif text-lg text-charcoal dark:text-cream">
            {formatPrice(total, currency)}
          </span>
        </div>
        <p className="font-sans text-[11px] text-charcoal/35 dark:text-cream/35">
          Inclusive of VAT where applicable
        </p>
      </div>

      {/* Promo code */}
      <div className="mt-5 flex gap-2">
        <input
          type="text"
          placeholder="Promo code"
          className={cn(inputBase, "flex-1 text-sm")}
        />
        <button className="rounded-full border border-charcoal/15 dark:border-cream/15 px-4 font-sans text-[11px] tracking-[0.1em] uppercase text-charcoal/60 dark:text-cream/60 hover:border-gold hover:text-gold transition-colors whitespace-nowrap">
          Apply
        </button>
      </div>
    </div>
  );
}

/* ── Form helpers ─────────────────────────────────────────────── */
const inputBase =
  "w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-charcoal-800 px-4 py-3 font-sans text-[13px] text-charcoal dark:text-cream placeholder:text-charcoal/30 dark:placeholder:text-cream/30 transition-colors focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20";

const inputError = "border-red-400 focus:border-red-400 focus:ring-red-300/20";

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal/40 dark:text-cream/40 mb-4">
        {title}
      </h4>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function FormField({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-sans text-[12px] text-charcoal/60 dark:text-cream/60">
        {label}{required && <span className="ml-0.5 text-gold">*</span>}
      </label>
      {children}
      {error && (
        <p className="font-sans text-[11px] text-red-500">{error}</p>
      )}
    </div>
  );
}

/* ── Icons ────────────────────────────────────────────────────── */
function ChevronLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function RefundIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4.95" />
    </svg>
  );
}
function CreditCardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}
function ProductIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-charcoal/15 dark:text-cream/15">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}
