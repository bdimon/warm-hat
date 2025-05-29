import { createClient } from "@supabase/supabase-js";

// Используем process.env для серверных переменных, если этот файл может исполняться на сервере.
// VITE_PUBLIC_SUPABASE_URL доступен и на клиенте, и на сервере во время сборки Vite.
const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY!;

// Клиент с публичным anon ключом (для операций, где RLS должен работать от имени пользователя или анонима)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Клиент с сервисным ключом (для операций на сервере, обходящих RLS)
// Убедитесь, что SUPABASE_SERVICE_ROLE_KEY установлена как переменная окружения на вашем сервере
// и НЕ имеет префикса VITE_
const supabaseServiceKey = typeof window === 'undefined' ? process.env.SUPABASE_SERVICE_ROLE_KEY : undefined;

export const supabaseService = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : undefined; // или можно выбросить ошибку, если ключ обязателен для работы сервера