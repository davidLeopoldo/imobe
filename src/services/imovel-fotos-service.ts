import { createClient } from "@/lib/supabase/server";
import { requireUserId } from "@/lib/supabase/auth";
import { validarArquivoFoto, extensaoDoArquivo } from "@/lib/validations/imovel-foto";

const BUCKET = "imovel-fotos";
const URL_EXPIRACAO_SEGUNDOS = 60 * 60;

export interface ImovelFoto {
  id: number;
  imovel_id: number;
  user_id: string;
  storage_path: string;
  ordem: number;
  created_at: string;
}

export interface ImovelFotoComUrl extends ImovelFoto {
  url: string | null;
}

export async function listarFotosDoImovel(imovelId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("imovel_fotos")
    .select("*")
    .eq("imovel_id", imovelId)
    .order("ordem", { ascending: true });

  if (error) throw new Error(error.message);
  return data as ImovelFoto[];
}

export async function listarFotosComUrl(imovelId: number): Promise<ImovelFotoComUrl[]> {
  const supabase = await createClient();
  const fotos = await listarFotosDoImovel(imovelId);

  if (fotos.length === 0) return [];

  const { data: assinadas } = await supabase.storage
    .from(BUCKET)
    .createSignedUrls(
      fotos.map((foto) => foto.storage_path),
      URL_EXPIRACAO_SEGUNDOS
    );

  const urlPorPath = new Map(
    (assinadas ?? []).map((item) => [item.path, item.signedUrl ?? null])
  );

  return fotos.map((foto) => ({
    ...foto,
    url: urlPorPath.get(foto.storage_path) ?? null,
  }));
}

/**
 * Busca a capa (primeira foto, ordem = 1) de cada imóvel informado, já com
 * signed URL — usado na listagem de imóveis. Faz 1 query + 1 chamada em
 * lote de signed URLs, independente da quantidade de imóveis.
 */
export async function buscarCapasDosImoveis(
  imovelIds: number[]
): Promise<Record<number, string>> {
  if (imovelIds.length === 0) return {};

  const supabase = await createClient();
  const { data: capas, error } = await supabase
    .from("imovel_fotos")
    .select("imovel_id, storage_path")
    .in("imovel_id", imovelIds)
    .eq("ordem", 1);

  if (error) throw new Error(error.message);
  if (!capas || capas.length === 0) return {};

  const { data: assinadas } = await supabase.storage
    .from(BUCKET)
    .createSignedUrls(
      capas.map((c) => c.storage_path),
      URL_EXPIRACAO_SEGUNDOS
    );

  const urlPorPath = new Map(
    (assinadas ?? []).map((item) => [item.path, item.signedUrl ?? null])
  );

  const resultado: Record<number, string> = {};
  for (const capa of capas) {
    const url = urlPorPath.get(capa.storage_path);
    if (url) resultado[capa.imovel_id] = url;
  }
  return resultado;
}

/**
 * Sobe o arquivo pro bucket e cria a linha em imovel_fotos, na próxima
 * ordem disponível. Se o insert falhar (ex.: limite de 10 atingido), remove
 * o arquivo já enviado — mesmo rollback manual usado em
 * contratos-service.gerarContratoComPdf.
 */
export async function adicionarFotoImovel(imovelId: number, file: File) {
  const erroValidacao = validarArquivoFoto(file);
  if (erroValidacao) throw new Error(erroValidacao);

  const supabase = await createClient();
  const userId = await requireUserId(supabase);

  const fotosExistentes = await listarFotosDoImovel(imovelId);
  const proximaOrdem =
    fotosExistentes.reduce((max, foto) => Math.max(max, foto.ordem), 0) + 1;

  const storagePath = `${userId}/${imovelId}/${crypto.randomUUID()}.${extensaoDoArquivo(file)}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, { contentType: file.type, upsert: false });

  if (uploadError) throw new Error(uploadError.message);

  const { data, error: insertError } = await supabase
    .from("imovel_fotos")
    .insert({ imovel_id: imovelId, user_id: userId, storage_path: storagePath, ordem: proximaOrdem })
    .select("*")
    .single();

  if (insertError) {
    await supabase.storage.from(BUCKET).remove([storagePath]);
    if (insertError.message.includes("Limite de 10 fotos")) {
      throw new Error("Este imóvel já atingiu o limite de 10 fotos.");
    }
    throw new Error(insertError.message);
  }

  return data as ImovelFoto;
}

export async function removerFotoImovel(fotoId: number) {
  const supabase = await createClient();

  const { data: foto, error: buscaError } = await supabase
    .from("imovel_fotos")
    .select("*")
    .eq("id", fotoId)
    .maybeSingle();

  if (buscaError) throw new Error(buscaError.message);
  if (!foto) throw new Error("Foto não encontrada.");

  const fotoRemovida = foto as ImovelFoto;

  const { error: deleteError } = await supabase.from("imovel_fotos").delete().eq("id", fotoId);
  if (deleteError) throw new Error(deleteError.message);

  await supabase.storage.from(BUCKET).remove([fotoRemovida.storage_path]);

  // Reordena as fotos restantes pra ficarem contíguas a partir de 1 —
  // sem isso, remover justamente a foto com ordem=1 (a capa) deixava
  // nenhuma foto ocupando esse lugar, e a próxima foto adicionada nunca
  // preenchia a lacuna (upload sempre usa max(ordem)+1). Regra de negócio
  // 10 do PRD: a próxima foto na ordem deve assumir a capa automaticamente.
  const restantes = await listarFotosDoImovel(fotoRemovida.imovel_id);
  for (let index = 0; index < restantes.length; index++) {
    const novaOrdem = index + 1;
    if (restantes[index].ordem !== novaOrdem) {
      await supabase
        .from("imovel_fotos")
        .update({ ordem: novaOrdem })
        .eq("id", restantes[index].id);
    }
  }
}
