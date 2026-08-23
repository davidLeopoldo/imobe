import Link from "next/link";
import { Building2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ImovelCard } from "@/components/imoveis/imovel-card";
import type { Imovel } from "@/services/imoveis-service";

export function ImoveisGrid({
  imoveis,
  capas,
}: {
  imoveis: Imovel[];
  capas: Record<number, string>;
}) {
  if (imoveis.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed py-16 text-center">
        <Building2 className="size-10 text-muted-foreground" />
        <div>
          <p className="font-medium">Nenhum imóvel cadastrado ainda</p>
          <p className="text-sm text-muted-foreground">
            Cadastre seu primeiro imóvel para começar a organizar seu patrimônio.
          </p>
        </div>
        <Link href="/imoveis/novo" className={buttonVariants()}>
          Cadastrar imóvel
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {imoveis.map((imovel) => (
        <ImovelCard key={imovel.id} imovel={imovel} capaUrl={capas[imovel.id]} />
      ))}
    </div>
  );
}
