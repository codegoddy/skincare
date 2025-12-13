"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, Save } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
}

export default function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const [images, setImages] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("In Stock");

  // Prevent scroll when modal is open and reset/sync state
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCategory(product?.category || "");
      setStatus(product?.status || "In Stock");
      // Reset images or set from product if we had real data
      if (!product) setImages([]); 
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  const handleImageUpload = () => {
    // Mock image for now
    setImages([...images, "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200&h=200"]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 bg-white border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-serif font-bold text-primary">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
              Enter product details below
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-primary transition-colors"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-8">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                 {/* Basic Info */}
                 <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-primary border-b border-gray-100 pb-2 mb-4">Basic Information</h3>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Product Name</label>
                      <input 
                        type="text" 
                        defaultValue={product?.name}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary focus:bg-white transition-colors text-sm font-medium placeholder:text-gray-400" 
                        placeholder="e.g. Radiant Glow Serum" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Description</label>
                      <textarea 
                        rows={5} 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary focus:bg-white transition-colors text-sm font-medium placeholder:text-gray-400 resize-none" 
                        placeholder="Product description..."
                      ></textarea>
                    </div>
                 </div>

                 {/* Media */}
                 <div className="space-y-4 pt-4">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Media</h3>
                        <button type="button" onClick={handleImageUpload} className="text-xs font-bold text-primary hover:text-accent uppercase tracking-wide flex items-center gap-1">
                          <Upload size={14} /> Upload Image
                        </button>
                    </div>
                    
                    <div 
                      className="border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-white cursor-pointer transition-all group"
                      onClick={handleImageUpload}
                    >
                        <div className="w-12 h-12 bg-white border border-gray-200 flex items-center justify-center mb-3 text-gray-400 group-hover:text-primary group-hover:border-primary transition-colors">
                            <Upload size={20} />
                        </div>
                        <p className="text-sm font-medium text-primary">Click to upload media</p>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                    </div>

                    {images.length > 0 && (
                        <div className="flex gap-4 overflow-x-auto py-2">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative w-24 h-24 border border-gray-200 bg-gray-100 flex-shrink-0 group cursor-pointer">
                                    <img src={img} alt="Product" className="w-full h-full object-cover" />
                                    <button 
                                      onClick={(e) => {e.stopPropagation(); removeImage(idx);}} 
                                      className="absolute top-0 right-0 bg-primary/90 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                 </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                 {/* Pricing */}
                 <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-primary border-b border-gray-100 pb-2 mb-4">Pricing</h3>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Base Price</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-serif">$</span>
                        <input 
                          type="number" 
                          defaultValue={product?.price?.replace('$', '')}
                          className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary focus:bg-white transition-colors text-sm font-medium placeholder:text-gray-400" 
                          placeholder="0.00" 
                        />
                      </div>
                    </div>

                     <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Discount Price</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-serif">$</span>
                        <input 
                          type="number" 
                          className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary focus:bg-white transition-colors text-sm font-medium placeholder:text-gray-400" 
                          placeholder="0.00" 
                        />
                      </div>
                    </div>
                 </div>

                 {/* Organization */}
                 <div className="space-y-4 pt-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-primary border-b border-gray-100 pb-2 mb-4">Organization</h3>
                    
                    <CustomSelect 
                        label="Category"
                        placeholder="Select Category"
                        options={[
                            { label: 'Serums', value: 'Serums' },
                            { label: 'Moisturizers', value: 'Moisturizers' },
                            { label: 'Cleansers', value: 'Cleansers' },
                            { label: 'Toners', value: 'Toners' },
                        ]}
                        value={category}
                        onChange={setCategory}
                    />

                    <CustomSelect 
                        label="Stock Status"
                        options={[
                            { label: 'In Stock', value: 'In Stock' },
                            { label: 'Low Stock', value: 'Low Stock' },
                            { label: 'Out of Stock', value: 'Out of Stock' },
                        ]}
                        value={status}
                        onChange={setStatus}
                    />

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">SKU</label>
                      <input 
                        type="text" 
                        defaultValue={product?.sku}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary focus:bg-white transition-colors text-sm font-medium placeholder:text-gray-400" 
                        placeholder="e.g. SKU-001" 
                      />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-4 px-8 py-6 bg-gray-50 border-t border-gray-100">
          <button 
            onClick={onClose}
            className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-primary transition-colors"
          >
            Cancel
          </button>
          <button className="flex items-center gap-2 px-8 py-3 bg-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-colors shadow-lg shadow-black/5">
            <Save size={16} />
            Save Product
          </button>
        </div>

      </div>
    </div>
  );
}
