"use client";

import React from 'react';
import { Heart } from 'lucide-react';
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from '@/hooks/useWishlist';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'next/navigation';
import { toast } from '@/stores/toast';

interface WishlistButtonProps {
  productId: string;
  productName: string;
  productType?: string;
  price: number;
  image?: string;
  inStock?: boolean;
  className?: string;
  iconSize?: number;
}

export default function WishlistButton({
  productId,
  productName,
  productType,
  price,
  image,
  inStock = true,
  className = '',
  iconSize = 20,
}: WishlistButtonProps) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const { data: wishlistData } = useWishlist();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  // Check if product is in wishlist
  const isInWishlist = wishlistData?.items?.some(
    (item) => item.product_id === productId
  );

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.warning('Please login to add items to wishlist');
      router.push('/login');
      return;
    }

    // Toggle wishlist
    if (isInWishlist) {
      removeFromWishlistMutation.mutate(productId);
    } else {
      addToWishlistMutation.mutate({
        product_id: productId,
        name: productName,
        type: productType,
        price: price,
        image: image,
        in_stock: inStock,
      });
    }
  };

  const isLoading = addToWishlistMutation.isPending || removeFromWishlistMutation.isPending;

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center justify-center transition-all duration-300 ${className}`}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        size={iconSize}
        className={`transition-all duration-300 ${
          isInWishlist
            ? 'fill-red-500 text-red-500'
            : 'text-gray-400 hover:text-red-500'
        } ${isLoading ? 'opacity-50' : ''}`}
      />
    </button>
  );
}
