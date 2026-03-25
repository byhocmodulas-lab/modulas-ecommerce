"use client";

import { useState, useTransition } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import * as authApi from "@/lib/api/auth";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        await authApi.forgotPassword(email);
        setSubmitted(true);
      } catch {
        // Always show success to prevent email enumeration
        setSubmitted(true);
      }
    });
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        <div>
          <p className="text-sm font-medium text-stone-900">Check your inbox</p>
          <p className="mt-1 text-sm text-stone-500">
            If an account exists for <strong>{email}</strong>, you'll receive a
            reset link within a few minutes.
          </p>
        </div>
        <a
          href="/login"
          className="mt-2 text-sm font-medium text-amber-600 hover:text-amber-700 hover:underline"
        >
          Back to sign in
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-stone-700">
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:opacity-50"
          placeholder="you@example.com"
          disabled={isPending}
        />
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending || !email}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {isPending ? "Sending…" : "Send reset link"}
      </button>

      <p className="text-center text-xs text-stone-400">
        <a href="/login" className="hover:text-stone-600 hover:underline">
          Back to sign in
        </a>
      </p>
    </form>
  );
}