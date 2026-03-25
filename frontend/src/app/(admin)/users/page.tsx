"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Users, Search, Shield, ChevronDown, CheckCircle2,
  Clock, XCircle, MoreHorizontal,
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { authApi } from "@/lib/api/client";

type Role = "master_admin" | "editor" | "customer" | "architect" | "creator" | "vendor" | "intern";

interface User {
  id: string;
  email: string;
  fullName: string | null;
  role: Role;
  isVerified: boolean;
  createdAt: string;
  avatarUrl?: string | null;
}

const ROLE_COLOUR: Record<Role, string> = {
  master_admin: "text-red-700 bg-red-50 border-red-200",
  editor:       "text-violet-700 bg-violet-50 border-violet-200",
  architect:    "text-blue-700 bg-blue-50 border-blue-200",
  creator:      "text-pink-700 bg-pink-50 border-pink-200",
  vendor:       "text-amber-700 bg-amber-50 border-amber-200",
  intern:       "text-teal-700 bg-teal-50 border-teal-200",
  customer:     "text-charcoal/60 bg-black/4 border-black/10",
};

const ALL_ROLES: Role[] = ["customer", "architect", "creator", "vendor", "intern", "editor", "master_admin"];
const FILTERS = ["all", ...ALL_ROLES] as const;
type Filter = typeof FILTERS[number];

function RoleBadge({ role }: { role: Role }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-sans text-[10px] tracking-[0.1em] uppercase font-medium ${ROLE_COLOUR[role] ?? "text-charcoal/50 bg-black/5 border-black/10"}`}>
      {role.replace("_", " ")}
    </span>
  );
}

function Avatar({ user }: { user: User }) {
  const initials = user.fullName
    ? user.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")
    : user.email[0].toUpperCase();
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/15 font-serif text-sm text-gold">
      {initials}
    </div>
  );
}

export default function AdminUsersPage() {
  const { accessToken } = useAuthStore();
  const [users, setUsers]         = useState<User[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState<Filter>("all");
  const [updatingId, setUpdating] = useState<string | null>(null);
  const [openMenu, setOpenMenu]   = useState<string | null>(null);

  const load = useCallback(() => {
    if (!accessToken) { setLoading(false); return; }
    setLoading(true);
    authApi.listUsers(accessToken)
      .then((res) => setUsers(res as User[]))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [accessToken]);

  useEffect(() => { load(); }, [load]);

  async function handleRoleChange(userId: string, role: Role) {
    if (!accessToken) return;
    setUpdating(userId);
    setOpenMenu(null);
    try {
      await authApi.updateRole(accessToken, userId, role);
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role } : u));
    } catch { /* ignore */ }
    finally { setUpdating(null); }
  }

  const filtered = users.filter((u) => {
    const matchesRole   = filter === "all" || u.role === filter;
    const matchesSearch = !search ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.fullName ?? "").toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const counts = ALL_ROLES.reduce<Record<string, number>>((acc, r) => {
    acc[r] = users.filter((u) => u.role === r).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Users</h1>
          <p className="font-sans text-sm text-charcoal/40 mt-0.5">{users.length} total accounts</p>
        </div>
      </div>

      {/* Role breakdown cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
        {ALL_ROLES.map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => setFilter(filter === role ? "all" : role as Filter)}
            className={[
              "rounded-xl border p-3 text-left transition-colors",
              filter === role ? "border-gold/40 bg-gold/6" : "border-black/6 bg-white hover:border-gold/20",
            ].join(" ")}
          >
            <p className="font-serif text-xl text-charcoal">{counts[role] ?? 0}</p>
            <p className="font-sans text-[10px] tracking-[0.1em] uppercase text-charcoal/40 mt-0.5">
              {role.replace("_", " ")}
            </p>
          </button>
        ))}
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/30" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white py-2.5 pl-9 pr-4 font-sans text-sm text-charcoal placeholder:text-charcoal/30 focus:border-gold/60 focus:outline-none transition-colors"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={[
                "rounded-full px-3.5 py-1.5 font-sans text-[11px] tracking-[0.08em] uppercase transition-colors",
                filter === f
                  ? "bg-charcoal text-cream"
                  : "bg-black/5 text-charcoal/50 hover:bg-black/8",
              ].join(" ")}
            >
              {f === "all" ? `All (${users.length})` : f.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-black/6 bg-white overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-2">
            {[1,2,3,4,5].map((i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-charcoal/4" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Users className="mx-auto mb-3 h-10 w-10 text-charcoal/12" />
            <p className="font-sans text-sm text-charcoal/40">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full font-sans text-sm min-w-[640px]">
              <thead className="border-b border-black/5">
                <tr>
                  {["User", "Role", "Status", "Joined", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-[10px] tracking-[0.15em] uppercase text-charcoal/35 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => {
                  const joined = new Date(user.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric", month: "short", year: "numeric",
                  });
                  return (
                    <tr key={user.id} className="border-b border-black/3 last:border-0 hover:bg-black/1 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar user={user} />
                          <div>
                            <p className="font-medium text-charcoal">{user.fullName ?? "—"}</p>
                            <p className="text-xs text-charcoal/40">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-5 py-3.5">
                        {user.isVerified ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-amber-600">
                            <Clock className="h-3.5 w-3.5" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-charcoal/40 whitespace-nowrap">{joined}</td>
                      <td className="px-5 py-3.5">
                        <div className="relative">
                          <button
                            type="button"
                            disabled={updatingId === user.id}
                            onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                            className="flex items-center gap-1 rounded-lg border border-black/10 px-3 py-1.5 font-sans text-[11px] text-charcoal/50 hover:border-gold hover:text-gold transition-colors disabled:opacity-40"
                          >
                            {updatingId === user.id ? "Updating…" : "Change role"}
                            <ChevronDown className="h-3 w-3" />
                          </button>

                          {openMenu === user.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                              <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-black/8 bg-white py-1 shadow-lg">
                                {ALL_ROLES.map((role) => (
                                  <button
                                    key={role}
                                    type="button"
                                    onClick={() => handleRoleChange(user.id, role)}
                                    className={[
                                      "flex w-full items-center gap-2 px-3 py-2 text-left font-sans text-xs transition-colors hover:bg-black/4",
                                      user.role === role ? "text-gold font-medium" : "text-charcoal/70",
                                    ].join(" ")}
                                  >
                                    {user.role === role && <Shield className="h-3 w-3" />}
                                    <span>{role.replace("_", " ")}</span>
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
