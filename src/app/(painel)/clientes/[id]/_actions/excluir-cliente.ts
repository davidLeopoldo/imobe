"use server";

import { redirect } from "next/navigation";
import { excluirCliente } from "@/services/clientes-service";

export async function excluirClienteAction(id: number) {
  try {
    await excluirCliente(id);
  } catch {
    return { message: "Não foi possível excluir o cliente. Tente novamente." };
  }

  redirect("/clientes");
}
