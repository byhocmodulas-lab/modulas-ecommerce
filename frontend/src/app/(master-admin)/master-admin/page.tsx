"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useAccessToken } from "@/lib/stores/auth-store";
import { authApi, type AuthUser } from "@/lib/api/client";
import { formatPrice } from "@/lib/utils/format";

const STATUS_STYLES: Record<string, string> = {
  pending:       "bg-amber-50 text-amber-700",
  confirmed:     "bg-blue-50 text-blue-700",
  in_production: "bg-purple-50 text-purple-700",
  shipped:       "bg-indigo-50 text-indigo-700",
  delivered:     "bg-emerald-50 text-emerald-700",
  cancelled:     "bg-stone-50 text-stone-500",
  refunded:      "bg-stone-50 text-stone-500",
};

const TYPE_COLORS: Record<string, string> = {
  architect:    "text-purple-700 bg-purple-50",
  vendor:       "text-orange-700 bg-orange-50",
  creator:      "text-pink-700 bg-pink-50",
  intern:       "text-blue-700 bg-blue-50",
  editor:       "text-teal-700 bg-teal-50",
  master_admin: "text-red-700 bg-red-50",
};

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  items: unknown[];
  createdAt: string;
}

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

function Spinner() {
  return <Loader2 className="h-4 w-4 animate-spin text-charcoal/40 inline" />;
}

export default function MasterAdminPage() {
  const token = useAccessToken() ?? "";

  const [users,         setUsers]         = useState<AuthUser[] | null>(null);
  const [recentOrders,  setRecentOrders]  = useState<Order[]>([]);
  const [totalOrders,   setTotalOrders]   = useState<number | null>(null);
  const [usersLoading,  setUsersLoading]  = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    if (!token) return;
    try {
      setUsersLoading(true);
      const result = await authApi.listUsers(token);
      // Guard: backend may wrap in { data: [...] } — unwrap defensively
      const list = Array.isArray(result) ? result : (result as any)?.data ?? [];
      setUsers(list);
    } catch { /* keep null */ } finally { setUsersLoading(false); }
  }, [token]);

  const loadOrders = useCallback(async () => {
    if (!token) return;
    try {
      setOrdersLoading(true);
      const res = await fetch(`${API}/orders/admin?page=1&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) return;
      const data = await res.json();
      setRecentOrders(Array.isArray(data.data) ? data.data : []);
      if (data.meta?.total != null) setTotalOrders(data.meta.total);
    } catch { /* ignore */ } finally { setOrdersLoading(false); }
  }, [token]);

  useEffect(() => { loadUsers(); loadOrders(); }, [loadUsers, loadOrders]);

  const safeUsers    = Array.isArray(users) ? users : [];
  const totalUsers   = users !== null ? safeUsers.length : null;
  const pendingCount = users !== null ? safeUsers.filter(u => !u.isVerified && u.role !== "customer").length : null;
  const vendorApps   = users !== null ? safeUsers.filter(u => u.role === "vendor"  && !u.isVerified).length : null;
  const creatorReqs  = users !== null ? safeUsers.filter(u => u.role === "creator" && !u.isVerified).length : null;

  const pendingUsers = safeUsers
    .filter(u => !u.isVerified && u.role !== "customer")
    .slice(0, 5);

  const stats = [
    { label: "Total Users",         value: usersLoading  ? null : totalUsers,   sub: "registered accounts",  up: true,  placeholder: false },
    { label: "Total Orders",        value: ordersLoading ? null : totalOrders,  sub: "all time",              up: true,  placeholder: false },
    { label: "Pending Approvals",   value: usersLoading  ? null : pendingCount, sub: "awaiting review",       up: false, placeholder: false },
    { label: "Active Projects",     value: null,                                 sub: "in progress",           up: true,  placeholder: true  },
    { label: "Vendor Applications", value: usersLoading  ? null : vendorApps,   sub: "new vendor requests",   up: true,  placeholder: false },
    { label: "Creator Requests",    value: usersLoading  ? null : creatorReqs,  sub: "new creator requests",  up: true,  placeholder: false },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl text-charcoal mb-1">Command Centre</h1>
        <p className="font-sans text-sm text-charcoal/40">Full platform overview · Master Admin access only</p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-black/6 bg-white p-5">
            <p className="font-sans text-xs text-charcoal/35 mb-1">{s.label}</p>
            <p className="font-serif text-3xl text-charcoal mb-1">
              {s.value !== null && s.value !== undefined
                ? s.value.toLocaleString()
                : (usersLoading || ordersLoading) && !s.placeholder
                  ? <Spinner />
                  : "—"}
            </p>
            <p className={`font-sans text-[11px] ${s.up ? "text-emerald-600" : "text-amber-600"}`}>
              {s.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal/25 mb-4">Quick Actions</p>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Manage Users",                                              href: "/master-admin/users"               },
            { label: "View Orders",                                               href: "/master-admin/orders"              },
            { label: `Approvals${pendingCount ? ` (${pendingCount})` : ""}`,     href: "/master-admin/users?filter=pending" },
            { label: "Collaborations",                                            href: "/master-admin/collaborations"      },
            { label: "Post a Job",                                                href: "/master-admin/careers"             },
            { label: "Edit Content",                                              href: "/master-admin/content"             },
          ].map((a) => (
            <Link key={a.label} href={a.href}
              className="rounded-full border border-black/10 px-4 py-2 font-sans text-[12px] text-charcoal/60 hover:border-black/20 hover:text-charcoal transition-colors">
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="rounded-2xl border border-black/6 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-black/6">
            <h2 className="font-sans text-sm font-medium text-charcoal">Recent Orders</h2>
            <Link href="/master-admin/orders" className="font-sans text-[11px] text-charcoal/35 hover:text-charcoal/60 transition-colors">
              View all →
            </Link>
          </div>
          {ordersLoading ? (
            <div className="flex items-center justify-center py-12"><Spinner /></div>
          ) : recentOrders.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="font-sans text-xs text-charcoal/25">No orders yet</p>
            </div>
          ) : (
            <div className="divide-y divide-black/5">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="font-sans text-sm font-medium text-charcoal/80">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="font-sans text-xs text-charcoal/35">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      {" · "}
                      {(order.items ?? []).length} item{(order.items ?? []).length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 font-sans text-[10px] capitalize ${STATUS_STYLES[order.status] ?? "text-charcoal/50 bg-black/4"}`}>
                      {order.status.replace("_", " ")}
                    </span>
                    <span className="font-sans text-sm font-medium text-charcoal/80">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending approvals */}
        <div className="rounded-2xl border border-black/6 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-black/6">
            <h2 className="font-sans text-sm font-medium text-charcoal">Pending Approvals</h2>
            <Link href="/master-admin/users?filter=pending" className="font-sans text-[11px] text-charcoal/35 hover:text-charcoal/60 transition-colors">
              View all →
            </Link>
          </div>
          {usersLoading ? (
            <div className="flex items-center justify-center py-12"><Spinner /></div>
          ) : pendingUsers.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="font-sans text-xs text-charcoal/25">No pending approvals</p>
            </div>
          ) : (
            <div className="divide-y divide-black/5">
              {pendingUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="font-sans text-sm text-charcoal/80">{user.fullName ?? user.email}</p>
                    <p className="font-sans text-xs text-charcoal/35">
                      {(user.metadata?.city as string | undefined) ?? user.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 font-sans text-[10px] capitalize ${TYPE_COLORS[user.role] ?? "text-charcoal/50 bg-black/4"}`}>
                      {user.role.replace("_", " ")}
                    </span>
                    <Link href="/master-admin/users"
                      className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 font-sans text-[10px] text-emerald-700 hover:bg-emerald-100 transition-colors">
                      Review
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
