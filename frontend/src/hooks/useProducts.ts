import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService, Product, ProductListResponse, ProductCreate, ProductUpdate, ProductFilters } from '@/lib/api/products';
import { toast } from '@/stores/toast';

// Query keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: Record<string, unknown>) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  filters: () => [...productKeys.all, 'filters'] as const,
  admin: () => [...productKeys.all, 'admin'] as const,
  adminList: (params: Record<string, unknown>) => [...productKeys.admin(), 'list', params] as const,
};

// Public hooks
export function useProducts(params?: {
  page?: number;
  page_size?: number;
  product_type?: string;
  skin_concern?: string;
  skin_type?: string;
  usage_time?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: productKeys.list(params || {}),
    queryFn: () => productsService.getProducts(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useProduct(productId: string) {
  return useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => productsService.getProduct(productId),
    enabled: !!productId,
  });
}

export function useProductFilters() {
  return useQuery({
    queryKey: productKeys.filters(),
    queryFn: () => productsService.getFilters(),
    staleTime: 1000 * 60 * 60, // 1 hour - filters don't change often
  });
}

// Admin hooks
export function useAdminProducts(params?: {
  page?: number;
  page_size?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: productKeys.adminList(params || {}),
    queryFn: () => productsService.adminGetProducts(params),
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductCreate) => productsService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success('Product created');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create product');
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: ProductUpdate }) =>
      productsService.updateProduct(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success('Product updated');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update product');
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => productsService.deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success('Product deleted');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete product');
    },
  });
}

export function useUploadProductImage() {
  return useMutation({
    mutationFn: (file: File) => productsService.uploadImage(file),
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
    },
  });
}
