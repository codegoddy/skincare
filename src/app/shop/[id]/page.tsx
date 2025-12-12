"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import { useCart } from "@/context/CartContext";
import { allProducts } from "@/data/products";
import Link from "next/link";

export default function ProductPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const product = allProducts.find((p) => p.id === Number(params.id));

  if (!product) {
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

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    // Add item 'quantity' times
    for (let i = 0; i < quantity; i++) {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image
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
                <div className="aspect-[4/5] bg-gray-50 flex items-center justify-center border-2 border-black md:sticky md:top-32">
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-3/4 w-auto object-contain mix-blend-multiply"
                    />
                </div>
              </FadeIn>

              {/* Right: Details */}
              <FadeIn direction="left" delay={0.2}>
                  <div>
                      <h1 className="text-3xl md:text-5xl font-medium leading-tight mb-4">{product.name}</h1>
                      <div className="text-2xl font-bold mb-8">{product.price}</div>
                      
                      <div className="prose prose-sm text-gray-500 mb-8 max-w-none">
                          <p>{product.description}</p>
                      </div>

                      {/* Quantity & Add */}
                      <div className="flex flex-col sm:flex-row gap-4 mb-12 border-b border-gray-100 pb-12">
                          <div className="flex items-center border-2 border-black h-12 w-32">
                              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center hover:bg-gray-100 text-lg">-</button>
                              <div className="flex-1 h-full flex items-center justify-center font-bold">{quantity}</div>
                              <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full flex items-center justify-center hover:bg-gray-100 text-lg">+</button>
                          </div>
                          <Button onClick={handleAddToCart} className="flex-1 h-12 rounded-none bg-black text-white hover:bg-accent hover:text-black transition-colors uppercase font-bold tracking-widest">
                              Add to Cart
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
                                        {tab === 'ingredients' && "Aqua, Glycerin, Niacinamide, Butylene Glycol, Caprylic/Capric Triglyceride, ... (Mock ingredients list)"}
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
           <div className="border-t border-gray-100 pt-20">
               <h2 className="text-2xl font-serif italic text-center mb-12">You Might Also Like</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {relatedProducts.map((p, i) => (
                       <FadeIn key={p.id} delay={i * 0.1} direction="up">
                           <Link href={`/shop/${p.id}`} className="group block">
                               <div className="aspect-square bg-gray-50 mb-4 flex items-center justify-center border border-gray-100 group-hover:border-black transition-colors">
                                   <img src={p.image} alt={p.name} className="h-40 object-contain mix-blend-multiply transition-transform group-hover:scale-110" />
                               </div>
                               <h3 className="text-xs font-bold uppercase tracking-widest mb-1">{p.name}</h3>
                               <p className="text-sm text-gray-500">{p.price}</p>
                           </Link>
                       </FadeIn>
                   ))}
               </div>
           </div>
        </Container>
      </div>
      <Footer />
    </main>
  );
}
