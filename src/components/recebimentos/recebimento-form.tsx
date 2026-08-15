"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  recebimentoSchema,
  type RecebimentoFormValues,
} from "@/lib/validations/recebimento";

interface RecebimentoFormActionResult {
  message?: string;
}

interface RecebimentoFormProps {
  action: (values: RecebimentoFormValues) => Promise<RecebimentoFormActionResult | void>;
}

function hojeISO() {
  return new Date().toISOString().slice(0, 10);
}

export function RecebimentoForm({ action }: RecebimentoFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<RecebimentoFormValues>({
    resolver: zodResolver(recebimentoSchema),
    defaultValues: {
      valor: "",
      mesReferencia: hojeISO().slice(0, 7),
      dataRecebimento: hojeISO(),
      observacao: "",
    },
  });

  function onSubmit(values: RecebimentoFormValues) {
    setServerError(null);
    startTransition(async () => {
      const result = await action(values);
      if (result?.message) {
        setServerError(result.message);
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="mesReferencia"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="recebimento-mes-referencia">Mês de referência</FieldLabel>
                <Input
                  {...field}
                  id="recebimento-mes-referencia"
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
                <FieldLabel htmlFor="recebimento-valor">Valor recebido (R$)</FieldLabel>
                <Input
                  id="recebimento-valor"
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

        <Controller
          name="dataRecebimento"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="recebimento-data">Data do recebimento</FieldLabel>
              <Input
                {...field}
                id="recebimento-data"
                type="date"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="observacao"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="recebimento-observacao">Observação (opcional)</FieldLabel>
              <Textarea
                {...field}
                id="recebimento-observacao"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {serverError && (
          <p role="alert" className="text-sm text-destructive">
            {serverError}
          </p>
        )}

        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Registrar recebimento"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
