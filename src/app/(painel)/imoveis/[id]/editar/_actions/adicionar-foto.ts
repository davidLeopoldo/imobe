"use server";

import { adicionarFotoImovel } from "@/services/imovel-fotos-service";

export async function adicionarFotoAction(imovelId: number, foto: File) {
  try {
    await adicionarFotoImovel(imovelId, foto);
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível enviar a foto. Tente novamente.",
    };
  }
}
