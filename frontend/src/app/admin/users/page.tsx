import React from 'react';
import { Search, Filter, MoreHorizontal } from 'lucide-react';

const users = [
    { id: 1, name: 'Alice Freeman', email: 'alice@example.com', role: 'Customer', status: 'Active', joinDate: 'Oct 12, 2024', orders: 5 },
    { id: 2, name: 'Admin User', email: 'admin@zenglow.com', role: 'Admin', status: 'Active', joinDate: 'Jan 01, 2024', orders: 0 },
    { id: 3, name: 'John Doe', email: 'john@example.com', role: 'Customer', status: 'Inactive', joinDate: 'Sep 23, 2025', orders: 1 },
    { id: 4, name: 'Sarah Connor', email: 'sarah@example.com', role: 'Customer', status: 'Active', joinDate: 'Aug 15, 2025', orders: 12 },
    { id: 5, name: 'Michael Smith', email: 'mike@example.com', role: 'Customer', status: 'Active', joinDate: 'Nov 02, 2025', orders: 3 },
];

export default function UsersPage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-gray-100 pb-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary">Users</h1>
                    <p className="text-gray-500 text-sm mt-1 tracking-wide">Manage your customer base and team.</p>
                </div>
            </div>
            
            {/* Filters */}
             <div className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 bg-gray-50/30">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="SEARCH USERS..." 
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-white focus:outline-none focus:border-primary text-sm transition-colors placeholder:text-gray-400 font-medium"
                    />
                </div>
                <button className="flex items-center gap-2 px-6 py-2 border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:text-primary hover:border-primary transition-colors uppercase tracking-widest">
                    <Filter size={16} />
                    Filters
                </button>
           </div>

           {/* User Table (Desktop) */}
           <div className="border border-gray-100 hidden md:block">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[10px] text-gray-400 uppercase tracking-widest bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-medium">User</th>
                                <th className="px-6 py-4 font-medium">Role</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Joined</th>
                                <th className="px-6 py-4 font-medium">Orders</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-accent text-primary flex items-center justify-center font-bold text-xs uppercase border border-primary/10">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-serif font-bold text-primary">{user.name}</div>
                                                <div className="text-[10px] text-gray-400 uppercase tracking-wide">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-1 border text-[10px] font-bold uppercase tracking-widest
                                            ${user.role === 'Admin' ? 'text-purple-700 border-purple-200 bg-purple-50/50' : 'text-gray-600 border-gray-200 bg-gray-50'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 border text-[10px] font-bold uppercase tracking-widest
                                            ${user.status === 'Active' ? 'text-green-700 border-green-200 bg-green-50/50' : 'text-gray-500 border-gray-200 bg-gray-100'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs uppercase tracking-wide">{user.joinDate}</td>
                                    <td className="px-6 py-4 text-gray-600 font-medium">{user.orders}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-primary p-1 hover:bg-gray-50 transition-colors rounded-sm">
                                            <MoreHorizontal size={18} />
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
                {users.map((user) => (
                    <div key={user.id} className="bg-white border border-gray-100 p-4 space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-accent text-primary flex items-center justify-center font-bold text-sm uppercase border border-primary/10">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-serif font-bold text-primary">{user.name}</div>
                                    <div className="text-[10px] text-gray-400 uppercase tracking-wide">{user.email}</div>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-primary p-1">
                                <MoreHorizontal size={18} />
                            </button>
                        </div>

                         <div className="grid grid-cols-2 gap-4 text-sm border-y border-gray-100 py-3">
                             <div>
                                 <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Role</p>
                                 <span className={`inline-flex px-2 py-1 border text-[10px] font-bold uppercase tracking-widest
                                    ${user.role === 'Admin' ? 'text-purple-700 border-purple-200 bg-purple-50/50' : 'text-gray-600 border-gray-200 bg-gray-50'}`}>
                                    {user.role}
                                </span>
                             </div>
                             <div className="text-right">
                                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Status</p>
                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 border text-[10px] font-bold uppercase tracking-widest
                                    ${user.status === 'Active' ? 'text-green-700 border-green-200 bg-green-50/50' : 'text-gray-500 border-gray-200 bg-gray-100'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                                    {user.status}
                                </span>
                             </div>
                              <div>
                                 <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Joined</p>
                                 <p className="text-gray-600">{user.joinDate}</p>
                             </div>
                              <div className="text-right">
                                 <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Orders</p>
                                 <p className="text-gray-600 font-medium">{user.orders}</p>
                             </div>
                        </div>
                    </div>
                ))}
           </div>

           {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 uppercase tracking-wide gap-4">
                <div>Showing 1-5 of 45 users</div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors" disabled>Previous</button>
                    <button className="px-4 py-2 border border-gray-200 hover:bg-gray-50 transition-colors">Next</button>
                </div>
            </div>
        </div>
    )
}
