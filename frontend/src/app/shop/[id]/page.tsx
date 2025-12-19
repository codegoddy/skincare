"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import { useCart } from "@/context/CartContext";
import { useStoreConfig } from "@/context/StoreConfigContext";
import { useProduct, useProducts } from "@/hooks/useProducts";
import Link from "next/link";
import Image from "next/image";
import { getBlurDataURL } from "@/lib/imageUtils";
import { Loader2 } from "lucide-react";

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const { addToCart } = useCart();
  const { formatPrice } = useStoreConfig();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const { data: product, isLoading, isError } = useProduct(productId);
  
  // Fetch related products (same type)
  const { data: relatedData } = useProducts({
    product_type: product?.product_type,
    page_size: 4,
  });
  
  const relatedProducts = relatedData?.products
    ?.filter((p) => p.id !== productId)
    .slice(0, 3) || [];

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col bg-white">
        <Header />
        <div className="pt-32 pb-20 flex-1 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
        <Footer />
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="flex min-h-screen flex-col bg-white">
        <Header />
        <div className="pt-32 pb-20 flex-1 flex items-center justify-center">
          <Container>
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
              <Link href="/shop">
                <Button>Return to Shop</Button>
              </Link>
            </div>
          </Container>
        </div>
        <Footer />
      </main>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
        addToCart({
            id: product.id,
            name: product.name,
            price: formatPrice(product.price),
            image: product.images?.[0] || '/placeholder.jpg'
        });
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Header />
      <div className="pt-32 pb-20">
        <Container>
           {/* Breadcrumbs */}
           <div className="text-xs uppercase tracking-widest text-gray-400 mb-12">
             <Link href="/" className="hover:text-black transition-colors">Home</Link> / <Link href="/shop" className="hover:text-black transition-colors">Shop</Link> / <span className="text-black font-bold">{product.name}</span>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-32">
              {/* Left: Image */}
              <FadeIn direction="right">
                <div className="aspect-[4/5] bg-gray-50 flex items-center justify-center border-2 border-black md:sticky md:top-32 overflow-hidden">
                    <div className="relative w-full h-full">
                    {product.images?.[0] ? (
                      <Image 
                          src={product.images[0]} 
                          alt={product.name}
                          fill
                          priority
                          loading="eager"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-contain p-8 mix-blend-multiply"
                          placeholder="blur"
                          blurDataURL={getBlurDataURL(800, 1000)}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-lg">No Image</div>
                    )}
                    </div>
                </div>
                {/* Thumbnail gallery */}
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-2 mt-4">
                    {product.images.map((img, idx) => (
                      <div key={idx} className="relative w-20 h-20 border border-gray-200 overflow-hidden">
                        <Image 
                          src={img} 
                          alt={`${product.name} ${idx + 1}`} 
                          fill 
                          className="object-cover"
                          placeholder="blur"
                          blurDataURL={getBlurDataURL(200, 200)}
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </FadeIn>

              {/* Right: Details */}
              <FadeIn direction="left" delay={0.2}>
                  <div>
                      <h1 className="text-3xl md:text-5xl font-medium leading-tight mb-4">{product.name}</h1>
                      <div className="flex items-center gap-3 mb-8">
                        <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
                        {product.compare_price && (
                          <span className="text-lg text-gray-400 line-through">{formatPrice(product.compare_price)}</span>
                        )}
                      </div>
                      
                      {product.description && (
                        <div className="prose prose-sm text-gray-500 mb-8 max-w-none">
                            <p>{product.description}</p>
                        </div>
                      )}

                      {/* Categories */}
                      <div className="flex flex-wrap gap-2 mb-8">
                        {product.product_type && (
                          <span className="px-3 py-1 bg-gray-100 text-xs font-medium uppercase tracking-wide">{product.product_type}</span>
                        )}
                        {product.usage_time && (
                          <span className="px-3 py-1 bg-accent text-primary text-xs font-medium uppercase tracking-wide">{product.usage_time}</span>
                        )}
                        {product.skin_types?.map(t => (
                          <span key={t} className="px-3 py-1 bg-gray-50 text-gray-600 text-xs">{t}</span>
                        ))}
                      </div>

                      {/* Quantity & Add */}
                      <div className="flex flex-col sm:flex-row gap-4 mb-12 border-b border-gray-100 pb-12">
                          <div className="flex items-center border-2 border-black h-12 w-32">
                              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center hover:bg-gray-100 text-lg">-</button>
                              <div className="flex-1 h-full flex items-center justify-center font-bold">{quantity}</div>
                              <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full flex items-center justify-center hover:bg-gray-100 text-lg">+</button>
                          </div>
                          <Button 
                            onClick={handleAddToCart} 
                            disabled={!product.in_stock}
                            className="flex-1 h-12 rounded-none bg-black text-white hover:bg-accent hover:text-black transition-colors uppercase font-bold tracking-widest disabled:opacity-50"
                          >
                              {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                          </Button>
                      </div>

                      {/* Tabs/Accordion */}
                      <div className="space-y-4">
                          {['description', 'ingredients', 'how to use'].map((tab) => (
                              <div key={tab} className="border-b border-gray-200">
                                  <button 
                                    onClick={() => setActiveTab(activeTab === tab ? '' : tab)}
                                    className="flex w-full justify-between items-center py-4 text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors"
                                  >
                                      {tab}
                                      <span className="text-xl">{activeTab === tab ? '-' : '+'}</span>
                                  </button>
                                  <div className={`overflow-hidden transition-all duration-300 ${activeTab === tab ? 'max-h-40 mb-4' : 'max-h-0'}`}>
                                      <p className="text-sm text-gray-500 leading-relaxed">
                                        {tab === 'description' && product.description}
                                        {tab === 'ingredients' && (product.key_ingredients?.length ? product.key_ingredients.join(', ') : 'Ingredients information not available.')}
                                        {tab === 'how to use' && "Apply a small amount to clean skin morning and night. Massage gently until fully absorbed."}
                                      </p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </FadeIn>
           </div>

           {/* Related Products */}
           {relatedProducts.length > 0 && (
             <div className="border-t border-gray-100 pt-20">
                 <h2 className="text-2xl font-serif italic text-center mb-12">You Might Also Like</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {relatedProducts.map((p, i) => (
                         <FadeIn key={p.id} delay={i * 0.1} direction="up">
                             <Link href={`/shop/${p.id}`} className="group block">
                                 <div className="relative aspect-square bg-gray-50 mb-4 flex items-center justify-center border border-gray-100 group-hover:border-black transition-colors overflow-hidden">
                                     {p.images?.[0] ? (
                                       <Image 
                                         src={p.images[0]} 
                                         alt={p.name} 
                                         fill
                                         sizes="(max-width: 768px) 100vw, 33vw"
                                         className="object-contain p-4 mix-blend-multiply transition-transform group-hover:scale-110"
                                         placeholder="blur"
                                         blurDataURL={getBlurDataURL(400, 500)}
                                         loading="lazy"
                                       />
                                     ) : (
                                       <div className="text-gray-300">No Image</div>
                                     )}
                                 </div>
                                 <h3 className="text-xs font-bold uppercase tracking-widest mb-1">{p.name}</h3>
                                 <p className="text-sm text-gray-500">{formatPrice(p.price)}</p>
                             </Link>
                         </FadeIn>
                     ))}
                 </div>
             </div>
           )}
        </Container>
      </div>
      <Footer />
    </main>
  );
}
