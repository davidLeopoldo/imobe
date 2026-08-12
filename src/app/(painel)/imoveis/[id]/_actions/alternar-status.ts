"use server";

import { revalidatePath } from "next/cache";
import { alternarStatusImovel, type ImovelStatus } from "@/services/imoveis-service";

export async function alternarStatusAction(id: number, statusAtual: ImovelStatus) {
  const novoStatus: ImovelStatus = statusAtual === "disponivel" ? "indisponivel" : "disponivel";

  try {
    await alternarStatusImovel(id, novoStatus);
  } catch {
    return { message: "Não foi possível atualizar o status do imóvel." };
  }

  revalidatePath(`/imoveis/${id}`);
  revalidatePath("/imoveis");
}
