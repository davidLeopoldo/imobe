-- Tabela de contratos gerados pelo usuário (venda ou locação), com relação
-- OPCIONAL ao imóvel (Regras de negócio 6, 7 e 8 do PRD: um contrato pode
-- ser gerado a partir de um imóvel cadastrado ou totalmente avulso).
--
-- Guarda um snapshot completo dos dados no momento da geração — um contrato
-- é um documento legal e não deve mudar retroativamente se o imóvel for
-- editado ou excluído depois (por isso imovel_id é "on delete set null" em
-- vez de cascade, e todos os dados relevantes ficam em colunas próprias).

create table public.contratos (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  imovel_id bigint references public.imoveis (id) on delete set null,

  tipo text not null check (tipo in ('venda', 'locacao')),

  -- Snapshot dos dados do imóvel no momento da geração.
  imovel_endereco text not null,
  imovel_bairro text not null,
  imovel_cidade text not null,
  imovel_valor numeric(12, 2) not null,

  -- Dados das partes, sempre preenchidos manualmente no formulário (o
  -- projeto não tem página de perfil com dados pessoais do usuário).
  proprietario_nome text not null,
  proprietario_cpf text not null,
  proprietario_endereco text not null,
  contraparte_nome text not null,
  contraparte_cpf text not null,
  contraparte_endereco text not null,

  data_contrato date not null default current_date,
  prazo_meses integer,
  forma_pagamento text,

  -- Caminho do PDF no bucket privado 'contratos' (formato "{user_id}/{id}.pdf").
  -- Fica nulo até o upload do PDF ser concluído com sucesso.
  pdf_path text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint contratos_prazo_obrigatorio_locacao
    check (tipo <> 'locacao' or prazo_meses is not null),
  constraint contratos_prazo_positivo
    check (prazo_meses is null or prazo_meses > 0),
  constraint contratos_imovel_valor_positivo
    check (imovel_valor > 0)
);

create index contratos_user_id_idx on public.contratos (user_id);
create index contratos_imovel_id_idx on public.contratos (imovel_id);

create trigger contratos_set_updated_at
  before update on public.contratos
  for each row execute function public.set_updated_at();

alter table public.contratos enable row level security;
alter table public.contratos force row level security;

create policy contratos_select_own on public.contratos
  for select
  to authenticated
  using (user_id = (select auth.uid()));

-- Quando imovel_id é informado, valida que o imóvel pertence ao usuário
-- logado (mesma lógica aplicada em recebimentos_insert_own).
create policy contratos_insert_own on public.contratos
  for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and (
      imovel_id is null
      or exists (
        select 1 from public.imoveis i
        where i.id = imovel_id and i.user_id = (select auth.uid())
      )
    )
  );

-- Necessária para o fluxo de geração: insert do registro -> gera o PDF ->
-- update do pdf_path. Também usada para rollback (delete) se o upload falhar.
create policy contratos_update_own on public.contratos
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy contratos_delete_own on public.contratos
  for delete
  to authenticated
  using (user_id = (select auth.uid()));
