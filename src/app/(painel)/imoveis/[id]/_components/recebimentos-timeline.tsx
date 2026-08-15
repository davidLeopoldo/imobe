import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCurrencyBRL } from "@/lib/format";
import type { PeriodoFiltro, Recebimento } from "@/services/recebimentos-service";

const PERIODO_LABEL: Record<PeriodoFiltro, string> = {
  mes: "Mês atual",
  "6meses": "6 meses",
  "12meses": "12 meses",
};

function formatMesReferencia(mesReferencia: string) {
  const [ano, mes] = mesReferencia.split("-");
  return new Date(Number(ano), Number(mes) - 1, 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}

function formatDataBR(data: string) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function RecebimentosTimeline({
  imovelId,
  periodo,
  recebimentos,
}: {
  imovelId: number;
  periodo: PeriodoFiltro;
  recebimentos: Recebimento[];
}) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Recebimentos de aluguel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          {(Object.keys(PERIODO_LABEL) as PeriodoFiltro[]).map((valor) => (
            <Link
              key={valor}
              href={`/imoveis/${imovelId}?periodo=${valor}`}
              className={cn(
                buttonVariants({
                  variant: valor === periodo ? "default" : "outline",
                  size: "sm",
                })
              )}
            >
              {PERIODO_LABEL[valor]}
            </Link>
          ))}
        </div>

        {recebimentos.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum recebimento registrado neste período.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mês de referência</TableHead>
                <TableHead>Data do recebimento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Observação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recebimentos.map((recebimento) => (
                <TableRow key={recebimento.id}>
                  <TableCell className="capitalize">
                    {formatMesReferencia(recebimento.mes_referencia)}
                  </TableCell>
                  <TableCell>{formatDataBR(recebimento.data_recebimento)}</TableCell>
                  <TableCell>{formatCurrencyBRL(recebimento.valor)}</TableCell>
                  <TableCell className="whitespace-normal text-muted-foreground">
                    {recebimento.observacao ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
