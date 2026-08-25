import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HistoricoContratoItem } from "../_data-access/listar-historico-contratos";

const TIPO_LABEL: Record<HistoricoContratoItem["tipo"], string> = {
  venda: "Venda",
  locacao: "Locação",
};

const PAPEL_LABEL: Record<HistoricoContratoItem["papel"], string> = {
  proprietario: "Proprietário/vendedor",
  contraparte: "Contraparte",
};

export function HistoricoContratos({
  contratos,
}: {
  contratos: HistoricoContratoItem[];
}) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Contratos vinculados</CardTitle>
      </CardHeader>
      <CardContent>
        {contratos.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum contrato vinculado a este cliente ainda.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {contratos.map((contrato) => (
              <li key={contrato.id} className="text-sm">
                <Link
                  href={`/contratos/${contrato.id}`}
                  className="underline underline-offset-4"
                >
                  {TIPO_LABEL[contrato.tipo]} — {contrato.dataContrato}
                </Link>{" "}
                <span className="text-muted-foreground">
                  ({PAPEL_LABEL[contrato.papel]})
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
