import { createClient } from "@supabase/supabase-js";

// Vite só expõe variáveis com prefixo VITE_ (ver .env.local / Vercel)
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);