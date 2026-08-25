import { buscarClientePorId } from "@/services/clientes-service";

export async function buscarCliente(id: number) {
  return buscarClientePorId(id);
}
