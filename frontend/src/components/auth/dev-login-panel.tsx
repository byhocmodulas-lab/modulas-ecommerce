"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { Role } from "@/lib/stores/auth-store";

const ROLE_REDIRECT: Record<Role, string> = {
  master_admin: "/master-admin",
  editor:       "/master-admin",
  architect:    "/architect",
  vendor:       "/vendor",
  creator:      "/creator",
  intern:       "/intern",
  customer:     "/",
};

const DEV_USERS: { label: string; role: Role; email: string; name: string }[] = [
  { label: "Master Admin", role: "master_admin", email: "admin@modulas.in",      name: "Anjali Mehta" },
  { label: "Architect",    role: "architect",    email: "priya@sharmadesign.in", name: "Priya Sharma" },
  { label: "Vendor",       role: "vendor",       email: "ravi@kalpataru.com",    name: "Ravi Kalpataru" },
  { label: "Creator",      role: "creator",      email: "sneha@gmail.com",       name: "Sneha Kulkarni" },
  { label: "Intern",       role: "intern",       email: "arjun@iitb.ac.in",      name: "Arjun Kumar" },
];

export function DevLoginPanel() {
  const router  = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  function devLogin(role: Role, email: string, name: string) {
    setAuth(
      { id: `dev-${role}`, email, fullName: name, avatarUrl: null, role, isVerified: true },
      "dev-token",
      86400,
    );
    // Use hard navigation so the store is fully persisted before the next page loads
    window.location.href = ROLE_REDIRECT[role];
  }

  return (
    <div className="mt-8 rounded-xl border border-dashed border-stone-300 bg-stone-50 p-4">
      <p className="mb-3 text-[10px] font-medium uppercase tracking-widest text-stone-400">
        Dev — skip login
      </p>
      <div className="grid grid-cols-2 gap-2">
        {DEV_USERS.map(({ label, role, email, name }) => (
          <button
            key={role}
            type="button"
            onClick={() => devLogin(role, email, name)}
            className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-left transition hover:border-amber-400 hover:bg-amber-50"
          >
            <span className="block text-xs font-medium text-stone-700">{label}</span>
            <span className="block text-[10px] text-stone-400">{name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
