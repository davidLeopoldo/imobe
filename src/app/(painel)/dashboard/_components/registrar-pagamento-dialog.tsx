"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  pagamentoRapidoSchema,
  type PagamentoRapidoFormValues,
} from "@/lib/validations/pagamento-rapido";
import { registrarPagamentoRapidoAction } from "../_actions/registrar-pagamento-rapido";

interface ImovelAlugado {
  id: number;
  endereco: string;
  bairro: string;
  cidade: string;
}

function hojeISO() {
  return new Date().toISOString().slice(0, 7);
}

export function RegistrarPagamentoDialog({ imoveis }: { imoveis: ImovelAlugado[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<PagamentoRapidoFormValues>({
    resolver: zodResolver(pagamentoRapidoSchema),
    defaultValues: {
      imovelId: 0,
      mesReferencia: hojeISO(),
      valor: "",
    },
  });

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setServerError(null);
      form.reset({ imovelId: 0, mesReferencia: hojeISO(), valor: "" });
    }
  }

  function onSubmit(values: PagamentoRapidoFormValues) {
    setServerError(null);
    startTransition(async () => {
      const result = await registrarPagamentoRapidoAction(values);
      if (result?.message) {
        setServerError(result.message);
        return;
      }
      toast.success("Pagamento registrado com sucesso.");
      handleOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button />}>Registrar pagamento</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar pagamento de aluguel</DialogTitle>
          <DialogDescription>
            Selecione o imóvel alugado e informe o mês e o valor recebido.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="imovelId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="pagamento-imovel">Imóvel</FieldLabel>
                  <Select
                    value={field.value ? String(field.value) : null}
                    onValueChange={(value) => field.onChange(value ? Number(value) : 0)}
                  >
                    <SelectTrigger id="pagamento-imovel" className="w-full" aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Selecione um imóvel alugado">
                        {(value: string | null) => {
                          const imovel = imoveis.find((i) => String(i.id) === value);
                          return imovel
                            ? `${imovel.endereco} — ${imovel.bairro}, ${imovel.cidade}`
                            : "Selecione um imóvel alugado";
                        }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {imoveis.map((imovel) => (
                        <SelectItem key={imovel.id} value={String(imovel.id)}>
                          {imovel.endereco} — {imovel.bairro}, {imovel.cidade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {imoveis.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Você não tem nenhum imóvel com status &quot;alugado&quot; no momento.
                    </p>
                  )}
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="mesReferencia"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="pagamento-mes">Mês de referência</FieldLabel>
                    <Input
                      {...field}
                      id="pagamento-mes"
                      type="month"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="valor"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="pagamento-valor">Valor recebido (R$)</FieldLabel>
                    <Input
                      id="pagamento-valor"
                      type="number"
                      step="0.01"
                      min="0"
                      aria-invalid={fieldState.invalid}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            {serverError && (
              <p role="alert" className="text-sm text-destructive">
                {serverError}
              </p>
            )}

            <DialogFooter>
              <Button type="submit" disabled={isPending || imoveis.length === 0}>
                {isPending ? "Registrando..." : "Registrar pagamento"}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
