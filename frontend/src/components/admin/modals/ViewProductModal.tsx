"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X, ExternalLink } from "lucide-react";
import { Product } from "@/lib/api/products";
import { useStoreConfig } from "@/context/StoreConfigContext";

interface ViewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

export default function ViewProductModal({ isOpen, onClose, product }: ViewProductModalProps) {
  const { formatPrice } = useStoreConfig();
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const getStockStatus = () => {
    if (!product.in_stock || product.stock === 0) return 'Out of Stock';
    if (product.stock < 10) return 'Low Stock';
    return 'In Stock';
  };

  const status = getStockStatus();

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 bg-white border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-serif font-bold text-primary">
              Product Details
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
              {product.product_type || 'No Type'}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-primary transition-colors"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Image Section */}
                <div className="w-full md:w-1/3">
                    <div className="aspect-square bg-gray-50 relative border border-gray-100 flex items-center justify-center overflow-hidden">
                         {product.images?.[0] ? (
                            <Image 
                              src={product.images[0]} 
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                         ) : (
                             <div className="text-gray-300">
                                 <div className="w-20 h-20 bg-gray-200 rounded-sm"></div>
                             </div>
                         )}
                    </div>
                    {product.images && product.images.length > 1 && (
                      <div className="flex gap-2 mt-2 overflow-x-auto">
                        {product.images.slice(1).map((img, idx) => (
                          <div key={idx} className="w-16 h-16 relative flex-shrink-0 border border-gray-200">
                            <Image src={img} alt={`${product.name} ${idx + 2}`} fill className="object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                </div>

                {/* Details Section */}
                <div className="w-full md:w-2/3 space-y-6">
                    <div>
                        {product.product_type && (
                          <span className="inline-block px-2 py-1 bg-accent text-primary text-[10px] font-bold uppercase tracking-widest mb-2">
                              {product.product_type}
                          </span>
                        )}
                        <h3 className="text-3xl font-serif font-bold text-primary mb-2">{product.name}</h3>
                        <div className="flex items-center gap-3">
                          <p className="text-xl font-medium text-gray-900">{formatPrice(product.price)}</p>
                          {product.compare_price && (
                            <p className="text-lg text-gray-400 line-through">{formatPrice(product.compare_price)}</p>
                          )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 py-6 border-y border-gray-100">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Stock Status</p>
                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 border text-[10px] font-bold uppercase tracking-widest w-fit
                                ${status === 'In Stock' ? 'text-green-700 border-green-200 bg-green-50/50' : 
                                  status === 'Low Stock' ? 'text-amber-700 border-amber-200 bg-amber-50/50' :
                                  'text-red-700 border-red-200 bg-red-50/50'
                                }`}>
                                {status}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Quantity</p>
                            <p className="font-medium text-primary">{product.stock} units</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Usage Time</p>
                            <p className="font-medium text-primary">{product.usage_time || 'Any'}</p>
                        </div>
                         <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Last Updated</p>
                            <p className="font-medium text-primary">{formatDate(product.updated_at)}</p>
                        </div>
                    </div>

                    {/* Categories */}
                    {(product.skin_concerns?.length > 0 || product.skin_types?.length > 0 || product.key_ingredients?.length > 0) && (
                      <div className="space-y-3">
                        {product.skin_concerns?.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Skin Concerns</p>
                            <div className="flex flex-wrap gap-1">
                              {product.skin_concerns.map(c => (
                                <span key={c} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs">{c}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {product.skin_types?.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Skin Types</p>
                            <div className="flex flex-wrap gap-1">
                              {product.skin_types.map(t => (
                                <span key={t} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs">{t}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {product.key_ingredients?.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Key Ingredients</p>
                            <div className="flex flex-wrap gap-1">
                              {product.key_ingredients.map(i => (
                                <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs">{i}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {product.description && (
                      <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Description</p>
                          <p className="text-gray-600 text-sm leading-relaxed">
                              {product.description}
                          </p>
                      </div>
                    )}
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 flex items-center justify-end px-8 py-6 bg-gray-50 border-t border-gray-100">
             <button 
               onClick={onClose}
               className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors"
             >
                Close
             </button>
        </div>
      </div>
    </div>
  );
}
