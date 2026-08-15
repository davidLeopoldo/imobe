import type { SupabaseClient } from "@supabase/supabase-js";

export async function requireUserId(supabase: SupabaseClient): Promise<string> {
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || !userId) {
    throw new Error("Usuário não autenticado.");
  }

  return userId;
}
