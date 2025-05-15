export interface RawProduct {
  id: string;
  name_en?: string;
  name?: string;
  description_en?: string;
  description?: string;
  price: number;
  quantity: number;
  images: string[];
  category_en?: string;
  category?: string;
  isnew?: boolean;
  issale?: boolean;
  saleprice?: number | null;
}
