"use client";

import { useState, useEffect } from "react";
import { Lock, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils/format";

// ── Razorpay global types ─────────────────────────────────────────────
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key:          string;
  amount:       number;
  currency:     string;
  order_id:     string;
  name:         string;
  description?: string;
  image?:       string;
  prefill?: {
    name?:    string;
    email?:   string;
    contact?: string;
  };
  theme?: { color: string };
  handler: (response: RazorpayResponse) => void | Promise<void>;
  modal?: { ondismiss?: () => void };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id:   string;
  razorpay_signature:  string;
}

interface RazorpayInstance {
  open: () => void;
}

// ── Load Razorpay script once ─────────────────────────────────────────
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window.Razorpay !== "undefined") { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ── Props ──────────────────────────────────────────────────────────────
interface RazorpayButtonProps {
  orderId:    string;      // internal Modulas order ID
  total:      number;      // in paise (INR × 100) OR rupees — see amountInPaise
  amountInPaise?: boolean; // true if total is already in paise
  accessToken: string;
  customerName?:  string;
  customerEmail?: string;
  customerPhone?: string;
  onSuccess: (orderId: string) => void;
  onError?:  (msg: string) => void;
}

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";
const RZP_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "";

export function RazorpayButton({
  orderId,
  total,
  amountInPaise = false,
  accessToken,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onError,
}: RazorpayButtonProps) {
  const [loading,    setLoading]    = useState(false);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    loadRazorpayScript().then(setScriptReady);
  }, []);

  async function handlePay() {
    if (!scriptReady) { onError?.("Payment SDK not loaded. Please refresh."); return; }
    setLoading(true);

    try {
      // 1. Create Razorpay order on backend
      const res = await fetch(`${API}/orders/${orderId}/razorpay-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? "Failed to initiate Razorpay payment");
      }

      const { razorpayOrderId, amount, currency } = await res.json();

      // 2. Open Razorpay modal
      const rzp = new window.Razorpay({
        key:      RZP_KEY,
        amount:   amountInPaise ? total : total * 100,
        currency: currency ?? "INR",
        order_id: razorpayOrderId,
        name:     "Modulas",
        description: `Order #${orderId.slice(0, 8).toUpperCase()}`,
        image:    "/logo-mark-dark.png",
        prefill: {
          name:    customerName,
          email:   customerEmail,
          contact: customerPhone,
        },
        theme: { color: "#c9a96e" },
        handler: async (response: RazorpayResponse) => {
          // 3. Verify payment on backend
          try {
            const verifyRes = await fetch(`${API}/orders/${orderId}/razorpay-verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization:  `Bearer ${accessToken}`,
              },
              credentials: "include",
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_signature:  response.razorpay_signature,
              }),
            });

            if (!verifyRes.ok) throw new Error("Payment verification failed");
            onSuccess(orderId);
          } catch (e) {
            onError?.(e instanceof Error ? e.message : "Payment verification failed");
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.open();
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Payment failed");
      setLoading(false);
    }
  }

  const displayAmount = amountInPaise ? total / 100 : total;

  return (
    <button
      type="button"
      onClick={handlePay}
      disabled={loading || !scriptReady}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#2d6a4f] px-8 font-sans text-[12px] tracking-[0.15em] uppercase text-white hover:bg-[#245a42] disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <Lock className="h-3.5 w-3.5" />
          Pay {formatPrice(displayAmount)} — UPI / Card / NetBanking
        </>
      )}
    </button>
  );
}
