import express from "express";
import { supabase, supabaseService } from "@/lib/supabase-client"; // Импортируем оба клиента
import { Product, MultilingualString, RegionalPrice, RawProduct, SupportedLanguage } from "@/types/Product";
import { mapProductToAPI, mapProductFromAPI } from "@/lib/mappers/products";

const router = express.Router();

// Проверка, что supabaseService был инициализирован
router.use((req, res, next) => {
  if ((req.method === 'POST' || req.method === 'PATCH' || req.method === 'DELETE') && !supabaseService) {
    return res.status(503).json({ error: "Service client not available. Check server configuration." });
  }
  next();
});

// Интерфейс для валидации многоязычных данных продукта
interface ProductValidationData extends Partial<Product> {
  name?: string | MultilingualString;
  price?: number | RegionalPrice;
  salePrice?: number | RegionalPrice | undefined;
}

/**
 * Функция валидации многоязычных полей продукта
 * @param data - Данные продукта для валидации
 * @returns Массив строк с ошибками валидации или пустой массив, если ошибок нет
 */
const validateMultilingualData = (data: ProductValidationData): string[] => {
  const errors: string[] = [];
  
  // Проверка структуры name
  if (data.name && typeof data.name === 'object') {
    const nameObj = data.name as MultilingualString;
    if (!nameObj.en) {
      errors.push("Поле name должно содержать хотя бы английскую версию (en)");
    }
  }
  
  // Проверка структуры price
  if (data.price && typeof data.price === 'object') {
    const priceObj = data.price as RegionalPrice;
    if (!priceObj.en || typeof priceObj.en !== 'number') {
      errors.push("Поле price должно содержать хотя бы английскую версию (en) с числовым значением");
    }
    
    // Проверяем, что все значения price - числа
    Object.entries(priceObj).forEach(([lang, value]) => {
      if (typeof value !== 'number') {
        errors.push(`Цена для языка ${lang} должна быть числом`);
      }
    });
  }
  
  // Проверка структуры salePrice, если оно есть
  if (data.salePrice && typeof data.salePrice === 'object') {
    const salePriceObj = data.salePrice as RegionalPrice;
    if (!salePriceObj.en || typeof salePriceObj.en !== 'number') {
      errors.push("Поле salePrice должно содержать хотя бы английскую версию (en) с числовым значением");
    }
    
    // Проверяем, что все значения salePrice - числа
    Object.entries(salePriceObj).forEach(([lang, value]) => {
      if (typeof value !== 'number') {
        errors.push(`Цена со скидкой для языка ${lang} должна быть числом`);
      }
    });
  }
  
  return errors;
}

// 🔁 Получить все товары с поддержкой фильтрации по многоязычным полям
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 20;
  const sortBy = (req.query.sortBy as string) || "created_at"; // поле сортировки
  const order = (req.query.order as string) === "asc" ? "asc" : "desc"; // направление
  const language = (req.query.language as SupportedLanguage) || 'en'; // язык для фильтрации цены

  const minPrice = parseInt(req.query.minPrice as string) || 0;
  const maxPrice =
    parseInt(req.query.maxPrice as string) || Number.MAX_SAFE_INTEGER;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Используем JSON-путь для доступа к цене в указанной языковой версии
  const pricePath = `price->${language}`;
  
  // Формируем запрос с учетом многоязычных полей
  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .gte(pricePath, minPrice)
    .lte(pricePath, maxPrice);
  
  // Добавляем сортировку с учетом многоязычных полей
  if (sortBy === "price") {
    query = query.order(pricePath, { ascending: order === "asc" });
  } else if (sortBy === "name") {
    query = query.order(`name->${language}`, { ascending: order === "asc" });
  } else {
    query = query.order(sortBy, { ascending: order === "asc" });
  }
  
  // Применяем пагинацию
  query = query.range(from, to);
  
  const { data, error, count } = await query;

  if (error) return res.status(500).json({ error: error.message });

  // Преобразуем сырые данные из БД в формат для клиента
  const mappedData = data.map(item => mapProductFromAPI(item as RawProduct));

  res.json({
    data: mappedData,
    pagination: {
      page,
      pageSize,
      total: count,
      totalPages: count ? Math.ceil(count / pageSize) : null,
    },
  });
});
 
// 🔹 GET /api/products/:id — получить товар по id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) return res.status(404).json({ error: "Товар не найден" });
  
  // Преобразуем сырые данные из БД в формат для клиента
  const mappedData = mapProductFromAPI(data as RawProduct);
  
  res.json(mappedData);
});

// ➕ Добавить товар
// 🔹 POST /api/products — создать товар
router.post("/", async (req, res) => {
  const productData: ProductValidationData = req.body;
  
  // Валидация многоязычных данных
  const validationErrors = validateMultilingualData(productData);
  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }
  
  // Преобразуем данные из клиентского формата в формат для БД
  const rawProductData = mapProductToAPI(productData as Product);
  
  const { error } = await supabaseService.from("products").insert([rawProductData]);
  
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: "Товар добавлен" });
});

// 🔹 PATCH /api/products/:id — обновить поля товара
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const updates: ProductValidationData = req.body;

  // Проверка: если ничего не передано
  if (!updates || Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "Нет данных для обновления" });
  }
  
  // Валидация многоязычных данных
  const validationErrors = validateMultilingualData(updates);
  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }
  
  // Получаем текущие данные продукта
  const { data: currentProduct, error: fetchError } = await supabaseService
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
    
  if (fetchError) {
    console.error(fetchError);
    return res.status(404).json({ error: "Товар не найден" });
  }
  
  // Преобразуем текущие данные из БД в клиентский формат
  const currentProductMapped = mapProductFromAPI(currentProduct as RawProduct);
  
  // Объединяем текущие данные с обновлениями
  const mergedProduct: Product = {
    ...currentProductMapped,
    ...updates,
    // Для многоязычных полей выполняем глубокое объединение
    name: typeof updates.name === 'object' 
      ? { ...currentProductMapped.name as MultilingualString, ...updates.name as MultilingualString }
      : updates.name || currentProductMapped.name,
    price: typeof updates.price === 'object'
      ? { ...currentProductMapped.price as RegionalPrice, ...updates.price as RegionalPrice }
      : updates.price || currentProductMapped.price,
    salePrice: updates.salePrice === undefined 
      ? currentProductMapped.salePrice
      : typeof updates.salePrice === 'object'
        ? { ...currentProductMapped.salePrice as RegionalPrice, ...updates.salePrice as RegionalPrice }
        : updates.salePrice
  };
  
  // Преобразуем объединенные данные обратно в формат для БД
  const rawUpdates = mapProductToAPI(mergedProduct);
  
  // Выполняем обновление в БД
  const { data, error } = await supabaseService
    .from("products")
    .update(rawUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: "Ошибка при обновлении товара" });
  }

  // Преобразуем обновленные данные из БД в клиентский формат для ответа
  const updatedProductMapped = mapProductFromAPI(data as RawProduct);
  
  res.json(updatedProductMapped);
});


// 🔹 DELETE /api/products/:id — удалить товар
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabaseService.from("products").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Товар удален" });
});

export default router;
/** 
 * 1. GET /api/products — получить все товары
 * 2. GET /api/products/:id — получить товар по id
 * 3. POST /api/products — создать товар
 * 4. PUT /api/products/:id — обновить товар
 * 5. DELETE /api/products/:id — удалить товар
 * for thunderclient GET http://localhost:3010/api/products?page=2&pageSize=10
 * for thunderclient GET http://localhost:3010/api/products?page=2&pageSize=10
 */
