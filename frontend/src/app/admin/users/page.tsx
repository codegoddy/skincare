"use client";

import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdminUsers, useUpdateUserRole, useUpdateUserStatus } from '@/hooks/useAdminUsers';

export default function UsersPage() {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const pageSize = 20;
    
    const { data, isLoading, isError } = useAdminUsers(page, pageSize);
    const updateRoleMutation = useUpdateUserRole();
    const updateStatusMutation = useUpdateUserStatus();
    
    const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

    const handleRoleChange = (userId: string, newRole: string) => {
        updateRoleMutation.mutate({ userId, role: newRole });
        setActionMenuOpen(null);
    };

    const handleStatusChange = (userId: string, newStatus: string) => {
        updateStatusMutation.mutate({ userId, status: newStatus });
        setActionMenuOpen(null);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Filter users by search query
    const filteredUsers = data?.users.filter(user => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            user.email.toLowerCase().includes(query) ||
            (user.full_name?.toLowerCase().includes(query))
        );
    }) || [];

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
                <p className="text-red-500">Failed to load users. Make sure you have admin access.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-gray-100 pb-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary">Users</h1>
                    <p className="text-gray-500 text-sm mt-1 tracking-wide">
                        Manage your customer base and team. {data?.total || 0} total users.
                    </p>
                </div>
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 bg-gray-50/30">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="SEARCH USERS..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-white focus:outline-none focus:border-primary text-sm transition-colors placeholder:text-gray-400 font-medium"
                    />
                </div>
                <button className="flex items-center gap-2 px-6 py-2 border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:text-primary hover:border-primary transition-colors uppercase tracking-widest">
                    <Filter size={16} />
                    Filters
                </button>
           </div>

           {/* User Table (Desktop) */}
           <div className="border border-gray-100 hidden md:block overflow-visible">
                <div className="overflow-visible">
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
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-accent text-primary flex items-center justify-center font-bold text-xs uppercase border border-primary/10">
                                                {(user.full_name || user.email).charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-serif font-bold text-primary">{user.full_name || 'No Name'}</div>
                                                <div className="text-[10px] text-gray-400 uppercase tracking-wide">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-1 border text-[10px] font-bold uppercase tracking-widest
                                            ${user.role === 'admin' ? 'text-purple-700 border-purple-200 bg-purple-50/50' : 'text-gray-600 border-gray-200 bg-gray-50'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 border text-[10px] font-bold uppercase tracking-widest
                                            ${user.status === 'active' ? 'text-green-700 border-green-200 bg-green-50/50' : 'text-gray-500 border-gray-200 bg-gray-100'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs uppercase tracking-wide">{formatDate(user.created_at)}</td>
                                    <td className="px-6 py-4 text-gray-600 font-medium">{user.orders_count}</td>
                                    <td className="px-6 py-4 text-right relative">
                                        <button 
                                            onClick={() => setActionMenuOpen(actionMenuOpen === user.id ? null : user.id)}
                                            className="text-gray-400 hover:text-primary p-1 hover:bg-gray-50 transition-colors rounded-sm"
                                        >
                                            <MoreHorizontal size={18} />
                                        </button>
                                        
                                        {actionMenuOpen === user.id && (
                                            <>
                                                {/* Click outside overlay */}
                                                <div 
                                                    className="fixed inset-0 z-10"
                                                    onClick={() => setActionMenuOpen(null)}
                                                />
                                                <div className="absolute right-6 bottom-full mb-1 bg-white border border-gray-200 shadow-lg z-20 min-w-[160px]">
                                                    <div className="py-1">
                                                        <div className="px-3 py-2 text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-100">Change Role</div>
                                                        <button
                                                            onClick={() => handleRoleChange(user.id, 'customer')}
                                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${user.role === 'customer' ? 'text-primary font-medium' : ''}`}
                                                        >
                                                            Customer
                                                        </button>
                                                        <button
                                                            onClick={() => handleRoleChange(user.id, 'admin')}
                                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${user.role === 'admin' ? 'text-primary font-medium' : ''}`}
                                                        >
                                                            Admin
                                                        </button>
                                                        <div className="px-3 py-2 text-[10px] text-gray-400 uppercase tracking-widest border-y border-gray-100 mt-1">Change Status</div>
                                                        <button
                                                            onClick={() => handleStatusChange(user.id, 'active')}
                                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${user.status === 'active' ? 'text-green-600 font-medium' : ''}`}
                                                        >
                                                            Active
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(user.id, 'inactive')}
                                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${user.status === 'inactive' ? 'text-gray-600 font-medium' : ''}`}
                                                        >
                                                            Inactive
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
           </div>

           {/* Mobile Card View */}
           <div className="space-y-4 md:hidden">
                {filteredUsers.map((user) => (
                    <div key={user.id} className="bg-white border border-gray-100 p-4 space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-accent text-primary flex items-center justify-center font-bold text-sm uppercase border border-primary/10">
                                    {(user.full_name || user.email).charAt(0)}
                                </div>
                                <div>
                                    <div className="font-serif font-bold text-primary">{user.full_name || 'No Name'}</div>
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
                                    ${user.role === 'admin' ? 'text-purple-700 border-purple-200 bg-purple-50/50' : 'text-gray-600 border-gray-200 bg-gray-50'}`}>
                                    {user.role}
                                </span>
                             </div>
                             <div className="text-right">
                                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Status</p>
                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 border text-[10px] font-bold uppercase tracking-widest
                                    ${user.status === 'active' ? 'text-green-700 border-green-200 bg-green-50/50' : 'text-gray-500 border-gray-200 bg-gray-100'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                                    {user.status}
                                </span>
                             </div>
                              <div>
                                 <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Joined</p>
                                 <p className="text-gray-600">{formatDate(user.created_at)}</p>
                             </div>
                              <div className="text-right">
                                 <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Orders</p>
                                 <p className="text-gray-600 font-medium">{user.orders_count}</p>
                             </div>
                        </div>
                    </div>
                ))}
           </div>

           {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 uppercase tracking-wide gap-4">
                <div>
                    Showing {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, data?.total || 0)} of {data?.total || 0} users
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
