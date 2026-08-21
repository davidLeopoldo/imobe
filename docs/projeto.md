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

## Missão

Tirar a gestão de imóveis da planilha solta e da memória, dando a
proprietários e corretores autônomos um lugar único, simples e confiável
para organizar seus imóveis, gerar contratos e acompanhar a evolução do
próprio patrimônio — sem a complexidade, o custo ou o overhead de um sistema
pensado para imobiliárias grandes.

## Público-alvo

- **Pessoas físicas** que têm um ou mais imóveis para alugar e/ou vender, e
  querem parar de controlar isso em planilhas ou de memória.
- **Corretores autônomos** que precisam organizar vários imóveis, contratos
  e valores ao mesmo tempo, sem depender de uma imobiliária ou de um
  sistema corporativo caro.

**Não é para:** imobiliárias grandes com equipe própria, sistemas com
múltiplos usuários numa mesma conta, ou operação em escala empresarial. O
Imobe é pensado para uso individual.

## O que o usuário consegue fazer hoje

**Conta**
- Criar uma conta e fazer login para começar a usar o sistema.

**Imóveis**
- Cadastrar um imóvel novo, com endereço, localização, valores (venda,
  aluguel mensal, IPTU, valor estimado) e link do anúncio, se houver.
- Dizer se aquele imóvel é para venda, para aluguel, ou para os dois.
- Editar as informações de um imóvel a qualquer momento.
- Ver a lista de todos os seus imóveis, com o status de cada um (disponível,
  alugado, vendido ou indisponível).
- Abrir o detalhe de um imóvel específico e ver tudo sobre ele num só lugar.

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

**Patrimônio**
- Ver, num painel único, o valor total estimado de tudo que possui.
- Ver quantos imóveis tem, e como eles se distribuem entre alugados,
  disponíveis, vendidos e indisponíveis.
- Ver o rendimento de aluguel recente, de forma consolidada.

## Nota sobre este documento

Este arquivo complementa o `docs/PRD-Imobe-v1.md` — o PRD continua sendo a
referência de requisitos, regras de negócio e critérios de aceite. Este
arquivo existe para dar contexto rápido e sempre atualizado sobre o que o
projeto é e o que ele já faz de verdade, tanto para quem for reler o projeto
depois quanto para a IA entender o produto sem precisar ler o PRD inteiro.
Atualizar sempre que uma funcionalidade nova entrar em produção.
