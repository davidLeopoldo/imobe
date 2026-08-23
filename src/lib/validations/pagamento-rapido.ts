import { z } from "zod";
import { moneyString } from "./money";

export const pagamentoRapidoSchema = z.object({
  imovelId: z.number({ error: "Selecione um imóvel." }).int().positive({
    error: "Selecione um imóvel.",
  }),
  mesReferencia: z
    .string()
    .regex(/^\d{4}-\d{2}$/, { error: "Selecione o mês de referência." }),
  valor: moneyString,
});

export type PagamentoRapidoFormValues = z.infer<typeof pagamentoRapidoSchema>;
