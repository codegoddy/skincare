import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistService, WishlistItem, WishlistResponse, AddToWishlistRequest } from '@/lib/api/wishlist';
import { toast } from '@/stores/toast';

// Query keys
export const wishlistKeys = {
  all: ['wishlist'] as const,
  list: () => [...wishlistKeys.all, 'list'] as const,
};

// Get wishlist
export function useWishlist() {
  return useQuery({
    queryKey: wishlistKeys.list(),
    queryFn: () => wishlistService.getWishlist(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Add to wishlist
export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToWishlistRequest) => wishlistService.addToWishlist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
      toast.success('Added to wishlist!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to add to wishlist');
    },
  });
}

// Remove from wishlist
export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => wishlistService.removeFromWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
      toast.success('Removed from wishlist');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to remove from wishlist');
    },
  });
}
