import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function PublicHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <Image
            src="/logo-header.png"
            alt=""
            width={28}
            height={28}
            className="rounded-sm"
            priority
          />
          Immobiliare
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/login" className={buttonVariants({ variant: "ghost" })}>
            Entrar
          </Link>
          <Link href="/cadastro" className={buttonVariants()}>
            Criar conta
          </Link>
        </nav>
      </div>
    </header>
  );
}
