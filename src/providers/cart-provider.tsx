import React, { useEffect, useState } from "react";
import { CartContext } from "@/context/CartContext"; // Импортируем сам контекст
import { ProductInCart } from "@/types/cart";
import { CartContextType } from '@/context/CartContext'; // Импортируем тип для значения контекста

const CART_STORAGE_KEY = 'shoppingCart';

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<ProductInCart[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузить корзину из LocalStorage при первом рендере
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Ошибка загрузки корзины из localStorage:', error);
      // Можно очистить localStorage, если данные повреждены
      localStorage.removeItem(CART_STORAGE_KEY);
    }
    setLoading(false);
  }, []);

  // Сохранить корзину в localStorage при каждом ее изменении
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, loading]);

  const addToCart = (item: ProductInCart) => {
    const safeQuantity = item.quantity ?? 1; // Убедимся, что quantity определено
    setCart((prevCart) => {
      const existingItem = prevCart.find((p) => p.id === item.id);
      if (existingItem) {
        return prevCart.map((p) =>
          p.id === item.id ? { ...p, quantity: (p.quantity ?? 0) + safeQuantity } : p
        );
      }
      return [...prevCart, { ...item, quantity: safeQuantity }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const clearCart = () => {
    setCart([]);
  };

  const contextValue: CartContextType = { cart, addToCart, removeFromCart, clearCart, setCart, updateQuantity, loading };

  return (
    <CartContext.Provider
      value={contextValue}
    >
      {children}
    </CartContext.Provider>
  );
};