"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  ChevronLeft,
  Loader2,
  Trash2
} from 'lucide-react';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import Container from '@/components/ui/Container';
import FadeIn from '@/components/ui/FadeIn';
import Button from '@/components/ui/Button';
import { getAccessToken } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useWishlist, useRemoveFromWishlist } from '@/hooks/useWishlist';
import { toast } from '@/stores/toast';

export default function WishlistPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { data, isLoading, isError } = useWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleRemove = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromWishlistMutation.mutate(productId);
  };

  const handleAddToCart = (item: { id: string; product_id: string; name: string; price: number; image?: string; in_stock: boolean }) => {
    if (!item.in_stock) {
      toast.error('This item is out of stock');
      return;
    }
    // Convert string product_id to number for cart compatibility
    const numericId = parseInt(item.product_id, 10) || Date.now();
    addToCart({
      id: numericId,
      name: item.name,
      price: `$${item.price.toFixed(2)}`,
      image: item.image || '',
    });
    toast.success('Added to cart');
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)', paddingTop: '5rem' }}>
          <div className="text-center">
            <Loader2 size={32} className="animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-400 text-sm">Loading your wishlist...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const wishlist = data?.items || [];

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Header />
      
      <div className="pt-32 pb-20">
        <Container>
          {/* Header */}
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <FadeIn direction="up">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Link href="/profile" className="text-gray-400 hover:text-primary transition-colors absolute left-4 md:left-8">
                  <ChevronLeft size={24} />
                </Link>
                <Heart size={32} className="text-primary" />
              </div>
              <h1 className="text-5xl md:text-7xl font-medium leading-none tracking-tight mb-4">
                MY <span className="font-serif italic text-gray-300">WISHLIST</span>
              </h1>
              <p className="text-gray-500">{wishlist.length} items saved for later</p>
            </FadeIn>
          </div>

          {wishlist.length === 0 ? (
            <div className="text-center py-16">
              <Heart size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-4">Your wishlist is empty</h3>
              <p className="text-gray-500 mb-8">Save items you love to buy them later</p>
              <Link href="/shop">
                <Button>Browse Shop</Button>
              </Link>
            </div>
          ) : (
            /* Product Grid - Same as Shop Page */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-12">
              {wishlist.map((product, idx) => (
                <FadeIn key={product.id} delay={idx * 0.1} direction="up" className="h-full">
                  <div className="group flex flex-col h-full relative">
                    {/* Remove Button */}
                    <button
                      onClick={(e) => handleRemove(product.product_id, e)}
                      disabled={removeFromWishlistMutation.isPending}
                      className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors border border-gray-200 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>

                    <Link href={`/shop/${product.product_id}`} className="block">
                      {/* Image Container */}
                      <div className="relative w-full aspect-[4/5] bg-gray-50 mb-6 overflow-hidden border-2 border-black">
                        {product.image ? (
                          <Image 
                            src={product.image} 
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className={`object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-110 ${!product.in_stock ? 'opacity-50' : ''}`}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Heart size={48} />
                          </div>
                        )}
                        
                        {/* Out of Stock Overlay */}
                        {!product.in_stock && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <span className="bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest">Out of Stock</span>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="w-full mt-auto text-center md:text-left">
                        <div className="mb-2">
                          <h3 className="text-xs font-bold tracking-widest uppercase mb-1">{product.name}</h3>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">{product.type || 'Product'}</p>
                          <span className="text-sm font-medium block">${product.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </Link>
                      
                    <div className="mt-4">
                      <Button 
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.in_stock}
                        className={`w-full rounded-none border-2 border-black text-[10px] py-3 !bg-transparent !text-black hover:!bg-black hover:!text-white transition-all duration-300 uppercase font-bold tracking-widest ${!product.in_stock ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          )}
        </Container>
      </div>
      <Footer />
    </main>
  );
}
