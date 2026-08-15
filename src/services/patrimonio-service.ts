import { createClient } from "@/lib/supabase/server";
import type { ImovelStatus } from "@/services/imoveis-service";

export interface ResumoPatrimonio {
  totalEstimado: number;
  quantidadeImoveis: number;
  porStatus: Record<ImovelStatus, number>;
  rendimentoRecente: number;
}

const RENDIMENTO_DIAS = 30;

export async function buscarResumoPatrimonio(): Promise<ResumoPatrimonio> {
  const supabase = await createClient();

  const desde = new Date();
  desde.setDate(desde.getDate() - RENDIMENTO_DIAS);
  const desdeISO = desde.toISOString().slice(0, 10);

  const [{ data: imoveis, error: imoveisError }, { data: recebimentos, error: recError }] =
    await Promise.all([
      supabase.from("imoveis").select("valor_estimado, status"),
      supabase.from("recebimentos").select("valor").gte("data_recebimento", desdeISO),
    ]);

  if (imoveisError) throw new Error(imoveisError.message);
  if (recError) throw new Error(recError.message);

  const porStatus: Record<ImovelStatus, number> = {
    disponivel: 0,
    indisponivel: 0,
    alugado: 0,
    vendido: 0,
  };

  let totalEstimado = 0;
  for (const imovel of imoveis ?? []) {
    porStatus[imovel.status as ImovelStatus]++;
    totalEstimado += imovel.valor_estimado ?? 0;
  }

  const rendimentoRecente = (recebimentos ?? []).reduce(
    (acc, r) => acc + Number(r.valor),
    0
  );

  return {
    totalEstimado,
    quantidadeImoveis: imoveis?.length ?? 0,
    porStatus,
    rendimentoRecente,
  };
}
