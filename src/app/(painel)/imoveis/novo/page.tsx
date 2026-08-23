import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImovelForm } from "@/components/imoveis/imovel-form";
import { criarImovelAction } from "./_actions/criar-imovel";
import { adicionarFotoAction } from "./_actions/adicionar-foto";

export default function NovoImovelPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Cadastrar imóvel</CardTitle>
        </CardHeader>
        <CardContent>
          <ImovelForm mode="criar" action={criarImovelAction} onUploadFoto={adicionarFotoAction} />
        </CardContent>
      </Card>
    </div>
  );
}
