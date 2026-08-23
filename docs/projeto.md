# Projeto — Imobe

> Documento vivo: diferente do PRD (referência inicial, mais estável), este
> arquivo deve ser atualizado sempre que o projeto ganhar ou mudar
> funcionalidades reais. Aqui não entram stack técnica, padrões de
> arquitetura ou convenções de código — isso vive no README, nas rules e
> nos ADRs. Este arquivo é só sobre **o que o projeto é** e **o que ele faz**.

## O que é o Imobe

O Imobe é um sistema simples para quem tem imóveis e precisa parar de
controlar tudo em planilhas soltas, anotações e memória. Ele reúne, num só
lugar, o cadastro dos imóveis, a geração de contratos de venda e locação, o
registro de recebimentos de aluguel, e uma visão clara de quanto patrimônio
imobiliário a pessoa tem hoje.

Cada pessoa que usa o Imobe só vê e gerencia os próprios imóveis, contratos
e recebimentos — não é um sistema pensado para equipe ou múltiplos usuários
numa mesma conta.

## Missão geral

**O problema:** quem tem um ou mais imóveis pra alugar ou vender — sem ser
uma imobiliária — hoje resolve isso de um jeito espalhado e informal:
planilha numa aba, contrato copiado de um modelo antigo e editado no Word,
recebimento de aluguel anotado no caderno ou lembrado de cabeça, e nenhuma
visão consolidada de quanto patrimônio isso tudo representa. Esse controle
manual falha silenciosamente: perde-se histórico, perde-se contrato,
esquece-se de registrar um recebimento, e a pessoa só descobre a bagunça
quando precisa de uma informação com urgência (fechar uma venda, provar
recebimento pra imposto de renda, decidir se vende ou mantém um imóvel).

**Para quem:** proprietários pessoa física com um ou mais imóveis e
corretores autônomos que administram imóveis de terceiros sem o apoio
estrutural de uma imobiliária.

**O que o Imobe resolve:** tira a gestão de imóveis da planilha solta e da
memória, dando a essas pessoas um lugar único, simples e confiável para
organizar seus imóveis, gerar contratos e acompanhar a evolução do próprio
patrimônio — sem a complexidade, o custo ou o overhead de um sistema pensado
para imobiliárias grandes.

## Missão desta fase

A V1 do Imobe está **completa e validada ponta a ponta**: todas as fases de
construção previstas no PRD (base e navegação, acesso, gestão de imóveis,
recebimentos, contratos e patrimônio) foram implementadas, e todos os
critérios de aceite da V1 estão marcados como concluídos, incluindo o
isolamento de dados entre usuários.

A missão da fase atual não é mais "construir do zero" — é **consolidar o
que já existe**:

- Manter a base estável: corrigir inconsistências que aparecem no uso real
  antes de adicionar funcionalidade nova (ex.: a correção feita entre a
  seção de status do imóvel e a de patrimônio no PRD, que unificou os 4
  status possíveis — disponível, alugado, vendido, indisponível).
- Validar o produto com uso real antes de inflar escopo: entender se as
  funcionalidades essenciais (cadastro, contrato, recebimento, patrimônio)
  já resolvem o problema na prática, sem antecipar funcionalidades que hoje
  estão explicitamente fora de escopo.
- Preparar terreno, com calma, para que os itens hoje fora de escopo
  (assinatura digital, envio automático, controle financeiro mais robusto,
  etc.) possam virar uma próxima versão quando fizer sentido — não antes.

## Público-alvo

O Imobe é feito para **uso individual**: cada conta representa uma pessoa
cuidando dos próprios imóveis (ou dos imóveis que administra), não uma
equipe.

### Perfil 1 — Proprietário pessoa física

- **Quem é:** alguém que tem um ou poucos imóveis (geralmente entre 1 e
  poucas dezenas) para alugar e/ou vender, sem estrutura de negócio por trás
  — pode ser herança, investimento pessoal, ou imóvel que sobrou de uma
  mudança de vida.
- **Dores:** não sabe consolidar quanto vale o que possui; usa planilha que
  fica desatualizada porque dá trabalho manter; gera contrato copiando um
  modelo antigo (às vezes de outra pessoa) e editando manualmente, sem
  confiança de que está completo; esquece de registrar recebimento de
  aluguel e depois não lembra se um mês específico foi pago.
- **Contexto de uso:** uso esporádico e recorrente ao mesmo tempo — acessa
  uma vez por mês pra registrar o aluguel recebido, e ocasionalmente quando
  precisa gerar um contrato novo (troca de inquilino, nova venda) ou checar
  o patrimônio total.

### Perfil 2 — Corretor autônomo

- **Quem é:** profissional que atua sozinho (sem vínculo com uma imobiliária
  grande), cuidando de vários imóveis de terceiros ao mesmo tempo —
  intermediando aluguel e/ou venda.
- **Dores:** precisa controlar vários imóveis, contratos e valores em
  paralelo sem o suporte de um sistema corporativo caro ou de uma equipe;
  depende de organização pessoal pra não confundir dados de um imóvel com
  os de outro; precisa gerar contratos rapidamente, muitas vezes sem o
  imóvel ainda estar formalmente cadastrado em lugar nenhum.
- **Contexto de uso:** mais frequente que o proprietário pessoa física —
  cadastra imóveis com regularidade, gera contratos com mais volume, e usa
  a visão de patrimônio/carteira para acompanhar quantos imóveis estão
  disponíveis, alugados ou vendidos a qualquer momento.

### Quem não é o público

O Imobe **não é para** imobiliárias grandes com equipe própria, sistemas
com múltiplos usuários numa mesma conta, ou operação em escala empresarial.
Não há hoje (nem está planejado no curto prazo) suporte a times, permissões
por usuário, ou gestão compartilhada de uma mesma carteira de imóveis.

## Proposta de valor / diferenciais

- **Tudo em um único lugar:** cadastro de imóveis, geração de contrato,
  registro de recebimento e visão de patrimônio vivem juntos — sem precisar
  alternar entre planilha, editor de texto e memória para cada uma dessas
  tarefas.
- **Simplicidade sobre completude:** o Imobe não tenta ser um ERP
  imobiliário. Ele cobre o essencial do dia a dia de quem administra poucos
  imóveis sozinho, sem telas, campos ou fluxos que só fariam sentido para
  uma operação em escala.
- **Sem overhead de imobiliária:** não exige cadastro de equipe,
  permissões, hierarquia ou processo de aprovação — a pessoa cria a conta e
  já consegue cadastrar um imóvel e gerar um contrato.
- **Contrato pronto sem digitar tudo de novo:** quando o imóvel já está
  cadastrado, o contrato puxa os dados automaticamente; quando não está,
  ainda é possível gerar um contrato avulso — o Imobe se adapta ao que a
  pessoa já tem organizado, em vez de exigir cadastro prévio completo.
- **Visão de patrimônio sem controle financeiro complexo:** o usuário
  entende quanto tem, quantos imóveis estão em cada status e o rendimento
  recente de aluguel, sem precisar operar uma ferramenta de contabilidade.
- **Isolamento de dados garantido:** cada conta só vê e gerencia os
  próprios imóveis, contratos e recebimentos — relevante tanto para o
  proprietário quanto para o corretor, que muitas vezes lida com dados
  sensíveis de terceiros.

## Escopo

### O que o Imobe é hoje

Um sistema de uso individual para cadastro de imóveis (com fotos), geração
de contratos de venda/locação em PDF, registro de recebimentos de aluguel
(inclusive um atalho rápido pelo Dashboard), acompanhamento consolidado do
patrimônio imobiliário e um perfil com dados de contato do usuário. O
detalhamento completo do que já está em produção está na seção
["O que o usuário consegue fazer hoje"](#o-que-o-usuário-consegue-fazer-hoje),
mais abaixo neste documento.

### O que o Imobe não é (fora de escopo por enquanto)

- Não processa pagamento online.
- Não oferece assinatura digital de contrato.
- Não envia nada automaticamente por WhatsApp ou e-mail.
- Não tem aplicativo mobile — é web, responsivo.
- Não é um painel para imobiliárias, nem suporta gestão de equipes ou
  múltiplos corretores numa mesma conta.
- Não faz controle avançado de inadimplência, nem calcula multas, juros ou
  reajuste automático de aluguel.
- Não integra com portais de anúncio nem com cartórios.
- Não é um marketplace de imóveis.
- Não usa inteligência artificial em nenhuma funcionalidade.
- Não gera relatórios financeiros avançados, nem envia notificação push.
- Não suporta múltiplos idiomas.

Essa lista reflete o momento atual do produto, não uma decisão permanente —
qualquer um desses itens pode virar uma próxima versão. A lista completa e
com justificativas (riscos, premissas) vive no
[PRD](PRD-Imobe-v1.md#7-fora-do-escopo-v1); aqui fica só o essencial para
contexto rápido.

## O que o usuário consegue fazer hoje

**Conta**
- Criar uma conta e fazer login para começar a usar o sistema.

**Imóveis**
- Cadastrar um imóvel novo, com endereço, localização, valores (venda,
  aluguel mensal, IPTU, valor estimado) e link do anúncio, se houver.
- Dizer se aquele imóvel é para venda, para aluguel, ou para os dois.
- Anexar uma ou mais fotos ao imóvel — no cadastro ou depois, editando —,
  com a primeira foto virando a capa exibida na listagem.
- Editar as informações de um imóvel a qualquer momento.
- Ver a lista de todos os seus imóveis, com foto de capa e o status de
  cada um (disponível, alugado, vendido ou indisponível).
- Abrir o detalhe de um imóvel específico e ver tudo sobre ele num só
  lugar, incluindo a galeria de fotos (com visualização ampliada e
  navegação entre elas).

**Contratos**
- Gerar um contrato de venda ou de locação em PDF, pronto pra baixar.
- Gerar esse contrato já puxando os dados de um imóvel que já está
  cadastrado — sem digitar tudo de novo.
- Ou gerar um contrato avulso, sem precisar ter aquele imóvel cadastrado no
  sistema.
- Ver a lista de todos os contratos já gerados, e baixar qualquer um deles
  de novo quando precisar.

**Recebimentos**
- Registrar, mês a mês, o recebimento do aluguel de um imóvel alugado.
- Ver a linha do tempo de tudo que já recebeu daquele imóvel, com filtro por
  período (último mês, últimos 6 meses, último ano).
- Registrar um pagamento de aluguel em poucos cliques direto do Dashboard
  (sem precisar entrar no imóvel), escolhendo entre os imóveis alugados,
  informando só o mês e o valor.

**Patrimônio**
- Ver, num painel único, o valor total estimado de tudo que possui.
- Ver quantos imóveis tem, e como eles se distribuem entre alugados,
  disponíveis, vendidos e indisponíveis.
- Ver o rendimento de aluguel recente, de forma consolidada.

**Perfil**
- Ver e editar o próprio perfil (nome, telefone/WhatsApp, Instagram,
  TikTok), acessível pelo menu do usuário. O e-mail aparece como somente
  leitura, vindo da própria conta.

## Nota sobre este documento

Este arquivo complementa o `docs/PRD-Imobe-v1.md` — o PRD continua sendo a
referência de requisitos, regras de negócio e critérios de aceite. Este
arquivo existe para dar contexto rápido e sempre atualizado sobre o que o
projeto é e o que ele já faz de verdade, tanto para quem for reler o projeto
depois quanto para a IA entender o produto sem precisar ler o PRD inteiro.
Atualizar sempre que uma funcionalidade nova entrar em produção.
