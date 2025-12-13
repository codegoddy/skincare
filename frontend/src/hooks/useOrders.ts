import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersService, Order, OrderListResponse, CreateOrderRequest } from '@/lib/api/orders';
import { toast } from '@/stores/toast';

// Query keys
export const ordersKeys = {
  all: ['orders'] as const,
  list: () => [...ordersKeys.all, 'list'] as const,
  detail: (id: string) => [...ordersKeys.all, 'detail', id] as const,
};

// Get all orders
export function useOrders() {
  return useQuery({
    queryKey: ordersKeys.list(),
    queryFn: () => ordersService.getOrders(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get single order
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
