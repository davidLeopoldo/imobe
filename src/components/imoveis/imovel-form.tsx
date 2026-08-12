"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { imovelSchema, type ImovelFormValues } from "@/lib/validations/imovel";

interface ImovelFormActionResult {
  message?: string;
}

interface ImovelFormProps {
  mode: "criar" | "editar";
  defaultValues?: Partial<ImovelFormValues>;
  action: (values: ImovelFormValues) => Promise<ImovelFormActionResult | void>;
}

export function ImovelForm({ mode, defaultValues, action }: ImovelFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ImovelFormValues>({
    resolver: zodResolver(imovelSchema),
    defaultValues: {
      paraVenda: false,
      paraAluguel: false,
      localizacao: "",
      endereco: "",
      bairro: "",
      cidade: "",
      linkAnuncio: "",
      ...defaultValues,
    },
  });

  function onSubmit(values: ImovelFormValues) {
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
        <div className="flex gap-6">
          <Controller
            name="paraVenda"
            control={form.control}
            render={({ field }) => (
              <Field orientation="horizontal">
                <Checkbox
                  id="imovel-para-venda"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
                <FieldLabel htmlFor="imovel-para-venda">Para venda</FieldLabel>
              </Field>
            )}
          />
          <Controller
            name="paraAluguel"
            control={form.control}
            render={({ field }) => (
              <Field orientation="horizontal">
                <Checkbox
                  id="imovel-para-aluguel"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
                <FieldLabel htmlFor="imovel-para-aluguel">Para aluguel</FieldLabel>
              </Field>
            )}
          />
        </div>
        {form.formState.errors.paraVenda && (
          <FieldError errors={[form.formState.errors.paraVenda]} />
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="valorVenda"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="imovel-valor-venda">Valor de venda (R$)</FieldLabel>
                <Input
                  id="imovel-valor-venda"
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

          <Controller
            name="valorAluguel"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="imovel-valor-aluguel">Valor de aluguel (R$)</FieldLabel>
                <Input
                  id="imovel-valor-aluguel"
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

          <Controller
            name="valorIptu"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="imovel-valor-iptu">Valor do IPTU (R$)</FieldLabel>
                <Input
                  id="imovel-valor-iptu"
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

          <Controller
            name="valorEstimado"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="imovel-valor-estimado">Valor estimado do imóvel (R$)</FieldLabel>
                <Input
                  id="imovel-valor-estimado"
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
          name="endereco"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="imovel-endereco">Endereço completo</FieldLabel>
              <Input {...field} id="imovel-endereco" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="bairro"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="imovel-bairro">Bairro</FieldLabel>
                <Input {...field} id="imovel-bairro" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="cidade"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="imovel-cidade">Cidade</FieldLabel>
                <Input {...field} id="imovel-cidade" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Controller
          name="localizacao"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="imovel-localizacao">Localização (opcional)</FieldLabel>
              <Input
                {...field}
                id="imovel-localizacao"
                placeholder="Ex.: Zona Sul, próximo ao metrô"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="linkAnuncio"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="imovel-link-anuncio">Link do anúncio (opcional)</FieldLabel>
              <Input
                {...field}
                id="imovel-link-anuncio"
                type="url"
                placeholder="https://..."
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
            {isPending
              ? "Salvando..."
              : mode === "criar"
                ? "Cadastrar imóvel"
                : "Salvar alterações"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
