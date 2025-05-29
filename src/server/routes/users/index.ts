import express from "express";
import { supabaseService } from "@/lib/supabase"; // Используем supabaseService

const router = express.Router();

// Проверка, что supabaseService был инициализирован
router.use((_req, res, next) => {
  if (!supabaseService) {
    return res.status(503).json({ error: "Service client (supabaseService) not available. Check server configuration." });
  }
  next();
});
 
// 🔹 GET /api/users — получить всех пользователей
router.get("/", async (_req, res) => {
  // Используем API администратора для получения списка пользователей
  const { data: { users }, error } = await supabaseService!.auth.admin.listUsers();

  if (error) {
    console.error("Error listing users:", error);
    return res.status(500).json({ error: error.message });
  }
  res.json(users);
});

// 🔹 GET /api/users/:id — получить пользователя по ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  // Используем API администратора для получения пользователя по ID
  const { data: { user }, error } = await supabaseService!.auth.admin.getUserById(id);

  if (error) {
    console.error(`Error fetching user ${id}:`, error);
    // Ошибка может быть из-за неверного UUID или если пользователь не найден
    if (error.message.includes("User not found") || error.status === 404) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }
    return res.status(500).json({ error: error.message });
  }
  if (!user) {
    return res.status(404).json({ error: "Пользователь не найден" });
  }
  res.json(user);
});

// 🔹 DELETE /api/users/:id — удалить пользователя по ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  // Используем API администратора для удаления пользователя
  const { error } = await supabaseService!.auth.admin.deleteUser(id);

  if (error) {
    console.error(`Error deleting user ${id}:`, error);
    return res.status(500).json({ error: error.message });
  }
  res.json({ message: "Пользователь удалён" });
});

export default router;
