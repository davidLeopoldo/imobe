import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/imoveis/status-badge";
import { formatCurrencyBRL } from "@/lib/format";
import { buscarImovel } from "./_data-access/buscar-imovel";
import { ImovelHeaderActions } from "./_components/imovel-header-actions";

export default async function ImovelDetalhePage({
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

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{imovel.endereco}</h1>
            <StatusBadge status={imovel.status} />
          </div>
          <p className="text-muted-foreground">
            {imovel.bairro}, {imovel.cidade}
            {imovel.localizacao ? ` — ${imovel.localizacao}` : ""}
          </p>
        </div>
        <ImovelHeaderActions id={imovel.id} status={imovel.status} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Valores</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {imovel.para_venda && (
            <div>
              <p className="text-sm text-muted-foreground">Valor de venda</p>
              <p className="font-medium">{formatCurrencyBRL(imovel.valor_venda)}</p>
            </div>
          )}
          {imovel.para_aluguel && (
            <div>
              <p className="text-sm text-muted-foreground">Valor de aluguel</p>
              <p className="font-medium">{formatCurrencyBRL(imovel.valor_aluguel)}/mês</p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">IPTU</p>
            <p className="font-medium">{formatCurrencyBRL(imovel.valor_iptu)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Valor estimado</p>
            <p className="font-medium">{formatCurrencyBRL(imovel.valor_estimado)}</p>
          </div>
        </CardContent>
      </Card>

      {imovel.link_anuncio && (
        <p className="mt-4 text-sm">
          <a
            href={imovel.link_anuncio}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4"
          >
            Ver anúncio
          </a>
        </p>
      )}
    </div>
  );
}
