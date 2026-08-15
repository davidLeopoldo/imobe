import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const contratoId = Number(id);

  if (!Number.isInteger(contratoId)) {
    return NextResponse.json({ message: "Contrato inválido." }, { status: 404 });
  }

  const supabase = await createClient();

  // RLS garante que 'contrato' só vem preenchido se pertencer ao usuário logado.
  const { data: contrato, error } = await supabase
    .from("contratos")
    .select("pdf_path")
    .eq("id", contratoId)
    .maybeSingle();

  if (error || !contrato?.pdf_path) {
    return NextResponse.json({ message: "Contrato não encontrado." }, { status: 404 });
  }

  const { data: signed, error: signError } = await supabase.storage
    .from("contratos")
    .createSignedUrl(contrato.pdf_path, 60);

  if (signError || !signed?.signedUrl) {
    return NextResponse.json(
      { message: "Não foi possível gerar o link de download." },
      { status: 500 }
    );
  }

  return NextResponse.redirect(signed.signedUrl);
}
