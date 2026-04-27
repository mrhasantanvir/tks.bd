"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: number;
  name: string;
  price_per_unit: number;
  unit_type: string;
  lotSize: number;
  quantity: number;
  harvest_date: string | null;
  image_url: string | null;
  allow_home_delivery: boolean;
  allow_point_delivery: boolean;
  available_couriers: string[]; // Parsed JSON
  payment_policy: string;
  partial_advance_val: number | null;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  totalWeight: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('tks_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('tks_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === newItem.id && item.lotSize === newItem.lotSize
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += newItem.quantity;
        return updatedCart;
      }
      return [...prevCart, newItem];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalWeight = cart.reduce((acc, item) => acc + item.lotSize * item.quantity, 0);
  const totalAmount = cart.reduce((acc, item) => acc + item.price_per_unit * (item.lotSize * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalWeight, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
