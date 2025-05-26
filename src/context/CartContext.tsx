import { createContext } from 'react';
// import { CartContextType } from '@/types/cart-context';
import { ProductInCart } from '@/types/cart';

export interface CartContextType {
  cart: ProductInCart[];
  addToCart: (item: ProductInCart) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  setCart: (items: ProductInCart[]) => void;
  updateQuantity: (id: string, quantity: number) => void;
  loading: boolean;
}

 // Export CartContext so it can be used by the external useCart hook
 export const CartContext = createContext<CartContextType | undefined>(undefined);
