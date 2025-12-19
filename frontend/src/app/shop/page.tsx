"use client";

import React, { Suspense, useState } from "react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useCart } from "@/context/CartContext";
import { useStoreConfig } from "@/context/StoreConfigContext";
import { useProducts, useProductFilters } from "@/hooks/useProducts";
import { useProductsWebSocket } from "@/hooks/useProductsWebSocket";
import Link from "next/link";
import Image from "next/image";
import { getBlurDataURL, shouldPrioritize } from "@/lib/imageUtils";
import { Loader2 } from "lucide-react";

import { useSearchParams } from "next/navigation";

function ShopContent() {
  const { addToCart } = useCart();
  const { formatPrice } = useStoreConfig();
  const searchParams = useSearchParams();
  const query = searchParams.get('search') || '';
  
  // Filters state
  const [productType, setProductType] = useState<string | undefined>();
  const [skinConcern, setSkinConcern] = useState<string | undefined>();
  const [skinType, setSkinType] = useState<string | undefined>();
  const [usageTime, setUsageTime] = useState<string | undefined>();
  
  // Fetch products from API
  const { data, isLoading, isError } = useProducts({
    search: query || undefined,
    product_type: productType,
    skin_concern: skinConcern,
    skin_type: skinType,
    usage_time: usageTime,
    page_size: 50,
  });
  
  // Get filter options
  const { data: filters } = useProductFilters();
  
  // Real-time updates
  useProductsWebSocket();
  
  const products = data?.products || [];

  const clearFilters = () => {
    setProductType(undefined);
    setSkinConcern(undefined);
    setSkinType(undefined);
    setUsageTime(undefined);
  };

  const hasActiveFilters = productType || skinConcern || skinType || usageTime;

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Header />
      <div className="pt-32 pb-20">
        <Container>
           {/* Header */}
           <div className="text-center mb-16 max-w-2xl mx-auto">
             <FadeIn direction="up">
              <h1 className="text-5xl md:text-7xl font-medium leading-none tracking-tight mb-4">
                SHOP <span className="font-serif italic text-gray-300">ALL</span>
              </h1>
             </FadeIn>
           </div>

           {/* Category Navigation */}
           <div className="flex overflow-x-auto md:overflow-visible md:flex-wrap items-center gap-6 md:gap-10 mb-16 text-xs font-bold tracking-widest uppercase border-y border-gray-100 py-5 whitespace-nowrap no-scrollbar px-4 md:px-0 -mx-4 md:mx-0 justify-start md:justify-center">
               {filters?.product_types?.map(type => (
                   <span 
                     key={type} 
                     onClick={() => setProductType(productType === type ? undefined : type)}
                     className={`cursor-pointer hover:text-black hover:underline underline-offset-4 transition-all flex-shrink-0 ${productType === type ? 'text-black underline' : 'text-gray-500'}`}
                   >
                     {type}
                   </span>
               ))}
           </div>

           <div className="flex flex-col md:flex-row gap-12">
               {/* Sidebar Filters */}
               <div className="w-full md:w-64 flex-shrink-0 space-y-6">
                   <div className="border-b border-gray-200 pb-2 mb-6 flex items-center justify-between">
                       <span className="font-bold text-sm uppercase tracking-widest">Filters</span>
                       {hasActiveFilters && (
                         <button 
                           onClick={clearFilters}
                           className="text-xs text-primary hover:underline"
                         >
                           Clear All
                         </button>
                       )}
                   </div>
                   
                   {/* Skin Concern Filter */}
                   <FadeIn delay={0.1} direction="right">
                       <details className="group border-b border-gray-200 pb-4 cursor-pointer" open>
                           <summary className="flex items-center justify-between text-xs font-bold tracking-widest list-none uppercase select-none hover:text-gray-500 transition-colors">
                               By Skin Concern
                               <span className="transform group-open:rotate-180 transition-transform duration-300">
                                   <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor"><path d="M1 1L5 5L9 1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                               </span>
                           </summary>
                           <div className="pt-4 space-y-2 text-sm text-gray-500">
                               {filters?.skin_concerns?.map(concern => (
                                 <label key={concern} className="flex items-center gap-2 cursor-pointer hover:text-black transition-colors">
                                     <input 
                                       type="checkbox" 
                                       checked={skinConcern === concern}
                                       onChange={() => setSkinConcern(skinConcern === concern ? undefined : concern)}
                                       className="rounded-none border-gray-300 text-black focus:ring-0" 
                                     /> 
                                     {concern}
                                 </label>
                               ))}
                           </div>
                       </details>
                   </FadeIn>

                   {/* Skin Type Filter */}
                   <FadeIn delay={0.2} direction="right">
                       <details className="group border-b border-gray-200 pb-4 cursor-pointer">
                           <summary className="flex items-center justify-between text-xs font-bold tracking-widest list-none uppercase select-none hover:text-gray-500 transition-colors">
                               By Skin Type
                               <span className="transform group-open:rotate-180 transition-transform duration-300">
                                   <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor"><path d="M1 1L5 5L9 1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                               </span>
                           </summary>
                           <div className="pt-4 space-y-2 text-sm text-gray-500">
                               {filters?.skin_types?.map(type => (
                                 <label key={type} className="flex items-center gap-2 cursor-pointer hover:text-black transition-colors">
                                     <input 
                                       type="checkbox" 
                                       checked={skinType === type}
                                       onChange={() => setSkinType(skinType === type ? undefined : type)}
                                       className="rounded-none border-gray-300 text-black focus:ring-0" 
                                     /> 
                                     {type}
                                 </label>
                               ))}
                           </div>
                       </details>
                   </FadeIn>

                   {/* Usage Time Filter */}
                   <FadeIn delay={0.3} direction="right">
                       <details className="group border-b border-gray-200 pb-4 cursor-pointer">
                           <summary className="flex items-center justify-between text-xs font-bold tracking-widest list-none uppercase select-none hover:text-gray-500 transition-colors">
                               By Usage Time
                               <span className="transform group-open:rotate-180 transition-transform duration-300">
                                   <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor"><path d="M1 1L5 5L9 1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                               </span>
                           </summary>
                           <div className="pt-4 space-y-2 text-sm text-gray-500">
                               {filters?.usage_times?.map(time => (
                                 <label key={time} className="flex items-center gap-2 cursor-pointer hover:text-black transition-colors">
                                     <input 
                                       type="checkbox" 
                                       checked={usageTime === time}
                                       onChange={() => setUsageTime(usageTime === time ? undefined : time)}
                                       className="rounded-none border-gray-300 text-black focus:ring-0" 
                                     /> 
                                     {time}
                                 </label>
                               ))}
                           </div>
                       </details>
                   </FadeIn>
               </div>

               {/* Main Content */}
               <div className="flex-1">
                   {/* Top Toolbar */}
                   <div className="flex flex-col md:flex-row items-center justify-between border-b border-gray-100 pb-6 mb-10 gap-4">
                       {/* Left: View Toggle & Count */}
                       <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
                           <div className="flex items-center gap-2 text-gray-400">
                               <button className="hover:text-black transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10 10H4v6h6v-6zm0-10H4v6h6V0zm0 20H4v4h6v-4zm10-10h-6v6h6v-6zm0-10h-6v6h6V0zm0 20h-6v4h6v-4z"/></svg></button>
                               <button className="hover:text-black transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/></svg></button>
                           </div>
                           <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">
                               {isLoading ? 'Loading...' : `${products.length} Product${products.length !== 1 ? 's' : ''}`} {query && `for "${query}"`}
                           </span>
                       </div>

                       {/* Right: Sort */}
                       <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase cursor-pointer hover:text-gray-500 transition-colors">
                           Sort By
                           <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor"><path d="M1 1L5 5L9 1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                       </div>
                   </div>

                   {/* Product Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-12 min-h-[400px]">
                      {isLoading ? (
                        <div className="col-span-full flex items-center justify-center py-20">
                          <Loader2 size={32} className="animate-spin text-primary" />
                        </div>
                      ) : isError ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                            <h3 className="text-xl font-bold mb-4">Failed to load products</h3>
                            <p className="text-gray-500 mb-8">Please try again later.</p>
                        </div>
                      ) : products.length > 0 ? (
                        products.map((product, idx) => (
                         <FadeIn key={product.id} delay={idx * 0.05} direction="up" className="h-full">
                            <div className="group flex flex-col h-full">
                              <Link href={`/shop/${product.id}`} className="block">
                                  {/* Image Container */}
                                  <div className="relative w-full aspect-[4/5] bg-gray-50 mb-6 overflow-hidden border-2 border-black">
                                    {product.images?.[0] ? (
                                      <Image 
                                        src={product.images[0]} 
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                                        placeholder="blur"
                                        blurDataURL={getBlurDataURL(700, 875)}
                                        priority={shouldPrioritize(idx, 6)}
                                        loading={shouldPrioritize(idx, 6) ? "eager" : "lazy"}
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                                        No Image
                                      </div>
                                    )}
                                    
                                    {/* Compare price = sale */}
                                    {product.compare_price && (
                                      <div className="absolute top-4 left-4 z-10">
                                        <Badge text="SALE" color="accent" />
                                      </div>
                                    )}
                                  </div>

                                  {/* Details */}
                                  <div className="w-full mt-auto text-center md:text-left">
                                    <div className="mb-2">
                                        <h3 className="text-xs font-bold tracking-widest uppercase mb-1">{product.name}</h3>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">{product.product_type || 'Skincare'}</p>
                                        <div className="flex items-center gap-2 justify-center md:justify-start">
                                          <span className="text-sm font-medium">{formatPrice(product.price)}</span>
                                          {product.compare_price && (
                                            <span className="text-xs text-gray-400 line-through">{formatPrice(product.compare_price)}</span>
                                          )}
                                        </div>
                                    </div>
                                  </div>
                              </Link>
                                
                                <div className="mt-4">
                                    <Button 
                                      onClick={() => addToCart({
                                        id: product.id,
                                        name: product.name,
                                        price: formatPrice(product.price),
                                        image: product.images?.[0] || '/placeholder.jpg'
                                      })}
                                      disabled={!product.in_stock}
                                      className="w-full rounded-none border-2 border-black text-[10px] py-3 !bg-transparent !text-black hover:!bg-black hover:!text-white transition-all duration-300 uppercase font-bold tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                       {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                                    </Button>
                                </div>
                            </div>
                         </FadeIn>
                      ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                            <h3 className="text-xl font-bold mb-4">No products found</h3>
                            <p className="text-gray-500 mb-8">
                              {query ? `We couldn't find any products matching "${query}".` : 'Try adjusting your filters.'}
                            </p>
                            {(query || hasActiveFilters) && (
                              <Button onClick={clearFilters}>Clear Filters</Button>
                            )}
                        </div>
                    )}
                   </div>
               </div>
           </div>
        </Container>
      </div>
      <Footer />
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Loader2 size={32} className="animate-spin" /></div>}>
      <ShopContent />
    </Suspense>
  );
}
