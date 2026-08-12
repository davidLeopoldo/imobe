import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center sm:px-6">
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
        Organize seus imóveis, contratos e patrimônio em um só lugar
      </h1>
      <p className="max-w-xl text-lg text-muted-foreground">
        O Imobe ajuda proprietários e corretores autônomos a cadastrar imóveis, gerar
        contratos e acompanhar o rendimento de aluguel sem depender de planilhas soltas.
      </p>
      <div className="flex gap-3">
        <Link href="/cadastro" className={buttonVariants({ size: "lg" })}>
          Criar conta grátis
        </Link>
        <Link
          href="/login"
          className={buttonVariants({ size: "lg", variant: "outline" })}
        >
          Já tenho conta
        </Link>
      </div>
    </div>
  );
}
