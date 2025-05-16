import express from "express";
import { supabase } from "@/lib/supabase";

const router = express.Router();

// 🔹 GET /api/users — получить всех пользователей
router.get("/", async (_req, res) => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 🔹 GET /api/users/:id — получить пользователя по ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return res.status(404).json({ error: "Пользователь не найден" });
  res.json(data);
});

// 🔹 DELETE /api/users/:id — удалить пользователя по ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Пользователь удалён" });
});

export default router;
