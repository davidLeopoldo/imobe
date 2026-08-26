import { Badge } from "@/components/ui/badge";
import type { ImovelStatus } from "@/services/imoveis-service";

const STATUS_CONFIG: Record<
  ImovelStatus,
  { label: string; className: string }
> = {
  disponivel: {
    label: "Disponível",
    className: "bg-status-success-bg text-status-success-fg",
  },
  indisponivel: {
    label: "Indisponível",
    className: "bg-status-indisponivel-bg text-status-indisponivel-fg",
  },
  alugado: {
    label: "Alugado",
    className: "bg-status-alugado-bg text-status-alugado-fg",
  },
  vendido: {
    label: "Vendido",
    className: "bg-status-vendido-bg text-status-vendido-fg",
  },
};

export function StatusBadge({ status }: { status: ImovelStatus }) {
  const config = STATUS_CONFIG[status];
  return <Badge className={config.className}>{config.label}</Badge>;
}
