import { CheckCircle2, TrendingUp, Gift, Star } from "lucide-react";

const TIERS = [
  {
    name: "Associate",
    discount: "25%",
    threshold: "Up to ₹25 Lakhs / year",
    colour: "border-black/10 bg-white",
    badge: "text-charcoal/60 bg-black/5 border-black/10",
    active: true,
    perks: [
      "25% trade discount on all orders",
      "Access to Technical Library & CAD files",
      "Dedicated account manager",
      "Priority delivery scheduling",
      "Quarterly product updates",
    ],
  },
  {
    name: "Partner",
    discount: "33%",
    threshold: "₹25L – ₹75L / year",
    colour: "border-gold/20 bg-gold/4",
    badge: "text-gold bg-gold/10 border-gold/20",
    active: false,
    perks: [
      "33% trade discount on all orders",
      "Everything in Associate",
      "Co-branding on project installations",
      "Exclusive new product previews",
      "Featured on Modulas architect showcase",
      "Annual partner conference invite",
    ],
  },
  {
    name: "Principal",
    discount: "40%",
    threshold: "₹75L+ / year",
    colour: "border-charcoal/15 bg-charcoal/3",
    badge: "text-charcoal bg-charcoal/8 border-charcoal/15",
    active: false,
    perks: [
      "40% trade discount on all orders",
      "Everything in Partner",
      "Custom pricing on bulk orders",
      "Dedicated project co-ordinator",
      "White-label quote templates",
      "Revenue share on referrals",
      "Free 3D rendering for client presentations",
    ],
  },
];

const PROGRESS = {
  currentTier: "Associate",
  nextTier: "Partner",
  currentValue: 1800000, // ₹18L
  nextThreshold: 2500000, // ₹25L
  pct: 72,
};

const RECENT_COMMISSIONS = [
  { project: "Belgravia Penthouse",       order: "₹3.8L",  commission: "₹95,000",  date: "Mar 2026" },
  { project: "Chelsea Townhouse",         order: "₹2.1L",  commission: "₹52,500",  date: "Mar 2026" },
  { project: "Shoreditch Office Fit-out", order: "₹8.4L",  commission: "₹2,10,000", date: "Feb 2026" },
  { project: "Notting Hill Family Home",  order: "₹1.2L",  commission: "₹30,000",  date: "Jan 2026" },
];

function formatINR(n: number) {
  return `₹${(n / 100000).toFixed(1)}L`;
}

export default function ArchitectPartnerPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-charcoal">Partner Program</h1>
        <p className="font-sans text-sm text-charcoal/40 mt-0.5">Your trade benefits, tier progress and commission history</p>
      </div>

      {/* Current status card */}
      <div className="rounded-2xl border border-gold/25 bg-gold/6 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-gold fill-gold" />
              <span className="font-sans text-[11px] uppercase tracking-[0.15em] text-gold">Current Tier</span>
            </div>
            <p className="font-serif text-3xl text-charcoal">Associate — 25% off</p>
            <p className="font-sans text-sm text-charcoal/50 mt-0.5">Priya Sharma Design Studio · Member since Jan 2024</p>
          </div>
          <div className="text-right">
            <p className="font-serif text-2xl text-charcoal">{formatINR(PROGRESS.currentValue)}</p>
            <p className="font-sans text-xs text-charcoal/40">Annual order value (YTD)</p>
          </div>
        </div>

        {/* Progress to next tier */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-sans text-xs text-charcoal/50">Progress to Partner (33%)</span>
            <span className="font-sans text-xs text-charcoal/50">{formatINR(PROGRESS.currentValue)} / {formatINR(PROGRESS.nextThreshold)}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-black/8">
            <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${PROGRESS.pct}%` }} />
          </div>
          <p className="font-sans text-[11px] text-charcoal/40 mt-1.5">
            {formatINR(PROGRESS.nextThreshold - PROGRESS.currentValue)} more in orders to unlock Partner tier
          </p>
        </div>
      </div>

      {/* Tier comparison */}
      <div>
        <h2 className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/35 mb-4">All Tiers</h2>
        <div className="grid lg:grid-cols-3 gap-4">
          {TIERS.map((tier) => (
            <div key={tier.name} className={`rounded-2xl border p-5 ${tier.colour} ${tier.active ? "ring-1 ring-gold/30" : ""}`}>
              <div className="flex items-center justify-between mb-4">
                <span className={`rounded-full border px-2.5 py-0.5 font-sans text-[10px] uppercase tracking-[0.1em] font-medium ${tier.badge}`}>
                  {tier.name}
                </span>
                {tier.active && <span className="font-sans text-[10px] text-gold">Current</span>}
              </div>
              <p className="font-serif text-3xl text-charcoal mb-0.5">{tier.discount}</p>
              <p className="font-sans text-[11px] text-charcoal/40 mb-4">{tier.threshold}</p>
              <ul className="space-y-2">
                {tier.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-gold shrink-0 mt-0.5" />
                    <span className="font-sans text-xs text-charcoal/60 leading-snug">{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Commission history */}
      <div className="rounded-2xl border border-black/6 bg-white overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-black/5">
          <TrendingUp className="h-4 w-4 text-charcoal/30" />
          <h2 className="font-sans text-sm font-medium text-charcoal/70">Commission History</h2>
          <span className="ml-auto font-sans text-[11px] text-charcoal/35">Trade savings earned</span>
        </div>
        <table className="w-full font-sans text-sm">
          <thead>
            <tr className="border-b border-black/5">
              {["Project", "Order Value", "Saving (25%)", "Period"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-[10px] tracking-[0.12em] uppercase text-charcoal/30 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/4">
            {RECENT_COMMISSIONS.map((row) => (
              <tr key={row.project} className="hover:bg-black/1 transition-colors">
                <td className="px-5 py-3.5 font-medium text-charcoal">{row.project}</td>
                <td className="px-5 py-3.5 text-charcoal/60">{row.order}</td>
                <td className="px-5 py-3.5 font-medium text-emerald-700">{row.commission}</td>
                <td className="px-5 py-3.5 text-charcoal/35">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Benefits quick list */}
      <div className="rounded-2xl border border-black/6 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <Gift className="h-4 w-4 text-gold" />
          <h2 className="font-sans text-sm font-medium text-charcoal/70">Your Current Benefits</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {TIERS[0].perks.map((perk) => (
            <div key={perk} className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-gold shrink-0 mt-0.5" />
              <span className="font-sans text-xs text-charcoal/60">{perk}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
