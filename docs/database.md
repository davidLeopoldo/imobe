# Banco de Dados — Imobe

Documentação de referência do schema Postgres (Supabase). Gerada a partir dos
arquivos reais em `supabase/`. Atualizar este documento sempre que uma nova
migration for criada.

## Índice

- [Visão geral e relacionamentos](#visão-geral-e-relacionamentos)
- [Funções utilitárias](#funções-utilitárias)
- [Tabela `imoveis`](#tabela-imoveis)
- [Tabela `recebimentos`](#tabela-recebimentos)
- [Tabela `contratos`](#tabela-contratos)
- [Storage — bucket `contratos`](#storage--bucket-contratos)
- [Padrões de segurança usados em todo o schema](#padrões-de-segurança-usados-em-todo-o-schema)

---

## Visão geral e relacionamentos

```
auth.users (gerenciada pelo Supabase Auth)
    │
    ├─── imoveis (user_id)
    │       │
    │       ├─── recebimentos (imovel_id, cascade)
    │       │
    │       └─── contratos (imovel_id, SET NULL — opcional)
    │
    ├─── recebimentos (user_id, cascade)
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
*Arquivo: `0000_common.sql`*

Trigger function reutilizada por todas as tabelas — atualiza `updated_at`
automaticamente sempre que uma linha é modificada, sem precisar repetir essa
lógica em cada `UPDATE` feito pela aplicação.

---

## Tabela `imoveis`
*Arquivo: `0001_create_imoveis.sql` (+ `0005_...` para constraints de status)*

Cadastro de imóveis do usuário. Base de todo o sistema — recebimentos e
contratos dependem dela.

| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `bigint` (identity) | PK | Gerado automaticamente |
| `user_id` | `uuid` | ✅ | Dono do imóvel — FK para `auth.users`, `on delete cascade` |
| `para_venda` | `boolean` | default `false` | Regra de negócio 3 |
| `para_aluguel` | `boolean` | default `false` | Regra de negócio 3 |
| `valor_venda` | `numeric(12,2)` | condicional | Obrigatório se `para_venda = true` |
| `valor_aluguel` | `numeric(12,2)` | condicional | Obrigatório se `para_aluguel = true` |
| `valor_iptu` | `numeric(12,2)` | opcional | |
| `valor_estimado` | `numeric(12,2)` | opcional | Usado no Dashboard de patrimônio |
| `localizacao` | `text` | opcional | Referência livre (ex: "próximo ao metrô") |
| `endereco` | `text` | ✅ | |
| `bairro` | `text` | ✅ | |
| `cidade` | `text` | ✅ | |
| `link_anuncio` | `text` | opcional | |
| `status` | `text` | default `'disponivel'` | Um de: `disponivel`, `indisponivel`, `alugado`, `vendido` |
| `created_at` / `updated_at` | `timestamptz` | auto | |

### Constraints (regras aplicadas pelo próprio banco)

| Constraint | O que garante |
|---|---|
| `imoveis_tipo_operacao_check` | Pelo menos um entre `para_venda`/`para_aluguel` deve ser `true` |
| `imoveis_valor_venda_obrigatorio` | Se `para_venda`, `valor_venda` não pode ser nulo |
| `imoveis_valor_aluguel_obrigatorio` | Se `para_aluguel`, `valor_aluguel` não pode ser nulo |
| `imoveis_valor_*_positivo` | Valores monetários sempre > 0 quando informados |
| `imoveis_status_alugado_requer_para_aluguel` *(0005)* | Só pode ter `status = 'alugado'` se `para_aluguel = true` |
| `imoveis_status_vendido_requer_para_venda` *(0005)* | Só pode ter `status = 'vendido'` se `para_venda = true` |

**Índice:** `imoveis_user_id_idx` — acelera a listagem "meus imóveis" (a query mais frequente do sistema).

---

## Tabela `recebimentos`
*Arquivo: `0002_create_recebimentos.sql`*

Registro de recebimento de aluguel por mês/imóvel (Fluxo 3 e Regra de negócio 10 do PRD).

| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `bigint` (identity) | PK | |
| `imovel_id` | `bigint` | ✅ | FK → `imoveis`, `on delete cascade` |
| `user_id` | `uuid` | ✅ | FK → `auth.users`, `on delete cascade` |
| `valor` | `numeric(12,2)` | ✅ | Deve ser > 0 |
| `mes_referencia` | `date` | ✅ | **Sempre normalizado pro dia 1** (ex: `2026-03-01` = aluguel de março/26) |
| `data_recebimento` | `date` | default hoje | Data real em que o pagamento ocorreu |
| `observacao` | `text` | opcional | |
| `created_at` / `updated_at` | `timestamptz` | auto | |

### Constraints

| Constraint | O que garante |
|---|---|
| `recebimentos_valor_positivo` | `valor > 0` |
| `recebimentos_mes_referencia_dia1` | Força o dia 1, facilitando filtros de período com `gte`/`lte` |
| `recebimentos_imovel_mes_unico` | **Um único recebimento por imóvel/mês** — não deixa lançar o mesmo mês duas vezes |

**Índices:** `recebimentos_user_id_idx`; `recebimentos_imovel_id_idx` (composto, já ordenado por mês decrescente — otimizado pra timeline).

---

## Tabela `contratos`
*Arquivo: `0003_create_contratos.sql`*

Contratos de venda/locação gerados em PDF, vinculados ou não a um imóvel (Regras de negócio 6, 7, 8).

| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `bigint` (identity) | PK | |
| `user_id` | `uuid` | ✅ | FK → `auth.users`, `on delete cascade` |
| `imovel_id` | `bigint` | opcional | FK → `imoveis`, **`on delete set null`** |
| `tipo` | `text` | ✅ | `'venda'` ou `'locacao'` |
| `imovel_endereco/bairro/cidade/valor` | text/numeric | ✅ | **Snapshot** — não muda se o imóvel for editado depois |
| `proprietario_nome/cpf/endereco` | `text` | ✅ | Preenchido manualmente no formulário |
| `contraparte_nome/cpf/endereco` | `text` | ✅ | Idem (comprador ou locatário) |
| `data_contrato` | `date` | default hoje | |
| `prazo_meses` | `integer` | condicional | Obrigatório se `tipo = 'locacao'` |
| `forma_pagamento` | `text` | opcional | |
| `pdf_path` | `text` | nulo até o PDF ser gerado | Caminho no bucket, formato `{user_id}/{id}.pdf` |
| `created_at` / `updated_at` | `timestamptz` | auto | |

### Constraints

| Constraint | O que garante |
|---|---|
| `contratos_prazo_obrigatorio_locacao` | Se `tipo = 'locacao'`, `prazo_meses` é obrigatório |
| `contratos_prazo_positivo` | `prazo_meses > 0` quando informado |
| `contratos_imovel_valor_positivo` | Snapshot de valor sempre > 0 |

**Índices:** `contratos_user_id_idx`, `contratos_imovel_id_idx`.

---

## Storage — bucket `contratos`
*Arquivo: `0004_storage_contratos.sql`*

- Bucket **privado** (`public = false`) — nenhum PDF é acessível por URL direta
- Caminho de cada arquivo: `{user_id}/{contrato_id}.pdf`
- Acesso sempre via **signed URL temporária** (60s), gerada sob demanda pela aplicação — nunca link fixo
- Políticas de RLS em `storage.objects` restringem select/insert/delete ao dono, comparando o primeiro segmento do caminho (`storage.foldername(name)[1]`) com `auth.uid()`

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
1. Uma nova seção de tabela (mesmo formato acima)
2. Atualizar o diagrama de relacionamentos, se houver nova FK
3. Registrar a mudança no `CHANGELOG` do PRD, se a migration implementar uma regra de negócio nova ou alterada
