import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyBRL } from "@/lib/format";
import { buscarResumoPatrimonioDoUsuario } from "./_data-access/buscar-resumo-patrimonio";
import { listarImoveisAlugadosParaPagamento } from "./_data-access/listar-imoveis-alugados";
import { RegistrarPagamentoDialog } from "./_components/registrar-pagamento-dialog";
import type { ImovelStatus } from "@/services/imoveis-service";

const STATUS_LABEL: Record<ImovelStatus, string> = {
  disponivel: "Disponíveis",
  indisponivel: "Indisponíveis",
  alugado: "Alugados",
  vendido: "Vendidos",
};

export default async function DashboardPage() {
  const [resumo, imoveisAlugados] = await Promise.all([
    buscarResumoPatrimonioDoUsuario(),
    listarImoveisAlugadosParaPagamento(),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Visão geral do seu patrimônio imobiliário.</p>
        </div>
        <RegistrarPagamentoDialog imoveis={imoveisAlugados} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Patrimônio total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {formatCurrencyBRL(resumo.totalEstimado)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Imóveis cadastrados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{resumo.quantidadeImoveis}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rendimento (últimos 30 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {formatCurrencyBRL(resumo.rendimentoRecente)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Por status
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {(Object.keys(STATUS_LABEL) as ImovelStatus[]).map((status) => (
              <div key={status}>
                <p className="text-xs text-muted-foreground">{STATUS_LABEL[status]}</p>
                <p className="font-medium">{resumo.porStatus[status]}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
