"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  ArrowLeft, Lock, Truck, CheckCircle2, ChevronDown, ChevronUp,
  FileText, Building2, Globe, MessageSquare, CreditCard, Smartphone,
} from "lucide-react";
import { RazorpayButton } from "@/components/checkout/razorpay-button";
import { formatPrice } from "@/lib/utils/format";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useRouter } from "next/navigation";
import { CustomerAuthModal } from "@/components/auth/customer-auth-modal";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
);

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

interface CartItem {
  productId: string;
  name?: string;
  quantity: number;
  unitPrice: number;
  finish?: string;
}

type Step = "details" | "payment" | "confirmed";

// ── Stripe payment form (mounted inside <Elements>) ────────────

function StripePaymentForm({
  orderId,
  total,
  onSuccess,
}: {
  orderId: string;
  total: number;
  onSuccess: (oid: string) => void;
}) {
  const stripe   = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/account/orders`,
      },
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed. Please try again.");
      setSubmitting(false);
      return;
    }

    onSuccess(orderId);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          layout: "tabs",
          fields: { billingDetails: "auto" },
        }}
      />

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || !stripe}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gold px-8 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal-950 hover:bg-gold-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
      >
        <Lock className="h-3.5 w-3.5" />
        {submitting ? "Processing…" : `Pay ${formatPrice(total)}`}
      </button>

      <p className="text-center font-sans text-[11px] text-charcoal/35">
        Secured by Stripe · SSL encrypted
      </p>
    </form>
  );
}

// ── Main checkout page ─────────────────────────────────────────

export default function CheckoutPage() {
  const router             = useRouter();
  const { accessToken, user } = useAuthStore();
  const [step, setStep]    = useState<Step>("details");
  const [cartItems, setCartItems]   = useState<CartItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [placingOrder, setPlacingOrder]   = useState(false);
  const [orderId, setOrderId]             = useState<string | null>(null);
  const [clientSecret, setClientSecret]   = useState<string | null>(null);
  const [showRequirements, setShowRequirements] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "stripe">("razorpay");

  // ── Form state ─────────────────────────────────────────────
  const [form, setForm] = useState({
    // Contact
    fullName: "",
    email: "",
    phone: "",
    // Address
    line1: "",
    line2: "",
    city: "",
    state: "",
    country: "IN",
    pincode: "",
    // Business (optional)
    companyName: "",
    website: "",
    // Requirements (optional)
    projectType: "" as "" | "home" | "office" | "hospitality" | "retail" | "other",
    budgetRange: "",
    timeline: "",
    notes: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    if (!accessToken) {
      setShowAuthModal(true);
      setLoading(false);
      return;
    }
    // Pre-fill email from auth store
    if (user?.email) setForm((f) => ({ ...f, email: user.email! }));

    // Load cart + user profile in parallel
    Promise.all([
      fetch(`${API}/orders/cart`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: "include",
      }).then((r) => r.json()),
      fetch(`${API}/profile/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: "include",
      }).then((r) => r.json()).catch(() => null),
    ])
      .then(([cart, profile]) => {
        setCartItems(cart?.items ?? []);
        if (profile) {
          setForm((f) => ({
            ...f,
            fullName:    profile.fullName    ?? f.fullName,
            phone:       profile.phone       ?? f.phone,
            companyName: profile.companyName ?? f.companyName,
            website:     profile.website     ?? f.website,
            line1:       profile.address?.line1   ?? f.line1,
            line2:       profile.address?.line2   ?? f.line2,
            city:        profile.address?.city    ?? f.city,
            state:       profile.address?.state   ?? f.state,
            country:     profile.address?.country ?? f.country,
            pincode:     profile.address?.pincode ?? f.pincode,
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [accessToken, user]);

  const subtotal   = cartItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const shippingFree = subtotal >= 500;

  const detailsValid =
    form.fullName && form.email && form.phone &&
    form.line1 && form.city && form.pincode;

  // ── Save profile + create order + get clientSecret ──────────
  async function handleProceedToPayment() {
    if (!accessToken || !detailsValid) return;
    setPlacingOrder(true);

    try {
      // 1. Upsert user profile (fire-and-forget, don't block on failure)
      fetch(`${API}/profile/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({
          fullName:    form.fullName,
          phone:       form.phone,
          companyName: form.companyName || undefined,
          website:     form.website     || undefined,
          address: {
            line1:   form.line1,
            line2:   form.line2 || undefined,
            city:    form.city,
            state:   form.state || undefined,
            country: form.country,
            pincode: form.pincode,
          },
          requirements: (form.projectType || form.budgetRange || form.notes)
            ? {
                projectType: form.projectType || undefined,
                budgetRange: form.budgetRange || undefined,
                timeline:    form.timeline    || undefined,
                notes:       form.notes       || undefined,
              }
            : undefined,
        }),
      }).catch(() => {});

      // 2. Create order from cart
      const orderRes = await fetch(`${API}/orders/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({
          shippingAddress: {
            line1:   form.line1,
            line2:   form.line2 || undefined,
            city:    form.city,
            state:   form.state || undefined,
            postcode: form.pincode,
            country: form.country,
          },
          notes:    form.notes || undefined,
          currency: "INR",
        }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json().catch(() => ({}));
        throw new Error(err.message ?? "Failed to create order");
      }

      const { order } = await orderRes.json();

      setOrderId(order.id);

      // Only fetch Stripe clientSecret if Stripe is the selected method
      if (paymentMethod === "stripe") {
        const piRes = await fetch(`${API}/orders/${order.id}/payment-intent`, {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          credentials: "include",
        });

        if (!piRes.ok) throw new Error("Failed to initiate payment");
        const { clientSecret: secret } = await piRes.json();
        setClientSecret(secret);
      }

      setStep("payment");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPlacingOrder(false);
    }
  }

  // ── Confirmed view ─────────────────────────────────────────
  if (step === "confirmed") {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
        </div>
        <h1 className="mb-3 font-serif text-3xl text-charcoal dark:text-cream">
          Order confirmed
        </h1>
        <p className="mb-2 font-sans text-sm text-charcoal/55 dark:text-cream/55">
          Thank you for your order. Your invoice will be emailed to {form.email}.
        </p>
        {orderId && (
          <p className="mb-8 font-mono text-xs text-charcoal/35 dark:text-cream/35">
            Order #{orderId.slice(0, 8).toUpperCase()}
          </p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/account/orders"
            className="inline-flex h-11 items-center justify-center rounded-full bg-charcoal px-8 font-sans text-[12px] tracking-[0.12em] uppercase text-cream hover:bg-charcoal-800 transition-colors"
          >
            Track Order
          </Link>
          <Link
            href="/account/invoices"
            className="inline-flex h-11 items-center justify-center rounded-full border border-gold/30 px-8 font-sans text-[12px] tracking-[0.12em] uppercase text-gold hover:bg-gold/5 transition-colors"
          >
            View Invoice
          </Link>
          <Link
            href="/products"
            className="inline-flex h-11 items-center justify-center rounded-full border border-charcoal/20 dark:border-cream/20 px-8 font-sans text-[12px] tracking-[0.12em] uppercase text-charcoal dark:text-cream hover:border-gold hover:text-gold transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-charcoal/8 dark:bg-cream/8" />
            ))}
          </div>
          <div className="h-80 animate-pulse rounded-2xl bg-charcoal/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10">
      {showAuthModal && (
        <CustomerAuthModal
          reason="checkout"
          redirectTo="/checkout"
          onClose={() => { setShowAuthModal(false); router.push("/cart"); }}
        />
      )}

      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/cart"
          className="flex items-center gap-1.5 font-sans text-sm text-charcoal/50 dark:text-cream/50 hover:text-charcoal dark:hover:text-cream transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to cart
        </Link>
        <div className="flex-1 border-t border-black/8 dark:border-white/8" />
        <div className="flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-gold" />
          <span className="font-sans text-xs text-charcoal/40 dark:text-cream/40">
            Secure checkout
          </span>
        </div>
      </div>

      {/* Step indicator */}
      <nav aria-label="Checkout steps" className="mb-10">
        <ol className="flex gap-6 font-sans text-xs">
          {(["details", "payment"] as Step[]).map((s, i) => {
            const labels: Record<Step, string> = { details: "Your details", payment: "Payment", confirmed: "Done" };
            const active = step === s;
            const done   = step === "payment" && s === "details";
            return (
              <li key={s} className="flex items-center gap-2">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold ${
                  done   ? "bg-emerald-500 text-white" :
                  active ? "bg-charcoal dark:bg-cream text-cream dark:text-charcoal" :
                           "bg-charcoal/10 dark:bg-cream/10 text-charcoal/40 dark:text-cream/40"
                }`}>
                  {done ? "✓" : i + 1}
                </span>
                <span className={active ? "font-medium text-charcoal dark:text-cream" : "text-charcoal/40 dark:text-cream/40"}>
                  {labels[s]}
                </span>
                {i < 1 && <span className="w-8 border-t border-dashed border-black/10 dark:border-white/10" />}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* ── Left: forms ─────────────────────────────────────── */}
        <div>
          {step === "details" && (
            <div className="space-y-8">

              {/* Contact */}
              <section>
                <h2 className="mb-5 font-serif text-2xl text-charcoal dark:text-cream">
                  Contact &amp; delivery
                </h2>
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full name" required>
                      <input value={form.fullName} onChange={set("fullName")} placeholder="Jane Smith" className={inputCls} />
                    </Field>
                    <Field label="Email" required>
                      <input value={form.email} onChange={set("email")} type="email" placeholder="jane@example.com" className={inputCls} />
                    </Field>
                  </div>
                  <Field label="Phone number" required>
                    <input value={form.phone} onChange={set("phone")} type="tel" placeholder="+91 98765 43210" className={inputCls} />
                  </Field>
                </div>
              </section>

              {/* Address */}
              <section>
                <h3 className="mb-4 font-sans text-sm font-semibold uppercase tracking-[0.12em] text-charcoal/50 dark:text-cream/50">
                  Delivery address
                </h3>
                <div className="space-y-4">
                  <Field label="Address line 1" required>
                    <input value={form.line1} onChange={set("line1")} placeholder="House / Flat No., Street" className={inputCls} />
                  </Field>
                  <Field label="Address line 2">
                    <input value={form.line2} onChange={set("line2")} placeholder="Area, Landmark (optional)" className={inputCls} />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="City" required>
                      <input value={form.city} onChange={set("city")} placeholder="Gurgaon" className={inputCls} />
                    </Field>
                    <Field label="State">
                      <input value={form.state} onChange={set("state")} placeholder="Haryana" className={inputCls} />
                    </Field>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Pincode" required>
                      <input value={form.pincode} onChange={set("pincode")} placeholder="122001" className={inputCls} />
                    </Field>
                    <Field label="Country">
                      <select value={form.country} onChange={set("country")} className={inputCls} aria-label="Country">
                        <option value="IN">India</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AE">UAE</option>
                        <option value="SG">Singapore</option>
                        <option value="US">United States</option>
                        <option value="AU">Australia</option>
                      </select>
                    </Field>
                  </div>
                </div>
              </section>

              {/* Business (optional) */}
              <section className="rounded-xl border border-black/8 dark:border-white/8 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-4 w-4 text-gold" />
                  <h3 className="font-sans text-sm font-medium text-charcoal dark:text-cream">
                    Business details
                    <span className="ml-2 font-normal text-charcoal/35 dark:text-cream/35">(optional)</span>
                  </h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Company name">
                    <input value={form.companyName} onChange={set("companyName")} placeholder="Studio Interior LLP" className={inputCls} />
                  </Field>
                  <Field label="Website">
                    <input value={form.website} onChange={set("website")} type="url" placeholder="https://yourstudio.in" className={inputCls} />
                  </Field>
                </div>
              </section>

              {/* Requirements (collapsible) */}
              <section className="rounded-xl border border-black/8 dark:border-white/8">
                <button
                  type="button"
                  onClick={() => setShowRequirements((v) => !v)}
                  className="flex w-full items-center justify-between px-5 py-4"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-gold" />
                    <span className="font-sans text-sm font-medium text-charcoal dark:text-cream">
                      Project requirements
                    </span>
                    <span className="font-sans text-xs text-charcoal/35 dark:text-cream/35">(optional — helps us serve you better)</span>
                  </div>
                  {showRequirements
                    ? <ChevronUp className="h-4 w-4 text-charcoal/40" />
                    : <ChevronDown className="h-4 w-4 text-charcoal/40" />}
                </button>

                {showRequirements && (
                  <div className="border-t border-black/6 dark:border-white/6 px-5 pb-5 pt-4 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Project type">
                        <select value={form.projectType} onChange={set("projectType")} className={inputCls} aria-label="Project type">
                          <option value="">Select…</option>
                          <option value="home">Residential / Home</option>
                          <option value="office">Office / Workspace</option>
                          <option value="hospitality">Hospitality</option>
                          <option value="retail">Retail</option>
                          <option value="other">Other</option>
                        </select>
                      </Field>
                      <Field label="Budget range">
                        <select value={form.budgetRange} onChange={set("budgetRange")} className={inputCls} aria-label="Budget range">
                          <option value="">Select…</option>
                          <option value="under-1L">Under ₹1,00,000</option>
                          <option value="1L-5L">₹1,00,000 – ₹5,00,000</option>
                          <option value="5L-20L">₹5,00,000 – ₹20,00,000</option>
                          <option value="20L-plus">₹20,00,000+</option>
                        </select>
                      </Field>
                    </div>
                    <Field label="Timeline">
                      <input value={form.timeline} onChange={set("timeline")} placeholder="e.g. 3 months, Q2 2026" className={inputCls} />
                    </Field>
                    <Field label="Notes / special requirements">
                      <textarea
                        value={form.notes}
                        onChange={set("notes")}
                        placeholder="Custom dimensions, materials, delivery instructions…"
                        rows={3}
                        className={`${inputCls} resize-none`}
                      />
                    </Field>
                  </div>
                )}
              </section>

              {/* Delivery note */}
              <div className="flex items-start gap-3 rounded-xl bg-charcoal/3 dark:bg-cream/3 p-4">
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <div className="font-sans text-sm">
                  <p className="font-medium text-charcoal dark:text-cream">White-glove delivery included</p>
                  <p className="mt-0.5 text-xs text-charcoal/50 dark:text-cream/50">
                    Two-person team, room placement, packaging removal. 5–7 days after dispatch.
                  </p>
                </div>
              </div>

              <button
                onClick={handleProceedToPayment}
                type="button"
                disabled={!detailsValid || placingOrder}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-charcoal px-8 font-sans text-[12px] tracking-[0.12em] uppercase text-cream hover:bg-charcoal-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                {placingOrder ? "Preparing payment…" : "Continue to Payment"}
              </button>
            </div>
          )}

          {step === "payment" && orderId && (
            <section>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-serif text-2xl text-charcoal dark:text-cream">Payment</h2>
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="font-sans text-xs text-charcoal/40 hover:text-gold transition-colors"
                >
                  Edit details
                </button>
              </div>

              {/* Delivery summary */}
              <div className="mb-6 rounded-xl border border-black/8 dark:border-white/8 p-4">
                <p className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-wider text-charcoal/35 dark:text-cream/35">
                  Delivering to
                </p>
                <p className="font-sans text-sm text-charcoal dark:text-cream">
                  {form.fullName} · {form.line1}, {form.city} {form.pincode}
                </p>
                <p className="font-sans text-xs text-charcoal/50 dark:text-cream/50">{form.email} · {form.phone}</p>
              </div>

              {/* Payment method selector */}
              <div className="mb-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("razorpay")}
                  className={[
                    "flex items-center gap-2.5 rounded-xl border p-4 text-left transition-all",
                    paymentMethod === "razorpay"
                      ? "border-gold bg-gold/5 ring-1 ring-gold/30"
                      : "border-black/8 dark:border-white/8 hover:border-gold/30",
                  ].join(" ")}
                >
                  <Smartphone className="h-4 w-4 shrink-0 text-[#2d6a4f]" />
                  <div>
                    <p className="font-sans text-xs font-medium text-charcoal dark:text-cream">UPI / NetBanking</p>
                    <p className="font-sans text-[10px] text-charcoal/40 dark:text-cream/40">Razorpay · India</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("stripe")}
                  className={[
                    "flex items-center gap-2.5 rounded-xl border p-4 text-left transition-all",
                    paymentMethod === "stripe"
                      ? "border-gold bg-gold/5 ring-1 ring-gold/30"
                      : "border-black/8 dark:border-white/8 hover:border-gold/30",
                  ].join(" ")}
                >
                  <CreditCard className="h-4 w-4 shrink-0 text-[#635bff]" />
                  <div>
                    <p className="font-sans text-xs font-medium text-charcoal dark:text-cream">Credit / Debit Card</p>
                    <p className="font-sans text-[10px] text-charcoal/40 dark:text-cream/40">Stripe · International</p>
                  </div>
                </button>
              </div>

              {/* Razorpay */}
              {paymentMethod === "razorpay" && (
                <div className="rounded-xl border border-black/8 dark:border-white/8 p-6 space-y-3">
                  <p className="font-sans text-xs text-charcoal/50 dark:text-cream/50">
                    Pay securely via UPI, Net Banking, Wallets, or Debit/Credit card powered by Razorpay.
                  </p>
                  <RazorpayButton
                    orderId={orderId}
                    total={subtotal}
                    accessToken={accessToken!}
                    customerName={form.fullName}
                    customerEmail={form.email}
                    customerPhone={form.phone}
                    onSuccess={(oid) => { setOrderId(oid); setStep("confirmed"); }}
                    onError={(msg) => alert(msg)}
                  />
                </div>
              )}

              {/* Stripe */}
              {paymentMethod === "stripe" && (
                clientSecret ? (
                  <div className="rounded-xl border border-black/8 dark:border-white/8 p-6">
                    <Elements
                      stripe={stripePromise}
                      options={{
                        clientSecret,
                        appearance: {
                          theme: "stripe",
                          variables: {
                            colorPrimary: "#c9a96e",
                            colorBackground: "#ffffff",
                            colorText: "#1a1a1a",
                            borderRadius: "12px",
                            fontFamily: "Inter, sans-serif",
                          },
                        },
                      }}
                    >
                      <StripePaymentForm
                        orderId={orderId!}
                        total={subtotal}
                        onSuccess={(oid) => { setOrderId(oid); setStep("confirmed"); }}
                      />
                    </Elements>
                  </div>
                ) : (
                  /* clientSecret not yet fetched — user switched from Razorpay to Stripe */
                  <div className="rounded-xl border border-black/8 dark:border-white/8 p-6 flex flex-col items-center gap-3 py-10">
                    <p className="font-sans text-sm text-charcoal/50 dark:text-cream/50 text-center">
                      Loading card payment…
                    </p>
                    <button
                      type="button"
                      disabled={placingOrder}
                      onClick={async () => {
                        if (!accessToken || !orderId) return;
                        setPlacingOrder(true);
                        try {
                          const piRes = await fetch(`${API}/orders/${orderId}/payment-intent`, {
                            method: "POST",
                            headers: { Authorization: `Bearer ${accessToken}` },
                            credentials: "include",
                          });
                          if (!piRes.ok) throw new Error("Failed to initiate payment");
                          const { clientSecret: secret } = await piRes.json();
                          setClientSecret(secret);
                        } catch (err) {
                          alert(err instanceof Error ? err.message : "Could not load card payment");
                        } finally {
                          setPlacingOrder(false);
                        }
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal-950 hover:bg-gold-400 disabled:opacity-50 transition-colors"
                    >
                      {placingOrder ? "Loading…" : "Load card payment"}
                    </button>
                  </div>
                )
              )}
            </section>
          )}
        </div>

        {/* ── Order summary sidebar ──────────────────────────── */}
        <aside className="sticky top-24 h-fit rounded-2xl border border-black/6 dark:border-white/6 bg-white dark:bg-charcoal-900 p-6">
          <h2 className="mb-4 font-serif text-lg text-charcoal dark:text-cream">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
          </h2>

          <ul className="mb-4 space-y-3">
            {cartItems.map((item) => (
              <li key={item.productId} className="flex justify-between gap-2 font-sans text-sm">
                <div className="min-w-0">
                  <p className="truncate text-charcoal/80 dark:text-cream/80">
                    {item.name ?? "Product"}{item.quantity > 1 ? ` × ${item.quantity}` : ""}
                  </p>
                  {item.finish && (
                    <p className="text-xs text-charcoal/35 dark:text-cream/35">{item.finish}</p>
                  )}
                </div>
                <span className="shrink-0 font-medium text-charcoal dark:text-cream">
                  {formatPrice(item.unitPrice * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="border-t border-black/6 dark:border-white/6 pt-4 space-y-2 font-sans text-sm">
            <div className="flex justify-between text-charcoal/60 dark:text-cream/60">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-charcoal/60 dark:text-cream/60">
              <span>Shipping</span>
              <span className={shippingFree ? "text-emerald-600 dark:text-emerald-400" : ""}>
                {shippingFree ? "Free" : "TBD"}
              </span>
            </div>
            <div className="flex justify-between pt-2 text-base font-medium text-charcoal dark:text-cream border-t border-black/6 dark:border-white/6">
              <span>Total</span>
              <span className="font-serif text-xl">{formatPrice(subtotal)}</span>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 rounded-lg bg-gold/5 border border-gold/15 px-3 py-2.5">
            <FileText className="h-3.5 w-3.5 shrink-0 text-gold" />
            <p className="font-sans text-[11px] text-charcoal/60 dark:text-cream/60">
              Invoice will be generated automatically after payment.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-charcoal-900 px-4 py-3 font-sans text-sm text-charcoal dark:text-cream placeholder:text-charcoal/25 dark:placeholder:text-cream/25 focus:border-gold/60 focus:ring-1 focus:ring-gold/20 outline-none transition-all";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block font-sans text-xs font-medium text-charcoal/60 dark:text-cream/60">
        {label}
        {required && <span className="ml-0.5 text-gold">*</span>}
      </label>
      {children}
    </div>
  );
}
