"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { perfilSchema, type PerfilFormValues } from "@/lib/validations/perfil";

interface PerfilFormActionResult {
  message?: string;
}

interface PerfilFormProps {
  email: string;
  defaultValues?: Partial<PerfilFormValues>;
  action: (values: PerfilFormValues) => Promise<PerfilFormActionResult | void>;
}

export function PerfilForm({ email, defaultValues, action }: PerfilFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<PerfilFormValues>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      nome: "",
      telefone: "",
      instagram: "",
      tiktok: "",
      ...defaultValues,
    },
  });

  function onSubmit(values: PerfilFormValues) {
    setServerError(null);
    startTransition(async () => {
      const result = await action(values);
      if (result?.message) {
        setServerError(result.message);
        return;
      }
      toast.success("Perfil atualizado.");
      router.refresh();
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
              <FieldLabel htmlFor="perfil-nome">Nome</FieldLabel>
              <Input
                {...field}
                id="perfil-nome"
                placeholder="Seu nome completo"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <FieldLabel htmlFor="perfil-email">E-mail</FieldLabel>
          <Input id="perfil-email" value={email} disabled readOnly />
        </Field>

        <Controller
          name="telefone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="perfil-telefone">Telefone/WhatsApp (opcional)</FieldLabel>
              <Input
                {...field}
                id="perfil-telefone"
                type="tel"
                placeholder="(11) 91234-5678"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="instagram"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="perfil-instagram">Instagram (opcional)</FieldLabel>
                <Input
                  {...field}
                  id="perfil-instagram"
                  placeholder="@seuusuario"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="tiktok"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="perfil-tiktok">TikTok (opcional)</FieldLabel>
                <Input
                  {...field}
                  id="perfil-tiktok"
                  placeholder="@seuusuario"
                  aria-invalid={fieldState.invalid}
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

        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
