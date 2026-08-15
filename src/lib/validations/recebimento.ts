import { z } from "zod";
import { moneyString } from "./money";

export const recebimentoSchema = z.object({
  valor: moneyString,
  mesReferencia: z
    .string()
    .regex(/^\d{4}-\d{2}$/, { error: "Informe o mês de referência." }),
  dataRecebimento: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { error: "Informe a data do recebimento." }),
  observacao: z.string().optional(),
});

export type RecebimentoFormValues = z.infer<typeof recebimentoSchema>;
