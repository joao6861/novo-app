// src/lib/supabaseAdmin.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Instância única em memória
let supabaseAdminInstance: SupabaseClient | null = null;

/**
 * Retorna o cliente ADMIN do Supabase.
 * ⚠️ IMPORTANTE: usar APENAS em código de servidor
 * (rotas em /api, server actions, etc).
 */
export function getSupabaseAdmin() {
  if (!supabaseUrl || !serviceRoleKey) {
    console.warn("Supabase admin não configurado corretamente");
    return null;
  }

  if (supabaseAdminInstance) {
    return supabaseAdminInstance;
  }

  supabaseAdminInstance = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseAdminInstance;
}
