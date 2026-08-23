import { z } from "zod";

const telefoneOpcional = z
  .string()
  .optional()
  .refine((val) => !val || val.replace(/\D/g, "").length >= 8, {
    error: "Informe um telefone válido.",
  });

export const perfilSchema = z.object({
  nome: z.string().optional(),
  telefone: telefoneOpcional,
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
});

export type PerfilFormValues = z.infer<typeof perfilSchema>;
