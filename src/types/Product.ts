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
 
export interface RawProduct {
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
