import { z } from "zod";
import { moneyString } from "./money";

const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;

export const contratoSchema = z
  .object({
    tipo: z.enum(["venda", "locacao"], { error: "Selecione o tipo de contrato." }),
    imovelEndereco: z.string().min(3, { error: "Informe o endereço do imóvel." }),
    imovelBairro: z.string().min(2, { error: "Informe o bairro." }),
    imovelCidade: z.string().min(2, { error: "Informe a cidade." }),
    imovelValor: moneyString,
    proprietarioNome: z.string().min(3, { error: "Informe o nome do proprietário." }),
    proprietarioCpf: z.string().regex(cpfRegex, { error: "Informe um CPF válido." }),
    proprietarioEndereco: z
      .string()
      .min(3, { error: "Informe o endereço do proprietário." }),
    contraparteNome: z.string().min(3, { error: "Informe o nome da outra parte." }),
    contraparteCpf: z.string().regex(cpfRegex, { error: "Informe um CPF válido." }),
    contraparteEndereco: z
      .string()
      .min(3, { error: "Informe o endereço da outra parte." }),
    dataContrato: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { error: "Informe a data do contrato." }),
    prazoMeses: z.string().optional(),
    formaPagamento: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.tipo === "locacao" && !data.prazoMeses) {
      ctx.addIssue({
        code: "custom",
        path: ["prazoMeses"],
        message: "Informe o prazo do contrato de locação em meses.",
      });
    }
  });

export type ContratoFormValues = z.infer<typeof contratoSchema>;

export function mapContratoFormValuesToInput(
  data: ContratoFormValues,
  imovelId: number | null
) {
  return {
    imovel_id: imovelId,
    tipo: data.tipo,
    imovel_endereco: data.imovelEndereco,
    imovel_bairro: data.imovelBairro,
    imovel_cidade: data.imovelCidade,
    imovel_valor: Number(data.imovelValor),
    proprietario_nome: data.proprietarioNome,
    proprietario_cpf: data.proprietarioCpf,
    proprietario_endereco: data.proprietarioEndereco,
    contraparte_nome: data.contraparteNome,
    contraparte_cpf: data.contraparteCpf,
    contraparte_endereco: data.contraparteEndereco,
    data_contrato: data.dataContrato,
    prazo_meses: data.prazoMeses ? Number(data.prazoMeses) : null,
    forma_pagamento: data.formaPagamento || null,
  };
}
