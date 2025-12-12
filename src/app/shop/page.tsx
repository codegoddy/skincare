"use client";

import React from "react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useCart } from "@/context/CartContext";
import { allProducts } from "@/data/products";
import Link from "next/link";

export default function ShopPage() {
  const { addToCart } = useCart();
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
           <div className="hidden md:flex flex-wrap items-center justify-center gap-10 mb-16 text-xs font-bold tracking-widest uppercase border-y border-gray-100 py-5">
               {['Home', 'Shop', 'Brands', 'Skincare', 'Body', 'Hair Care', 'Fragrance', 'Make Up'].map(item => (
                   <span key={item} className="cursor-pointer hover:text-black hover:underline underline-offset-4 transition-all">{item}</span>
               ))}
           </div>

           <div className="flex flex-col md:flex-row gap-12">
               {/* Sidebar Filters */}
               <div className="w-full md:w-64 flex-shrink-0 space-y-6">
                   <div className="border-b border-gray-200 pb-2 mb-6 md:hidden">
                       <span className="font-bold">FILTERS</span>
                   </div>
                   
                   {['BY AVAILABILITY', 'BY SKIN TYPE', 'BY SKIN CONCERN', 'BY PRICE'].map((filter, i) => (
                       <FadeIn key={filter} delay={i * 0.1} direction="right">
                           <details className="group border-b border-gray-200 pb-4 cursor-pointer">
                               <summary className="flex items-center justify-between text-xs font-bold tracking-widest list-none uppercase select-none hover:text-gray-500 transition-colors">
                                   {filter}
                                   <span className="transform group-open:rotate-180 transition-transform duration-300">
                                       <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor"><path d="M1 1L5 5L9 1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                   </span>
                               </summary>
                               <div className="pt-4 space-y-2 text-sm text-gray-500">
                                   <label className="flex items-center gap-2 cursor-pointer hover:text-black transition-colors">
                                       <input type="checkbox" className="rounded-none border-gray-300 text-black focus:ring-0" /> Option 1
                                   </label>
                                   <label className="flex items-center gap-2 cursor-pointer hover:text-black transition-colors">
                                       <input type="checkbox" className="rounded-none border-gray-300 text-black focus:ring-0" /> Option 2
                                   </label>
                               </div>
                           </details>
                       </FadeIn>
                   ))}
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
                           <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">{allProducts.length} Products</span>
                       </div>

                       {/* Right: Sort */}
                       <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase cursor-pointer hover:text-gray-500 transition-colors">
                           Sort By
                           <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor"><path d="M1 1L5 5L9 1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                       </div>
                   </div>

                   {/* Product Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-12">
                      {allProducts.map((product, idx) => (
                         <FadeIn key={product.id} delay={idx * 0.1} direction="up" className="h-full">
                            <div className="group flex flex-col h-full">
                              <Link href={`/shop/${product.id}`} className="block">
                                  {/* Image Container */}
                                  <div className="relative w-full aspect-[4/5] bg-gray-50 flex items-center justify-center mb-6 overflow-visible border-2 border-black">
                                    <img 
                                      src={product.image} 
                                      alt={product.name} 
                                      className="h-48 w-auto object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                                    />
                                    
                                    {/* New Badge */}
                                    {product.isNew && (
                                      <div className="absolute -top-4 -right-4 z-10 transition-transform group-hover:rotate-12 scale-75">
                                        <Badge text="NEW" color="accent" />
                                      </div>
                                    )}
                                  </div>

                                  {/* Details */}
                                  <div className="w-full mt-auto text-center md:text-left">
                                    <div className="mb-2">
                                        <h3 className="text-xs font-bold tracking-widest uppercase mb-1">{product.name}</h3>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">{product.type}</p>
                                        <span className="text-sm font-medium block">{product.price}</span>
                                    </div>
                                  </div>
                              </Link>
                                
                                <div className="mt-4">
                                    <Button 
                                      onClick={() => addToCart({
                                        id: product.id,
                                        name: product.name,
                                        price: product.price,
                                        image: product.image
                                      })}
                                      className="w-full rounded-none border-2 border-black text-[10px] py-3 !bg-transparent !text-black hover:!bg-black hover:!text-white transition-all duration-300 uppercase font-bold tracking-widest"
                                    >
                                       Add to Cart
                                    </Button>
                                </div>
                            </div>
                         </FadeIn>
                      ))}
                   </div>
               </div>
           </div>
        </Container>
      </div>
      <Footer />
    </main>
  );
}
