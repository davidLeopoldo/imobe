import { listarContratosDoUsuario } from "@/services/contratos-service";

export async function listarContratos() {
  return listarContratosDoUsuario();
}
