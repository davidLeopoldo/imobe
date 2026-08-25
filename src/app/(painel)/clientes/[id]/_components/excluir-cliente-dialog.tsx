"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { excluirClienteAction } from "../_actions/excluir-cliente";

export function ExcluirClienteDialog({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();

  function handleConfirmar() {
    startTransition(async () => {
      const result = await excluirClienteAction(id);
      if (result?.message) {
        toast.error(result.message);
      }
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button variant="destructive" disabled={isPending} />}
      >
        Excluir cliente
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir cliente?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação é irreversível. Contratos já gerados com este cliente
            mantêm seus dados intactos, mas deixam de referenciar o cadastro.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose>Cancelar</AlertDialogClose>
          <AlertDialogClose
            variant="destructive"
            onClick={handleConfirmar}
            disabled={isPending}
          >
            {isPending ? "Excluindo..." : "Confirmar exclusão"}
          </AlertDialogClose>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
