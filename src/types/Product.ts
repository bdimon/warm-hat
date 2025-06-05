// Добавим новый тип для поддерживаемых языков
export type SupportedLanguage = 'en' | 'ru' | 'ua' | 'pl';

// Тип для многоязычных строк
export type MultilingualString = Record<SupportedLanguage, string>;

// Тип для региональных цен
export type RegionalPrice = Record<SupportedLanguage, number>;

// Основной интерфейс продукта для использования в приложении
export interface Product {
  id: string;
  name: string | MultilingualString;
  description?: string;
  price: number | RegionalPrice;
  quantity: number;
  images: string[];
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  salePrice?: number | RegionalPrice;
}
 
// Интерфейс для сырых данных продукта из базы данных
export interface RawProduct {
  id: string;
  name: MultilingualString;
  description?: string;
  price: RegionalPrice;
  quantity: number;
  images: string[];
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  salePrice?: RegionalPrice | null;
}
