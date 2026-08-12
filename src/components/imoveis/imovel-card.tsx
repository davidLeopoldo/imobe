import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyBRL } from "@/lib/format";
import type { Imovel } from "@/services/imoveis-service";
import { StatusBadge } from "./status-badge";

export function ImovelCard({ imovel }: { imovel: Imovel }) {
  return (
    <Link href={`/imoveis/${imovel.id}`}>
      <Card className="h-full transition-colors hover:bg-muted/50">
        <CardHeader className="flex-row items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight">
            {imovel.endereco}
            <span className="block text-sm font-normal text-muted-foreground">
              {imovel.bairro}, {imovel.cidade}
            </span>
          </CardTitle>
          <StatusBadge status={imovel.status} />
        </CardHeader>
        <CardContent className="flex flex-col gap-1 text-sm">
          {imovel.para_venda && (
            <p>
              <span className="text-muted-foreground">Venda: </span>
              {formatCurrencyBRL(imovel.valor_venda)}
            </p>
          )}
          {imovel.para_aluguel && (
            <p>
              <span className="text-muted-foreground">Aluguel: </span>
              {formatCurrencyBRL(imovel.valor_aluguel)}/mês
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
