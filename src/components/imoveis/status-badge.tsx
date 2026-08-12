import { Badge } from "@/components/ui/badge";
import type { ImovelStatus } from "@/services/imoveis-service";

const STATUS_CONFIG: Record<ImovelStatus, { label: string; variant: "default" | "outline" | "secondary" | "destructive" }> = {
  disponivel: { label: "Disponível", variant: "default" },
  indisponivel: { label: "Indisponível", variant: "outline" },
  alugado: { label: "Alugado", variant: "secondary" },
  vendido: { label: "Vendido", variant: "destructive" },
};

export function StatusBadge({ status }: { status: ImovelStatus }) {
  const config = STATUS_CONFIG[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
