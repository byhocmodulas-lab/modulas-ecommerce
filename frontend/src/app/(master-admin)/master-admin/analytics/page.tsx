"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp, TrendingDown, Users, ShoppingBag,
  DollarSign, Package, RefreshCw, AlertCircle,
} from "lucide-react";
import { BarFill } from "@/components/ui/bar-fill";
import { useAuthStore } from "@/lib/stores/auth-store";
import { analyticsApi } from "@/lib/api/client";
import { formatPrice } from "@/lib/utils/format";
import type { AnalyticsDashboard } from "@/lib/api/client";

function GrowthBadge({ growth }: { growth: number | null }) {
  if (growth === null) return null;
  const up = growth >= 0;
  return (
    <span className={`flex items-center gap-0.5 font-sans text-[11px] ${up ? "text-emerald-600" : "text-red-500"}`}>
      {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {up ? "+" : ""}{growth}%
    </span>
  );
}

const ORDER_STATUS_COLOURS: Record<string, string> = {
  pending:      "bg-amber-400",
  confirmed:    "bg-blue-500",
  in_production: "bg-violet-500",
  shipped:      "bg-sky-500",
  delivered:    "bg-emerald-500",
  cancelled:    "bg-red-400",
  refunded:     "bg-charcoal/20",
};

export default function AnalyticsPage() {
  const { accessToken } = useAuthStore();
  const [data, setData]       = useState<AnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  function load() {
    if (!accessToken) { setLoading(false); return; }
    setLoading(true); setError(null);
    analyticsApi.dashboard(accessToken)
      .then(setData)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load analytics"))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [accessToken]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Analytics</h1>
          <p className="font-sans text-sm text-charcoal/35 mt-0.5">Loading…</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map((i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-charcoal/4" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-400" />
        <p className="font-sans text-sm text-charcoal/60 mb-4">{error}</p>
        <button type="button" onClick={load}
          className="inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-2 font-sans text-[11px] uppercase text-charcoal/60 hover:border-charcoal/30">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </button>
      </div>
    );
  }

  const kpis = data?.kpis;
  const ordersByStatus = data?.ordersByStatus ?? {};
  const totalOrdersByStatus = Object.values(ordersByStatus).reduce((s, c) => s + c, 0);

  const metrics = [
    { label: "Total Orders",    value: kpis?.totalOrders  ?? 0, growth: kpis?.ordersGrowth  ?? null, icon: ShoppingBag },
    { label: "Total Revenue",   value: kpis ? formatPrice(kpis.totalRevenue) : "—", growth: kpis?.revenueGrowth ?? null, icon: DollarSign },
    { label: "Platform Users",  value: kpis?.totalUsers   ?? 0, growth: null, icon: Users   },
    { label: "Active Leads",    value: kpis?.totalLeads   ?? 0, growth: null, icon: Package },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Analytics</h1>
          <p className="font-sans text-sm text-charcoal/35 mt-0.5">Live platform data</p>
        </div>
        <button type="button" onClick={load}
          className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 font-sans text-[11px] uppercase text-charcoal/50 hover:border-charcoal/30 transition-colors">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(({ label, value, growth, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-black/6 bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <Icon className="h-4 w-4 text-charcoal/25" />
              <GrowthBadge growth={growth} />
            </div>
            <p className="font-serif text-2xl text-charcoal">{value}</p>
            <p className="font-sans text-[11px] text-charcoal/35 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Orders by status */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-black/6 bg-white p-6">
          <h2 className="font-sans text-sm font-medium text-charcoal/60 mb-5">Orders by Status</h2>
          {totalOrdersByStatus === 0 ? (
            <p className="font-sans text-sm text-charcoal/30 text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(ordersByStatus)
                .sort(([, a], [, b]) => b - a)
                .map(([status, count]) => {
                  const pct = Math.round((count / totalOrdersByStatus) * 100);
                  const colour = ORDER_STATUS_COLOURS[status] ?? "bg-charcoal/20";
                  return (
                    <div key={status}>
                      <div className="flex justify-between mb-1">
                        <span className="font-sans text-xs text-charcoal/60 capitalize">{status.replace("_", " ")}</span>
                        <span className="font-sans text-xs text-charcoal/35">{count} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-black/6">
                        <BarFill pct={pct} className={`h-full rounded-full ${colour} opacity-80 transition-all`} />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Recent orders */}
        <div className="rounded-2xl border border-black/6 bg-white p-6">
          <h2 className="font-sans text-sm font-medium text-charcoal/60 mb-5">Recent Orders</h2>
          {(data?.recentOrders ?? []).length === 0 ? (
            <p className="font-sans text-sm text-charcoal/30 text-center py-8">No orders yet</p>
          ) : (
            <ul className="space-y-2">
              {(data?.recentOrders ?? []).slice(0, 8).map((order) => (
                <li key={order.id} className="flex items-center gap-3 py-2 border-b border-black/4 last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-xs font-medium text-charcoal truncate">#{order.id.slice(-8).toUpperCase()}</p>
                    <p className="font-sans text-[10px] text-charcoal/35">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 font-sans text-[10px] capitalize ${ORDER_STATUS_COLOURS[order.status] ?? "bg-charcoal/10"} text-white`}>
                    {order.status.replace("_", " ")}
                  </span>
                  <p className="font-sans text-xs font-medium text-charcoal whitespace-nowrap">
                    {order.currency} {Number(order.totalAmount).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
