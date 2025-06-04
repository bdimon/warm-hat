import { createClient } from "@supabase/supabase-js";

// Определяем, находимся ли мы в режиме разработки
const isDevelopment = import.meta.env.DEV;

// URL и ключи для Supabase - используем одни и те же переменные
// но их значения будут разными в .env.development и .env.production
const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY!;

// Сервисный ключ (только для серверной части)
const supabaseServiceKey = typeof window === 'undefined' 
  ? process.env.SUPABASE_SERVICE_ROLE_KEY
  : undefined;

// Клиент с публичным anon ключом
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Клиент с сервисным ключом (для операций на сервере)
export const supabaseService = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Функция для проверки подключения
export async function checkSupabaseConnection() {
  try {
    // Проверяем, существует ли таблица products
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error(`Ошибка подключения к ${isDevelopment ? 'локальному' : 'удаленному'} Supabase:`, error.message);
      return false;
    }
    
    console.log(`Успешное подключение к ${isDevelopment ? 'локальному' : 'удаленному'} Supabase`);
    return true;
  } catch (err) {
    console.error(`Ошибка при проверке подключения к Supabase:`, err);
    return false;
  }
}

// Экспортируем информацию о текущем окружении
export const supabaseEnv = {
  isDevelopment,
  url: supabaseUrl
};