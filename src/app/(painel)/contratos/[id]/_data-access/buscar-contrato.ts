import { buscarContratoPorId } from "@/services/contratos-service";

export async function buscarContrato(id: number) {
  return buscarContratoPorId(id);
}
