import { createClient } from "@/lib/supabase/server";
import { requireUserId } from "@/lib/supabase/auth";

export interface Recebimento {
  id: number;
  imovel_id: number;
  user_id: string;
  valor: number;
  mes_referencia: string;
  data_recebimento: string;
  observacao: string | null;
  created_at: string;
  updated_at: string;
}

export type RecebimentoInput = Pick<
  Recebimento,
  "valor" | "mes_referencia" | "data_recebimento" | "observacao"
>;

export type PeriodoFiltro = "mes" | "6meses" | "12meses";

function calcularDataInicial(periodo: PeriodoFiltro): string {
  const hoje = new Date();
  const mesesAtras = periodo === "mes" ? 0 : periodo === "6meses" ? 5 : 11;
  const data = new Date(hoje.getFullYear(), hoje.getMonth() - mesesAtras, 1);
  return data.toISOString().slice(0, 10);
}

export async function listarRecebimentosDoImovel(
  imovelId: number,
  periodo: PeriodoFiltro
) {
  const supabase = await createClient();
  const desde = calcularDataInicial(periodo);

  const { data, error } = await supabase
    .from("recebimentos")
    .select("*")
    .eq("imovel_id", imovelId)
    .gte("mes_referencia", desde)
    .order("mes_referencia", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Recebimento[];
}

export async function criarRecebimento(imovelId: number, input: RecebimentoInput) {
  const supabase = await createClient();
  const userId = await requireUserId(supabase);

  const { data, error } = await supabase
    .from("recebimentos")
    .insert({ ...input, imovel_id: imovelId, user_id: userId })
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("Já existe um recebimento registrado para este mês.");
    }
    throw new Error(error.message);
  }

  return data as Recebimento;
}
