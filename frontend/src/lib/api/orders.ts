import { apiClient } from './client';

// Types
export interface OrderItem {
  id: string;
  product_id: string;
  name: string;
  type?: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shipping_address?: Record<string, unknown>;
  items: OrderItem[];
  created_at?: string;
  updated_at?: string;
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
}

export interface CreateOrderRequest {
  items: Omit<OrderItem, 'id'>[];
  shipping_address?: Record<string, unknown>;
}

// Admin Types
export interface AdminOrder {
  id: string;
  user_id: string;
  customer_name?: string;
  customer_email?: string;
  status: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  items_count: number;
  payment_method?: string;
  shipping_address?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface AdminOrderDetail extends AdminOrder {
  items: OrderItem[];
  customer_phone?: string;
}

export interface AdminOrderListResponse {
  orders: AdminOrder[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface OrderFilters {
  page?: number;
  page_size?: number;
  status?: string;
}

// API Service
export const ordersService = {
  // User Orders
  async getOrders(): Promise<OrderListResponse> {
    return apiClient<OrderListResponse>('/orders');
  },

  async getOrder(orderId: string): Promise<Order> {
    return apiClient<Order>(`/orders/${orderId}`);
  },

  async createOrder(data: CreateOrderRequest): Promise<Order> {
    return apiClient<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Admin Orders
  async getAdminOrders(filters: OrderFilters = {}): Promise<AdminOrderListResponse> {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.page_size) params.append('page_size', filters.page_size.toString());
    if (filters.status) params.append('status', filters.status);
    
    const query = params.toString();
    return apiClient<AdminOrderListResponse>(`/admin/orders${query ? `?${query}` : ''}`);
  },

  async getAdminOrder(orderId: string): Promise<AdminOrderDetail> {
    return apiClient<AdminOrderDetail>(`/admin/orders/${orderId}`);
  },

  async updateOrderStatus(orderId: string, status: string): Promise<AdminOrderDetail> {
    return apiClient<AdminOrderDetail>(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};
