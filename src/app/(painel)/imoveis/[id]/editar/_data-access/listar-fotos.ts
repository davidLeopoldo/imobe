import { listarFotosComUrl } from "@/services/imovel-fotos-service";

export async function listarFotosDoImovelParaEdicao(imovelId: number) {
  return listarFotosComUrl(imovelId);
}
