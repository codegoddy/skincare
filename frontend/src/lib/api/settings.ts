import { apiClient } from './client';

// Types
export interface NotificationSettings {
  order_updates: boolean;
  promotions: boolean;
  newsletter: boolean;
  product_alerts: boolean;
}

export interface SettingsResponse {
  notifications: NotificationSettings;
  updated_at?: string;
}

export interface UpdateNotificationsRequest {
  order_updates?: boolean;
  promotions?: boolean;
  newsletter?: boolean;
  product_alerts?: boolean;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

// API Service
export const settingsService = {
  async getSettings(): Promise<SettingsResponse> {
    return apiClient<SettingsResponse>('/settings');
  },

  async updateSettings(data: UpdateNotificationsRequest): Promise<SettingsResponse> {
    return apiClient<SettingsResponse>('/settings', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    return apiClient<{ message: string }>('/settings/password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
