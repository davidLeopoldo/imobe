import { DepoimentoCard, type DepoimentoExemplo } from "./depoimento-card";

// Depoimentos ilustrativos — situações fictícias criadas para mostrar
// como o produto se encaixa no dia a dia de quem cadastraria imóveis
// reais. Não são avaliações de clientes.
const DEPOIMENTOS_EXEMPLO: DepoimentoExemplo[] = [
  {
    iniciais: "MT",
    nome: "Marcos T.",
    contexto: "Proprietário, 6 imóveis alugados em Campinas",
    texto:
      "Antes eu controlava os aluguéis em três planilhas diferentes e vivia perdendo o vencimento de algum boleto. Em um mês já tinha os pagamentos organizados num só lugar.",
  },
  {
    iniciais: "RA",
    nome: "Renata A.",
    contexto: "Corretora autônoma, Belo Horizonte",
    texto:
      "Uso para gerar os contratos de locação dos imóveis que administro para terceiros. Economizo pelo menos duas horas por contrato que antes eu montava do zero.",
  },
  {
    iniciais: "EP",
    nome: "Eduardo P.",
    contexto: "Proprietário, 12 imóveis em Porto Alegre",
    texto:
      "Cadastrei os imóveis da família em uma tarde. Hoje sei exatamente quanto está entrando de aluguel todo mês sem precisar ligar para o contador.",
  },
];

export function DepoimentosSection() {
  return (
    <section className="bg-surface-navy text-surface-navy-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex flex-col gap-2">
          <h2 className="text-2xl font-semibold tracking-tight font-heading">
            Quem já organiza os imóveis assim
          </h2>
          <p className="text-xs uppercase tracking-wide text-surface-navy-foreground/50">
            Depoimentos ilustrativos
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {DEPOIMENTOS_EXEMPLO.map((depoimento) => (
            <DepoimentoCard key={depoimento.iniciais} depoimento={depoimento} />
          ))}
        </div>
      </div>
    </section>
  );
}
