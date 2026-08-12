import { z } from "zod";

const optionalMoneyString = z
  .string()
  .optional()
  .refine((val) => !val || /^\d+(\.\d{1,2})?$/.test(val), {
    error: "Informe um valor válido (ex.: 1500.00).",
  })
  .refine((val) => !val || Number(val) > 0, {
    error: "Informe um valor maior que zero.",
  });

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

export function paraNumeroOuNulo(valor: string | undefined): number | null {
  return valor ? Number(valor) : null;
}
