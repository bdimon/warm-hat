// types/cart.ts
import { SupportedLanguage, MultilingualString, RegionalPrice } from '@/types/Product';

export type ProductInCart = {
  id: string;
  user_id?: string;
  name: string | MultilingualString;
  price: number | RegionalPrice;
  quantity: number;
  isSale?: boolean;
  salePrice?: number | RegionalPrice;
  images: string[];
};
