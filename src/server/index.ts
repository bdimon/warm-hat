import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth/register";
import loginRouter from "./routes/auth/login";
import productsRouter from "./routes/products";
import usersRouter from "./routes/users";
import ordersRouter from "./routes/orders";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth/register", authRouter);
app.use("/api/auth/login", loginRouter);
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);
app.use("/api/orders", ordersRouter);

console.time("🚀 Express server ready");

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.timeEnd("🚀 Express server ready");
  console.log(`🟢 API сервер запущен на http://localhost:${PORT}`);
});

