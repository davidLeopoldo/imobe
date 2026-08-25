import { listarClientesDoUsuario } from "@/services/clientes-service";

export async function listarClientes() {
  return listarClientesDoUsuario();
}
