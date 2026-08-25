# security-audit

Skill de **auditoria de segurança** para projetos **React**, **Next.js**, **TypeScript** e ecossistema comum (Auth.js, Prisma, Stripe, Zod). Pensada para **vários repositórios**: cada execução usa as versões **instaladas** no projeto (`package.json` + lockfile), não um stack fixo.

Relatórios em **português**. Patches são **somente propostas** — nada é aplicado automaticamente.

---

## Repositório

```
skills-sujeito-programador/
└── security-audit/
    ├── README.md          ← este arquivo
    ├── SKILL.md           ← instruções do agente (obrigatório)
    └── refs/              ← referências carregadas durante a auditoria
        ├── project-stack.md
        ├── language.md
        ├── nextjs-checklist.md
        ├── secrets.md
        ├── false-positives.md
        ├── security-headers.md
        ├── proxy-middleware.md
        └── report.md
```

---

## O que esta skill faz

| Etapa | Conteúdo                                                            |
| ----- | ------------------------------------------------------------------- |
| 1     | Escopo + stack real (`npm ls`, lockfile, App Router vs Pages)       |
| 2     | `npm audit --omit=dev` no projeto auditado                          |
| 3     | Segredos (`.env` tracked, chaves no código, CI/CD)                  |
| 4–5   | Código: injeção, auth/IDOR, webhooks, uploads, fluxo entre arquivos |
| 6     | Filtro de falsos positivos                                          |
| 7     | Relatório estruturado                                               |
| 8     | Patches sugeridos só para **CRITICAL** e **HIGH**                   |

**Não cobre** por padrão: Python, Java, Go (salvo pedido explícito).

---

## Como instalar no Cursor

### Opção A — Skill no projeto que você audita

Copie a pasta `security-audit` para o app que será analisado:

```
seu-app/
└── .agents/skills/security-audit/
    ├── SKILL.md
    └── refs/
```

O Cursor descobre skills em `.agents/skills/` do workspace aberto.

### Opção B — Repositório central + cópia ou submodule

Mantenha esta skill em `skills-sujeito-programador/security-audit` e, em cada app:

- copie a pasta, ou
- use submodule/git sparse checkout apontando para `security-audit/`

Abra o **projeto do app** no Cursor (não só o repo da skill) ao rodar a auditoria.

### Opção C — Skill pessoal (todos os projetos)

```text
~/.cursor/skills/security-audit/
```

Mesma estrutura (`SKILL.md` + `refs/`).

---

## Quando a skill é acionada

Esta skill usa `disable-model-invocation: true` no `SKILL.md` — o agente **não** deve auto-invocá-la em pedidos genéricos de segurança.

### Gatilhos válidos (única forma de executar o fluxo completo)

| Forma              | Exemplo                                             |
| ------------------ | --------------------------------------------------- |
| Comando explícito  | `/security-audit`                                   |
| Comando com escopo | `/security-audit src/app/api`                       |
| Anexo manual       | `@.agents/skills/security-audit/SKILL.md` no prompt |

Pedidos como “auditar segurança”, “tem XSS?”, “revisa IDOR” ou “security review” **sem** `/security-audit` **não** disparam esta skill. O agente deve pedir o comando ou responder sem o fluxo de auditoria.

> `/security-audit` é uma **convenção de prompt** no chat. Para torná-la um atalho fixo, registre uma Cursor Automation ou regra que só reaja a essa string.

---

## Comandos de gatilho

Copie e cole no chat do Cursor (ajuste o path se quiser):

```text
/security-audit
```

```text
/security-audit src/app/api
```

---

## Pré-requisitos no projeto auditado

- Node.js + lockfile (`package-lock.json`, `pnpm-lock.yaml` ou `yarn.lock`)
- Código acessível no workspace (o agente lê arquivos e pode rodar `npm audit`, `npm ls`, `git ls-files`)

Não é necessário ter `middleware.ts` nem CSP em `next.config` — a skill trata isso com cautela (ver `refs/security-headers.md` e `refs/proxy-middleware.md`).

---

## Versões do Next.js (importante)

A auditoria segue o **major instalado** no lockfile:

| Next        | Borda (auth / headers)                                                                       |
| ----------- | -------------------------------------------------------------------------------------------- |
| **&lt; 16** | `middleware.ts` + export `middleware`                                                        |
| **≥ 16**    | `proxy.ts` + export `proxy` ([doc Proxy](https://nextjs.org/docs/app/getting-started/proxy)) |

Não reportar “falta `middleware.ts`” em projetos Next 16+ sem procurar `proxy.ts`.

---

## O que você recebe

1. **Tabela resumo** (CRITICAL → INFO)
2. Achados por **categoria** (não só por arquivo)
3. **Stack detectado** (`next@…`, `react@…` do lockfile)
4. Seção de **dependências** (`npm audit`)
5. **Segredos** (se houver)
6. **Falsos positivos descartados** (transparência)
7. **Patches propostos** (CRITICAL/HIGH) com aviso para revisar antes de aplicar

Formato detalhado: `refs/report.md`.

---

## O que a skill evita (anti-ruído)

- CSP/HSTS ausente em `next.config` como CRITICAL/HIGH → no máximo **INFO**
- Snippet de headers copiado de **outra versão** do Next
- Exigir `middleware.ts` em Next **16+** sem checar `proxy.ts`
- CVE inventado ou “atualize o Next” sem advisory
- Patch automático no repositório

Detalhes: `refs/false-positives.md`.

---

## Estrutura dos arquivos `refs/`

| Arquivo               | Quando o agente usa                           |
| --------------------- | --------------------------------------------- |
| `project-stack.md`    | Step 1 — versões, monorepo, gates por major   |
| `language.md`         | Padrões React/Next/Prisma/Stripe              |
| `nextjs-checklist.md` | Steps 4–5 — roteiro de scan                   |
| `secrets.md`          | Step 3 — padrões de chaves e `.env`           |
| `false-positives.md`  | Step 6 — obrigatório antes de publicar achado |
| `security-headers.md` | CSP/HSTS com cautela por versão               |
| `proxy-middleware.md` | Next 16+ `proxy.ts` vs `middleware.ts`        |
| `report.md`           | Step 7 — template do relatório                |

---

## Manutenção desta skill

Ao publicar no repo `skills-sujeito-programador`:

1. Mantenha `SKILL.md` com `disable-model-invocation: true` e `description` que cite apenas `/security-audit` como gatilho.
2. Não renomeie arquivos em `refs/` sem atualizar links no `SKILL.md`.
3. Teste em um app real com `/security-audit` e confira se o relatório cita **versões do lockfile**.

---

## Licença e uso

Skill criada para uso com **Cursor Agent** e fluxos compatíveis com Agent Skills (`SKILL.md` + pasta `refs/`).

**Sujeito Programador** — repositório de skills: `skills-sujeito-programador/security-audit`.

---

## Links úteis

- [Next.js — Proxy (16+)](https://nextjs.org/docs/app/getting-started/proxy)
- [Next.js — Authentication](https://nextjs.org/docs/app/guides/authentication)
- [Next.js — Data security](https://nextjs.org/docs/app/guides/data-security)
- [OWASP API Security](https://owasp.org/www-project-api-security/)
