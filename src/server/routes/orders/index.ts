import express from "express";
import { supabase, supabaseService } from "@/lib/supabase-client"; // Импортируем оба клиента
import {Order} from "@/types/supabase";
import { RegionalPrice } from "@/types/Product";

  // Определяем тип для обогащенных данных заказа, который будет использоваться и для списка
interface EnrichedOrder extends Order {
  auth_user_email?: string;
}

const router = express.Router();

// Проверка, что supabaseService доступен для административных операций
router.use((req, res, next) => {
  // Предполагаем, что GET (все), GET (по ID админом), PATCH - админские
  if ((req.method === 'GET' || req.method === 'PATCH') && req.path !== '/' && !supabaseService) { // Пропускаем POST и корневой GET если он публичный
  }
  if ((req.method === 'PATCH' || (req.method === 'GET' && req.path === '/')) && !supabaseService) { // Если GET всех заказов - админский
    return res.status(503).json({ error: "Service client (supabaseService) not available for admin operations." });
  }
  next();
});

router.post("/", async (req, res) => {
  const { items, total, customer_address, customer_email, customer_name, payment_method, status } =
    req.body;

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

  // Дополнительная валидация (примеры)
  if (typeof total !== 'number' && typeof total !== 'object' || total <= 0) {
    return res.status(400).json({ error: "Invalid total amount" });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Items must be a non-empty array" });
  }
  // TODO: Добавить валидацию формата email, структуры items и т.д.

  // Convert total to RegionalPrice if it's a number
  const formattedTotal = typeof total === 'number' 
    ? { en: total, ru: total, ua: total, pl: total } // Create basic multilingual object
    : total;

  const { error } = await supabase.from('orders').insert([
    {
      items,
      total: formattedTotal,
      customer_address,
      customer_email,
      customer_name,
      payment_method,
      status: status || 'new',
    }, // Используем supabase (anon) для создания заказа, если это публичная операция
  ]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ message: 'Order created successfully' });
});

router.get("/", async (req, res) => {
  // Используем supabaseService для получения всех заказов (предполагается админ. операция)
  if (!supabaseService) {
    return res.status(503).json({ error: "Service client not configured for this operation." });
  }

  const { data: ordersData, error } = await supabaseService.from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Order[]>(); // Указываем, что ожидаем массив Order

  if (error) return res.status(500).json({ error: error.message });

  if (!ordersData) {
    return res.json([]); // Если нет данных, возвращаем пустой массив
  }

  // Обогащаем каждый заказ email-адресом пользователя
  const enrichedOrders: EnrichedOrder[] = await Promise.all(
    ordersData.map(async (order) => {
      const enrichedOrder: EnrichedOrder = { ...order };
      if (order.user_id) {
        const { data: { user: authUser } } = await supabaseService.auth.admin.getUserById(order.user_id);
        if (authUser) {
          enrichedOrder.auth_user_email = authUser.email;
        }
      }
      return enrichedOrder;
    })
  );


  if (error) return res.status(500).json({ error: error.message }); // Отправляем error.message
  res.json(enrichedOrders);
});

// 🔹 GET /api/orders/:id — получить заказ по ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  // Используем supabaseService для получения заказа по ID (предполагается админ. операция)
  // Если пользователь должен иметь доступ только к своим заказам, логика будет сложнее и потребует JWT
  if (!supabaseService)
    return res.status(503).json({ error: 'Service client not configured for this operation.' });

  const { data: orderData, error: orderError } = await supabaseService
    .from('orders')
    .select('*')
    .eq('id', id)
    .single<Order>();

  if (orderError || !orderData) {
    // Добавлена проверка !orderData
    return res.status(404).json({ error: 'Заказ не найден' });
  }

  const enrichedOrderData: EnrichedOrder = { ...orderData }; // Копируем данные заказа

  // Если у заказа есть user_id, пытаемся получить email пользователя из auth.users
  if (orderData.user_id) {
    try {
      const {
        data: { user: authUser },
        error: authUserError,
      } = await supabaseService.auth.admin.getUserById(orderData.user_id);
      if (!authUserError && authUser) {
        enrichedOrderData.auth_user_email = authUser.email; // Добавляем email пользователя
      } else if (authUserError) {
        console.warn(
          `Не удалось получить пользователя ${orderData.user_id} для заказа ${orderData.id}: ${authUserError.message}`
        );
      }
    } catch (e) {
      console.warn(
        `Исключение при получении пользователя ${orderData.user_id} для заказа ${orderData.id}:`,
        e
      );
    }
  }

  res.json(enrichedOrderData); // Отправляем обогащенные данные заказа
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  // Используем supabaseService для обновления статуса заказа (предполагается админ. операция)
  if (!supabaseService) return res.status(503).json({ error: "Service client not configured for this operation." });
  const { data, error } = await supabaseService.from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ error });
  res.json(data);
});

// 🔹 DELETE /api/orders/:id — удалить заказ
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!supabaseService) {
    return res.status(503).json({ error: "Service client not configured for this operation." });
  }

  const { error } = await supabaseService.from("orders").delete().eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Заказ успешно удален" });
});



export default router;
