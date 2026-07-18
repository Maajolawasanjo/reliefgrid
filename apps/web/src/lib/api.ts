/**
 * ReliefGrid Production API Client
 * 
 * Features:
 * - JWT Bearer token injection on every request
 * - Automatic 401 → redirect to /login
 * - Typed response wrappers
 * - Request cancellation via AbortController
 * - Centralized error normalization
 * - Retry on transient 5xx (up to 2 attempts with backoff)
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 800;

// ── Error types ───────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly detail?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

// ── Typed response helper ────────────────────────────────────────────────────

export interface ApiResult<T> {
  data: T;
  status: number;
}

// ── Token accessor ───────────────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const directToken = localStorage.getItem('reliefgrid_token');
    if (directToken) return directToken;

    const stored = localStorage.getItem('reliefgrid_auth');
    if (!stored) return null;
    return JSON.parse(stored)?.access_token ?? null;
  } catch {
    return null;
  }
}

// ── Sleep helper ─────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── Core fetch wrapper ────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit & { signal?: AbortSignal } = {},
  attempt = 0,
): Promise<ApiResult<T>> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> | undefined ?? {}),
  };

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });
  } catch (err) {
    throw new NetworkError(`Network request failed: ${(err as Error).message}`);
  }

  // Handle 401 — clear session and redirect
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('reliefgrid_token');
      localStorage.removeItem('reliefgrid_auth');
      window.location.href = '/login';
    }
    throw new ApiError(401, 'UNAUTHORIZED', 'Session expired. Redirecting to login.');
  }

  // Handle 429 — rate limited
  if (response.status === 429) {
    const retryAfter = parseInt(response.headers.get('Retry-After') ?? '5', 10);
    throw new ApiError(429, 'RATE_LIMITED', `Rate limit exceeded. Retry after ${retryAfter}s.`);
  }

  // Retry on transient server errors (500, 502, 503, 504)
  if (response.status >= 500 && attempt < MAX_RETRIES) {
    await sleep(RETRY_DELAY_MS * (attempt + 1));
    return request<T>(path, options, attempt + 1);
  }

  // Parse body
  let body: unknown;
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    body = await response.json();
  } else if (contentType.includes('text/')) {
    body = await response.text();
  } else {
    body = await response.blob();
  }

  if (!response.ok) {
    const detail = (body as any)?.detail ?? body;
    const message =
      typeof detail === 'string' ? detail : JSON.stringify(detail) ?? `HTTP ${response.status}`;
    throw new ApiError(response.status, `HTTP_${response.status}`, message, detail);
  }

  return { data: body as T, status: response.status };
}

// ── Public API surface ────────────────────────────────────────────────────────

export const api = {
  /** GET request */
  get<T>(path: string, signal?: AbortSignal): Promise<ApiResult<T>> {
    return request<T>(path, { method: 'GET', signal });
  },

  /** POST request with JSON body */
  post<T>(path: string, body?: unknown, signal?: AbortSignal): Promise<ApiResult<T>> {
    return request<T>(path, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  },

  /** PATCH request with JSON body */
  patch<T>(path: string, body?: unknown, signal?: AbortSignal): Promise<ApiResult<T>> {
    return request<T>(path, {
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  },

  /** DELETE request */
  delete<T>(path: string, signal?: AbortSignal): Promise<ApiResult<T>> {
    return request<T>(path, { method: 'DELETE', signal });
  },

  /** Download a file as Blob (for reports) */
  async download(path: string, filename: string): Promise<void> {
    const token = getToken();
    const response = await fetch(`${API_BASE}${path}`, {
      headers: { Authorization: `Bearer ${token ?? ''}` },
    });
    if (!response.ok) throw new ApiError(response.status, 'DOWNLOAD_FAILED', 'File download failed.');
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },
};

// ── Domain-specific API helpers ───────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ access_token: string; token_type: string }>('/auth/login', { email, password }),

  register: (payload: { email: string; password: string; full_name: string; organization_id: string }) =>
    api.post('/auth/register', payload),

  me: () => api.get<{ id: string; email: string; full_name: string; roles: string[] }>('/auth/me'),
};

export const incidentsApi = {
  list: (params?: { severity?: string; status?: string; search?: string; page?: number; limit?: number }) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params ?? {}).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])),
    ).toString();
    return api.get<{ total: number; items: any[] }>(`/incidents/${qs ? `?${qs}` : ''}`);
  },

  get: (id: string) => api.get<any>(`/incidents/${id}`),

  create: (payload: {
    title: string;
    description: string;
    severity: string;
    latitude: number;
    longitude: number;
    affected_population?: number;
  }) => api.post<any>('/incidents/', payload),

  update: (id: string, payload: Partial<{ title: string; description: string; severity: string; status: string; affected_population: number }>) =>
    api.patch<any>(`/incidents/${id}`, payload),

  addTimeline: (id: string, event_type: string, description: string) =>
    api.post<any>(`/incidents/${id}/timeline`, { event_type, description }),

  analyze: (id: string) => api.post<any>(`/incidents/${id}/analyze`),

  getTimeline: (id: string) => api.get<any>(`/incidents/${id}/agent-timeline`),

  delete: (id: string) => api.delete<any>(`/incidents/${id}`),

  exportReport: (id: string) => api.download(`/analytics/incidents/${id}/export-report`, `AfterActionReport_${id.slice(0, 8)}.txt`),
};

export const analyticsApi = {
  recommendations: (incidentId: string) =>
    api.get<any>(`/analytics/incidents/${incidentId}/recommendations`),

  executiveSummary: () => api.get<any>('/analytics/executive-summary'),
};

export const memoryApi = {
  search: (query: string, limit = 10) =>
    api.post<any[]>('/memories/search', { query, limit }),

  list: () => api.get<any[]>('/memories/'),

  create: (payload: { memory_type: string; content: string; incident_id?: string; metadata_json?: any }) =>
    api.post<any>('/memories/', payload),

  delete: (id: string) => api.delete<any>(`/memories/${id}`),
};


export const telemetryApi = {
  auditLogs: (limit = 50) => api.get<any[]>(`/telemetry/audit-logs?limit=${limit}`),

  agentMetrics: () => api.get<any>('/telemetry/agent-metrics'),

  runWatchdog: () => api.post<any>('/telemetry/watchdog/health-check'),
};

export const usersApi = {
  list: () => api.get<any[]>('/users/'),
  create: (payload: { email: string; password: string; full_name: string; organization_id: string; roles: string[] }) =>
    api.post<any>('/users/', payload),
  update: (id: string, payload: Partial<{ full_name: string; email: string; is_active: boolean; roles: string[] }>) =>
    api.patch<any>(`/users/${id}`, payload),
};
