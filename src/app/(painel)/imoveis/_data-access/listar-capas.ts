import { buscarCapasDosImoveis } from "@/services/imovel-fotos-service";

export async function listarCapasDosImoveis(imovelIds: number[]) {
  return buscarCapasDosImoveis(imovelIds);
}
