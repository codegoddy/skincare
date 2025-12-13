"use client";

import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import ProductModal from '@/components/admin/modals/ProductModal';
import DeleteProductModal from '@/components/admin/modals/DeleteProductModal';
import ViewProductModal from '@/components/admin/modals/ViewProductModal';

const products = [
    { id: 1, name: 'Radiant Glow Serum', price: '$45.00', category: 'Serums', stock: 124, status: 'In Stock', sku: 'SKU-001' },
    { id: 2, name: 'Hydrating Night Cream', price: '$55.00', category: 'Moisturizers', stock: 45, status: 'Low Stock', sku: 'SKU-002' },
    { id: 3, name: 'Vitamin C Cleanser', price: '$28.00', category: 'Cleansers', stock: 0, status: 'Out of Stock', sku: 'SKU-003' },
    { id: 4, name: 'Rose Water Toner', price: '$32.00', category: 'Toners', stock: 89, status: 'In Stock', sku: 'SKU-004' },
    { id: 5, name: 'Exfoliating Scrub', price: '$38.00', category: 'Exfoliants', stock: 12, status: 'Low Stock', sku: 'SKU-005' },
];

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const openAddModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const openDeleteModal = (product: any) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const openViewModal = (product: any) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const handleDelete = () => {
    // Implement delete logic here
    console.log("Deleting product:", selectedProduct?.name);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="space-y-8">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Products</h1>
          <p className="text-gray-500 text-sm mt-1 tracking-wide">Manage your product catalog.</p>
        </div>
        <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-primary text-white border border-primary px-6 py-2 hover:bg-white hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest cursor-pointer"
        >
            <Plus size={16} />
            Add Product
        </button>
      </div>

       {/* Filters & Search */}
       <div className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 bg-gray-50/30">
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                    type="text" 
                    placeholder="SEARCH PRODUCTS..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-white focus:outline-none focus:border-primary text-sm transition-colors placeholder:text-gray-400 font-medium"
                />
            </div>
             <button className="flex items-center gap-2 px-6 py-2 border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:text-primary hover:border-primary transition-colors uppercase tracking-widest">
                <Filter size={16} />
                Filters
            </button>
       </div>

       {/* Products Table (Desktop) */}
       <div className="border border-gray-100 hidden md:block">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-[10px] text-gray-400 uppercase tracking-widest bg-gray-50 border-b border-gray-100">
                    <tr>
                         <th className="px-6 py-4 font-medium">Product</th>
                         <th className="px-6 py-4 font-medium">Category</th>
                         <th className="px-6 py-4 font-medium">Price</th>
                         <th className="px-6 py-4 font-medium">Stock</th>
                         <th className="px-6 py-4 font-medium">Status</th>
                         <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-100 flex items-center justify-center text-gray-300">
                                        <div className="w-full h-full bg-gray-200"></div>
                                    </div>
                                    <div>
                                        <div className="font-serif font-bold text-primary">{product.name}</div>
                                        <div className="text-[10px] text-gray-400 uppercase tracking-wide">{product.sku}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-500 uppercase text-xs tracking-wide">{product.category}</td>
                            <td className="px-6 py-4 font-medium text-primary">{product.price}</td>
                            <td className="px-6 py-4 text-gray-500">{product.stock}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 border text-[10px] font-bold uppercase tracking-widest
                                    ${product.status === 'In Stock' ? 'text-green-700 border-green-200 bg-green-50/50' : 
                                      product.status === 'Low Stock' ? 'text-amber-700 border-amber-200 bg-amber-50/50' :
                                      'text-red-700 border-red-200 bg-red-50/50'
                                    }`}>
                                    {product.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => openViewModal(product)}
                                        className="p-2 text-gray-400 hover:text-primary transition-colors" 
                                        title="View"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button 
                                        onClick={() => openEditModal(product)}
                                        className="p-2 text-gray-400 hover:text-primary transition-colors" 
                                        title="Edit"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button 
                                        onClick={() => openDeleteModal(product)}
                                        className="p-2 text-gray-400 hover:text-red-600 transition-colors" 
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
       </div>

       {/* Mobile Card View */}
       <div className="space-y-4 md:hidden">
            {products.map((product) => (
                <div key={product.id} className="bg-white border border-gray-100 p-4 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-300">
                                <div className="w-full h-full bg-gray-200"></div>
                            </div>
                            <div>
                                <h3 className="font-serif font-bold text-primary">{product.name}</h3>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wide">{product.sku}</p>
                            </div>
                        </div>
                         <span className={`inline-flex items-center gap-1.5 px-2 py-1 border text-[10px] font-bold uppercase tracking-widest
                            ${product.status === 'In Stock' ? 'text-green-700 border-green-200 bg-green-50/50' : 
                              product.status === 'Low Stock' ? 'text-amber-700 border-amber-200 bg-amber-50/50' :
                              'text-red-700 border-red-200 bg-red-50/50'
                            }`}>
                            {product.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm border-y border-gray-100 py-3">
                         <div>
                             <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Price</p>
                             <p className="font-medium text-primary">{product.price}</p>
                         </div>
                         <div>
                             <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Stock</p>
                             <p className="font-medium text-primary">{product.stock}</p>
                         </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button 
                            onClick={() => openViewModal(product)}
                            className="p-2 border border-gray-200 text-gray-400 hover:text-primary hover:border-primary transition-colors" 
                            title="View"
                        >
                            <Eye size={16} />
                        </button>
                        <button 
                            onClick={() => openEditModal(product)}
                            className="p-2 border border-gray-200 text-gray-400 hover:text-primary hover:border-primary transition-colors" 
                            title="Edit"
                        >
                            <Edit size={16} />
                        </button>
                        <button 
                            onClick={() => openDeleteModal(product)}
                            className="p-2 border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-600 transition-colors" 
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            ))}
       </div>

       {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 uppercase tracking-wide gap-4">
            <div>Showing 1-5 of 124 items</div>
            <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors" disabled>Previous</button>
                <button className="px-4 py-2 border border-gray-200 hover:bg-gray-50 transition-colors">Next</button>
            </div>
        </div>

       {/* Modal Integration */}
       <ProductModal 
         isOpen={isModalOpen} 
         onClose={() => setIsModalOpen(false)} 
         product={selectedProduct}
       />
       <DeleteProductModal
         isOpen={isDeleteModalOpen}
         onClose={() => setIsDeleteModalOpen(false)}
         product={selectedProduct}
         onConfirm={handleDelete}
       />
       <ViewProductModal
         isOpen={isViewModalOpen}
         onClose={() => setIsViewModalOpen(false)}
         product={selectedProduct}
       />
    </div>
  );
}
