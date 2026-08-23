import { listarImoveisAlugadosDoUsuario } from "@/services/imoveis-service";

export async function listarImoveisAlugadosParaPagamento() {
  return listarImoveisAlugadosDoUsuario();
}
