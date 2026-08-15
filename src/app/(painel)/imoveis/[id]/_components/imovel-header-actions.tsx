"use client";

import { useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ImovelStatus } from "@/services/imoveis-service";
import { alternarStatusAction } from "../_actions/alternar-status";

const STATUS_LABEL: Record<ImovelStatus, string> = {
  disponivel: "Disponível",
  indisponivel: "Indisponível",
  alugado: "Alugado",
  vendido: "Vendido",
};

// Regra de negócio 11 (PRD v1.3): "alugado" só é opção se paraAluguel, e
// "vendido" só é opção se paraVenda.
function statusPermitidos(paraVenda: boolean, paraAluguel: boolean): ImovelStatus[] {
  const status: ImovelStatus[] = ["disponivel", "indisponivel"];
  if (paraAluguel) status.push("alugado");
  if (paraVenda) status.push("vendido");
  return status;
}

export function ImovelHeaderActions({
  id,
  status,
  paraVenda,
  paraAluguel,
}: {
  id: number;
  status: ImovelStatus;
  paraVenda: boolean;
  paraAluguel: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const opcoesStatus = statusPermitidos(paraVenda, paraAluguel).filter(
    (opcao) => opcao !== status,
  );

  function handleSelecionarStatus(novoStatus: ImovelStatus) {
    startTransition(async () => {
      const result = await alternarStatusAction(id, novoStatus);
      if (result?.message) {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={isPending}
          className={buttonVariants({ variant: "outline" })}
        >
          Alterar status
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {opcoesStatus.map((opcao) => (
            <DropdownMenuItem key={opcao} onClick={() => handleSelecionarStatus(opcao)}>
              Marcar como {STATUS_LABEL[opcao]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {paraAluguel && (
        <Link
          href={`/imoveis/${id}/recebimentos/novo`}
          className={buttonVariants({ variant: "outline" })}
        >
          Registrar recebimento
        </Link>
      )}
      <Link href={`/imoveis/${id}/contratos/novo`} className={buttonVariants({ variant: "outline" })}>
        Gerar contrato
      </Link>
      <Link href={`/imoveis/${id}/editar`} className={buttonVariants()}>
        Editar
      </Link>
    </div>
  );
}
