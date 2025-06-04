
import { createClient } from "@supabase/supabase-js";

// URL и ключи для локального Supabase
const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = typeof window === 'undefined' ? process.env.SUPABASE_SERVICE_ROLE_KEY : undefined;

// Клиент с публичным anon ключом
export const supabaseLocal = createClient(supabaseUrl, supabaseAnonKey);

// Клиент с сервисным ключом (для операций на сервере)
export const supabaseLocalService = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Функция для проверки подключения
export async function checkSupabaseConnection() {
  try {
    // Проверяем, существует ли таблица products
    const { data, error } = await supabaseLocal
      .from('products')
      .select('count')
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Ошибка подключения к локальному Supabase:', error.message);
      return false;
    }
    
    console.log('Успешное подключение к локальному Supabase');
    return true;
  } catch (err) {
    console.error('Ошибка при проверке подключения к Supabase:', err);
    return false;
  }
}

