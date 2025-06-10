Вот как можно реализовать защиту от повторных заказов ("double submit") на бэке:

---

## 1. Идемпотентность через orderId/token
- **Генерируй orderId (или идемпотентный токен) на фронте** и отправляй его вместе с заказом.
- **Перед созданием заказа на бэке**: проверь, есть ли уже заказ с таким orderId (или токеном) в базе.
    - Если есть — верни существующий заказ или ошибку "duplicate".
    - Если нет — создай заказ.

**Пример (Express + Supabase/Postgres):**
```typescript
router.post("/orders", async (req, res) => {
  const { orderId, ...orderData } = req.body;
  if (!orderId) return res.status(400).json({ error: "orderId required" });

  // Проверяем, нет ли уже такого заказа
  const { data: existing, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (existing) {
    return res.status(409).json({ error: "Order already exists", order: existing });
  }

  // Если нет — создаём новый
  const { data: created, error: createError } = await supabase
    .from("orders")
    .insert([{ id: orderId, ...orderData }])
    .single();

  if (createError) {
    return res.status(500).json({ error: createError.message });
  }
  res.status(201).json({ order: created });
});
```

---

## 2. Транзакция и уникальные ключи в базе
- Сделай `orderId` (или другой уникальный идентификатор заказа) уникальным в БД (PRIMARY KEY или UNIQUE INDEX).
- Если кто-то попытается создать дубликат, база вернёт ошибку, и ты обработаешь её как "duplicate".

---

## 3. Stripe/Payment идемпотентность
Если используешь Stripe, обязательно передавай [idempotency key](https://stripe.com/docs/api/idempotent_requests) в заголовке каждого запроса к Stripe, чтобы избежать двойных платежей.

**Пример:**
```typescript
await stripe.checkout.sessions.create(sessionData, {
  idempotencyKey: orderId,
});
```

---

## 4. Таймауты/блокировки (редко нужно)
— Например, временно блокируй пользователя по сессии/IP/уникальному ключу на 1-2 минуты после заказа.

---

## Итог:
**Лучший способ — использовать уникальный orderId (или токен) и делать его уникальным в базе.**
Это просто, безопасно и работает для любых сценариев (даже если клиент отправит 10 запросов подряд).

**Если нужен пример для конкретной БД или интеграции с Stripe — дай знать!**
