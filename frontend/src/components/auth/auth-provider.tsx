"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import * as authApi from "@/lib/api/auth";
import type { Role } from "@/lib/stores/auth-store";

/**
 * Mounts once in the root layout.
 * Schedules a silent token refresh 60 seconds before the access token expires.
 * If the refresh succeeds the store and cookie are updated in-place.
 * If it fails (refresh token expired / revoked) the user is cleared.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { accessToken, expiresAt, setAuth, clearAuth } = useAuthStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!accessToken || !expiresAt) return;

    const msUntilExpiry = expiresAt - Date.now();
    const msUntilRefresh = msUntilExpiry - 60_000; // refresh 60s early

    if (msUntilRefresh <= 0) {
      // Token already expired or about to — refresh immediately
      doRefresh();
      return;
    }

    timerRef.current = setTimeout(doRefresh, msUntilRefresh);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, expiresAt]);

  async function doRefresh() {
    try {
      const result = await authApi.refresh();

      setAuth(
        {
          id: result.user.id,
          email: result.user.email,
          fullName: result.user.fullName,
          avatarUrl: result.user.avatarUrl,
          role: result.user.role as Role,
          isVerified: result.user.isVerified,
        },
        result.accessToken,
        result.expiresIn,
      );

      // Keep cookie in sync
      document.cookie = `modulas_token=${result.accessToken}; path=/; max-age=${result.expiresIn}; SameSite=Lax`;
    } catch {
      clearAuth();
      document.cookie = "modulas_token=; path=/; max-age=0";
    }
  }

  return <>{children}</>;
}