/**
 * Authentication service
 */
import { 
  apiClient, 
  setTokens, 
  clearTokens, 
  getRefreshToken,
  TokenResponse,
  MessageResponse,
  User 
} from './client';

// Request types
export interface SignupRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  access_token: string;
  new_password: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

// Auth service
export const authService = {
  async signup(data: SignupRequest): Promise<TokenResponse> {
    const response = await apiClient<TokenResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setTokens(response.access_token, response.refresh_token);
    return response;
  },

  async login(data: LoginRequest): Promise<TokenResponse> {
    const response = await apiClient<TokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setTokens(response.access_token, response.refresh_token);
    return response;
  },

  async logout(): Promise<void> {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } finally {
      clearTokens();
    }
  },

  async getMe(): Promise<User> {
    return apiClient<User>('/auth/me');
  },

  async refreshToken(): Promise<TokenResponse> {
    // Refresh token is now sent automatically via cookies
    const response = await apiClient<TokenResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    // Tokens are now set as cookies by the backend
    return response;
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<MessageResponse> {
    return apiClient('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async resetPassword(data: ResetPasswordRequest): Promise<MessageResponse> {
    return apiClient('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
