// ── Typed API client ──────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(fetchOptions.headers ?? {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...fetchOptions, headers });

  if (!res.ok) {
    let body: { message?: string; error?: string } = {};
    try {
      body = await res.json();
    } catch {
      // ignore parse error
    }
    throw new ApiError(
      res.status,
      body.message ?? body.error ?? `HTTP ${res.status}`,
      body,
    );
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ── Auth ──────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string | null;
  avatarUrl?: string | null;
  role: string;
  isVerified: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export const authApi = {
  register: (payload: { email: string; password: string; fullName?: string }) =>
    request<{ accessToken: string; user: unknown }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    request<{ accessToken: string; user: unknown }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  me: (token: string) =>
    request<unknown>("/auth/me", { token }),

  listUsers: (token: string, role?: string) =>
    request<{ data: AuthUser[]; meta: { total: number; page: number; limit: number; totalPages: number } }>(
      `/auth/users${role ? `?role=${role}` : ""}`,
      { token },
    ).then((r) => r.data),

  updateRole: (token: string, userId: string, role: string) =>
    request<unknown>(`/auth/users/${userId}/role`, {
      method: "PATCH",
      token,
      body: JSON.stringify({ role }),
    }),
};

// ── Products ──────────────────────────────────────────────────

export const productsApi = {
  search: (params: Record<string, string | undefined>) => {
    const qs = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][],
      ),
    ).toString();
    return request<{ products: unknown[]; total: number }>(`/catalog/products?${qs}`);
  },

  findOne: (idOrSlug: string) =>
    request<unknown>(`/catalog/products/${idOrSlug}`),

  create: (token: string, payload: unknown) =>
    request<unknown>("/catalog/products", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }),

  update: (token: string, id: string, payload: unknown) =>
    request<unknown>(`/catalog/products/${id}`, {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    }),

  remove: (token: string, id: string) =>
    request<void>(`/catalog/products/${id}`, { method: "DELETE", token }),
};

// ── Orders ────────────────────────────────────────────────────

export const ordersApi = {
  getCart: (token: string) =>
    request<unknown>("/orders/cart", { token }),

  addToCart: (token: string, payload: unknown) =>
    request<unknown>("/orders/cart/items", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }),

  checkout: (token: string, payload: unknown) =>
    request<{ checkoutUrl: string }>("/orders/checkout", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }),

  myOrders: (token: string, page = 1) =>
    request<unknown>(`/orders?page=${page}`, { token }),

  adminOrders: (token: string, params?: Record<string, string>) => {
    const qs = params ? new URLSearchParams(params).toString() : "";
    return request<unknown>(`/orders/admin?${qs}`, { token });
  },

  updateStatus: (token: string, id: string, status: string) =>
    request<unknown>(`/orders/${id}/status`, {
      method: "PATCH",
      token,
      body: JSON.stringify({ status }),
    }),
};

// ── CMS types ─────────────────────────────────────────────────

export interface CmsPage {
  id: string;
  slug: string;
  title: string;
  pageType: 'homepage' | 'about' | 'contact' | 'static' | 'landing';
  status: 'draft' | 'published' | 'archived';
  content: Record<string, unknown>;
  seoTitle?: string | null;
  seoDescription?: string | null;
  ogImage?: string | null;
  publishedAt: string | null;
  updatedBy?: { id: string; fullName?: string | null } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CmsBanner {
  id: string;
  name: string;
  placement: 'announcement' | 'hero' | 'category' | 'product' | 'checkout';
  status: 'active' | 'scheduled' | 'inactive';
  message?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  imageUrl?: string | null;
  mobileImageUrl?: string | null;
  bgColor?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CmsMediaItem {
  id: string;
  filename: string;
  originalName: string;
  fileKey: string;
  url: string;
  mimeType: string;
  fileSize: number;
  width?: number | null;
  height?: number | null;
  altText?: string | null;
  folder: string;
  tags: string[];
  uploadedBy?: { id: string; fullName?: string | null } | null;
  createdAt: string;
}

export interface CmsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  category?: string | null;
  coverImageUrl?: string | null;
  status: 'draft' | 'review' | 'published' | 'archived';
  viewCount: number;
  author?: { id: string; fullName?: string | null } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CmsSummary {
  pages: number;
  published: number;
  drafts: number;
  banners: number;
  activeBanners: number;
  media: number;
}

// ── CMS API ───────────────────────────────────────────────────

function qs(params: Record<string, string | number | undefined> | undefined): string {
  if (!params) return '';
  const s = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    )
  ).toString();
  return s ? `?${s}` : '';
}

export const cmsApi = {
  summary: (token: string) =>
    request<CmsSummary>('/cms/summary', { token }),

  // Pages
  listPages: (token: string, params?: { status?: string; pageType?: string }) =>
    request<CmsPage[]>(`/cms/pages${qs(params)}`, { token }),

  getPage: (token: string, slug: string) =>
    request<CmsPage>(`/cms/pages/${slug}`, { token }),

  createPage: (token: string, dto: Partial<CmsPage> & { slug: string; title: string; pageType: string }) =>
    request<CmsPage>('/cms/pages', { method: 'POST', token, body: JSON.stringify(dto) }),

  updatePage: (token: string, slug: string, dto: Partial<CmsPage>) =>
    request<CmsPage>(`/cms/pages/${slug}`, { method: 'PATCH', token, body: JSON.stringify(dto) }),

  deletePage: (token: string, slug: string) =>
    request<void>(`/cms/pages/${slug}`, { method: 'DELETE', token }),

  clonePage: (token: string, slug: string, newSlug: string) =>
    request<CmsPage>(`/cms/pages/${slug}/clone`, { method: 'POST', token, body: JSON.stringify({ newSlug }) }),

  /** Public — fetch a single published page (no auth needed) */
  getPublishedPage: (slug: string) =>
    request<CmsPage>(`/cms/pages/${slug}/published`),

  // Banners
  listBanners: (token: string, params?: { placement?: string; status?: string }) =>
    request<CmsBanner[]>(`/cms/banners${qs(params)}`, { token }),

  getActiveBanners: (placement: string) =>
    request<CmsBanner[]>(`/cms/banners/active/${placement}`),

  createBanner: (token: string, dto: Partial<CmsBanner> & { name: string; placement: string }) =>
    request<CmsBanner>('/cms/banners', { method: 'POST', token, body: JSON.stringify(dto) }),

  updateBanner: (token: string, id: string, dto: Partial<CmsBanner>) =>
    request<CmsBanner>(`/cms/banners/${id}`, { method: 'PATCH', token, body: JSON.stringify(dto) }),

  deleteBanner: (token: string, id: string) =>
    request<void>(`/cms/banners/${id}`, { method: 'DELETE', token }),

  // Media
  listMedia: (token: string, params?: { folder?: string; search?: string; page?: number; limit?: number }) =>
    request<{ items: CmsMediaItem[]; total: number; page: number; totalPages: number }>(
      `/cms/media${qs(params)}`, { token }
    ),

  updateMedia: (token: string, id: string, dto: { altText?: string; folder?: string; tags?: string[] }) =>
    request<CmsMediaItem>(`/cms/media/${id}`, { method: 'PATCH', token, body: JSON.stringify(dto) }),

  deleteMedia: (token: string, id: string) =>
    request<void>(`/cms/media/${id}`, { method: 'DELETE', token }),
};

// ── Articles (Blog) API ───────────────────────────────────────

export const articlesApi = {
  /** Public — fetch published articles for the storefront */
  getPublished: (params?: { category?: string; page?: number; limit?: number }) =>
    request<{ articles: CmsArticle[]; total: number; page: number; totalPages: number }>(
      `/cms/articles/published${qs(params)}`
    ),

  adminList: (token: string, params?: { status?: string; category?: string; search?: string; page?: number; limit?: number }) =>
    request<{ articles: CmsArticle[]; total: number; page: number; totalPages: number }>(
      `/cms/articles${qs(params)}`, { token }
    ),

  create: (token: string, dto: { title: string; slug: string; content: string; excerpt?: string; category?: string }) =>
    request<CmsArticle>('/cms/articles', { method: 'POST', token, body: JSON.stringify(dto) }),

  updateStatus: (token: string, id: string, status: string) =>
    request<CmsArticle>(`/cms/articles/${id}/status`, { method: 'PATCH', token, body: JSON.stringify({ status }) }),

  update: (token: string, id: string, dto: Partial<CmsArticle>) =>
    request<CmsArticle>(`/cms/articles/${id}`, { method: 'PATCH', token, body: JSON.stringify(dto) }),

  remove: (token: string, id: string) =>
    request<void>(`/cms/articles/${id}`, { method: 'DELETE', token }),
};

// ── User Profile ──────────────────────────────────────────────

export interface UserProfile {
  id: string;
  userId: string;
  fullName?: string | null;
  phone?: string | null;
  companyName?: string | null;
  website?: string | null;
  address?: {
    line1: string; line2?: string;
    city: string; state?: string;
    country: string; pincode: string;
  } | null;
  requirements?: {
    projectType?: string;
    budgetRange?: string;
    timeline?: string;
    notes?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export const profileApi = {
  getMe: (token: string) =>
    request<UserProfile>('/profile/me', { token }),

  upsertMe: (token: string, dto: Partial<UserProfile>) =>
    request<UserProfile>('/profile/me', {
      method: 'PUT',
      token,
      body: JSON.stringify(dto),
    }),

  exportCsv: (token: string) =>
    fetch(`${API_BASE}/profile/admin/export`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    }),
};

// ── Invoices ──────────────────────────────────────────────────

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  userId: string;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: 'issued' | 'paid' | 'void' | 'refunded';
  createdAt: string;
  billingDetails: {
    fullName: string;
    email: string;
    phone?: string;
    companyName?: string;
    address: { line1: string; line2?: string; city: string; state?: string; country: string; pincode: string };
  };
}

export const invoicesApi = {
  mine: (token: string) =>
    request<Invoice[]>('/invoices/mine', { token }),

  downloadPdf: (token: string, id: string) =>
    fetch(`${API_BASE}/invoices/mine/${id}/pdf`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    }),

  adminList: (token: string, params?: { page?: number; limit?: number; search?: string }) =>
    request<{ data: Invoice[]; meta: { page: number; limit: number; total: number; totalPages: number } }>(
      `/invoices/admin${qs(params)}`, { token }
    ),

  adminDownloadPdf: (token: string, id: string) =>
    fetch(`${API_BASE}/invoices/admin/${id}/pdf`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    }),

  exportCsv: (token: string) =>
    fetch(`${API_BASE}/invoices/admin/export`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    }),
};

// ── Payments ──────────────────────────────────────────────────

export const paymentsApi = {
  createPaymentIntent: (token: string, orderId: string) =>
    request<{ clientSecret: string; paymentIntentId: string }>(
      `/orders/${orderId}/payment-intent`,
      { method: 'POST', token }
    ),
};

// ── Social AI ─────────────────────────────────────────────────

export type ContentTool =
  | 'caption' | 'hashtags' | 'platform_variants' | 'content_ideas'
  | 'product_copy' | 'product_description' | 'seo_tags' | 'blog'
  | 'product_names' | 'email';

export type SocialPlatform = 'instagram' | 'facebook' | 'linkedin' | 'pinterest';
export type ContentTone    = 'luxury' | 'informative' | 'promotional' | 'conversational';

export interface AIGenerateResult { text: string; tool: string }

export const aiContentApi = {
  generate: (token: string, dto: {
    tool: ContentTool; prompt: string;
    platform?: SocialPlatform; tone?: ContentTone;
    audience?: string; maxTokens?: number;
  }) =>
    request<AIGenerateResult>('/social/ai/generate', {
      method: 'POST', token, body: JSON.stringify(dto),
    }),

  imagePrompt: (token: string, dto: {
    category: string; theme: string; audience?: string; style?: string;
  }) =>
    request<{ prompt: string; negativePrompt: string }>('/social/ai/image-prompt', {
      method: 'POST', token, body: JSON.stringify(dto),
    }),

  campaignBrief: (token: string, dto: { topic: string; platforms?: string[] }) =>
    request<{ caption: string; hashtags: string; variants: string; ideas: string }>(
      '/social/ai/campaign-brief',
      { method: 'POST', token, body: JSON.stringify(dto) },
    ),
};

// ── Content Scheduler ─────────────────────────────────────────

export interface ScheduledPost {
  id: string;
  title: string;
  caption: string;
  hashtags?: string | null;
  mediaUrls: string[];
  platforms: SocialPlatform[];
  postType: 'image' | 'carousel' | 'reel' | 'story' | 'text' | 'article';
  status: 'draft' | 'scheduled' | 'published' | 'failed' | 'cancelled';
  scheduledAt?: string | null;
  publishedAt?: string | null;
  platformVariants?: Record<string, string> | null;
  campaign?: string | null;
  reachEst?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const schedulerApi = {
  list: (token: string, params?: { status?: string; platform?: string; campaign?: string; month?: number; year?: number }) =>
    request<ScheduledPost[]>(`/social/posts${qs(params)}`, { token }),

  summary: (token: string) =>
    request<{ total: number; scheduled: number; published: number; drafts: number }>(
      '/social/posts/summary', { token }
    ),

  create: (token: string, dto: Partial<ScheduledPost> & { title: string; caption: string }) =>
    request<ScheduledPost>('/social/posts', { method: 'POST', token, body: JSON.stringify(dto) }),

  update: (token: string, id: string, dto: Partial<ScheduledPost>) =>
    request<ScheduledPost>(`/social/posts/${id}`, { method: 'PATCH', token, body: JSON.stringify(dto) }),

  remove: (token: string, id: string) =>
    request<void>(`/social/posts/${id}`, { method: 'DELETE', token }),
};

// ── Competitor Intelligence ────────────────────────────────────

export interface CompetitorProfile {
  id: string;
  name: string;
  handle?: string | null;
  platforms: string[];
  website?: string | null;
  segment?: string | null;
  notes?: string | null;
  followerCount?: number | null;
  postFrequency?: number | null;
  avgEngagement?: number | null;
  isActive: boolean;
  createdAt: string;
}

export interface CompetitorPost {
  id: string;
  postUrl?: string | null;
  imageUrl?: string | null;
  caption?: string | null;
  platform?: string | null;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  format?: string | null;
  theme?: string | null;
  notes?: string | null;
  postedAt?: string | null;
  trackedAt: string;
}

export const competitorApi = {
  listProfiles: (token: string) =>
    request<CompetitorProfile[]>('/social/competitors', { token }),

  getProfile: (token: string, id: string) =>
    request<CompetitorProfile & { posts: CompetitorPost[] }>(`/social/competitors/${id}`, { token }),

  getInsights: (token: string, id: string) =>
    request<{ posts: number; avgLikes: number; avgComments: number; topFormat: string | null; topTheme: string | null }>(
      `/social/competitors/${id}/insights`, { token }
    ),

  createProfile: (token: string, dto: Partial<CompetitorProfile> & { name: string }) =>
    request<CompetitorProfile>('/social/competitors', { method: 'POST', token, body: JSON.stringify(dto) }),

  updateProfile: (token: string, id: string, dto: Partial<CompetitorProfile>) =>
    request<CompetitorProfile>(`/social/competitors/${id}`, { method: 'PATCH', token, body: JSON.stringify(dto) }),

  deleteProfile: (token: string, id: string) =>
    request<void>(`/social/competitors/${id}`, { method: 'DELETE', token }),

  listPosts: (token: string, competitorId: string) =>
    request<CompetitorPost[]>(`/social/competitors/${competitorId}/posts`, { token }),

  addPost: (token: string, competitorId: string, dto: Partial<CompetitorPost>) =>
    request<CompetitorPost>(`/social/competitors/${competitorId}/posts`, {
      method: 'POST', token, body: JSON.stringify(dto),
    }),

  deletePost: (token: string, postId: string) =>
    request<void>(`/social/competitors/posts/${postId}`, { method: 'DELETE', token }),
};

// ── Popups ────────────────────────────────────────────────────

export interface CmsPopup {
  id: string;
  name: string;
  trigger: 'onload' | 'exit_intent' | 'scroll';
  triggerValue: number;
  title: string;
  body?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  ctaNewTab: boolean;
  couponCode?: string | null;
  imageUrl?: string | null;
  bgColor?: string | null;
  showOnce: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const popupsApi = {
  list: (token: string) =>
    request<CmsPopup[]>('/cms/popups', { token }),

  getActive: () =>
    request<CmsPopup[]>('/cms/popups/active'),

  create: (token: string, dto: Partial<CmsPopup> & { name: string; trigger: string; title: string }) =>
    request<CmsPopup>('/cms/popups', { method: 'POST', token, body: JSON.stringify(dto) }),

  update: (token: string, id: string, dto: Partial<CmsPopup>) =>
    request<CmsPopup>(`/cms/popups/${id}`, { method: 'PATCH', token, body: JSON.stringify(dto) }),

  remove: (token: string, id: string) =>
    request<void>(`/cms/popups/${id}`, { method: 'DELETE', token }),
};

// ── Navigation ────────────────────────────────────────────────

export interface NavLink {
  label: string;
  href: string;
  openInNewTab?: boolean;
  children?: NavLink[];
}

export interface CmsNavMenu {
  id: string;
  name: string;
  label: string;
  items: NavLink[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const navApi = {
  list: (token: string) =>
    request<CmsNavMenu[]>('/cms/nav', { token }),

  getPublic: (name: string) =>
    request<CmsNavMenu>(`/cms/nav/${name}/public`),

  upsert: (token: string, dto: { name: string; label: string; items?: NavLink[]; isActive?: boolean }) =>
    request<CmsNavMenu>('/cms/nav', { method: 'POST', token, body: JSON.stringify(dto) }),

  update: (token: string, name: string, dto: Partial<CmsNavMenu>) =>
    request<CmsNavMenu>(`/cms/nav/${name}`, { method: 'PATCH', token, body: JSON.stringify(dto) }),

  remove: (token: string, name: string) =>
    request<void>(`/cms/nav/${name}`, { method: 'DELETE', token }),
};

// ── Leads ─────────────────────────────────────────────────────

export type LeadStage = 'new' | 'contacted' | 'converted' | 'closed';
export type LeadSource = 'vendor_apply' | 'creator_apply' | 'intern_apply' | 'manual' | 'website';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  stage: LeadStage;
  source: LeadSource;
  notes?: string | null;
  assignedTo?: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export const leadsApi = {
  /** Public — called from join forms */
  create: (dto: { name: string; email: string; phone?: string; company?: string; source?: LeadSource; notes?: string }) =>
    request<Lead>('/leads', { method: 'POST', body: JSON.stringify(dto) }),

  list: (token: string, params?: { stage?: LeadStage; page?: number; limit?: number }) =>
    request<{ data: Lead[]; meta: { total: number; page: number; limit: number } }>(
      `/leads${qs(params)}`, { token }
    ),

  summary: (token: string) =>
    request<{ stage: string; count: string }[]>('/leads/summary', { token }),

  get: (token: string, id: string) =>
    request<Lead>(`/leads/${id}`, { token }),

  update: (token: string, id: string, dto: { stage?: LeadStage; notes?: string; assignedTo?: string }) =>
    request<Lead>(`/leads/${id}`, { method: 'PATCH', token, body: JSON.stringify(dto) }),
};

// ── Applications ──────────────────────────────────────────────

export type ApplicationType   = 'vendor' | 'creator' | 'intern';
export type ApplicationStatus = 'pending' | 'reviewing' | 'approved' | 'rejected';

export interface Application {
  id: string;
  type: ApplicationType;
  status: ApplicationStatus;
  name: string;
  email: string;
  phone?: string | null;
  payload: Record<string, unknown>;
  reviewNotes?: string | null;
  reviewedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const applicationsApi = {
  /** Public — called from /join/* pages */
  submit: (dto: { type: ApplicationType; name: string; email: string; phone?: string; payload?: Record<string, unknown> }) =>
    request<Application>('/applications', { method: 'POST', body: JSON.stringify(dto) }),

  list: (token: string, params?: { type?: ApplicationType; status?: ApplicationStatus; page?: number; limit?: number }) =>
    request<{ data: Application[]; meta: { total: number; page: number; limit: number } }>(
      `/applications${qs(params)}`, { token }
    ),

  get: (token: string, id: string) =>
    request<Application>(`/applications/${id}`, { token }),

  review: (token: string, id: string, dto: { status: ApplicationStatus; reviewNotes?: string }) =>
    request<Application>(`/applications/${id}`, { method: 'PATCH', token, body: JSON.stringify(dto) }),

  /** Public — applicant checks own status by email */
  checkStatus: (email: string, type?: ApplicationType) =>
    request<{ found: boolean; status?: ApplicationStatus; type?: ApplicationType; createdAt?: string }>(
      `/applications/status${qs({ email, type })}`
    ),
};

// ── Analytics ─────────────────────────────────────────────────

export interface AnalyticsDashboard {
  kpis: {
    totalOrders: number;
    totalUsers: number;
    totalLeads: number;
    totalRevenue: number;
    revenueGrowth: number | null;
    monthOrders: number;
    ordersGrowth: number | null;
  };
  ordersByStatus: Record<string, number>;
  recentOrders: Array<{
    id: string;
    status: string;
    totalAmount: number;
    currency: string;
    createdAt: string;
    userId: string;
  }>;
}

export const analyticsApi = {
  dashboard: (token: string) =>
    request<AnalyticsDashboard>('/analytics/dashboard', { token }),
};

// ── Addresses ─────────────────────────────────────────────────

export interface Address {
  id: string;
  userId: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state?: string | null;
  postcode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export const addressesApi = {
  list: (token: string) =>
    request<Address[]>('/users/addresses', { token }),

  create: (token: string, dto: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) =>
    request<Address>('/users/addresses', { method: 'POST', token, body: JSON.stringify(dto) }),

  update: (token: string, id: string, dto: Partial<Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>) =>
    request<Address>(`/users/addresses/${id}`, { method: 'PATCH', token, body: JSON.stringify(dto) }),

  remove: (token: string, id: string) =>
    request<void>(`/users/addresses/${id}`, { method: 'DELETE', token }),
};

// ── Wishlist ──────────────────────────────────────────────────

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
}

export const wishlistApi = {
  get: (token: string) =>
    request<WishlistItem[]>('/wishlist', { token }),

  add: (token: string, productId: string) =>
    request<WishlistItem>('/wishlist', { method: 'POST', token, body: JSON.stringify({ productId }) }),

  remove: (token: string, productId: string) =>
    request<void>(`/wishlist/${productId}`, { method: 'DELETE', token }),

  /** Sync local Zustand wishlist to DB on login */
  sync: (token: string, productIds: string[]) =>
    request<WishlistItem[]>('/wishlist/sync', { method: 'POST', token, body: JSON.stringify({ productIds }) }),
};

// ── Configurator ──────────────────────────────────────────────

export interface ConfiguratorOptions {
  productId: string;
  name: string;
  basePrice: number;
  currency: string;
  material?: string | null;
  dimensions?: Record<string, unknown> | null;
  finishOptions: Array<{ id: string; label: string; priceDelta: number }>;
  metadata: Record<string, unknown>;
}

export const configuratorApi = {
  getOptions: (productIdOrSlug: string) =>
    request<ConfiguratorOptions>(`/configurator/${productIdOrSlug}`),
};

// ── Architect — Projects ──────────────────────────────────────

export type ProjectStatus = 'planning' | 'in_production' | 'installed' | 'archived';

export interface Project {
  id: string;
  userId: string;
  name: string;
  clientName?: string | null;
  clientEmail?: string | null;
  status: ProjectStatus;
  notes?: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export const projectsApi = {
  create: (token: string, dto: { name: string; clientName?: string; clientEmail?: string; notes?: string }) =>
    request<Project>('/projects', { method: 'POST', token, body: JSON.stringify(dto) }),

  list: (token: string, params?: { status?: ProjectStatus; page?: number; limit?: number }) =>
    request<{ data: Project[]; meta: { total: number; page: number; limit: number } }>(
      `/projects${qs(params)}`, { token }
    ),

  get: (token: string, id: string) =>
    request<Project>(`/projects/${id}`, { token }),

  update: (token: string, id: string, dto: Partial<Pick<Project, 'name' | 'clientName' | 'clientEmail' | 'status' | 'notes'>>) =>
    request<Project>(`/projects/${id}`, { method: 'PATCH', token, body: JSON.stringify(dto) }),

  remove: (token: string, id: string) =>
    request<void>(`/projects/${id}`, { method: 'DELETE', token }),
};

// ── Architect — Quotes ────────────────────────────────────────

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'declined' | 'expired';

export interface QuoteItem {
  name: string;
  qty: number;
  unitPrice: number;
  configuration?: string;
}

export interface Quote {
  id: string;
  userId: string;
  reference: string;
  clientName: string;
  clientEmail?: string | null;
  projectName?: string | null;
  status: QuoteStatus;
  items: QuoteItem[];
  discount?: number | null;
  validUntil?: string | null;
  notes?: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export const quotesApi = {
  create: (token: string, dto: { clientName: string; clientEmail?: string; projectName?: string; items: QuoteItem[]; discount?: number; validUntil?: string; notes?: string }) =>
    request<Quote>('/quotes', { method: 'POST', token, body: JSON.stringify(dto) }),

  list: (token: string, params?: { status?: QuoteStatus; page?: number; limit?: number }) =>
    request<{ data: Quote[]; meta: { total: number; page: number; limit: number } }>(
      `/quotes${qs(params)}`, { token }
    ),

  get: (token: string, id: string) =>
    request<Quote>(`/quotes/${id}`, { token }),

  update: (token: string, id: string, dto: Partial<Pick<Quote, 'status' | 'items' | 'discount' | 'validUntil' | 'notes'>>) =>
    request<Quote>(`/quotes/${id}`, { method: 'PATCH', token, body: JSON.stringify(dto) }),

  remove: (token: string, id: string) =>
    request<void>(`/quotes/${id}`, { method: 'DELETE', token }),
};

// ── Affiliate / Creator Hub ────────────────────────────────────

export interface AffiliateLink {
  id: string;
  userId: string;
  label: string;
  slug: string;
  targetUrl: string;
  clicks: number;
  conversions: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const affiliateApi = {
  listLinks: (token: string) =>
    request<AffiliateLink[]>('/affiliate/links', { token }),

  createLink: (token: string, dto: { label: string; targetUrl: string }) =>
    request<AffiliateLink>('/affiliate/links', { method: 'POST', token, body: JSON.stringify(dto) }),

  removeLink: (token: string, id: string) =>
    request<void>(`/affiliate/links/${id}`, { method: 'DELETE', token }),
};

// ── Campaigns (Creator Opportunities) ────────────────────────

export type CampaignType   = 'reel' | 'youtube' | 'blog' | 'series';
export type CampaignStatus = 'open' | 'closed';

export interface Campaign {
  id: string;
  title: string;
  description: string;
  type: CampaignType;
  platforms: string[];
  deadline: string | null;
  fee: string | null;
  deliverables: string[];
  status: CampaignStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const campaignsApi = {
  list: (params?: { status?: CampaignStatus; type?: CampaignType }) => {
    const p = params ? qs(params as Record<string, string | number | undefined>) : '';
    return request<Campaign[]>(`/campaigns${p}`);
  },

  get: (id: string) =>
    request<Campaign>(`/campaigns/${id}`),

  create: (token: string, dto: Partial<Campaign> & { title: string; description: string; type: CampaignType; platforms: string[] }) =>
    request<Campaign>('/campaigns', { method: 'POST', token, body: JSON.stringify(dto) }),

  update: (token: string, id: string, dto: Partial<Campaign>) =>
    request<Campaign>(`/campaigns/${id}`, { method: 'PATCH', token, body: JSON.stringify(dto) }),

  remove: (token: string, id: string) =>
    request<void>(`/campaigns/${id}`, { method: 'DELETE', token }),
};

// ── Brand Mentions ────────────────────────────────────────────

export type MentionPlatform  = 'instagram' | 'twitter' | 'pinterest' | 'tiktok';
export type MentionSentiment = 'positive' | 'neutral' | 'negative' | 'mixed';

export interface Mention {
  id: string;
  platform: MentionPlatform;
  author: string;
  handle: string;
  content: string;
  sentiment: MentionSentiment;
  likes: number;
  requiresResponse: boolean;
  responded: boolean;
  url: string | null;
  isArchived: boolean;
  detectedAt: string;
  createdAt: string;
  updatedAt: string;
}

export const mentionsApi = {
  list: (token: string, params?: { sentiment?: MentionSentiment; platform?: MentionPlatform; needsResponse?: boolean }) => {
    const p = params ? qs(params as Record<string, string | number | undefined>) : '';
    return request<Mention[]>(`/mentions${p}`, { token });
  },

  create: (token: string, dto: Partial<Mention> & { platform: MentionPlatform; author: string; handle: string; content: string }) =>
    request<Mention>('/mentions', { method: 'POST', token, body: JSON.stringify(dto) }),

  update: (token: string, id: string, dto: { sentiment?: MentionSentiment; responded?: boolean; requiresResponse?: boolean; isArchived?: boolean }) =>
    request<Mention>(`/mentions/${id}`, { method: 'PATCH', token, body: JSON.stringify(dto) }),

  remove: (token: string, id: string) =>
    request<void>(`/mentions/${id}`, { method: 'DELETE', token }),
};

export { ApiError };