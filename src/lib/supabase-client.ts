import { createClient } from '@supabase/supabase-js';

const isServer = typeof window === 'undefined';

// Поддержка Vite переменных
const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = isServer ? process.env.SUPABASE_SERVICE_ROLE_KEY : undefined;

// Проверка переменных
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase URL или Anon Key не определены. Проверь переменные окружения.');
}

// Публичный клиент (используется везде)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Серверный клиент (только для серверной части)
export const supabaseService = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Проверка подключения
export async function checkSupabaseConnection() {
  try {
    const { error } = await supabase.from('products').select('*').limit(1).single();

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Ошибка подключения к удалённому Supabase:', error.message);
      return false;
    }

    console.log('✅ Успешное подключение к удалённой Supabase');
    return true;
  } catch (err) {
    console.error('❌ Ошибка при проверке подключения к Supabase:', err);
    return false;
  }
}
