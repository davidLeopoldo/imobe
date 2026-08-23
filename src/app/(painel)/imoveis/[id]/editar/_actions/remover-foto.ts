"use server";

import { removerFotoImovel } from "@/services/imovel-fotos-service";

export async function removerFotoAction(fotoId: number) {
  try {
    await removerFotoImovel(fotoId);
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível remover a foto. Tente novamente.",
    };
  }
}
