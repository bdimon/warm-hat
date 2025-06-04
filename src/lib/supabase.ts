import { createClient } from "@supabase/supabase-js";

// Используем process.env для серверных переменных, если этот файл может исполняться на сервере.
// VITE_PUBLIC_SUPABASE_URL доступен и на клиенте, и на сервере во время сборки Vite.
const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY!;

// Клиент с публичным anon ключом (для операций, где RLS должен работать от имени пользователя или анонима)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Настройка прямого подключения к базе данных для серверных операций
export const dbConfig = {
  host: 'aws-0-us-east-2.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.sjnupqsbfcxpkiunahyy',
  password: process.env.SUPABASE_DB_PASSWORD,
  ssl: true,
  poolMode: 'transaction'
};

// Клиент с сервисным ключом (для операций на сервере, обходящих RLS)
const supabaseServiceKey = typeof window === 'undefined' ? process.env.SUPABASE_SERVICE_ROLE_KEY : undefined;

export const supabaseService = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : undefined; // или можно выбросить ошибку, если ключ обязателен для работы сервера
