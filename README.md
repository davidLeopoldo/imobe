# Vibe Coding Kit

Micro-SaaS de gestão de imóveis, contratos e patrimônio — para proprietários
que alugam/vendem imóveis e corretores autônomos.

Cada usuário enxerga e gerencia apenas seus próprios imóveis, contratos e
recebimentos (isolamento garantido via Row-Level Security no Postgres).

## Documentação

- **[Projeto](docs/projeto.md)** — o que o Imobe é e o que já faz hoje,
  sempre atualizado (missão, público-alvo, escopo, funcionalidades em
  produção).
- **[PRD da V1](docs/PRD-Imobe-v1.md)** — visão geral, funcionalidades,
  regras de negócio, fluxos, critérios de aceite e fases de construção da
  primeira versão.
- **[PRDs de features](docs/prd/)** — PRDs de melhorias feitas depois da V1
  (ex.: [pagamento rápido, perfil e fotos do imóvel](docs/prd/feature-pagamento-rapido-perfil-fotos.md)).
- **[Banco de dados](docs/database.md)** — schema do Postgres, tabelas,
  constraints, RLS e buckets de storage.
- **[ADRs](docs/adr/)** — decisões de arquitetura e seus porquês.
- **[Regras do projeto](.claude/rules/)** — convenções seguidas pela IA e pelo
  time ao gerar código.

## Stack

- **Front-end:** Next.js 16 (App Router) + TypeScript + TailwindCSS
- **Back-end:** rotas de servidor do próprio Next.js (sem servidor separado)
- **Banco de dados / Auth / Storage:** Supabase (Postgres + RLS)
- **UI:** Base UI + componentes locais em `src/components/ui`
- **Dados assíncronos:** TanStack Query
- **Validação:** Zod

## Estrutura do projeto

```
src/
  app/
    (public)/     → rotas públicas: landing, login, cadastro
    (painel)/     → rotas privadas: dashboard, imóveis (protegidas via proxy.ts)
  components/
    layout/        → header, sidebar, navegação mobile
    imoveis/        → componentes específicos de imóveis
    ui/              → componentes base reutilizáveis
  lib/
    supabase/       → clients (browser, server, middleware)
    validations/    → schemas Zod
  services/          → lógica de negócio compartilhada entre features
supabase/            → SQL de schema, versionado e numerado
docs/                → PRD e ADRs
```

Cada rota de feature (ex: `imoveis/`) segue o padrão de colocation definido em
[`.claude/rules/page-rules.md`](.claude/rules/page-rules.md): `_components/`,
`_actions/` (Server Actions) e `_data-access/` (DAL) vivem dentro da própria
pasta da rota.

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # preencher com as credenciais do seu projeto Supabase
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Banco de dados

O schema fica em `supabase/`, numerado em ordem de execução. Rode cada arquivo
`.sql` manualmente no **SQL Editor** do dashboard do Supabase, na ordem
numérica (`0000_...`, `0001_...`, ...).

## Escopo da V1

Consulte a seção "Funcionalidades" e "Fora do escopo" do
[PRD](docs/PRD-Imobe-v1.md) para o que está e o que não está incluído nesta
versão.
