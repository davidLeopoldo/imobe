import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export type DepoimentoExemplo = {
  iniciais: string;
  nome: string;
  contexto: string;
  texto: string;
};

export function DepoimentoCard({
  depoimento,
}: {
  depoimento: DepoimentoExemplo;
}) {
  return (
    <div className="flex flex-col gap-4 border border-surface-navy-foreground/15 p-6">
      <p className="text-surface-navy-foreground/90">
        &ldquo;{depoimento.texto}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>{depoimento.iniciais}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium text-surface-navy-foreground">
            {depoimento.nome}
          </p>
          <p className="text-xs text-surface-navy-foreground/60">
            {depoimento.contexto}
          </p>
        </div>
      </div>
    </div>
  );
}
