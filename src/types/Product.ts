/**
 * @typedef {string} SupportedLanguage
 * @description Поддерживаемые языки в приложении.
 * Используется для многоязычных строк и региональных цен.
 * @example
 * const language: SupportedLanguage = 'ru';
 */
export type SupportedLanguage = 'en' | 'ru' | 'ua' | 'pl';

/**
 * @typedef {Object} MultilingualString
 * @description Тип для хранения строк на разных языках.
 * Представляет собой объект, где ключи - коды языков, а значения - строки на соответствующем языке.
 * @example
 * const productName: MultilingualString = {
 *   en: 'Smartphone',
 *   ru: 'Смартфон',
 *   ua: 'Смартфон',
 *   pl: 'Smartfon'
 * };
 */
export type MultilingualString = Record<SupportedLanguage, string>;

/**
 * @typedef {Object} RegionalPrice
 * @description Тип для хранения цен в разных регионах/валютах.
 * Представляет собой объект, где ключи - коды языков (используются как идентификаторы регионов),
 * а значения - числовые значения цен в соответствующей валюте.
 * @example
 * const price: RegionalPrice = {
 *   en: 999.99, // цена в долларах
 *   ru: 89999.99, // цена в рублях
 *   ua: 36999.99, // цена в гривнах
 *   pl: 3999.99 // цена в злотых
 * };
 */
export type RegionalPrice = Record<SupportedLanguage, number>;

/**
 * @typedef {string} CurrencySymbol
 * @description Символы валют для разных регионов.
 * Используется для отображения цен с соответствующим символом валюты.
 */
export type CurrencySymbol = '$' | '₽' | '₴' | 'zł';

/**
 * @constant {Object} CURRENCY_SYMBOLS
 * @description Маппинг языков на символы валют.
 * Используется для получения символа валюты по коду языка.
 * @example
 * // Получение символа валюты для русского языка
 * const symbol = CURRENCY_SYMBOLS['ru']; // '₽'
 */
export const CURRENCY_SYMBOLS: Record<SupportedLanguage, CurrencySymbol> = {
  en: '$',
  ru: '₽',
  ua: '₴',
  pl: 'zł'
};

/**
 * @interface Product
 * @description Основной интерфейс продукта для использования в приложении.
 * Представляет продукт в том виде, в котором он используется в компонентах интерфейса.
 * Может содержать как локализованные, так и нелокализованные данные.
 * @property {string} id - Уникальный идентификатор продукта
 * @property {string|MultilingualString} name - Название продукта (может быть строкой или объектом с переводами)
 * @property {number|RegionalPrice} price - Цена продукта (может быть числом или объектом с ценами по регионам)
 * @property {number} quantity - Количество товара на складе
 * @property {string[]} images - Массив URL-адресов изображений продукта
 * @property {string} category - Категория продукта
 * @property {boolean} [isNew] - Флаг, указывающий, что продукт новый
 * @property {boolean} [isSale] - Флаг, указывающий, что продукт со скидкой
 * @property {number|RegionalPrice} [salePrice] - Цена со скидкой (может быть числом или объектом с ценами по регионам)
 * @see RawProduct - Исходный формат данных из базы данных
 * @see ProductInCart - Формат продукта в корзине
 * @example
 * const product: Product = {
 *   id: '123',
 *   name: { en: 'Smartphone', ru: 'Смартфон' },
 *   price: { en: 999.99, ru: 89999.99 },
 *   quantity: 10,
 *   images: ['image1.jpg', 'image2.jpg'],
 *   category: 'electronics',
 *   isNew: true,
 *   isSale: false
 * };
 */
export interface Product {
  id: string;
  name: string | MultilingualString;
  price: number | RegionalPrice;
  quantity: number;
  images: string[];
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  salePrice?: number | RegionalPrice;
}
 
/**
 * @interface RawProduct
 * @description Интерфейс для сырых данных продукта из базы данных.
 * Представляет продукт в том виде, в котором он хранится в базе данных Supabase.
 * Все текстовые и ценовые поля всегда многоязычные/региональные.
 * @property {string} id - Уникальный идентификатор продукта
 * @property {MultilingualString} name - Название продукта на разных языках
 * @property {RegionalPrice} price - Цена продукта в разных регионах
 * @property {number} quantity - Количество товара на складе
 * @property {string[]} images - Массив URL-адресов изображений продукта
 * @property {string} category - Категория продукта
 * @property {boolean} [isNew] - Флаг, указывающий, что продукт новый
 * @property {boolean} [isSale] - Флаг, указывающий, что продукт со скидкой
 * @property {RegionalPrice|null} [salePrice] - Цена со скидкой в разных регионах
 * @see Product - Формат продукта для использования в приложении
 * @see mapProductFromAPI - Функция для преобразования RawProduct в Product
 * @see mapProductToAPI - Функция для преобразования Product в RawProduct
 * @example
 * const rawProduct: RawProduct = {
 *   id: '123',
 *   name: { en: 'Smartphone', ru: 'Смартфон', ua: 'Смартфон', pl: 'Smartfon' },
 *   price: { en: 999.99, ru: 89999.99, ua: 36999.99, pl: 3999.99 },
 *   quantity: 10,
 *   images: ['image1.jpg', 'image2.jpg'],
 *   category: 'electronics',
 *   isNew: true,
 *   isSale: false,
 *   salePrice: null
 * };
 */
export interface RawProduct {
  id: string;
  name: MultilingualString;
  price: RegionalPrice;
  quantity: number;
  images: string[];
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  salePrice?: RegionalPrice | null;
}

/**
 * @interface ProductInCart
 * @description Тип для продукта в корзине покупок.
 * Содержит только необходимые для корзины поля продукта.
 * @property {string} id - Уникальный идентификатор продукта
 * @property {string} [user_id] - Идентификатор пользователя, которому принадлежит корзина
 * @property {string|MultilingualString} name - Название продукта
 * @property {number|RegionalPrice} price - Цена продукта
 * @property {number} quantity - Количество товара в корзине (не путать с quantity в Product, которое означает наличие на складе)
 * @property {boolean} [isSale] - Флаг, указывающий, что продукт со скидкой
 * @property {number|RegionalPrice} [salePrice] - Цена со скидкой
 * @property {string[]} images - Массив URL-адресов изображений продукта
 * @see Product - Полный формат продукта
 * @example
 * const cartItem: ProductInCart = {
 *   id: '123',
 *   user_id: 'user456',
 *   name: { en: 'Smartphone', ru: 'Смартфон' },
 *   price: { en: 999.99, ru: 89999.99 },
 *   quantity: 2, // Пользователь добавил 2 штуки в корзину
 *   isSale: true,
 *   salePrice: { en: 899.99, ru: 79999.99 },
 *   images: ['image1.jpg']
 * };
 */
export interface ProductInCart {
  id: string;
  user_id?: string;
  name: string | MultilingualString;
  price: number | RegionalPrice;
  quantity: number;
  isSale?: boolean;
  salePrice?: number | RegionalPrice;
  images: string[];
}
