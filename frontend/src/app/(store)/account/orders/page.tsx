"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag, Clock, CheckCircle2, Truck, Package,
  RotateCcw, ArrowRight, ChevronDown, ChevronUp, ExternalLink,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import { useAuthStore } from "@/lib/stores/auth-store";
import { ordersApi } from "@/lib/api/client";

interface OrderItem {
  productId: string;
  name?: string;
  quantity: number;
  unitPrice: number;
  finish?: string;
  imageUrl?: string;
  slug?: string;
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  shippingAddress?: {
    fullName: string;
    line1: string;
    city: string;
    postcode: string;
    country: string;
  };
}

interface OrdersResponse {
  data: Order[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; colour: string; bar: string }> = {
  pending:   { label: "Pending",    icon: Clock,        colour: "text-amber-600 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",   bar: "bg-amber-400" },
  confirmed: { label: "Confirmed",  icon: CheckCircle2, colour: "text-blue-600 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",         bar: "bg-blue-400" },
  produced:  { label: "Produced",   icon: Package,      colour: "text-violet-600 bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800",bar: "bg-violet-400" },
  shipped:   { label: "Shipped",    icon: Truck,        colour: "text-sky-600 bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800",              bar: "bg-sky-400" },
  delivered: { label: "Delivered",  icon: CheckCircle2, colour: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800", bar: "bg-emerald-400" },
  cancelled: { label: "Cancelled",  icon: RotateCcw,    colour: "text-red-500 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",              bar: "bg-red-400" },
};

const STATUS_ORDER = ["pending", "confirmed", "produced", "shipped", "delivered"];

const FILTERS = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled"] as const;
type Filter = typeof FILTERS[number];

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-sans text-[11px] font-medium ${cfg.colour}`}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

function OrderProgress({ status }: { status: string }) {
  if (status === "cancelled") return null;
  const idx = STATUS_ORDER.indexOf(status);
  return (
    <div className="flex items-center gap-1 mt-3">
      {STATUS_ORDER.map((s, i) => (
        <div key={s} className="flex-1 flex items-center gap-1">
          <div className={`h-1 w-full rounded-full transition-all ${i <= idx ? STATUS_CONFIG[s]?.bar ?? "bg-gold" : "bg-black/8 dark:bg-white/8"}`} />
        </div>
      ))}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <article className="rounded-2xl border border-black/6 dark:border-white/6 bg-white dark:bg-charcoal-900 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-black/5 dark:border-white/5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-sans text-xs text-charcoal/40 dark:text-cream/40 mb-1">
              Order · #{order.id.slice(-10).toUpperCase()}
            </p>
            <p className="font-sans text-sm text-charcoal/60 dark:text-cream/60">{date}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            <p className="font-sans text-base font-medium text-charcoal dark:text-cream">
              {formatPrice(order.totalAmount)}
            </p>
          </div>
        </div>
        <OrderProgress status={order.status} />
      </div>

      {/* Items preview */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-3 flex-wrap">
          {order.items.slice(0, 3).map((item, i) => (
            <div
              key={`${item.productId}-${i}`}
              className="flex items-center gap-2 rounded-lg bg-cream/50 dark:bg-charcoal-800/50 px-3 py-2"
            >
              <div>
                <p className="font-sans text-xs font-medium text-charcoal dark:text-cream">
                  {item.name ?? "Product"}
                </p>
                {item.finish && (
                  <p className="font-sans text-[10px] text-charcoal/40 dark:text-cream/40">
                    {item.finish}
                  </p>
                )}
              </div>
              <span className="font-sans text-[10px] text-charcoal/30 dark:text-cream/30">
                ×{item.quantity}
              </span>
            </div>
          ))}
          {order.items.length > 3 && (
            <span className="font-sans text-xs text-charcoal/40 dark:text-cream/40">
              +{order.items.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Expandable detail */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-6 py-3 border-t border-black/5 dark:border-white/5 font-sans text-[11px] tracking-[0.1em] uppercase text-charcoal/40 dark:text-cream/40 hover:text-charcoal dark:hover:text-cream transition-colors"
      >
        {expanded ? "Hide details" : "View details"}
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {expanded && (
        <div className="border-t border-black/5 dark:border-white/5 px-6 py-5 space-y-5 bg-black/1 dark:bg-white/1">
          {/* Full item list */}
          <div>
            <h3 className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40 dark:text-cream/40 mb-3">
              Items
            </h3>
            <ul className="space-y-3">
              {order.items.map((item, i) => (
                <li key={`${item.productId}-${i}`} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cream dark:bg-charcoal-800">
                      <Package className="h-4 w-4 text-charcoal/30 dark:text-cream/30" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-sans text-sm text-charcoal dark:text-cream truncate">
                        {item.name ?? "Product"}
                      </p>
                      {item.finish && (
                        <p className="font-sans text-[11px] text-charcoal/40 dark:text-cream/40">
                          Finish: {item.finish}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-sans text-sm font-medium text-charcoal dark:text-cream">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="font-sans text-[11px] text-charcoal/40 dark:text-cream/40">
                        {formatPrice(item.unitPrice)} × {item.quantity}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Shipping address */}
          {order.shippingAddress && (
            <div>
              <h3 className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40 dark:text-cream/40 mb-2">
                Delivery address
              </h3>
              <address className="not-italic font-sans text-sm text-charcoal/60 dark:text-cream/60 space-y-0.5">
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.line1}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postcode}</p>
                <p>{order.shippingAddress.country}</p>
              </address>
            </div>
          )}

          {/* Order total */}
          <div className="flex items-center justify-between pt-3 border-t border-black/6 dark:border-white/6">
            <span className="font-sans text-sm font-medium text-charcoal dark:text-cream">Order total</span>
            <span className="font-serif text-xl text-charcoal dark:text-cream">
              {formatPrice(order.totalAmount)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {order.status === "delivered" && (
              <Link
                href={`/products`}
                className="inline-flex items-center gap-1.5 rounded-full bg-gold px-5 py-2 font-sans text-[11px] tracking-[0.1em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
              >
                Buy again <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
            <Link
              href={`/account/orders/${order.id}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 dark:border-white/10 px-5 py-2 font-sans text-[11px] tracking-[0.1em] uppercase text-charcoal/60 dark:text-cream/60 hover:border-gold hover:text-gold transition-colors"
            >
              Full details <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </article>
  );
}

export default function AccountOrdersPage() {
  const { accessToken } = useAuthStore();
  const [orders, setOrders]   = useState<Order[]>([]);
  const [meta, setMeta]       = useState({ total: 0, totalPages: 1 });
  const [page, setPage]       = useState(1);
  const [filter, setFilter]   = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  function load() {
    if (!accessToken) { setLoading(false); return; }
    setLoading(true); setError(null);
    ordersApi.myOrders(accessToken, page)
      .then((res) => {
        const r = res as OrdersResponse;
        setOrders(r.data ?? []);
        setMeta({ total: r.meta?.total ?? 0, totalPages: r.meta?.totalPages ?? 1 });
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Could not load orders"))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [accessToken, page]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ShoppingBag className="mx-auto mb-4 h-14 w-14 text-charcoal/15" />
        <p className="font-sans text-sm text-charcoal/50 dark:text-cream/50 mb-6">Sign in to view your orders.</p>
        <Link
          href="/login?next=/account/orders"
          className="inline-flex h-11 items-center rounded-full bg-gold px-7 font-sans text-[12px] tracking-[0.12em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={[
              "shrink-0 rounded-full px-4 py-2 font-sans text-[11px] tracking-[0.1em] uppercase transition-colors",
              filter === f
                ? "bg-charcoal dark:bg-cream text-cream dark:text-charcoal"
                : "bg-black/5 dark:bg-white/5 text-charcoal/50 dark:text-cream/50 hover:bg-black/8 dark:hover:bg-white/8",
            ].join(" ")}
          >
            {f === "all" ? `All (${meta.total})` : f}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-charcoal/5 dark:bg-cream/5" />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-black/6 dark:border-white/6 bg-white dark:bg-charcoal-900 py-16 text-center">
          <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-red-300" />
          <p className="font-sans text-sm text-charcoal/50 dark:text-cream/50 mb-4">{error}</p>
          <button type="button" onClick={load}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 px-5 py-2 font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal/60 dark:text-cream/60 hover:border-gold hover:text-gold transition-colors">
            Try again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-black/6 dark:border-white/6 bg-white dark:bg-charcoal-900 py-24 text-center">
          <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-charcoal/15 dark:text-cream/15" />
          <p className="font-serif text-xl text-charcoal dark:text-cream mb-2">No orders found</p>
          <p className="font-sans text-sm text-charcoal/40 dark:text-cream/40 mb-6">
            {filter === "all" ? "You haven't placed any orders yet." : `No ${filter} orders.`}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
          >
            Browse Collection <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-full border border-black/10 dark:border-white/10 px-5 py-2 font-sans text-[11px] tracking-[0.1em] uppercase text-charcoal/60 dark:text-cream/60 disabled:opacity-30 hover:border-gold hover:text-gold transition-colors"
          >
            Previous
          </button>
          <span className="font-sans text-sm text-charcoal/40 dark:text-cream/40">
            {page} / {meta.totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
            disabled={page === meta.totalPages}
            className="rounded-full border border-black/10 dark:border-white/10 px-5 py-2 font-sans text-[11px] tracking-[0.1em] uppercase text-charcoal/60 dark:text-cream/60 disabled:opacity-30 hover:border-gold hover:text-gold transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
