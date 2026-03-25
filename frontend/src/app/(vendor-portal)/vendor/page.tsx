"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Package, ShoppingBag, TrendingUp, Star,
  AlertCircle, ArrowRight,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { ordersApi, productsApi } from "@/lib/api/client";

// ── Placeholder data ───────────────────────────────────────────
const STATS = {
  totalRevenue:  48600,
  thisMonth:     6200,
  orders:        24,
  pendingOrders: 3,
  products:      11,
  avgRating:     4.8,
  reviewCount:   37,
};

const recentOrders = [
  { id: "ORD-0821", product: "Oslo 3-Seat Sofa — Slate Boucle", qty: 1, value: 3200, status: "confirmed",  date: "2026-03-14" },
  { id: "ORD-0819", product: "Arc Lounge Chair × 2",            qty: 2, value: 3600, status: "produced",   date: "2026-03-13" },
  { id: "ORD-0815", product: "Kira Dining Table",               qty: 1, value: 4100, status: "shipped",    date: "2026-03-11" },
  { id: "ORD-0810", product: "Holt Bookcase — Smoked Oak",      qty: 1, value: 1450, status: "delivered",  date: "2026-03-08" },
  { id: "ORD-0807", product: "Lune Bedside Tables × 2",         qty: 2, value: 1360, status: "delivered",  date: "2026-03-05" },
];

const STATUS_CFG = {
  pending:   { label: "Pending",       colour: "text-charcoal/60 bg-black/4 border-black/10" },
  confirmed: { label: "Confirmed",     colour: "text-sky-700 bg-sky-50 border-sky-200" },
  produced:  { label: "In production", colour: "text-violet-700 bg-violet-50 border-violet-200" },
  shipped:   { label: "Shipped",       colour: "text-amber-700 bg-amber-50 border-amber-200" },
  delivered: { label: "Delivered",     colour: "text-emerald-700 bg-emerald-50 border-emerald-200" },
};

const QUICK_LINKS = [
  { href: "/vendor/products", icon: Package,     label: "Products",  desc: "Manage your product catalogue" },
  { href: "/vendor/orders",   icon: ShoppingBag, label: "Orders",    desc: "View and fulfil customer orders" },
  { href: "/vendor/analytics",icon: TrendingUp,  label: "Analytics", desc: "Revenue, traffic and conversions" },
  { href: "/vendor/reviews",  icon: Star,        label: "Reviews",   desc: "Customer feedback and ratings" },
];

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
}

export default function VendorDashboardPage() {
  const { user, accessToken } = useAuthStore();
  const [stats, setStats] = useState(STATS);
  const [recentOrders, setRecentOrders] = useState(recentOrders);

  useEffect(() => {
    if (!accessToken) return;
    Promise.all([
      ordersApi.adminOrders(accessToken, { limit: "5" }),
      productsApi.search({}),
    ]).then(([ordersRes, productsRes]) => {
      const orders = (ordersRes as any)?.data ?? [];
      const productCount = (productsRes as any)?.total ?? stats.products;
      const pending = orders.filter((o: any) => o.status === "pending" || o.status === "confirmed").length;
      setStats((prev) => ({
        ...prev,
        orders: (ordersRes as any)?.meta?.total ?? prev.orders,
        pendingOrders: pending,
        products: productCount,
      }));
      if (orders.length > 0) {
        setRecentOrders(orders.slice(0, 5).map((o: any) => ({
          id: o.orderNumber ?? o.id,
          product: o.items?.[0]?.name ?? "Order",
          qty: o.items?.length ?? 1,
          value: o.total ?? 0,
          status: o.status ?? "pending",
          date: o.createdAt?.slice(0, 10) ?? "",
        })));
      }
    }).catch(() => {});
  }, [accessToken]);

  if (!user || (user.role !== "vendor" && user.role !== "master_admin" && user.role !== "editor")) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-black/6 bg-white py-24 text-center">
        <Package className="mx-auto mb-4 h-10 w-10 text-charcoal/12" />
        <p className="font-serif text-xl text-charcoal mb-2">Vendor Portal</p>
        <p className="font-sans text-sm text-charcoal/40 mb-6 max-w-sm">
          This area is for approved Modulas vendors. Apply to sell on the platform.
        </p>
        <Link
          href="/contact?subject=vendor-application"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
        >
          Apply to sell <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Vendor Dashboard</h1>
          <p className="font-sans text-sm text-charcoal/40 mt-0.5">
            {stats.pendingOrders > 0 && (
              <span className="text-amber-600 font-medium">{stats.pendingOrders} orders need attention · </span>
            )}
            {stats.products} products listed
          </p>
        </div>
        <Link
          href="/vendor/products/new"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
        >
          <Package className="h-3.5 w-3.5" /> Add product
        </Link>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "This month",      value: formatPrice(stats.thisMonth),  colour: "text-charcoal",  sub: formatPrice(stats.totalRevenue) + " all time" },
          { label: "Active orders",   value: stats.orders,                  colour: "text-charcoal",  sub: `${stats.pendingOrders} pending action` },
          { label: "Products listed", value: stats.products,                colour: "text-charcoal",  sub: "All active on store" },
          { label: "Avg rating",      value: `${stats.avgRating} ★`,        colour: "text-amber-500", sub: `${stats.reviewCount} reviews` },
        ].map(({ label, value, colour, sub }) => (
          <div key={label} className="rounded-2xl border border-black/6 bg-white p-5">
            <p className="font-sans text-xs text-charcoal/40 mb-2">{label}</p>
            <p className={`font-serif text-2xl ${colour}`}>{value}</p>
            <p className="font-sans text-[11px] text-charcoal/30 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Pending action alert */}
      {stats.pendingOrders > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-sans text-sm font-medium text-amber-800">
              {stats.pendingOrders} orders awaiting production confirmation
            </p>
            <p className="font-sans text-xs text-amber-700/70 mt-0.5">
              Please confirm or update status within 48 hours of order placement.
            </p>
          </div>
          <Link
            href="/vendor/orders?status=confirmed"
            className="shrink-0 inline-flex items-center gap-1 font-sans text-xs text-amber-700 hover:text-amber-900 transition-colors"
          >
            View <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Recent orders */}
      <div className="rounded-2xl border border-black/6 bg-white overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
          <h2 className="font-serif text-lg text-charcoal">Recent orders</h2>
          <Link href="/vendor/orders" className="font-sans text-[11px] tracking-[0.08em] uppercase text-charcoal/40 hover:text-gold transition-colors">
            All orders
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm min-w-[560px]">
            <thead className="border-b border-black/4">
              <tr>
                {["Order", "Product", "Value", "Status", "Date"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-[10px] tracking-[0.15em] uppercase text-charcoal/35 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => {
                const cfg  = STATUS_CFG[order.status as keyof typeof STATUS_CFG];
                const date = new Date(order.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
                return (
                  <tr key={order.id} className="border-b border-black/3 last:border-0 hover:bg-black/1 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-charcoal/50">{order.id}</td>
                    <td className="px-5 py-3.5 font-medium text-charcoal max-w-[200px] truncate">{order.product}</td>
                    <td className="px-5 py-3.5 font-medium text-charcoal">{formatPrice(order.value)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex rounded-full border px-2 py-0.5 font-sans text-[10px] tracking-[0.08em] uppercase font-medium ${cfg.colour}`}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-charcoal/40 whitespace-nowrap">{date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_LINKS.map(({ href, icon: Icon, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-start gap-3 rounded-2xl border border-black/6 bg-white p-4 hover:border-gold/30 hover:shadow-sm transition-all"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold/10">
              <Icon className="h-4 w-4 text-gold" />
            </div>
            <div>
              <p className="font-sans text-sm font-medium text-charcoal group-hover:text-gold transition-colors">{label}</p>
              <p className="font-sans text-xs text-charcoal/40 leading-snug mt-0.5">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
