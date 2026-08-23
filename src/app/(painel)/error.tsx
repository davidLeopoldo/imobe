"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";

export default function PainelErrorBoundary({
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
    <div className="mx-auto flex max-w-md flex-1 items-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Algo deu errado</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar esta página. Isso pode ter sido uma
            falha passageira — tente novamente, ou volte para o Dashboard.
          </p>
          <div className="flex gap-2">
            <Button onClick={reset}>Tentar novamente</Button>
            <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
              Ir para o Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
