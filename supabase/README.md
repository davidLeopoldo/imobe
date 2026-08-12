# SQL do Supabase

Esta pasta contém todo o SQL necessário para configurar o banco de dados do projeto Imobe.

Não há CLI de migration automatizada aqui — os arquivos são numerados (`0000_`, `0001_`, ...) e
devem ser executados **manualmente, em ordem**, no **SQL Editor** do dashboard do Supabase
(https://supabase.com/dashboard/project/_/sql/new).

## Como executar

1. Abra o projeto no dashboard do Supabase.
2. Vá em **SQL Editor** → **New query**.
3. Cole o conteúdo do arquivo na ordem numérica (ex.: `0000_common.sql` antes de `0001_create_imoveis.sql`).
4. Rode e confirme que não houve erro antes de passar para o próximo arquivo.

## Arquivos

- `0000_common.sql` — funções utilitárias compartilhadas (ex.: trigger de `updated_at`).
- `0001_create_imoveis.sql` — tabela `imoveis` + Row Level Security (RLS).

## Configuração de Auth necessária

Para que o fluxo de cadastro (Fluxo 1 do PRD) redirecione direto para o dashboard sem exigir
confirmação de e-mail, desabilite a opção **"Confirm email"** em
**Authentication → Providers → Email** no dashboard do Supabase. Se preferir manter a confirmação
de e-mail ativada, o cadastro funcionará normalmente, mas o usuário será redirecionado para
`/login` com uma mensagem pedindo para confirmar o e-mail antes de entrar.
