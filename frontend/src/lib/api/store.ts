import { apiClient } from './client';

export interface StoreConfig {
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
}

export const storeService = {
  async getConfig(): Promise<StoreConfig> {
    return apiClient<StoreConfig>('/store/config');
  },
};
