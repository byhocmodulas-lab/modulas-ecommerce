"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import * as authApi from "@/lib/api/auth";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { Role } from "@/lib/stores/auth-store";

const ROLE_REDIRECT: Record<string, string> = {
  master_admin: "/master-admin",
  editor:       "/master-admin",
  architect:    "/architect",
  vendor:       "/vendor",
  creator:      "/creator",
  intern:       "/intern",
  customer:     "/",
};

interface Props {
  redirectTo?: string;
  /** "dark" renders on charcoal-950 backgrounds (portal login pages) */
  theme?: "light" | "dark";
}

export function LoginForm({ redirectTo, theme = "light" }: Props) {
  const dark = theme === "dark";
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const result = await authApi.login({ email, password });

        // Persist to store
        setAuth(
          {
            id: result.user.id,
            email: result.user.email,
            fullName: result.user.fullName,
            avatarUrl: result.user.avatarUrl,
            role: result.user.role as Role,
            isVerified: result.user.isVerified,
          },
          result.accessToken,
          result.expiresIn,
        );

        // Also set JWT in cookie for server-side auth (middleware)
        document.cookie = `modulas_token=${result.accessToken}; path=/; max-age=${result.expiresIn}; SameSite=Lax`;

        const destination = redirectTo ?? ROLE_REDIRECT[result.user.role] ?? "/";
        router.push(destination);
        router.refresh();
      } catch (err) {
        setError(
          err instanceof authApi.AuthApiError
            ? err.message
            : "Something went wrong. Please try again.",
        );
      }
    });
  }

  const inputCls = dark
    ? "w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-cream placeholder:text-cream/30 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20 disabled:opacity-50"
    : "w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:opacity-50";

  const labelCls = dark ? "mb-1.5 block text-sm font-medium text-cream/60" : "mb-1.5 block text-sm font-medium text-stone-700";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Email */}
      <div>
        <label htmlFor="email" className={labelCls}>
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
          placeholder="you@example.com"
          disabled={isPending}
        />
      </div>

      {/* Password */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className={dark ? "text-sm font-medium text-cream/60" : "text-sm font-medium text-stone-700"}>
            Password
          </label>
          <a
            href="/forgot-password"
            className={dark ? "text-xs text-gold/60 hover:text-gold" : "text-xs text-amber-600 hover:text-amber-700 hover:underline"}
          >
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPw ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputCls} pr-10`}
            placeholder="••••••••"
            disabled={isPending}
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className={dark ? "absolute right-3 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream/60" : "absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"}
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p role="alert" className={dark ? "rounded-lg border border-red-900/40 bg-red-900/20 px-3.5 py-2.5 text-sm text-red-300" : "rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"}>
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending || !email || !password}
        className={dark
          ? "flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-medium text-charcoal-950 transition hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-gold/30 disabled:cursor-not-allowed disabled:opacity-50"
          : "flex w-full items-center justify-center gap-2 rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900/30 disabled:cursor-not-allowed disabled:opacity-50"
        }
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {isPending ? "Signing in…" : "Sign in"}
      </button>

      {/* Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className={`w-full border-t ${dark ? "border-white/8" : "border-stone-200"}`} />
        </div>
        <div className="relative flex justify-center">
          <span className={`px-3 text-xs ${dark ? "bg-charcoal-950 text-cream/25" : "bg-stone-50 text-stone-400"}`}>
            or continue with
          </span>
        </div>
      </div>

      {/* OAuth placeholder */}
      <button
        type="button"
        className={dark
          ? "flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-cream/70 transition hover:bg-white/10 focus:outline-none"
          : "flex w-full items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50 focus:outline-none"
        }
        onClick={() => alert("Google OAuth — configure Clerk or NextAuth")}
      >
        <GoogleIcon />
        Continue with Google
      </button>
    </form>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
