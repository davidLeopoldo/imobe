"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { ImovelFotoComUrl } from "@/services/imovel-fotos-service";

export function FotosGaleria({ fotos }: { fotos: ImovelFotoComUrl[] }) {
  const [indiceAberto, setIndiceAberto] = useState<number | null>(null);
  const fotosComUrl = fotos.filter(
    (foto): foto is ImovelFotoComUrl & { url: string } => Boolean(foto.url)
  );

  if (fotosComUrl.length === 0) return null;

  function irParaAnterior() {
    setIndiceAberto((atual) =>
      atual === null ? null : (atual - 1 + fotosComUrl.length) % fotosComUrl.length
    );
  }

  function irParaProxima() {
    setIndiceAberto((atual) => (atual === null ? null : (atual + 1) % fotosComUrl.length));
  }

  const fotoAberta = indiceAberto !== null ? fotosComUrl[indiceAberto] : null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Fotos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {fotosComUrl.map((foto, index) => (
            <button
              key={foto.id}
              type="button"
              onClick={() => setIndiceAberto(index)}
              className="aspect-square overflow-hidden rounded-md border transition-opacity hover:opacity-80"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={foto.url}
                alt="Foto do imóvel"
                loading="lazy"
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
      </CardContent>

      <Dialog
        open={fotoAberta !== null}
        onOpenChange={(open) => {
          if (!open) setIndiceAberto(null);
        }}
      >
        <DialogContent className="max-w-3xl p-2 sm:p-3" showCloseButton>
          <DialogTitle className="sr-only">Foto do imóvel</DialogTitle>
          {fotoAberta && (
            <div className="relative flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fotoAberta.url}
                alt="Foto do imóvel em tamanho ampliado"
                className="max-h-[75vh] w-full rounded-md object-contain"
              />
              {fotosComUrl.length > 1 && (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 shadow"
                    onClick={irParaAnterior}
                  >
                    <ChevronLeft />
                    <span className="sr-only">Foto anterior</span>
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 shadow"
                    onClick={irParaProxima}
                  >
                    <ChevronRight />
                    <span className="sr-only">Próxima foto</span>
                  </Button>
                </>
              )}
            </div>
          )}
          {fotosComUrl.length > 1 && indiceAberto !== null && (
            <p className="text-center text-sm text-muted-foreground">
              {indiceAberto + 1} / {fotosComUrl.length}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
