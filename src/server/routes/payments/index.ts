import express from "express";
import { stripe } from "@/lib/stripe-client";
import { supabaseService } from "@/lib/supabase-client";

const router = express.Router();

// Добавим тестовый маршрут для проверки
router.get("/test", (req, res) => {
  console.log("Payments test route called");
  res.json({ status: "ok", message: "Payments API is working" });
});

// Изменяем маршрут с "/api/create-checkout-session" на "/create-checkout-session"
router.post("/create-checkout-session", async (req, res) => {
  console.log('Получен запрос на создание Checkout Session:', req.body);
  
  const { orderId, items } = req.body;
  
  if (!orderId || !items) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }
  
  try {
    // Преобразуем относительные URL изображений в абсолютные или пропускаем их
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'rub',
        product_data: {
          name: typeof item.name === 'object' ? item.name.ru || item.name.en : item.name,
          // Убираем изображения полностью
        },
        unit_amount: Math.round(
          typeof item.price === 'object'
            ? (item.price.ru || item.price.en || 0) * 100
            : item.price * 100
        ),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/cart`,
      metadata: {
        orderId,
      },
    });

    console.log('Сессия создана успешно:', session.id);
    
    // Обновляем заказ с данными платежа
    if (supabaseService) {
      await supabaseService
        .from('orders')
        .update({
          payment_intent: session.id,
          status: 'pending',
        })
        .eq('id', orderId);
    }

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Ошибка Stripe:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

export default router;
