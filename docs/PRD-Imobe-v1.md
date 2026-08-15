# PRD — Imobe (v1)

## Changelog

| Versão | Data       | Autor | Resumo da mudança                          |
|--------|------------|-------|---------------------------------------------|
| 1.0    | 2026-08-09 | —     | PRD inicial: problema, funcionalidades, regras, fluxos, critérios de aceite, fora do escopo, stack em alto nível, métricas de sucesso e riscos/premissas. |
| 1.1    | 2026-08-10 | —     | Adicionada seção "Fases de Construção" (ordem de implementação da V1, dividida em fases com specs de alto nível). |
| 1.2    | 2026-08-13 | —     | Fases 4 (Recebimentos), 5 (Contratos) e 6 (Patrimônio) implementadas e validadas ponta a ponta (incluindo isolamento de dados entre usuários). Todos os critérios de aceite da seção 11 concluídos — V1 completa. |

## 1. Visão Geral

**Imobe** é um micro-SaaS para gestão de imóveis, contratos e patrimônio, voltado para
proprietários que alugam ou vendem imóveis e para corretores autônomos que precisam
organizar seus imóveis, contratos e informações em um só lugar.

Cada usuário enxerga e gerencia **apenas seus próprios** imóveis, contratos e recebimentos.

## 2. Problema que o projeto resolve

- Organizar imóveis e seus valores em um só lugar (fim das planilhas soltas).
- Facilitar a geração de contratos de venda e locação, com ou sem imóvel previamente cadastrado.
- Dar visão clara de quanto patrimônio imobiliário o usuário tem hoje.

## 3. Público-alvo

- Pessoas físicas que possuem imóveis para alugar e/ou vender.
- Corretores autônomos que precisam controlar múltiplos imóveis, contratos e valores.

**Não terá foco em:** imobiliárias grandes com equipe, múltiplos usuários por conta,
ou operação em escala empresarial. O produto é pensado para uso individual (micro-SaaS).

## 4. Objetivo da Primeira Versão (V1)

Permitir que o usuário cadastre imóveis, defina se são para venda e/ou aluguel, gere
contratos em PDF (vinculados ou não a um imóvel cadastrado), registre recebimentos de
aluguel de forma simples, e visualize a evolução de rendimento de cada imóvel e o
patrimônio geral da conta.

## 5. Métricas de Sucesso (V1)

Indicadores que ajudam a validar se o produto está entregando valor,
independentemente de a funcionalidade estar tecnicamente "pronta":

- Número de imóveis cadastrados por usuário nos primeiros 30 dias.
- Número de contratos gerados (venda + locação) por usuário.
- Percentual de usuários que registram pelo menos 1 recebimento de aluguel.
- Percentual de usuários que retornam ao dashboard de patrimônio mais de
  uma vez por semana (indício de que o produto virou hábito).

## 6. Funcionalidades

### 6.1 Essenciais (V1)

**Conta e acesso**
- Criar conta e fazer login.

**Imóveis**
- Cadastrar imóvel.
- Editar imóvel.
- Listar imóveis.
- Ver detalhes de um imóvel.
- Marcar imóvel como disponível ou indisponível.
- Definir se o imóvel é para venda, aluguel, ou ambos.
- Informar valores: valor de venda, valor de aluguel mensal, valor do IPTU, valor
  estimado atual do imóvel.
- Informar dados complementares: localização, endereço completo, bairro, cidade,
  link do anúncio (se houver).

**Contratos**
- Gerar contrato de venda.
- Gerar contrato de locação.
- Gerar contrato vinculado a um imóvel já cadastrado (onboarding pré-preenche os dados).
- Gerar contrato sem vincular a um imóvel cadastrado (onboarding do zero).
- Baixar contrato em PDF.
- Ver lista de contratos gerados.

**Recebimentos e histórico**
- Registrar recebimento de aluguel (simples, sem controle financeiro completo).
- Exibir histórico de recebimentos no detalhe do imóvel, com filtro por período
  (mês, 6 meses, 1 ano).

**Patrimônio**
- Visão geral do patrimônio: soma dos valores estimados dos imóveis do usuário.
- Quantidade de imóveis cadastrados.
- Distribuição por status: alugados, disponíveis, vendidos, indisponíveis.
- Rendimento de aluguel em período recente.

### 6.2 Desejáveis (podem entrar ainda na V1 se houver tempo, senão vão para depois)

- Melhorias visuais no dashboard de patrimônio (gráficos simples de evolução).
- Busca e filtros avançados na listagem de imóveis (por tipo, status, cidade).

### 6.3 Futuras (fora da V1, mapeadas para versões seguintes)

Ver lista completa na seção 7 (Fora do escopo).

## 7. Fora do escopo (V1)

Explicitamente **não entra** nesta versão — candidatos para versões futuras:

- Pagamento online.
- Assinatura digital de contrato.
- Envio automático por WhatsApp.
- Envio automático por e-mail.
- Aplicativo mobile.
- Painel para imobiliárias.
- Gestão de equipes ou múltiplos corretores.
- Controle avançado de inadimplência.
- Multas, juros e reajuste automático de aluguel.
- Integração com portais de anúncio.
- Integração com cartórios.
- Marketplace de imóveis.
- Inteligência artificial.
- Relatórios financeiros avançados.
- Notificação push.
- Múltiplos idiomas.

## 8. Riscos e Premissas

**Premissas assumidas:**
- O usuário sabe preencher os dados do contrato sem apoio jurídico dentro do produto.
- O modelo de contrato gerado é um modelo genérico, não substitui validação jurídica.
- O usuário tem pelo menos um imóvel para começar a usar o produto de forma significativa.

**Riscos identificados:**
- Modelo de contrato genérico pode não ser juridicamente adequado em todos os
  estados/municípios (regras locais de locação variam).
- Ausência de validação de dados sensíveis (CPF, endereço) pode gerar contratos
  com erros que o usuário só percebe depois de gerado o PDF.
- Como não há controle financeiro completo na V1, o "rendimento" mostrado é uma
  aproximação baseada em registros manuais — depende do usuário lançar certo.

## 9. Regras de negócio

1. Cada usuário só pode ver e gerenciar seus próprios imóveis.
2. Cada usuário só pode ver e baixar seus próprios contratos.
3. Um imóvel pode ser cadastrado como venda, aluguel, ou ambos.
4. Se o imóvel for de aluguel, é obrigatório informar o valor mensal de aluguel.
5. Se o imóvel for de venda, é obrigatório informar o valor de venda.
6. Contratos podem ser gerados a partir de um imóvel cadastrado ou sem vincular a nenhum imóvel.
7. Quando o contrato é gerado a partir de um imóvel cadastrado, ele fica relacionado
   **ao usuário e ao imóvel**.
8. Quando o contrato é gerado sem imóvel cadastrado, ele fica relacionado **apenas ao usuário**.
9. O valor estimado do imóvel é usado somente na visão geral de patrimônio (não interfere
   em valores de venda/aluguel).
10. Recebimentos de aluguel ficam sempre relacionados ao imóvel e ao usuário dono do imóvel.

## 10. Principais fluxos

### Fluxo 1 — Acesso
1. Usuário cria conta.
2. Usuário faz login.
3. Usuário acessa o dashboard.

### Fluxo 2 — Cadastro de imóveis
1. Usuário acessa a área de imóveis.
2. Clica em "Cadastrar imóvel".
3. Preenche as informações do imóvel.
4. Define se é para venda, aluguel ou ambos.
5. Informa os valores obrigatórios conforme o tipo.
6. Salva o imóvel.

### Fluxo 3 — Gestão de rendimentos
1. Usuário acessa um imóvel alugado.
2. Registra o recebimento de aluguel do mês.
3. Visualiza a linha do tempo de rendimento.
4. Filtra por mês, 6 meses ou 12 meses.

### Fluxo 4 — Geração de contrato com imóvel cadastrado
1. Usuário acessa o imóvel.
2. Escolhe "Gerar contrato".
3. Seleciona venda ou locação.
4. Preenche os dados necessários.
5. Gera o contrato em PDF.
6. Baixa o PDF.
7. O contrato fica relacionado ao usuário e ao imóvel.

### Fluxo 5 — Geração de contrato sem imóvel cadastrado
1. Usuário acessa a área de contratos.
2. Escolhe o tipo de contrato: venda ou locação.
3. Preenche os dados do imóvel e das partes.
4. Gera o contrato em PDF.
5. Baixa o PDF.
6. O contrato fica relacionado apenas ao usuário.

### Fluxo 6 — Visão geral do patrimônio
1. Usuário acessa o dashboard.
2. Visualiza o total estimado do patrimônio.
3. Visualiza a quantidade de imóveis cadastrados.
4. Visualiza imóveis por status: alugados, disponíveis, vendidos e indisponíveis.
5. Visualiza rendimento de aluguel em período recente.

## 11. Critérios de aceite (V1)

A V1 está pronta quando o usuário consegue, de ponta a ponta:

**Conta e acesso**
- [x] Criar conta e fazer login.

**Imóveis**
- [x] Cadastrar e editar imóvel.
- [x] Listar seus imóveis.
- [x] Acessar detalhes de um imóvel.
- [x] Sistema exige valor de aluguel quando o imóvel é para aluguel.
- [x] Sistema exige valor de venda quando o imóvel é para venda.

**Rendimentos**
- [x] Registrar recebimentos mensais de aluguel.
- [x] Detalhe do imóvel mostra a linha do tempo de rendimentos.
- [x] Filtrar rendimentos por mês, 6 meses e 12 meses.

**Contratos**
- [x] Gerar contrato de venda em PDF.
- [x] Gerar contrato de locação em PDF.
- [x] Baixar o PDF gerado.
- [x] Contrato gerado a partir de imóvel cadastrado fica vinculado ao imóvel e ao usuário.
- [x] Contrato gerado sem imóvel cadastrado fica vinculado apenas ao usuário.
- [x] Usuário só consegue ver e baixar seus próprios contratos.

**Patrimônio**
- [x] Dashboard mostra a visão geral do patrimônio.

**Segurança e isolamento de dados**
- [x] Usuário só consegue ver seus próprios imóveis.
- [x] Usuário só consegue ver seus próprios contratos.

## 12. Fases de Construção (V1)

> Ordem de implementação sugerida para a V1. Cada fase agrupa specs (tarefas técnicas
> de alto nível) — o detalhamento de **como** implementar cada spec (comandos, arquivos,
> queries) é feito depois, dentro da ferramenta de codificação (Claude Code), respeitando
> as Rules e Skills já configuradas no projeto.

### Fase 1 — Base inicial, layout e navegação
- **Spec 1.1:** Setup do projeto (Next.js + TypeScript + TailwindCSS), estrutura de
  pastas conforme as Rules do projeto (`/components`, `/hooks`, `/services`, `/lib`).
- **Spec 1.2:** Layout base — header, navegação, separação entre área pública
  (landing, login, cadastro) e área privada (dashboard).

### Fase 2 — Acesso do usuário
- **Spec 2.1:** Configuração do Supabase Auth no projeto (client + variáveis de ambiente).
- **Spec 2.2:** Tela e fluxo de cadastro de conta (Fluxo 1, passo 1).
- **Spec 2.3:** Tela e fluxo de login (Fluxo 1, passo 2).
- **Spec 2.4:** Proteção de rotas privadas (middleware/proxy — confirmar nome
  conforme a versão do Next.js em uso).
- **Spec 2.5:** Redirecionamento pós-login/cadastro para o dashboard (Fluxo 1, passo 3).

### Fase 3 — Gestão de imóveis
- **Spec 3.1:** Modelagem da tabela de imóveis no Supabase (SQL) com RLS
  (Regra de negócio 1: cada usuário só vê seus próprios imóveis).
- **Spec 3.2:** Cadastro de imóvel — formulário com validação (Fluxo 2), respeitando
  as Regras de negócio 3, 4 e 5 (tipo, valor de aluguel obrigatório, valor de venda obrigatório).
- **Spec 3.3:** Listagem de imóveis do usuário.
- **Spec 3.4:** Edição de imóvel.
- **Spec 3.5:** Detalhe do imóvel — status (disponível/indisponível), tipo, valores
  (venda, aluguel, IPTU, valor estimado) e dados complementares.

### Fase 4 — Recebimentos e histórico (concluída)
- **Spec 4.1:** Modelagem da tabela de recebimentos (SQL), vinculada a imóvel e
  usuário (Regra de negócio 10).
- **Spec 4.2:** Registro de recebimento de aluguel (Fluxo 3, passos 1–2).
- **Spec 4.3:** Linha do tempo de recebimentos com filtro por período — mês, 6 meses,
  1 ano (Fluxo 3, passos 3–4).

### Fase 5 — Contratos (concluída)
- **Spec 5.1:** Modelagem da tabela de contratos (SQL), com relação opcional ao imóvel
  (Regras de negócio 6, 7 e 8).
- **Spec 5.2:** Geração de contrato vinculado a imóvel cadastrado, com dados
  pré-preenchidos (Fluxo 4).
- **Spec 5.3:** Geração de contrato avulso, sem imóvel vinculado (Fluxo 5).
- **Spec 5.4:** Exportação do contrato em PDF, download e listagem de contratos gerados
  pelo usuário.

### Fase 6 — Patrimônio, validações e refinamentos (concluída)
- **Spec 6.1:** Dashboard de patrimônio — soma de valores estimados, contagem de
  imóveis, distribuição por status, rendimento recente (Fluxo 6).
- **Spec 6.2:** Validação de ponta a ponta de todos os Critérios de aceite (seção 11),
  incluindo isolamento de dados entre usuários.
- **Spec 6.3:** Ajustes de responsividade (desktop, tablet, mobile) e revisão geral de UX.

## 13. Stack técnica (alto nível)

> Estrutura de pastas, arquitetura interna e plano técnico detalhado serão definidos
> depois, dentro da ferramenta de codificação (Claude Code, Cursor, etc.).
> A justificativa de cada escolha de stack (trade-offs, alternativas consideradas)
> fica registrada separadamente em um ADR (Architecture Decision Record), não neste PRD.

- **Front-end:** Next.js.
- **Back-end:** atrelado ao próprio Next.js (rotas de servidor, sem servidor separado).
- **Supabase:** cobrindo autenticação, banco de dados e storage (armazenamento dos PDFs
  de contrato).
- **Estilização:** TailwindCSS.
- **Dados assíncronos / requisições HTTP:** TanStack Query.
- **Responsividade:** obrigatória — desktop, tablet e mobile.

---
*Documento gerado como PRD inicial (v1.1) do projeto Imobe, consolidando o workflow de
descoberta: problema → público → métricas de sucesso → funcionalidades → fora do
escopo → riscos/premissas → regras de negócio → fluxos → critérios de aceite → fases
de construção → stack.*
