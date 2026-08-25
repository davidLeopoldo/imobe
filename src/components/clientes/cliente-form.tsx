"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  clienteSchema,
  type ClienteFormValues,
} from "@/lib/validations/cliente";
import { maskCpfInput } from "@/lib/validations/cpf";

interface ClienteFormActionResult {
  message?: string;
  clienteExistenteId?: number;
  clienteId?: number;
  success?: boolean;
}

interface ClienteFormProps {
  mode: "criar" | "editar";
  defaultValues?: Partial<ClienteFormValues>;
  action: (
    values: ClienteFormValues
  ) => Promise<ClienteFormActionResult | void>;
}

export function ClienteForm({ mode, defaultValues, action }: ClienteFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [clienteExistenteId, setClienteExistenteId] = useState<number | null>(
    null
  );

  const form = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nome: "",
      endereco: "",
      telefone: "",
      email: "",
      ...defaultValues,
      cpf: maskCpfInput(defaultValues?.cpf ?? ""),
    },
  });

  function onSubmit(values: ClienteFormValues) {
    setServerError(null);
    setClienteExistenteId(null);
    startTransition(async () => {
      const result = await action(values);

      if (result?.message) {
        setServerError(result.message);
        setClienteExistenteId(result.clienteExistenteId ?? null);
        return;
      }

      if (mode === "editar") {
        toast.success("Cliente atualizado com sucesso.");
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="nome"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="cliente-nome">Nome completo</FieldLabel>
              <Input
                {...field}
                id="cliente-nome"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="cpf"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="cliente-cpf">CPF</FieldLabel>
                <Input
                  {...field}
                  id="cliente-cpf"
                  aria-invalid={fieldState.invalid}
                  onChange={(e) => field.onChange(maskCpfInput(e.target.value))}
                  maxLength={14}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="telefone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="cliente-telefone">
                  Telefone (opcional)
                </FieldLabel>
                <Input
                  {...field}
                  id="cliente-telefone"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <Controller
          name="endereco"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="cliente-endereco">
                Endereço completo
              </FieldLabel>
              <Input
                {...field}
                id="cliente-endereco"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="cliente-email">E-mail (opcional)</FieldLabel>
              <Input
                {...field}
                id="cliente-email"
                type="email"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {serverError && (
          <p role="alert" className="text-sm text-destructive">
            {serverError}
            {clienteExistenteId && (
              <>
                {" "}
                <Link
                  href={`/clientes/${clienteExistenteId}`}
                  className="underline underline-offset-4"
                >
                  Ver cadastro existente
                </Link>
              </>
            )}
          </p>
        )}

        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending
              ? "Salvando..."
              : mode === "criar"
                ? "Cadastrar cliente"
                : "Salvar alterações"}
          </Button>
          {mode === "criar" && (
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
          )}
        </div>
      </FieldGroup>
    </form>
  );
}
