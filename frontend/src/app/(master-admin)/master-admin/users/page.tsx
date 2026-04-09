"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search, CheckCircle, MinusCircle, Shield, Loader2, AlertCircle,
  Download, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useAccessToken } from "@/lib/stores/auth-store";
import { authApi, type AuthUser } from "@/lib/api/client";
import { SortableTh } from "@/components/admin/sortable-th";

type RoleFilter   = "all" | "architect" | "vendor" | "creator" | "intern" | "editor" | "admin" | "customer";
type StatusFilter = "all" | "active" | "pending";
type SortCol      = "name" | "role" | "status" | "joined";
type SortDir      = "asc" | "desc";

const PAGE_SIZE = 20;

const ROLE_COLORS: Record<string, string> = {
  architect:    "text-purple-700 bg-purple-50 border-purple-200",
  vendor:       "text-orange-700 bg-orange-50 border-orange-200",
  creator:      "text-pink-700 bg-pink-50 border-pink-200",
  intern:       "text-blue-700 bg-blue-50 border-blue-200",
  editor:       "text-teal-700 bg-teal-50 border-teal-200",
  master_admin: "text-red-600 bg-red-50 border-red-200",
  admin:        "text-red-600 bg-red-50 border-red-200",
  customer:     "text-charcoal/50 bg-black/4 border-black/10",
};

const ROLES: RoleFilter[] = ["all", "architect", "vendor", "creator", "intern", "editor", "admin", "customer"];

function Spinner() { return <Loader2 className="h-4 w-4 animate-spin text-charcoal/40" />; }

export default function UsersPage() {
  const token = useAccessToken() ?? "";

  const [users,        setUsers]        = useState<AuthUser[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [actionError,  setActionError]  = useState<string | null>(null);
  const [search,       setSearch]       = useState("");
  const [roleFilter,   setRoleFilter]   = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [updating,     setUpdating]     = useState<string | null>(null);
  const [exporting,    setExporting]    = useState(false);
  const [sortCol,      setSortCol]      = useState<SortCol>("joined");
  const [sortDir,      setSortDir]      = useState<SortDir>("desc");
  const [page,         setPage]         = useState(1);

  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true); setError(null);
    try {
      const result = await authApi.listUsers(token);
      // Defensive: listUsers unwraps r.data, but guard against unexpected shapes
      setUsers(Array.isArray(result) ? result : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load users");
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  async function exportUsersCsv() {
    if (!token) return;
    setExporting(true);
    try {
      const res = await fetch(`${API}/profile/admin/export`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `user-profiles-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Export failed");
    } finally {
      setExporting(false);
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdating(userId);
    const prevRole = users.find(u => u.id === userId)?.role ?? "";
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    try {
      await authApi.updateRole(token, userId, newRole);
    } catch (e: unknown) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: prevRole } : u));
      setActionError(e instanceof Error ? e.message : "Role update failed");
    } finally { setUpdating(null); }
  };

  function toggleSort(col: SortCol) {
    if (sortCol === col) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
    setPage(1);
  }

  const getStatus = (u: AuthUser) => u.isVerified ? "active" : "pending";

  const safeUsers = Array.isArray(users) ? users : [];
  const filtered = safeUsers.filter((u) => {
    const displayRole = u.role === "master_admin" ? "admin" : u.role;
    const matchRole   = roleFilter === "all" || displayRole === roleFilter || u.role === roleFilter;
    const matchStatus = statusFilter === "all" || getStatus(u) === statusFilter;
    const matchSearch = !search
      || (u.fullName ?? "").toLowerCase().includes(search.toLowerCase())
      || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchStatus && matchSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortCol === "name")   cmp = (a.fullName ?? a.email).localeCompare(b.fullName ?? b.email);
    if (sortCol === "role")   cmp = a.role.localeCompare(b.role);
    if (sortCol === "status") cmp = (a.isVerified ? 1 : 0) - (b.isVerified ? 1 : 0);
    if (sortCol === "joined") cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return sortDir === "asc" ? cmp : -cmp;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pendingCount = users.filter(u => !u.isVerified).length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">User Management</h1>
          <p className="font-sans text-sm text-charcoal/35 mt-0.5">
            {loading ? "Loading…" : `${users.length} total · ${pendingCount} pending verification`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button"
            onClick={exportUsersCsv}
            disabled={exporting}
            className="flex items-center gap-1.5 rounded-full bg-charcoal px-4 py-2 font-sans text-[12px] text-cream hover:bg-charcoal-800 disabled:opacity-50 transition-colors">
            <Download className="h-3.5 w-3.5" />
            {exporting ? "Exporting…" : "Export CSV"}
          </button>
          <button type="button"
            className="flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 font-sans text-[12px] text-charcoal/60 hover:text-charcoal hover:border-black/20 transition-colors">
            <Shield className="h-3.5 w-3.5" /> Add Admin
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
          <p className="font-sans text-xs text-red-700 flex-1">{error}</p>
          <button type="button" onClick={load} className="font-sans text-[11px] text-red-600 hover:text-red-800 underline">Retry</button>
        </div>
      )}

      {actionError && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
          <p className="font-sans text-xs text-amber-700 flex-1">{actionError}</p>
          <button type="button" onClick={() => setActionError(null)} className="font-sans text-[11px] text-amber-600 hover:text-amber-800 underline">Dismiss</button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/25 pointer-events-none" />
          <input
            type="text"
            placeholder="Search users…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="rounded-xl border border-black/10 bg-black/4 py-2.5 pl-9 pr-4 font-sans text-sm text-charcoal/80 placeholder:text-charcoal/25 focus:border-black/20 focus:outline-none transition-colors w-64"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {ROLES.map((r) => (
            <button key={r} type="button" onClick={() => { setRoleFilter(r); setPage(1); }}
              className={["rounded-full px-3.5 py-1.5 font-sans text-[11px] tracking-[0.08em] uppercase transition-colors border",
                roleFilter === r ? "bg-black/6 text-charcoal border-black/15" : "border-black/8 text-charcoal/40 hover:text-charcoal/60",
              ].join(" ")}>{r}</button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {(["all", "active", "pending"] as StatusFilter[]).map((s) => (
            <button key={s} type="button" onClick={() => { setStatusFilter(s); setPage(1); }}
              className={["rounded-full px-3.5 py-1.5 font-sans text-[11px] tracking-[0.08em] uppercase transition-colors border",
                statusFilter === s ? "bg-black/6 text-charcoal border-black/15" : "border-black/8 text-charcoal/40 hover:text-charcoal/60",
              ].join(" ")}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-black/6 overflow-hidden">
        <table className="w-full font-sans text-sm">
          <thead>
            <tr className="border-b border-black/6 bg-black/2">
              <SortableTh label="Name / Email" direction={sortCol === "name"   ? sortDir : null} onSort={() => toggleSort("name")} />
              <SortableTh label="Role"         direction={sortCol === "role"   ? sortDir : null} onSort={() => toggleSort("role")} />
              <SortableTh label="Status"       direction={sortCol === "status" ? sortDir : null} onSort={() => toggleSort("status")} />
              <SortableTh label="Joined"       direction={sortCol === "joined" ? sortDir : null} onSort={() => toggleSort("joined")} />
              <th className="px-4 py-3 text-left text-[10px] tracking-[0.15em] uppercase text-charcoal/25 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {loading
              ? [0,1,2,3,4].map(i => (
                  <tr key={i}>
                    {[0,1,2,3,4].map(j => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-3 rounded bg-black/6 animate-pulse w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              : paged.map((user) => {
                  const status     = getStatus(user);
                  const isUpdating = updating === user.id;

                  return (
                    <tr key={user.id} className="hover:bg-black/2 transition-colors">
                      <td className="px-4 py-3.5">
                        <p className="text-charcoal/80 font-medium">{user.fullName ?? "—"}</p>
                        <p className="text-charcoal/35 text-xs">{user.email}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.08em] ${ROLE_COLORS[user.role] ?? ROLE_COLORS.customer}`}>
                          {user.role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {status === "active" ? (
                          <span className="flex items-center gap-1.5 text-emerald-600">
                            <CheckCircle className="h-3.5 w-3.5" /> Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-amber-600">
                            <MinusCircle className="h-3.5 w-3.5" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-charcoal/35 text-xs">
                        {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex gap-1.5 items-center">
                          {isUpdating && <Spinner />}
                          <select
                            title="Change role"
                            value={user.role}
                            onChange={e => handleRoleChange(user.id, e.target.value)}
                            disabled={isUpdating}
                            className="rounded-lg border border-black/10 bg-white px-2 py-1 font-sans text-[10px] text-charcoal/60 focus:outline-none focus:border-black/25 disabled:opacity-50 cursor-pointer"
                          >
                            {["customer", "architect", "vendor", "creator", "intern", "editor", "master_admin"].map(r => (
                              <option key={r} value={r}>{r.replace("_", " ")}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && (
          <div className="py-16 text-center font-sans text-sm text-charcoal/25">No users found</div>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between font-sans text-sm">
          <p className="text-charcoal/40 text-xs">
            Page {page} of {totalPages} · {filtered.length} users
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              title="Previous page"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 text-charcoal/50 hover:text-charcoal disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Next page"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 text-charcoal/50 hover:text-charcoal disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
