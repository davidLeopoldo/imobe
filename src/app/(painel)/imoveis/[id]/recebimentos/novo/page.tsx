import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecebimentoForm } from "@/components/recebimentos/recebimento-form";
import { buscarImovel } from "../../_data-access/buscar-imovel";
import { criarRecebimentoAction } from "./_actions/criar-recebimento";

export default async function NovoRecebimentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const imovelId = Number(id);

  if (!Number.isInteger(imovelId)) {
    notFound();
  }

  const imovel = await buscarImovel(imovelId);

  if (!imovel) {
    notFound();
  }

  if (!imovel.para_aluguel) {
    redirect(`/imoveis/${imovel.id}`);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Registrar recebimento — {imovel.endereco}</CardTitle>
        </CardHeader>
        <CardContent>
          <RecebimentoForm
            action={criarRecebimentoAction.bind(null, imovel.id)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
