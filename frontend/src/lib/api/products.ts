import { apiClient, getAccessToken } from './client';

// Types
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  compare_price?: number;
  images: string[];
  product_type?: string;
  skin_concerns: string[];
  skin_types: string[];
  key_ingredients: string[];
  usage_time?: string;
  stock: number;
  in_stock: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ProductFilters {
  product_types: string[];
  skin_concerns: string[];
  skin_types: string[];
  key_ingredients: string[];
  usage_times: string[];
}

export interface ProductCreate {
  name: string;
  description?: string;
  price: number;
  compare_price?: number;
  images?: string[];
  product_type?: string;
  skin_concerns?: string[];
  skin_types?: string[];
  key_ingredients?: string[];
  usage_time?: string;
  stock?: number;
  in_stock?: boolean;
  is_active?: boolean;
}

export interface ProductUpdate extends Partial<ProductCreate> {}

// API Service
export const productsService = {
  // Public endpoints
  async getProducts(params?: {
    page?: number;
    page_size?: number;
    product_type?: string;
    skin_concern?: string;
    skin_type?: string;
    usage_time?: string;
    search?: string;
  }): Promise<ProductListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.page_size) searchParams.set('page_size', params.page_size.toString());
    if (params?.product_type) searchParams.set('product_type', params.product_type);
    if (params?.skin_concern) searchParams.set('skin_concern', params.skin_concern);
    if (params?.skin_type) searchParams.set('skin_type', params.skin_type);
    if (params?.usage_time) searchParams.set('usage_time', params.usage_time);
    if (params?.search) searchParams.set('search', params.search);
    
    const query = searchParams.toString();
    return apiClient<ProductListResponse>(`/products${query ? `?${query}` : ''}`);
  },

  async getProduct(productId: string): Promise<Product> {
    return apiClient<Product>(`/products/${productId}`);
  },

  async getFilters(): Promise<ProductFilters> {
    return apiClient<ProductFilters>('/products/filters');
  },

  // Admin endpoints
  async adminGetProducts(params?: {
    page?: number;
    page_size?: number;
    search?: string;
  }): Promise<ProductListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.page_size) searchParams.set('page_size', params.page_size.toString());
    if (params?.search) searchParams.set('search', params.search);
    
    const query = searchParams.toString();
    return apiClient<ProductListResponse>(`/admin/products${query ? `?${query}` : ''}`);
  },

  async createProduct(data: ProductCreate): Promise<Product> {
    return apiClient<Product>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProduct(productId: string, data: ProductUpdate): Promise<Product> {
    return apiClient<Product>(`/admin/products/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteProduct(productId: string): Promise<{ message: string }> {
    return apiClient<{ message: string }>(`/admin/products/${productId}`, {
      method: 'DELETE',
    });
  },

  async uploadImage(file: File): Promise<{ url: string; public_id: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = getAccessToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/products/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }
    
    return response.json();
  },
};
