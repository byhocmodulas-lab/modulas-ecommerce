// ── Shared API types ──────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  statusCode: number;
  error: string;
  message: string;
  details?: Array<{ field: string; issue: string }>;
}

export type ApiResponse<T> = { data: T } | ApiError;

// ── Auth ──────────────────────────────────────────────────────

export type Role =
  | "customer"
  | "architect"
  | "creator"
  | "vendor"
  | "intern"
  | "editor"
  | "master_admin";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: Role;
  isVerified: boolean;
}

export interface AuthTokens {
  accessToken: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName?: string;
}