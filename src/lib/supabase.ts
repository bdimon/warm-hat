import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_PUBLIC_SUPABASE_URL! ||
  process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY! ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey =
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY! ||
  process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const servbase = createClient(supabaseUrl, supabaseServiceKey);