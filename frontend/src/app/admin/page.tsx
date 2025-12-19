"use client";

import React from 'react';
import Link from 'next/link';
import { DollarSign, ShoppingBag, Users as UsersIcon, Package, TrendingUp, ArrowUpRight, Loader2 } from 'lucide-react';
import { useDashboard } from '@/hooks/useAdmin';
import { useStoreConfig } from '@/context/StoreConfigContext';

// Icon mapping for stats
const statIcons: Record<string, React.ElementType> = {
  'Total Revenue': DollarSign,
  'Active Orders': ShoppingBag,
  'Total Customers': UsersIcon,
  'Products': Package,
};

export default function AdminDashboard() {
  const { data, isLoading, isError } = useDashboard();
  const { formatPrice } = useStoreConfig();

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
        <p className="text-red-500">Failed to load dashboard data.</p>
      </div>
    );
  }

  const stats = data?.stats || [];
  const recentOrders = data?.recent_orders || [];

  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-gray-100 pb-6 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary">Dashboard</h1>
          <p className="text-gray-500 mt-2 text-sm tracking-wide">Make your store shine with every click.</p>
        </div>
        <div className="text-sm font-medium text-gray-400 uppercase tracking-widest hidden sm:block">Last updated: Just now</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100 border border-gray-100">
        {stats.map((stat) => {
          const Icon = statIcons[stat.name] || Package;
          return (
            <div key={stat.name} className="bg-white p-6 sm:p-8 flex flex-col justify-between hover:bg-gray-50/50 transition-colors group">
              <div className="flex justify-between items-start mb-6">
                <div className="text-gray-400 group-hover:text-primary transition-colors">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider ${
                  stat.change_positive 
                    ? 'text-primary bg-accent' 
                    : 'text-red-600 bg-red-50'
                }`}>
                  {stat.change}
                  <TrendingUp size={10} />
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">{stat.name}</p>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-primary">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-serif font-bold text-primary">Recent Orders</h3>
                 <Link href="/admin/orders" className="text-xs font-bold text-primary hover:bg-accent px-4 py-2 transition-colors uppercase tracking-widest border border-primary">
                    View All
                 </Link>
            </div>
            
            {recentOrders.length === 0 ? (
              <div className="border border-gray-100 p-8 text-center text-gray-400">
                No orders yet. Orders will appear here once customers start buying.
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="overflow-x-auto border border-gray-100 hidden md:block">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[10px] text-gray-400 uppercase tracking-widest bg-gray-50 border-b border-gray-100">
                            <tr>
                                 <th className="px-6 py-4 font-medium">Order ID</th>
                                 <th className="px-6 py-4 font-medium">Customer</th>
                                 <th className="px-6 py-4 font-medium">Date</th>
                                 <th className="px-6 py-4 font-medium">Items</th>
                                 <th className="px-6 py-4 font-medium">Total</th>
                                 <th className="px-6 py-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4 font-serif font-medium text-primary">{order.id}</td>
                                    <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                                    <td className="px-6 py-4 text-gray-400 text-xs uppercase tracking-wide">{order.date}</td>
                                    <td className="px-6 py-4 text-gray-600">{order.items}</td>
                                    <td className="px-6 py-4 font-medium text-primary">{formatPrice(order.total)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 border
                                            ${order.status === 'Completed' ? 'text-green-700 border-green-200 bg-green-50/50' : 
                                              order.status === 'Processing' ? 'text-blue-700 border-blue-200 bg-blue-50/50' :
                                              order.status === 'Pending' ? 'text-amber-700 border-amber-200 bg-amber-50/50' :
                                              'text-red-700 border-red-200 bg-red-50/50'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="space-y-4 md:hidden">
                    {recentOrders.map((order) => (
                        <div key={order.id} className="bg-white border border-gray-100 p-4 space-y-3">
                             <div className="flex justify-between items-start">
                                 <div>
                                     <span className="font-serif font-bold text-primary block">{order.id}</span>
                                     <span className="text-xs text-gray-500 uppercase tracking-wide">{order.date}</span>
                                 </div>
                                 <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 border
                                    ${order.status === 'Completed' ? 'text-green-700 border-green-200 bg-green-50/50' : 
                                      order.status === 'Processing' ? 'text-blue-700 border-blue-200 bg-blue-50/50' :
                                      order.status === 'Pending' ? 'text-amber-700 border-amber-200 bg-amber-50/50' :
                                      'text-red-700 border-red-200 bg-red-50/50'
                                    }`}>
                                    {order.status}
                                </span>
                             </div>
                             <div className="grid grid-cols-2 gap-4 text-sm">
                                 <div>
                                     <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Customer</p>
                                     <p className="text-gray-600 font-medium">{order.customer}</p>
                                 </div>
                                 <div className="text-right">
                                     <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Total</p>
                                     <p className="text-primary font-bold">{formatPrice(order.total)}</p>
                                 </div>
                             </div>
                        </div>
                    ))}
                </div>
              </>
            )}
        </div>

        {/* Quick Actions */}
        <div>
            <h3 className="text-xl font-serif font-bold text-primary mb-6">Quick Actions</h3>
            <div className="space-y-4">
                <Link href="/admin/products" className="w-full flex items-center justify-between p-6 border border-gray-200 hover:border-black hover:bg-gray-50 transition-all group">
                    <span className="font-medium text-sm uppercase tracking-wide text-gray-600 group-hover:text-primary">Add New Product</span>
                    <span className="text-gray-400 group-hover:text-primary font-light text-2xl">+</span>
                </Link>
                 <Link href="/admin/users" className="w-full flex items-center justify-between p-6 border border-gray-200 hover:border-black hover:bg-gray-50 transition-all group">
                    <span className="font-medium text-sm uppercase tracking-wide text-gray-600 group-hover:text-primary">Manage Users</span>
                     <ArrowUpRight size={20} className="text-gray-400 group-hover:text-primary" />
                </Link>
                 <Link href="/admin/orders" className="w-full flex items-center justify-between p-6 border border-gray-200 hover:border-black hover:bg-gray-50 transition-all group">
                    <span className="font-medium text-sm uppercase tracking-wide text-gray-600 group-hover:text-primary">View Orders</span>
                     <ArrowUpRight size={20} className="text-gray-400 group-hover:text-primary" />
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}
