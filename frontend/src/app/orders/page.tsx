"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBlurDataURL } from '@/lib/imageUtils';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  ChevronLeft,
  Loader2,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight
} from 'lucide-react';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import Container from '@/components/ui/Container';
import FadeIn from '@/components/ui/FadeIn';
import Button from '@/components/ui/Button';
import { getAccessToken } from '@/lib/api';
import { useOrders } from '@/hooks/useOrders';

const statusConfig = {
  pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-accent', label: 'PENDING' },
  processing: { icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', label: 'PROCESSING' },
  shipped: { icon: Package, color: 'text-purple-600', bg: 'bg-purple-50', label: 'SHIPPED' },
  delivered: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'DELIVERED' },
  cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'CANCELLED' },
};

export default function OrdersPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useOrders();
  const [expandedOrder, setExpandedOrder] = React.useState<string | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)', paddingTop: '5rem' }}>
          <div className="text-center">
            <Loader2 size={32} className="animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-400 text-sm">Loading your orders...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const orders = data?.orders || [];

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Header />
      
      <div className="pt-32 pb-20">
        <Container>
          {/* Header */}
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <FadeIn direction="up">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Link href="/profile" className="text-gray-400 hover:text-primary transition-colors absolute left-4 md:left-8">
                  <ChevronLeft size={24} />
                </Link>
                <ShoppingBag size={32} className="text-primary" />
              </div>
              <h1 className="text-5xl md:text-7xl font-medium leading-none tracking-tight mb-4">
                ORDER <span className="font-serif italic text-gray-300">HISTORY</span>
              </h1>
              <p className="text-gray-500">{orders.length} orders placed</p>
            </FadeIn>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-4">No orders yet</h3>
              <p className="text-gray-500 mb-8">Start shopping to see your orders here</p>
              <Link href="/shop">
                <Button>Browse Shop</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, idx) => {
                const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
                const StatusIcon = status.icon;
                const isExpanded = expandedOrder === order.id;
                
                return (
                  <FadeIn key={order.id} delay={idx * 0.1} direction="up">
                    <div className="border-2 border-black overflow-hidden">
                      {/* Order Header - Clickable */}
                      <button 
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        className="w-full p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50 hover:bg-accent/30 transition-colors text-left"
                      >
                        <div className="flex items-center gap-6">
                          {/* First Product Image Preview */}
                          {order.items[0]?.image && (
                            <div className="relative w-16 h-16 bg-gray-100 border border-gray-200 flex-shrink-0 hidden md:block">
                              <Image
                                src={order.items[0].image}
                                alt={order.items[0].name}
                                fill
                                className="object-cover"
                                placeholder="blur"
                                blurDataURL={getBlurDataURL(64, 64)}
                                loading="lazy"
                              />
                              {order.items.length > 1 && (
                                <div className="absolute -bottom-2 -right-2 bg-black text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center">
                                  +{order.items.length - 1}
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div>
                            <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-1">Order #{order.id.slice(0, 8)}</p>
                            <p className="font-medium">
                              {order.created_at 
                                ? new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                                : 'Date unavailable'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 md:gap-8">
                          <div className={`flex items-center gap-2 px-4 py-2 text-[10px] font-bold tracking-widest ${status.bg} ${status.color}`}>
                            <StatusIcon size={14} />
                            {status.label}
                          </div>
                          
                          <div className="text-right">
                            <p className="text-xs text-gray-400 uppercase tracking-widest">Total</p>
                            <p className="font-bold">${order.total.toFixed(2)}</p>
                          </div>

                          <ChevronRight 
                            size={20} 
                            className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} 
                          />
                        </div>
                      </button>
                      
                      {/* Expanded Order Details */}
                      {isExpanded && (
                        <div className="border-t-2 border-black">
                          <div className="p-6">
                            <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4">Order Items</p>
                            
                            {/* Items Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                              {order.items.map((item) => (
                                <Link href={`/shop/${item.product_id}`} key={item.id} className="group">
                                  <div className="relative aspect-[4/5] bg-gray-50 border border-gray-200 overflow-hidden mb-2">
                                    {item.image ? (
                                      <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        placeholder="blur"
                                        blurDataURL={getBlurDataURL(400, 500)}
                                        loading="lazy"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <Package size={32} />
                                      </div>
                                    )}
                                  </div>
                                  <h4 className="text-[10px] font-bold tracking-widest uppercase">{item.name}</h4>
                                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">{item.type || 'Product'}</p>
                                  <p className="text-xs font-medium mt-1">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                                </Link>
                              ))}
                            </div>

                            {/* Order Summary */}
                            <div className="border-t border-gray-200 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="text-sm text-gray-500">
                                {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                              </div>
                              <div className="flex items-center gap-8">
                                <div>
                                  <span className="text-xs text-gray-400 uppercase tracking-widest">Order Total</span>
                                  <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
                                </div>
                                <Button 
                                  className="rounded-none border-2 border-black text-[10px] py-3 px-6 !bg-transparent !text-black hover:!bg-black hover:!text-white transition-all duration-300 uppercase font-bold tracking-widest"
                                >
                                  Reorder
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          )}
        </Container>
      </div>
      <Footer />
    </main>
  );
}
