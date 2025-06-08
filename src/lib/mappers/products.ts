import { RawProduct, Product, SupportedLanguage, MultilingualString, RegionalPrice, CURRENCY_SYMBOLS } from "@/types/Product";

// Преобразование данных из API (из Supabase) → в форму/клиент
export function mapProductFromAPI(raw: RawProduct): Product {
  // Проверяем, является ли name объектом и преобразуем его
  const name = typeof raw.name === 'object' && raw.name !== null
    ? raw.name as MultilingualString
    : { en: raw.name as unknown as string || "Без названия" } as MultilingualString;

  // Проверяем, является ли price объектом и преобразуем его
  const price = typeof raw.price === 'object' && raw.price !== null
    ? raw.price as RegionalPrice
    : { en: raw.price as unknown as number } as RegionalPrice;

  // Проверяем, является ли salePrice объектом и преобразуем его
  const salePrice = raw.salePrice === null
    ? undefined
    : typeof raw.salePrice === 'object' && raw.salePrice !== null
      ? raw.salePrice as RegionalPrice
      : { en: raw.salePrice as unknown as number } as RegionalPrice;

  return {
    id: raw.id,
    name,
    price,
    quantity: raw.quantity,
    images: raw.images || [],
    category: raw.category,
    isNew: raw.isNew,
    isSale: raw.isSale,
    salePrice,
  };
}

// Обратное преобразование: форма/клиент → API (в Supabase)
export function mapProductToAPI(product: Product): RawProduct {
  // Преобразуем name в MultilingualString
  const name = typeof product.name === 'string'
    ? { en: product.name } as MultilingualString
    : product.name as MultilingualString;

  // Преобразуем price в RegionalPrice
  const price = typeof product.price === 'number'
    ? { en: product.price } as RegionalPrice
    : product.price as RegionalPrice;

  // Преобразуем salePrice в RegionalPrice или null
  const salePrice = product.salePrice === undefined
    ? null
    : typeof product.salePrice === 'number'
      ? { en: product.salePrice } as RegionalPrice
      : product.salePrice as RegionalPrice;

  return {
    id: product.id,
    name,
    price,
    quantity: product.quantity,
    images: product.images,
    category: product.category,
    isNew: product.isNew,
    isSale: product.isSale,
    salePrice,
  };
}

// Получение локализованного значения из многоязычного объекта
export function getLocalizedValue<T>(
  value: T | Record<SupportedLanguage, T>,
  language: SupportedLanguage = 'en'
): T {
  if (typeof value === 'object' && value !== null && language in (value as Record<string, T>)) {
    return (value as Record<SupportedLanguage, T>)[language];
  }
  
  // Если значение не объект или нет нужного языка, возвращаем само значение
  return value as T;
}

// Форматирование цены с учетом валюты
export function formatPrice(
  price: number | RegionalPrice,
  language: SupportedLanguage = 'en'
): string {
  const numericPrice = typeof price === 'number' 
    ? price 
    : getLocalizedValue(price, language);
    
  return `${numericPrice} ${CURRENCY_SYMBOLS[language]}`;
}
