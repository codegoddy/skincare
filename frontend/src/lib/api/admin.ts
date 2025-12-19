import { apiClient } from './client';

// Types
export interface AdminUser {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  role: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  orders_count: number;
}

export interface AdminUserListResponse {
  users: AdminUser[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface StoreSettings {
  id: string;
  store_name: string;
  store_email?: string;
  store_phone?: string;
  store_address?: string;
  currency: string;
  currency_symbol: string;
  tax_rate: number;
  shipping_fee: number;
  free_shipping_threshold?: number;
  maintenance_mode: boolean;
  updated_at?: string;
}

export interface StoreSettingsUpdate {
  store_name?: string;
  store_email?: string;
  store_phone?: string;
  store_address?: string;
  currency?: string;
  currency_symbol?: string;
  tax_rate?: number;
  shipping_fee?: number;
  free_shipping_threshold?: number;
  maintenance_mode?: boolean;
}

// Dashboard Types
export interface DashboardStat {
  name: string;
  value: string;
  change: string;
  change_positive: boolean;
}

export interface RecentOrder {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: string;
  items: number;
}

export interface DashboardResponse {
  stats: DashboardStat[];
  recent_orders: RecentOrder[];
}

// API Service
export const adminService = {
  // Dashboard
  async getDashboard(): Promise<DashboardResponse> {
    return apiClient<DashboardResponse>('/admin/dashboard');
  },

  async getUsers(page: number = 1, pageSize: number = 20): Promise<AdminUserListResponse> {
    return apiClient<AdminUserListResponse>(`/admin/users?page=${page}&page_size=${pageSize}`);
  },

  async getUser(userId: string): Promise<AdminUser> {
    return apiClient<AdminUser>(`/admin/users/${userId}`);
  },

  async updateUserRole(userId: string, role: string): Promise<AdminUser> {
    return apiClient<AdminUser>(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },

  async updateUserStatus(userId: string, status: string): Promise<AdminUser> {
    return apiClient<AdminUser>(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Store Settings
  async getStoreSettings(): Promise<StoreSettings> {
    return apiClient<StoreSettings>('/admin/settings');
  },

  async updateStoreSettings(data: StoreSettingsUpdate): Promise<StoreSettings> {
    return apiClient<StoreSettings>('/admin/settings', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
