// @/types/ProductRaw.ts
export interface ProductRaw {
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
}
