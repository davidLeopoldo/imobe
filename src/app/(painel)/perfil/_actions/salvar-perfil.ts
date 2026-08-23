"use server";

import { salvarPerfil } from "@/services/perfil-service";
import { perfilSchema, type PerfilFormValues } from "@/lib/validations/perfil";

export async function salvarPerfilAction(input: PerfilFormValues) {
  const parsed = perfilSchema.safeParse(input);
  if (!parsed.success) {
    return { message: "Dados inválidos. Revise os campos destacados." };
  }

  const data = parsed.data;

  try {
    await salvarPerfil({
      nome: data.nome || null,
      telefone: data.telefone || null,
      instagram: data.instagram || null,
      tiktok: data.tiktok || null,
    });
  } catch {
    return { message: "Não foi possível salvar o perfil. Tente novamente." };
  }
}
