import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export default function ClienteNotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-1 items-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Cliente não encontrado</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            O cadastro que você está procurando não existe ou foi removido.
          </p>
          <Link href="/clientes" className={buttonVariants()}>
            Voltar para clientes
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
