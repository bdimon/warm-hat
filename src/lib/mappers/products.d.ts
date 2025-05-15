// @/lib/mappers/product.ts

import { Product } from "@/types/Product";
import { RawProduct } from "@/types/RawProduct";

// Преобразование данных из API (из Supabase) → в форму/клиент
export function mapProductFromAPI(raw: RawProduct): Product {
  return {
    id: raw.id,
    name: raw.name_en || raw.name || "Без названия",
    description: raw.description_en || raw.description || "",
    price: raw.price,
    quantity: raw.quantity,
    images: raw.images || [],
    category: raw.category_en || "Прочее",
    isNew: raw.isnew,
    isSale: raw.issale,
    salePrice: raw.saleprice ?? undefined,
  };
}

// Обратное преобразование: форма/клиент → API (в Supabase)
export function mapProductToAPI(product: Product): RawProduct {
  return {
    id: product.id,
    name_en: product.name,
    description_en: product.description,
    price: product.price,
    quantity: product.quantity,
    images: product.images,
    category_en: product.category,
    isnew: product.isNew,
    issale: product.isSale,
    saleprice: product.salePrice ?? null,
  };
}
