-- Fotos de imóvel (cadastro e edição). Cada linha aponta para um objeto no
-- bucket privado "imovel-fotos" (ver 0008_storage_imovel_fotos.sql). A
-- primeira foto (ordem = 1) é a capa exibida na listagem de imóveis
-- (Regra de negócio 10 do PRD de feature "Pagamento rápido, Perfil e Fotos
-- do imóvel").

create table public.imovel_fotos (
  id bigint generated always as identity primary key,
  imovel_id bigint not null references public.imoveis (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,

  storage_path text not null,
  ordem integer not null,

  created_at timestamptz not null default now(),

  constraint imovel_fotos_ordem_positiva check (ordem > 0)
);

create index imovel_fotos_imovel_id_idx on public.imovel_fotos (imovel_id, ordem);

alter table public.imovel_fotos enable row level security;
alter table public.imovel_fotos force row level security;

create policy imovel_fotos_select_own on public.imovel_fotos
  for select
  to authenticated
  using (user_id = (select auth.uid()));

-- Igual à policy de insert de "recebimentos": além de user_id = auth.uid()
-- na própria linha, confere que o imovel_id referenciado pertence ao
-- usuário logado.
create policy imovel_fotos_insert_own on public.imovel_fotos
  for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.imoveis i
      where i.id = imovel_id and i.user_id = (select auth.uid())
    )
  );

create policy imovel_fotos_delete_own on public.imovel_fotos
  for delete
  to authenticated
  using (user_id = (select auth.uid()));

-- Regra de negócio 9 do PRD: no máximo 10 fotos por imóvel. Como não dá
-- pra expressar "contar linhas relacionadas" num "check" simples, isso é
-- garantido por trigger (mesmo papel de proteção que a constraint única
-- de recebimentos.mes_referencia cumpre para a regra de "um por mês").
create or replace function public.checar_limite_fotos_imovel()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select count(*) from public.imovel_fotos where imovel_id = new.imovel_id) >= 10 then
    raise exception 'Limite de 10 fotos por imóvel atingido.';
  end if;
  return new;
end;
$$;

create trigger imovel_fotos_limite_10
  before insert on public.imovel_fotos
  for each row execute function public.checar_limite_fotos_imovel();
