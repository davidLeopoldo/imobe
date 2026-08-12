"use server";

import { redirect } from "next/navigation";
import { criarImovel } from "@/services/imoveis-service";
import { imovelSchema, paraNumeroOuNulo, type ImovelFormValues } from "@/lib/validations/imovel";

export async function criarImovelAction(input: ImovelFormValues) {
  const parsed = imovelSchema.safeParse(input);
  if (!parsed.success) {
    return { message: "Dados inválidos. Revise os campos destacados." };
  }

  const data = parsed.data;
  let imovelId: number;

  try {
    const imovel = await criarImovel({
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
    });
    imovelId = imovel.id;
  } catch {
    return { message: "Não foi possível cadastrar o imóvel. Tente novamente." };
  }

  redirect(`/imoveis/${imovelId}`);
}
