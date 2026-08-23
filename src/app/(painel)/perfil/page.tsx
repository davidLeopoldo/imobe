import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PerfilForm } from "@/components/perfil/perfil-form";
import { buscarDadosDoPerfil } from "./_data-access/buscar-perfil";
import { salvarPerfilAction } from "./_actions/salvar-perfil";

export default async function PerfilPage() {
  const { perfil, email } = await buscarDadosDoPerfil();

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Meu perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <PerfilForm
            email={email}
            defaultValues={{
              nome: perfil?.nome ?? "",
              telefone: perfil?.telefone ?? "",
              instagram: perfil?.instagram ?? "",
              tiktok: perfil?.tiktok ?? "",
            }}
            action={salvarPerfilAction}
          />
        </CardContent>
      </Card>
    </div>
  );
}
