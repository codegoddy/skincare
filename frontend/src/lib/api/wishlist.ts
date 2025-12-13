import { apiClient } from './client';

// Types
export interface WishlistItem {
  id: string;
  product_id: string;
  name: string;
  type?: string;
  price: number;
  image?: string;
  in_stock: boolean;
  created_at?: string;
}

export interface WishlistResponse {
  items: WishlistItem[];
  total: number;
}

export interface AddToWishlistRequest {
  product_id: string;
  name: string;
  type?: string;
  price: number;
  image?: string;
  in_stock?: boolean;
}

// API Service
export const wishlistService = {
  async getWishlist(): Promise<WishlistResponse> {
    return apiClient<WishlistResponse>('/wishlist');
  },

  async addToWishlist(data: AddToWishlistRequest): Promise<WishlistItem> {
    return apiClient<WishlistItem>('/wishlist', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async removeFromWishlist(productId: string): Promise<{ message: string }> {
    return apiClient<{ message: string }>(`/wishlist/${productId}`, {
      method: 'DELETE',
    });
  },
};
