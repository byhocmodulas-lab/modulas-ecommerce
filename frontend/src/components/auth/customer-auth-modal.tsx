"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "./login-form";

interface CustomerAuthModalProps {
  /** Why sign-in is being requested — shown as context copy */
  reason?: "checkout" | "save-design" | "consultation";
  /** Where to redirect after successful sign-in */
  redirectTo?: string;
  onClose: () => void;
}

const REASON_COPY: Record<NonNullable<CustomerAuthModalProps["reason"]>, { title: string; body: string }> = {
  checkout:     { title: "Sign in to checkout",    body: "Save your order, track delivery, and manage returns from your account." },
  "save-design":{ title: "Sign in to save",        body: "Your design will be saved to your account so you can return to it anytime." },
  consultation: { title: "Sign in to book",        body: "Your consultation details will be linked to your account for easy follow-up." },
};

/**
 * Lightweight modal that appears when a customer action requires authentication.
 * Triggered inline — never redirects to a generic login page.
 */
export function CustomerAuthModal({ reason = "checkout", redirectTo, onClose }: CustomerAuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const overlayRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const copy = REASON_COPY[reason];

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-charcoal-950/80 backdrop-blur-sm px-4 animate-fade-in"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors z-10"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Header strip */}
        <div className="bg-charcoal-950 px-8 py-6">
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold/60 mb-2">
            Modulas Account
          </p>
          <h2 className="font-serif text-2xl font-light text-cream">{copy.title}</h2>
          <p className="font-sans text-sm text-cream/40 mt-1.5 leading-relaxed">{copy.body}</p>
        </div>

        {/* Form area */}
        <div className="px-8 py-6">
          {/* Login / Signup tabs */}
          <div className="flex gap-0 mb-6 rounded-full border border-stone-200 p-0.5">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={[
                "flex-1 rounded-full py-1.5 font-sans text-[11px] tracking-[0.1em] uppercase transition-colors",
                mode === "login"
                  ? "bg-charcoal-950 text-cream"
                  : "text-stone-400 hover:text-stone-700",
              ].join(" ")}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={[
                "flex-1 rounded-full py-1.5 font-sans text-[11px] tracking-[0.1em] uppercase transition-colors",
                mode === "signup"
                  ? "bg-charcoal-950 text-cream"
                  : "text-stone-400 hover:text-stone-700",
              ].join(" ")}
            >
              Create Account
            </button>
          </div>

          {mode === "login" ? (
            <LoginForm redirectTo={redirectTo} />
          ) : (
            <p className="text-center font-sans text-sm text-stone-400 py-4">
              <a
                href={`/signup?next=${encodeURIComponent(redirectTo ?? "/")}`}
                className="font-medium text-amber-600 hover:text-amber-700 hover:underline"
              >
                Create your account →
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
