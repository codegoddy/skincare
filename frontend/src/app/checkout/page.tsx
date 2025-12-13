"use client";

import React, { useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { cart, cartTotal } = useCart();
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [country, setCountry] = useState("United States");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const countries = ["United States", "Canada", "United Kingdom", "Australia"];

  const shippingCost = shippingMethod === "standard" ? 500 : 1500;
  const total = cartTotal + shippingCost;

  if (cart.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-white">
              <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
              <Link href="/shop">
                  <Button variant="outline" className="border-black hover:bg-black hover:text-white">Return to Shop</Button>
              </Link>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="flex flex-col lg:flex-row min-h-screen">
         
         {/* Left Column: Form */}
         <div className="flex-1 p-6 lg:p-12 xl:p-24 bg-white">
             <div className="max-w-xl mx-auto space-y-12">
                 {/* Header */}
                 <div className="flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold tracking-tight">ZEN<span className="font-light text-gray-400">GLOW</span></Link>
                    <Link href="/shop" className="text-xs font-bold text-gray-500 hover:text-black">Return to Shop</Link>
                 </div>

                 {/* Breadcrumbs */}
                 <div className="flex items-center gap-2 text-xs text-gray-500">
                     <span className="text-black font-bold">Information</span>
                     <svg width="6" height="10" viewBox="0 0 6 10" fill="none" stroke="currentColor"><path d="M1 9L5 5L1 1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                     <span>Shipping</span>
                     <svg width="6" height="10" viewBox="0 0 6 10" fill="none" stroke="currentColor"><path d="M1 9L5 5L1 1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                     <span>Payment</span>
                 </div>

                 {/* Contact Information */}
                 <section>
                     <h2 className="text-lg font-bold mb-4">Contact Information</h2>
                     <div className="space-y-4">
                         <input type="email" placeholder="Email address" className="w-full border border-gray-300 rounded-none focus:ring-black focus:border-black p-3 text-sm placeholder:text-gray-400" />
                         <div className="flex items-center gap-2">
                             <input type="checkbox" id="newsletter" className="rounded border-gray-300 text-black focus:ring-black" />
                             <label htmlFor="newsletter" className="text-xs text-gray-600">Email me with news and offers</label>
                         </div>
                     </div>
                 </section>

                 {/* Shipping Address */}
                 <section>
                     <h2 className="text-lg font-bold mb-4">Shipping Address</h2>
                     <div className="space-y-4 grid grid-cols-2 gap-4">
                         <div className="relative col-span-2">
                             <div 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full border border-gray-300 p-3 text-sm bg-white cursor-pointer flex justify-between items-center"
                             >
                                 {country}
                                 <svg 
                                    width="10" 
                                    height="6" 
                                    viewBox="0 0 10 6" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                 >
                                    <path d="M1 1L5 5L9 1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                 </svg>
                             </div>
                             
                             {isDropdownOpen && (
                                 <div className="absolute top-full left-0 w-full bg-white border border-gray-300 border-t-0 z-10 max-h-48 overflow-y-auto">
                                     {countries.map((c) => (
                                         <div 
                                            key={c}
                                            onClick={() => {
                                                setCountry(c);
                                                setIsDropdownOpen(false);
                                            }}
                                            className="p-3 text-sm hover:bg-gray-50 cursor-pointer"
                                         >
                                             {c}
                                         </div>
                                     ))}
                                 </div>
                             )}
                         </div>
                         <input type="text" placeholder="First name" className="border border-gray-300 rounded-none focus:ring-black focus:border-black p-3 text-sm placeholder:text-gray-400" />
                         <input type="text" placeholder="Last name" className="border border-gray-300 rounded-none focus:ring-black focus:border-black p-3 text-sm placeholder:text-gray-400" />
                         <input type="text" placeholder="Address" className="col-span-2 border border-gray-300 rounded-none focus:ring-black focus:border-black p-3 text-sm placeholder:text-gray-400" />
                         <input type="text" placeholder="Apartment, suite, etc. (optional)" className="col-span-2 border border-gray-300 rounded-none focus:ring-black focus:border-black p-3 text-sm placeholder:text-gray-400" />
                         <input type="text" placeholder="City" className="border border-gray-300 rounded-none focus:ring-black focus:border-black p-3 text-sm placeholder:text-gray-400" />
                         <input type="text" placeholder="Postal code" className="border border-gray-300 rounded-none focus:ring-black focus:border-black p-3 text-sm placeholder:text-gray-400" />
                         <input type="text" placeholder="Phone" className="col-span-2 border border-gray-300 rounded-none focus:ring-black focus:border-black p-3 text-sm placeholder:text-gray-400" />
                         <div className="col-span-2 flex items-center gap-2">
                             <input type="checkbox" id="save-info" className="rounded border-gray-300 text-black focus:ring-black" />
                             <label htmlFor="save-info" className="text-xs text-gray-600">Save this information for next time</label>
                         </div>
                     </div>
                 </section>
                 
                 <div className="flex items-center justify-between pt-6">
                     <Link href="/shop" className="text-sm text-gray-500 hover:text-black flex items-center gap-2">
                        <svg width="6" height="10" viewBox="0 0 6 10" fill="none" stroke="currentColor" className="rotate-180"><path d="M1 9L5 5L1 1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Return to shop
                     </Link>
                     <Button className="px-8 py-4 bg-black text-white hover:bg-gray-800 rounded-none text-sm font-bold uppercase tracking-widest">
                         Continue to Shipping
                     </Button>
                 </div>
             </div>
         </div>

         {/* Right Column: Summary */}
         <div className="flex-1 bg-gray-50 p-6 lg:p-12 xl:p-24 border-l border-gray-200">
             <div className="max-w-lg mx-auto sticky top-12">
                 {/* Items */}
                 <div className="space-y-4 border-b border-gray-200 pb-6 mb-6">
                     {cart.map((item) => (
                         <div key={item.id} className="flex items-center gap-4">
                             <div className="relative h-16 w-16 bg-white border border-gray-200 rounded-md flex items-center justify-center p-1">
                                 <img src={item.image} alt={item.name} className="h-full w-full object-contain mix-blend-multiply" />
                                 <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] h-5 w-5 flex items-center justify-center rounded-full font-bold shadow-sm">
                                     {item.quantity}
                                 </span>
                             </div>
                             <div className="flex-1">
                                 <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                             </div>
                             <span className="text-sm font-medium text-gray-900">{item.price}</span>
                         </div>
                     ))}
                 </div>

                 {/* Totals */}
                 <div className="space-y-4 border-b border-gray-200 pb-6 mb-6 text-sm text-gray-600">
                     <div className="flex justify-between">
                         <span>Subtotal</span>
                         <span className="font-medium text-gray-900">KSh {cartTotal.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between">
                         <span className="flex items-center gap-2">
                             Shipping 
                             <div className="group relative">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 cursor-help"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                             </div>
                         </span>
                         <span className="font-medium text-gray-900">KSh {shippingCost.toLocaleString()}</span>
                     </div>
                 </div>

                 <div className="flex justify-between items-center">
                     <span className="text-lg font-bold text-gray-900">Total</span>
                     <div className="text-right">
                         <span className="text-xs text-gray-500 mr-2">KSh</span>
                         <span className="text-2xl font-bold text-gray-900">{total.toLocaleString()}</span>
                     </div>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
}
