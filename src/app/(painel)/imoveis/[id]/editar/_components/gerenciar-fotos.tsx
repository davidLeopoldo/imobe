"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MAXIMO_FOTOS_POR_IMOVEL,
  validarArquivoFoto,
} from "@/lib/validations/imovel-foto";
import type { ImovelFotoComUrl } from "@/services/imovel-fotos-service";
import { adicionarFotoAction } from "../_actions/adicionar-foto";
import { removerFotoAction } from "../_actions/remover-foto";

export function GerenciarFotos({
  imovelId,
  fotos,
}: {
  imovelId: number;
  fotos: ImovelFotoComUrl[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  function handleAdicionar(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setErro(null);

    const arquivos = Array.from(fileList);
    if (fotos.length + arquivos.length > MAXIMO_FOTOS_POR_IMOVEL) {
      setErro(`Este imóvel pode ter no máximo ${MAXIMO_FOTOS_POR_IMOVEL} fotos.`);
      return;
    }

    for (const file of arquivos) {
      const erroArquivo = validarArquivoFoto(file);
      if (erroArquivo) {
        setErro(erroArquivo);
        continue;
      }
      startTransition(async () => {
        const result = await adicionarFotoAction(imovelId, file);
        if (result?.message) {
          toast.error(result.message);
          return;
        }
        router.refresh();
      });
    }
  }

  function handleRemover(fotoId: number) {
    startTransition(async () => {
      const result = await removerFotoAction(fotoId);
      if (result?.message) {
        toast.error(result.message);
        return;
      }
      toast.success("Foto removida.");
      router.refresh();
    });
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Fotos do imóvel</CardTitle>
      </CardHeader>
      <CardContent>
        {fotos.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {fotos.map((foto) => (
              <div key={foto.id} className="group relative aspect-square overflow-hidden rounded-md border">
                {foto.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={foto.url} alt="Foto do imóvel" className="size-full object-cover" />
                ) : (
                  <div className="flex size-full items-center justify-center bg-muted text-xs text-muted-foreground">
                    Indisponível
                  </div>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-sm"
                  className="absolute top-1 right-1"
                  disabled={isPending}
                  onClick={() => handleRemover(foto.id)}
                >
                  <XIcon className="size-3.5" />
                  <span className="sr-only">Remover foto</span>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhuma foto anexada ainda.</p>
        )}

        <div className="mt-4">
          <input
            type="file"
            accept="image/png,image/jpeg"
            multiple
            disabled={isPending || fotos.length >= MAXIMO_FOTOS_POR_IMOVEL}
            onChange={(e) => {
              handleAdicionar(e.target.files);
              e.target.value = "";
            }}
            className="text-sm text-muted-foreground file:mr-3 file:rounded-md file:border file:border-input file:bg-transparent file:px-3 file:py-1.5 file:text-sm file:font-medium"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            PNG ou JPG/JPEG, até 3MB cada, no máximo {MAXIMO_FOTOS_POR_IMOVEL} fotos.
          </p>
          {erro && (
            <p role="alert" className="mt-1 text-sm text-destructive">
              {erro}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
