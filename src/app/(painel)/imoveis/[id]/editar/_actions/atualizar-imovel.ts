"use server";

import { redirect } from "next/navigation";
import { atualizarImovel, buscarImovelPorId } from "@/services/imoveis-service";
import { imovelSchema, paraNumeroOuNulo, type ImovelFormValues } from "@/lib/validations/imovel";

export async function atualizarImovelAction(id: number, input: ImovelFormValues) {
  const parsed = imovelSchema.safeParse(input);
  if (!parsed.success) {
    return { message: "Dados inválidos. Revise os campos destacados." };
  }

  const data = parsed.data;

  const imovelAtual = await buscarImovelPorId(id);
  if (!imovelAtual) {
    return { message: "Imóvel não encontrado." };
  }

  // Regra de negócio 11 (PRD v1.3): se o novo tipo não suporta mais o status atual
  // (ex.: estava "alugado" e paraAluguel virou false), volta para "disponível" em vez
  // de bloquear a edição.
  let avisoStatusResetado: string | null = null;
  if (imovelAtual.status === "alugado" && !data.paraAluguel) {
    avisoStatusResetado = "Status alterado para Disponível porque o imóvel deixou de ser para aluguel.";
  } else if (imovelAtual.status === "vendido" && !data.paraVenda) {
    avisoStatusResetado = "Status alterado para Disponível porque o imóvel deixou de ser para venda.";
  }

  try {
    await atualizarImovel(id, {
      para_venda: data.paraVenda,
      para_aluguel: data.paraAluguel,
      valor_venda: paraNumeroOuNulo(data.valorVenda),
      valor_aluguel: paraNumeroOuNulo(data.valorAluguel),
      valor_iptu: paraNumeroOuNulo(data.valorIptu),
      valor_estimado: paraNumeroOuNulo(data.valorEstimado),
      localizacao: data.localizacao || null,
      endereco: data.endereco,
      bairro: data.bairro,
      cidade: data.cidade,
      link_anuncio: data.linkAnuncio || null,
      ...(avisoStatusResetado ? { status: "disponivel" as const } : {}),
    });
  } catch {
    return { message: "Não foi possível salvar as alterações. Tente novamente." };
  }

  redirect(
    avisoStatusResetado
      ? `/imoveis/${id}?aviso=${encodeURIComponent(avisoStatusResetado)}`
      : `/imoveis/${id}`,
  );
}
