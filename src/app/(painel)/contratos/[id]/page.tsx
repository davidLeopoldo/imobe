import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { formatCurrencyBRL } from "@/lib/format";
import { buscarContrato } from "./_data-access/buscar-contrato";

const TIPO_LABEL: Record<string, string> = {
  venda: "Venda",
  locacao: "Locação",
};

function formatDataBR(data: string) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

export default async function ContratoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contratoId = Number(id);

  if (!Number.isInteger(contratoId)) {
    notFound();
  }

  const contrato = await buscarContrato(contratoId);

  if (!contrato) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Contrato de {TIPO_LABEL[contrato.tipo]}
          </h1>
          <p className="text-muted-foreground">
            {contrato.imovel_endereco}, {contrato.imovel_bairro}, {contrato.imovel_cidade}
          </p>
        </div>
        {contrato.pdf_path && (
          <a
            href={`/contratos/${contrato.id}/download`}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants()}
          >
            Baixar PDF
          </a>
        )}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Dados do contrato</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">
              {contrato.tipo === "locacao" ? "Valor do aluguel" : "Valor de venda"}
            </p>
            <p className="font-medium">{formatCurrencyBRL(contrato.imovel_valor)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Data do contrato</p>
            <p className="font-medium">{formatDataBR(contrato.data_contrato)}</p>
          </div>
          {contrato.prazo_meses && (
            <div>
              <p className="text-sm text-muted-foreground">Prazo</p>
              <p className="font-medium">{contrato.prazo_meses} meses</p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">
              {contrato.tipo === "locacao" ? "Locador" : "Vendedor"}
            </p>
            <p className="font-medium">{contrato.proprietario_nome}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {contrato.tipo === "locacao" ? "Locatário" : "Comprador"}
            </p>
            <p className="font-medium">{contrato.contraparte_nome}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Vínculo</p>
            <p className="font-medium">
              {contrato.imovel_id ? "Vinculado a imóvel cadastrado" : "Avulso"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
