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
import { listarContratos } from "./_data-access/listar-contratos";

const TIPO_LABEL: Record<string, string> = {
  venda: "Venda",
  locacao: "Locação",
};

function formatDataBR(data: string) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

export default async function ContratosPage() {
  const contratos = await listarContratos();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Contratos</h1>
        <Link href="/contratos/novo" className={buttonVariants()}>
          Gerar contrato
        </Link>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Contratos gerados</CardTitle>
        </CardHeader>
        <CardContent>
          {contratos.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum contrato gerado ainda.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Imóvel</TableHead>
                  <TableHead>Contraparte</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contratos.map((contrato) => (
                  <TableRow key={contrato.id}>
                    <TableCell>{TIPO_LABEL[contrato.tipo]}</TableCell>
                    <TableCell>
                      {contrato.imovel_id ? contrato.imovel_endereco : "Avulso"}
                    </TableCell>
                    <TableCell>{contrato.contraparte_nome}</TableCell>
                    <TableCell>{formatDataBR(contrato.data_contrato)}</TableCell>
                    <TableCell>
                      <Link
                        href={`/contratos/${contrato.id}`}
                        className="text-primary underline underline-offset-4"
                      >
                        Ver
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
