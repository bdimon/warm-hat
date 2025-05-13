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


const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`🟢 API сервер запущен на http://localhost:${PORT}`);
});

