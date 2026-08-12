import { listarImoveisDoUsuario } from "@/services/imoveis-service";

export async function listarImoveis() {
  return listarImoveisDoUsuario();
}
