// types/cart.ts
export type ProductInCart = {
  id: string;
  user_id?: string;
  name: string;
  price: number;
  quantity: number;
  isSale?: boolean;
  salePrice?: number;
  images?: string[];
};
