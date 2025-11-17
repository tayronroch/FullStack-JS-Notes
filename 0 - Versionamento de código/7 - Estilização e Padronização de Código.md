# Estilização e Padronização de Código

## O que é Estilização de Código?

Estilização de código refere-se ao conjunto de regras e ferramentas que garantem que o código seja escrito de forma consistente, legível e siga as melhores práticas de programação. É como ter um guia de estilo para a escrita, mas aplicado ao desenvolvimento de software.

## Por que é Importante?

### 1. Consistência
Quando múltiplos desenvolvedores trabalham no mesmo projeto, cada um tem seu próprio estilo de escrita. Ferramentas de estilização garantem que todo o código pareça ter sido escrito pela mesma pessoa.

### 2. Legibilidade
Código bem formatado é mais fácil de ler e entender, reduzindo o tempo necessário para compreender o que o código faz.

### 3. Prevenção de Erros
Algumas ferramentas detectam erros comuns antes mesmo de você executar o código, economizando tempo de debugging.

### 4. Revisão de Código Facilitada
Em pull requests, diferenças de estilo não aparecem como mudanças, permitindo que os revisores foquem na lógica real.

### 5. Onboarding Mais Rápido
Novos membros da equipe se adaptam mais rapidamente quando o código segue padrões consistentes.

---

## Principais Ferramentas

### ESLint - Analisador Estático de Código

O **ESLint** é uma ferramenta que analisa seu código JavaScript/TypeScript para encontrar problemas de:
- Qualidade de código
- Possíveis bugs
- Padrões de código ruins
- Violações de regras de estilo

#### Como Funciona

O ESLint percorre seu código e verifica se ele segue as regras configuradas. Se encontrar violações, ele pode:
- Avisar você (warning)
- Gerar erro (error)
- Corrigir automaticamente (quando possível)

#### Exemplo de Configuração

```javascript
// .eslintrc.js ou eslint.config.js
module.exports = {
  extends: ['@rocketseat/eslint-config/react'],
  plugins: ['simple-import-sort'],
  rules: {
    'simple-import-sort/imports': 'error',
  },
}
```

**O que essa configuração faz:**
- `extends`: Herda regras de uma configuração base (no caso, da Rocketseat para React)
- `plugins`: Adiciona funcionalidades extras (organização automática de imports)
- `rules`: Define regras específicas (imports devem estar ordenados)

#### Exemplos Práticos de Regras

**Antes (com erro):**
```javascript
// Imports desordenados
import { useState } from 'react'
import axios from 'axios'
import { Button } from './components/Button'
import React from 'react'

const Component = () => {
  const data = getData()  // Variável não utilizada
  return <div>Hello</div>
}
```

**Depois (corrigido pelo ESLint):**
```javascript
// Imports ordenados
import React from 'react'
import { useState } from 'react'

import axios from 'axios'

import { Button } from './components/Button'

const Component = () => {
  return <div>Hello</div>
}
```

---

### Prettier - Formatador de Código

O **Prettier** é um formatador de código opinativo que garante que todo o código tenha a mesma aparência, independentemente de quem o escreveu.

#### Diferença entre ESLint e Prettier

- **ESLint**: Foca em qualidade de código e possíveis erros
- **Prettier**: Foca exclusivamente em formatação (espaçamento, quebras de linha, aspas, etc.)

Ambos trabalham juntos de forma complementar!

#### Exemplo de Configuração

```javascript
// prettier.config.mjs
const config = {
  plugins: ['prettier-plugin-tailwindcss'],
  printWidth: 80,           // Máximo de caracteres por linha
  tabWidth: 2,              // Tamanho da indentação
  useTabs: false,           // Usar espaços em vez de tabs
  semi: false,              // Não usar ponto e vírgula
  singleQuote: true,        // Usar aspas simples
  quoteProps: 'as-needed',  // Aspas em propriedades apenas quando necessário
  jsxSingleQuote: false,    // Aspas duplas em JSX
  trailingComma: 'es5',     // Vírgula final em objetos e arrays
  bracketSpacing: true,     // Espaço dentro de chaves { foo: bar }
  arrowParens: 'always',    // Sempre usar parênteses em arrow functions
  endOfLine: 'auto',        // Quebra de linha automática
  bracketSameLine: false    // Fecha tag JSX na próxima linha
}

export default config
```

#### Exemplos Práticos de Formatação

**Antes:**
```javascript
const user={name:"John",age:30,email:"john@example.com",}

function greet(name){
return "Hello, "+name+"!"}

const numbers=[1,2,3,4,5]
```

**Depois (formatado pelo Prettier com a config acima):**
```javascript
const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
}

function greet(name) {
  return 'Hello, ' + name + '!'
}

const numbers = [1, 2, 3, 4, 5]
```

---

## Configuração no VSCode

Para que essas ferramentas funcionem automaticamente enquanto você desenvolve, configure o VSCode:

### 1. Instalar Extensões

- **ESLint** (dbaeumer.vscode-eslint)
- **Prettier** (esbenp.prettier-vscode)

### 2. Configurar settings.json

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "eslint.workingDirectories": [
    {
      "mode": "auto"
    }
  ],
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

**O que cada configuração faz:**
- `formatOnSave`: Formata o arquivo automaticamente ao salvar
- `source.fixAll.eslint`: Corrige automaticamente problemas do ESLint ao salvar
- `source.organizeImports`: Organiza os imports automaticamente
- `eslint.workingDirectories`: Permite que o ESLint funcione em monorepos
- `defaultFormatter`: Define o Prettier como formatador padrão

---

## Estrutura em Monorepo

Em projetos maiores (como o SaaS-CoreWise), é comum centralizar as configurações de estilização:

```
projeto/
├── config/
│   ├── eslint-config/
│   │   ├── package.json
│   │   ├── library.js      # Config para bibliotecas
│   │   ├── next.js         # Config para Next.js
│   │   └── node.js         # Config para Node.js
│   ├── prettier/
│   │   ├── package.json
│   │   └── index.mjs       # Config compartilhada
│   └── typescript-config/
│       └── ...
├── apps/
│   ├── web/
│   │   └── package.json    # Usa @saas/eslint-config
│   └── api/
│       └── package.json    # Usa @saas/eslint-config
└── packages/
    └── ...
```

### Vantagens dessa Estrutura

1. **Configuração Única**: Todas as aplicações usam as mesmas regras
2. **Manutenção Simples**: Atualiza em um lugar, aplica em todos
3. **Consistência Garantida**: Todo o código do projeto segue o mesmo padrão
4. **Reutilização**: Configs diferentes para diferentes tipos de projeto (Next.js, Node.js, etc.)

---

## Comandos Úteis

### Executar ESLint Manualmente

```bash
# Verificar problemas
npm run lint

# Corrigir problemas automaticamente
npm run lint --fix

# Verificar arquivo específico
npx eslint src/index.js
```

### Executar Prettier Manualmente

```bash
# Verificar formatação
npx prettier --check .

# Formatar todos os arquivos
npx prettier --write .

# Formatar arquivo específico
npx prettier --write src/index.js
```

---

## Integração com Git Hooks

Para garantir que código não formatado nunca chegue ao repositório, use **Husky** com **lint-staged**:

```json
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

Isso executará ESLint e Prettier automaticamente em arquivos modificados antes de cada commit.

---

## Boas Práticas

### 1. Configure Desde o Início
Adicione ESLint e Prettier no início do projeto, não depois de meses de desenvolvimento.

### 2. Seja Consistente com a Equipe
Discuta e documente as regras escolhidas. Use configurações compartilhadas.

### 3. Automatize Tudo
Configure formatação automática ao salvar. Ninguém deveria precisar pensar em formatação.

### 4. Use Configurações Prontas
Aproveite configs da comunidade (como @rocketseat/eslint-config, @vercel/style-guide, etc.).

### 5. Não Ignore Warnings Sem Motivo
Se o ESLint está reclamando, geralmente há um bom motivo. Entenda antes de desabilitar.

### 6. Documente Exceções
Se precisar desabilitar uma regra, explique o porquê:

```javascript
// eslint-disable-next-line no-console
console.log('Debug necessário nesta parte específica')
```

---

## Plugins Úteis

### Para ESLint

- **eslint-plugin-simple-import-sort**: Organiza imports automaticamente
- **eslint-plugin-import**: Valida imports/exports
- **eslint-plugin-jsx-a11y**: Regras de acessibilidade para React
- **eslint-plugin-react-hooks**: Valida regras dos hooks do React

### Para Prettier

- **prettier-plugin-tailwindcss**: Ordena classes do Tailwind CSS
- **prettier-plugin-organize-imports**: Organiza imports
- **prettier-plugin-sort-json**: Ordena arquivos JSON

---

## Resolução de Conflitos

Às vezes ESLint e Prettier podem entrar em conflito. Use:

```bash
npm install --save-dev eslint-config-prettier
```

Isso desabilita regras do ESLint que conflitam com o Prettier.

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    '@rocketseat/eslint-config/react',
    'prettier' // Deve ser o último
  ]
}
```

---

## Exemplo Completo: Configurando um Novo Projeto

### 1. Instalar Dependências

```bash
npm install --save-dev eslint prettier
npm install --save-dev eslint-config-prettier
npm install --save-dev @rocketseat/eslint-config
npm install --save-dev eslint-plugin-simple-import-sort
```

### 2. Criar Configurações

**eslint.config.js:**
```javascript
module.exports = {
  extends: ['@rocketseat/eslint-config/react', 'prettier'],
  plugins: ['simple-import-sort'],
  rules: {
    'simple-import-sort/imports': 'error',
  },
}
```

**prettier.config.mjs:**
```javascript
const config = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'always',
}

export default config
```

### 3. Adicionar Scripts ao package.json

```json
{
  "scripts": {
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

### 4. Criar .eslintignore e .prettierignore

```
node_modules
dist
build
.next
coverage
*.config.js
```

---

## Sincronização de Configurações do Editor

### O que é Settings Sync?

**Settings Sync** é uma funcionalidade do VS Code (e GitHub Codespaces) que permite sincronizar suas configurações, extensões, atalhos de teclado e snippets na nuvem. Isso garante que você tenha o mesmo ambiente de desenvolvimento em qualquer máquina ou Codespace.

### Por que Sincronizar Configurações?

1. **Consistência entre Máquinas**: Trabalhe em qualquer computador com as mesmas configurações
2. **Backup Automático**: Suas configurações ficam seguras na nuvem
3. **Onboarding Rápido**: Novos membros da equipe podem usar as mesmas configurações
4. **Codespaces**: Essencial para manter ambiente consistente em ambientes cloud
5. **Recuperação Rápida**: Reinstalou o sistema? Suas configs voltam em segundos

### Como Funciona no VS Code

O VS Code usa sua conta Microsoft ou GitHub para sincronizar:
- **Settings**: Todas as configurações do `settings.json`
- **Extensões**: Lista de extensões instaladas
- **Keybindings**: Atalhos de teclado personalizados
- **Snippets**: Trechos de código customizados
- **UI State**: Estado da interface (sidebar, painéis, etc.)

### Ativando o Settings Sync

#### Método 1: Interface Gráfica

1. Clique no ícone de engrenagem (⚙️) no canto inferior esquerdo
2. Selecione "Turn on Settings Sync..."
3. Escolha o que deseja sincronizar (marque todos por padrão)
4. Faça login com sua conta GitHub ou Microsoft
5. Pronto! Suas configurações estão sendo sincronizadas

#### Método 2: Atalho de Teclado

- **Windows/Linux**: `Ctrl + Shift + P` → "Settings Sync: Turn On"
- **macOS**: `Cmd + Shift + P` → "Settings Sync: Turn On"

### Configurações que Devem Ser Sincronizadas

Ao trabalhar com estilização de código, certifique-se de que estas configurações estejam ativas:

```json
{
  // Formatação automática
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,

  // ESLint
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },

  // Prettier
  "prettier.enable": true,
  "prettier.requireConfig": true,

  // Formatadores por linguagem
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  // ESLint working directories (para monorepos)
  "eslint.workingDirectories": [
    { "mode": "auto" }
  ]
}
```

### GitHub Codespaces e Settings Sync

Quando você cria um Codespace, ele automaticamente:
1. Puxa suas configurações sincronizadas do VS Code
2. Instala as extensões configuradas
3. Aplica seus atalhos de teclado
4. Restaura seus snippets

**Isso significa que seu ambiente de desenvolvimento é idêntico localmente e na nuvem!**

### Configurações Específicas por Projeto

Além das configurações pessoais sincronizadas, é importante ter configurações **do projeto** versionadas:

```
projeto/
├── .vscode/
│   ├── settings.json        # Configurações do projeto
│   ├── extensions.json      # Extensões recomendadas
│   └── launch.json          # Configurações de debug
├── .eslintrc.js             # Regras ESLint do projeto
├── .prettierrc.mjs          # Regras Prettier do projeto
└── .editorconfig            # Configurações de editor universais
```

#### Exemplo: .vscode/extensions.json

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma"
  ]
}
```

Quando alguém abre o projeto, o VS Code sugere instalar essas extensões automaticamente.

#### Exemplo: .vscode/settings.json (do projeto)

```json
{
  "eslint.workingDirectories": [
    { "mode": "auto" }
  ],
  "typescript.tsdk": "node_modules/typescript/lib",
  "editor.rulers": [80, 120],
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true
  }
}
```

### .editorconfig - Configurações Universais

O `.editorconfig` funciona em **qualquer editor** (VS Code, WebStorm, Sublime, etc.):

```ini
# .editorconfig
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.{js,jsx,ts,tsx,json}]
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false
```

### Diferença entre Sync Pessoal e Configs do Projeto

| Tipo | Sincronizado como? | Onde fica? | Para que serve? |
|------|-------------------|------------|-----------------|
| **Settings Sync** | Nuvem (GitHub/Microsoft) | Conta pessoal | Preferências pessoais (tema, fonte, atalhos) |
| **Configs do Projeto** | Git (versionadas) | Repositório `.vscode/` | Regras da equipe (linter, formatter) |
| **EditorConfig** | Git (versionadas) | Raiz do projeto | Configurações básicas universais |

### Boas Práticas

1. **Sincronize suas preferências pessoais** via Settings Sync
2. **Versione as configurações do projeto** no Git (`.vscode/`, `.eslintrc`, etc.)
3. **Use .editorconfig** para garantir compatibilidade entre editores
4. **Documente extensões obrigatórias** em `extensions.json`
5. **Não versione configurações pessoais** (como tema, font size)

---

## Organizando Issues com Tarefas no GitHub

### Dividindo Issues em Tarefas

Quando você tem uma Issue complexa (como configurar estilização de código em um projeto), é essencial dividi-la em tarefas menores e gerenciáveis.

#### Sintaxe de Task Lists no GitHub

```markdown
## Configurar Estilização de Código

- [ ] Instalar ESLint e Prettier
- [ ] Criar configuração do ESLint
- [ ] Criar configuração do Prettier
- [ ] Configurar VSCode (settings.json)
- [ ] Adicionar extensions.json
- [ ] Criar .editorconfig
- [ ] Configurar pre-commit hooks
- [ ] Documentar no README
```

### Como Criar Issues com Tarefas

#### Exemplo Prático de Issue

````markdown
# [SETUP] Configurar Padronização de Código

## Descrição
Configurar ESLint e Prettier no projeto para garantir qualidade e consistência do código.

## Objetivo
Ter formatação automática e validação de código funcionando para todos os desenvolvedores.

## Tarefas

### 1. Dependências
- [ ] Instalar `eslint` e `prettier`
- [ ] Instalar `@rocketseat/eslint-config`
- [ ] Instalar `eslint-plugin-simple-import-sort`
- [ ] Instalar `eslint-config-prettier`
- [ ] Instalar `prettier-plugin-tailwindcss`

### 2. Configuração
- [ ] Criar `eslint.config.js` na raiz
- [ ] Criar `prettier.config.mjs` na raiz
- [ ] Criar `.editorconfig`
- [ ] Criar `.vscode/settings.json`
- [ ] Criar `.vscode/extensions.json`

### 3. Scripts
- [ ] Adicionar script `lint` no package.json
- [ ] Adicionar script `lint:fix` no package.json
- [ ] Adicionar script `format` no package.json

### 4. Git Hooks
- [ ] Instalar `husky` e `lint-staged`
- [ ] Configurar pre-commit hook
- [ ] Testar hook antes de commit

### 5. Documentação
- [ ] Documentar setup no README
- [ ] Adicionar seção "Como Contribuir"
- [ ] Criar guia de troubleshooting

## Critérios de Aceitação
- ✅ Código formata automaticamente ao salvar no VS Code
- ✅ ESLint reporta erros no editor
- ✅ Commits são validados antes de serem criados
- ✅ Todos os desenvolvedores usam as mesmas extensões

## Milestone
Sprint 1 - Setup Inicial
````

### Trabalhando com a Primeira Tarefa

#### 1. Marcar Tarefa como "Em Progresso"

No GitHub, você pode converter task items em issues separadas:

1. Hover sobre a checkbox da tarefa
2. Clique em "Convert to issue"
3. Isso cria uma sub-issue linkada

#### 2. Exemplo: Completando a Primeira Tarefa

**Tarefa:** Instalar dependências

```bash
# 1. Instalar dependências principais
npm install --save-dev eslint prettier

# 2. Instalar configurações
npm install --save-dev @rocketseat/eslint-config

# 3. Instalar plugins
npm install --save-dev eslint-plugin-simple-import-sort
npm install --save-dev eslint-config-prettier

# 4. Instalar plugins do Prettier
npm install --save-dev prettier-plugin-tailwindcss
```

Após completar, marcar no GitHub:
```markdown
- [x] Instalar `eslint` e `prettier`
- [x] Instalar `@rocketseat/eslint-config`
- [x] Instalar `eslint-plugin-simple-import-sort`
- [x] Instalar `eslint-config-prettier`
- [x] Instalar `prettier-plugin-tailwindcss`
```

### Vinculando Issues a Milestones

#### Criando uma Milestone

1. Vá em **Issues** → **Milestones**
2. Clique em "New milestone"
3. Preencha:
   - **Title**: "Sprint 1 - Setup Inicial"
   - **Due date**: Data de conclusão
   - **Description**: Objetivos da milestone

#### Exemplo de Milestone

```markdown
# Sprint 1 - Setup Inicial

## Objetivo
Configurar ambiente de desenvolvimento e ferramentas de qualidade de código.

## Issues Incluídas
- #1 Configurar ESLint e Prettier
- #2 Configurar TypeScript
- #3 Setup CI/CD básico
- #4 Documentação inicial

## Meta
Concluir até: 30/11/2024
```

#### Atribuindo Issue à Milestone

1. Abra a issue
2. No painel direito, clique em "Milestone"
3. Selecione "Sprint 1 - Setup Inicial"

### Progresso Visual

O GitHub mostra automaticamente:
- Quantas tarefas foram completadas (ex: 5/10)
- Porcentagem de conclusão da issue
- Progresso da milestone

#### Exemplo de Progresso

```
Issue: #1 Configurar ESLint e Prettier
Progress: ████████░░ 80% (16/20 tasks completed)

Milestone: Sprint 1 - Setup Inicial
Progress: ███░░░░░░░ 30% (3/10 issues closed)
```

### Fechando a Primeira Tarefa com Commit

Quando você completa uma tarefa, pode fechá-la via commit:

```bash
git add .
git commit -m "feat: instalar dependências do ESLint e Prettier

- Instalado eslint e prettier
- Adicionado @rocketseat/eslint-config
- Configurado plugins necessários

Closes #1 (primeira tarefa da issue)
Refs #5 (issue principal)"
```

### Template de Issue com Tarefas

Crie `.github/ISSUE_TEMPLATE/setup-feature.md`:

````markdown
---
name: Setup/Configuração
about: Template para tarefas de configuração
title: '[SETUP] '
labels: setup, enhancement
assignees: ''
---

## Descrição
<!-- Descreva o que será configurado -->

## Objetivo
<!-- O que queremos alcançar com esta configuração? -->

## Tarefas

### Instalação
- [ ] Instalar dependências
- [ ] Configurar arquivos

### Configuração
- [ ] Criar configs
- [ ] Testar funcionamento

### Documentação
- [ ] Atualizar README
- [ ] Adicionar exemplos

## Critérios de Aceitação
- [ ] Tudo funciona localmente
- [ ] Tudo funciona no CI/CD
- [ ] Documentação está atualizada

## Milestone
<!-- Qual sprint/milestone? -->
````

### Automatizando com GitHub Actions

Você pode automatizar verificações quando tarefas são marcadas como completas:

```yaml
# .github/workflows/task-completed.yml
name: Check Task Completion

on:
  issues:
    types: [edited]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Check if all tasks completed
        run: |
          echo "Verificando se todas as tarefas foram concluídas..."
          # Script para verificar progresso
```

---

## Conclusão

Estilização e padronização de código não são apenas sobre estética. São sobre:
- **Colaboração eficiente** em equipe
- **Prevenção de bugs** antes que aconteçam
- **Manutenibilidade** do código a longo prazo
- **Profissionalismo** no desenvolvimento

Investir tempo em configurar essas ferramentas no início do projeto economiza horas de discussões sobre formatação e problemas de código posteriormente.

---

## Recursos Adicionais

- [Documentação oficial do ESLint](https://eslint.org/)
- [Documentação oficial do Prettier](https://prettier.io/)
- [Rocketseat ESLint Config](https://github.com/Rocketseat/eslint-config-rocketseat)
- [Awesome ESLint](https://github.com/dustinspecker/awesome-eslint)
- [Prettier Playground](https://prettier.io/playground/)
