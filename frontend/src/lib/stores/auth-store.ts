import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role =
  | "master_admin"
  | "customer"
  | "architect"
  | "creator"
  | "vendor"
  | "intern"
  | "editor";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: Role;
  isVerified: boolean;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  expiresAt: number | null;  // unix ms

  // Actions
  setAuth: (user: AuthUser, accessToken: string, expiresIn: number) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
  hasRole: (...roles: Role[]) => boolean;
  isAdmin: () => boolean;
  isPendingApproval: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      expiresAt: null,

      setAuth: (user, accessToken, expiresIn) => {
        set({
          user,
          accessToken,
          expiresAt: Date.now() + expiresIn * 1000,
        });
      },

      clearAuth: () => set({ user: null, accessToken: null, expiresAt: null }),

      isAuthenticated: () => {
        const { accessToken, expiresAt } = get();
        return !!accessToken && !!expiresAt && expiresAt > Date.now();
      },

      hasRole: (...roles) => {
        const role = get().user?.role;
        return !!role && roles.includes(role);
      },

      isAdmin: () => {
        const role = get().user?.role;
        return role === "master_admin" || role === "editor";
      },

      isPendingApproval: () => {
        const { user } = get();
        if (!user) return false;
        const pendingRoles: Role[] = ["architect", "vendor", "intern"];
        return pendingRoles.includes(user.role) && !user.isVerified;
      },
    }),
    {
      name: "modulas-auth",
      // Only persist non-sensitive fields
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        expiresAt: state.expiresAt,
      }),
    },
  ),
);

// ── Typed selectors ──────────────────────────────────────────

export const useUser = () => useAuthStore((s) => s.user);
export const useAccessToken = () => useAuthStore((s) => s.accessToken);
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated());
export const useIsAdmin = () => useAuthStore((s) => s.isAdmin());