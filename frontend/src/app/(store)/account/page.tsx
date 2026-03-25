"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  Package,
  ChevronRight,
  ArrowRight,
  Clock,
  CheckCircle2,
  Truck,
  RotateCcw,
  Star,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import { useAuthStore } from "@/lib/stores/auth-store";
import { ordersApi } from "@/lib/api/client";

interface OrderItem {
  name?: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

interface OrdersResponse {
  data: Order[];
  meta: { total: number };
}

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; colour: string }> = {
  pending:   { label: "Pending",    icon: Clock,         colour: "text-amber-500 bg-amber-50 dark:bg-amber-950/30" },
  confirmed: { label: "Confirmed",  icon: CheckCircle2,  colour: "text-blue-500 bg-blue-50 dark:bg-blue-950/30" },
  produced:  { label: "Produced",   icon: Package,       colour: "text-violet-500 bg-violet-50 dark:bg-violet-950/30" },
  shipped:   { label: "Shipped",    icon: Truck,         colour: "text-sky-500 bg-sky-50 dark:bg-sky-950/30" },
  delivered: { label: "Delivered",  icon: CheckCircle2,  colour: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30" },
  cancelled: { label: "Cancelled",  icon: RotateCcw,     colour: "text-red-400 bg-red-50 dark:bg-red-950/30" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-sans text-[11px] font-medium ${cfg.colour}`}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

export default function AccountDashboard() {
  const { accessToken, user } = useAuthStore();
  const [orders, setOrders]   = useState<Order[]>([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  useEffect(() => {
    if (!accessToken) { setLoading(false); return; }
    ordersApi.myOrders(accessToken, 1)
      .then((res) => {
        const r = res as OrdersResponse;
        setOrders(r.data ?? []);
        setTotal(r.meta?.total ?? 0);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [accessToken]);

  const recentOrders   = orders.slice(0, 3);
  const totalSpend     = orders.reduce((s, o) => s + o.totalAmount, 0);
  const activeOrders   = orders.filter((o) => !["delivered", "cancelled"].includes(o.status)).length;

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ShoppingBag className="mx-auto mb-4 h-14 w-14 text-charcoal/15" />
        <h2 className="font-serif text-2xl text-charcoal dark:text-cream mb-3">Sign in to view your account</h2>
        <Link
          href="/login?next=/account"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-gold px-7 font-sans text-[12px] tracking-[0.12em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Stats row ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Total orders",   value: loading ? "—" : total,                       icon: ShoppingBag, href: "/account/orders" },
          { label: "Active orders",  value: loading ? "—" : activeOrders,                 icon: Truck,       href: "/account/orders" },
          { label: "Total spend",    value: loading ? "—" : formatPrice(totalSpend),      icon: Star,        href: "/account/orders" },
        ].map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-2xl border border-black/6 dark:border-white/6 bg-white dark:bg-charcoal-900 p-5 hover:border-gold/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/10">
                <Icon className="h-4 w-4 text-gold" />
              </div>
              <ChevronRight className="h-4 w-4 text-charcoal/20 dark:text-cream/20 group-hover:text-gold transition-colors" />
            </div>
            <p className="font-serif text-2xl text-charcoal dark:text-cream">{value}</p>
            <p className="font-sans text-xs text-charcoal/40 dark:text-cream/40 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* ── Recent orders ─────────────────────────────────────── */}
      <div className="rounded-2xl border border-black/6 dark:border-white/6 bg-white dark:bg-charcoal-900 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 dark:border-white/5">
          <h2 className="font-serif text-lg text-charcoal dark:text-cream">Recent orders</h2>
          <Link
            href="/account/orders"
            className="flex items-center gap-1.5 font-sans text-[11px] tracking-[0.1em] uppercase text-gold hover:text-gold-400 transition-colors"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-px">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-black/4 dark:border-white/4 last:border-0">
                <div className="h-4 w-24 animate-pulse rounded bg-charcoal/8 dark:bg-cream/8" />
                <div className="ml-auto h-6 w-20 animate-pulse rounded-full bg-charcoal/8 dark:bg-cream/8" />
                <div className="h-4 w-16 animate-pulse rounded bg-charcoal/8 dark:bg-cream/8" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-10 text-center">
            <p className="font-sans text-sm text-charcoal/40 dark:text-cream/40">
              Could not load orders.{" "}
              <Link href="/account/orders" className="text-gold underline underline-offset-2">
                Try the orders page
              </Link>
            </p>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="py-16 text-center">
            <ShoppingBag className="mx-auto mb-4 h-10 w-10 text-charcoal/15 dark:text-cream/15" />
            <p className="font-sans text-sm text-charcoal/40 dark:text-cream/40">No orders yet</p>
            <Link
              href="/products"
              className="mt-4 inline-flex items-center gap-1.5 font-sans text-[11px] tracking-[0.12em] uppercase text-gold hover:text-gold-400 transition-colors"
            >
              Browse Collection <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <ul>
            {recentOrders.map((order) => {
              const firstItem = order.items?.[0];
              const date = new Date(order.createdAt).toLocaleDateString("en-GB", {
                day: "numeric", month: "short", year: "numeric",
              });
              return (
                <li key={order.id} className="border-b border-black/4 dark:border-white/4 last:border-0">
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-black/2 dark:hover:bg-white/2 transition-colors group"
                  >
                    {/* Order info */}
                    <div className="min-w-0 flex-1">
                      <p className="font-sans text-sm font-medium text-charcoal dark:text-cream truncate">
                        {firstItem?.name ?? "Order"}{order.items.length > 1 ? ` +${order.items.length - 1} more` : ""}
                      </p>
                      <p className="font-sans text-xs text-charcoal/40 dark:text-cream/40 mt-0.5">
                        {date} · #{order.id.slice(-8).toUpperCase()}
                      </p>
                    </div>

                    <StatusBadge status={order.status} />

                    <p className="font-sans text-sm font-medium text-charcoal dark:text-cream whitespace-nowrap">
                      {formatPrice(order.totalAmount)}
                    </p>

                    <ChevronRight className="h-4 w-4 text-charcoal/20 dark:text-cream/20 group-hover:text-gold transition-colors shrink-0" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ── Quick links ───────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          {
            title: "Wishlist",
            description: "Products you've saved for later.",
            href: "/account/wishlist",
            icon: Heart,
          },
          {
            title: "Delivery addresses",
            description: "Manage your saved delivery locations.",
            href: "/account/addresses",
            icon: Package,
          },
          ...(user?.role === "architect" ? [{
            title: "Architect Portal",
            description: "Manage client projects and generate quotes.",
            href: "/projects",
            icon: Star,
          }] : []),
          ...(user?.role === "creator" ? [{
            title: "Creator Hub",
            description: "Your affiliate links and earnings.",
            href: "/creator-hub",
            icon: Star,
          }] : []),
        ].map(({ title, description, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-4 rounded-2xl border border-black/6 dark:border-white/6 bg-white dark:bg-charcoal-900 p-5 hover:border-gold/30 transition-colors"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 shrink-0">
              <Icon className="h-5 w-5 text-gold" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-sans text-sm font-medium text-charcoal dark:text-cream">{title}</p>
              <p className="font-sans text-xs text-charcoal/40 dark:text-cream/40 mt-0.5 truncate">{description}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-charcoal/20 dark:text-cream/20 group-hover:text-gold transition-colors shrink-0" />
          </Link>
        ))}
      </div>

      {/* ── Profile card ──────────────────────────────────────── */}
      <div className="rounded-2xl border border-black/6 dark:border-white/6 bg-white dark:bg-charcoal-900 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg text-charcoal dark:text-cream">Profile</h2>
          <Link
            href="/account/settings"
            className="font-sans text-[11px] tracking-[0.1em] uppercase text-gold hover:text-gold-400 transition-colors"
          >
            Edit
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold font-serif text-xl shrink-0">
            {user?.fullName?.[0] ?? user?.email?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="font-sans text-sm font-medium text-charcoal dark:text-cream">
              {user?.fullName ?? "—"}
            </p>
            <p className="font-sans text-xs text-charcoal/40 dark:text-cream/40 mt-0.5">{user?.email}</p>
            <span className="mt-1.5 inline-flex items-center rounded-full bg-gold/10 px-2 py-0.5 font-sans text-[10px] tracking-[0.12em] uppercase text-gold">
              {user?.role?.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
