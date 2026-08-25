import { z } from "zod";
import { cpfRegex, normalizeCpf } from "./cpf";

const telefoneOpcional = z
  .string()
  .optional()
  .refine((val) => !val || val.replace(/\D/g, "").length >= 8, {
    error: "Informe um telefone válido.",
  });

export const clienteSchema = z.object({
  nome: z.string().min(3, { error: "Informe o nome completo." }),
  cpf: z
    .string()
    .regex(cpfRegex, { error: "Informe um CPF válido." })
    .transform(normalizeCpf),
  endereco: z.string().min(3, { error: "Informe o endereço completo." }),
  telefone: telefoneOpcional,
  email: z
    .union([z.email({ error: "Informe um e-mail válido." }), z.literal("")])
    .optional(),
});

export type ClienteFormValues = z.infer<typeof clienteSchema>;
