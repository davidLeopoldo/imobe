"use server";

import {
  atualizarCliente,
  buscarClientePorCpf,
} from "@/services/clientes-service";
import {
  clienteSchema,
  type ClienteFormValues,
} from "@/lib/validations/cliente";

export async function atualizarClienteAction(
  id: number,
  input: ClienteFormValues
) {
  const parsed = clienteSchema.safeParse(input);
  if (!parsed.success) {
    return { message: "Dados inválidos. Revise os campos destacados." };
  }

  const data = parsed.data;

  const existente = await buscarClientePorCpf(data.cpf);
  if (existente && existente.id !== id) {
    return {
      message: `Já existe um cliente cadastrado com este CPF: ${existente.nome}.`,
      clienteExistenteId: existente.id,
    };
  }

  try {
    await atualizarCliente(id, {
      nome: data.nome,
      cpf: data.cpf,
      endereco: data.endereco,
      telefone: data.telefone || null,
      email: data.email || null,
    });
  } catch {
    return {
      message: "Não foi possível salvar as alterações. Tente novamente.",
    };
  }

  return { success: true };
}
