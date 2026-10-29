"use client";

import React, { createContext, useContext, useState } from "react";
import { CartItem, RingProduct } from "@/types";
import { PRODUCTS } from "@/lib/data";

interface CartContextType {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
  isCartOpen: boolean;
  isSizeGuideOpen: boolean;
  selectedProductForSizing: RingProduct | null;
  setIsCartOpen: (open: boolean) => void;
  setIsSizeGuideOpen: (open: boolean) => void;
  openSizeGuide: (product?: RingProduct) => void;
  addToCart: (product: RingProduct, size: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Pre-seed with 2 items to match "Koszyk (2)" from the design mockup
  const [items, setItems] = useState<CartItem[]>([
    {
      id: "cart-item-1",
      productId: "aura-ring-matte-black",
      name: "Aura Ring Matte Black",
      finishName: "Czarny Mat",
      finish: "black",
      size: 10,
      price: 1299,
      quantity: 1,
      image: "/images/ring-image-3.png",
    },
    {
      id: "cart-item-2",
      productId: "aura-ring-champagne-gold",
      name: "Aura Ring Champagne Gold",
      finishName: "Złoto Szampańskie",
      finish: "gold",
      size: 8,
      price: 1499,
      quantity: 1,
      image: "/images/ring-image-1.png",
    },
  ]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [selectedProductForSizing, setSelectedProductForSizing] =
    useState<RingProduct | null>(null);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const addToCart = (product: RingProduct, size: number) => {
    const existingIndex = items.findIndex(
      (item) => item.productId === product.id && item.size === size
    );

    if (existingIndex > -1) {
      setItems((prev) =>
        prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        productId: product.id,
        name: product.name,
        finishName: product.finishName,
        finish: product.finish,
        size: size,
        price: product.price,
        quantity: 1,
        image: product.image,
      };
      setItems((prev) => [newItem, ...prev]);
    }

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const openSizeGuide = (product?: RingProduct) => {
    setSelectedProductForSizing(product || PRODUCTS[0]);
    setIsSizeGuideOpen(true);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        subtotal,
        isCartOpen,
        isSizeGuideOpen,
        selectedProductForSizing,
        setIsCartOpen,
        setIsSizeGuideOpen,
        openSizeGuide,
        addToCart,
        removeFromCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
