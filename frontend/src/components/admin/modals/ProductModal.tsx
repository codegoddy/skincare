"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, Upload, Save, Loader2, Plus } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";
import { useStoreConfig } from "@/context/StoreConfigContext";
import { useCreateProduct, useUpdateProduct, useUploadProductImage } from "@/hooks/useProducts";
import { Product, ProductCreate, ProductUpdate } from "@/lib/api/products";

// Category options
const PRODUCT_TYPES = [
  { label: 'Cleanser', value: 'Cleanser' },
  { label: 'Moisturizer', value: 'Moisturizer' },
  { label: 'Serum', value: 'Serum' },
  { label: 'Toner', value: 'Toner' },
  { label: 'Mask', value: 'Mask' },
  { label: 'Sunscreen', value: 'Sunscreen' },
  { label: 'Eye Care', value: 'Eye Care' },
  { label: 'Treatment', value: 'Treatment' },
];

const SKIN_CONCERNS = [
  'Acne', 'Aging', 'Dryness', 'Oiliness', 
  'Sensitivity', 'Hyperpigmentation', 'Pores'
];

const SKIN_TYPES = ['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive'];

const KEY_INGREDIENTS = [
  'Hyaluronic Acid', 'Vitamin C', 'Retinol', 'Niacinamide',
  'Salicylic Acid', 'AHA/BHA', 'Peptides', 'Ceramides'
];

const USAGE_TIMES = [
  { label: 'Morning', value: 'Morning' },
  { label: 'Evening', value: 'Evening' },
  { label: 'Both', value: 'Both' },
];

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

export default function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const { currencySymbol } = useStoreConfig();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const uploadMutation = useUploadProductImage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compare_price: '',
    product_type: '',
    usage_time: '',
    stock: '0',
    in_stock: true,
    is_active: true,
  });
  const [images, setImages] = useState<string[]>([]);
  const [skinConcerns, setSkinConcerns] = useState<string[]>([]);
  const [skinTypes, setSkinTypes] = useState<string[]>([]);
  const [keyIngredients, setKeyIngredients] = useState<string[]>([]);

  // Reset form when modal opens/changes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (product) {
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price?.toString() || '',
          compare_price: product.compare_price?.toString() || '',
          product_type: product.product_type || '',
          usage_time: product.usage_time || '',
          stock: product.stock?.toString() || '0',
          in_stock: product.in_stock ?? true,
          is_active: product.is_active ?? true,
        });
        setImages(product.images || []);
        setSkinConcerns(product.skin_concerns || []);
        setSkinTypes(product.skin_types || []);
        setKeyIngredients(product.key_ingredients || []);
      } else {
        // Reset to defaults
        setFormData({
          name: '',
          description: '',
          price: '',
          compare_price: '',
          product_type: '',
          usage_time: '',
          stock: '0',
          in_stock: true,
          is_active: true,
        });
        setImages([]);
        setSkinConcerns([]);
        setSkinTypes([]);
        setKeyIngredients([]);
      }
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    for (const file of Array.from(files)) {
      try {
        const result = await uploadMutation.mutateAsync(file);
        setImages(prev => [...prev, result.url]);
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleArrayItem = (array: string[], setArray: (arr: string[]) => void, item: string) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  const handleSubmit = async () => {
    const data = {
      name: formData.name,
      description: formData.description || undefined,
      price: parseFloat(formData.price) || 0,
      compare_price: formData.compare_price ? parseFloat(formData.compare_price) : undefined,
      images,
      product_type: formData.product_type || undefined,
      skin_concerns: skinConcerns,
      skin_types: skinTypes,
      key_ingredients: keyIngredients,
      usage_time: formData.usage_time || undefined,
      stock: parseInt(formData.stock) || 0,
      in_stock: formData.in_stock,
      is_active: formData.is_active,
    };

    try {
      if (product) {
        await updateMutation.mutateAsync({ productId: product.id, data: data as ProductUpdate });
      } else {
        await createMutation.mutateAsync(data as ProductCreate);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

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
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Product Name *</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary focus:bg-white transition-colors text-sm font-medium placeholder:text-gray-400" 
                        placeholder="e.g. Radiant Glow Serum" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Description</label>
                      <textarea 
                        rows={4} 
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary focus:bg-white transition-colors text-sm font-medium placeholder:text-gray-400 resize-none" 
                        placeholder="Product description..."
                      ></textarea>
                    </div>
                 </div>

                 {/* Media */}
                 <div className="space-y-4 pt-4">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Media</h3>
                        <input 
                          ref={fileInputRef}
                          type="file" 
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <button 
                          type="button" 
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadMutation.isPending}
                          className="text-xs font-bold text-primary hover:text-accent uppercase tracking-wide flex items-center gap-1 disabled:opacity-50"
                        >
                          {uploadMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                          Upload Image
                        </button>
                    </div>
                    
                    <div 
                      className="border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-white cursor-pointer transition-all group"
                      onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="w-12 h-12 bg-white border border-gray-200 flex items-center justify-center mb-3 text-gray-400 group-hover:text-primary group-hover:border-primary transition-colors">
                            <Upload size={20} />
                        </div>
                        <p className="text-sm font-medium text-primary">Click to upload images</p>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">Images uploaded to Cloudinary</p>
                    </div>

                    {images.length > 0 && (
                        <div className="flex gap-4 overflow-x-auto py-2">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative w-24 h-24 border border-gray-200 bg-gray-100 flex-shrink-0 group cursor-pointer">
                                    <Image src={img} alt="Product" fill className="object-cover" />
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

                 {/* Categories Section */}
                 <div className="space-y-4 pt-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-primary border-b border-gray-100 pb-2 mb-4">Categories & Filters</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <CustomSelect 
                          label="Product Type"
                          placeholder="Select Type"
                          options={PRODUCT_TYPES}
                          value={formData.product_type}
                          onChange={(val) => handleChange('product_type', val)}
                      />

                      <CustomSelect 
                          label="Usage Time"
                          placeholder="Select Time"
                          options={USAGE_TIMES}
                          value={formData.usage_time}
                          onChange={(val) => handleChange('usage_time', val)}
                      />
                    </div>

                    {/* Skin Concerns */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Skin Concerns</label>
                      <div className="flex flex-wrap gap-2">
                        {SKIN_CONCERNS.map(concern => (
                          <button
                            key={concern}
                            type="button"
                            onClick={() => toggleArrayItem(skinConcerns, setSkinConcerns, concern)}
                            className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                              skinConcerns.includes(concern)
                                ? 'bg-primary text-white border-primary'
                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-primary'
                            }`}
                          >
                            {concern}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Skin Types */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Skin Types</label>
                      <div className="flex flex-wrap gap-2">
                        {SKIN_TYPES.map(type => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => toggleArrayItem(skinTypes, setSkinTypes, type)}
                            className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                              skinTypes.includes(type)
                                ? 'bg-primary text-white border-primary'
                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-primary'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Key Ingredients */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Key Ingredients</label>
                      <div className="flex flex-wrap gap-2">
                        {KEY_INGREDIENTS.map(ingredient => (
                          <button
                            key={ingredient}
                            type="button"
                            onClick={() => toggleArrayItem(keyIngredients, setKeyIngredients, ingredient)}
                            className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                              keyIngredients.includes(ingredient)
                                ? 'bg-primary text-white border-primary'
                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-primary'
                            }`}
                          >
                            {ingredient}
                          </button>
                        ))}
                      </div>
                    </div>
                 </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                 {/* Pricing */}
                 <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-primary border-b border-gray-100 pb-2 mb-4">Pricing</h3>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Price *</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-serif">{currencySymbol}</span>
                        <input 
                          type="number" 
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => handleChange('price', e.target.value)}
                          className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary focus:bg-white transition-colors text-sm font-medium placeholder:text-gray-400" 
                          placeholder="0.00" 
                        />
                      </div>
                    </div>

                     <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Compare at Price</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-serif">{currencySymbol}</span>
                        <input 
                          type="number" 
                          step="0.01"
                          value={formData.compare_price}
                          onChange={(e) => handleChange('compare_price', e.target.value)}
                          className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary focus:bg-white transition-colors text-sm font-medium placeholder:text-gray-400" 
                          placeholder="0.00" 
                        />
                      </div>
                    </div>
                 </div>

                 {/* Inventory */}
                 <div className="space-y-4 pt-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-primary border-b border-gray-100 pb-2 mb-4">Inventory</h3>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Stock Quantity</label>
                      <input 
                        type="number" 
                        value={formData.stock}
                        onChange={(e) => handleChange('stock', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary focus:bg-white transition-colors text-sm font-medium placeholder:text-gray-400" 
                        placeholder="0" 
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox"
                        id="in_stock"
                        checked={formData.in_stock}
                        onChange={(e) => handleChange('in_stock', e.target.checked)}
                        className="w-4 h-4 accent-primary"
                      />
                      <label htmlFor="in_stock" className="text-sm text-gray-600">In Stock</label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) => handleChange('is_active', e.target.checked)}
                        className="w-4 h-4 accent-primary"
                      />
                      <label htmlFor="is_active" className="text-sm text-gray-600">Active (visible in store)</label>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-4 px-8 py-6 bg-gray-50 border-t border-gray-100">
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-primary transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isLoading || !formData.name || !formData.price}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-colors shadow-lg shadow-black/5 disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {product ? 'Update Product' : 'Save Product'}
          </button>
        </div>

      </div>
    </div>
  );
}
