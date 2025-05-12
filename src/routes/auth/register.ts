import express from "express";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email и пароль обязательны" });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json({ user: data.user, session: data.session });
});

export default router;
/*Отключи подтверждение email в настройках проекта Supabase:

Перейди в Supabase → Authentication → Settings → Email Auth.

Отключи галочку Enable email confirmations (или Confirm email).

Сохрани изменения.*/