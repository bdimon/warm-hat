import express from "express";
import cors from "cors";
// import dotenv from "dotenv";
import authRouter from '@/server/routes/auth/register.ts';
import loginRouter from '@/server/routes/auth/login.ts';
import productsRouter from '@/server/routes/products/index.ts';
import usersRouter from '@/server/routes/users/index.ts';
import ordersRouter from '@/server/routes/orders/index.ts';
import paymentsRouter from '@/server/routes/payments/index.ts';

// dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
// Логирование запросов
// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//   next();
// });

// Добавьте этот middleware для отладки маршрутов
// app.use((req, res, next) => {
//   console.log(`[DEBUG] Запрос: ${req.method} ${req.url}`);
//   console.log(`[DEBUG] Тело запроса:`, req.body);
//   console.log(`[DEBUG] Заголовки:`, req.headers);
//   next();
// });




// Добавляем тестовый маршрут для проверки
app.get('/api/test', (req, res) => {
  console.log('Test endpoint called');
  res.json({ status: 'ok', message: 'API is working' });
});

app.use("/api/auth/register", authRouter);
app.use("/api/auth/login", loginRouter);
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);
app.use("/api/orders", ordersRouter);
app.use('/api/payments', paymentsRouter);

// Добавьте обработчик для несуществующих маршрутов
app.use((req, res) => {
  console.log(`[ERROR] Маршрут не найден: ${req.method} ${req.url}`);
  res.status(404).json({ error: `Маршрут ${req.method} ${req.url} не найден` });
});

console.time("🚀 Express server ready");

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.timeEnd("🚀 Express server ready");
  console.log(`🟢 API сервер запущен на http://localhost:${PORT}`);
});

