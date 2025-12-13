import React from 'react';
import { Search, Filter, ArrowUpRight } from 'lucide-react';

const orders = [
  { id: '#ORD-7890', customer: 'Alice Freeman', date: 'Oct 24, 2025', total: '$120.00', status: 'Completed', payment: 'Credit Card', items: 3 },
  { id: '#ORD-7891', customer: 'Mark Stone', date: 'Oct 24, 2025', total: '$85.50', status: 'Processing', payment: 'PayPal', items: 1 },
  { id: '#ORD-7892', customer: 'Lily Chen', date: 'Oct 23, 2025', total: '$210.25', status: 'Pending', payment: 'Credit Card', items: 5 },
  { id: '#ORD-7893', customer: 'James Wilson', date: 'Oct 23, 2025', total: '$45.00', status: 'Completed', payment: 'Stripe', items: 2 },
  { id: '#ORD-7894', customer: 'Sarah Connor', date: 'Oct 22, 2025', total: '$320.00', status: 'Cancelled', payment: 'Credit Card', items: 8 },
  { id: '#ORD-7895', customer: 'John Smith', date: 'Oct 22, 2025', total: '$15.00', status: 'Completed', payment: 'PayPal', items: 1 },
];

export default function OrdersPage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-gray-100 pb-6">
                <div>
                   <h1 className="text-3xl font-serif font-bold text-primary">Orders</h1>
                   <p className="text-gray-500 text-sm mt-1 tracking-wide">Manage and track your customer orders.</p>
                </div>
            </div>

            {/* Filters */}
             <div className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 bg-gray-50/30">
                 <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                    {['All', 'Pending', 'Processing', 'Completed', 'Cancelled'].map((status) => (
                        <button key={status} className={`px-6 py-2 rounded-none text-xs font-bold uppercase tracking-widest transition-colors
                            ${status === 'All' ? 'bg-primary text-white border border-primary' : 'bg-white text-gray-500 border border-gray-200 hover:border-primary hover:text-primary'}`}>
                            {status}
                        </button>
                    ))}
                 </div>
                 <div className="border-l border-gray-100 hidden sm:block"></div>
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="SEARCH ORDERS..." 
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-white focus:outline-none focus:border-primary text-sm transition-colors placeholder:text-gray-400 font-medium"
                    />
                </div>
                <button className="flex items-center gap-2 px-6 py-2 border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:text-primary hover:border-primary transition-colors uppercase tracking-widest">
                    <Filter size={16} />
                    Filters
                </button>
           </div>

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
                                <th className="px-6 py-4 font-medium">Payment</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4 font-serif font-bold text-primary">{order.id}</td>
                                    <td className="px-6 py-4 text-gray-600 font-medium">{order.customer}</td>
                                    <td className="px-6 py-4 text-gray-400 text-xs uppercase tracking-wide">{order.date}</td>
                                    <td className="px-6 py-4 text-gray-600">{order.items}</td>
                                    <td className="px-6 py-4 font-medium text-primary">{order.total}</td>
                                    <td className="px-6 py-4 text-gray-500 text-xs uppercase tracking-wide">{order.payment}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 border text-[10px] font-bold uppercase tracking-widest
                                            ${order.status === 'Completed' ? 'text-green-700 border-green-200 bg-green-50/50' : 
                                            order.status === 'Processing' ? 'text-blue-700 border-blue-200 bg-blue-50/50' :
                                            order.status === 'Pending' ? 'text-amber-700 border-amber-200 bg-amber-50/50' :
                                            'text-red-700 border-red-200 bg-red-50/50'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-primary p-1 hover:bg-gray-50 transition-colors rounded-sm" title="View Details">
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
                                 <span className="font-serif font-bold text-primary block text-lg">{order.id}</span>
                                 <span className="text-xs text-gray-500 uppercase tracking-wide">{order.date}</span>
                             </div>
                             <span className={`inline-flex items-center px-2 py-1 border text-[10px] font-bold uppercase tracking-widest
                                ${order.status === 'Completed' ? 'text-green-700 border-green-200 bg-green-50/50' : 
                                  order.status === 'Processing' ? 'text-blue-700 border-blue-200 bg-blue-50/50' :
                                  order.status === 'Pending' ? 'text-amber-700 border-amber-200 bg-amber-50/50' :
                                  'text-red-700 border-red-200 bg-red-50/50'
                                }`}>
                                {order.status}
                            </span>
                        </div>

                         <div className="grid grid-cols-2 gap-4 text-sm border-y border-gray-100 py-3">
                             <div>
                                 <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Customer</p>
                                 <p className="text-gray-800 font-medium">{order.customer}</p>
                             </div>
                             <div className="text-right">
                                 <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Total</p>
                                 <p className="text-primary font-bold">{order.total}</p>
                             </div>
                              <div>
                                 <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Payment</p>
                                 <p className="text-gray-600">{order.payment}</p>
                             </div>
                              <div className="text-right">
                                 <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Items</p>
                                 <p className="text-gray-600">{order.items}</p>
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

           {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 uppercase tracking-wide gap-4">
                <div>Showing 1-10 of 56 orders</div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors" disabled>Previous</button>
                    <button className="px-4 py-2 border border-gray-200 hover:bg-gray-50 transition-colors">Next</button>
                </div>
            </div>
        </div>
    )
}
