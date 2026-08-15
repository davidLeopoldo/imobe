import { z } from "zod";

export const optionalMoneyString = z
  .string()
  .optional()
  .refine((val) => !val || /^\d+(\.\d{1,2})?$/.test(val), {
    error: "Informe um valor válido (ex.: 1500.00).",
  })
  .refine((val) => !val || Number(val) > 0, {
    error: "Informe um valor maior que zero.",
  });

export const moneyString = z
  .string()
  .min(1, { error: "Informe um valor." })
  .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), {
    error: "Informe um valor válido (ex.: 1500.00).",
  })
  .refine((val) => Number(val) > 0, {
    error: "Informe um valor maior que zero.",
  });

export function paraNumeroOuNulo(valor: string | undefined): number | null {
  return valor ? Number(valor) : null;
}
