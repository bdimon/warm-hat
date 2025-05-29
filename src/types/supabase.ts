// types/supabase.ts
import { ProductInCart } from './cart';

export type Profile = {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
};

export type ProductRaw = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  images: string[];
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  salePrice?: number | null;
};

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

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  images: string[];
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  salePrice?: number;
}
