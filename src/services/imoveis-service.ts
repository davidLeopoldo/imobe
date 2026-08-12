import { createClient } from "@/lib/supabase/server";

export type ImovelStatus = "disponivel" | "indisponivel" | "alugado" | "vendido";

export interface Imovel {
  id: number;
  user_id: string;
  para_venda: boolean;
  para_aluguel: boolean;
  valor_venda: number | null;
  valor_aluguel: number | null;
  valor_iptu: number | null;
  valor_estimado: number | null;
  localizacao: string | null;
  endereco: string;
  bairro: string;
  cidade: string;
  link_anuncio: string | null;
  status: ImovelStatus;
  created_at: string;
  updated_at: string;
}

export type ImovelInput = Pick<
  Imovel,
  | "para_venda"
  | "para_aluguel"
  | "valor_venda"
  | "valor_aluguel"
  | "valor_iptu"
  | "valor_estimado"
  | "localizacao"
  | "endereco"
  | "bairro"
  | "cidade"
  | "link_anuncio"
>;

export async function listarImoveisDoUsuario() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("imoveis")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Imovel[];
}

export async function buscarImovelPorId(id: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("imoveis")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Imovel | null;
}

export async function criarImovel(input: ImovelInput) {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    throw new Error("Usuário não autenticado.");
  }

  const { data, error } = await supabase
    .from("imoveis")
    .insert({ ...input, user_id: userId })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as Imovel;
}

export async function atualizarImovel(id: number, input: ImovelInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("imoveis")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as Imovel;
}

export async function alternarStatusImovel(id: number, status: ImovelStatus) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("imoveis")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as Imovel;
}
