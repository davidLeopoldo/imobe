-- Tabela de imóveis do usuário, com RLS garantindo isolamento por dono
-- (Regra de negócio 1 do PRD: cada usuário só vê e gerencia seus próprios imóveis).

create table public.imoveis (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,

  -- Tipo de operação (Regra de negócio 3: venda, aluguel ou ambos).
  para_venda boolean not null default false,
  para_aluguel boolean not null default false,

  -- Valores (Regras de negócio 4 e 5: obrigatórios conforme o tipo).
  valor_venda numeric(12, 2),
  valor_aluguel numeric(12, 2),
  valor_iptu numeric(12, 2),
  valor_estimado numeric(12, 2),

  -- Dados complementares (PRD seção 6.1).
  localizacao text,
  endereco text not null,
  bairro text not null,
  cidade text not null,
  link_anuncio text,

  -- Status exibido no detalhe do imóvel (Fase 3) e usado na visão de
  -- patrimônio (Fase 6) — modelado já com os 4 valores para evitar
  -- migração de schema mais adiante.
  status text not null default 'disponivel'
    check (status in ('disponivel', 'indisponivel', 'alugado', 'vendido')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint imoveis_tipo_operacao_check
    check (para_venda or para_aluguel),
  constraint imoveis_valor_venda_obrigatorio
    check (not para_venda or valor_venda is not null),
  constraint imoveis_valor_aluguel_obrigatorio
    check (not para_aluguel or valor_aluguel is not null),
  constraint imoveis_valor_venda_positivo
    check (valor_venda is null or valor_venda > 0),
  constraint imoveis_valor_aluguel_positivo
    check (valor_aluguel is null or valor_aluguel > 0),
  constraint imoveis_valor_iptu_positivo
    check (valor_iptu is null or valor_iptu > 0),
  constraint imoveis_valor_estimado_positivo
    check (valor_estimado is null or valor_estimado > 0)
);

create index imoveis_user_id_idx on public.imoveis (user_id);

create trigger imoveis_set_updated_at
  before update on public.imoveis
  for each row execute function public.set_updated_at();

alter table public.imoveis enable row level security;
alter table public.imoveis force row level security;

create policy imoveis_select_own on public.imoveis
  for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy imoveis_insert_own on public.imoveis
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy imoveis_update_own on public.imoveis
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy imoveis_delete_own on public.imoveis
  for delete
  to authenticated
  using (user_id = (select auth.uid()));
