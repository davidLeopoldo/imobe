import { createClient } from "@/lib/supabase/server";
import { requireUserId } from "@/lib/supabase/auth";

export interface Perfil {
  user_id: string;
  nome: string | null;
  telefone: string | null;
  instagram: string | null;
  tiktok: string | null;
  created_at: string;
  updated_at: string;
}

export type PerfilInput = Pick<Perfil, "nome" | "telefone" | "instagram" | "tiktok">;

export async function buscarPerfilDoUsuario() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("*").maybeSingle();

  if (error) throw new Error(error.message);
  return data as Perfil | null;
}

export async function buscarEmailDoUsuario() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return (data?.claims?.email as string | undefined) ?? "";
}

export async function salvarPerfil(input: PerfilInput) {
  const supabase = await createClient();
  const userId = await requireUserId(supabase);

  const { data, error } = await supabase
    .from("profiles")
    .upsert({ ...input, user_id: userId }, { onConflict: "user_id" })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as Perfil;
}
