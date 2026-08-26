import Image from "next/image";
import { StatusBadge } from "@/components/imoveis/status-badge";
import { TipoImovelBadge } from "@/components/imoveis/tipo-imovel-badge";
import { formatCurrencyBRL } from "@/lib/format";
import type { ImovelStatus } from "@/services/imoveis-service";

export type MockImovelExemplo = {
  endereco: string;
  bairro: string;
  cidade: string;
  valor: number;
  paraVenda: boolean;
  paraAluguel: boolean;
  status: ImovelStatus;
  foto: string;
};

export function MockImovelCard({ imovel }: { imovel: MockImovelExemplo }) {
  return (
    <div className="flex flex-col overflow-hidden border border-border bg-card">
      <div className="relative aspect-video w-full">
        <Image
          src={imovel.foto}
          alt={`Fachada do imóvel na ${imovel.endereco}`}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium leading-tight">{imovel.endereco}</p>
            <p className="text-sm text-muted-foreground">
              {imovel.bairro}, {imovel.cidade}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <StatusBadge status={imovel.status} />
            <TipoImovelBadge
              paraVenda={imovel.paraVenda}
              paraAluguel={imovel.paraAluguel}
            />
          </div>
        </div>
        <p className="text-sm">
          {formatCurrencyBRL(imovel.valor)}
          {imovel.paraAluguel && !imovel.paraVenda ? "/mês" : ""}
        </p>
      </div>
    </div>
  );
}
