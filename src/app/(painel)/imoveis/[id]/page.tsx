import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/imoveis/status-badge";
import { TipoImovelBadge } from "@/components/imoveis/tipo-imovel-badge";
import { formatCurrencyBRL } from "@/lib/format";
import { buscarImovel } from "./_data-access/buscar-imovel";
import { listarRecebimentos } from "./_data-access/listar-recebimentos";
import { listarFotosDoImovelParaDetalhe } from "./_data-access/listar-fotos";
import { ImovelHeaderActions } from "./_components/imovel-header-actions";
import { RecebimentosTimeline } from "./_components/recebimentos-timeline";
import { FotosGaleria } from "./_components/fotos-galeria";
import { AvisoToast } from "./_components/aviso-toast";
import type { PeriodoFiltro } from "@/services/recebimentos-service";

const PERIODOS_VALIDOS: PeriodoFiltro[] = ["mes", "6meses", "12meses"];

export default async function ImovelDetalhePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ periodo?: string; aviso?: string }>;
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

  const { periodo: periodoParam, aviso } = await searchParams;
  const periodo: PeriodoFiltro = PERIODOS_VALIDOS.includes(
    periodoParam as PeriodoFiltro
  )
    ? (periodoParam as PeriodoFiltro)
    : "6meses";

  const recebimentos = imovel.para_aluguel
    ? await listarRecebimentos(imovel.id, periodo)
    : [];
  const fotos = await listarFotosDoImovelParaDetalhe(imovel.id);

  return (
    <div className="mx-auto max-w-4xl">
      {aviso && <AvisoToast mensagem={aviso} />}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {imovel.endereco}
            </h1>
            <StatusBadge status={imovel.status} />
            <TipoImovelBadge
              paraVenda={imovel.para_venda}
              paraAluguel={imovel.para_aluguel}
            />
          </div>
          <p className="text-muted-foreground">
            {imovel.bairro}, {imovel.cidade}
            {imovel.localizacao ? ` — ${imovel.localizacao}` : ""}
          </p>
        </div>
        <ImovelHeaderActions
          id={imovel.id}
          status={imovel.status}
          paraVenda={imovel.para_venda}
          paraAluguel={imovel.para_aluguel}
        />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Valores</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {imovel.para_venda && (
            <div>
              <p className="text-sm text-muted-foreground">Valor de venda</p>
              <p className="font-medium">
                {formatCurrencyBRL(imovel.valor_venda)}
              </p>
            </div>
          )}
          {imovel.para_aluguel && (
            <div>
              <p className="text-sm text-muted-foreground">Valor de aluguel</p>
              <p className="font-medium">
                {formatCurrencyBRL(imovel.valor_aluguel)}/mês
              </p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">IPTU</p>
            <p className="font-medium">
              {formatCurrencyBRL(imovel.valor_iptu)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Valor estimado</p>
            <p className="font-medium">
              {formatCurrencyBRL(imovel.valor_estimado)}
            </p>
          </div>
        </CardContent>
      </Card>

      {imovel.para_aluguel && (
        <RecebimentosTimeline
          imovelId={imovel.id}
          periodo={periodo}
          recebimentos={recebimentos}
        />
      )}

      <FotosGaleria fotos={fotos} />

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
