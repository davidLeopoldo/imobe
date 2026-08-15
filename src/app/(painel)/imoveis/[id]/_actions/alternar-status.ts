"use server";

import { revalidatePath } from "next/cache";
import {
  alternarStatusImovel,
  buscarImovelPorId,
  type ImovelStatus,
} from "@/services/imoveis-service";

const STATUS_VALIDOS: ImovelStatus[] = ["disponivel", "indisponivel", "alugado", "vendido"];

export async function alternarStatusAction(id: number, novoStatus: ImovelStatus) {
  if (!STATUS_VALIDOS.includes(novoStatus)) {
    return { message: "Status inválido." };
  }

  const imovel = await buscarImovelPorId(id);
  if (!imovel) {
    return { message: "Imóvel não encontrado." };
  }

  // Regra de negócio 11 (PRD v1.3): "alugado" exige para_aluguel, "vendido" exige para_venda.
  if (novoStatus === "alugado" && !imovel.para_aluguel) {
    return { message: "Este imóvel não está marcado para aluguel." };
  }
  if (novoStatus === "vendido" && !imovel.para_venda) {
    return { message: "Este imóvel não está marcado para venda." };
  }

  try {
    await alternarStatusImovel(id, novoStatus);
  } catch {
    return { message: "Não foi possível atualizar o status do imóvel." };
  }

  revalidatePath(`/imoveis/${id}`);
  revalidatePath("/imoveis");
}
