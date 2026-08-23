"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalErrorBoundary({
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
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Algo deu errado</h1>
        <p className="mt-1 text-muted-foreground">
          Não foi possível carregar esta página. Tente novamente em instantes.
        </p>
      </div>
      <Button onClick={reset}>Tentar novamente</Button>
    </div>
  );
}
