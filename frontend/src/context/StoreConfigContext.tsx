"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { storeService, StoreConfig } from '@/lib/api/store';

interface StoreConfigContextType {
  config: StoreConfig | null;
  isLoading: boolean;
  formatPrice: (price: number) => string;
  currencySymbol: string;
  refreshConfig: () => Promise<void>;
}

const defaultConfig: StoreConfig = {
  id: 'default',
  store_name: 'ZenGlow',
  currency: 'USD',
  currency_symbol: '$',
  tax_rate: 0,
  shipping_fee: 0,
  maintenance_mode: false,
};

const StoreConfigContext = createContext<StoreConfigContextType>({
  config: defaultConfig,
  isLoading: true,
  formatPrice: (price) => `$${price.toFixed(2)}`,
  currencySymbol: '$',
  refreshConfig: async () => {},
});

export function StoreConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<StoreConfig | null>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const data = await storeService.getConfig();
      setConfig(data);
    } catch (error) {
      console.error('Failed to fetch store config:', error);
      // Keep default config on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const formatPrice = (price: number): string => {
    const symbol = config?.currency_symbol || '$';
    return `${symbol}${price.toFixed(2)}`;
  };

  const currencySymbol = config?.currency_symbol || '$';

  const refreshConfig = async () => {
    setIsLoading(true);
    await fetchConfig();
  };

  return (
    <StoreConfigContext.Provider value={{ config, isLoading, formatPrice, currencySymbol, refreshConfig }}>
      {children}
    </StoreConfigContext.Provider>
  );
}

export function useStoreConfig() {
  const context = useContext(StoreConfigContext);
  if (!context) {
    throw new Error('useStoreConfig must be used within a StoreConfigProvider');
  }
  return context;
}
