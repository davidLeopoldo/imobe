import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClienteForm } from "@/components/clientes/cliente-form";
import { criarClienteAction } from "./_actions/criar-cliente";

export default function NovoClientePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Cadastrar cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <ClienteForm mode="criar" action={criarClienteAction} />
        </CardContent>
      </Card>
    </div>
  );
}
