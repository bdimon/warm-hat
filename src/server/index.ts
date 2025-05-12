import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "@/routes/auth/register";
import loginRoute from "@/routes/auth/login";
import productsRoute from "@/routes/products/index";
import usersRoute from "@/routes/users/index";
import ordersRoute from "@/routes/orders/index";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth/register", authRouter);
app.use("/api/auth/login", loginRoute);
app.use("/api/products", productsRoute);
app.use("/api/users", usersRoute);
app.use("/api/orders", ordersRoute);

// const supabase = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// 🔁 Получить все товары
// app.get("/api/products", async (_, res) => {
//   const { data, error } = await supabase.from("products").select("*");
//   if (error) return res.status(500).json({ error: error.message });
//   res.json(data);
// });

// ➕ Добавить товар
// app.post("/api/products", async (req, res) => {
//   const product = { ...req.body, id: uuidv4() };
//   const { error } = await supabase.from("products").insert([product]);
//   if (error) return res.status(400).json({ error: error.message });
//   res.status(201).json(product);
// });

/** ---------------------- USERS ---------------------- **/

// 🔁 Получить всех пользователей
// app.get("/api/users", async (_, res) => {
//   const { data, error } = await supabase.from("users").select("*");
//   if (error) return res.status(500).json({ error: error.message });
//   res.json(data);
// });

/** ---------------------- ORDERS ---------------------- **/

// 🔁 Получить все заказы
// app.get("/api/orders", async (_, res) => {
//   const { data, error } = await supabase.from("orders").select("*");
//   if (error) return res.status(500).json({ error: error.message });
//   res.json(data);
// });

// ➕ Добавить заказ
// app.post("/api/orders", async (req, res) => {
//   const { user_id, items, total, status } = req.body;
//   const { error } = await supabase.from("orders").insert([
//     {
//       id: uuidv4(),
//       user_id,
//       items,
//       total,
//       status: status || "created",
//       created_at: new Date().toISOString(),
//     },
//   ]);
//   if (error) return res.status(400).json({ error: error.message });
//   res.status(201).json({ message: "Заказ создан" });
// });

/** ---------------------- AUTH ---------------------- **/
// app.use("/api/auth", authRouter);

// 🧪 Пример авторизации
// app.post("/api/auth/login", async (req, res) => {
//   const { email, password } = req.body;
//   const { data, error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   });

//   if (error) return res.status(401).json({ error: error.message });
//   res.json(data);
// });

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`🟢 API сервер запущен на http://localhost:${PORT}`);
});

