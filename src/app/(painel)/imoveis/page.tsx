import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { listarImoveis } from "./_data-access/listar-imoveis";
import { ImoveisGrid } from "./_components/imoveis-grid";

export default async function ImoveisPage() {
  const imoveis = await listarImoveis();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Imóveis</h1>
        <Link href="/imoveis/novo" className={buttonVariants()}>
          Cadastrar imóvel
        </Link>
      </div>

      <div className="mt-6">
        <ImoveisGrid imoveis={imoveis} />
      </div>
    </div>
  );
}
