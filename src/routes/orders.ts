import express from "express";
import { servbase as supabase } from "../lib/supabase";

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

export default router;
