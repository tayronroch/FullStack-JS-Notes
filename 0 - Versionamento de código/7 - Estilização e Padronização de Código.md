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
