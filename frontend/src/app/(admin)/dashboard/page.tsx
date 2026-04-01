"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag, Users, Package, TrendingUp, TrendingDown,
  ArrowRight, Clock, CheckCircle2, Truck, AlertCircle,
  BarChart3, Store, RefreshCw,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import { useAuthStore } from "@/lib/stores/auth-store";
import { ordersApi, authApi } from "@/lib/api/client";

interface OrdersData {
  data: Array<{ id: string; status: string; totalAmount: number; createdAt: string; items: Array<{ name?: string }> }>;
  meta: { total: number };
}

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  trend?: number;
  href?: string;
  loading?: boolean;
}

function StatCard({ label, value, sub, icon: Icon, trend, href, loading }: StatCardProps) {
  const inner = (
    <div className="rounded-2xl border border-black/6 bg-white p-5 hover:border-gold/30 transition-colors group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
          <Icon className="h-5 w-5 text-gold" />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-1 font-sans text-xs font-medium ${trend >= 0 ? "text-emerald-600" : "text-red-500"}`}>
            {trend >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      {loading ? (
        <div className="space-y-2">
          <div className="h-8 w-24 animate-pulse rounded bg-charcoal/8" />
          <div className="h-3 w-32 animate-pulse rounded bg-charcoal/5" />
        </div>
      ) : (
        <>
          <p className="font-serif text-3xl text-charcoal">{value}</p>
          <p className="font-sans text-xs text-charcoal/40 mt-1">{label}</p>
          {sub && <p className="font-sans text-[11px] text-charcoal/30 mt-0.5">{sub}</p>}
        </>
      )}
      {href && <ArrowRight className="absolute top-5 right-5 h-4 w-4 text-charcoal/20 group-hover:text-gold transition-colors" />}
    </div>
  );

  return href ? (
    <Link href={href} className="relative block">{inner}</Link>
  ) : (
    <div className="relative">{inner}</div>
  );
}

const STATUS_ICON: Record<string, React.ElementType> = {
  pending:   Clock,
  confirmed: CheckCircle2,
  shipped:   Truck,
  delivered: CheckCircle2,
  cancelled: AlertCircle,
};

const STATUS_COLOUR: Record<string, string> = {
  pending:   "text-amber-600 bg-amber-50",
  confirmed: "text-blue-600 bg-blue-50",
  produced:  "text-violet-600 bg-violet-50",
  shipped:   "text-sky-600 bg-sky-50",
  delivered: "text-emerald-600 bg-emerald-50",
  cancelled: "text-red-500 bg-red-50",
};

const POLL_INTERVAL = 30_000; // 30 s

export default function AdminDashboard() {
  const { accessToken } = useAuthStore();
  const [orders, setOrders]       = useState<OrdersData | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [loading, setLoading]     = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing]   = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function fetchData(silent = false) {
    if (!accessToken) { setLoading(false); return; }
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const [ord, users] = await Promise.all([
        ordersApi.adminOrders(accessToken, { limit: "10", page: "1" }),
        authApi.listUsers(accessToken),
      ]);
      setOrders(ord as OrdersData);
      setUserCount((users as unknown[]).length);
      setLastUpdated(new Date());
    } catch {
      // keep stale data on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(() => fetchData(true), POLL_INTERVAL);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const totalRevenue = orders?.data.reduce((s, o) => s + o.totalAmount, 0) ?? 0;
  const recentOrders = orders?.data.slice(0, 6) ?? [];
  const statusBreakdown = recentOrders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-charcoal mb-1">Dashboard</h1>
          <p className="font-sans text-sm text-charcoal/40">
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <p className="font-sans text-[11px] text-charcoal/30">
              Updated {lastUpdated.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
          <span className="flex items-center gap-1.5 font-sans text-[11px] text-emerald-600">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Live
          </span>
          <button
            type="button"
            onClick={() => fetchData(true)}
            disabled={refreshing || loading}
            aria-label="Refresh dashboard"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-charcoal/40 hover:text-gold hover:border-gold/40 disabled:opacity-40 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total orders"
          value={orders?.meta.total ?? "—"}
          icon={ShoppingBag}
          trend={12}
          href="/admin/orders"
          loading={loading}
        />
        <StatCard
          label="Total revenue"
          value={loading ? "—" : formatPrice(totalRevenue)}
          icon={BarChart3}
          trend={8}
          loading={loading}
        />
        <StatCard
          label="Customers"
          value={userCount ?? "—"}
          icon={Users}
          trend={5}
          href="/admin/users"
          loading={loading}
        />
        <StatCard
          label="Active listings"
          value="—"
          sub="Products in catalog"
          icon={Package}
          href="/admin/catalog"
          loading={loading}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        {/* Recent orders table */}
        <div className="rounded-2xl border border-black/6 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
            <h2 className="font-serif text-lg text-charcoal">Recent orders</h2>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1.5 font-sans text-[11px] tracking-[0.1em] uppercase text-gold hover:text-gold-400 transition-colors"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-px p-2">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-xl bg-charcoal/4" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="py-16 text-center">
              <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-charcoal/12" />
              <p className="font-sans text-sm text-charcoal/40">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full font-sans text-sm">
                <thead>
                  <tr className="border-b border-black/4">
                    {["Order", "Item(s)", "Status", "Date", "Amount"].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-[10px] tracking-[0.15em] uppercase text-charcoal/35 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const StatusIcon = STATUS_ICON[order.status] ?? Clock;
                    const date = new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
                    return (
                      <tr key={order.id} className="border-b border-black/3 last:border-0 hover:bg-black/1 transition-colors">
                        <td className="px-6 py-3.5 font-medium text-charcoal">
                          #{order.id.slice(-8).toUpperCase()}
                        </td>
                        <td className="px-6 py-3.5 text-charcoal/60 max-w-[180px] truncate">
                          {order.items?.[0]?.name ?? "—"}
                          {order.items?.length > 1 ? ` +${order.items.length - 1}` : ""}
                        </td>
                        <td className="px-6 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${STATUS_COLOUR[order.status] ?? "text-charcoal/50 bg-black/5"}`}>
                            <StatusIcon className="h-3 w-3" />
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-charcoal/40">{date}</td>
                        <td className="px-6 py-3.5 font-medium text-charcoal">
                          {formatPrice(order.totalAmount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Order status breakdown */}
          <div className="rounded-2xl border border-black/6 bg-white p-5">
            <h2 className="font-serif text-lg text-charcoal mb-4">Order status</h2>
            {Object.keys(statusBreakdown).length === 0 && !loading ? (
              <p className="font-sans text-sm text-charcoal/40">No orders to display</p>
            ) : (
              <ul className="space-y-2">
                {Object.entries(statusBreakdown).map(([status, count]) => (
                  <li key={status} className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-sans text-[11px] font-medium ${STATUS_COLOUR[status] ?? "text-charcoal/50 bg-black/5"}`}>
                      {status}
                    </span>
                    <span className="font-sans text-sm font-medium text-charcoal">{count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quick links */}
          <div className="rounded-2xl border border-black/6 bg-white p-5">
            <h2 className="font-serif text-lg text-charcoal mb-4">Quick actions</h2>
            <ul className="space-y-1">
              {[
                { label: "Add product",      href: "/admin/catalog?action=new",  icon: Package },
                { label: "Manage orders",    href: "/admin/orders",              icon: ShoppingBag },
                { label: "View users",       href: "/admin/users",               icon: Users },
                { label: "Vendor approvals", href: "/admin/vendors",             icon: Store },
                { label: "Intel reports",    href: "/admin/intel",               icon: BarChart3 },
              ].map(({ label, href, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-sans text-sm text-charcoal/60 hover:bg-gold/6 hover:text-charcoal transition-colors group"
                  >
                    <Icon className="h-4 w-4 text-gold/60 group-hover:text-gold transition-colors" />
                    {label}
                    <ArrowRight className="ml-auto h-3.5 w-3.5 text-charcoal/20 group-hover:text-gold transition-colors" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
