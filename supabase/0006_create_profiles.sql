-- Perfil do usuário: telefone/WhatsApp e redes sociais (Instagram, TikTok).
-- 1:1 com auth.users. Todos os campos são opcionais (Regra de negócio 7 do
-- PRD de feature "Pagamento rápido, Perfil e Fotos do imóvel").

create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,

  telefone text,
  instagram text,
  tiktok text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.profiles force row level security;

create policy profiles_select_own on public.profiles
  for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy profiles_insert_own on public.profiles
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy profiles_update_own on public.profiles
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Sem policy de delete: a linha só desaparece via "on delete cascade"
-- quando o próprio usuário é removido do Supabase Auth.
