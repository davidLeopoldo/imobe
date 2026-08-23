-- Adiciona o campo "nome" ao perfil do usuário (editável, opcional — não
-- existe nenhum campo de nome no cadastro/login, então este é o único
-- lugar do sistema onde o usuário pode informar seu nome).

alter table public.profiles
  add column if not exists nome text;
