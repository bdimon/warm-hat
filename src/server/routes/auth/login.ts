import express from "express";
import { supabase } from "@/lib/supabase-client";

const router = express.Router();

// Убираем "/login" из пути, так как он уже указан в index.ts
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email и пароль обязательны" });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  return res.status(200).json({ user: data.user, session: data.session });
});

export default router;
