"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { affiliateApi, type AffiliateLink as ApiAffiliateLink } from "@/lib/api/client";
import {
  TrendingUp, Link2, Wallet, Copy, Check,
  ExternalLink, ArrowRight, ShoppingBag,
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";

// ── Placeholder data ───────────────────────────────────────────
const EARNINGS = {
  thisMonth:  1840,
  lastMonth:  1220,
  pending:    640,
  allTime:    12480,
};

const RECENT_CONVERSIONS = [
  { product: "Oslo 3-Seat Sofa",          commission: 160, date: "2026-03-13", status: "confirmed" },
  { product: "Kira Dining Table",          commission: 205, date: "2026-03-11", status: "confirmed" },
  { product: "Arc Lounge Chair × 2",       commission: 90,  date: "2026-03-10", status: "pending" },
  { product: "Holt Bookcase",              commission: 72,  date: "2026-03-07", status: "confirmed" },
  { product: "Lune Bedside Table × 4",     commission: 136, date: "2026-03-05", status: "paid" },
];

const AFFILIATE_LINKS = [
  { label: "Homepage",           url: "https://modulas.com?ref=CREATOR42",     clicks: 312, conversions: 8  },
  { label: "Oslo Sofa",         url: "https://modulas.com/products/oslo?ref=CREATOR42", clicks: 1840, conversions: 14 },
  { label: "Spring Collection", url: "https://modulas.com/products?ref=CREATOR42", clicks: 640, conversions: 5  },
];

const STATUS_COLOUR = {
  pending:   "text-amber-700 bg-amber-50 border-amber-200",
  confirmed: "text-sky-700 bg-sky-50 border-sky-200",
  paid:      "text-emerald-700 bg-emerald-50 border-emerald-200",
};

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
}

function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="flex h-7 w-7 items-center justify-center rounded-lg border border-black/8 text-charcoal/30 hover:border-gold hover:text-gold transition-colors"
      aria-label="Copy link"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

export default function CreatorDashboardPage() {
  const { user, accessToken } = useAuthStore();
  const [affiliateLinks, setAffiliateLinks] = useState(AFFILIATE_LINKS);

  useEffect(() => {
    if (!accessToken) return;
    affiliateApi.listLinks(accessToken)
      .then((links) => {
        if (links.length === 0) return;
        setAffiliateLinks(links.map((l: ApiAffiliateLink) => ({
          label: l.label,
          url: l.targetUrl,
          clicks: l.clicks,
          conversions: l.conversions,
        })));
      })
      .catch(() => {});
  }, [accessToken]);

  if (!user || (user.role !== "creator" && user.role !== "master_admin" && user.role !== "editor")) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-black/6 bg-white py-24 text-center">
        <TrendingUp className="mx-auto mb-4 h-10 w-10 text-charcoal/12" />
        <p className="font-serif text-xl text-charcoal mb-2">Creator Hub</p>
        <p className="font-sans text-sm text-charcoal/40 mb-6 max-w-sm">
          This area is for approved Modulas creators. Apply to join our affiliate programme.
        </p>
        <Link
          href="/contact?subject=creator-application"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
        >
          Apply to create <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  const conversionRate = affiliateLinks.length === 0 ? "0.0" :
    ((affiliateLinks.reduce((s, l) => s + l.conversions, 0) /
    (affiliateLinks.reduce((s, l) => s + l.clicks, 0) || 1)) * 100).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl text-charcoal">Creator Hub</h1>
        <p className="font-sans text-sm text-charcoal/40 mt-0.5">
          Welcome back{user.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}. Here&apos;s your performance this month.
        </p>
      </div>

      {/* Earnings KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "This month",    value: formatPrice(EARNINGS.thisMonth),  colour: "text-charcoal", sub: `vs ${formatPrice(EARNINGS.lastMonth)} last month` },
          { label: "Pending",       value: formatPrice(EARNINGS.pending),    colour: "text-amber-600", sub: "Awaiting order confirmation" },
          { label: "All time",      value: formatPrice(EARNINGS.allTime),    colour: "text-charcoal", sub: "Since you joined" },
          { label: "Conv. rate",    value: `${conversionRate}%`,            colour: "text-charcoal", sub: "Across all links" },
        ].map(({ label, value, colour, sub }) => (
          <div key={label} className="rounded-2xl border border-black/6 bg-white p-5">
            <p className="font-sans text-xs text-charcoal/40 mb-2">{label}</p>
            <p className={`font-serif text-2xl ${colour}`}>{value}</p>
            <p className="font-sans text-[11px] text-charcoal/30 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Affiliate links */}
      <div className="rounded-2xl border border-black/6 bg-white overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
          <h2 className="font-serif text-lg text-charcoal">Your affiliate links</h2>
          <Link
            href="/creator/links"
            className="font-sans text-[11px] tracking-[0.08em] uppercase text-charcoal/40 hover:text-gold transition-colors"
          >
            Manage
          </Link>
        </div>
        <div className="divide-y divide-black/4">
          {affiliateLinks.map((link) => (
            <div key={link.label} className="flex items-center gap-4 px-5 py-3.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                <Link2 className="h-3.5 w-3.5 text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm font-medium text-charcoal">{link.label}</p>
                <p className="font-mono text-[10px] text-charcoal/30 truncate">{link.url}</p>
              </div>
              <div className="hidden sm:flex items-center gap-6 text-right shrink-0">
                <div>
                  <p className="font-sans text-sm font-medium text-charcoal">{link.clicks.toLocaleString()}</p>
                  <p className="font-sans text-[10px] text-charcoal/35">clicks</p>
                </div>
                <div>
                  <p className="font-sans text-sm font-medium text-charcoal">{link.conversions}</p>
                  <p className="font-sans text-[10px] text-charcoal/35">orders</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <CopyButton url={link.url} />
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open affiliate link"
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-black/8 text-charcoal/30 hover:border-gold hover:text-gold transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent conversions */}
      <div className="rounded-2xl border border-black/6 bg-white overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
          <h2 className="font-serif text-lg text-charcoal">Recent conversions</h2>
          <Link href="/creator/payouts" className="font-sans text-[11px] tracking-[0.08em] uppercase text-charcoal/40 hover:text-gold transition-colors">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm min-w-[480px]">
            <thead className="border-b border-black/4">
              <tr>
                {["Product", "Commission", "Date", "Status"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-[10px] tracking-[0.15em] uppercase text-charcoal/35 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_CONVERSIONS.map((c, i) => {
                const date = new Date(c.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
                return (
                  <tr key={i} className="border-b border-black/3 last:border-0 hover:bg-black/1 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="h-3.5 w-3.5 text-charcoal/25 shrink-0" />
                        <span className="text-charcoal">{c.product}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-charcoal">{formatPrice(c.commission)}</td>
                    <td className="px-5 py-3.5 text-charcoal/40">{date}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex rounded-full border px-2 py-0.5 font-sans text-[10px] tracking-[0.08em] uppercase font-medium ${STATUS_COLOUR[c.status as keyof typeof STATUS_COLOUR]}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout CTA */}
      <div className="rounded-2xl border border-black/6 bg-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-sans text-[11px] tracking-[0.12em] uppercase text-gold mb-1">Ready to withdraw</p>
          <p className="font-serif text-2xl text-charcoal">{formatPrice(EARNINGS.thisMonth)}</p>
          <p className="font-sans text-xs text-charcoal/40 mt-0.5">Paid on the 1st of each month via bank transfer</p>
        </div>
        <Link
          href="/creator/payouts"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
        >
          <Wallet className="h-3.5 w-3.5" /> View payouts
        </Link>
      </div>
    </div>
  );
}
