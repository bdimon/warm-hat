import express from "express";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// 🔹 GET /api/orders — получить все заказы
router.get("/", async (_req, res) => {
  const { data, error } = await supabase.from("orders").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 🔹 GET /api/orders/:id — получить заказ по ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return res.status(404).json({ error: "Заказ не найден" });
  res.json(data);
});

// 🔹 POST /api/orders — создать новый заказ
router.post("/", async (req, res) => {
  const { user_id, items, total, status } = req.body;

  const { error } = await supabase.from("orders").insert([
    {
      id: uuidv4(),
      user_id,
      items, // тип jsonb: массив объектов с product_id и quantity
      total,
      status: status || "created",
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: "Заказ создан" });
});

// 🔹 DELETE /api/orders/:id — удалить заказ
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Заказ удалён" });
});

export default router;
