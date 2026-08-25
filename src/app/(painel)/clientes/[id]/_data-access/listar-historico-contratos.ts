export interface HistoricoContratoItem {
  id: number;
  tipo: "venda" | "locacao";
  dataContrato: string;
  papel: "proprietario" | "contraparte";
}

/**
 * A Fase 1 (Specs 01-04) entrega esta tela já com a seção de histórico
 * pronta, mas `contratos` ainda não tem colunas de referência a `clientes`
 * — isso só é adicionado na Fase 2 (Specs 05/06), quando o formulário de
 * contrato passa a vincular um cliente por lado. Até lá, o histórico fica
 * sempre vazio (comportamento esperado, não um bug).
 */
export async function listarHistoricoContratos(
  clienteId: number
): Promise<HistoricoContratoItem[]> {
  void clienteId;
  return [];
}
