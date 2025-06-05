import { RawProduct, Product, SupportedLanguage, MultilingualString, RegionalPrice } from "@/types/Product";

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
    // description: raw.description || "",
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
    // description: product.description,
    price,
    quantity: product.quantity,
    images: product.images,
    category: product.category,
    isNew: product.isNew,
    isSale: product.isSale,
    salePrice,
  };
}

// Вспомогательная функция для получения значения для текущего языка
export function getLocalizedValue<T>(
  value: T | Record<SupportedLanguage, T>,
  language: SupportedLanguage = 'en',
  fallbackLanguage: SupportedLanguage = 'en'
): T {
  if (typeof value !== 'object' || value === null) {
    return value as T;
  }

  const typedValue = value as Record<SupportedLanguage, T>;
  
  // Пробуем получить значение для запрошенного языка
  if (typedValue[language] !== undefined) {
    return typedValue[language];
  }
  
  // Если значение для запрошенного языка отсутствует, используем запасной язык
  if (typedValue[fallbackLanguage] !== undefined) {
    return typedValue[fallbackLanguage];
  }
  
  // Если и запасной язык отсутствует, берем первое доступное значение
  const firstAvailableKey = Object.keys(typedValue)[0] as SupportedLanguage;
  return typedValue[firstAvailableKey] || ('' as unknown as T);
}
