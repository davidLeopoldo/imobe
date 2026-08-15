"use server";

import { redirect } from "next/navigation";
import { gerarContratoComPdf } from "@/services/contratos-service";
import {
  contratoSchema,
  mapContratoFormValuesToInput,
  type ContratoFormValues,
} from "@/lib/validations/contrato";

export async function gerarContratoAvulsoAction(input: ContratoFormValues) {
  const parsed = contratoSchema.safeParse(input);
  if (!parsed.success) {
    return { message: "Dados inválidos. Revise os campos destacados." };
  }

  let contratoId: number;

  try {
    const contrato = await gerarContratoComPdf(mapContratoFormValuesToInput(parsed.data, null));
    contratoId = contrato.id;
  } catch {
    return { message: "Não foi possível gerar o contrato. Tente novamente." };
  }

  redirect(`/contratos/${contratoId}`);
}
