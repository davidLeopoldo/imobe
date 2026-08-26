import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContratoForm } from "@/components/contratos/contrato-form";
import type { ContratoTipo } from "@/services/contratos-service";
import { buscarImovel } from "../../_data-access/buscar-imovel";
import { gerarContratoVinculadoAction } from "./_actions/gerar-contrato-vinculado";

export default async function NovoContratoVinculadoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const imovelId = Number(id);

  if (!Number.isInteger(imovelId)) {
    notFound();
  }

  const imovel = await buscarImovel(imovelId);

  if (!imovel) {
    notFound();
  }

  const tiposDisponiveis: ContratoTipo[] = [
    ...(imovel.para_venda ? (["venda"] as const) : []),
    ...(imovel.para_aluguel ? (["locacao"] as const) : []),
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Gerar contrato — {imovel.endereco}</CardTitle>
        </CardHeader>
        <CardContent>
          <ContratoForm
            tiposDisponiveis={tiposDisponiveis}
            defaultValues={{
              tipo: tiposDisponiveis[0],
              imovelEndereco: imovel.endereco,
              imovelBairro: imovel.bairro,
              imovelCidade: imovel.cidade,
              imovelValor:
                tiposDisponiveis[0] === "locacao"
                  ? (imovel.valor_aluguel?.toString() ?? "")
                  : (imovel.valor_venda?.toString() ?? ""),
            }}
            valoresPorTipo={{
              venda: imovel.valor_venda?.toString(),
              locacao: imovel.valor_aluguel?.toString(),
            }}
            action={gerarContratoVinculadoAction.bind(null, imovel.id)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
