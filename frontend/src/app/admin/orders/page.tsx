"use client";

import React, { useState } from 'react';
import { Search, Filter, ArrowUpRight, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdminOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import { useStoreConfig } from '@/context/StoreConfigContext';

const STATUS_FILTERS = ['All', 'pending', 'processing', 'completed', 'cancelled'];

export default function OrdersPage() {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
    const [search, setSearch] = useState('');
    const pageSize = 20;

    const { formatPrice } = useStoreConfig();
    const { data, isLoading, isError } = useAdminOrders({
        page,
        page_size: pageSize,
        status: statusFilter,
    });
    const updateStatusMutation = useUpdateOrderStatus();

    const orders = data?.orders || [];

    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return 'Unknown';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'text-green-700 border-green-200 bg-green-50/50';
            case 'processing':
                return 'text-blue-700 border-blue-200 bg-blue-50/50';
            case 'pending':
                return 'text-amber-700 border-amber-200 bg-amber-50/50';
            default:
                return 'text-red-700 border-red-200 bg-red-50/50';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 size={32} className="animate-spin text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-16">
                <p className="text-red-500">Failed to load orders.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-gray-100 pb-6">
                <div>
                   <h1 className="text-3xl font-serif font-bold text-primary">Orders</h1>
                   <p className="text-gray-500 text-sm mt-1 tracking-wide">Manage and track your customer orders. {data?.total || 0} orders.</p>
                </div>
            </div>

            {/* Filters */}
             <div className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 bg-gray-50/30">
                 <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                    {STATUS_FILTERS.map((status) => (
                        <button 
                            key={status} 
                            onClick={() => setStatusFilter(status === 'All' ? undefined : status)}
                            className={`px-6 py-2 rounded-none text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap
                            ${(status === 'All' && !statusFilter) || status === statusFilter
                                ? 'bg-primary text-white border border-primary' 
                                : 'bg-white text-gray-500 border border-gray-200 hover:border-primary hover:text-primary'}`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                 </div>
                 <div className="border-l border-gray-100 hidden sm:block"></div>
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="SEARCH ORDERS..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-white focus:outline-none focus:border-primary text-sm transition-colors placeholder:text-gray-400 font-medium"
                    />
                </div>
           </div>

           {orders.length === 0 ? (
               <div className="border border-gray-100 p-12 text-center text-gray-400">
                   No orders found.
               </div>
           ) : (
               <>
                   {/* Orders Table (Desktop) */}
                   <div className="border border-gray-100 hidden md:block">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-[10px] text-gray-400 uppercase tracking-widest bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Order ID</th>
                                        <th className="px-6 py-4 font-medium">Customer</th>
                                        <th className="px-6 py-4 font-medium">Date</th>
                                        <th className="px-6 py-4 font-medium">Items</th>
                                        <th className="px-6 py-4 font-medium">Total</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-4 font-serif font-bold text-primary">
                                                #{order.id.slice(0, 8).toUpperCase()}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 font-medium">
                                                {order.customer_name || 'Unknown'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 text-xs uppercase tracking-wide">
                                                {formatDate(order.created_at)}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{order.items_count}</td>
                                            <td className="px-6 py-4 font-medium text-primary">
                                                {formatPrice(order.total)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-1 border text-[10px] font-bold uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    className="text-gray-400 hover:text-primary p-1 hover:bg-gray-50 transition-colors rounded-sm" 
                                                    title="View Details"
                                                >
                                                    <ArrowUpRight size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                   </div>

                   {/* Mobile Card View */}
                   <div className="space-y-4 md:hidden">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white border border-gray-100 p-4 space-y-4">
                                <div className="flex justify-between items-start">
                                     <div>
                                         <span className="font-serif font-bold text-primary block text-lg">
                                             #{order.id.slice(0, 8).toUpperCase()}
                                         </span>
                                         <span className="text-xs text-gray-500 uppercase tracking-wide">
                                             {formatDate(order.created_at)}
                                         </span>
                                     </div>
                                     <span className={`inline-flex items-center px-2 py-1 border text-[10px] font-bold uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>

                                 <div className="grid grid-cols-2 gap-4 text-sm border-y border-gray-100 py-3">
                                     <div>
                                         <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Customer</p>
                                         <p className="text-gray-800 font-medium">{order.customer_name || 'Unknown'}</p>
                                     </div>
                                     <div className="text-right">
                                         <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Total</p>
                                         <p className="text-primary font-bold">{formatPrice(order.total)}</p>
                                     </div>
                                      <div>
                                         <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Items</p>
                                         <p className="text-gray-600">{order.items_count}</p>
                                     </div>
                                </div>

                                <div className="flex justify-end">
                                    <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors">
                                        View Details <ArrowUpRight size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                   </div>
               </>
           )}

           {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 uppercase tracking-wide gap-4">
                <div>
                    Showing {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, data?.total || 0)} of {data?.total || 0} orders
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center gap-1"
                    >
                        <ChevronLeft size={14} />
                        Previous
                    </button>
                    <button 
                        onClick={() => setPage(p => p + 1)}
                        disabled={page >= (data?.total_pages || 1)}
                        className="px-4 py-2 border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center gap-1"
                    >
                        Next
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    )
}
