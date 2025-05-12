-- Миграция: обновление схемы пользователей и добавление многоязычности

-- Обновление таблицы users
ALTER TABLE users
DROP COLUMN IF EXISTS full_name

ALTER TABLE users
ADD COLUMN IF NOT EXISTS password_hash TEXT,
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer';

-- Обновление таблицы categories
-- ALTER TABLE categories
-- COLUMN IF NOT EXISTS name_pl TEXT,
-- COLUMN IF NOT EXISTS name_ua TEXT,
-- COLUMN IF NOT EXISTS description_pl TEXT,
-- COLUMN IF NOT EXISTS description_ua TEXT;
ALTER TABLE products
DROP COLUMN IF EXISTS category;

-- Обновление таблицы products
ALTER TABLE products
ADD COLUMN IF NOT EXISTS name_pl TEXT,
ADD COLUMN IF NOT EXISTS name_ua TEXT,
ADD COLUMN IF NOT EXISTS name_ru TEXT,
ADD COLUMN IF NOT EXISTS description_pl TEXT,
ADD COLUMN IF NOT EXISTS description_ua TEXT,
ADD COLUMN IF NOT EXISTS description_ru TEXT,
ADD COLUMN IF NOT EXISTS category AS ENUM category_en,
ADD COLUMN IF NOT EXISTS ru_category AS ENUM category_ru,
ADD COLUMN IF NOT EXISTS ua_category AS ENUM category_ua,
ADD COLUMN IF NOT EXISTS pl_category AS ENUM category_pl,

-- Обновление таблицы shipping_methods
-- ALTER TABLE shipping_methods
-- ADD COLUMN IF NOT EXISTS name_pl TEXT,
-- ADD COLUMN IF NOT EXISTS name_ua TEXT,
-- ADD COLUMN IF NOT EXISTS description_pl TEXT,
-- ADD COLUMN IF NOT EXISTS description_ua TEXT;

-- Обновление таблицы cart_items
-- ALTER TABLE cart_items
-- DROP COLUMN IF EXISTS user_id,
-- ADD CONSTRAINT unique_product_in_cart UNIQUE (cart_id, product_id);

-- Откат миграции (если потребуется)
-- ROLLBACK;
