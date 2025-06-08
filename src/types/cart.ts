// types/cart.ts
import { SupportedLanguage, MultilingualString, RegionalPrice } from '@/types/Product';
import { ProductInCart } from '@/types/Product';

// Реэкспорт для обратной совместимости
export type { ProductInCart };


// export type ProductInCart = {
//   id: string;
//   user_id?: string;
//   name: string | MultilingualString;
//   price: number | RegionalPrice;
//   quantity: number;
//   isSale?: boolean;
//   salePrice?: number | RegionalPrice;
//   images: string[];
// };
// Дополнительные типы, связанные с корзиной
export type CartAction = 
  | { type: 'ADD_ITEM'; payload: ProductInCart }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: ProductInCart[] };
