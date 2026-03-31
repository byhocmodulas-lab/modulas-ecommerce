"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import * as authApi from "@/lib/api/auth";

const ACCESS_CODE = process.env.NEXT_PUBLIC_ADMIN_ACCESS_CODE ?? "modulas-x";

type Step = "code" | "credentials" | "error";

export default function WorkspacePage() {
  const router   = useRouter();
  const setAuth  = useAuthStore(s => s.setAuth);

  const [step,     setStep]     = useState<Step>("code");
  const [code,     setCode]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const codeRef = useRef<HTMLInputElement>(null);

  function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (code.trim() === ACCESS_CODE) {
      setStep("credentials");
      setError("");
    } else {
      setError("Invalid access code.");
      setCode("");
      codeRef.current?.focus();
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await authApi.login({ email, password });
      if (res.user.role !== "master_admin") {
        setError("Access denied. Master admin credentials required.");
        setLoading(false);
        return;
      }
      setAuth(
        {
          id: res.user.id,
          email: res.user.email,
          fullName: res.user.fullName,
          avatarUrl: res.user.avatarUrl,
          role: res.user.role as "master_admin",
          isVerified: res.user.isVerified,
        },
        res.accessToken,
        res.expiresIn,
      );
      document.cookie = `modulas_token=${res.accessToken}; path=/; max-age=${res.expiresIn}; SameSite=Lax`;
      router.replace("/master-admin");
    } catch {
      setError("Invalid credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Minimal logo mark */}
        <div className="mb-10 text-center">
          <span className="font-serif text-2xl tracking-[0.3em] text-white/20 uppercase select-none">
            M
          </span>
        </div>

        {step === "code" && (
          <form onSubmit={verifyCode} className="space-y-4">
            <input
              ref={codeRef}
              type="password"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Access code"
              autoComplete="off"
              autoFocus
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded px-4 py-3 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
            />
            {error && <p className="font-sans text-xs text-red-400">{error}</p>}
            <button
              type="submit"
              className="w-full bg-white/8 hover:bg-white/12 border border-white/10 text-white/60 hover:text-white rounded px-4 py-3 font-sans text-sm transition-colors"
            >
              Continue
            </button>
          </form>
        )}

        {step === "credentials" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="email"
              autoFocus
              required
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded px-4 py-3 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              required
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded px-4 py-3 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
            />
            {error && <p className="font-sans text-xs text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white/8 hover:bg-white/12 border border-white/10 text-white/60 hover:text-white rounded px-4 py-3 font-sans text-sm transition-colors disabled:opacity-40"
            >
              {loading ? "Verifying…" : "Sign in"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
