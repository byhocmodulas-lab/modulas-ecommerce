import { NextRequest, NextResponse } from "next/server";

// Protected route groups — require auth
const PROTECTED_PATTERNS = [
  /^\/(architect-portal)/,
  /^\/(creator-hub)/,
  /^\/(collab)/,
  /^\/(vendor-portal)/,
  /^\/(admin)/,
  /^\/account/,
  /^\/checkout/,
];

// Role-restricted routes
const ROLE_ROUTES: Array<{ pattern: RegExp; roles: string[] }> = [
  { pattern: /^\/(admin)/, roles: ["master_admin", "editor"] },
  { pattern: /^\/(architect-portal)/, roles: ["architect", "master_admin", "editor"] },
  { pattern: /^\/(creator-hub)/, roles: ["creator", "master_admin", "editor"] },
  { pattern: /^\/(vendor-portal)/, roles: ["vendor", "master_admin", "editor"] },
];

const TOKEN_COOKIE = "modulas_token";
const LOGIN_URL = "/login";

function decodeJwtPayload(token: string): { role?: string; exp?: number } | null {
  try {
    const [, payloadB64] = token.split(".");
    return JSON.parse(Buffer.from(payloadB64, "base64url").toString());
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATTERNS.some((p) => p.test(pathname));
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get(TOKEN_COOKIE)?.value;

  // Not authenticated → redirect to login with return URL
  if (!token) {
    const loginUrl = new URL(LOGIN_URL, request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = decodeJwtPayload(token);

  // Expired or malformed
  if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
    const loginUrl = new URL(LOGIN_URL, request.url);
    loginUrl.searchParams.set("next", pathname);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete(TOKEN_COOKIE);
    return res;
  }

  // Role check
  for (const { pattern, roles } of ROLE_ROUTES) {
    if (pattern.test(pathname) && !roles.includes(payload.role ?? "")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|xml|txt)).*)",
  ],
};
