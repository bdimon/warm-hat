-- Миграция для добавления поддержки многоязычности и региональных цен

-- 1. Изменение типа поля name на JSONB
ALTER TABLE public.products 
  ALTER COLUMN name TYPE JSONB USING 
    jsonb_build_object('en', name);

-- 2. Изменение типа поля price на JSONB
ALTER TABLE public.products 
  ALTER COLUMN price TYPE JSONB USING 
    jsonb_build_object('en', price);

-- 3. Сначала удаляем значение по умолчанию для salePrice
ALTER TABLE public.products 
  ALTER COLUMN "salePrice" DROP DEFAULT;

-- 4. Затем изменяем тип поля salePrice на JSONB
ALTER TABLE public.products 
  ALTER COLUMN "salePrice" TYPE JSONB USING 
    CASE WHEN "salePrice" IS NOT NULL 
      THEN jsonb_build_object('en', "salePrice") 
      ELSE NULL 
    END;

-- 5. Добавление комментариев к полям для документации
COMMENT ON COLUMN public.products.name IS 'Название товара на разных языках в формате {en: "Hat", ru: "Шапка", ...}';
COMMENT ON COLUMN public.products.price IS 'Цены для разных регионов в формате {en: 20, ru: 1500, ...}';
COMMENT ON COLUMN public.products."salePrice" IS 'Цены со скидкой для разных регионов в формате {en: 15, ru: 1200, ...}';

-- 6. Создание индекса для ускорения поиска по переводам названий
CREATE INDEX idx_products_name ON public.products USING GIN (name);
