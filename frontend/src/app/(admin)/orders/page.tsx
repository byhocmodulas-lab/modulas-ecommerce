"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Clock, CheckCircle2, Truck, Package, RotateCcw,
  Search, Filter, ChevronDown, ExternalLink,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import { useAuthStore } from "@/lib/stores/auth-store";
import { ordersApi } from "@/lib/api/client";

interface OrderItem { name?: string; quantity: number; unitPrice: number }

interface Order {
  id: string;
  userId: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
  shippingAddress?: { fullName: string; city: string; postcode: string };
}

interface OrdersResponse {
  data: Order[];
  meta: { total: number; page: number; totalPages: number };
}

const STATUSES = ["all", "pending", "confirmed", "produced", "shipped", "delivered", "cancelled"] as const;
type Status = typeof STATUSES[number];

const STATUS_COLOUR: Record<string, string> = {
  pending:   "text-amber-700 bg-amber-50 border-amber-200",
  confirmed: "text-blue-700 bg-blue-50 border-blue-200",
  produced:  "text-violet-700 bg-violet-50 border-violet-200",
  shipped:   "text-sky-700 bg-sky-50 border-sky-200",
  delivered: "text-emerald-700 bg-emerald-50 border-emerald-200",
  cancelled: "text-red-600 bg-red-50 border-red-200",
};

const STATUS_ICON: Record<string, React.ElementType> = {
  pending:   Clock,
  confirmed: CheckCircle2,
  produced:  Package,
  shipped:   Truck,
  delivered: CheckCircle2,
  cancelled: RotateCcw,
};

const NEXT_STATUS: Record<string, string> = {
  pending:   "confirmed",
  confirmed: "produced",
  produced:  "shipped",
  shipped:   "delivered",
};

function StatusBadge({ status }: { status: string }) {
  const Icon = STATUS_ICON[status] ?? Clock;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-sans text-[11px] font-medium ${STATUS_COLOUR[status] ?? "text-charcoal/50 bg-black/5 border-black/10"}`}>
      <Icon className="h-3 w-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function AdminOrdersPage() {
  const { accessToken } = useAuthStore();
  const [orders, setOrders]       = useState<Order[]>([]);
  const [meta, setMeta]           = useState({ total: 0, totalPages: 1 });
  const [page, setPage]           = useState(1);
  const [status, setStatus]       = useState<Status>("all");
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(true);
  const [updating, setUpdating]   = useState<string | null>(null);
  const [expanded, setExpanded]   = useState<string | null>(null);

  const fetchOrders = useCallback(() => {
    if (!accessToken) { setLoading(false); return; }
    setLoading(true);
    const params: Record<string, string> = { page: String(page), limit: "20" };
    if (status !== "all") params.status = status;
    ordersApi.adminOrders(accessToken, params)
      .then((res) => {
        const r = res as OrdersResponse;
        setOrders(r.data ?? []);
        setMeta({ total: r.meta?.total ?? 0, totalPages: r.meta?.totalPages ?? 1 });
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [accessToken, page, status]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  async function handleStatusUpdate(orderId: string, newStatus: string) {
    if (!accessToken) return;
    setUpdating(orderId);
    try {
      await ordersApi.updateStatus(accessToken, orderId, newStatus);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch { /* show nothing — in production add toast */ }
    finally { setUpdating(null); }
  }

  const filtered = search
    ? orders.filter((o) =>
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.items.some((i) => i.name?.toLowerCase().includes(search.toLowerCase())) ||
        o.shippingAddress?.fullName.toLowerCase().includes(search.toLowerCase()),
      )
    : orders;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Orders</h1>
          <p className="font-sans text-sm text-charcoal/40 mt-0.5">{meta.total} total orders</p>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/30" />
          <input
            type="text"
            placeholder="Search by order ID, customer, product…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white py-2.5 pl-9 pr-4 font-sans text-sm text-charcoal placeholder:text-charcoal/30 focus:border-gold/60 focus:outline-none transition-colors"
          />
        </div>

        {/* Status filter */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => { setStatus(s); setPage(1); }}
              className={[
                "shrink-0 rounded-full px-3.5 py-2 font-sans text-[11px] tracking-[0.08em] uppercase transition-colors",
                status === s
                  ? "bg-charcoal text-cream"
                  : "bg-black/5 text-charcoal/50 hover:bg-black/8",
              ].join(" ")}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders table */}
      <div className="rounded-2xl border border-black/6 bg-white overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-2">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-charcoal/4" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Package className="mx-auto mb-3 h-10 w-10 text-charcoal/12" />
            <p className="font-sans text-sm text-charcoal/40">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full font-sans text-sm min-w-[800px]">
              <thead className="border-b border-black/5">
                <tr>
                  {["Order ID", "Customer", "Items", "Status", "Date", "Total", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-[10px] tracking-[0.15em] uppercase text-charcoal/35 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => {
                  const next = NEXT_STATUS[order.status];
                  const date = new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
                  const isExpanded = expanded === order.id;
                  return (
                    <>
                      <tr
                        key={order.id}
                        className="border-b border-black/3 last:border-0 hover:bg-black/1 transition-colors cursor-pointer"
                        onClick={() => setExpanded(isExpanded ? null : order.id)}
                      >
                        <td className="px-5 py-3.5">
                          <span className="font-mono text-xs font-medium text-charcoal">
                            #{order.id.slice(-10).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-charcoal/60">
                          {order.shippingAddress?.fullName ?? `User ${order.userId.slice(-6)}`}
                          {order.shippingAddress?.city && (
                            <span className="block text-[11px] text-charcoal/30">{order.shippingAddress.city}</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-charcoal/60 max-w-[160px]">
                          <span className="truncate block">
                            {order.items?.[0]?.name ?? "—"}
                            {order.items?.length > 1 && ` +${order.items.length - 1}`}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-5 py-3.5 text-charcoal/40 whitespace-nowrap">{date}</td>
                        <td className="px-5 py-3.5 font-medium text-charcoal whitespace-nowrap">
                          {formatPrice(order.totalAmount)}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            {next && (
                              <button
                                type="button"
                                disabled={updating === order.id}
                                onClick={() => handleStatusUpdate(order.id, next)}
                                className="rounded-lg border border-black/10 px-3 py-1.5 font-sans text-[11px] tracking-[0.08em] uppercase text-charcoal/60 hover:border-gold hover:text-gold transition-colors disabled:opacity-40"
                              >
                                {updating === order.id ? "…" : `Mark ${next}`}
                              </button>
                            )}
                            <button
                              type="button"
                              aria-label={isExpanded ? "Collapse order" : "Expand order"}
                              onClick={() => setExpanded(isExpanded ? null : order.id)}
                              className="rounded-lg p-1.5 text-charcoal/30 hover:text-charcoal transition-colors"
                            >
                              <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded row */}
                      {isExpanded && (
                        <tr key={`${order.id}-detail`} className="bg-gold/4 border-b border-black/3">
                          <td colSpan={7} className="px-5 py-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal/35 mb-2">Items</p>
                                <ul className="space-y-1">
                                  {order.items.map((item, i) => (
                                    <li key={i} className="flex items-center justify-between font-sans text-sm">
                                      <span className="text-charcoal/70">{item.name ?? "Product"} × {item.quantity}</span>
                                      <span className="font-medium text-charcoal">{formatPrice(item.unitPrice * item.quantity)}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              {order.shippingAddress && (
                                <div>
                                  <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal/35 mb-2">Delivery</p>
                                  <address className="not-italic font-sans text-sm text-charcoal/60 space-y-0.5">
                                    <p>{order.shippingAddress.fullName}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.postcode}</p>
                                  </address>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="rounded-full border border-black/10 px-5 py-2 font-sans text-[11px] uppercase text-charcoal/60 disabled:opacity-30 hover:border-gold hover:text-gold transition-colors">
            Previous
          </button>
          <span className="font-sans text-sm text-charcoal/40">{page} / {meta.totalPages}</span>
          <button type="button" onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))} disabled={page === meta.totalPages}
            className="rounded-full border border-black/10 px-5 py-2 font-sans text-[11px] uppercase text-charcoal/60 disabled:opacity-30 hover:border-gold hover:text-gold transition-colors">
            Next
          </button>
        </div>
      )}
    </div>
  );
}
