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

## Configurar o Prettier - Estratégia Profissional

### Por que uma Estratégia Madura é Necessária?

O Prettier é **simples de configurar**, e isso é ótimo! Porém, essa simplicidade pode criar **brechas** em projetos profissionais se não for configurado adequadamente. Vejamos os principais problemas:

#### Problemas Comuns (Brechas)

1. **Falta de arquivo de configuração**: Prettier usa padrões que podem não ser os da equipe
2. **Conflito com ESLint**: Regras de formatação brigando entre si
3. **Inconsistência entre desenvolvedores**: Alguns formatam, outros não
4. **Código não formatado no repositório**: Commits sem passar pelo Prettier
5. **Configurações locais sobrescrevendo as do projeto**: Cada dev com config diferente

### Estratégia Completa de 5 Camadas

Para garantir 100% de formatação consistente, implemente estas 5 camadas de defesa:

```
┌─────────────────────────────────────────┐
│  Camada 5: CI/CD (Verificação Final)   │  ← Última linha de defesa
├─────────────────────────────────────────┤
│  Camada 4: Pre-commit Hook (Git)       │  ← Antes de commitar
├─────────────────────────────────────────┤
│  Camada 3: Pre-save Hook (Editor)      │  ← Ao salvar arquivo
├─────────────────────────────────────────┤
│  Camada 2: Configuração do Projeto     │  ← Regras da equipe
├─────────────────────────────────────────┤
│  Camada 1: EditorConfig                │  ← Base fundamental
└─────────────────────────────────────────┘
```

### Camada 1: Criar Arquivo de Configuração

#### Por que criar o arquivo?

Mesmo que você use as configurações padrão do Prettier, **sempre crie o arquivo**. Isso:
- Torna explícitas as regras do projeto
- Evita que desenvolvedores usem configs pessoais diferentes
- Serve como documentação
- Permite evolução futura

#### Opções de Nome do Arquivo

O Prettier aceita vários formatos:

```bash
# Opção 1: JavaScript Module (RECOMENDADO)
prettier.config.mjs

# Opção 2: CommonJS
prettier.config.js
.prettierrc.js

# Opção 3: JSON
.prettierrc
.prettierrc.json

# Opção 4: YAML
.prettierrc.yaml
.prettierrc.yml

# Opção 5: Package.json
# (adiciona chave "prettier" no package.json)
```

**Recomendação:** Use `prettier.config.mjs` para projetos modernos com ESM.

#### Configuração Básica mas Completa

```javascript
// prettier.config.mjs
/** @typedef {import('prettier').Config} PrettierConfig */

/** @type {PrettierConfig} */
const config = {
  // Largura máxima da linha
  printWidth: 80,

  // Tamanho da tabulação
  tabWidth: 2,

  // Usar espaços ao invés de tabs
  useTabs: false,

  // Não adicionar ponto e vírgula no final
  semi: false,

  // Usar aspas simples ao invés de duplas
  singleQuote: true,

  // Aspas em propriedades de objetos apenas quando necessário
  quoteProps: 'as-needed',

  // Usar aspas duplas no JSX
  jsxSingleQuote: false,

  // Vírgula no final: 'none', 'es5', 'all'
  trailingComma: 'es5',

  // Espaço dentro de chaves: { foo: bar }
  bracketSpacing: true,

  // Tag de fechamento JSX na mesma linha ou próxima
  bracketSameLine: false,

  // Parênteses em arrow functions: 'avoid', 'always'
  arrowParens: 'always',

  // Quebra de linha: 'lf', 'crlf', 'cr', 'auto'
  endOfLine: 'lf',

  // Plugins adicionais (opcional)
  plugins: [],
}

export default config
```

### Camada 2: Garantir que Prettier Exige Configuração

Para **forçar** que o Prettier só funcione se houver arquivo de configuração:

```json
// .vscode/settings.json
{
  "prettier.requireConfig": true
}
```

**O que isso faz:**
- Se não existir arquivo `.prettierrc` ou `prettier.config.*`, Prettier **não formata**
- Evita usar configurações padrão não documentadas
- Garante que todos usem a mesma config

### Camada 3: Integração com ESLint (Evitando Conflitos)

#### O Problema

ESLint e Prettier podem ter regras conflitantes:

```javascript
// ESLint pode querer ponto e vírgula
const x = 1;

// Prettier pode querer sem ponto e vírgula
const x = 1
```

#### A Solução: eslint-config-prettier

Instale o pacote que **desabilita regras do ESLint que conflitam com Prettier**:

```bash
npm install --save-dev eslint-config-prettier
```

#### Configure o ESLint

```javascript
// eslint.config.js ou .eslintrc.js
module.exports = {
  extends: [
    '@rocketseat/eslint-config/react',
    'prettier' // ⚠️ SEMPRE DEVE SER O ÚLTIMO!
  ],
  plugins: ['simple-import-sort'],
  rules: {
    'simple-import-sort/imports': 'error',
  },
}
```

**Importante:** `'prettier'` deve ser o **último item** em `extends` para sobrescrever outras configs.

### Camada 4: Arquivos .prettierignore

Assim como `.gitignore`, o `.prettierignore` define quais arquivos **não devem ser formatados**:

```
# .prettierignore

# Dependências
node_modules
package-lock.json
pnpm-lock.yaml
yarn.lock

# Build outputs
dist
build
.next
out
coverage

# Arquivos gerados
*.min.js
*.bundle.js

# Configurações que não devem ser formatadas
.env
.env.*

# Markdown pode ter formatação específica (opcional)
*.md

# Arquivos de cache
.cache
.turbo
```

**Por que isso é importante?**
- Evita formatação desnecessária de arquivos grandes (locks)
- Não quebra arquivos gerados por ferramentas
- Melhora performance

### Camada 5: Plugins do Prettier

O Prettier suporta plugins para formatação específica:

#### Plugin para TailwindCSS

Ordena automaticamente classes do Tailwind na ordem recomendada:

```bash
npm install --save-dev prettier-plugin-tailwindcss
```

```javascript
// prettier.config.mjs
const config = {
  // ... outras configs
  plugins: ['prettier-plugin-tailwindcss'],
}

export default config
```

**Antes:**
```jsx
<div className="text-white p-4 bg-blue-500 font-bold">
```

**Depois (ordenado automaticamente):**
```jsx
<div className="bg-blue-500 p-4 font-bold text-white">
```

#### Outros Plugins Úteis

```bash
# Para organizar imports (alternativa ao ESLint plugin)
npm install --save-dev @trivago/prettier-plugin-sort-imports

# Para formatar package.json
npm install --save-dev prettier-plugin-packagejson

# Para formatar SQL
npm install --save-dev prettier-plugin-sql
```

### Configurações Críticas Explicadas

#### printWidth: 80 vs 120

```javascript
printWidth: 80  // Padrão Prettier (mais conservador)
printWidth: 120 // Comum em projetos modernos
```

**Recomendação:** Use 80 para:
- Melhor legibilidade
- Facilita code reviews lado a lado
- Funciona bem em laptops menores

Use 120 se:
- Equipe prefere linhas mais longas
- Monitores ultrawide
- Menos quebras de linha

#### semi: true vs false

```javascript
semi: false  // const x = 1
semi: true   // const x = 1;
```

**Recomendação:**
- `false` para projetos modernos (mais limpo)
- `true` para projetos legados ou equipes acostumadas com Java/C#

#### singleQuote: true vs false

```javascript
singleQuote: true   // const name = 'John'
singleQuote: false  // const name = "John"
```

**Recomendação:**
- `true` para JavaScript/TypeScript (padrão da comunidade)
- `false` se equipe vem de outras linguagens

#### trailingComma: 'es5' vs 'all' vs 'none'

```javascript
// es5: vírgula apenas onde ES5 permite
const obj = {
  a: 1,
  b: 2,  // ✅ vírgula
}

// all: vírgula em todos os lugares possíveis
const func = (
  arg1,
  arg2,  // ✅ vírgula (não era permitido antes do ES6)
) => {}

// none: sem vírgulas finais
const obj = {
  a: 1,
  b: 2  // ❌ sem vírgula
}
```

**Recomendação:** Use `'es5'` para:
- Compatibilidade com navegadores antigos
- Diffs mais limpos no Git
- Equilíbrio entre legibilidade e compatibilidade

### Verificando se Tudo Está Funcionando

#### 1. Teste Manual

Crie um arquivo de teste mal formatado:

```javascript
// test-prettier.js
const   x={a:1,b:2,c:3}
function    teste(   ){
return      "hello"
}
```

Execute:
```bash
npx prettier test-prettier.js
```

Deve retornar o código formatado.

#### 2. Verificar Arquivos Não Formatados

```bash
# Verificar se há arquivos não formatados
npx prettier --check .

# Se encontrar arquivos, exibe quais
npx prettier --check "src/**/*.{js,jsx,ts,tsx}"
```

#### 3. Formatar Todos os Arquivos

```bash
# Formata tudo de uma vez
npx prettier --write .

# Formatar apenas alguns tipos
npx prettier --write "src/**/*.{js,jsx,ts,tsx,json}"
```

### Scripts Recomendados no package.json

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "validate": "npm run format:check && npm run lint"
  }
}
```

**Como usar:**
```bash
# Formatar tudo
npm run format

# Verificar se está tudo formatado (CI/CD)
npm run format:check

# Validar formatação + lint (antes de PR)
npm run validate
```

### Configuração Completa - Exemplo Real

```javascript
// prettier.config.mjs
/** @typedef {import('prettier').Config} PrettierConfig */
/** @typedef {import('prettier-plugin-tailwindcss').PluginOptions} TailwindConfig */

/** @type {PrettierConfig | TailwindConfig} */
const config = {
  // Core formatting
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',

  // Line endings (importante para Windows/Linux/Mac)
  endOfLine: 'lf',

  // Plugins
  plugins: ['prettier-plugin-tailwindcss'],

  // Overrides para arquivos específicos
  overrides: [
    {
      files: '*.md',
      options: {
        printWidth: 100,
        proseWrap: 'always',
      },
    },
    {
      files: '*.json',
      options: {
        printWidth: 120,
      },
    },
  ],
}

export default config
```

### Overrides: Configurações por Tipo de Arquivo

Você pode ter regras diferentes para arquivos diferentes:

```javascript
overrides: [
  {
    files: '*.md',
    options: {
      printWidth: 100,
      proseWrap: 'always', // Quebra texto em markdown
    },
  },
  {
    files: ['*.json', '.prettierrc'],
    options: {
      printWidth: 120,
      tabWidth: 2,
    },
  },
  {
    files: '*.css',
    options: {
      singleQuote: false, // CSS usa aspas duplas
    },
  },
]
```

### Debugging: Quando o Prettier Não Funciona

#### Problema 1: Prettier não formata ao salvar

**Soluções:**
1. Verifique se a extensão está instalada: `Prettier - Code formatter`
2. Verifique se é o formatter padrão:
   ```json
   {
     "[javascript]": {
       "editor.defaultFormatter": "esbenp.prettier-vscode"
     }
   }
   ```
3. Verifique se `editor.formatOnSave` está `true`

#### Problema 2: Configuração sendo ignorada

**Soluções:**
1. Reinicie o VS Code
2. Verifique se o arquivo de config está na raiz do projeto
3. Verifique o nome do arquivo (`.prettierrc`, `prettier.config.mjs`, etc.)
4. Veja os logs: `Output` → `Prettier`

#### Problema 3: Conflito ESLint vs Prettier

**Solução:**
```bash
npm install --save-dev eslint-config-prettier
```

E garanta que `'prettier'` seja o último em `extends`.

#### Problema 4: Alguns arquivos não são formatados

**Soluções:**
1. Verifique o `.prettierignore`
2. Verifique se o tipo de arquivo é suportado
3. Force formatação: `npx prettier --write arquivo.js`

### Estratégia para Projetos Existentes

Se você está adicionando Prettier em um projeto que já existe:

#### Passo 1: Crie um Branch Separado

```bash
git checkout -b feat/add-prettier
```

#### Passo 2: Configure Prettier

1. Instale dependências
2. Crie `prettier.config.mjs`
3. Crie `.prettierignore`

#### Passo 3: Formate Tudo de Uma Vez

```bash
npx prettier --write .
```

#### Passo 4: Commit Separado

```bash
git add .
git commit -m 'chore: formata todo código com `prettier`

Este commit apenas formata o código existente.
Nenhuma lógica foi alterada.

- Adiciona `prettier.config.mjs`
- Adiciona `.prettierignore`
- Formata todos os arquivos do projeto'
```

#### Passo 5: Merge e Comunique a Equipe

Avise a equipe para:
1. Fazer pull da branch
2. Instalar extensão do Prettier
3. Configurar `formatOnSave`

### Prettier em Monorepos

Para projetos com múltiplos pacotes:

```
projeto/
├── prettier.config.mjs        # Config raiz (padrão global)
├── apps/
│   ├── web/
│   │   └── prettier.config.mjs   # Override para web (opcional)
│   └── api/
│       └── prettier.config.mjs   # Override para api (opcional)
└── packages/
    └── ui/
        └── prettier.config.mjs    # Override para UI (opcional)
```

**Ou**, centralize em um pacote compartilhado:

```javascript
// packages/prettier-config/index.mjs
export default {
  printWidth: 80,
  semi: false,
  // ... config compartilhada
}
```

```javascript
// apps/web/prettier.config.mjs
import baseConfig from '@org/prettier-config'

export default {
  ...baseConfig,
  // Overrides específicos se necessário
}
```

### Checklist: Configuração Profissional do Prettier

- [ ] Prettier instalado (`npm install --save-dev prettier`)
- [ ] Arquivo de config criado (`prettier.config.mjs`)
- [ ] `.prettierignore` configurado
- [ ] `eslint-config-prettier` instalado e configurado
- [ ] VS Code configurado (`formatOnSave: true`)
- [ ] `prettier.requireConfig: true` no settings.json
- [ ] Scripts no package.json (`format`, `format:check`)
- [ ] Pre-commit hook configurado (próxima seção)
- [ ] CI/CD verificando formatação
- [ ] Documentação no README sobre formatação
- [ ] Equipe alinhada e extensões instaladas

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

## Mensagens de Commit: Aspas Duplas vs Aspas Simples

### A Diferença Entre Aspas no Terminal

Ao escrever mensagens de commit no terminal, você pode usar tanto **aspas duplas** (`"`) quanto **aspas simples** (`'`). Porém, existe uma diferença importante que pode afetar a renderização no GitHub e o comportamento do terminal.

### Regra Geral

```bash
# Ambas funcionam da mesma forma
git commit -m "adiciona arquivo de configuração"
git commit -m 'adiciona arquivo de configuração'
```

As duas opções acima terão o **mesmo efeito** na maioria dos casos.

### Quando Usar Aspas Simples

**Use aspas simples (`'`) quando quiser destacar palavras especiais** no GitHub, como:
- Nomes de funções
- Nomes de arquivos
- Nomes de variáveis
- Comandos específicos

#### Sintaxe para Destaque

Para destacar uma palavra no GitHub, use **acentos graves** (`` ` ``) dentro das aspas simples:

```bash
git commit -m 'adiciona arquivo `.editorconfig`'
```

#### Como é Renderizado no GitHub

A mensagem acima será renderizada no histórico de commits assim:

```
adiciona arquivo `.editorconfig`
```

O arquivo `.editorconfig` aparece destacado (geralmente em uma fonte monoespaçada e com fundo diferente).

### Por Que Não Usar Aspas Duplas para Destaque?

#### O Problema: Command Substitution

Quando você usa **aspas duplas** com **acentos graves**, você ativa um recurso do terminal chamado **command substitution** (substituição de comando).

```bash
# ⚠️ PROBLEMA: Isso tentará executar um comando!
git commit -m "adiciona arquivo `.editorconfig`"
```

#### O Que Acontece?

O terminal interpreta o que está entre acentos graves como um **comando a ser executado**:

```bash
# O terminal tenta:
1. Executar o comando: .editorconfig
2. Pegar o resultado da execução
3. Inserir o resultado na mensagem de commit
```

#### Exemplo do Problema

```bash
# Você escreve:
git commit -m "executa comando `date`"

# O terminal interpreta como:
# 1. Execute o comando 'date' (que retorna a data atual)
# 2. Substitua `date` pelo resultado

# Resultado final:
git commit -m "executa comando Seg Nov 18 14:30:00 2024"
```

### Exemplos Práticos

#### ✅ Correto - Usando Aspas Simples

```bash
# Destacando nome de arquivo
git commit -m 'cria arquivo `.prettierrc.mjs`'

# Destacando função
git commit -m 'refatora função `calculateTotal()`'

# Destacando variável
git commit -m 'corrige bug na variável `userName`'

# Destacando comando
git commit -m 'adiciona script `npm run lint`'

# Múltiplos destaques
git commit -m 'move função `getData()` para arquivo `utils.js`'
```

#### ❌ Incorreto - Usando Aspas Duplas com Acentos Graves

```bash
# Tentará executar o comando '.prettierrc.mjs'
git commit -m "cria arquivo `.prettierrc.mjs`"

# Tentará executar o comando 'calculateTotal()'
git commit -m "refatora função `calculateTotal()`"
```

### Renderização no GitHub

#### Com Aspas Simples e Acentos Graves

```bash
git commit -m 'adiciona configuração do `ESLint` e `Prettier`'
```

**Renderizado no GitHub:**
> adiciona configuração do `ESLint` e `Prettier`

Os termos `ESLint` e `Prettier` aparecem destacados.

#### Sem Acentos Graves

```bash
git commit -m 'adiciona configuração do ESLint e Prettier'
```

**Renderizado no GitHub:**
> adiciona configuração do ESLint e Prettier

Texto normal, sem destaques.

### Boas Práticas para Mensagens de Commit

#### 1. Use Aspas Simples por Padrão

```bash
# Sempre prefira aspas simples
git commit -m 'feat: adiciona validação de email'
```

#### 2. Destaque Elementos Técnicos

```bash
# Destaque arquivos, funções, variáveis
git commit -m 'fix: corrige bug no método `validateUser()`'
git commit -m 'docs: atualiza README com instruções do `.env`'
```

#### 3. Siga o Padrão Conventional Commits

```bash
# Tipo: descrição curta
git commit -m 'feat: adiciona autenticação JWT'
git commit -m 'fix: corrige erro no `login.js`'
git commit -m 'docs: atualiza seção de configuração'
git commit -m 'style: formata código com `prettier`'
git commit -m 'refactor: reorganiza estrutura de pastas'
git commit -m 'test: adiciona testes para `UserService`'
git commit -m 'chore: atualiza dependências'
```

#### 4. Mensagens Mais Longas

Para mensagens mais longas com corpo e rodapé:

```bash
git commit -m 'feat: adiciona sistema de autenticação

Implementa JWT para autenticação de usuários.

- Adiciona middleware `authMiddleware.js`
- Cria service `AuthService`
- Adiciona rotas em `auth.routes.js`

Closes #123'
```

### Resumo Rápido

| Situação | Use | Exemplo |
|----------|-----|---------|
| Mensagem simples | Aspas simples | `git commit -m 'adiciona feature'` |
| Destacar elementos técnicos | Aspas simples + acentos graves | `git commit -m 'corrige bug no` `auth.js`'` |
| Mensagem com aspóstrofo | Aspas duplas | `git commit -m "don't use deprecated API"` |
| Evitar command substitution | Aspas simples | Sempre use `'` com `` ` `` |

### Atalho para Mensagens Rápidas

Muitos desenvolvedores criam aliases para commits frequentes:

```bash
# No arquivo .bashrc ou .zshrc
alias gc='git commit -m'
alias gca='git commit --amend --no-edit'
```

Uso:
```bash
gc 'fix: corrige validação no `form.js`'
```

### Escapando Caracteres Especiais

Se sua mensagem contiver aspas simples dentro das aspas simples:

```bash
# Problema: aspas simples dentro de aspas simples
git commit -m 'it's a fix'  # ❌ Erro de sintaxe

# Solução 1: Use aspas duplas
git commit -m "it's a fix"  # ✅

# Solução 2: Escape a aspas simples
git commit -m 'it'\''s a fix'  # ✅ (mais complicado)
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

#### O que é o EditorConfig?

O **EditorConfig** é um configurador de editor que define regras **fundamentais** de como seu editor deve se comportar. Essas configurações são aplicadas em **qualquer editor** que suporte EditorConfig (VS Code, WebStorm, Sublime Text, Vim, etc.).

#### Por que usar EditorConfig?

1. **Universal**: Funciona em todos os editores populares
2. **Básico e Fundamental**: Define regras essenciais de formatação
3. **Aplica ANTES de salvar**: As regras são aplicadas automaticamente enquanto você digita
4. **Independente**: Não depende de extensões específicas
5. **Consistência da Equipe**: Garante que todos sigam as mesmas regras, independente do editor usado

#### Diferença Importante: EditorConfig vs Prettier

| Característica | EditorConfig | Prettier |
|---------------|--------------|----------|
| **Quando age** | ANTES de salvar (em tempo real) | AO salvar o arquivo |
| **O que faz** | Regras básicas (indentação, charset) | Formatação completa do código |
| **Compatibilidade** | Todos os editores | Precisa de plugin/extensão |
| **Complexidade** | Configurações simples | Configurações avançadas |

**Fluxo de trabalho:**
1. Você digita o código → EditorConfig aplica regras básicas em tempo real
2. Você salva o arquivo → Prettier formata completamente o código
3. Antes do commit → ESLint valida e corrige problemas

#### Exemplo de .editorconfig

```ini
# .editorconfig
root = true

# Configurações para TODOS os arquivos
[*]
charset = utf-8                    # Codificação de caracteres
end_of_line = lf                   # Tipo de quebra de linha (Unix)
insert_final_newline = true        # Adiciona linha vazia no final do arquivo
trim_trailing_whitespace = true    # Remove espaços em branco no final das linhas

# Configurações específicas para arquivos JavaScript/TypeScript/JSON
[*.{js,jsx,ts,tsx,json}]
indent_style = space               # Usar espaços (não tabs)
indent_size = 2                    # Indentação de 2 espaços

# Configurações para arquivos Python
[*.py]
indent_style = space
indent_size = 4                    # Python usa 4 espaços por convenção

# Configurações para Markdown
[*.md]
trim_trailing_whitespace = false   # Manter espaços em branco (necessário para quebras de linha)

# Configurações para arquivos YAML
[*.{yml,yaml}]
indent_style = space
indent_size = 2
```

#### Principais Configurações

##### 1. indent_style

Define se a indentação usará **espaços** ou **tabs**:

```ini
indent_style = space   # Recomendado para JavaScript/TypeScript
indent_style = tab     # Comum em Go, Makefile
```

**Por que espaços?**
- Renderização consistente em todos os editores
- Evita problemas de visualização
- Padrão da comunidade JavaScript

##### 2. indent_size

Define a **largura da indentação**:

```ini
indent_size = 2   # JavaScript, TypeScript, JSON (mais compacto)
indent_size = 4   # Python, Java (mais legível)
```

**Exemplo prático:**

Com `indent_size = 2`:
```javascript
function exemplo() {
··return 'dois espaços'
}
```

Com `indent_size = 4`:
```javascript
function exemplo() {
····return 'quatro espaços'
}
```

##### 3. end_of_line

Define o tipo de quebra de linha:

```ini
end_of_line = lf      # Unix/Linux/macOS (\n) - RECOMENDADO
end_of_line = crlf    # Windows (\r\n)
end_of_line = cr      # Mac antigo (\r) - obsoleto
```

**Melhor prática:** Use sempre `lf` para evitar problemas entre sistemas operacionais.

##### 4. charset

Define a codificação de caracteres:

```ini
charset = utf-8       # Padrão moderno (suporta todos os caracteres)
charset = latin1      # Antigo (evite usar)
```

##### 5. trim_trailing_whitespace

Remove espaços em branco no final das linhas:

```ini
trim_trailing_whitespace = true   # Remove espaços desnecessários
trim_trailing_whitespace = false  # Mantém espaços (útil para Markdown)
```

##### 6. insert_final_newline

Adiciona uma linha vazia no final do arquivo:

```ini
insert_final_newline = true   # Boa prática (padrão POSIX)
```

#### Como Instalar o Suporte ao EditorConfig

##### No VS Code

1. Instale a extensão **EditorConfig for VS Code**
2. Ou pelo terminal:
```bash
code --install-extension EditorConfig.EditorConfig
```

##### Em Outros Editores

- **WebStorm/IntelliJ**: Suporte nativo (já vem instalado)
- **Sublime Text**: Instale via Package Control
- **Vim**: Instale o plugin `editorconfig-vim`

#### EditorConfig em Ação

**Antes de criar o .editorconfig:**
```javascript
function teste(){
→→→→return "usando tabs" // 4 tabs
}
```

**Depois de criar o .editorconfig com `indent_style = space` e `indent_size = 2`:**
```javascript
function teste() {
··return 'usando espaços' // 2 espaços
}
```

O próprio editor já corrige automaticamente enquanto você digita!

#### Exemplo Completo para Projeto Full Stack

```ini
# .editorconfig
root = true

# Padrões para todos os arquivos
[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

# JavaScript, TypeScript, JSX, TSX, JSON
[*.{js,mjs,cjs,jsx,ts,tsx,json}]
indent_style = space
indent_size = 2

# CSS, SCSS, Less
[*.{css,scss,less}]
indent_style = space
indent_size = 2

# HTML, Vue
[*.{html,vue}]
indent_style = space
indent_size = 2

# Markdown
[*.md]
trim_trailing_whitespace = false
indent_size = 2

# YAML (arquivos de config)
[*.{yml,yaml}]
indent_style = space
indent_size = 2

# Package.json (sempre 2 espaços)
[package.json]
indent_style = space
indent_size = 2

# Arquivos de configuração diversos
[*.{config.js,rc}]
indent_style = space
indent_size = 2
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
