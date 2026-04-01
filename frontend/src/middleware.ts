import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ── Route → required roles map ────────────────────────────────────────
const PROTECTED: Array<{ prefix: string; roles: string[] }> = [
  { prefix: "/master-admin", roles: ["master_admin"] },
  { prefix: "/admin",        roles: ["master_admin", "editor"] },
  { prefix: "/architect",    roles: ["architect", "master_admin"] },
  { prefix: "/vendor",       roles: ["vendor", "master_admin"] },
  { prefix: "/creator",      roles: ["creator", "master_admin"] },
  { prefix: "/intern",       roles: ["intern", "master_admin"] },
  { prefix: "/account",      roles: ["customer", "architect", "vendor", "creator", "intern", "master_admin", "editor"] },
  { prefix: "/checkout",     roles: ["customer", "architect", "vendor", "creator", "intern", "master_admin", "editor"] },
];

// ── Decode JWT payload without a library (Edge-safe) ─────────────────
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const [, payload] = token.split(".");
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const rule = PROTECTED.find((r) => pathname.startsWith(r.prefix));
  if (!rule) return NextResponse.next();

  // Read token from cookie (set by auth flow) or Authorization header
  const token =
    req.cookies.get("modulas_token")?.value ??
    req.headers.get("authorization")?.replace("Bearer ", "") ??
    null;

  if (!token) {
    // Determine login destination by portal type
    const loginUrl = getLoginUrl(pathname, req.nextUrl.origin);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = decodeJwtPayload(token);

  // Token expired
  const exp = payload?.exp as number | undefined;
  if (!payload || (exp && exp * 1000 < Date.now())) {
    const loginUrl = getLoginUrl(pathname, req.nextUrl.origin);
    loginUrl.searchParams.set("next", pathname);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete("modulas_token");
    return res;
  }

  const role = payload.role as string | undefined;

  if (!role || !rule.roles.includes(role)) {
    // Authenticated but wrong role → show 403 page
    return NextResponse.redirect(new URL("/403", req.nextUrl.origin));
  }

  return NextResponse.next();
}

function getLoginUrl(pathname: string, origin: string): URL {
  if (pathname.startsWith("/architect")) return new URL("/architect/login", origin);
  if (pathname.startsWith("/vendor"))    return new URL("/vendor/login", origin);
  if (pathname.startsWith("/creator"))   return new URL("/creator/login", origin);
  if (pathname.startsWith("/intern"))    return new URL("/intern/login", origin);
  if (pathname.startsWith("/admin") || pathname.startsWith("/master-admin"))
    return new URL("/workspace", origin);
  return new URL("/login", origin);
}

export const config = {
  matcher: [
    "/master-admin/:path*",
    "/admin/:path*",
    "/architect/:path*",
    "/vendor/:path*",
    "/creator/:path*",
    "/intern/:path*",
    "/account/:path*",
    "/checkout/:path*",
  ],
};
