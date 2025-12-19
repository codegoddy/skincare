"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Users, Package, Settings, LogOut, X } from 'lucide-react';
import { useLogout } from '@/hooks/useAuth';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-primary text-white border-r border-white/10 flex flex-col h-screen transition-transform duration-300 ease-in-out
        md:translate-x-0 md:sticky md:top-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 border-b border-white/10 flex justify-between items-center">
          <div>
            <Link href="/" className="text-3xl font-bold tracking-tight text-white font-sans">
                ZEN<span className="font-light text-gray-500">GLOW</span>
            </Link>
            <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-[0.2em] font-medium">Admin Portal</p>
          </div>
          {/* Mobile Close Button */}
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href}
                href={item.href} 
                onClick={onClose} // Auto-close on mobile nav
                className={`flex items-center gap-4 px-5 py-3 text-sm font-medium transition-all duration-300 group
                  ${isActive 
                    ? 'bg-accent text-primary' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Icon 
                  size={18} 
                  className={`transition-colors duration-300 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-white'}`}
                />
                <span className="uppercase tracking-wide text-xs">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-white/10">
          <button 
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="flex items-center gap-4 w-full px-5 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all group disabled:opacity-50"
          >
            <LogOut size={18} className="group-hover:text-white transition-colors" />
            <span className="uppercase tracking-wide text-xs">
              {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
