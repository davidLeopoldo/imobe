import { z } from "zod";
import { optionalMoneyString } from "./money";

export { optionalMoneyString, paraNumeroOuNulo } from "./money";

export const imovelSchema = z
  .object({
    paraVenda: z.boolean(),
    paraAluguel: z.boolean(),
    valorVenda: optionalMoneyString,
    valorAluguel: optionalMoneyString,
    valorIptu: optionalMoneyString,
    valorEstimado: optionalMoneyString,
    localizacao: z.string().optional(),
    endereco: z.string().min(3, { error: "Informe o endereço completo." }),
    bairro: z.string().min(2, { error: "Informe o bairro." }),
    cidade: z.string().min(2, { error: "Informe a cidade." }),
    linkAnuncio: z
      .union([z.url({ error: "Informe uma URL válida." }), z.literal("")])
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.paraVenda && !data.paraAluguel) {
      ctx.addIssue({
        code: "custom",
        path: ["paraVenda"],
        message: "Selecione venda, aluguel ou ambos.",
      });
    }
    if (data.paraVenda && !data.valorVenda) {
      ctx.addIssue({
        code: "custom",
        path: ["valorVenda"],
        message: "Valor de venda é obrigatório para imóveis à venda.",
      });
    }
    if (data.paraAluguel && !data.valorAluguel) {
      ctx.addIssue({
        code: "custom",
        path: ["valorAluguel"],
        message: "Valor de aluguel é obrigatório para imóveis para alugar.",
      });
    }
  });

export type ImovelFormValues = z.infer<typeof imovelSchema>;
