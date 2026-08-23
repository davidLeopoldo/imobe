import { listarFotosComUrl } from "@/services/imovel-fotos-service";

export async function listarFotosDoImovelParaDetalhe(imovelId: number) {
  return listarFotosComUrl(imovelId);
}
