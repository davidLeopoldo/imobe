import { renderToBuffer } from "@react-pdf/renderer";
import type { Contrato } from "@/services/contratos-service";
import { ContratoVendaDocument } from "./contrato-venda-document";
import { ContratoLocacaoDocument } from "./contrato-locacao-document";

export async function renderContratoPdf(contrato: Contrato): Promise<Buffer> {
  const documento =
    contrato.tipo === "venda" ? (
      <ContratoVendaDocument contrato={contrato} />
    ) : (
      <ContratoLocacaoDocument contrato={contrato} />
    );

  return renderToBuffer(documento);
}
