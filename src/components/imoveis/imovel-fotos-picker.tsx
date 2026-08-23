"use client";

import { useEffect, useMemo, useState } from "react";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  MAXIMO_FOTOS_POR_IMOVEL,
  validarArquivoFoto,
} from "@/lib/validations/imovel-foto";

interface ImovelFotosPickerProps {
  value: File[];
  onChange: (files: File[]) => void;
}

export function ImovelFotosPicker({ value, onChange }: ImovelFotosPickerProps) {
  const [erro, setErro] = useState<string | null>(null);

  const previews = useMemo(
    () => value.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [value]
  );

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  function handleFilesSelected(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;

    setErro(null);
    const novos = Array.from(fileList);
    const aceitos: File[] = [];

    for (const file of novos) {
      if (value.length + aceitos.length >= MAXIMO_FOTOS_POR_IMOVEL) {
        setErro(`Você pode anexar no máximo ${MAXIMO_FOTOS_POR_IMOVEL} fotos.`);
        break;
      }
      const erroArquivo = validarArquivoFoto(file);
      if (erroArquivo) {
        setErro(erroArquivo);
        continue;
      }
      aceitos.push(file);
    }

    if (aceitos.length > 0) {
      onChange([...value, ...aceitos]);
    }
  }

  function handleRemover(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <Field>
      <FieldLabel htmlFor="imovel-fotos">Fotos do imóvel (opcional)</FieldLabel>
      <input
        id="imovel-fotos"
        type="file"
        accept="image/png,image/jpeg"
        multiple
        onChange={(e) => {
          handleFilesSelected(e.target.files);
          e.target.value = "";
        }}
        disabled={value.length >= MAXIMO_FOTOS_POR_IMOVEL}
        className="text-sm text-muted-foreground file:mr-3 file:rounded-md file:border file:border-input file:bg-transparent file:px-3 file:py-1.5 file:text-sm file:font-medium"
      />
      <p className="text-xs text-muted-foreground">
        PNG ou JPG/JPEG, até 3MB cada, no máximo {MAXIMO_FOTOS_POR_IMOVEL} fotos.
      </p>
      {erro && (
        <p role="alert" className="text-sm text-destructive">
          {erro}
        </p>
      )}
      {previews.length > 0 && (
        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {previews.map((preview, index) => (
            <div key={`${preview.file.name}-${index}`} className="group relative aspect-square overflow-hidden rounded-md border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview.url}
                alt={`Foto ${index + 1} selecionada`}
                className="size-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon-sm"
                className="absolute top-1 right-1"
                onClick={() => handleRemover(index)}
              >
                <XIcon className="size-3.5" />
                <span className="sr-only">Remover foto</span>
              </Button>
            </div>
          ))}
        </div>
      )}
    </Field>
  );
}
