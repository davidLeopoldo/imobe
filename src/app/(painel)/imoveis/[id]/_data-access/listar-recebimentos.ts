import { listarRecebimentosDoImovel, type PeriodoFiltro } from "@/services/recebimentos-service";

export async function listarRecebimentos(imovelId: number, periodo: PeriodoFiltro) {
  return listarRecebimentosDoImovel(imovelId, periodo);
}
