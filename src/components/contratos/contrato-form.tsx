"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { contratoSchema, type ContratoFormValues } from "@/lib/validations/contrato";
import type { ContratoTipo } from "@/services/contratos-service";

interface ContratoFormActionResult {
  message?: string;
}

interface ContratoFormProps {
  defaultValues?: Partial<ContratoFormValues>;
  tiposDisponiveis: ContratoTipo[];
  valoresPorTipo?: Partial<Record<ContratoTipo, string>>;
  action: (values: ContratoFormValues) => Promise<ContratoFormActionResult | void>;
}

const TIPO_LABEL: Record<ContratoTipo, string> = {
  venda: "Venda",
  locacao: "Locação",
};

export function ContratoForm({
  defaultValues,
  tiposDisponiveis,
  valoresPorTipo,
  action,
}: ContratoFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ContratoFormValues>({
    resolver: zodResolver(contratoSchema),
    defaultValues: {
      tipo: tiposDisponiveis[0],
      imovelEndereco: "",
      imovelBairro: "",
      imovelCidade: "",
      imovelValor: "",
      proprietarioNome: "",
      proprietarioCpf: "",
      proprietarioEndereco: "",
      contraparteNome: "",
      contraparteCpf: "",
      contraparteEndereco: "",
      dataContrato: new Date().toISOString().slice(0, 10),
      prazoMeses: "",
      formaPagamento: "",
      ...defaultValues,
    },
  });

  const tipo = form.watch("tipo");

  useEffect(() => {
    const valor = valoresPorTipo?.[tipo];
    if (valor) {
      form.setValue("imovelValor", valor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo]);

  function onSubmit(values: ContratoFormValues) {
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
        <Controller
          name="tipo"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Tipo de contrato</FieldLabel>
              <RadioGroup
                value={field.value}
                onValueChange={(value) => field.onChange(value as ContratoTipo)}
                className="flex flex-row flex-wrap gap-4"
              >
                {tiposDisponiveis.map((valor) => (
                  <FieldLabel key={valor} className="flex items-center gap-2">
                    <RadioGroupItem value={valor} />
                    {TIPO_LABEL[valor]}
                  </FieldLabel>
                ))}
              </RadioGroup>
            </Field>
          )}
        />

        <FieldGroup>
          <Field>
            <FieldLabel className="text-base font-medium">Dados do imóvel</FieldLabel>
          </Field>

          <Controller
            name="imovelEndereco"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="contrato-imovel-endereco">Endereço</FieldLabel>
                <Input {...field} id="contrato-imovel-endereco" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              name="imovelBairro"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="contrato-imovel-bairro">Bairro</FieldLabel>
                  <Input {...field} id="contrato-imovel-bairro" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="imovelCidade"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="contrato-imovel-cidade">Cidade</FieldLabel>
                  <Input {...field} id="contrato-imovel-cidade" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              name="imovelValor"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="contrato-imovel-valor">
                    {tipo === "locacao" ? "Valor do aluguel (R$)" : "Valor de venda (R$)"}
                  </FieldLabel>
                  <Input
                    id="contrato-imovel-valor"
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

            {tipo === "locacao" && (
              <Controller
                name="prazoMeses"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="contrato-prazo-meses">Prazo (meses)</FieldLabel>
                    <Input
                      id="contrato-prazo-meses"
                      type="number"
                      min="1"
                      step="1"
                      aria-invalid={fieldState.invalid}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            )}
          </div>

          <Controller
            name="formaPagamento"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="contrato-forma-pagamento">
                  Forma de pagamento (opcional)
                </FieldLabel>
                <Input {...field} id="contrato-forma-pagamento" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="dataContrato"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="contrato-data">Data do contrato</FieldLabel>
                <Input {...field} id="contrato-data" type="date" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup>
          <Field>
            <FieldLabel className="text-base font-medium">
              {tipo === "locacao" ? "Locador (proprietário)" : "Vendedor (proprietário)"}
            </FieldLabel>
          </Field>

          <Controller
            name="proprietarioNome"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="contrato-proprietario-nome">Nome completo</FieldLabel>
                <Input {...field} id="contrato-proprietario-nome" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              name="proprietarioCpf"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="contrato-proprietario-cpf">CPF</FieldLabel>
                  <Input {...field} id="contrato-proprietario-cpf" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="proprietarioEndereco"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="contrato-proprietario-endereco">Endereço</FieldLabel>
                  <Input {...field} id="contrato-proprietario-endereco" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
        </FieldGroup>

        <FieldGroup>
          <Field>
            <FieldLabel className="text-base font-medium">
              {tipo === "locacao" ? "Locatário" : "Comprador"}
            </FieldLabel>
          </Field>

          <Controller
            name="contraparteNome"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="contrato-contraparte-nome">Nome completo</FieldLabel>
                <Input {...field} id="contrato-contraparte-nome" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              name="contraparteCpf"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="contrato-contraparte-cpf">CPF</FieldLabel>
                  <Input {...field} id="contrato-contraparte-cpf" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="contraparteEndereco"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="contrato-contraparte-endereco">Endereço</FieldLabel>
                  <Input {...field} id="contrato-contraparte-endereco" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
        </FieldGroup>

        {serverError && (
          <p role="alert" className="text-sm text-destructive">
            {serverError}
          </p>
        )}

        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Gerando contrato..." : "Gerar contrato"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
