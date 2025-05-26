import express from "express";
import { servbase as supabase } from "@/lib/supabase";
// import { v4 as uuidv4 } from "uuid";

const router = express.Router();
// 🔁 Получить все товары
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 20;
  const sortBy = (req.query.sortBy as string) || "created_at"; // поле сортировки
  const order = (req.query.order as string) === "asc" ? "asc" : "desc"; // направление

  const minPrice = parseInt(req.query.minPrice as string) || 0;
  const maxPrice =
    parseInt(req.query.maxPrice as string) || Number.MAX_SAFE_INTEGER;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .gte("price", minPrice)
    .lte("price", maxPrice)
    .order(sortBy, { ascending: order === "asc" })
    .range(from, to);

  if (error) return res.status(500).json({ error: error.message });

  res.json({
    data,
    pagination: {
      page,
      pageSize,
      total: count,
      totalPages: count ? Math.ceil(count / pageSize) : null,
    },
  });
});

// 🔹 GET /api/products/:id — получить товар по id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return res.status(404).json({ error: "Товар не найден" });
  res.json(data);
});
// ➕ Добавить товар
// 🔹 POST /api/products — создать товар
router.post("/", async (req, res) => {
  const { name, price, quantity, description, category, images } = req.body;
  const { error } = await supabase.from("products").insert([
    {
      name,
      price,
      quantity,
      description,
      category,
      images,
      isNew: true,
      isSale: false,
    },
  ]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: "Товар добавлен" });
});

// 🔹 PATCH /api/products/:id — обновить поля товара
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Проверка: если ничего не передано
  if (!updates || Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "Нет данных для обновления" });
  }

  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: "Ошибка при обновлении товара" });
  }

  res.json(data);
});


// 🔹 DELETE /api/products/:id — удалить товар
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Товар удален" });
});

export default router;
/** 
 * 1. GET /api/products — получить все товары
 * 2. GET /api/products/:id — получить товар по id
 * 3. POST /api/products — создать товар
 * 4. PUT /api/products/:id — обновить товар
 * 5. DELETE /api/products/:id — удалить товар
 * for thunderclient GET http://localhost:3010/api/products?page=2&pageSize=10
 * for thunderclient GET http://localhost:3010/api/products?page=2&pageSize=10
 */
