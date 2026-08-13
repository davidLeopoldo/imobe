# ADR 0001 — Acesso a dados via Supabase Client direto (sem ORM)

**Status:** Aceito
**Data:** 2026-08-10

## Contexto

Ao planejar a implementação das Fases 1–3 do PRD (base, acesso do usuário, gestão
de imóveis), foi preciso decidir como o Next.js acessaria o banco Postgres do
Supabase. Duas abordagens comuns no mercado:

1. Usar um ORM (Object-Relational Mapper) como **Drizzle** ou **Prisma**, que
   gera um "schema" em TypeScript e traduz chamadas de código em SQL.
2. Usar a **biblioteca oficial do Supabase** (`@supabase/supabase-js` +
   `@supabase/ssr`) diretamente, escrevendo o SQL manualmente.

O projeto está na fase inicial (V1), com escopo enxuto e apenas uma pessoa
desenvolvendo, sem necessidade imediata de migrations versionadas em código.

## Alternativas consideradas

1. **Drizzle ORM sobre Postgres do Supabase**
   - Prós: type-safety automática das queries; migrations versionadas em código;
     padrão que aparece com frequência em projetos Next.js modernos.
   - Contras: camada extra de abstração e setup inicial (schema Drizzle +
     drizzle-kit); mais uma ferramenta para aprender e manter; SQL fica "escondido"
     atrás de uma API de código.

2. **Supabase Client direto (`@supabase/supabase-js` + `@supabase/ssr`)** — escolhida
   - Prós: mais simples de configurar; SQL explícito e visível na pasta `supabase/`,
     facilitando entender exatamente o que roda no banco; segurança de acesso
     delegada ao RLS (Row-Level Security) do Postgres, sem depender de uma camada
     de código adicional para isolar dados por usuário.
   - Contras: sem type-safety automática de schema (os tipos das tabelas não são
     gerados/validados automaticamente a partir do banco); queries mais complexas
     exigem escrever SQL manualmente com mais atenção.

## Decisão

Usar o **Supabase Client oficial** (`@supabase/supabase-js` no client-side e
`@supabase/ssr` no server-side) como única forma de acesso a dados, sem ORM.
Todo SQL de schema (criação de tabelas, políticas de RLS, índices) fica
versionado em arquivos numerados dentro de `supabase/` (ex: `0000_common.sql`,
`0001_create_imoveis.sql`), executados manualmente no SQL Editor do Supabase.

A camada de acesso a dados no código (DAL) — pastas `_data-access/` por rota e
`src/services/` — chama o Supabase Client diretamente, sem intermediário de ORM.

## Consequências

- **Positivo:** onboarding mais rápido (menos uma ferramenta para aprender);
  SQL sempre visível e auditável na pasta `supabase/`; a segurança de isolamento
  de dados entre usuários (Regra de negócio 1 do PRD) é garantida no próprio
  banco via RLS, não depende de lembrar de filtrar por usuário em cada query.
- **Negativo:** se o schema do banco mudar, os tipos TypeScript usados no código
  não são atualizados automaticamente — é responsabilidade do time manter isso
  sincronizado manualmente (ou gerar tipos via `supabase gen types` futuramente).
- **Reversibilidade:** essa decisão pode ser revisitada se o projeto crescer em
  complexidade de queries a ponto de o SQL manual se tornar difícil de manter —
  nesse caso, migrar para Drizzle é possível sem reescrever o banco em si, já
  que o SQL de schema já está documentado e versionado.
