/**
 * Profile/User service
 */
import { apiClient, User, MessageResponse } from './client';

// Request types
export interface UpdateProfileRequest {
  full_name?: string;
  phone?: string;
  avatar_url?: string;
}

// Extended user profile from database
export interface UserProfile extends User {
  phone: string | null;
  avatar_url: string | null;
  updated_at: string | null;
}

// Profile service
export const profileService = {
  async getProfile(): Promise<UserProfile> {
    return apiClient<UserProfile>('/auth/me');
  },

  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    return apiClient<UserProfile>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<MessageResponse> {
    return apiClient('/profile/password', {
      method: 'POST',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });
  },
};
