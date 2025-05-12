-- Включаем RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Таблица products
DROP POLICY IF EXISTS "Allow read access to products" ON products;
CREATE POLICY "Allow read access to products"
  ON products
  FOR SELECT
  TO public
  USING (true);

-- Таблица users
DROP POLICY IF EXISTS "Allow read access to users" ON users;
CREATE POLICY "Allow read access to users"
  ON users
  FOR SELECT
  TO public
  USING (true);

-- Таблица orders
DROP POLICY IF EXISTS "Read own orders" ON orders;
CREATE POLICY "Read own orders"
  ON orders
  FOR SELECT
  TO public
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Insert order for self" ON orders;
CREATE POLICY "Insert order for self"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Update order for self" ON orders;
CREATE POLICY "Update order for self"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);