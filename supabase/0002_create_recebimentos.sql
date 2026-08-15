-- Tabela de recebimentos de aluguel, sempre vinculada a um imóvel e ao usuário
-- dono do imóvel (Regra de negócio 10 do PRD).

create table public.recebimentos (
  id bigint generated always as identity primary key,
  imovel_id bigint not null references public.imoveis (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,

  valor numeric(12, 2) not null,

  -- Mês de referência do aluguel, sempre normalizado para o dia 1
  -- (ex.: "2026-03-01" representa o aluguel de março/2026). Facilita
  -- filtros por período (mês / 6 meses / 12 meses) com gte/lte nativos.
  mes_referencia date not null,
  data_recebimento date not null default current_date,
  observacao text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint recebimentos_valor_positivo
    check (valor > 0),
  constraint recebimentos_mes_referencia_dia1
    check (extract(day from mes_referencia) = 1),

  -- Um único recebimento lançado por imóvel/mês (Fluxo 3 do PRD: "registra
  -- o recebimento do mês").
  constraint recebimentos_imovel_mes_unico
    unique (imovel_id, mes_referencia)
);

create index recebimentos_user_id_idx on public.recebimentos (user_id);
create index recebimentos_imovel_id_idx on public.recebimentos (imovel_id, mes_referencia desc);

create trigger recebimentos_set_updated_at
  before update on public.recebimentos
  for each row execute function public.set_updated_at();

alter table public.recebimentos enable row level security;
alter table public.recebimentos force row level security;

create policy recebimentos_select_own on public.recebimentos
  for select
  to authenticated
  using (user_id = (select auth.uid()));

-- Além de user_id = auth.uid() na própria linha, valida que o imovel_id
-- informado realmente pertence ao usuário logado — evita que alguém
-- registre um recebimento apontando para o imóvel de outra pessoa.
create policy recebimentos_insert_own on public.recebimentos
  for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.imoveis i
      where i.id = imovel_id and i.user_id = (select auth.uid())
    )
  );

create policy recebimentos_update_own on public.recebimentos
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy recebimentos_delete_own on public.recebimentos
  for delete
  to authenticated
  using (user_id = (select auth.uid()));
