import { RawProduct, Product } from "@/types/Product";

// Преобразование данных из API (из Supabase) → в форму/клиент
export function mapProductFromAPI(raw: RawProduct): Product {
  return {
    id: raw.id,
    name: raw.name || "Без названия",
    // description: raw.description || "",
    price: raw.price,
    quantity: raw.quantity,
    images: raw.images || [],
    category: raw.category,
    isNew: raw.isNew,
    isSale: raw.isSale,
    salePrice: raw.salePrice ?? undefined,
  };
}

// Обратное преобразование: форма/клиент → API (в Supabase)
export function mapProductToAPI(product: Product): RawProduct {
  return {
    id: product.id,
    name: product.name,
    // description: product.description,
    price: product.price,
    quantity: product.quantity,
    images: product.images,
    category: product.category,
    isNew: product.isNew,
    isSale: product.isSale,
    salePrice: product.salePrice ?? null,
  };
}
