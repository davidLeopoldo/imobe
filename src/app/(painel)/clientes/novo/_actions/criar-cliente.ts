"use server";

import { redirect } from "next/navigation";
import { buscarClientePorCpf, criarCliente } from "@/services/clientes-service";
import {
  clienteSchema,
  type ClienteFormValues,
} from "@/lib/validations/cliente";

export async function criarClienteAction(input: ClienteFormValues) {
  const parsed = clienteSchema.safeParse(input);
  if (!parsed.success) {
    return { message: "Dados inválidos. Revise os campos destacados." };
  }

  const data = parsed.data;

  const existente = await buscarClientePorCpf(data.cpf);
  if (existente) {
    return {
      message: `Já existe um cliente cadastrado com este CPF: ${existente.nome}.`,
      clienteExistenteId: existente.id,
    };
  }

  let clienteId: number;
  try {
    const cliente = await criarCliente({
      nome: data.nome,
      cpf: data.cpf,
      endereco: data.endereco,
      telefone: data.telefone || null,
      email: data.email || null,
    });
    clienteId = cliente.id;
  } catch {
    return {
      message: "Não foi possível cadastrar o cliente. Tente novamente.",
    };
  }

  redirect(`/clientes/${clienteId}`);
}
