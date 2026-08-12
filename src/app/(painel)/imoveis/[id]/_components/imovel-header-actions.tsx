"use client";

import { useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import type { ImovelStatus } from "@/services/imoveis-service";
import { alternarStatusAction } from "../_actions/alternar-status";

const TOGGLE_LABEL: Record<ImovelStatus, string> = {
  disponivel: "Marcar como indisponível",
  indisponivel: "Marcar como disponível",
  alugado: "Marcar como indisponível",
  vendido: "Marcar como indisponível",
};

export function ImovelHeaderActions({ id, status }: { id: number; status: ImovelStatus }) {
  const [isPending, startTransition] = useTransition();

  function handleToggleStatus() {
    startTransition(async () => {
      const result = await alternarStatusAction(id, status);
      if (result?.message) {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" disabled={isPending} onClick={handleToggleStatus}>
        {TOGGLE_LABEL[status]}
      </Button>
      <Link href={`/imoveis/${id}/editar`} className={buttonVariants()}>
        Editar
      </Link>
    </div>
  );
}
