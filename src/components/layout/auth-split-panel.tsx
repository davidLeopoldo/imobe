import Image from "next/image";
import Link from "next/link";

export function AuthSplitPanel({
  headline,
  subtitle,
  children,
}: {
  headline: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full w-full flex-col lg:flex-row">
      <div className="relative hidden lg:flex lg:w-1/2">
        <Image
          src="/landing/hero.jpg"
          alt="Fachada de uma casa térrea com jardim, exemplo de imóvel cadastrado no Immobiliare"
          fill
          sizes="50vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-navy/90 via-surface-navy/40 to-transparent" />
        <div className="relative flex flex-1 flex-col justify-end gap-3 p-12">
          <h1 className="max-w-md text-3xl font-semibold tracking-tight text-surface-navy-foreground font-heading">
            {headline}
          </h1>
          <p className="max-w-sm text-surface-navy-foreground/85">{subtitle}</p>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col lg:w-1/2">
        <div className="p-6">
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
            />
            Immobiliare
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-4 py-12">
          {children}
        </div>
      </div>
    </div>
  );
}
