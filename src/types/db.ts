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
  items: ProductRaw[];
  profile: Profile;
};