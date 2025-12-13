"use client";

import React, { useEffect } from "react";
import { X, ExternalLink } from "lucide-react";

interface ViewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
}

export default function ViewProductModal({ isOpen, onClose, product }: ViewProductModalProps) {
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

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
              View information for {product.sku}
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
                    <div className="aspect-square bg-gray-50 relative border border-gray-100 flex items-center justify-center">
                         {/* Placeholder for actual image logic */}
                         <div className="text-gray-300">
                             <div className="w-20 h-20 bg-gray-200 rounded-sm"></div>
                         </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="w-full md:w-2/3 space-y-6">
                    <div>
                        <span className="inline-block px-2 py-1 bg-accent text-primary text-[10px] font-bold uppercase tracking-widest mb-2">
                            {product.category}
                        </span>
                        <h3 className="text-3xl font-serif font-bold text-primary mb-2">{product.name}</h3>
                        <p className="text-xl font-medium text-gray-900">{product.price}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 py-6 border-y border-gray-100">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Stock Status</p>
                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 border text-[10px] font-bold uppercase tracking-widest w-fit
                                ${product.status === 'In Stock' ? 'text-green-700 border-green-200 bg-green-50/50' : 
                                  product.status === 'Low Stock' ? 'text-amber-700 border-amber-200 bg-amber-50/50' :
                                  'text-red-700 border-red-200 bg-red-50/50'
                                }`}>
                                {product.status}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Quantity</p>
                            <p className="font-medium text-primary">{product.stock} units</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">SKU</p>
                            <p className="font-medium text-primary font-mono text-sm">{product.sku}</p>
                        </div>
                         <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Last Updated</p>
                            <p className="font-medium text-primary">Oct 24, 2025</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Description</p>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            This is a placeholder description for the product. In a real application, this would contain the full detailed description of the item, including ingredients, usage instructions, and benefits.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 flex items-center justify-end px-8 py-6 bg-gray-50 border-t border-gray-100">
             <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors">
                Open in Store <ExternalLink size={14} />
             </button>
        </div>
      </div>
    </div>
  );
}
