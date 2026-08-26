import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClienteForm } from "@/components/clientes/cliente-form";
import { buscarCliente } from "./_data-access/buscar-cliente";
import { listarHistoricoContratos } from "./_data-access/listar-historico-contratos";
import { atualizarClienteAction } from "./_actions/atualizar-cliente";
import { HistoricoContratos } from "./_components/historico-contratos";
import { ExcluirClienteDialog } from "./_components/excluir-cliente-dialog";

export default async function ClienteDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const clienteId = Number(id);

  if (!Number.isInteger(clienteId)) {
    notFound();
  }

  const cliente = await buscarCliente(clienteId);

  if (!cliente) {
    notFound();
  }

  const historico = await listarHistoricoContratos(cliente.id);
  const action = atualizarClienteAction.bind(null, cliente.id);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          {cliente.nome}
        </h1>
        <ExcluirClienteDialog id={cliente.id} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Dados cadastrais</CardTitle>
        </CardHeader>
        <CardContent>
          <ClienteForm
            mode="editar"
            action={action}
            defaultValues={{
              nome: cliente.nome,
              cpf: cliente.cpf,
              endereco: cliente.endereco,
              telefone: cliente.telefone ?? "",
              email: cliente.email ?? "",
            }}
          />
        </CardContent>
      </Card>

      <HistoricoContratos contratos={historico} />
    </div>
  );
}
