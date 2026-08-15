import { Badge } from "@/components/ui/badge";

// Regra de negócio 12 (PRD v1.3): indicação visual explícita do tipo do
// imóvel, derivada de paraVenda/paraAluguel.
export function TipoImovelBadge({
  paraVenda,
  paraAluguel,
}: {
  paraVenda: boolean;
  paraAluguel: boolean;
}) {
  const label =
    paraVenda && paraAluguel
      ? "Venda e aluguel"
      : paraVenda
        ? "Somente venda"
        : "Somente aluguel";

  return <Badge variant="outline">{label}</Badge>;
}
