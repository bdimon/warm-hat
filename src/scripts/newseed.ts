import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";


const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Очистка таблицы
async function clearTable(tableName: string) {
  console.log(`Clearing table: ${tableName}`);
  const { data, error, count } = await supabase
    .from(tableName)
    .delete({ count: "exact" })
    .not("id", "is", null); // Удалить все строки

  if (error) {
    console.error(`❌ Ошибка при очистке таблицы ${tableName}:`, error);
  } else {
    console.log(`🧹 Таблица ${tableName} очищена. Удалено строк: ${count}`);
  }
}

// Очистка таблиц
async function clearTables() {
  await clearTable("orders");
  await clearTable("products");
  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });
  console.log("🧮 Продуктов осталось:", count);
  await clearTable("users");
  await new Promise((res) => setTimeout(res, 1000));
}
// 2. Сидинг продуктов
async function seedProducts() {
  const products = Array.from({ length: 10 }, (_, i) => ({
    id: uuidv4(),
    name: `Продукт #${i + 1}`,
    price: Math.floor(Math.random() * 3000) + 500,
    quantity: Math.floor(Math.random() * 20) + 1,
    description: `Описание продукта #${i + 1}`,
    images: [
      `https://via.placeholder.com/300x300.png?text=Item+${i + 1}`,
      `https://via.placeholder.com/300x300.png?text=Item+${i + 1}+Alt`,
      `https://via.placeholder.com/300x300.png?text=Item+${i + 1}+Alt`,
    ],
  }));

  const { error } = await supabase.from("products").insert(products);
  if (error) {
    console.error("Ошибка при добавлении продуктов:", error);
  } else {
    console.log("🧶 Добавлены 100 продуктов");
  }
}
// 3. Сидинг пользователей
async function seedUsers() {
  const users = Array.from({ length: 5 }, (_, i) => ({
    id: uuidv4(),
    email: `user${i + 1}@test.com`,
    full_name: `Пользователь ${i + 1}`,
    created_at: new Date().toISOString(),
  }));
  const { error } = await supabase.from("users").insert(users);
  if (error) {
    console.error("Ошибка при добавлении пользователей:", error);
  } else {
    console.log("👤 Добавлены 5 пользователей");
  }
}

// 4. Сидинг заказов
async function seedOrders() {
  const users = await supabase.from("users").select("id");
  if (users.data) {
    const orders = users.data.flatMap((user) =>
      Array.from({ length: 2 }, () => ({
        id: uuidv4(),
        user_id: user.id,
        total: Math.floor(Math.random() * 5000) + 1000,
        status: "created",
        items: {
          quantity: Math.floor(Math.random() * 5) + 1,
          price: Math.floor(Math.random() * 3000) + 500,
        },
        created_at: new Date().toISOString(),
      }))
    );
    const { error } = await supabase.from("orders").insert(orders);
    if (error) {
      console.error("Ошибка при добавлении заказов:", error);
    } else {
      console.log("📦 Добавлены 10 заказов");
    }
  } else {
    console.error("Ошибка при получении пользователей:", users.error);
  }
}

async function seed() {
  console.log("🔁 Начинаем сидирование...");

  // Очистка таблиц
  clearTables();

  // Сидирование
  // await seedProducts();
  // await seedUsers();
  // await seedOrders();

  console.log("✅ Сидирование завершено!");
}

seed();
