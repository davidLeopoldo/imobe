import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContratoForm } from "@/components/contratos/contrato-form";
import { gerarContratoAvulsoAction } from "./_actions/gerar-contrato-avulso";

export default function NovoContratoAvulsoPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Gerar contrato</CardTitle>
        </CardHeader>
        <CardContent>
          <ContratoForm
            tiposDisponiveis={["venda", "locacao"]}
            action={gerarContratoAvulsoAction}
          />
        </CardContent>
      </Card>
    </div>
  );
}
