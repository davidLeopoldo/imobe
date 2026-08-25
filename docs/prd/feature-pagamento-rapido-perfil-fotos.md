# PRD — Pagamento rápido, Perfil do usuário e Fotos do imóvel

> Tipo: PRD de feature · Data: 2026-08-23
> **Status:** Implementada
>
> <!-- Valores possíveis: "Aguardando implementação" | "Implementada". Atualize para "Implementada" quando todas as specs estiverem concluídas. -->
>
> **Nota pós-implementação:** durante os testes, a Spec 04 ganhou
> visualização ampliada com navegação entre fotos (clique numa miniatura
> abre a foto grande, com setas anterior/próxima) — isso não estava no
> desenho original da spec, que tratava isso como fora de escopo. O texto
> da Spec 04 abaixo já reflete o comportamento final implementado.

## 1. Visão geral

Esta feature reúne três melhorias no Immobiliare (que já tem sua V1 completa e em
produção): um atalho no Dashboard para registrar pagamento de aluguel sem
sair da tela; uma página de Perfil onde o usuário guarda telefone/WhatsApp e
redes sociais; e a possibilidade de anexar fotos aos imóveis cadastrados,
tanto na criação quanto depois, na edição.

As três melhorias são independentes entre si (nenhuma depende da outra para
funcionar), mas foram agrupadas neste PRD por terem sido planejadas juntas
como um mesmo lote de evolução do produto.

## 2. Problema que resolve

- **Pagamento rápido:** hoje, para registrar o recebimento de um aluguel, o
  usuário precisa sair do Dashboard, entrar no imóvel específico e abrir o
  fluxo completo de recebimento. Para o caso comum — só confirmar que o
  aluguel do mês caiu — isso é mais passo do que precisa.
- **Perfil:** o Immobiliare não tem hoje nenhum lugar para o usuário guardar
  telefone/WhatsApp ou redes sociais. Proprietários e corretores autônomos
  costumam divulgar contato junto dos imóveis (para interessados em
  aluguel/venda); sem um perfil, esse dado fica fora do sistema.
- **Fotos do imóvel:** um imóvel sem foto é bem mais difícil de reconhecer
  rapidamente numa lista, e não serve para divulgação. Hoje o cadastro é
  só texto e valores — não há nenhuma forma de anexar imagem.

## 3. Público-alvo

O mesmo público do Immobiliare: proprietários pessoa física e corretores
autônomos que já usam o sistema para cadastrar imóveis, gerar contratos e
acompanhar patrimônio. Esta feature não muda o público — reforça o uso já
existente, tornando o dia a dia (registrar aluguel, identificar imóveis,
manter contato atualizado) mais rápido e completo.

## 4. Objetivo do recorte atual

Permitir que o usuário: (1) registre o pagamento de um aluguel em poucos
cliques, direto do Dashboard, sem navegar até o imóvel; (2) mantenha um
perfil com telefone/WhatsApp e redes sociais associado à sua conta; e (3)
anexe uma ou mais fotos a cada imóvel, tanto no cadastro quanto depois, na
edição — com validação de tipo e tamanho de arquivo.

## 5. Funcionalidades

**Essenciais:**

- Botão de Quick Action no Dashboard que abre um dialog para registrar
  pagamento de aluguel (selecionar imóvel alugado, informar mês e valor).
- Página de Perfil do usuário logado, acessível pelo menu do usuário, com
  visualização de e-mail (somente leitura) e edição de nome, telefone/
  WhatsApp, Instagram e TikTok.
- Upload de uma ou mais fotos ao cadastrar um imóvel (PNG, JPG ou JPEG, até
  3MB por arquivo).
- Gerenciamento de fotos na edição de um imóvel já cadastrado (adicionar
  novas fotos, remover fotos existentes).
- Exibição das fotos: capa/miniatura na listagem de imóveis e galeria no
  detalhe do imóvel, com visualização ampliada e navegação entre as fotos
  ao clicar numa miniatura.

**Desejáveis:**

- Nenhuma nesta entrega — o recorte foi mantido enxuto (ver seção 6).

## 6. Fora do escopo

- Edição do e-mail do usuário na página de Perfil (permanece somente
  leitura nesta entrega — o nome passou a ser editável, já que não existe
  campo de nome em nenhum outro lugar do sistema).
- Foto de perfil/avatar do usuário (esta feature cobre só telefone/WhatsApp
  e redes sociais).
- Reordenar fotos do imóvel manualmente (a ordem é a ordem de upload; a
  primeira enviada vira a capa).
- Edição ou recorte de imagem (crop, redimensionamento) — o sistema apenas
  valida e armazena a foto como enviada.
- Campo de observação na Quick Action de pagamento (continua disponível
  apenas no fluxo completo já existente, no detalhe do imóvel).
- Notificação, e-mail ou WhatsApp automático avisando sobre o pagamento
  registrado.
- Qualquer alteração no fluxo completo de registro de recebimento já
  existente (data específica, observação) — ele continua existindo do jeito
  que está, em paralelo à Quick Action.
- Redes sociais além de Instagram e TikTok.
- Verificação/validação de que o número de telefone ou os perfis de
  Instagram/TikTok informados realmente existem.

## 7. Regras de negócio

1. O usuário só pode ver e editar o próprio perfil (telefone/WhatsApp,
   Instagram, TikTok) — nunca o de outro usuário.
2. O usuário só pode ver, adicionar ou remover fotos dos próprios imóveis.
3. Na Quick Action, o Select de imóvel mostra apenas imóveis do usuário com
   status **"alugado"**. Imóveis disponíveis, vendidos ou indisponíveis não
   aparecem nessa lista.
4. Um imóvel só pode ter um recebimento por mês de referência — essa regra
   já existe hoje (fluxo completo de recebimento) e vale igualmente para a
   Quick Action: se o usuário tentar registrar um mês já lançado para
   aquele imóvel, o sistema recusa e mostra o erro.
5. Na Quick Action, a data do recebimento é sempre a data em que o registro
   é feito — o usuário não escolhe uma data diferente.
6. O valor informado na Quick Action deve ser maior que zero.
7. Todos os campos do Perfil (telefone/WhatsApp, Instagram, TikTok) são
   opcionais — o usuário pode salvar o perfil vazio ou parcialmente
   preenchido.
8. Uma foto de imóvel só é aceita se for do tipo PNG, JPG ou JPEG, e se
   tiver no máximo 3MB. Qualquer arquivo fora desses critérios é recusado,
   com mensagem de erro clara, sem interromper o restante do cadastro/edição.
9. Um imóvel pode ter no máximo 10 fotos. Ao atingir o limite, o sistema
   impede novos uploads até que alguma foto existente seja removida.
10. A primeira foto enviada para um imóvel (seja no cadastro, seja na
    edição, se o imóvel ainda não tinha nenhuma) é a que aparece como
    capa/miniatura na listagem de imóveis.
11. Um imóvel pode ficar sem nenhuma foto — isso não impede seu cadastro,
    edição, nem nenhuma outra funcionalidade do sistema.
12. Remover uma foto é uma ação imediata e definitiva — o sistema não
    mantém versão anterior da foto removida.

## 8. Fluxos principais

### Fluxo 1 — Registro rápido de pagamento de aluguel

1. Usuário está no Dashboard.
2. Clica no botão de Quick Action de pagamento.
3. Um dialog se abre, com um Select listando os imóveis do usuário com
   status "alugado".
4. Usuário seleciona o imóvel.
5. Informa o mês de referência do pagamento.
6. Informa o valor recebido.
7. Confirma o registro.
8. Se tudo for válido, o sistema salva o recebimento, fecha o dialog, mostra
   uma confirmação de sucesso, e os cards do Dashboard (patrimônio,
   rendimento recente) já refletem o novo valor.
9. Se o mês já tiver sido registrado para aquele imóvel, o sistema mostra o
   erro no próprio dialog, sem fechá-lo, permitindo corrigir e tentar de
   novo.

### Fluxo 2 — Editar o Perfil

1. Usuário abre o menu do usuário (onde hoje existe o item "Minha conta").
2. Acessa a página de Perfil.
3. Vê seu e-mail (somente leitura).
4. Preenche ou edita nome, telefone/WhatsApp, Instagram e/ou TikTok.
5. Salva.
6. O sistema confirma que os dados foram salvos.

### Fluxo 3 — Cadastrar imóvel com fotos

1. Usuário acessa "Cadastrar imóvel" (fluxo já existente).
2. Preenche os dados do imóvel normalmente.
3. Na seção de fotos, seleciona uma ou mais imagens do dispositivo.
4. O sistema valida cada imagem (tipo e tamanho) antes de aceitar.
5. Imagens inválidas são recusadas com mensagem clara, sem impedir o
   restante do cadastro.
6. Usuário salva o imóvel.
7. O imóvel é criado já com as fotos válidas anexadas, e a primeira delas
   vira a capa exibida na listagem.

### Fluxo 4 — Gerenciar fotos de um imóvel existente

1. Usuário abre a edição de um imóvel já cadastrado.
2. Vê as fotos já anexadas.
3. Pode adicionar novas fotos (respeitando tipo, tamanho e o limite de 10
   fotos por imóvel).
4. Pode remover qualquer foto existente.
5. Salva as alterações.
6. A listagem e o detalhe do imóvel passam a refletir o novo conjunto de
   fotos.

## 9. Critérios de aceite

- O usuário consegue registrar um pagamento de aluguel sem sair do
  Dashboard.
- O Select da Quick Action mostra apenas imóveis com status "alugado" do
  próprio usuário.
- O sistema impede registrar duas vezes o mesmo mês de referência para o
  mesmo imóvel, tanto pela Quick Action quanto pelo fluxo completo já
  existente.
- Após um registro bem-sucedido pela Quick Action, os cards do Dashboard
  (patrimônio e rendimento) mostram o valor atualizado sem precisar de
  ação manual adicional do usuário.
- O usuário consegue acessar a página de Perfil a partir do item "Minha
  conta" do menu, hoje desabilitado.
- O usuário consegue ver seu e-mail (somente leitura) e editar nome,
  telefone/WhatsApp, Instagram e TikTok no Perfil.
- O sistema aceita salvar o Perfil com todos os campos novos em branco.
- O usuário só consegue ver e editar o próprio perfil — nunca o de outro
  usuário.
- Ao cadastrar um imóvel, o usuário consegue anexar uma ou mais fotos
  válidas (PNG/JPG/JPEG, até 3MB).
- O sistema recusa um arquivo fora do tipo ou tamanho permitido, com
  mensagem de erro clara, sem travar o restante do cadastro.
- O sistema impede anexar mais de 10 fotos a um mesmo imóvel.
- O usuário consegue adicionar e remover fotos de um imóvel já cadastrado,
  na tela de edição.
- A listagem de imóveis mostra a primeira foto enviada como capa de cada
  imóvel que tiver foto.
- O detalhe do imóvel mostra todas as fotos anexadas, em galeria.
- Um imóvel sem nenhuma foto continua funcionando normalmente em todas as
  telas (cadastro, edição, listagem, detalhe, contrato).
- O usuário só consegue ver, adicionar ou remover fotos dos próprios
  imóveis.

## 10. Stack

A mesma já usada em todo o projeto (nenhuma tecnologia nova é necessária
para esta feature):

- **Front-end:** Next.js (App Router) + TypeScript + TailwindCSS.
- **Back-end:** rotas de servidor do próprio Next.js.
- **Banco de dados / Auth / Storage:** Supabase (Postgres + RLS + Storage).
- **UI:** Base UI + componentes locais do projeto.
- **Formulários e validação:** React Hook Form + Zod.
- **Dados assíncronos:** TanStack Query.

## 11. Justificativa da stack

Nenhuma das três melhorias exige tecnologia fora do que o projeto já usa.
O Immobiliare já resolve, hoje, um problema equivalente ao de fotos de imóvel —
armazenar e servir arquivos de forma privada e segura por usuário — para os
PDFs de contrato, usando o Storage do Supabase com controle de acesso via
RLS. O mesmo raciocínio de segurança (cada usuário só acessa seus próprios
arquivos) se aplica a fotos de imóvel. Perfil e Quick Action são, em
essência, mais um cadastro e mais um formulário — o mesmo padrão já usado
em imóveis, contratos e recebimentos.

## 12. Fases de construção

### Fase 1 — Pagamento rápido de aluguel

Objetivo: dar ao usuário um atalho para registrar pagamento de aluguel sem
sair do Dashboard.
Specs:

- Spec 01 — Registro rápido de pagamento de aluguel via Dashboard.

### Fase 2 — Perfil do usuário

Objetivo: dar ao usuário um lugar para manter telefone/WhatsApp e redes
sociais associados à própria conta.
Specs:

- Spec 02 — Visualização e edição do Perfil do usuário.

### Fase 3 — Fotos do imóvel

Objetivo: permitir que cada imóvel tenha fotos, desde o cadastro até a
edição, com exibição consistente em todas as telas que já mostram imóveis.
Specs:

- Spec 03 — Upload de fotos no cadastro do imóvel.
- Spec 04 — Exibição de fotos na listagem e no detalhe do imóvel.
- Spec 05 — Gerenciar fotos na edição de um imóvel existente.

## 13. Specs funcionais detalhadas

> Cada spec deve ser autossuficiente: um agente de codificação vai ler SÓ
> esta spec (mais as dependências) para montar o plano técnico e
> implementar. Preencha todos os campos; se um não se aplica, escreva "Não
> se aplica" e o porquê.

### Spec 01 — Registro rápido de pagamento de aluguel via Dashboard

- **Fase:** Fase 1 — Pagamento rápido de aluguel
- **Objetivo (o quê):** Adicionar ao Dashboard um botão de ação rápida que
  abre um dialog para registrar o pagamento de aluguel de um imóvel
  alugado, sem sair da tela.
- **Intenção (por quê):** O fluxo completo de registro de recebimento
  (acessar o imóvel, entrar em "novo recebimento", preencher e voltar)
  tem passos demais para o caso mais comum: só confirmar que o aluguel do
  mês caiu. Reduzir o atrito aqui aumenta a chance de o usuário manter os
  recebimentos sempre em dia, o que por sua vez mantém a visão de
  patrimônio e rendimento confiável.
- **Contexto:** O Immobiliare já tem um fluxo completo de registro de
  recebimento de aluguel (com mês de referência, valor, data e
  observação), vinculado ao detalhe de cada imóvel. Essa spec não substitui
  esse fluxo — adiciona um atalho paralelo, mais enxuto, acessível direto
  do Dashboard. As regras de negócio de recebimento (um por mês por
  imóvel, valor obrigatório e maior que zero) já existem no sistema e
  valem integralmente aqui.
- **Atores:** Usuário autenticado (proprietário ou corretor autônomo)
  dono do imóvel.
- **Descrição do comportamento:** No Dashboard, um botão de ação rápida
  abre um dialog. Dentro do dialog, o usuário escolhe, numa lista, um dos
  seus imóveis com status "alugado". Informa o mês de referência do
  pagamento e o valor recebido. Ao confirmar, o sistema registra o
  recebimento associado àquele imóvel e ao usuário, com a data de hoje
  como data do recebimento. Se o registro for bem-sucedido, o dialog fecha,
  uma confirmação de sucesso é exibida, e as informações de patrimônio e
  rendimento no Dashboard são atualizadas para refletir o novo recebimento.
  Se houver erro (por exemplo, mês já registrado para aquele imóvel), o
  dialog permanece aberto, mostrando a mensagem de erro, e o usuário pode
  corrigir e tentar novamente.
- **Entradas e saídas:**
  - Entradas: imóvel selecionado (dentre os imóveis alugados do usuário),
    mês de referência do pagamento, valor recebido.
  - Saídas: um novo recebimento registrado (ou uma mensagem de erro, se a
    operação falhar); atualização visual dos cards de patrimônio/rendimento
    do Dashboard.
- **Dados/entidades envolvidos (conceitual):** Um recebimento tem: imóvel
  ao qual pertence, usuário dono, mês de referência, valor, e data em que
  foi registrado (esta última preenchida automaticamente com a data atual,
  sem ser digitada pelo usuário nesta spec).
- **Estados e transições:** Não se aplica — esta spec não introduz novos
  estados; ela cria um registro de recebimento, cuja existência já é
  refletida no histórico e no patrimônio (funcionalidades existentes).
- **Regras de negócio:** Ver Regras de negócio 3, 4, 5 e 6 da seção 7 deste
  PRD (Select mostra só imóveis "alugado"; um recebimento por mês por
  imóvel; data é sempre a de hoje; valor deve ser maior que zero).
- **Validações:**
  - O imóvel selecionado deve pertencer ao usuário autenticado e estar com
    status "alugado" no momento do registro.
  - O mês de referência é obrigatório.
  - O valor é obrigatório e deve ser maior que zero.
  - O mês de referência não pode já ter um recebimento registrado para
    aquele imóvel.
- **Fluxo do usuário (passo a passo):**
  1. Usuário está no Dashboard.
  2. Clica no botão de Quick Action de pagamento.
  3. O dialog abre com a lista de imóveis alugados do usuário.
  4. Usuário seleciona o imóvel.
  5. Informa o mês de referência.
  6. Informa o valor recebido.
  7. Confirma.
  8. Recebe feedback de sucesso (dialog fecha, Dashboard atualizado) ou de
     erro (dialog permanece aberto, mensagem exibida).
- **Casos de borda e erros:**
  - Usuário não tem nenhum imóvel com status "alugado": a lista de imóveis
    aparece vazia, e o sistema deixa claro que não há imóvel disponível
    para essa ação (sem quebrar ou travar o dialog).
  - Usuário tenta registrar um mês já lançado para aquele imóvel: o sistema
    recusa e mostra a mensagem de erro já usada hoje no fluxo completo de
    recebimento, sem fechar o dialog.
  - Usuário informa valor zero, negativo ou não numérico: o sistema recusa
    antes de tentar salvar, indicando o campo com problema.
  - Usuário fecha o dialog no meio do preenchimento: nenhum dado é salvo.
  - Imóvel deixa de estar "alugado" entre a abertura do dialog e a
    confirmação (por exemplo, foi editado em outra aba): o sistema recusa
    o registro e informa que o imóvel não está mais disponível para essa
    ação.
- **Impacto no existente:** O fluxo completo de registro de recebimento
  (com data específica e observação) continua existindo exatamente como
  está, no detalhe do imóvel — esta spec não o altera, apenas adiciona um
  caminho alternativo mais rápido para o caso comum. O Dashboard, hoje sem
  nenhum componente interativo, passa a ter um primeiro elemento de UI
  próprio.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado que o usuário tem ao menos um imóvel com status "alugado", quando
    ele abre a Quick Action, então vê esse imóvel na lista de seleção.
  - Dado que o usuário tem um imóvel disponível ou vendido, quando ele abre
    a Quick Action, então esse imóvel **não** aparece na lista de seleção.
  - Dado que o usuário preencheu imóvel, mês e valor válidos, quando
    confirma o registro, então o recebimento é salvo, o dialog fecha, e os
    cards do Dashboard refletem o novo valor.
  - Dado que já existe um recebimento para aquele imóvel naquele mês,
    quando o usuário tenta confirmar o mesmo mês novamente, então o sistema
    recusa e mostra o erro, mantendo o dialog aberto.
  - Dado que o usuário informa valor zero ou negativo, quando tenta
    confirmar, então o sistema impede o envio e sinaliza o campo inválido.
- **Definição de pronto:** O botão de Quick Action está visível no
  Dashboard; o dialog permite selecionar apenas imóveis alugados do próprio
  usuário; o registro respeita todas as regras e validações listadas
  acima; o Dashboard reflete o novo recebimento sem exigir recarregar a
  página manualmente; os critérios de aceite acima foram verificados um a
  um.
- **Dependências:** Nenhuma. Reaproveita as regras de negócio e a estrutura
  de dados de recebimento já existentes no sistema (implementadas na Fase
  4 da V1, documentada em `docs/PRD-Imobe-v1.md`).
- **Fora do escopo desta spec:** Editar ou excluir um recebimento já
  registrado pela Quick Action (usa-se o fluxo completo existente para
  isso); campo de observação; escolher uma data de recebimento diferente
  da data atual; notificações automáticas após o registro.

### Spec 02 — Visualização e edição do Perfil do usuário

- **Fase:** Fase 2 — Perfil do usuário
- **Objetivo (o quê):** Criar uma página de Perfil onde o usuário logado
  visualiza seu e-mail e edita nome, telefone/WhatsApp, Instagram e TikTok.
- **Intenção (por quê):** Proprietários e corretores autônomos costumam
  precisar divulgar um contato junto dos imóveis que administram. Hoje o
  Immobiliare não guarda nenhum dado de contato ou rede social do usuário — essa
  spec dá um lugar próprio para isso, plantando a base para usos futuros
  (por exemplo, esse contato aparecer em algum lugar voltado a divulgação),
  sem que este PRD comprometa esse uso futuro.
- **Contexto:** O menu do usuário no cabeçalho do painel já tem um item
  "Minha conta", hoje desabilitado (nunca foi implementado). Esta spec deve
  habilitar esse item existente e ligá-lo à nova página de Perfil, em vez
  de criar um novo ponto de entrada solto no menu. Não existe hoje nenhuma
  tabela ou estrutura de perfil no sistema — só o e-mail usado no
  cadastro/login. Não existe campo de nome em nenhum outro lugar do
  sistema (o cadastro só pede e-mail e senha), então o nome informado aqui
  é um dado novo, próprio do perfil — não vem de nenhum outro lugar nem é
  sincronizado com o login.
- **Atores:** Usuário autenticado.
- **Descrição do comportamento:** Ao acessar "Minha conta"/Perfil, o
  usuário vê seu e-mail (dado vindo da própria conta, somente leitura) e
  um formulário com quatro campos editáveis: nome, telefone/WhatsApp,
  Instagram e TikTok — todos opcionais. O usuário pode preencher, editar
  ou deixar em branco qualquer um desses campos e salvar. O sistema
  confirma quando o salvamento é concluído com sucesso.
- **Entradas e saídas:**
  - Entradas: nome (texto), telefone/WhatsApp (texto), Instagram
    (texto/identificador), TikTok (texto/identificador) — todos opcionais.
  - Saídas: confirmação de que o perfil foi salvo; exibição atualizada dos
    dados do perfil na própria página.
- **Dados/entidades envolvidos (conceitual):** Um perfil pertence a um
  único usuário e contém: nome, telefone/WhatsApp, Instagram, TikTok.
  E-mail não faz parte deste conjunto de dados — continua sendo o já
  existente na conta do usuário, apenas exibido aqui.
- **Estados e transições:** Não se aplica — não há estados/transições
  neste comportamento, apenas dados que existem ou estão vazios.
- **Regras de negócio:** Ver Regra de negócio 1 (usuário só vê/edita o
  próprio perfil) e Regra de negócio 7 (todos os campos novos são
  opcionais) da seção 7 deste PRD.
- **Validações:**
  - Nenhum dos quatro campos é obrigatório — o formulário pode ser salvo
    totalmente vazio.
  - Se preenchido, o telefone/WhatsApp deve ter um formato de telefone
    reconhecível (ex.: aceitar com ou sem DDD/DDI, sem exigir um formato
    rígido único).
  - Instagram e TikTok, se preenchidos, são tratados como identificador
    (usuário/@) — não é necessário validar se o perfil realmente existe.
- **Fluxo do usuário (passo a passo):**
  1. Usuário abre o menu do usuário no cabeçalho.
  2. Clica em "Minha conta".
  3. Vê a página de Perfil, com o e-mail exibido, e o formulário de nome,
     telefone/WhatsApp, Instagram e TikTok.
  4. Preenche ou edita os campos desejados.
  5. Salva.
  6. Recebe confirmação de que os dados foram salvos.
- **Casos de borda e erros:**
  - Usuário acessa o Perfil pela primeira vez, sem nenhum dado salvo ainda:
    os quatro campos aparecem vazios, prontos para preenchimento.
  - Usuário salva com todos os campos em branco: o sistema aceita
    normalmente (nenhum campo é obrigatório).
  - Usuário informa um telefone em formato não reconhecível: o sistema
    indica o campo inválido antes de salvar.
  - Falha ao salvar (erro do sistema): o sistema informa que não foi
    possível salvar e mantém os dados preenchidos no formulário, sem
    perder o que o usuário digitou.
- **Impacto no existente:** O item "Minha conta", hoje desabilitado no menu
  do cabeçalho, passa a ficar habilitado e a levar para esta nova página.
  Nenhuma outra tela existente é alterada.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado que o usuário está autenticado, quando clica em "Minha conta" no
    menu, então acessa a página de Perfil (item deixa de estar
    desabilitado).
  - Dado que o usuário acessa o Perfil, quando a página carrega, então ele
    vê seu e-mail atual, somente leitura.
  - Dado que o usuário preenche nome, telefone/WhatsApp, Instagram e/ou
    TikTok e salva, quando a operação é concluída, então os dados ficam
    gravados e aparecem preenchidos numa próxima visita à página.
  - Dado que o usuário deixa todos os campos em branco e salva, quando
    confirma, então o sistema aceita sem erro.
  - Dado um usuário A e um usuário B, quando o usuário A acessa o Perfil,
    então ele nunca vê nem consegue editar os dados de perfil do usuário B.
- **Definição de pronto:** A página de Perfil existe, é acessível pelo item
  "Minha conta" (agora habilitado), exibe o e-mail e permite editar/salvar
  nome, telefone/WhatsApp, Instagram e TikTok, respeitando o isolamento
  entre usuários; os critérios de aceite acima foram verificados um a um.
- **Dependências:** Nenhuma.
- **Fora do escopo desta spec:** Edição do e-mail; upload de foto de
  perfil/avatar; qualquer rede social além de Instagram e TikTok;
  verificação de que o telefone, o nome ou os perfis sociais informados
  são verdadeiros/existem de fato.

### Spec 03 — Upload de fotos no cadastro do imóvel

- **Fase:** Fase 3 — Fotos do imóvel
- **Objetivo (o quê):** Permitir que, ao cadastrar um imóvel, o usuário
  anexe uma ou mais fotos daquele imóvel.
- **Intenção (por quê):** Um imóvel cadastrado só com texto e valores é
  difícil de reconhecer rapidamente numa lista e não serve para
  divulgação. Fotos tornam o cadastro mais útil desde o primeiro momento —
  tanto para o próprio usuário organizar visualmente seus imóveis quanto
  para eventual uso em divulgação futura.
- **Contexto:** O cadastro de imóvel já existe no Immobiliare, com campos de
  endereço, valores, tipo (venda/aluguel/ambos) e dados complementares.
  Esta spec adiciona a possibilidade de anexar fotos a esse mesmo fluxo de
  cadastro, sem alterar os campos e regras já existentes. O projeto já tem
  um padrão validado de armazenamento privado de arquivo por usuário
  (usado hoje para os PDFs de contrato: cada usuário só acessa os próprios
  arquivos) — a mesma lógica de acesso deve valer para as fotos de imóvel.
- **Atores:** Usuário autenticado, durante o cadastro de um imóvel.
- **Descrição do comportamento:** Na tela de cadastro de imóvel, o usuário
  pode selecionar uma ou mais imagens do próprio dispositivo para anexar
  ao imóvel que está criando. Cada imagem selecionada é validada quanto ao
  tipo de arquivo (PNG, JPG ou JPEG) e ao tamanho (máximo 3MB). Imagens que
  não passam na validação são recusadas individualmente, com uma mensagem
  clara indicando qual arquivo teve problema e por quê — sem impedir que o
  restante do cadastro (dados do imóvel e demais fotos válidas) prossiga.
  Ao salvar o imóvel, todas as fotos válidas selecionadas ficam associadas
  a ele, na ordem em que foram adicionadas.
- **Entradas e saídas:**
  - Entradas: uma ou mais imagens selecionadas pelo usuário (arquivo,
    nome, tipo, tamanho), junto com os demais dados do cadastro de imóvel
    já existentes.
  - Saídas: o imóvel criado com as fotos válidas associadas a ele; para
    cada foto inválida, uma mensagem de erro específica.
- **Dados/entidades envolvidos (conceitual):** Um imóvel passa a poder ter
  de zero a dez fotos associadas. Cada foto tem: o imóvel ao qual pertence,
  a ordem em que foi enviada (usada para determinar qual é a capa) e o
  próprio arquivo de imagem.
- **Estados e transições:** Não se aplica diretamente — mas vale registrar
  que a primeira foto enviada (ordem 1) é a que passa a valer como capa do
  imóvel na listagem (ver Spec 04).
- **Regras de negócio:** Ver Regras de negócio 2, 8, 9, 10 e 11 da seção 7
  deste PRD (usuário só mexe nas próprias fotos; tipo/tamanho de arquivo;
  limite de 10 fotos; primeira foto é a capa; imóvel pode ficar sem foto).
- **Validações:**
  - Tipo de arquivo deve ser PNG, JPG ou JPEG — qualquer outro tipo é
    recusado.
  - Tamanho de cada arquivo deve ser no máximo 3MB — arquivos maiores são
    recusados.
  - O total de fotos de um imóvel (incluindo as que já existiam, se for o
    caso) não pode ultrapassar 10.
  - As fotos são opcionais — o cadastro do imóvel é válido mesmo sem
    nenhuma foto anexada.
- **Fluxo do usuário (passo a passo):**
  1. Usuário acessa "Cadastrar imóvel".
  2. Preenche os dados do imóvel normalmente.
  3. Na seção de fotos, seleciona uma ou mais imagens do dispositivo.
  4. O sistema valida cada imagem e informa se alguma foi recusada e por
     quê.
  5. Usuário revisa as fotos válidas selecionadas (pode remover alguma
     antes de salvar, se quiser).
  6. Usuário salva o cadastro do imóvel.
  7. O imóvel é criado com as fotos válidas associadas.
- **Casos de borda e erros:**
  - Usuário seleciona um arquivo que não é imagem (ex.: PDF, vídeo): o
    sistema recusa e explica que o tipo de arquivo não é suportado.
  - Usuário seleciona uma imagem maior que 3MB: o sistema recusa e informa
    o limite de tamanho.
  - Usuário tenta selecionar mais fotos do que o limite permite (mais de
    10 no total): o sistema aceita até completar o limite e informa que o
    restante não pôde ser adicionado.
  - Usuário não seleciona nenhuma foto: o cadastro prossegue normalmente,
    sem nenhuma foto associada ao imóvel.
  - Falha no envio de uma foto válida (erro de sistema durante o upload):
    o sistema informa a falha para aquela foto especificamente, sem
    impedir que o restante do cadastro (dados do imóvel e demais fotos)
    seja salvo.
- **Impacto no existente:** O formulário de cadastro de imóvel ganha uma
  nova seção (fotos), sem alterar os campos e validações já existentes
  (endereço, valores, tipo, etc.).
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado que o usuário está cadastrando um imóvel, quando seleciona uma
    imagem PNG/JPG/JPEG de até 3MB, então ela é aceita e fica associada ao
    imóvel salvo.
  - Dado que o usuário seleciona um arquivo que não é PNG/JPG/JPEG, quando
    tenta anexar, então o sistema recusa esse arquivo e explica o motivo,
    sem afetar as demais fotos ou os dados do imóvel.
  - Dado que o usuário seleciona uma imagem maior que 3MB, quando tenta
    anexar, então o sistema recusa e informa o limite de tamanho.
  - Dado que o usuário já selecionou 10 fotos válidas, quando tenta
    adicionar mais uma, então o sistema impede e informa o limite
    atingido.
  - Dado que o usuário não seleciona nenhuma foto, quando salva o imóvel,
    então o cadastro é concluído normalmente, sem foto associada.
- **Definição de pronto:** O formulário de cadastro de imóvel permite
  anexar de zero a dez fotos válidas; arquivos inválidos são recusados
  individualmente com mensagem clara; o imóvel criado fica com as fotos
  válidas associadas e acessíveis apenas pelo próprio usuário; os critérios
  de aceite acima foram verificados um a um.
- **Dependências:** Nenhuma.
- **Fora do escopo desta spec:** Exibir as fotos na listagem/detalhe do
  imóvel (coberto pela Spec 04); editar fotos de um imóvel já cadastrado
  (coberto pela Spec 05); qualquer edição/recorte da imagem; reordenar
  fotos manualmente.

### Spec 04 — Exibição de fotos na listagem e no detalhe do imóvel

- **Fase:** Fase 3 — Fotos do imóvel
- **Objetivo (o quê):** Mostrar as fotos de cada imóvel nas telas que já
  existem para listar e detalhar imóveis: uma capa/miniatura na listagem, e
  uma galeria no detalhe com visualização ampliada e navegação entre as
  fotos.
- **Intenção (por quê):** De nada adianta anexar fotos a um imóvel (Spec 03) se elas não aparecem em lugar nenhum. Esta spec é o que faz a foto
  virar valor visível para o usuário no dia a dia — reconhecer um imóvel de
  relance na lista, e ver todas as fotos ao abrir o detalhe.
- **Contexto:** A listagem de imóveis e a tela de detalhe do imóvel já
  existem no Immobiliare, mostrando hoje apenas dados textuais e valores. Esta
  spec depende de a Spec 03 (ou da Spec 05, para imóveis editados depois)
  já ter fotos associadas ao imóvel para ter o que exibir — sem fotos
  anexadas, o comportamento de "sem foto" descrito abaixo se aplica.
- **Atores:** Usuário autenticado, ao navegar pela listagem ou pelo
  detalhe de um imóvel próprio.
- **Descrição do comportamento:** Na listagem de imóveis, cada item que
  tiver ao menos uma foto mostra a primeira foto enviada (a capa) como
  miniatura. Itens sem nenhuma foto mostram um espaço reservado neutro no
  lugar da miniatura (sem foto quebrada ou vazio sem indicação). No
  detalhe do imóvel, todas as fotos associadas àquele imóvel são exibidas
  em miniatura, na ordem em que foram enviadas. Clicar em qualquer
  miniatura da galeria abre a foto ampliada, centralizada, com setas para
  navegar para a foto anterior/próxima (navegação circular — da última
  volta para a primeira) e um indicador de posição (ex.: "2 / 5"); fecha
  clicando fora ou no botão de fechar. Se o imóvel não tiver nenhuma foto,
  o detalhe mostra normalmente as demais informações, sem a galeria (ou
  com uma indicação de que não há fotos, ao invés de um espaço quebrado).
- **Entradas e saídas:**
  - Entradas: identificador do imóvel sendo listado/detalhado; clique do
    usuário numa miniatura da galeria para abrir a visualização ampliada;
    clique nas setas para navegar entre fotos.
  - Saídas: miniatura (capa) na listagem; galeria de miniaturas no
    detalhe; visualização ampliada com navegação entre fotos.
- **Dados/entidades envolvidos (conceitual):** As mesmas fotos de imóvel
  descritas na Spec 03 (imóvel ao qual pertencem, ordem de envio, arquivo
  de imagem) — esta spec só as lê e exibe, não as cria.
- **Estados e transições:** Não se aplica.
- **Regras de negócio:** Ver Regra de negócio 2 (usuário só vê fotos dos
  próprios imóveis), 10 (primeira foto é a capa) e 11 (imóvel pode ficar
  sem foto) da seção 7 deste PRD.
- **Validações:** Não se aplica — esta spec é somente leitura/exibição, não
  recebe entrada do usuário além da navegação.
- **Fluxo do usuário (passo a passo):**
  1. Usuário acessa a listagem de imóveis.
  2. Vê, para cada imóvel com foto, a miniatura da capa; para os sem foto,
     um espaço reservado neutro.
  3. Usuário abre o detalhe de um imóvel específico.
  4. Vê a galeria de miniaturas das fotos daquele imóvel (ou nenhuma
     galeria, se o imóvel não tiver fotos).
  5. Clica numa miniatura e vê essa foto ampliada, centralizada na tela.
  6. Usa as setas para ir para a foto anterior/próxima, ou o indicador de
     posição para se situar (ex.: "2 / 5").
  7. Fecha a visualização ampliada e volta pro detalhe do imóvel.
- **Casos de borda e erros:**
  - Imóvel sem nenhuma foto: listagem mostra espaço reservado neutro;
    detalhe não mostra galeria (ou indica claramente "sem fotos"), sem
    quebrar o layout da tela.
  - Falha ao carregar uma foto específica (ex.: arquivo corrompido ou
    indisponível no armazenamento): a tela não quebra — a foto com
    problema é tratada como indisponível, sem impedir a exibição das
    demais fotos ou dos dados do imóvel.
- **Impacto no existente:** A listagem de imóveis e a tela de detalhe do
  imóvel ganham exibição de imagem, sem alterar as informações e ações que
  já mostram hoje.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado um imóvel com uma ou mais fotos, quando o usuário vê esse imóvel
    na listagem, então a primeira foto enviada aparece como miniatura.
  - Dado um imóvel sem nenhuma foto, quando o usuário vê esse imóvel na
    listagem, então aparece um espaço reservado neutro no lugar da
    miniatura.
  - Dado um imóvel com fotos, quando o usuário abre o detalhe desse
    imóvel, então vê todas as fotos em galeria, na ordem de envio.
  - Dado um imóvel sem fotos, quando o usuário abre o detalhe desse
    imóvel, então a tela funciona normalmente, sem galeria quebrada ou
    vazia sem indicação.
  - Dado um imóvel com mais de uma foto, quando o usuário clica numa
    miniatura da galeria, então a foto abre ampliada e as setas permitem
    ver a anterior/próxima, voltando pra primeira depois da última.
  - Dado um imóvel com apenas uma foto, quando o usuário clica na
    miniatura, então a foto abre ampliada sem setas de navegação (não há
    outra foto para ir).
- **Definição de pronto:** A listagem de imóveis mostra a capa de cada
  imóvel com foto (e um espaço reservado nos sem foto); o detalhe do
  imóvel mostra a galeria completa; clicar numa foto abre a visualização
  ampliada com navegação entre as fotos do mesmo imóvel; nenhum dos
  comportamentos quebra quando o imóvel não tem foto; os critérios de
  aceite acima foram verificados um a um.
- **Dependências:** Spec 03 (para que existam fotos a serem exibidas) e
  Spec 05 (fotos adicionadas depois, na edição, também devem aparecer
  aqui).
- **Fora do escopo desta spec:** Editar, adicionar ou remover fotos pela
  galeria (essas ações vivem nas Specs 03 e 05); zoom além do tamanho
  ampliado padrão (pinça/scroll para aproximar); reordenar fotos
  arrastando na visualização ampliada.

### Spec 05 — Gerenciar fotos na edição de um imóvel existente

- **Fase:** Fase 3 — Fotos do imóvel
- **Objetivo (o quê):** Permitir que o usuário adicione novas fotos e
  remova fotos existentes de um imóvel que já está cadastrado, a partir da
  tela de edição do imóvel.
- **Intenção (por quê):** Nem sempre o usuário tem as fotos prontas no
  momento do cadastro, e imóveis mudam com o tempo (reforma, nova
  divulgação, foto desatualizada). Sem essa spec, a única forma de ter
  fotos seria acertar tudo no cadastro inicial — o que não reflete o uso
  real.
- **Contexto:** A tela de edição de imóvel já existe no Immobiliare, para editar
  os dados textuais e de valores do imóvel. Esta spec estende essa mesma
  tela para também gerenciar as fotos associadas ao imóvel, reaproveitando
  as mesmas regras de validação de tipo, tamanho e quantidade já definidas
  na Spec 03.
- **Atores:** Usuário autenticado, dono do imóvel sendo editado.
- **Descrição do comportamento:** Na tela de edição de um imóvel, o
  usuário vê as fotos já associadas a ele. Pode selecionar novas imagens
  para adicionar (validadas da mesma forma que no cadastro: tipo, tamanho,
  e respeitando o limite total de 10 fotos por imóvel) e pode remover
  qualquer foto já existente. Ao salvar, o conjunto de fotos do imóvel
  passa a refletir exatamente as adições e remoções feitas nessa sessão de
  edição.
- **Entradas e saídas:**
  - Entradas: novas imagens selecionadas para adicionar; seleção de fotos
    existentes a remover.
  - Saídas: conjunto de fotos do imóvel atualizado (fotos adicionadas
    passam a existir; fotos removidas deixam de existir); mensagens de
    erro para uploads inválidos.
- **Dados/entidades envolvidos (conceitual):** As mesmas fotos de imóvel
  da Spec 03 — esta spec adiciona novas (seguindo a mesma ordem
  incremental) e remove existentes.
- **Estados e transições:** Se o imóvel não tinha nenhuma foto e o usuário
  adiciona a primeira nesta edição, essa foto passa a ser a nova capa
  (mesma regra da Spec 03, Regra de negócio 10). Se o usuário remover a
  foto que era a capa, a próxima foto na ordem de envio passa a ser a nova
  capa; se não sobrar nenhuma foto, o imóvel volta ao estado "sem foto"
  descrito na Spec 04.
- **Regras de negócio:** Ver Regras de negócio 2, 8, 9, 10, 11 e 12 da
  seção 7 deste PRD (usuário só mexe nas próprias fotos; tipo/tamanho de
  arquivo; limite de 10 fotos; regra da capa; imóvel pode ficar sem foto;
  remoção é definitiva).
- **Validações:**
  - As mesmas da Spec 03 para novas fotos adicionadas (tipo PNG/JPG/JPEG,
    até 3MB por arquivo).
  - O total de fotos do imóvel (já existentes menos as removidas, mais as
    adicionadas) não pode ultrapassar 10 a qualquer momento da edição.
  - Remover uma foto exige que ela realmente pertença ao imóvel sendo
    editado (e, por consequência, ao usuário autenticado).
- **Fluxo do usuário (passo a passo):**
  1. Usuário abre a edição de um imóvel já cadastrado.
  2. Vê as fotos atualmente associadas ao imóvel.
  3. Opcionalmente, seleciona novas imagens para adicionar.
  4. Opcionalmente, remove alguma foto existente.
  5. Salva as alterações.
  6. O sistema confirma que as fotos foram atualizadas.
- **Casos de borda e erros:**
  - Usuário tenta adicionar uma foto inválida (tipo ou tamanho fora do
    permitido): o sistema recusa aquela foto especificamente, com
    mensagem clara, sem descartar as demais alterações já feitas na
    edição.
  - Usuário tenta adicionar fotos que ultrapassariam o limite de 10: o
    sistema aceita até completar o limite e informa que o restante não
    pôde ser adicionado.
  - Usuário remove todas as fotos do imóvel: o imóvel passa a se comportar
    como um imóvel sem foto (Spec 04), sem erro.
  - Usuário remove a foto que era a capa: a próxima foto na ordem assume
    como nova capa automaticamente.
  - Duas edições simultâneas do mesmo imóvel (por exemplo, duas abas):
    a última operação salva com sucesso prevalece; o sistema não precisa
    fundir alterações de fotos de sessões concorrentes.
- **Impacto no existente:** A tela de edição de imóvel ganha uma seção de
  gerenciamento de fotos, sem alterar os campos e o comportamento já
  existentes de edição dos demais dados do imóvel.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado um imóvel já cadastrado com fotos, quando o usuário abre a
    edição, então vê as fotos atualmente associadas.
  - Dado que o usuário adiciona uma nova foto válida na edição, quando
    salva, então essa foto passa a fazer parte do imóvel e aparece na
    listagem/detalhe (Spec 04).
  - Dado que o usuário remove uma foto existente, quando salva, então essa
    foto deixa de aparecer em qualquer lugar do sistema.
  - Dado que o usuário remove a foto que era a capa, quando salva, então a
    próxima foto na ordem de envio passa a ser exibida como capa na
    listagem.
  - Dado que o usuário remove todas as fotos do imóvel, quando salva,
    então o imóvel passa a ser exibido como um imóvel sem foto, sem erro.
  - Dado que o usuário tenta adicionar uma foto inválida durante a edição,
    quando confirma, então essa foto é recusada com mensagem clara, e as
    demais alterações válidas continuam disponíveis para salvar.
- **Definição de pronto:** A tela de edição de imóvel permite adicionar e
  remover fotos, respeitando as mesmas regras de validação e limite da
  Spec 03; a troca de capa acontece automaticamente quando necessário; os
  critérios de aceite acima foram verificados um a um.
- **Dependências:** Spec 03 (estrutura e regras de foto de imóvel já
  definidas ali) e Spec 04 (para que as alterações feitas aqui se reflitam
  corretamente na listagem e no detalhe).
- **Fora do escopo desta spec:** Reordenar fotos manualmente; editar ou
  recortar uma foto já enviada (só é possível remover e enviar de novo);
  histórico de fotos removidas.

## 14. Ordem recomendada de implementação

1. Spec 01 — Registro rápido de pagamento de aluguel via Dashboard.
2. Spec 02 — Visualização e edição do Perfil do usuário.
3. Spec 03 — Upload de fotos no cadastro do imóvel.
4. Spec 04 — Exibição de fotos na listagem e no detalhe do imóvel.
5. Spec 05 — Gerenciar fotos na edição de um imóvel existente.

As Specs 01 e 02 não têm dependência entre si nem com as demais — podem
ser feitas em qualquer ordem entre elas, ou em paralelo, sem risco. Já a
Fase 3 tem uma ordem que importa: a Spec 03 precisa existir antes da Spec
04 (não há o que exibir sem fotos cadastradas) e antes da Spec 05 (que
reaproveita as mesmas regras de validação definidas na Spec 03). A Spec 04
deve vir antes da Spec 05 para que, ao implementar a edição de fotos, já
exista o comportamento de exibição (capa e galeria) para verificar que as
trocas de capa e remoções realmente aparecem corretamente nas telas.
