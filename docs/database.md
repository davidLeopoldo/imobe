# Banco de Dados — Immobiliare

Documentação de referência do schema Postgres (Supabase). Gerada a partir dos
arquivos reais em `supabase/`. Atualizar este documento sempre que uma nova
migration for criada.

## Migrations aplicadas

Lista de todo arquivo em `supabase/`, na ordem em que deve ser rodado no SQL
Editor do Supabase. Migrations que alteram uma tabela já existente (em vez de
criar uma nova) ficam documentadas dentro da seção da tabela correspondente,
não têm uma seção própria — a coluna "Documentada em" indica onde achar.

| #    | Arquivo                                        | O que faz                                                                                                                                                         | Documentada em                                                   |
| ---- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 0000 | `0000_common.sql`                              | Função utilitária `set_updated_at()`, reaproveitada por todas as tabelas                                                                                          | [Funções utilitárias](#funções-utilitárias)                      |
| 0001 | `0001_create_imoveis.sql`                      | Cria a tabela `imoveis` + RLS                                                                                                                                     | [Tabela `imoveis`](#tabela-imoveis)                              |
| 0002 | `0002_create_recebimentos.sql`                 | Cria a tabela `recebimentos` + RLS                                                                                                                                | [Tabela `recebimentos`](#tabela-recebimentos)                    |
| 0003 | `0003_create_contratos.sql`                    | Cria a tabela `contratos` + RLS                                                                                                                                   | [Tabela `contratos`](#tabela-contratos)                          |
| 0004 | `0004_storage_contratos.sql`                   | Bucket privado `contratos` + policies de storage                                                                                                                  | [Storage — bucket `contratos`](#storage--bucket-contratos)       |
| 0005 | `0005_imoveis_status_consistente_com_tipo.sql` | Adiciona 2 constraints em `imoveis` (status `alugado`/`vendido` exige `para_aluguel`/`para_venda`)                                                                | [Tabela `imoveis`](#tabela-imoveis) (seção Constraints)          |
| 0006 | `0006_create_profiles.sql`                     | Cria a tabela `profiles` (telefone, Instagram, TikTok) + RLS                                                                                                      | [Tabela `profiles`](#tabela-profiles)                            |
| 0007 | `0007_create_imovel_fotos.sql`                 | Cria a tabela `imovel_fotos` + RLS + trigger de limite de 10 fotos                                                                                                | [Tabela `imovel_fotos`](#tabela-imovel_fotos)                    |
| 0008 | `0008_storage_imovel_fotos.sql`                | Bucket privado `imovel-fotos` + policies de storage                                                                                                               | [Storage — bucket `imovel-fotos`](#storage--bucket-imovel-fotos) |
| 0009 | `0009_profiles_add_nome.sql`                   | **Altera** `profiles`: adiciona a coluna `nome` (não existe campo de nome em nenhum outro lugar do sistema)                                                       | [Tabela `profiles`](#tabela-profiles)                            |
| 0010 | `0010_imovel_fotos_update_policy.sql`          | **Altera** `imovel_fotos`: adiciona a policy de RLS de `update` que faltava (necessária pra reordenar a coluna `ordem` das fotos restantes quando uma é removida) | [Tabela `imovel_fotos`](#tabela-imovel_fotos) (seção RLS)        |

## Índice

- [Migrations aplicadas](#migrations-aplicadas)
- [Visão geral e relacionamentos](#visão-geral-e-relacionamentos)
- [Funções utilitárias](#funções-utilitárias)
- [Tabela `imoveis`](#tabela-imoveis)
- [Tabela `recebimentos`](#tabela-recebimentos)
- [Tabela `contratos`](#tabela-contratos)
- [Storage — bucket `contratos`](#storage--bucket-contratos)
- [Tabela `profiles`](#tabela-profiles)
- [Tabela `imovel_fotos`](#tabela-imovel_fotos)
- [Storage — bucket `imovel-fotos`](#storage--bucket-imovel-fotos)
- [Padrões de segurança usados em todo o schema](#padrões-de-segurança-usados-em-todo-o-schema)

---

## Visão geral e relacionamentos

```
auth.users (gerenciada pelo Supabase Auth)
    │
    ├─── profiles (user_id, cascade, 1:1)
    │
    ├─── imoveis (user_id)
    │       │
    │       ├─── recebimentos (imovel_id, cascade)
    │       │
    │       ├─── imovel_fotos (imovel_id, cascade)
    │       │       │
    │       │       └─── storage.objects (bucket "imovel-fotos", path {user_id}/{imovel_id}/{uuid}.{ext})
    │       │
    │       └─── contratos (imovel_id, SET NULL — opcional)
    │
    ├─── recebimentos (user_id, cascade)
    │
    ├─── imovel_fotos (user_id, cascade)
    │
    └─── contratos (user_id, cascade)
              │
              └─── storage.objects (bucket "contratos", path {user_id}/{id}.pdf)
```

**Ponto de design importante:** `contratos.imovel_id` usa `on delete set null`
(não `cascade`). Se um imóvel for excluído, os contratos gerados a partir
dele **permanecem** — porque um contrato é um documento legal que não deve
desaparecer ou perder validade por causa de uma ação posterior no cadastro do
imóvel. Por isso a tabela `contratos` guarda um **snapshot** dos dados do
imóvel (endereço, bairro, cidade, valor) em vez de só referenciar `imovel_id`
e buscar os dados "ao vivo".

---

## Funções utilitárias

### `public.set_updated_at()`

_Arquivo: `0000_common.sql`_

Trigger function reutilizada por todas as tabelas — atualiza `updated_at`
automaticamente sempre que uma linha é modificada, sem precisar repetir essa
lógica em cada `UPDATE` feito pela aplicação.

---

## Tabela `imoveis`

_Arquivo: `0001_create_imoveis.sql` (+ `0005_...` para constraints de status)_

Cadastro de imóveis do usuário. Base de todo o sistema — recebimentos e
contratos dependem dela.

| Coluna                      | Tipo                | Obrigatório            | Descrição                                                  |
| --------------------------- | ------------------- | ---------------------- | ---------------------------------------------------------- |
| `id`                        | `bigint` (identity) | PK                     | Gerado automaticamente                                     |
| `user_id`                   | `uuid`              | ✅                     | Dono do imóvel — FK para `auth.users`, `on delete cascade` |
| `para_venda`                | `boolean`           | default `false`        | Regra de negócio 3                                         |
| `para_aluguel`              | `boolean`           | default `false`        | Regra de negócio 3                                         |
| `valor_venda`               | `numeric(12,2)`     | condicional            | Obrigatório se `para_venda = true`                         |
| `valor_aluguel`             | `numeric(12,2)`     | condicional            | Obrigatório se `para_aluguel = true`                       |
| `valor_iptu`                | `numeric(12,2)`     | opcional               |                                                            |
| `valor_estimado`            | `numeric(12,2)`     | opcional               | Usado no Dashboard de patrimônio                           |
| `localizacao`               | `text`              | opcional               | Referência livre (ex: "próximo ao metrô")                  |
| `endereco`                  | `text`              | ✅                     |                                                            |
| `bairro`                    | `text`              | ✅                     |                                                            |
| `cidade`                    | `text`              | ✅                     |                                                            |
| `link_anuncio`              | `text`              | opcional               |                                                            |
| `status`                    | `text`              | default `'disponivel'` | Um de: `disponivel`, `indisponivel`, `alugado`, `vendido`  |
| `created_at` / `updated_at` | `timestamptz`       | auto                   |                                                            |

### Constraints (regras aplicadas pelo próprio banco)

| Constraint                                            | O que garante                                                   |
| ----------------------------------------------------- | --------------------------------------------------------------- |
| `imoveis_tipo_operacao_check`                         | Pelo menos um entre `para_venda`/`para_aluguel` deve ser `true` |
| `imoveis_valor_venda_obrigatorio`                     | Se `para_venda`, `valor_venda` não pode ser nulo                |
| `imoveis_valor_aluguel_obrigatorio`                   | Se `para_aluguel`, `valor_aluguel` não pode ser nulo            |
| `imoveis_valor_*_positivo`                            | Valores monetários sempre > 0 quando informados                 |
| `imoveis_status_alugado_requer_para_aluguel` _(0005)_ | Só pode ter `status = 'alugado'` se `para_aluguel = true`       |
| `imoveis_status_vendido_requer_para_venda` _(0005)_   | Só pode ter `status = 'vendido'` se `para_venda = true`         |

**Índice:** `imoveis_user_id_idx` — acelera a listagem "meus imóveis" (a query mais frequente do sistema).

---

## Tabela `recebimentos`

_Arquivo: `0002_create_recebimentos.sql`_

Registro de recebimento de aluguel por mês/imóvel (Fluxo 3 e Regra de negócio 10 do PRD).

| Coluna                      | Tipo                | Obrigatório  | Descrição                                                                 |
| --------------------------- | ------------------- | ------------ | ------------------------------------------------------------------------- |
| `id`                        | `bigint` (identity) | PK           |                                                                           |
| `imovel_id`                 | `bigint`            | ✅           | FK → `imoveis`, `on delete cascade`                                       |
| `user_id`                   | `uuid`              | ✅           | FK → `auth.users`, `on delete cascade`                                    |
| `valor`                     | `numeric(12,2)`     | ✅           | Deve ser > 0                                                              |
| `mes_referencia`            | `date`              | ✅           | **Sempre normalizado pro dia 1** (ex: `2026-03-01` = aluguel de março/26) |
| `data_recebimento`          | `date`              | default hoje | Data real em que o pagamento ocorreu                                      |
| `observacao`                | `text`              | opcional     |                                                                           |
| `created_at` / `updated_at` | `timestamptz`       | auto         |                                                                           |

### Constraints

| Constraint                         | O que garante                                                                     |
| ---------------------------------- | --------------------------------------------------------------------------------- |
| `recebimentos_valor_positivo`      | `valor > 0`                                                                       |
| `recebimentos_mes_referencia_dia1` | Força o dia 1, facilitando filtros de período com `gte`/`lte`                     |
| `recebimentos_imovel_mes_unico`    | **Um único recebimento por imóvel/mês** — não deixa lançar o mesmo mês duas vezes |

**Índices:** `recebimentos_user_id_idx`; `recebimentos_imovel_id_idx` (composto, já ordenado por mês decrescente — otimizado pra timeline).

---

## Tabela `contratos`

_Arquivo: `0003_create_contratos.sql`_

Contratos de venda/locação gerados em PDF, vinculados ou não a um imóvel (Regras de negócio 6, 7, 8).

| Coluna                                | Tipo                | Obrigatório               | Descrição                                              |
| ------------------------------------- | ------------------- | ------------------------- | ------------------------------------------------------ |
| `id`                                  | `bigint` (identity) | PK                        |                                                        |
| `user_id`                             | `uuid`              | ✅                        | FK → `auth.users`, `on delete cascade`                 |
| `imovel_id`                           | `bigint`            | opcional                  | FK → `imoveis`, **`on delete set null`**               |
| `tipo`                                | `text`              | ✅                        | `'venda'` ou `'locacao'`                               |
| `imovel_endereco/bairro/cidade/valor` | text/numeric        | ✅                        | **Snapshot** — não muda se o imóvel for editado depois |
| `proprietario_nome/cpf/endereco`      | `text`              | ✅                        | Preenchido manualmente no formulário                   |
| `contraparte_nome/cpf/endereco`       | `text`              | ✅                        | Idem (comprador ou locatário)                          |
| `data_contrato`                       | `date`              | default hoje              |                                                        |
| `prazo_meses`                         | `integer`           | condicional               | Obrigatório se `tipo = 'locacao'`                      |
| `forma_pagamento`                     | `text`              | opcional                  |                                                        |
| `pdf_path`                            | `text`              | nulo até o PDF ser gerado | Caminho no bucket, formato `{user_id}/{id}.pdf`        |
| `created_at` / `updated_at`           | `timestamptz`       | auto                      |                                                        |

### Constraints

| Constraint                            | O que garante                                      |
| ------------------------------------- | -------------------------------------------------- |
| `contratos_prazo_obrigatorio_locacao` | Se `tipo = 'locacao'`, `prazo_meses` é obrigatório |
| `contratos_prazo_positivo`            | `prazo_meses > 0` quando informado                 |
| `contratos_imovel_valor_positivo`     | Snapshot de valor sempre > 0                       |

**Índices:** `contratos_user_id_idx`, `contratos_imovel_id_idx`.

---

## Storage — bucket `contratos`

_Arquivo: `0004_storage_contratos.sql`_

- Bucket **privado** (`public = false`) — nenhum PDF é acessível por URL direta
- Caminho de cada arquivo: `{user_id}/{contrato_id}.pdf`
- Acesso sempre via **signed URL temporária** (60s), gerada sob demanda pela aplicação — nunca link fixo
- Políticas de RLS em `storage.objects` restringem select/insert/delete ao dono, comparando o primeiro segmento do caminho (`storage.foldername(name)[1]`) com `auth.uid()`

---

## Tabela `profiles`

_Arquivo: `0006_create_profiles.sql` (+ `0009_...` para a coluna `nome`)_

Perfil do usuário logado (feature "Pagamento rápido, Perfil e Fotos do
imóvel"): nome, telefone/WhatsApp e redes sociais. 1:1 com `auth.users`.

| Coluna                      | Tipo          | Obrigatório | Descrição                                                                                                          |
| --------------------------- | ------------- | ----------- | ------------------------------------------------------------------------------------------------------------------ |
| `user_id`                   | `uuid`        | PK          | FK → `auth.users`, `on delete cascade`                                                                             |
| `nome` _(0009)_             | `text`        | opcional    | Não existe campo de nome no cadastro/login — este é o único lugar do sistema onde o usuário informa o próprio nome |
| `telefone`                  | `text`        | opcional    | Telefone/WhatsApp — um único campo                                                                                 |
| `instagram`                 | `text`        | opcional    |                                                                                                                    |
| `tiktok`                    | `text`        | opcional    |                                                                                                                    |
| `created_at` / `updated_at` | `timestamptz` | auto        |                                                                                                                    |

Sem policy de `delete` — a linha só some via `on delete cascade` quando o
usuário é removido do Supabase Auth. Todos os campos são opcionais (nenhum
bloqueia o uso do produto).

---

## Tabela `imovel_fotos`

_Arquivo: `0007_create_imovel_fotos.sql` (+ `0010_...` para a policy de
`update`)_

Fotos anexadas a um imóvel (cadastro e edição). Cada linha aponta para um
objeto no bucket `imovel-fotos`.

| Coluna         | Tipo                | Obrigatório | Descrição                                                  |
| -------------- | ------------------- | ----------- | ---------------------------------------------------------- |
| `id`           | `bigint` (identity) | PK          |                                                            |
| `imovel_id`    | `bigint`            | ✅          | FK → `imoveis`, `on delete cascade`                        |
| `user_id`      | `uuid`              | ✅          | FK → `auth.users`, `on delete cascade`                     |
| `storage_path` | `text`              | ✅          | Caminho no bucket: `{user_id}/{imovel_id}/{uuid}.{ext}`    |
| `ordem`        | `integer`           | ✅          | `> 0`; a foto com `ordem = 1` é a capa exibida na listagem |
| `created_at`   | `timestamptz`       | auto        |                                                            |

### Constraints, trigger e RLS

| Regra                                     | O que garante                                                                                                                                                                                                                                                                |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `imovel_fotos_ordem_positiva`             | `ordem > 0`                                                                                                                                                                                                                                                                  |
| Trigger `imovel_fotos_limite_10`          | No máximo 10 fotos por `imovel_id` — não dá pra expressar "contar linhas relacionadas" num `check` simples, então é garantido via trigger `before insert` que consulta a contagem atual                                                                                      |
| Policy `imovel_fotos_update_own` _(0010)_ | RLS de `update` — não vinha por padrão em `0007` (só select/insert/delete); necessária pra reordenar a coluna `ordem` das fotos restantes sempre que uma foto é removida, garantindo que sempre exista uma foto com `ordem = 1` (a capa) enquanto houver pelo menos uma foto |

**Índice:** `imovel_fotos_imovel_id_idx` (`imovel_id, ordem`).

---

## Storage — bucket `imovel-fotos`

_Arquivo: `0008_storage_imovel_fotos.sql`_

- Bucket **privado** (`public = false`)
- Caminho de cada arquivo: `{user_id}/{imovel_id}/{uuid}.{ext}` (`png` ou
  `jpg`)
- Acesso sempre via **signed URL** gerada sob demanda (expiração de 1h,
  usada tanto na galeria do detalhe quanto na capa da listagem) — nunca
  link fixo
- Mesmo padrão de RLS do bucket `contratos`: policies comparam
  `(storage.foldername(name))[1]` com `auth.uid()`

---

## Padrões de segurança usados em todo o schema

Esses padrões se repetem em **todas** as tabelas — vale entender uma vez, se aplica a tudo:

### 1. RLS sempre habilitado e "forçado"

```sql
alter table public.<tabela> enable row level security;
alter table public.<tabela> force row level security;
```

`force` é importante: garante que **nem o dono da tabela** (owner do banco) escapa das políticas — só existe acesso através das regras definidas.

### 2. Quatro políticas padrão por tabela (select/insert/update/delete)

Cada uma restringe por `user_id = (select auth.uid())` — o usuário só vê/altera suas próprias linhas.

### 3. Validação de propriedade em cascata (`recebimentos` e `contratos`)

Não basta checar `user_id` da própria linha nova — a política de `insert` também confere se o `imovel_id` referenciado **pertence** ao usuário logado:

```sql
exists (select 1 from public.imoveis i where i.id = imovel_id and i.user_id = (select auth.uid()))
```

Sem isso, seria possível criar um recebimento ou contrato **apontando** pro imóvel de outra pessoa, mesmo que a linha em si "pertença" a você. Esse é o tipo de brecha sutil que passa despercebida numa revisão rápida.

### 4. `(select auth.uid())` em vez de `auth.uid()` direto

Reparar que em toda política aparece `(select auth.uid())`, e não `auth.uid()` puro — essa é uma otimização recomendada pela Supabase: o Postgres consegue cachear o resultado da subquery por execução, evitando recalcular a função a cada linha avaliada. Melhora performance em tabelas grandes.

---

## Como manter este documento atualizado

Toda vez que uma migration nova (`000N_*.sql`) for criada, adicionar aqui:

1. Uma linha na tabela [Migrations aplicadas](#migrations-aplicadas) — toda
   migration entra aqui, mesmo as que só alteram uma tabela já existente
   (nesse caso, aponte "Documentada em" pra seção da tabela alterada em vez
   de criar uma seção nova)
2. Se a migration **cria** uma tabela/bucket novo: uma seção própria (mesmo
   formato das existentes). Se ela **altera** uma tabela existente: atualize
   a seção dessa tabela (colunas, constraints, RLS) no lugar
3. Atualizar o diagrama de relacionamentos, se houver nova FK
4. Registrar a mudança no `CHANGELOG` do PRD, se a migration implementar uma regra de negócio nova ou alterada
