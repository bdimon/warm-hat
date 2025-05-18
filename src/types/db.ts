import { ProductInCart } from "./cart";

// types/db.ts
export type Profile = {
  id: string;
  full_name: string | null;
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

export type Order = {
  id: string;
  created_at: string;
  status: string | "created" | "pending" | "done" | "canceled";
  total: number;
  items: ProductInCart[];
  profile_id: string;
  customer_name?: string;
  customer_email?: string;
  customer_address?: string;
  customer_phone?: string;
  payment_method?: string;
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
