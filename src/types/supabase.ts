// types/supabase.ts
import { ProductInCart, SupportedLanguage, Product, RawProduct } from '@/types/Product';

export type Profile = {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
};

// Используем тип RawProduct из Product.ts
export type ProductRaw = RawProduct;

type OrderStatus = 'new' | 'pending' | 'paid' | 'delivered';

export type Order = {
  id: string;
  created_at: string;
  status: OrderStatus;
  total: number;
  items: ProductInCart[];
  user_id: string;
  name?: string;
  customer_email?: string;
  address?: string;
  phone?: string;
  payment_method: string;
};

// Используем тип Product из Product.ts
export type { Product,SupportedLanguage };
