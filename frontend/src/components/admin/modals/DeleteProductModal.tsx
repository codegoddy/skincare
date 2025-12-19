"use client";

import React, { useEffect } from "react";
import { X, AlertTriangle, Trash2 } from "lucide-react";
import { Product } from "@/lib/api/products";

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onConfirm: () => void;
}

export default function DeleteProductModal({ isOpen, onClose, product, onConfirm }: DeleteProductModalProps) {
  
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
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-8 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} />
            </div>
            
            <h2 className="text-2xl font-serif font-bold text-primary mb-2">Delete Product?</h2>
            <p className="text-gray-500 text-sm mb-8">
                Are you sure you want to delete <span className="font-bold text-primary">{product.name}</span>? This action cannot be undone.
            </p>

            <div className="flex gap-4">
                <button 
                    onClick={onClose}
                    className="flex-1 py-3 bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                >
                    <Trash2 size={16} />
                    Delete
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
