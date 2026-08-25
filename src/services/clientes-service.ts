import { createClient } from "@/lib/supabase/server";
import { requireUserId } from "@/lib/supabase/auth";

export interface Cliente {
  id: number;
  user_id: string;
  nome: string;
  cpf: string;
  endereco: string;
  telefone: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export type ClienteInput = Pick<
  Cliente,
  "nome" | "cpf" | "endereco" | "telefone" | "email"
>;

export async function listarClientesDoUsuario() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .order("nome", { ascending: true });

  if (error) throw new Error(error.message);
  return data as Cliente[];
}

export async function buscarClientePorId(id: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Cliente | null;
}

export async function buscarClientePorCpf(cpf: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("cpf", cpf)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Cliente | null;
}

export async function criarCliente(input: ClienteInput) {
  const supabase = await createClient();
  const userId = await requireUserId(supabase);

  const { data, error } = await supabase
    .from("clientes")
    .insert({ ...input, user_id: userId })
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("Já existe um cliente cadastrado com este CPF.");
    }
    throw new Error(error.message);
  }

  return data as Cliente;
}

export async function atualizarCliente(id: number, input: ClienteInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clientes")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("Já existe um cliente cadastrado com este CPF.");
    }
    throw new Error(error.message);
  }

  return data as Cliente;
}

export async function excluirCliente(id: number) {
  const supabase = await createClient();
  const { error } = await supabase.from("clientes").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
