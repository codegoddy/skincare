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

// API Service
export const ordersService = {
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
};
