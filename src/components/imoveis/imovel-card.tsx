import Link from "next/link";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyBRL } from "@/lib/format";
import type { Imovel } from "@/services/imoveis-service";
import { StatusBadge } from "./status-badge";
import { TipoImovelBadge } from "./tipo-imovel-badge";

export function ImovelCard({ imovel }: { imovel: Imovel }) {
  return (
    <Link href={`/imoveis/${imovel.id}`}>
      <Card className="h-full transition-colors hover:bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base leading-tight">
            {imovel.endereco}
            <span className="block text-sm font-normal text-muted-foreground">
              {imovel.bairro}, {imovel.cidade}
            </span>
          </CardTitle>
          <CardAction className="flex flex-col items-end gap-1">
            <StatusBadge status={imovel.status} />
            <TipoImovelBadge paraVenda={imovel.para_venda} paraAluguel={imovel.para_aluguel} />
          </CardAction>
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
