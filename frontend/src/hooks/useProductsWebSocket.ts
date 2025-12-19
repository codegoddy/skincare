"use client";

import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { productKeys } from '@/hooks/useProducts';
import { Product } from '@/lib/api/products';

interface WebSocketMessage {
  type: 'product_created' | 'product_updated' | 'product_deleted';
  product?: Product;
  product_id?: string;
}

export function useProductsWebSocket() {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const connect = useCallback(() => {
    const wsUrl = process.env.NEXT_PUBLIC_API_URL?.replace('http', 'ws') || 'ws://localhost:8000';
    
    try {
      wsRef.current = new WebSocket(`${wsUrl}/ws/products`);
      
      wsRef.current.onopen = () => {
        console.log('Products WebSocket connected');
      };
      
      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          // Invalidate products queries to refetch
          queryClient.invalidateQueries({ queryKey: productKeys.all });
          
          console.log('Product update received:', message.type);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
      
      wsRef.current.onclose = () => {
        console.log('Products WebSocket disconnected');
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };
      
      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
    }
  }, [queryClient]);

  useEffect(() => {
    connect();
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  // Send ping to keep connection alive
  useEffect(() => {
    const pingInterval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send('ping');
      }
    }, 30000);
    
    return () => clearInterval(pingInterval);
  }, []);

  return {
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
  };
}
