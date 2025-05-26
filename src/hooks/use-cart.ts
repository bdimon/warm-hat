import { useContext } from 'react';
import { CartContext } from '@/context/CartContext'; // Adjust path if necessary
import type { CartContextType } from '@/context/CartContext'; // Import the type

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart должен использоваться внутри CartProvider');
  }
  return context;
};
