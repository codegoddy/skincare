/**
 * Base API client with cookie-based authentication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Token management (now handled by cookies, these are no-ops for backward compatibility)
export function getAccessToken(): string | null {
  // Tokens are now in HTTP-only cookies, not accessible from JS
  return null;
}

export function getRefreshToken(): string | null {
  // Tokens are now in HTTP-only cookies, not accessible from JS
  return null;
}

export function setTokens(accessToken: string, refreshToken: string): void {
  // Tokens are now set by the backend as HTTP-only cookies
  // This function is kept for backward compatibility but does nothing
}

export function clearTokens(): void {
  // Tokens are now cleared by the backend
  // Clean up any old localStorage tokens if they exist
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}

// API Error class
export class ApiError extends Error {
  public maintenance?: boolean;
  public detail?: string;
  
  constructor(public status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.maintenance = data?.maintenance;
    this.detail = data?.detail || message;
  }
}

// Base fetch function with cookie-based auth
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Send cookies with requests
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Important: send cookies with cross-origin requests
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new ApiError(response.status, errorData.detail || `HTTP ${response.status}`, errorData);
  }
  
  return response.json();
}

// Types
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string | null;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface MessageResponse {
  message: string;
}
