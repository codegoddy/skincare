"use client";

import React from "react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import FadeIn from "@/components/ui/FadeIn";
import Link from "next/link";
import Image from "next/image";
import { getBlurDataURL } from "@/lib/imageUtils";
import { useProducts } from "@/hooks/useProducts";
import { Loader2 } from "lucide-react";

export default function ProductShowcase() {
  // Fetch first 6 active products from API
  const { data, isLoading, error } = useProducts({ 
    page: 1, 
    page_size: 6 
  });

  const products = data?.products || [];
  return (
    <section id="products" className="py-20 bg-white">
      <Container>
        {/* Heading */}
        <div className="text-center mb-20">
          <FadeIn direction="up">
            <h2 className="text-3xl md:text-5xl font-medium leading-tight">
              A COLLECTION OF PREMIER <br/>
              SELF-CARE <span className="font-serif italic text-gray-300">LUXURIES</span>
            </h2>
          </FadeIn>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">Unable to load products</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="border-2 border-black hover:bg-black hover:text-white"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">No products available yet</p>
            <Link href="/shop">
              <Button 
                variant="outline" 
                className="border-2 border-black hover:bg-black hover:text-white"
              >
                View All Products
              </Button>
            </Link>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product, idx) => {
              const productImage = product.images?.[0] || '/michela-ampolo-7tDGb3HrITg-unsplash.jpg';
              const formattedPrice = `KSh ${product.price.toLocaleString()}`;
              
              return (
                <FadeIn key={product.id} delay={0.2 * idx} direction="up" className="h-full">
                  <div className="group flex flex-col h-full">
                    {/* Image Container */}
                    <div className="relative w-full aspect-square bg-gray-50 mb-6 overflow-hidden border-2 border-black">
                      <Image 
                        src={productImage} 
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                        placeholder="blur"
                        blurDataURL={getBlurDataURL(700, 700)}
                        priority={idx === 0}
                        loading={idx === 0 ? "eager" : "lazy"}
                      />
                      
                      {/* New Badge - show for recently created products */}
                      {product.created_at && isNewProduct(product.created_at) && (
                        <div className="absolute top-4 left-4 z-10">
                          <Badge text="NEW" color="accent" />
                        </div>
                      )}

                      {/* Out of Stock Badge */}
                      {!product.in_stock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Badge text="OUT OF STOCK" color="accent" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="w-full mt-auto">
                      <h3 className="text-sm font-bold tracking-wide mb-4 uppercase">
                        {product.name}
                      </h3>
                      <div className="flex items-center text-xs font-medium text-gray-500 border-t border-gray-200 pt-3 mb-4">
                        <span className="pr-4 border-r border-gray-300 uppercase">
                          {product.product_type}
                        </span>
                        <span className="pl-4">{formattedPrice}</span>
                      </div>
                      <div className="w-full">
                        <Link href={`/shop/${product.id}`} className="block w-full">
                          <Button 
                            variant="outline" 
                            className="w-full rounded-none border-2 border-black text-xs py-3 hover:!bg-black hover:!text-white transition-colors duration-300"
                            disabled={!product.in_stock}
                          >
                            {product.in_stock ? 'Shop now' : 'Out of Stock'}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}

// Helper function to determine if product is new (created within last 30 days)
function isNewProduct(createdAt: string): boolean {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return new Date(createdAt) > thirtyDaysAgo;
}
