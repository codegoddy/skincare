"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import Button from "@/components/ui/Button";

export default function CartDrawer() {
  const { isCartOpen, toggleCart, cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[70] shadow-2xl transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
         
         {/* Cart Header */}
         <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">YOUR CART</h2>
            <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
         </div>

         {/* Cart Items */}
         <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    </div>
                    <div>
                        <p className="text-lg font-medium text-gray-900">Your cart is empty</p>
                        <p className="text-sm text-gray-500">Looks like you haven't added anything yet.</p>
                    </div>
                    <Button onClick={toggleCart} variant="outline" className="mt-4 border-black hover:bg-black hover:text-white">
                        Start Shopping
                    </Button>
                </div>
            ) : (
                cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                        <div className="relative h-24 w-24 bg-gray-50 flex-shrink-0 border border-gray-100 flex items-center justify-center p-2">
                            <Image 
                              src={item.image} 
                              alt={item.name} 
                              fill
                              sizes="96px"
                              className="object-contain mix-blend-multiply p-2"
                            />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                                <div className="flex justify-between items-start">
                                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2">{item.name}</h3>
                                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{item.price}</p>
                            </div>
                            <div className="flex justify-between items-end">
                                <div className="flex items-center border border-gray-200">
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-gray-500 hover:bg-gray-50">-</button>
                                    <span className="text-xs font-bold px-2">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-gray-500 hover:bg-gray-50">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
         </div>

         {/* Footer */}
         {cart.length > 0 && (
             <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-gray-500">Subtotal</span>
                    <span className="text-xl font-bold tracking-tight">KSh {cartTotal.toLocaleString()}</span>
                </div>
                <p className="text-xs text-center text-gray-400 mb-6">Tax included. Shipping calculated at checkout.</p>
                <Link href="/checkout" onClick={toggleCart} className="block w-full">
                    <Button className="w-full rounded-none border-2 border-black !bg-transparent !text-black hover:!bg-black hover:!text-white transition-all duration-300 py-4 text-sm font-bold tracking-widest uppercase">
                        Checkout
                    </Button>
                </Link>
             </div>
         )}
      </div>
    </>
  );
}
