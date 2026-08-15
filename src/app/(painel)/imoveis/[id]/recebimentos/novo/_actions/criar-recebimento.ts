"use server";

import { redirect } from "next/navigation";
import { criarRecebimento } from "@/services/recebimentos-service";
import {
  recebimentoSchema,
  type RecebimentoFormValues,
} from "@/lib/validations/recebimento";

export async function criarRecebimentoAction(
  imovelId: number,
  input: RecebimentoFormValues
) {
  const parsed = recebimentoSchema.safeParse(input);
  if (!parsed.success) {
    return { message: "Dados inválidos. Revise os campos destacados." };
  }

  const data = parsed.data;

  try {
    await criarRecebimento(imovelId, {
      valor: Number(data.valor),
      mes_referencia: `${data.mesReferencia}-01`,
      data_recebimento: data.dataRecebimento,
      observacao: data.observacao || null,
    });
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível registrar o recebimento. Tente novamente.",
    };
  }

  redirect(`/imoveis/${imovelId}`);
}
