import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImovelForm } from "@/components/imoveis/imovel-form";
import { buscarImovel } from "../_data-access/buscar-imovel";
import { atualizarImovelAction } from "./_actions/atualizar-imovel";
import { listarFotosDoImovelParaEdicao } from "./_data-access/listar-fotos";
import { GerenciarFotos } from "./_components/gerenciar-fotos";

export default async function EditarImovelPage({
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

  const fotos = await listarFotosDoImovelParaEdicao(imovel.id);
  const action = atualizarImovelAction.bind(null, imovel.id);

  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Editar imóvel</CardTitle>
        </CardHeader>
        <CardContent>
          <ImovelForm
            mode="editar"
            action={action}
            defaultValues={{
              paraVenda: imovel.para_venda,
              paraAluguel: imovel.para_aluguel,
              valorVenda: imovel.valor_venda?.toString() ?? "",
              valorAluguel: imovel.valor_aluguel?.toString() ?? "",
              valorIptu: imovel.valor_iptu?.toString() ?? "",
              valorEstimado: imovel.valor_estimado?.toString() ?? "",
              localizacao: imovel.localizacao ?? "",
              endereco: imovel.endereco,
              bairro: imovel.bairro,
              cidade: imovel.cidade,
              linkAnuncio: imovel.link_anuncio ?? "",
            }}
          />
        </CardContent>
      </Card>

      <GerenciarFotos imovelId={imovel.id} fotos={fotos} />
    </div>
  );
}
