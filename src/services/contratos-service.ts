import { createClient } from "@/lib/supabase/server";
import { requireUserId } from "@/lib/supabase/auth";
import { renderContratoPdf } from "@/components/contratos/pdf/render-contrato-pdf";

export type ContratoTipo = "venda" | "locacao";

export interface Contrato {
  id: number;
  user_id: string;
  imovel_id: number | null;
  tipo: ContratoTipo;
  imovel_endereco: string;
  imovel_bairro: string;
  imovel_cidade: string;
  imovel_valor: number;
  proprietario_nome: string;
  proprietario_cpf: string;
  proprietario_endereco: string;
  contraparte_nome: string;
  contraparte_cpf: string;
  contraparte_endereco: string;
  data_contrato: string;
  prazo_meses: number | null;
  forma_pagamento: string | null;
  pdf_path: string | null;
  created_at: string;
  updated_at: string;
}

export type ContratoInput = Omit<
  Contrato,
  "id" | "user_id" | "pdf_path" | "created_at" | "updated_at"
>;

export async function listarContratosDoUsuario() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contratos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Contrato[];
}

export async function buscarContratoPorId(id: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contratos")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Contrato | null;
}

/**
 * Cria o registro do contrato, gera o PDF e faz upload para o bucket
 * privado 'contratos'. Se qualquer etapa após o insert falhar, remove o
 * registro criado (rollback manual — não há transação cross-storage+DB
 * via REST) para evitar contratos "fantasma" sem PDF associado.
 */
export async function gerarContratoComPdf(input: ContratoInput) {
  const supabase = await createClient();
  const userId = await requireUserId(supabase);

  const { data: contratoCriado, error: insertError } = await supabase
    .from("contratos")
    .insert({ ...input, user_id: userId })
    .select("*")
    .single();

  if (insertError) throw new Error(insertError.message);

  const contrato = contratoCriado as Contrato;

  try {
    const pdfBuffer = await renderContratoPdf(contrato);
    const pdfPath = `${userId}/${contrato.id}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("contratos")
      .upload(pdfPath, pdfBuffer, { contentType: "application/pdf", upsert: false });

    if (uploadError) throw new Error(uploadError.message);

    const { data: contratoAtualizado, error: updateError } = await supabase
      .from("contratos")
      .update({ pdf_path: pdfPath })
      .eq("id", contrato.id)
      .select("*")
      .single();

    if (updateError) throw new Error(updateError.message);

    return contratoAtualizado as Contrato;
  } catch (error) {
    await supabase.from("contratos").delete().eq("id", contrato.id);
    throw error instanceof Error
      ? error
      : new Error("Não foi possível gerar o PDF do contrato.");
  }
}
