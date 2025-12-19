"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth";

export interface CartItem {
  id: string | number;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  toggleCart: () => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Get cart storage key for current user
 * Uses user ID to ensure each user has their own cart
 */
const getCartStorageKey = (userId: string | null): string => {
  if (userId) {
    return `zenglow_cart_${userId}`;
  }
  // Guest cart (for non-logged in users)
  return "zenglow_cart_guest";
};

/**
 * Load cart from localStorage for specific user
 */
const loadCartFromStorage = (userId: string | null): CartItem[] => {
  try {
    const key = getCartStorageKey(userId);
    const savedCart = localStorage.getItem(key);
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (error) {
    console.error("Failed to load cart from storage:", error);
  }
  return [];
};

/**
 * Save cart to localStorage for specific user
 */
const saveCartToStorage = (userId: string | null, cart: CartItem[]): void => {
  try {
    const key = getCartStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart to storage:", error);
  }
};

/**
 * Clear old/shared cart data (migration from old storage)
 */
const clearLegacyCart = (): void => {
  try {
    localStorage.removeItem("zenglow_cart");
  } catch (error) {
    console.error("Failed to clear legacy cart:", error);
  }
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useAuthStore();
  
  const userId = user?.id || null;

  // Load cart from local storage on mount or when user changes
  useEffect(() => {
    // Clear old shared cart (one-time migration)
    clearLegacyCart();
    
    // Load user-specific cart
    const loadedCart = loadCartFromStorage(userId);
    setCart(loadedCart);
  }, [userId]);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    saveCartToStorage(userId, cart);
  }, [cart, userId]);

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true); // Open cart when item is added
  };

  const removeFromCart = (id: string | number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string | number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const clearCart = () => {
    setCart([]);
    saveCartToStorage(userId, []);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Helper to parse price string "KSh 10,400" -> 10400
  const parsePrice = (priceStr: string) => {
    return parseFloat(priceStr.replace(/[^0-9.]/g, ""));
  };

  const cartTotal = cart.reduce(
    (total, item) => total + parsePrice(item.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleCart,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
