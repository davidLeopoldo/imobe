import { buscarImovelPorId } from "@/services/imoveis-service";

export async function buscarImovel(id: number) {
  return buscarImovelPorId(id);
}
