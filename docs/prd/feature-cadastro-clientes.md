# PRD — Cadastro de Clientes integrado ao fluxo de Contratos

> Tipo: PRD de feature · Data: 2026-08-25
> **Status:** Aguardando implementação
>
> <!-- Valores possíveis: "Aguardando implementação" | "Implementada". Atualize para "Implementada" quando todas as specs estiverem concluídas. -->

## 1. Visão geral

Hoje, ao gerar um contrato (avulso ou vinculado a um imóvel), o usuário digita do zero os dados de quem está do outro lado do negócio — nome, CPF e endereço do proprietário/vendedor e do comprador/locatário — mesmo que já tenha feito negócio com essa mesma pessoa antes. Esta feature adiciona um **cadastro de clientes** reutilizável: o usuário pode cadastrar uma pessoa uma vez e, dali em diante, buscá-la e reaproveitá-la em qualquer contrato futuro, além de conseguir ver o histórico de negócios feitos com ela.

## 2. Problema que resolve

- Dados de contraparte/proprietário são retrabalho: a mesma pessoa é redigitada em todo novo contrato.
- Não existe hoje nenhuma forma de ver, num único lugar, todos os contratos já fechados com uma pessoa específica.
- Pequenas variações de digitação (nome, endereço) entre contratos diferentes da mesma pessoa não têm como ser identificadas ou evitadas.

## 3. Público-alvo

O mesmo usuário do restante do Imobe: proprietário/corretor pessoa física, operando sozinho (mono-tenant, sem equipe), que já usa o sistema para cadastrar imóveis e gerar contratos.

## 4. Objetivo do recorte atual

Entregar um módulo de cadastro de clientes (CRUD completo) e integrá-lo ao formulário de contrato já existente, permitindo selecionar um cliente cadastrado ou criar um novo a partir do próprio fluxo de contrato — sem alterar o comportamento de quem não quiser usar cadastro nenhum.

## 5. Funcionalidades

**Essenciais:**

- Cadastrar, listar, editar e excluir clientes (módulo `/clientes`, no padrão de Imóveis).
- Cliente com nome, CPF e endereço (obrigatórios) e telefone e e-mail (opcionais).
- CPF único por usuário — impede clientes duplicados pela mesma pessoa.
- No formulário de contrato (avulso e vinculado a imóvel), buscar e selecionar um cliente já cadastrado (por nome ou CPF) para preencher automaticamente os dados de uma das partes.
- Dados pré-preenchidos a partir de um cliente selecionado continuam editáveis para aquele contrato específico, sem alterar o cadastro do cliente.
- Ao digitar os dados de uma parte do zero (sem selecionar cliente existente), oferecer salvar automaticamente como novo cliente (checkbox marcado por padrão).
- Se o CPF digitado já pertencer a um cliente cadastrado, reaproveitar o cadastro existente em vez de criar um duplicado.
- Página de detalhe do cliente mostrando os contratos em que ele aparece (como proprietário/vendedor ou como contraparte).
- Exclusão de cliente sem afetar os dados de contratos já gerados (apenas remove o vínculo).

**Desejáveis:**

- Nenhuma nesta entrega — o recorte foi mantido enxuto de propósito (ver Fora do escopo).

## 6. Fora do escopo

- Cliente pessoa jurídica (CNPJ) — cadastro cobre apenas pessoa física.
- Mais de um cliente por lado no mesmo contrato (co-propriedade, compra/locação conjunta). **Limitação conhecida e aceita nesta versão por razão de faseamento** (evitar modelagem N:N e UI de múltiplas partes antes de validar o modelo base) — não por a necessidade ser improvável no público-alvo. Deve ser revisitada quando houver demanda real.
- Busca, filtros ou paginação avançada na listagem de clientes.
- Backfill automático: contratos já existentes no sistema não serão retroativamente associados a clientes criados por esta feature.
- Qualquer noção de equipe ou múltiplos usuários compartilhando o mesmo cadastro de clientes (o projeto continua mono-tenant).

## 7. Regras de negócio

- Regra 1: Cada cliente pertence a um único usuário (isolamento por conta, mesmo padrão de RLS já usado nas demais tabelas do projeto).
- Regra 2: Cliente é sempre pessoa física. Nome, CPF e endereço são obrigatórios; telefone e e-mail são opcionais.
- Regra 3: CPF é único por usuário — o sistema não permite dois clientes com o mesmo CPF na mesma conta.
- Regra 4: Um contrato referencia no máximo 1 cliente por lado (um como proprietário/vendedor, um como contraparte/comprador-locatário). Não há suporte a múltiplos clientes no mesmo lado nesta versão.
- Regra 5: Os dados de nome/CPF/endereço de um contrato são sempre uma cópia (snapshot) tirada no momento em que o contrato é salvo — independente de terem vindo de um cliente selecionado ou digitados do zero. Editar o cadastro de um cliente depois não altera contratos já gerados; editar os campos dentro de um contrato específico não altera o cadastro do cliente.
- Regra 6: Se um cliente referenciado por algum contrato for excluído, o contrato mantém seus dados (snapshot) intactos e apenas perde a referência ao cadastro — nenhuma exclusão de cliente é bloqueada por causa de contratos vinculados.
- Regra 7: Contratos gerados antes desta feature não são migrados retroativamente — permanecem sem vínculo a nenhum cliente.
- Regra 8: Ao preencher os dados de uma parte no formulário de contrato sem selecionar um cliente existente, o sistema oferece salvar esses dados como novo cliente (checkbox marcado por padrão, mas desmarcável).
- Regra 9: Se o CPF informado ao criar um cliente novo (seja via `/clientes/novo`, seja via fallback do contrato) já pertencer a um cliente existente do mesmo usuário, o sistema não cria um duplicado — reaproveita/vincula ao cadastro existente e informa isso ao usuário.
- Regra 10: A busca de cliente no formulário de contrato aceita tanto parte do nome quanto o CPF (com ou sem formatação).

## 8. Fluxos principais

### Fluxo 1 — Cadastrar cliente diretamente

1. Usuário acessa `/clientes` e clica em "Cadastrar cliente".
2. Preenche nome, CPF e endereço (obrigatórios); telefone e e-mail (opcionais).
3. Sistema valida formato do CPF e unicidade; se o CPF já pertence a outro cliente, mostra erro apontando o cadastro existente.
4. Ao salvar com sucesso, o cliente passa a aparecer na listagem e pode ser buscado em contratos futuros.

### Fluxo 2 — Selecionar cliente existente ao gerar contrato

1. Usuário preenche o formulário de contrato (avulso ou vinculado a imóvel) e chega na seção de uma das partes (proprietário/vendedor ou contraparte).
2. Busca por nome ou CPF no campo de autocomplete de cliente.
3. Seleciona um cliente da lista de resultados; nome, CPF e endereço são pré-preenchidos automaticamente.
4. Pode ajustar livremente esses campos só para este contrato, sem alterar o cadastro do cliente.
5. Ao salvar o contrato, o vínculo ao cliente selecionado é registrado.

### Fluxo 3 — Criar cliente a partir do contrato (fallback)

1. Usuário não encontra a pessoa no autocomplete (ou prefere não buscar) e digita nome/CPF/endereço/telefone/e-mail manualmente na seção da parte.
2. O checkbox "Salvar como novo cliente" aparece marcado por padrão.
3. Ao submeter o contrato, se o checkbox estiver marcado e o CPF não pertencer a nenhum cliente existente, o sistema cria um novo cliente com os dados informados.
4. Se o CPF já pertencer a um cliente existente, o sistema vincula o contrato a esse cliente em vez de criar um duplicado, e informa isso ao usuário.
5. Se o usuário desmarcar o checkbox, o contrato é gerado normalmente sem criar nem vincular nenhum cliente — comportamento idêntico ao atual.

### Fluxo 4 — Ver histórico de negócios de um cliente

1. Usuário acessa `/clientes` e clica em um cliente da lista.
2. Vê os dados cadastrais (editáveis) e, abaixo, a lista de contratos em que esse cliente aparece — como proprietário/vendedor ou como contraparte — cada um com link para o contrato completo.

### Fluxo 5 — Excluir cliente

1. Usuário acessa o detalhe do cliente e escolhe excluir.
2. Sistema pede confirmação da ação.
3. Cliente é removido; contratos que o referenciavam passam a não ter mais vínculo com nenhum cliente, mas seus dados (nome/CPF/endereço já salvos no contrato) permanecem intactos.

## 9. Critérios de aceite

- O usuário consegue cadastrar um cliente informando nome, CPF e endereço.
- O sistema impede cadastrar dois clientes com o mesmo CPF para o mesmo usuário, em qualquer ponto de entrada (tela de clientes ou formulário de contrato).
- O usuário consegue editar e excluir um cliente existente.
- Excluir um cliente não apaga nem altera nenhum dado de contratos já gerados; apenas remove o vínculo (`cliente` referenciado passa a nulo).
- O usuário consegue ver, no detalhe do cliente, a lista de todos os contratos em que ele aparece, como proprietário/vendedor ou contraparte.
- O usuário consegue buscar (por nome ou CPF) e selecionar um cliente existente ao preencher qualquer uma das partes de um contrato, tanto no fluxo avulso quanto no vinculado a imóvel.
- Quando o usuário digita os dados de uma parte do zero, mantém o checkbox "Salvar como novo cliente" marcado e o CPF não existe ainda, o sistema cria um novo cliente ao salvar o contrato.
- Quando o CPF digitado já pertence a um cliente existente, o sistema vincula o contrato a esse cliente em vez de criar um duplicado.
- O usuário consegue editar os dados pré-preenchidos de um cliente selecionado dentro do formulário do contrato, sem que isso altere o cadastro do cliente.
- O sistema não permite associar mais de um cliente ao mesmo lado (proprietário ou contraparte) de um único contrato.
- Desmarcar o checkbox "Salvar como novo cliente" gera o contrato normalmente, sem criar nem vincular nenhum cliente.

## 10. Stack

Reaproveita integralmente a stack já em uso no projeto — nenhuma dependência nova é necessária:

- **Next.js (App Router)** + TypeScript + React — rotas e componentes.
- **Supabase** (Postgres + Auth) — sem ORM; acesso via SQL versionado em migrations (`supabase/000N_*.sql`) e RLS forçada por `user_id`, seguindo a mesma convenção de `imoveis`, `contratos`, `recebimentos` e `profiles`.
- **Zod** — validação de schema (novo `clienteSchema`, e extensão do `contratoSchema` já existente).
- **react-hook-form** — formulários, incluindo o autocomplete de cliente dentro do `ContratoForm` já existente.
- Padrão de camadas do projeto: `validations/` → `services/` → `_data-access/` (por rota) → `_actions/` (Server Actions) → componente client de formulário.

## 11. Justificativa da stack

Não há necessidade de nenhuma peça nova: a feature é um CRUD adicional (mesmo padrão de Imóveis) mais uma extensão pontual do formulário e do schema de Contrato que já existem. Reaproveitar a stack e as convenções do projeto mantém a feature consistente com o restante do sistema e evita introduzir uma segunda forma de fazer a mesma coisa.

## 12. Fases de construção

### Fase 1 — Cadastro de clientes (módulo base)

Objetivo: entregar o CRUD completo de clientes como módulo independente, sem tocar ainda no fluxo de contrato.
Specs:

- Spec 01 — Cadastrar cliente
- Spec 02 — Listar clientes
- Spec 03 — Editar cliente e ver histórico de contratos
- Spec 04 — Excluir cliente

### Fase 2 — Integração do cadastro de clientes com o fluxo de contrato

Objetivo: permitir reaproveitar e criar clientes diretamente de dentro do formulário de contrato já existente (avulso e vinculado a imóvel).
Specs:

- Spec 05 — Selecionar cliente existente no formulário de contrato
- Spec 06 — Criar cliente a partir do formulário de contrato (fallback)

## 13. Specs funcionais detalhadas

> Cada spec deve ser autossuficiente: um agente de codificação vai ler SÓ esta spec (mais as dependências) para montar o plano técnico e implementar. Preencha todos os campos; se um não se aplica, escreva "Não se aplica" e o porquê.

### Spec 01 — Cadastrar cliente

- **Fase:** Fase 1 — Cadastro de clientes (módulo base)
- **Objetivo (o quê):** Permitir que o usuário cadastre uma nova pessoa (cliente) no sistema, com os dados mínimos necessários para reaproveitá-la em contratos futuros.
- **Intenção (por quê):** É a base de tudo — sem essa entidade não há o que buscar, selecionar ou reaproveitar no fluxo de contrato, nem histórico a exibir depois.
- **Contexto:** O projeto já tem um padrão idêntico de "cadastrar entidade" na feature de Imóveis (`/imoveis/novo`), incluindo validação Zod, Server Action e formulário com `react-hook-form`. Esta spec reproduz esse mesmo padrão para uma nova entidade `cliente`. Não depende de nenhuma spec anterior.
- **Atores:** Usuário autenticado (dono da conta).
- **Descrição do comportamento:** O usuário acessa uma tela de cadastro de cliente, preenche os campos, e ao submeter, o sistema valida os dados e salva um novo registro de cliente vinculado à sua conta. Se o CPF já pertencer a um cliente existente da mesma conta, o cadastro é rejeitado com uma mensagem clara apontando o cadastro já existente (não cria duplicado silenciosamente).
- **Entradas e saídas:** Entrada: nome, CPF, endereço, telefone (opcional), e-mail (opcional), digitados pelo usuário. Saída: cliente criado e persistido, associado ao usuário logado; usuário é redirecionado ou recebe confirmação de sucesso.
- **Dados/entidades envolvidos (conceitual):** Cliente: nome, CPF, endereço, telefone (opcional), e-mail (opcional), pertencente a um usuário.
- **Estados e transições:** Não se aplica — cliente não tem máquina de estados, só existe (ativo) ou é excluído (spec 04).
- **Regras de negócio:** Regra 1, Regra 2, Regra 3, Regra 9 (ver seção 7).
- **Validações:** Nome, CPF e endereço obrigatórios. CPF em formato válido (mesma validação já usada hoje no schema de contrato). CPF único por usuário — verificado antes de persistir. Telefone e e-mail, quando preenchidos, seguem formato básico esperado (telefone numérico/formatado, e-mail com formato de e-mail), mas não são obrigatórios.
- **Fluxo do usuário (passo a passo):**
  1. Usuário acessa a tela de cadastro de cliente.
  2. Preenche nome, CPF, endereço e, opcionalmente, telefone e e-mail.
  3. Submete o formulário.
  4. Sistema valida os campos e a unicidade do CPF.
  5. Se válido, cria o cliente e confirma sucesso ao usuário.
  6. Se inválido (campo faltando, CPF mal formatado, ou CPF duplicado), exibe o erro correspondente sem perder os dados já digitados.
- **Casos de borda e erros:** CPF com formatação diferente da esperada (com/sem pontuação) deve ser tratado de forma equivalente na validação e na checagem de duplicidade. CPF já cadastrado → erro específico, não genérico, indicando que já existe um cliente com esse documento. Falha de comunicação com o banco → mensagem genérica de erro, sem perder os dados preenchidos no formulário.
- **Impacto no existente:** Nenhum impacto em funcionalidades existentes — é uma tela e uma entidade novas, isoladas.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado que o usuário preencheu nome, CPF e endereço válidos, Quando ele submete o formulário, Então o cliente é criado e vinculado à sua conta.
  - Dado que já existe um cliente com o CPF informado, Quando o usuário tenta cadastrar outro cliente com o mesmo CPF, Então o sistema rejeita a criação e informa que o CPF já está cadastrado.
  - Dado que o usuário não preencheu telefone nem e-mail, Quando ele submete o formulário, Então o cliente é criado normalmente, com esses campos vazios.
- **Definição de pronto:** O usuário consegue cadastrar um cliente completo, receber erro claro em caso de CPF duplicado ou campo obrigatório faltando, e o cliente criado fica disponível para as demais specs (listagem, detalhe, seleção em contrato).
- **Dependências:** Nenhuma.
- **Fora do escopo desta spec:** Listagem, edição, exclusão de cliente (specs 02, 03, 04). Qualquer uso do cliente dentro do fluxo de contrato (specs 05, 06).

### Spec 02 — Listar clientes

- **Fase:** Fase 1 — Cadastro de clientes (módulo base)
- **Objetivo (o quê):** Mostrar ao usuário todos os clientes já cadastrados na sua conta, em uma lista simples.
- **Intenção (por quê):** É o ponto de entrada para o usuário navegar até o cadastro/edição/detalhe de um cliente específico; sem isso, o cadastro fica "invisível" fora do fluxo de contrato.
- **Contexto:** Reproduz o padrão já existente da listagem de Imóveis (`/imoveis`), que hoje é uma lista simples sem busca, filtro ou paginação — mesmo padrão aplicado aqui.
- **Atores:** Usuário autenticado (dono da conta).
- **Descrição do comportamento:** Ao acessar a tela de clientes, o usuário vê todos os clientes cadastrados na sua conta, com informação suficiente para identificar cada um (pelo menos nome e CPF), e pode navegar para o detalhe de qualquer um deles. Também há um ponto de acesso claro para cadastrar um novo cliente (spec 01).
- **Entradas e saídas:** Entrada: nenhuma (carregamento automático dos clientes do usuário logado). Saída: lista de clientes exibida na tela.
- **Dados/entidades envolvidos (conceitual):** Cliente: nome, CPF (exibidos na lista); demais campos acessíveis ao entrar no detalhe.
- **Estados e transições:** Não se aplica.
- **Regras de negócio:** Regra 1 (usuário só vê os próprios clientes).
- **Validações:** Não se aplica — tela somente de leitura/navegação.
- **Fluxo do usuário (passo a passo):**
  1. Usuário acessa a tela de clientes.
  2. Sistema carrega e exibe todos os clientes da conta.
  3. Usuário clica em um cliente para ver o detalhe (spec 03), ou clica em "Cadastrar cliente" para ir à spec 01.
- **Casos de borda e erros:** Nenhum cliente cadastrado ainda → tela exibe estado vazio, orientando o usuário a cadastrar o primeiro cliente.
- **Impacto no existente:** Nenhum.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado que o usuário tem clientes cadastrados, Quando acessa a tela de clientes, Então vê todos eles listados.
  - Dado que o usuário ainda não tem nenhum cliente cadastrado, Quando acessa a tela de clientes, Então vê uma indicação de lista vazia com opção de cadastrar o primeiro.
- **Definição de pronto:** A listagem reflete corretamente os clientes da conta logada e permite navegar para cadastro e detalhe.
- **Dependências:** Spec 01 (para existir o que listar).
- **Fora do escopo desta spec:** Busca, filtro ou paginação (fora do escopo do PRD, seção 6).

### Spec 03 — Editar cliente e ver histórico de contratos

- **Fase:** Fase 1 — Cadastro de clientes (módulo base)
- **Objetivo (o quê):** Permitir visualizar e editar os dados de um cliente específico, e ver todos os contratos em que ele já apareceu.
- **Intenção (por quê):** É o motivo central de existir um cadastro em vez de só um autocomplete solto — dá visibilidade ao relacionamento com o cliente ao longo do tempo (quantos negócios, quais contratos) e permite corrigir dados desatualizados.
- **Contexto:** Depende das specs 05/06 (Fase 2) apenas para que existam contratos vinculados a clientes a exibir — mas a tela em si pode e deve ser construída já na Fase 1 (exibindo lista vazia de contratos até a Fase 2 existir).
- **Atores:** Usuário autenticado (dono da conta).
- **Descrição do comportamento:** Ao acessar o detalhe de um cliente, o usuário vê os dados cadastrais (nome, CPF, endereço, telefone, e-mail) em um formulário editável, e abaixo uma lista dos contratos em que esse cliente aparece — como proprietário/vendedor ou como contraparte — cada um com link para abrir o contrato completo. Alterações salvas no formulário atualizam o cadastro do cliente, mas não alteram nenhum contrato já gerado (Regra 5).
- **Entradas e saídas:** Entrada: edições nos campos do cliente. Saída: cadastro do cliente atualizado; lista de contratos vinculados exibida (somente leitura, com link).
- **Dados/entidades envolvidos (conceitual):** Cliente (todos os campos, editáveis); Contrato (id, tipo, data, e papel do cliente naquele contrato — proprietário/vendedor ou contraparte — para exibição na lista, sem edição).
- **Estados e transições:** Não se aplica.
- **Regras de negócio:** Regra 1, Regra 2, Regra 3, Regra 5.
- **Validações:** Mesmas validações da spec 01 (nome/CPF/endereço obrigatórios, formato de CPF, unicidade de CPF — exceto contra o próprio registro sendo editado).
- **Fluxo do usuário (passo a passo):**
  1. Usuário clica em um cliente na listagem (spec 02).
  2. Sistema exibe os dados do cliente em formulário editável e a lista de contratos vinculados a ele.
  3. Usuário edita algum campo e salva.
  4. Sistema valida (incluindo unicidade de CPF, ignorando o próprio cliente) e persiste as alterações.
  5. Cadastro atualizado é refletido na tela; contratos já gerados permanecem inalterados.
- **Casos de borda e erros:** Usuário tenta alterar o CPF para um valor já usado por outro cliente → erro de duplicidade, mesma mensagem da spec 01. Cliente ainda sem nenhum contrato vinculado → lista de contratos aparece vazia, sem erro. Cliente inexistente ou de outro usuário → acesso negado/404 (mesmo padrão de proteção usado no detalhe de imóvel).
- **Impacto no existente:** Nenhum nos módulos existentes; consome dados de `contratos` apenas para exibição (leitura), sem alterá-los.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado um cliente cadastrado, Quando o usuário acessa seu detalhe, Então vê os dados atuais e pode editá-los.
  - Dado um cliente que aparece em contratos existentes, Quando o usuário acessa seu detalhe, Então vê a lista desses contratos com link para cada um.
  - Dado que o usuário edita e salva os dados do cliente, Quando ele acessa um contrato já gerado anteriormente com esse cliente, Então os dados do contrato permanecem exatamente como estavam antes da edição.
- **Definição de pronto:** Edição persiste corretamente com as mesmas validações do cadastro; histórico de contratos é exibido corretamente assim que a Fase 2 estiver implementada (antes disso, aparece vazio, sem erro).
- **Dependências:** Spec 01. A exibição de contratos vinculados só passa a ter dados reais após a Fase 2 (specs 05/06), mas a spec em si não depende delas para ser construída.
- **Fora do escopo desta spec:** Exclusão do cliente (spec 04). Edição de contratos a partir desta tela.

### Spec 04 — Excluir cliente

- **Fase:** Fase 1 — Cadastro de clientes (módulo base)
- **Objetivo (o quê):** Permitir remover permanentemente um cliente do cadastro.
- **Intenção (por quê):** Cadastros incorretos ou duplicados (ex.: erro de digitação que passou pela validação, pessoa cadastrada por engano) precisam poder ser removidos, sem colocar em risco a integridade de contratos já gerados.
- **Contexto:** Depende diretamente da Regra 6 (seção 7) — exclusão nunca é bloqueada por causa de contratos vinculados, mas remove a referência a esse cliente nos contratos que apontam para ele.
- **Atores:** Usuário autenticado (dono da conta).
- **Descrição do comportamento:** A partir do detalhe do cliente (spec 03), o usuário solicita a exclusão. O sistema pede confirmação explícita antes de excluir (ação irreversível). Após confirmar, o cliente é removido; qualquer contrato que o referenciava (como proprietário ou como contraparte) perde esse vínculo, mas mantém intactos os dados já salvos (nome, CPF, endereço) daquele contrato.
- **Entradas e saídas:** Entrada: confirmação do usuário. Saída: cliente removido do cadastro; contratos vinculados atualizados para não referenciar mais nenhum cliente naquele lado.
- **Dados/entidades envolvidos (conceitual):** Cliente (removido); Contrato (perde a referência ao cliente excluído, mas mantém seus próprios dados).
- **Estados e transições:** Cliente deixa de existir após a exclusão (não há estado "inativo" ou soft delete nesta versão).
- **Regras de negócio:** Regra 6.
- **Validações:** Exclusão exige confirmação explícita do usuário antes de ser efetivada.
- **Fluxo do usuário (passo a passo):**
  1. Usuário acessa o detalhe de um cliente e escolhe excluir.
  2. Sistema exibe confirmação explicando que a ação é irreversível.
  3. Usuário confirma.
  4. Sistema remove o cliente e atualiza os contratos vinculados para não referenciá-lo mais.
  5. Usuário é redirecionado para a listagem de clientes.
- **Casos de borda e erros:** Usuário tenta excluir cliente que não existe mais ou pertence a outro usuário → erro/404, mesmo padrão do restante do projeto. Usuário cancela a confirmação → nenhuma alteração é feita.
- **Impacto no existente:** Contratos que referenciam o cliente excluído (via specs 05/06) têm o vínculo removido; nenhum outro dado do contrato é alterado.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado um cliente sem nenhum contrato vinculado, Quando o usuário confirma a exclusão, Então o cliente é removido do cadastro.
  - Dado um cliente vinculado a um ou mais contratos, Quando o usuário confirma a exclusão, Então o cliente é removido, os contratos permanecem intactos em seus dados, e deixam de referenciar esse cliente.
  - Dado que o usuário abriu a confirmação de exclusão, Quando ele cancela, Então nada é alterado.
- **Definição de pronto:** Exclusão funciona sem bloqueios por vínculo com contrato, e os contratos afetados continuam consultáveis e com PDF/dados inalterados depois da exclusão.
- **Dependências:** Spec 01, Spec 03 (ponto de acesso à exclusão).
- **Fora do escopo desta spec:** Qualquer forma de restauração do cliente excluído (não há "lixeira" ou desfazer nesta versão).

### Spec 05 — Selecionar cliente existente no formulário de contrato

- **Fase:** Fase 2 — Integração do cadastro de clientes com o fluxo de contrato
- **Objetivo (o quê):** Permitir que o usuário busque e selecione um cliente já cadastrado para preencher automaticamente os dados de uma das partes (proprietário/vendedor ou contraparte) ao criar um contrato.
- **Intenção (por quê):** É o ganho principal da feature — eliminar a redigitação de dados de quem já é cliente conhecido, tanto no fluxo de contrato avulso quanto no vinculado a um imóvel.
- **Contexto:** O formulário de contrato (`ContratoForm`) já existe e é compartilhado pelos dois fluxos de criação (avulso e vinculado a imóvel); hoje tem campos de texto livre para nome/CPF/endereço de cada parte. Esta spec adiciona a capacidade de busca/seleção de cliente a essas duas seções do mesmo formulário, sem duplicar formulário para os dois fluxos.
- **Atores:** Usuário autenticado, no momento de criar um contrato.
- **Descrição do comportamento:** Em cada seção de parte do formulário de contrato (proprietário/vendedor e contraparte), o usuário tem a opção de buscar um cliente já cadastrado por nome ou CPF. Ao selecionar um resultado, os campos de nome, CPF e endereço dessa seção são preenchidos automaticamente com os dados do cliente selecionado, e o contrato passa a registrar o vínculo com esse cliente para aquele lado. O usuário ainda pode editar livremente os campos pré-preenchidos, valendo apenas para aquele contrato (Regra 5) — sem alterar o cadastro do cliente.
- **Entradas e saídas:** Entrada: termo de busca (nome ou CPF) digitado pelo usuário; seleção de um cliente da lista de resultados. Saída: campos de nome/CPF/endereço da seção preenchidos; referência ao cliente selecionado associada àquele lado do contrato ao salvar.
- **Dados/entidades envolvidos (conceitual):** Cliente (nome, CPF, endereço, usados para busca e preenchimento); Contrato (referência opcional a um cliente para o lado "proprietário/vendedor" e outra para o lado "contraparte", além dos campos de texto já existentes que continuam sendo salvos como snapshot).
- **Estados e transições:** Não se aplica.
- **Regras de negócio:** Regra 4, Regra 5, Regra 10.
- **Validações:** Busca deve funcionar tanto com trecho de nome quanto com CPF (formatado ou não). Seleção de cliente não dispensa a validação normal dos campos preenchidos (mesmas regras já aplicadas hoje ao `contratoSchema`).
- **Fluxo do usuário (passo a passo):**
  1. Usuário está preenchendo a seção de uma das partes no formulário de contrato.
  2. Digita parte do nome ou o CPF da pessoa no campo de busca.
  3. Sistema mostra clientes correspondentes (da própria conta do usuário).
  4. Usuário seleciona um cliente da lista.
  5. Campos de nome/CPF/endereço da seção são preenchidos automaticamente.
  6. Usuário pode ajustar esses campos livremente antes de salvar; segue preenchendo o restante do contrato normalmente.
  7. Ao salvar o contrato, a referência ao cliente selecionado é registrada para aquele lado, junto com os dados (possivelmente ajustados) como snapshot.
- **Casos de borda e erros:** Busca sem nenhum resultado → sistema indica que nenhum cliente foi encontrado, sem impedir que o usuário digite os dados do zero (caminho da spec 06). Usuário seleciona um cliente e depois muda completamente o CPF digitado manualmente para um valor diferente → o vínculo ao cliente originalmente selecionado deve ser tratado conforme a spec 06 (passa a valer como dado digitado do zero, sujeito à mesma lógica de checagem de CPF existente/checkbox). Usuário limpa a seleção → seção volta ao estado de campos livres, sem cliente vinculado.
- **Impacto no existente:** Altera o `ContratoForm` (ambos os fluxos, avulso e vinculado a imóvel) e o `contratoSchema`/dados persistidos de `contrato`, que passam a opcionalmente carregar a referência a um cliente por lado, além dos campos de texto já existentes (que continuam sendo a fonte do PDF gerado, sem mudança no documento final).
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado que o usuário tem ao menos um cliente cadastrado, Quando busca por parte do nome ou pelo CPF na seção de uma das partes do contrato, Então vê os clientes correspondentes da sua própria conta.
  - Dado que o usuário seleciona um cliente da busca, Quando a seleção é feita, Então os campos de nome/CPF/endereço daquela seção são preenchidos automaticamente.
  - Dado que o usuário selecionou um cliente e depois edita o endereço pré-preenchido, Quando o contrato é salvo, Então o contrato reflete o endereço editado e o cadastro do cliente permanece com o endereço original.
  - Dado que o usuário selecionou um cliente para o lado "contraparte", Quando acessa depois o detalhe desse cliente (spec 03), Então esse contrato aparece no histórico dele.
- **Definição de pronto:** Busca e seleção funcionam nos dois fluxos de contrato (avulso e vinculado a imóvel), preenchimento automático funciona, edição pontual não afeta o cadastro, e o vínculo criado aparece corretamente no histórico do cliente (spec 03).
- **Dependências:** Spec 01 (para existirem clientes a buscar), Spec 03 (para o vínculo criado aqui ser visível no histórico).
- **Fora do escopo desta spec:** Criação de cliente novo a partir do contrato (spec 06). Suporte a mais de um cliente selecionado no mesmo lado (fora de escopo do PRD).

### Spec 06 — Criar cliente a partir do formulário de contrato (fallback)

- **Fase:** Fase 2 — Integração do cadastro de clientes com o fluxo de contrato
- **Objetivo (o quê):** Permitir que, ao digitar os dados de uma parte do zero (sem usar a busca da spec 05), o usuário salve automaticamente essa pessoa como um novo cliente, sem sair do fluxo de contrato.
- **Intenção (por quê):** Garante que o cadastro de clientes cresça organicamente a partir do uso normal do sistema, sem exigir um passo manual separado em `/clientes` toda vez que aparece alguém novo — que é justamente o comportamento pedido na origem desta feature.
- **Contexto:** Complementa a spec 05 na mesma seção de parte do `ContratoForm`. Reaproveita a mesma regra de unicidade de CPF da spec 01 para decidir entre criar um cliente novo ou reaproveitar um existente.
- **Atores:** Usuário autenticado, no momento de criar um contrato.
- **Descrição do comportamento:** Quando o usuário preenche nome/CPF/endereço/telefone/e-mail de uma parte manualmente (sem ter selecionado um cliente pela busca), a seção exibe um checkbox "Salvar como novo cliente", marcado por padrão. Ao salvar o contrato: se o checkbox estiver marcado e o CPF informado não pertencer a nenhum cliente existente da conta, o sistema cria um novo cliente com os dados informados e vincula o contrato a ele. Se o CPF já pertencer a um cliente existente, o sistema vincula o contrato a esse cliente existente em vez de criar um duplicado, e informa isso ao usuário. Se o checkbox estiver desmarcado, o contrato é salvo normalmente, sem criar nem vincular nenhum cliente (comportamento idêntico ao atual, antes desta feature).
- **Entradas e saídas:** Entrada: dados da parte digitados manualmente; estado do checkbox "Salvar como novo cliente". Saída: contrato salvo; opcionalmente, um novo cliente criado e vinculado, ou um cliente existente vinculado (reaproveitado por CPF), ou nenhum vínculo criado.
- **Dados/entidades envolvidos (conceitual):** Cliente (criado a partir dos dados digitados, quando aplicável); Contrato (referência opcional ao cliente resultante, para aquele lado).
- **Estados e transições:** Não se aplica.
- **Regras de negócio:** Regra 8, Regra 9.
- **Validações:** Mesmas validações de criação de cliente da spec 01 (nome/CPF/endereço obrigatórios, formato de CPF) são aplicadas aos dados que vão gerar o novo cliente, além das validações já existentes do `contratoSchema`.
- **Fluxo do usuário (passo a passo):**
  1. Usuário digita manualmente nome/CPF/endereço (e opcionalmente telefone/e-mail) de uma das partes, sem usar a busca da spec 05.
  2. Vê o checkbox "Salvar como novo cliente" já marcado.
  3. Opcionalmente desmarca o checkbox, se não quiser cadastrar essa pessoa.
  4. Submete o contrato.
  5. Se marcado e CPF novo: sistema cria o cliente e vincula ao contrato.
  6. Se marcado e CPF já existente: sistema vincula ao cliente existente e avisa o usuário que os dados já cadastrados foram reaproveitados.
  7. Se desmarcado: contrato é salvo sem nenhum vínculo a cliente.
- **Casos de borda e erros:** CPF digitado inválido (formato incorreto) → erro de validação do próprio formulário de contrato, mesmo comportamento de hoje (bloqueia o envio). CPF já pertencente a um cliente existente, mas com nome ou endereço digitados de forma diferente do cadastro → sistema ainda assim vincula ao cliente existente (CPF é o identificador), e o contrato usa os dados digitados agora como snapshot (Regra 5) — o cadastro do cliente não é alterado automaticamente. Falha ao criar o cliente (ex.: erro de banco) → contrato não deve ficar em estado inconsistente (ou ambos são salvos, ou nenhum); mensagem de erro clara ao usuário.
- **Impacto no existente:** Mesma alteração de `ContratoForm`/`contratoSchema`/persistência de contrato já descrita na spec 05 — as duas specs operam na mesma seção da UI e no mesmo conjunto de mudanças de dados, mas cobrem comportamentos distintos (selecionar vs. criar).
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado que o usuário digitou os dados de uma parte do zero e manteve o checkbox marcado, Quando o CPF informado é novo, Então um cliente é criado com esses dados e vinculado ao contrato.
  - Dado que o usuário digitou os dados de uma parte do zero e o CPF já pertence a um cliente existente, Quando o contrato é salvo, Então o contrato é vinculado ao cliente existente, sem criar duplicado, e o usuário é avisado disso.
  - Dado que o usuário desmarcou o checkbox "Salvar como novo cliente", Quando o contrato é salvo, Então nenhum cliente é criado ou vinculado, e o contrato é gerado normalmente com os dados digitados.
  - Dado que um cliente foi criado por este fluxo, Quando o usuário acessa `/clientes`, Então esse cliente aparece na listagem.
- **Definição de pronto:** Os três caminhos (criar novo, reaproveitar existente, não salvar) funcionam corretamente nos dois fluxos de contrato (avulso e vinculado a imóvel), e o cliente resultante (quando criado) é idêntico em comportamento a um cliente cadastrado pela spec 01.
- **Dependências:** Spec 01 (regra de criação/unicidade de cliente), Spec 05 (mesma seção de UI, comportamento complementar).
- **Fora do escopo desta spec:** Edição do cliente recém-criado a partir do próprio formulário de contrato (edições posteriores acontecem via spec 03).

## 14. Ordem recomendada de implementação

1. Spec 01 — Cadastrar cliente
2. Spec 02 — Listar clientes
3. Spec 03 — Editar cliente e ver histórico de contratos
4. Spec 04 — Excluir cliente
5. Spec 05 — Selecionar cliente existente no formulário de contrato
6. Spec 06 — Criar cliente a partir do formulário de contrato (fallback)

A Fase 1 (specs 01–04) entrega o módulo de clientes como CRUD isolado e testável por si só, sem qualquer dependência do fluxo de contrato — inclusive a spec 03 já pode ser construída e validada com a lista de contratos vazia. A Fase 2 (specs 05–06) só faz sentido depois que o cadastro básico existe, e as duas specs dessa fase mexem na mesma área do formulário de contrato, então implementá-las em sequência (05 antes de 06) evita retrabalho de tocar duas vezes no mesmo componente em ordens fora de contexto.
