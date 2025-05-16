import express from "express";
import { servbase as supabase } from "@/lib/supabase";

const router = express.Router();


router.post("/", async (req, res) => {
  const { 
    items, 
    total, 
    customer_address, 
    customer_email, 
    customer_name, 
    payment_method, 
    status } = req.body;

  if (
    !items ||
    !total ||
    !customer_name ||
    !customer_email ||
    !customer_address ||
    !payment_method
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  
//   if (!items || !total) {
//     return res.status(400).json({ error: "Missing order data" });
//   }

  const { error } = await supabase
    .from("orders")
    .insert([{ 
        items, 
        total, 
        customer_address, 
        customer_email, 
        customer_name, 
        payment_method, 
        status: status || "created"}]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ message: "Order created successfully" });
});
// routes/orders.ts
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error });
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

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ error });
  res.json(data);
});



export default router;
