import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";
import "dotenv/config";
import { supabaseService as supabase } from "@/lib/supabase-client";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// Очистка таблицы
async function clearTable(tableName: string) {
  console.log(`Clearing table: ${tableName}`);
  const { data, error, count } = await supabase
    .from(tableName)
    .delete({ count: "exact" })
    .not("id", "is", null); // Удалить все строки
  await sleep(1000);

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
  await clearTable("users");
}
// 2. Сидинг продуктов
async function seedProducts() {
  const categories = ["Hats", "Scarves", "Combinations"];
  const products = Array.from({ length: 10 }, (_, i) => ({
    id: uuidv4(),
    name: faker.commerce.productName(),
    price: faker.commerce.price({ min: 10, max: 200, dec: 2 }),
    quantity: Math.floor(Math.random() * 20) + 1,
    // description: faker.commerce.productDescription(),
    images: [
      faker.image.url(),
      faker.image.url(),
      faker.image.url(),
      faker.image.url(),
    ],
    isSale: faker.datatype.boolean(),
    salePrice: faker.commerce.price({ min: 10, max: 200 }),
    isNew: faker.datatype.boolean(),
    category: categories[Math.floor(Math.random() * categories.length)],
    created_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from("products").insert(products);
  if (error) {
    console.error("Ошибка при добавлении продуктов:", error);
  } else {
    console.log("🧶 Добавлены 10 продуктов");
  }
}
// 3. Сидинг пользователей
async function seedUsers() {
  const users = Array.from({ length: 5 }, (_, i) => ({
    id: uuidv4(),
    email: `user${i + 1}@test.com`,
    password_hash: faker.internet.password(), // В реальном приложении используйте bcrypt
    role: i < 3 ? "customer" : "admin", // 3 customer, 2 admin
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
        status: "new",
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
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Сидирование
  await seedProducts();
  // await seedUsers();
  // await seedOrders();

  console.log("✅ Сидирование завершено!");
}

seed();
