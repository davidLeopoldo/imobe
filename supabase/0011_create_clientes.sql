-- Tabela de clientes (Spec 01-04 do PRD "Cadastro de Clientes integrado ao
-- fluxo de Contratos"). Pessoa física reutilizável entre contratos futuros.
--
-- CPF é armazenado normalizado (somente dígitos) para que a unicidade por
-- usuário valha independente de como o usuário formatou o CPF na digitação
-- (Regra de negócio 3 e caso de borda descrito na Spec 01).

create table public.clientes (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,

  nome text not null,
  cpf text not null,
  endereco text not null,
  telefone text,
  email text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint clientes_cpf_unico_por_usuario unique (user_id, cpf)
);

create index clientes_user_id_idx on public.clientes (user_id);

create trigger clientes_set_updated_at
  before update on public.clientes
  for each row execute function public.set_updated_at();

alter table public.clientes enable row level security;
alter table public.clientes force row level security;

create policy clientes_select_own on public.clientes
  for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy clientes_insert_own on public.clientes
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy clientes_update_own on public.clientes
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy clientes_delete_own on public.clientes
  for delete
  to authenticated
  using (user_id = (select auth.uid()));
