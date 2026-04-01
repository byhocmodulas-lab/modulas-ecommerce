"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Bell, Trash2, Save, Eye, EyeOff, CheckCircle2, Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

function DeleteAccountButton() {
  const { accessToken, clearAuth } = useAuthStore();
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  async function handleDelete() {
    if (!accessToken) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/auth/account`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? "Deletion failed. Please contact support.");
      }
      clearAuth();
      router.replace("/?deleted=1");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setLoading(false);
    }
  }

  if (!confirm) {
    return (
      <button
        type="button"
        onClick={() => setConfirm(true)}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-red-300 dark:border-red-700 px-5 py-2 font-sans text-[11px] tracking-[0.1em] uppercase text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Delete my account
      </button>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <p className="font-sans text-xs font-medium text-red-700 dark:text-red-400">
        This cannot be undone. All your data, orders, and saved items will be permanently deleted.
      </p>
      {error && <p className="font-sans text-xs text-red-500">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2 font-sans text-[11px] tracking-[0.1em] uppercase text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
          {loading ? "Deleting…" : "Yes, delete permanently"}
        </button>
        <button
          type="button"
          onClick={() => setConfirm(false)}
          className="rounded-full border border-black/15 dark:border-white/15 px-5 py-2 font-sans text-[11px] tracking-[0.1em] uppercase text-charcoal/50 dark:text-cream/50 hover:border-charcoal dark:hover:border-cream transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/6 dark:border-white/6 bg-white dark:bg-charcoal-900 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-black/5 dark:border-white/5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10">
          <Icon className="h-4 w-4 text-gold" />
        </div>
        <h2 className="font-serif text-lg text-charcoal dark:text-cream">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/50 dark:text-cream/50">
        {label}
      </label>
      {children}
    </div>
  );
}

const INPUT = "w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-4 py-2.5 font-sans text-sm text-charcoal dark:text-cream placeholder:text-charcoal/25 dark:placeholder:text-cream/25 focus:border-gold/60 focus:outline-none transition-colors";

export default function AccountSettingsPage() {
  const { user, accessToken, setAuth } = useAuthStore();

  // Profile form
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email,    setEmail]    = useState(user?.email ?? "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved,  setProfileSaved]  = useState(false);
  const [profileError,  setProfileError]  = useState("");

  // Password form
  const [currentPw,  setCurrentPw]  = useState("");
  const [newPw,      setNewPw]      = useState("");
  const [confirmPw,  setConfirmPw]  = useState("");
  const [showPw,     setShowPw]     = useState(false);
  const [pwSaving,   setPwSaving]   = useState(false);
  const [pwSaved,    setPwSaved]    = useState(false);
  const [pwError,    setPwError]    = useState("");

  // Notifications
  const [notifOrders,     setNotifOrders]     = useState(true);
  const [notifMarketing,  setNotifMarketing]  = useState(false);
  const [notifSaved,      setNotifSaved]      = useState(false);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    setProfileSaving(true);
    setProfileError("");
    try {
      // PATCH /auth/me (profile update endpoint)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"}/auth/me`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({ fullName, email }),
        },
      );
      if (!res.ok) throw new Error("Failed to update profile");
      const updated = await res.json();
      // Refresh auth store with updated user (token unchanged)
      if (user) {
        setAuth({ ...user, fullName: updated.fullName ?? fullName, email: updated.email ?? email }, accessToken, 900);
      }
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err: unknown) {
      setProfileError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setProfileSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    if (newPw !== confirmPw) { setPwError("Passwords do not match"); return; }
    if (newPw.length < 8)    { setPwError("Password must be at least 8 characters"); return; }
    if (!accessToken) return;
    setPwSaving(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"}/auth/change-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
        },
      );
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message ?? "Failed to change password");
      }
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      setPwSaved(true);
      setTimeout(() => setPwSaved(false), 3000);
    } catch (err: unknown) {
      setPwError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPwSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Profile ─────────────────────────────────────────── */}
      <SectionCard title="Profile" icon={User}>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold font-serif text-2xl shrink-0">
              {fullName?.[0] ?? email?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div>
              <p className="font-sans text-sm font-medium text-charcoal dark:text-cream">{fullName || "Your name"}</p>
              <p className="font-sans text-xs text-charcoal/40 dark:text-cream/40">{email}</p>
              <span className="mt-1 inline-flex rounded-full bg-gold/10 px-2 py-0.5 font-sans text-[10px] tracking-[0.12em] uppercase text-gold">
                {user?.role?.replace("_", " ")}
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className={INPUT}
              />
            </Field>
            <Field label="Email address">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={INPUT}
              />
            </Field>
          </div>

          {profileError && (
            <p className="font-sans text-sm text-red-500">{profileError}</p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={profileSaving}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              {profileSaving ? "Saving…" : "Save changes"}
            </button>
            {profileSaved && (
              <span className="flex items-center gap-1.5 font-sans text-sm text-emerald-600">
                <CheckCircle2 className="h-4 w-4" /> Saved
              </span>
            )}
          </div>
        </form>
      </SectionCard>

      {/* ── Password ────────────────────────────────────────── */}
      <SectionCard title="Password" icon={Lock}>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <Field label="Current password">
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="••••••••"
                className={INPUT + " pr-10"}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/30 dark:text-cream/30 hover:text-charcoal dark:hover:text-cream"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="New password">
              <input
                type={showPw ? "text" : "password"}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Min. 8 characters"
                className={INPUT}
                autoComplete="new-password"
              />
            </Field>
            <Field label="Confirm new password">
              <input
                type={showPw ? "text" : "password"}
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Repeat password"
                className={INPUT}
                autoComplete="new-password"
              />
            </Field>
          </div>

          {/* Password strength */}
          {newPw && (
            <div className="space-y-1.5">
              <div className="flex gap-1">
                {[
                  newPw.length >= 8,
                  /[A-Z]/.test(newPw),
                  /[0-9]/.test(newPw),
                  /[^A-Za-z0-9]/.test(newPw),
                ].map((met, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${met ? "bg-emerald-400" : "bg-black/8 dark:bg-white/8"}`}
                  />
                ))}
              </div>
              <p className="font-sans text-[11px] text-charcoal/40 dark:text-cream/40">
                Use uppercase, numbers and symbols for a stronger password
              </p>
            </div>
          )}

          {pwError && <p className="font-sans text-sm text-red-500">{pwError}</p>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={pwSaving || !currentPw || !newPw}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors disabled:opacity-50"
            >
              <Lock className="h-3.5 w-3.5" />
              {pwSaving ? "Updating…" : "Update password"}
            </button>
            {pwSaved && (
              <span className="flex items-center gap-1.5 font-sans text-sm text-emerald-600">
                <CheckCircle2 className="h-4 w-4" /> Updated
              </span>
            )}
          </div>
        </form>
      </SectionCard>

      {/* ── Notifications ───────────────────────────────────── */}
      <SectionCard title="Notifications" icon={Bell}>
        <div className="space-y-4">
          {[
            {
              label: "Order updates",
              description: "Shipping confirmations, delivery notifications and order status changes.",
              value: notifOrders,
              onChange: setNotifOrders,
            },
            {
              label: "New collections & offers",
              description: "Be the first to hear about new arrivals, exclusive offers and events.",
              value: notifMarketing,
              onChange: setNotifMarketing,
            },
          ].map(({ label, description, value, onChange }) => (
            <label key={label} className="flex items-start justify-between gap-6 cursor-pointer group">
              <div>
                <p className="font-sans text-sm font-medium text-charcoal dark:text-cream">{label}</p>
                <p className="font-sans text-xs text-charcoal/40 dark:text-cream/40 mt-0.5 leading-relaxed">
                  {description}
                </p>
              </div>
              <div className="relative shrink-0">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => { onChange(e.target.checked); setNotifSaved(false); }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-black/10 dark:bg-white/10 rounded-full peer-checked:bg-gold transition-colors" />
                <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
          ))}

          <button
            onClick={() => { setNotifSaved(true); setTimeout(() => setNotifSaved(false), 3000); }}
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
          >
            <Save className="h-3.5 w-3.5" />
            Save preferences
          </button>
          {notifSaved && (
            <span className="ml-3 inline-flex items-center gap-1.5 font-sans text-sm text-emerald-600">
              <CheckCircle2 className="h-4 w-4" /> Saved
            </span>
          )}
        </div>
      </SectionCard>

      {/* ── Danger zone ─────────────────────────────────────── */}
      <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/10 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <Trash2 className="h-4 w-4 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-sans text-sm font-medium text-red-700 dark:text-red-400">Delete account</h3>
            <p className="font-sans text-xs text-red-500/70 dark:text-red-400/60 mt-1 leading-relaxed">
              Permanently delete your Modulas account and all associated data. This action cannot be undone.
              Any active orders must be completed or cancelled first.
            </p>
            <DeleteAccountButton />
          </div>
        </div>
      </div>
    </div>
  );
}
