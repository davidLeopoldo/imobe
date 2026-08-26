import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function LandingHero() {
  return (
    <section className="relative flex min-h-[520px] w-full items-end overflow-hidden sm:min-h-[600px]">
      <Image
        src="/landing/hero.jpg"
        alt="Fachada de uma casa térrea com jardim, exemplo de imóvel cadastrado no Immobiliare"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-navy/90 via-surface-navy/40 to-transparent" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-surface-navy-foreground font-heading sm:text-5xl">
          Organize seus imóveis, contratos e patrimônio em um só lugar
        </h1>
        <p className="max-w-lg text-lg text-surface-navy-foreground/85">
          O Immobiliare ajuda proprietários e corretores autônomos a cadastrar
          imóveis, gerar contratos e acompanhar o rendimento de aluguel sem
          depender de planilhas soltas.
        </p>
        <div className="mt-2 flex gap-3">
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
    </section>
  );
}
