# 6 - Organização de Tarefas no GitHub

Agora que você já sabe como trabalhar com Git localmente e enviar suas alterações para o GitHub, é hora de aprender a **organizar e gerenciar o trabalho** dentro de um projeto. O GitHub oferece várias ferramentas integradas que vão além do versionamento de código, permitindo planejar, rastrear e coordenar tarefas de forma eficiente.

Nesta aula, vamos explorar as principais formas de estruturar e dividir tarefas no GitHub.

## Issues: A Unidade Básica de Trabalho

**Issues** são a forma mais fundamental de organizar trabalho no GitHub. Pense nelas como "tarefas" ou "tickets" que precisam ser feitos.

### O Que São Issues?

Uma issue pode representar:
- Um bug a ser corrigido
- Uma nova funcionalidade a ser implementada
- Uma melhoria ou refatoração
- Uma pergunta ou discussão sobre o projeto
- Uma tarefa de documentação

### Anatomia de uma Issue

Cada issue possui:
- **Título**: Resumo curto e descritivo
- **Descrição**: Detalhamento do problema ou tarefa (suporta Markdown)
- **Assignees**: Pessoas responsáveis pela issue
- **Labels**: Tags para categorizar (bug, feature, documentation, etc.)
- **Milestone**: Qual marco/versão essa issue faz parte
- **Projects**: Qual board/projeto ela pertence
- **Comentários**: Discussão e atualizações sobre o progresso

### Boas Práticas para Issues

```markdown
## Descrição
Descrição clara do que precisa ser feito

## Critérios de Aceitação
- [ ] Requisito 1
- [ ] Requisito 2
- [ ] Requisito 3

## Contexto Adicional
Screenshots, links, referências, etc.
```

### Referenciando Issues

Issues podem ser referenciadas em commits, pull requests e outras issues usando `#número`:

```bash
git commit -m "Corrige validação de email #42"
```

Isso cria um link automático entre o commit e a issue #42.

### Fechando Issues Automaticamente

Você pode fechar issues automaticamente via commits ou PRs usando palavras-chave:

```bash
git commit -m "Fixes #42: Corrige validação de email"
```

Palavras-chave que fecham issues:
- `closes #42`, `close #42`
- `fixes #42`, `fix #42`
- `resolves #42`, `resolve #42`

---

## Milestones: Definindo Estágios do Projeto

**Milestones** (marcos) são agrupadores de issues e pull requests que representam um objetivo maior ou uma etapa do projeto.

### Para Que Servem?

Milestones ajudam a:
- Organizar trabalho por releases (v1.0, v2.0, v3.0)
- Definir sprints ou ciclos de desenvolvimento
- Marcar fases do projeto (MVP, Beta, Launch)
- Estabelecer objetivos trimestrais ou semestrais

### Estrutura de um Milestone

Cada milestone possui:
- **Título**: Nome do marco (ex: "v1.0 Release", "Sprint 3", "MVP")
- **Data de conclusão (opcional)**: Deadline do milestone
- **Descrição**: Objetivo geral e escopo
- **Progresso automático**: Mostra quantas issues/PRs estão abertas vs. fechadas

### Exemplo de Uso

```
Milestone: v1.0 - MVP
Deadline: 31/12/2025
Progresso: 15/20 (75%)

Issues incluídas:
#12 - Implementar autenticação
#15 - Criar dashboard principal
#18 - Adicionar validação de formulários
...
```

### Vantagens dos Milestones

✅ **Visualização clara do progresso**: Percentual de conclusão em tempo real
✅ **Priorização**: Fácil identificar o que falta para completar uma etapa
✅ **Comunicação**: Stakeholders veem facilmente as prioridades
✅ **Histórico**: Documentação automática de releases anteriores

### Limitações

❌ Não suporta dependências entre milestones
❌ Estrutura mais simples que ferramentas robustas (Jira, Linear)
❌ Milestones não podem ser aninhados

---

## Labels: Categorizando e Filtrando Trabalho

**Labels** são tags coloridas que você atribui a issues e pull requests para categorizá-los.

### Labels Padrão do GitHub

O GitHub cria automaticamente algumas labels:
- `bug`: Algo não está funcionando
- `documentation`: Melhorias ou adições na documentação
- `duplicate`: Esta issue ou PR já existe
- `enhancement`: Nova funcionalidade ou solicitação
- `good first issue`: Bom para iniciantes
- `help wanted`: Atenção extra é necessária
- `invalid`: Não parece certo
- `question`: Mais informações são solicitadas
- `wontfix`: Isso não será trabalhado

### Criando Labels Personalizadas

Você pode criar labels customizadas como:
- `frontend`, `backend`, `database`
- `priority: high`, `priority: medium`, `priority: low`
- `status: in progress`, `status: blocked`
- `refactor`, `test`, `ci/cd`

### Combinando Labels

Uma issue pode ter múltiplas labels simultaneamente:

```
Issue #45: "Botão de login não funciona no mobile"
Labels: bug, frontend, priority: high, mobile
```

---

## Projects: Visão Kanban e Roadmaps

**GitHub Projects** é uma ferramenta de gerenciamento de projetos integrada que oferece visualizações em boards estilo Kanban, tabelas e roadmaps.

### Tipos de Visualização

**1. Board (Kanban)**
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│  Backlog     │  To Do       │  In Progress │  Done        │
├──────────────┼──────────────┼──────────────┼──────────────┤
│  Issue #23   │  Issue #45   │  Issue #12   │  Issue #8    │
│  Issue #34   │  Issue #47   │  Issue #19   │  Issue #15   │
│              │              │  PR #31      │  PR #22      │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**2. Table (Tabela)**
Lista detalhada com colunas customizáveis: Status, Assignee, Priority, Milestone, etc.

**3. Roadmap**
Visão temporal das tarefas ao longo do tempo (timeline)

### Automações

Projects suportam automações como:
- Mover issues automaticamente quando uma PR é aberta
- Marcar como "Done" quando uma issue é fechada
- Adicionar labels baseado em status

### Projects vs. Milestones

| Aspecto | Projects | Milestones |
|---------|----------|------------|
| Visualização | Boards, tabelas, roadmaps | Lista simples |
| Automação | Alta (workflows) | Baixa |
| Flexibilidade | Customizável | Estrutura fixa |
| Melhor para | Gestão ágil, sprints | Releases, versões |

---

## Pull Requests: Revisão e Integração de Código

**Pull Requests (PRs)** são a forma de propor mudanças no código e discuti-las antes de integrá-las ao projeto.

### Fluxo de Trabalho com PRs

1. **Criar um branch de feature**: `git checkout -b feature/nova-funcionalidade`
2. **Fazer commits**: Desenvolver a funcionalidade
3. **Fazer push**: `git push -u origin feature/nova-funcionalidade`
4. **Abrir PR**: No GitHub, criar um Pull Request comparando seu branch com `main`
5. **Code Review**: Outros desenvolvedores revisam o código
6. **Ajustes**: Fazer alterações baseadas no feedback
7. **Merge**: Integrar as mudanças ao branch principal

### Boas Práticas para PRs

**Título e Descrição**
```markdown
## Resumo
Breve descrição do que foi feito (2-3 frases ou bullet points)

## Mudanças
- Lista das principais alterações
- Arquivos modificados e por quê

## Issues Relacionadas
Closes #42, #45

## Testes
Como testar essas mudanças

## Screenshots (se aplicável)
```

**Dicas**
- Mantenha PRs pequenos e focados (uma feature por vez)
- Adicione reviewers apropriados
- Link para issues relacionadas
- Certifique-se que os testes passam antes de solicitar review

---

## Discussions: Conversas Sobre o Projeto

**GitHub Discussions** é um fórum integrado ao repositório para conversas que não são necessariamente sobre código ou tarefas específicas.

### Quando Usar Discussions

- **Perguntas gerais**: "Como fazer X com esta biblioteca?"
- **Ideias e brainstorming**: Discutir propostas antes de criar issues
- **Anúncios**: Comunicar novidades para a comunidade
- **Mostrar e contar**: Compartilhar o que você construiu com o projeto
- **Polls**: Votações para decisões coletivas

### Discussions vs. Issues

| Aspecto | Discussions | Issues |
|---------|-------------|--------|
| Propósito | Conversas abertas | Tarefas definidas |
| Estrutura | Fórum (categorias) | Lista de tarefas |
| Status | N/A | Aberta/Fechada |
| Integração | Fraca com código | Forte com código |

---

## Estratégia de Organização: Juntando Tudo

Aqui está uma estratégia completa para organizar um projeto no GitHub:

### 1. Estrutura de Labels

Crie um sistema de labels por categoria:

**Tipo**
- `bug`, `feature`, `docs`, `refactor`, `test`

**Área**
- `frontend`, `backend`, `api`, `database`, `devops`

**Prioridade**
- `priority: critical`, `priority: high`, `priority: medium`, `priority: low`

**Status**
- `status: blocked`, `status: needs review`, `status: ready`

### 2. Fluxo de Milestones

```
Milestone 1: MVP (Produto Mínimo Viável)
└── Issues: #1-#20 (funcionalidades essenciais)

Milestone 2: Beta
└── Issues: #21-#40 (melhorias e testes com usuários)

Milestone 3: v1.0 Release
└── Issues: #41-#60 (polimento e performance)
```

### 3. Board de Projeto (Kanban)

```
Backlog → To Do → In Progress → Review → Done
```

- **Backlog**: Todas as ideias e tarefas futuras
- **To Do**: Tarefas priorizadas para o sprint atual
- **In Progress**: Sendo trabalhado ativamente
- **Review**: Aguardando code review ou testes
- **Done**: Completo e integrado

### 4. Política de Branches + PRs

```
main (protegido)
└── develop (integração)
    ├── feature/login (#PR-12)
    ├── feature/dashboard (#PR-15)
    └── bugfix/email-validation (#PR-18)
```

- Nenhum commit direto em `main`
- Todas as mudanças via Pull Request
- Mínimo de 1 aprovação antes do merge
- Testes automatizados devem passar

---

## Ferramentas Externas Populares (Comparação)

Se o GitHub Projects não atender suas necessidades, considere:

### Jira
- ✅ Mais robusto para empresas grandes
- ✅ Suporta metodologias ágeis complexas (Scrum, Kanban, SAFe)
- ❌ Mais complexo e caro
- ❌ Interface mais pesada

### Linear
- ✅ Interface moderna e rápida
- ✅ Ótimo para equipes de produto/engenharia
- ❌ Menos integrações que Jira
- ❌ Pago

### Trello
- ✅ Muito simples e visual
- ✅ Gratuito para uso básico
- ❌ Menos integração com código
- ❌ Limitado para projetos complexos

### Quando usar GitHub nativo?

Para **projetos pequenos a médios** (até ~10 pessoas) trabalhando principalmente com código, as ferramentas nativas do GitHub são geralmente suficientes e evitam a necessidade de sincronizar informações entre múltiplas plataformas.

---

## Criando a Primeira Milestone e Issues do Projeto

Teoria é importante, mas nada substitui a prática. Vamos agora criar sua primeira milestone e suas primeiras issues, usando um exemplo real: um projeto que está começando e precisa de uma página "Em construção".

### Passo a Passo: Milestone 0 - Em Construção

**1. Criando a Milestone**

No seu repositório no GitHub:
1. Vá em **Issues** → **Milestones** → **New milestone**
2. Preencha:
   - **Title**: `Milestone 0: Em construção`
   - **Due date**: Defina uma data realista (ex: 2 semanas a partir de hoje)
   - **Description**:
     ```markdown
     Primeira versão do site com página "Em construção" no ar.

     Objetivos:
     - Site acessível via domínio .com.br
     - Padrões de código definidos
     - Página inicial informando que o projeto está em desenvolvimento
     ```
3. Clique em **Create milestone**

**2. Criando as Issues**

Agora vamos criar 3 issues e associá-las a esta milestone:

#### Issue #1: Colocar o site num domínio .com.br

```markdown
**Título**: Colocar o site num domínio .com.br

**Descrição**:
## Objetivo
Configurar hospedagem e DNS para o projeto ficar acessível através de um domínio próprio.

## Tarefas
- [ ] Registrar domínio .com.br
- [ ] Configurar hospedagem (Vercel/Netlify/GitHub Pages)
- [ ] Apontar DNS para a hospedagem
- [ ] Testar acesso via domínio

## Critérios de Aceitação
- Site acessível via https://nomedoprojeto.com.br
- Certificado SSL configurado
- Redirecionamento de www funcionando

**Labels**: `infrastructure`, `priority: high`
**Milestone**: Milestone 0: Em construção
**Assignee**: Você mesmo
```

#### Issue #2: Definir estilização do código e configurar editor

```markdown
**Título**: Definir estilização do código e configurar editor

**Descrição**:
## Objetivo
Estabelecer padrões de código para manter consistência no projeto.

## Tarefas
- [ ] Escolher guia de estilo (Airbnb, Standard, etc.)
- [ ] Instalar e configurar ESLint
- [ ] Instalar e configurar Prettier
- [ ] Criar arquivo `.editorconfig`
- [ ] Documentar padrões no README

## Arquivos a criar
- `.eslintrc.json`
- `.prettierrc`
- `.editorconfig`

## Critérios de Aceitação
- Código formatado automaticamente ao salvar
- Linter apontando problemas de estilo
- Toda a equipe usando as mesmas configurações

**Labels**: `developer experience`, `priority: medium`, `good first issue`
**Milestone**: Milestone 0: Em construção
**Assignee**: Você mesmo
```

#### Issue #3: Programar página de "Em construção"

```markdown
**Título**: Programar página de "Em construção"

**Descrição**:
## Objetivo
Criar uma landing page simples informando que o site está em desenvolvimento.

## Design
- Logo do projeto
- Texto: "Estamos em construção"
- Breve descrição do que está por vir
- Campo para cadastro de e-mail (opcional)
- Links para redes sociais

## Tarefas
- [ ] Criar estrutura HTML
- [ ] Estilizar com CSS (responsivo)
- [ ] Adicionar animações sutis (opcional)
- [ ] Testar em diferentes dispositivos
- [ ] Deploy

## Critérios de Aceitação
- Página responsiva (mobile, tablet, desktop)
- Carregamento rápido (< 2s)
- Acessível (boas práticas de a11y)

**Labels**: `frontend`, `priority: high`
**Milestone**: Milestone 0: Em construção
**Assignee**: Você mesmo
```

### Visualizando o Progresso

Após criar as 3 issues, vá em **Issues** → **Milestones** → **Milestone 0: Em construção**.

Você verá algo assim:

```
Milestone 0: Em construção
Due by December 31, 2025

0% complete
0 closed / 3 open

Open issues and pull requests:
#1 Colocar o site num domínio .com.br
#2 Definir estilização do código e configurar editor
#3 Programar página de "Em construção"
```

Conforme você fecha as issues (seja manualmente ou via commits com `closes #1`), essa barra de progresso aumenta automaticamente!

---

## A Psicologia da Motivação: Dopamina e Completar Tarefas

Você já se perguntou por que marcar uma tarefa como "concluída" é tão satisfatório? A resposta está na **dopamina**, o neurotransmissor mais importante quando o assunto é motivação.

### O Sistema de Recompensa do Cérebro

Quando você completa uma tarefa, seu cérebro libera dopamina, criando uma sensação de satisfação e prazer. Esse é um mecanismo evolutivo que nos motiva a continuar fazendo coisas produtivas.

```
Iniciar tarefa → Trabalhar nela → Completar → Dopamina liberada → Motivação aumenta
```

### Por Que Issues e Milestones Funcionam Tão Bem?

**1. Quebra de tarefas grandes em pequenas**
- Tarefa grande: "Lançar o site" → Muito distante, pouca dopamina
- Tarefas pequenas: "Configurar domínio", "Criar página" → Vitórias frequentes, mais dopamina

**2. Progresso visível**
- Ver a barra de progresso do milestone subir de 0% → 33% → 66% → 100%
- Cada issue fechada é uma micro-celebração

**3. Checkboxes e listas de tarefas**
- Marcar `[x]` em uma checklist ativa o sistema de recompensa
- Por isso dividimos issues em sub-tarefas com checkboxes

### Hacks Práticos para Manter a Motivação

**1. Comece com "quick wins"**
```markdown
Milestone 0: Em construção
├── Issue #2: Configurar linter (fácil, 30min) ← Comece por aqui!
├── Issue #3: Página em construção (médio, 2h)
└── Issue #1: Configurar domínio (difícil, pode travar)
```
Completar a #2 primeiro dá momentum para as outras.

**2. Use labels de dificuldade**
- `difficulty: easy` 🟢
- `difficulty: medium` 🟡
- `difficulty: hard` 🔴

Dias com pouca energia? Pegue as verdes. Dia produtivo? Ataque as vermelhas.

**3. Celebre micro-progressos**
- Não espere fechar a issue inteira
- Marque checkboxes individuais
- Comente na issue sobre o que conseguiu fazer
- Cada commit é um passo

**4. Evite o "perfectionism paralysis"**
```markdown
❌ Issue: "Criar o site perfeito"
✅ Issue: "Criar versão 1 da landing page"
   - [ ] Estrutura HTML básica
   - [ ] CSS mínimo funcional
   - [ ] Deploy

   (Melhorias ficam para issues futuras!)
```

### A Técnica Pomodoro + Issues

Combine técnicas:
1. Escolha uma issue
2. Divida em sub-tarefas de ~25 minutos cada
3. Trabalhe em uma sub-tarefa por pomodoro
4. Marque como concluída → Dopamina!
5. Pausa de 5 minutos
6. Repita

Exemplo:
```markdown
Issue #3: Programar página de "Em construção"
- [x] Estrutura HTML (25min) ✓ Pomodoro 1
- [ ] CSS layout mobile (25min) → Pomodoro 2
- [ ] CSS desktop + responsivo (25min) → Pomodoro 3
- [ ] Animações (25min) → Pomodoro 4
```

### O Perigo do "Workflow Pesado"

⚠️ **Cuidado**: Processos muito burocráticos matam a dopamina!

**Ruim:**
- 10 campos obrigatórios para criar uma issue
- Aprovação de 5 pessoas para começar a trabalhar
- Reuniões de 2 horas para planejar 1 hora de trabalho

**Bom:**
- Issue simples: título + descrição mínima
- Comece a trabalhar imediatamente
- Ajuste no caminho se necessário

A ferramenta deve **facilitar** seu trabalho, não atrapalhá-lo.

---

## Resumo

O GitHub oferece um ecossistema completo para organização de tarefas:

- **Issues**: Unidade básica de trabalho (bugs, features, tarefas)
- **Labels**: Categorização e filtros
- **Milestones**: Agrupamento por objetivos/releases
- **Projects**: Boards Kanban, roadmaps, gestão visual
- **Pull Requests**: Revisão de código e integração
- **Discussions**: Fórum para conversas abertas

Comece simples (issues + labels) e adicione complexidade conforme o projeto cresce. A chave é consistência: escolha uma estrutura e siga-a com disciplina.
