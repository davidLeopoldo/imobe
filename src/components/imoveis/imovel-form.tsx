"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ImovelFotosPicker } from "@/components/imoveis/imovel-fotos-picker";
import { imovelSchema, type ImovelFormValues } from "@/lib/validations/imovel";

interface ImovelFormActionResult {
  message?: string;
  imovelId?: number;
}

interface ImovelFormProps {
  mode: "criar" | "editar";
  defaultValues?: Partial<ImovelFormValues>;
  action: (values: ImovelFormValues) => Promise<ImovelFormActionResult | void>;
  /**
   * Só usado em mode="criar". Chamado uma vez por foto selecionada, depois
   * que o imóvel já foi criado — cada foto vira uma Server Action própria
   * (em vez de enviar todas juntas), para não esbarrar no limite de body
   * de uma única Server Action com fotos grandes.
   */
  onUploadFoto?: (imovelId: number, foto: File) => Promise<{ message?: string } | void>;
}

export function ImovelForm({ mode, defaultValues, action, onUploadFoto }: ImovelFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [fotos, setFotos] = useState<File[]>([]);

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
        return;
      }

      if (mode === "criar" && result?.imovelId && onUploadFoto) {
        const falhas: string[] = [];
        for (const foto of fotos) {
          const resultadoFoto = await onUploadFoto(result.imovelId, foto).catch(
            (error: unknown): { message?: string } => ({
              message: error instanceof Error ? error.message : undefined,
            })
          );
          if (resultadoFoto?.message) {
            falhas.push(`${foto.name}: ${resultadoFoto.message}`);
          }
        }

        if (falhas.length > 0) {
          // Falha isolada no upload de uma foto não impede o cadastro do
          // imóvel, que já foi criado com sucesso — mas o usuário precisa
          // saber quais fotos não entraram (Spec 03 do PRD).
          toast.error(
            falhas.length === 1
              ? `Não foi possível enviar 1 foto: ${falhas[0]}`
              : `Não foi possível enviar ${falhas.length} fotos:\n${falhas.join("\n")}`
          );
        }

        router.push(`/imoveis/${result.imovelId}`);
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

        {mode === "criar" && <ImovelFotosPicker value={fotos} onChange={setFotos} />}

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
