"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle2, Info } from "lucide-react";
import * as authApi from "@/lib/api/auth";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { Role } from "@/lib/stores/auth-store";

interface Props {
  defaultRole?: string;
}

const ROLES: Array<{
  value: string;
  label: string;
  description: string;
  badge?: string;
}> = [
  {
    value: "customer",
    label: "Customer",
    description: "Browse, configure, and purchase luxury furniture.",
  },
  {
    value: "architect",
    label: "Architect / Designer",
    description: "Trade pricing, client project tools, and quote generation.",
    badge: "Requires verification",
  },
  {
    value: "creator",
    label: "Creator / Affiliate",
    description: "Earn commissions by sharing Modulas with your audience.",
  },
  {
    value: "vendor",
    label: "Vendor / Brand",
    description: "List products and collaborate with Modulas as a supplier.",
    badge: "Requires approval",
  },
  {
    value: "intern",
    label: "Workshop Student",
    description: "Access workshop courses, internship programmes, and community.",
  },
];

export function SignupForm({ defaultRole }: Props) {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [step, setStep]           = useState<1 | 2>(1);
  const [role, setRole]           = useState(defaultRole ?? "customer");
  const [fullName, setFullName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const passwordStrength = getPasswordStrength(password);

  function handleRoleSelect(e: React.FormEvent) {
    e.preventDefault();
    setStep(2);
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const result = await authApi.register({ email, password, fullName, role });

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

        document.cookie = `modulas_token=${result.accessToken}; path=/; max-age=${result.expiresIn}; SameSite=Lax`;

        if (result.pendingApproval) {
          router.push("/account/pending-approval");
        } else {
          router.push("/login?registered=1");
        }
      } catch (err) {
        setError(
          err instanceof authApi.AuthApiError
            ? err.message
            : "Something went wrong. Please try again.",
        );
      }
    });
  }

  // ── Step 1: Role selection ─────────────────────────────────────
  if (step === 1) {
    return (
      <form onSubmit={handleRoleSelect} className="space-y-3">
        <p className="mb-4 text-sm font-medium text-stone-700">I am a…</p>

        {ROLES.map((r) => (
          <label
            key={r.value}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
              role === r.value
                ? "border-amber-500 bg-amber-50 ring-1 ring-amber-500"
                : "border-stone-200 bg-white hover:border-stone-300"
            }`}
          >
            <input
              type="radio"
              name="role"
              value={r.value}
              checked={role === r.value}
              onChange={() => setRole(r.value)}
              className="mt-0.5 accent-amber-500"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-stone-900">{r.label}</span>
                {r.badge && (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-2xs font-medium text-amber-700">
                    {r.badge}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-stone-500">{r.description}</p>
            </div>
            {role === r.value && (
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-amber-500" />
            )}
          </label>
        ))}

        <button
          type="submit"
          className="mt-2 flex w-full items-center justify-center rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
        >
          Continue
        </button>
      </form>
    );
  }

  // ── Step 2: Account details ────────────────────────────────────
  const selectedRole = ROLES.find((r) => r.value === role);

  return (
    <form onSubmit={handleSignup} noValidate className="space-y-4">
      {/* Back + role indicator */}
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="text-xs text-stone-500 hover:text-stone-700"
        >
          ← Change role
        </button>
        <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
          {selectedRole?.label}
        </span>
      </div>

      {/* Pending approval notice */}
      {selectedRole?.badge && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
          <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
          <span>
            <strong>{selectedRole.label}</strong> accounts require admin verification before full
            access is granted. You can still browse the store while pending.
          </span>
        </div>
      )}

      {/* Full name */}
      <div>
        <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-stone-700">
          Full name
        </label>
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:opacity-50"
          placeholder="Jane Smith"
          disabled={isPending}
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-stone-700">
          Email address <span className="text-red-500">*</span>
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

      {/* Password */}
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-stone-700">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPw ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:opacity-50"
            placeholder="Min 8 chars, letter + number"
            disabled={isPending}
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* Strength bar */}
        {password && (
          <div className="mt-2 space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    passwordStrength.score >= level
                      ? level <= 1
                        ? "bg-red-400"
                        : level <= 2
                          ? "bg-amber-400"
                          : level <= 3
                            ? "bg-yellow-400"
                            : "bg-emerald-500"
                      : "bg-stone-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-stone-500">{passwordStrength.label}</p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Terms */}
      <p className="text-xs text-stone-400">
        By creating an account you agree to our{" "}
        <a href="/legal/terms" className="underline hover:text-stone-600">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/legal/privacy" className="underline hover:text-stone-600">
          Privacy Policy
        </a>
        .
      </p>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending || !email || !password}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {isPending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}

// ── Password strength helper ────────────────────────────────────

function getPasswordStrength(pw: string): { score: number; label: string } {
  if (!pw) return { score: 0, label: "" };
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;

  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  return { score, label: labels[score] ?? "" };
}