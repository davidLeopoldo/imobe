"use server";

import { buscarImovelPorId } from "@/services/imoveis-service";
import { criarRecebimento } from "@/services/recebimentos-service";
import {
  pagamentoRapidoSchema,
  type PagamentoRapidoFormValues,
} from "@/lib/validations/pagamento-rapido";

function hojeISO() {
  return new Date().toISOString().slice(0, 10);
}

export async function registrarPagamentoRapidoAction(input: PagamentoRapidoFormValues) {
  const parsed = pagamentoRapidoSchema.safeParse(input);
  if (!parsed.success) {
    return { message: "Dados inválidos. Revise os campos." };
  }

  const { imovelId, mesReferencia, valor } = parsed.data;

  const imovel = await buscarImovelPorId(imovelId);
  if (!imovel || imovel.status !== "alugado") {
    return { message: "Este imóvel não está mais disponível para essa ação." };
  }

  try {
    await criarRecebimento(imovelId, {
      valor: Number(valor),
      mes_referencia: `${mesReferencia}-01`,
      data_recebimento: hojeISO(),
      observacao: null,
    });
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível registrar o pagamento. Tente novamente.",
    };
  }

  return { success: true as const };
}
