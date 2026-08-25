"use client";

import { useEffect } from "react";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="flex min-h-full flex-col items-center justify-center gap-4 p-6 text-center">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Algo deu errado
          </h1>
          <p className="mt-1 text-muted-foreground">
            O Immobiliare não conseguiu carregar. Tente novamente em instantes.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Tentar novamente
        </button>
      </body>
    </html>
  );
}
