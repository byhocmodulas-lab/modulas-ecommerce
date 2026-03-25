// ── Auth API client ───────────────────────────────────────────

const BASE = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"}/auth`;

export class AuthApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "AuthApiError";
  }
}

async function post<T>(path: string, body: unknown, token?: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    credentials: "include",          // send/receive httpOnly refresh cookie
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new AuthApiError(res.status, data.message ?? `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

async function get<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new AuthApiError(res.status, data.message ?? `HTTP ${res.status}`);
  }

  return res.json();
}

// ── Response types ────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthUser;
  pendingApproval?: boolean;
  message?: string;
}

// ── Public endpoints ──────────────────────────────────────────

export function register(payload: {
  email: string;
  password: string;
  fullName?: string;
  role?: string;
}): Promise<AuthResult> {
  return post("/register", payload);
}

export function login(payload: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  return post("/login", payload);
}

export function refresh(): Promise<AuthResult> {
  return post("/refresh", {});
}

export function forgotPassword(email: string): Promise<{ message: string }> {
  return post("/forgot-password", { email });
}

export function resetPassword(payload: {
  token: string;
  newPassword: string;
}): Promise<{ message: string }> {
  return post("/reset-password", payload);
}

// ── Authenticated endpoints ───────────────────────────────────

export function me(token: string): Promise<AuthUser> {
  return get("/me", token);
}

export function logout(token: string): Promise<void> {
  return post("/logout", {}, token);
}
