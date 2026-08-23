# 0002 — Error boundaries em 3 níveis e limite de body em Server Actions

## Status

Aceito

## Contexto

Durante os testes da feature "Pagamento rápido, Perfil e Fotos do imóvel"
(ver `docs/prd/feature-pagamento-rapido-perfil-fotos.md`), dois problemas
de infraestrutura vieram à tona — nenhum dos dois é regra de negócio da
feature em si, mas afetam qualquer rota do projeto daqui pra frente.

### Problema 1 — Sem error boundary em lugar nenhum

O projeto nunca teve `error.tsx` em nenhum nível (nem na V1, nem nas rotas
novas). Qualquer exceção não tratada — de servidor ou de render — caía na
tela de erro genérica do Next.js, sem estilo, sem ação de recuperação, e
sem relação nenhuma com o design system do Imobe.

### Problema 2 — Server Actions com limite de 1MB

O Next.js limita o corpo de uma Server Action a 1MB por padrão. O fluxo de
cadastro de imóvel enviava todas as fotos numa única chamada de Server
Action; com um arquivo de foto real (~2MB), a chamada falhava com
`Body exceeded 1 MB limit`, testado e reproduzido durante a validação
manual da Fase 3.

## Decisão

### Error boundaries em 3 níveis

Criados três arquivos, cobrindo os pontos de falha do App Router:

- `app/error.tsx` — erro fora do grupo de rotas autenticadas
- `app/(painel)/error.tsx` — erro dentro do painel autenticado, usando
  `Card`/`Button` do design system para manter a UI consistente com o
  resto do produto
- `app/global-error.tsx` — fallback de último nível, para erro no próprio
  layout raiz

Convenção daqui pra frente: **toda rota nova sob `(painel)` é coberta pelo
`error.tsx` do grupo** — não é necessário criar um por rota, a menos que a
rota precise de uma mensagem de erro específica.

### Limite de upload maior + upload sequencial

Duas mudanças combinadas, não uma sozinha:

1. `next.config.ts` ganhou
   `experimental.serverActions.bodySizeLimit: "5mb"` — cobre fotos reais
   dentro do limite validado no client (`TAMANHO_MAXIMO_BYTES` em
   `lib/validations/imovel-foto.ts`).
2. O upload deixou de mandar todas as fotos numa única Server Action e
   passou a disparar **uma Server Action por foto**, em sequência.

A segunda mudança é a mais importante das duas a longo prazo: mesmo com um
limite de body maior, continuar enviando em lote reintroduziria o mesmo
tipo de falha assim que o usuário anexasse fotos suficientes para
ultrapassar o novo teto. Upload sequencial por arquivo escala
independente de quantas fotos o usuário anexar (respeitando o limite de
10 por imóvel já garantido no banco — ver `docs/database.md`).

## Consequências

- Qualquer upload de arquivo futuro no projeto (não só fotos de imóvel)
  deve seguir o padrão "uma Server Action por arquivo", não upload em
  lote — evita reintroduzir o mesmo bug de limite de body.
- `5mb` é o teto de body de Server Action pra todo o projeto agora, não só
  pra fotos — vale considerar isso ao especificar qualquer feature futura
  que envie arquivo maior (ex.: PDF anexado manualmente).
- Erros de servidor não tratados agora têm uma tela consistente com o
  design system, com ação de recuperação, em vez da tela genérica do
  Next.js — reduz o risco de um erro inesperado parecer "produto quebrado"
  pro usuário final.
- Nenhuma das duas mudanças foi motivada por uma regra de negócio do PRD
  da feature — ambas nasceram de bugs encontrados durante o teste manual
  (bugs #2 e #4 do resumo de testes da sessão), o que reforça o valor do
  checklist de teste manual pós-implementação já previsto no workflow do
  projeto.
