"use client";

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white text-primary font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-100 bg-white">
             <div className="text-xl font-bold tracking-tight text-primary font-sans">
                ZEN<span className="font-light text-gray-400">GLOW</span>
            </div>
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-gray-600 hover:text-primary transition-colors"
            >
                <Menu size={24} />
            </button>
        </div>

        <div className="flex-1 overflow-x-hidden overflow-y-auto">
            <div className="container mx-auto px-4 py-8 md:px-8">
                {children}
            </div>
        </div>
      </main>
    </div>
  );
}
