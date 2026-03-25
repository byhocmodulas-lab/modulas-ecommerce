// ── Session helpers (server-side) ─────────────────────────────
// Works both with Clerk (production) and local JWT (dev/testing)

import { cookies } from "next/headers";
import type { AuthUser, Role } from "@/types/api";

const JWT_COOKIE = "modulas_token";

/**
 * Get the current session from cookies (server components / actions).
 * Returns null if not authenticated.
 */
export async function auth(): Promise<(AuthUser & { token: string; vendorId?: string }) | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(JWT_COOKIE)?.value;
  if (!token) return null;

  try {
    // Decode JWT payload (no verify — trust the API to reject invalid tokens)
    const [, payloadB64] = token.split(".");
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString());

    if (payload.exp && payload.exp * 1000 < Date.now()) return null;

    return {
      id: payload.sub,
      email: payload.email,
      fullName: payload.fullName ?? null,
      avatarUrl: payload.avatarUrl ?? null,
      role: payload.role as Role,
      isVerified: payload.isVerified ?? false,
      token,
      vendorId: payload.vendorId,
    };
  } catch {
    return null;
  }
}

/**
 * Require authentication — redirect to /login if not authenticated.
 * In development without a JWT cookie, returns a mock admin session
 * so you can access protected pages without logging in first.
 */
export async function requireAuth() {
  const { redirect } = await import("next/navigation");
  const session = await auth();

  if (!session) {
    // Dev bypass — skip redirect so protected pages are accessible locally
    if (process.env.NODE_ENV === "development") {
      return {
        id: "dev-user",
        email: "dev@modulas.com",
        fullName: "Dev User",
        avatarUrl: null,
        role: "master_admin" as Role,
        isVerified: true,
        token: "",
      };
    }
    redirect("/login");
  }

  return session;
}

/**
 * Require a specific role — redirect to / if not authorised.
 */
export async function requireRole(...roles: Role[]) {
  const { redirect } = await import("next/navigation");
  const session = await requireAuth();
  if (!session || !roles.includes(session.role)) redirect("/");
  return session;
}

/** Cookie name constant for use in actions / route handlers */
export const TOKEN_COOKIE = JWT_COOKIE;