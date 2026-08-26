import { MockImovelCard, type MockImovelExemplo } from "./mock-imovel-card";

// Dados de exemplo apenas para ilustrar a interface na landing pública —
// não vêm do banco, não representam imóveis reais.
const MOCK_IMOVEIS_EXEMPLO: MockImovelExemplo[] = [
  {
    endereco: "Rua das Acácias, 128",
    bairro: "Jardim Europa",
    cidade: "São Paulo",
    valor: 890000,
    paraVenda: true,
    paraAluguel: false,
    status: "disponivel",
    foto: "/landing/mock-imovel-1.jpg",
  },
  {
    endereco: "Rua Bela Vista, 245",
    bairro: "Vila Madalena",
    cidade: "São Paulo",
    valor: 3200,
    paraVenda: false,
    paraAluguel: true,
    status: "indisponivel",
    foto: "/landing/mock-imovel-2.jpg",
  },
  {
    endereco: "Alameda dos Ipês, 77",
    bairro: "Alto de Pinheiros",
    cidade: "São Paulo",
    valor: 1450000,
    paraVenda: true,
    paraAluguel: false,
    status: "vendido",
    foto: "/landing/mock-imovel-3.jpg",
  },
  {
    endereco: "Rua do Bosque, 512",
    bairro: "Moema",
    cidade: "São Paulo",
    valor: 2800,
    paraVenda: false,
    paraAluguel: true,
    status: "alugado",
    foto: "/landing/mock-imovel-4.jpg",
  },
];

export function MockImoveisSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight font-heading">
          Assim fica o cadastro dos seus imóveis
        </h2>
        <p className="text-muted-foreground">
          Exemplo de como os cards de imóveis aparecem no seu painel — com
          status, tipo e valor sempre visíveis.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_IMOVEIS_EXEMPLO.map((imovel) => (
          <MockImovelCard key={imovel.endereco} imovel={imovel} />
        ))}
      </div>
    </section>
  );
}
