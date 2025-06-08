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

// Добавьте маршрут для проверки статуса платежа
router.get("/check-status", async (req, res) => {
  const { session_id } = req.query;
  
  if (!session_id) {
    return res.status(400).json({ error: 'Missing session_id parameter' });
  }
  
  try {
    // Получаем сессию из Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id as string);
    
    // Если платеж успешен, обновляем статус заказа
    if (session.payment_status === 'paid' && session.metadata?.orderId && supabaseService) {
      await supabaseService
        .from('orders')
        .update({
          status: 'paid',
        })
        .eq('id', session.metadata.orderId);
    }
    
    res.json({ 
      success: true, 
      paymentStatus: session.payment_status,
      orderId: session.metadata?.orderId 
    });
  } catch (error) {
    console.error('Ошибка при проверке статуса платежа:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Добавьте обработчик webhook для Stripe
router.post("/webhook", express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Обработка успешного платежа
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Обновляем статус заказа на 'paid'
    if (supabaseService && session.metadata.orderId) {
      await supabaseService
        .from('orders')
        .update({
          status: 'paid',
        })
        .eq('id', session.metadata.orderId);
    }
  }

  res.json({received: true});
});

export default router;
