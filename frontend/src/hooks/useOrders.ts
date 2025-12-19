import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ordersService, 
  Order, 
  OrderListResponse, 
  CreateOrderRequest,
  AdminOrderListResponse,
  AdminOrderDetail,
  OrderFilters,
} from '@/lib/api/orders';
import { toast } from '@/stores/toast';

// Query keys
export const ordersKeys = {
  all: ['orders'] as const,
  list: () => [...ordersKeys.all, 'list'] as const,
  detail: (id: string) => [...ordersKeys.all, 'detail', id] as const,
  admin: ['admin', 'orders'] as const,
  adminList: (filters: OrderFilters) => [...ordersKeys.admin, 'list', filters] as const,
  adminDetail: (id: string) => [...ordersKeys.admin, 'detail', id] as const,
};

// Get all orders (user)
export function useOrders() {
  return useQuery({
    queryKey: ordersKeys.list(),
    queryFn: () => ordersService.getOrders(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get single order (user)
export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ordersKeys.detail(orderId),
    queryFn: () => ordersService.getOrder(orderId),
    enabled: !!orderId,
  });
}

// Create order
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => ordersService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersKeys.all });
      toast.success('Order placed successfully!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create order');
    },
  });
}

// Admin: Get all orders with pagination
export function useAdminOrders(filters: OrderFilters = {}) {
  return useQuery<AdminOrderListResponse>({
    queryKey: ordersKeys.adminList(filters),
    queryFn: () => ordersService.getAdminOrders(filters),
    staleTime: 1000 * 30, // 30 seconds
  });
}

// Admin: Get single order details
export function useAdminOrder(orderId: string) {
  return useQuery<AdminOrderDetail>({
    queryKey: ordersKeys.adminDetail(orderId),
    queryFn: () => ordersService.getAdminOrder(orderId),
    enabled: !!orderId,
  });
}

// Admin: Update order status
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      ordersService.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersKeys.admin });
      toast.success('Order status updated!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update order');
    },
  });
}
