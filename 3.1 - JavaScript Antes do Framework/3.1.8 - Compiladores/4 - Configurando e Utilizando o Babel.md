# 4 - Configurando e Utilizando o Babel

## Formas de configurar o Babel

O Babel aceita configuracao em diferentes formatos. Os mais comuns sao:

| Arquivo | Formato | Quando usar |
|---|---|---|
| `babel.config.json` | JSON | Projetos com monorepo ou quando a config deve valer para todo o projeto |
| `babel.config.js` | JavaScript | Quando precisa de logica dinamica na configuracao |
| `.babelrc` | JSON | Quando a config deve valer apenas para um subdiretorio especifico |
| `.babelrc.js` | JavaScript | Mesmo que `.babelrc`, com suporte a logica |

Para a maioria dos projetos, `babel.config.json` e a escolha mais simples e previsivel.

## Anatomia do arquivo de configuracao

```json
{
  "presets": [],
  "plugins": []
}
```

- **`presets`**: conjuntos de plugins pre-agrupados. Cobrem casos de uso amplos como transpilar ES moderno ou JSX.
- **`plugins`**: transformacoes individuais e especificas. Executam antes dos presets.

## Configurando o preset-env

O `@babel/preset-env` e o preset principal para transpilar JavaScript moderno. Ele aceita opcoes para controlar o alvo da transpilacao.

### Alvo por ambiente

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "node": "current"
      }
    }]
  ]
}
```

Util para scripts Node.js e testes. O Babel transpila apenas o que a versao atual do Node nao suporta nativamente.

### Alvo por navegadores

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": "> 0.5%, last 2 versions, not dead"
    }]
  ]
}
```

Essa query e interpretada pelo **Browserslist** — uma ferramenta que define quais navegadores devem ser suportados. O Babel consulta essa lista e transpila apenas o necessario.

### Opcao useBuiltIns

Controla como os polyfills sao injetados:

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": "> 0.5%, last 2 versions, not dead",
      "useBuiltIns": "usage",
      "corejs": 3
    }]
  ]
}
```

- **`"usage"`**: injeta automaticamente apenas os polyfills usados no codigo.
- **`"entry"`**: injeta todos os polyfills do alvo no ponto de entrada do projeto.
- **`false`** (padrao): nao injeta polyfills.

Para usar `useBuiltIns`, instale o `core-js`:

```bash
npm install core-js
```

## Configurando presets por ambiente

E possivel aplicar configuracoes diferentes para desenvolvimento e producao:

```json
{
  "presets": ["@babel/preset-env"],
  "env": {
    "development": {
      "plugins": ["@babel/plugin-transform-react-jsx-source"]
    },
    "production": {
      "plugins": ["transform-remove-console"]
    },
    "test": {
      "presets": [
        ["@babel/preset-env", { "targets": { "node": "current" } }]
      ]
    }
  }
}
```

O Babel usa a variavel de ambiente `NODE_ENV` para decidir qual bloco aplicar.

## Usando plugins

Plugins executam transformacoes especificas. Alguns exemplos uteis:

### plugin-transform-arrow-functions

Converte arrow functions em funcoes normais, mesmo quando o preset-env nao faria isso para o seu alvo:

```bash
npm install --save-dev @babel/plugin-transform-arrow-functions
```

```json
{
  "plugins": ["@babel/plugin-transform-arrow-functions"]
}
```

### plugin-proposal-optional-chaining (legado)

Em versoes mais antigas do Babel, recursos como optional chaining precisavam de plugin separado. No Babel 7.8+, o `preset-env` ja inclui tudo isso automaticamente.

### Ordem de execucao

- **Plugins** executam primeiro, da esquerda para a direita.
- **Presets** executam depois, da direita para a esquerda.

```json
{
  "plugins": ["pluginA", "pluginB"],
  "presets": ["presetA", "presetB"]
}
```

Ordem real: `pluginA` → `pluginB` → `presetB` → `presetA`.

## Exemplo completo: projeto com testes

Uma configuracao comum em projetos que usam Jest:

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": "> 0.5%, last 2 versions, not dead",
      "useBuiltIns": "usage",
      "corejs": 3
    }]
  ],
  "env": {
    "test": {
      "presets": [
        ["@babel/preset-env", { "targets": { "node": "current" } }]
      ]
    }
  }
}
```

Em producao, transpila para navegadores. Em testes, usa a versao atual do Node para nao transpilar o desnecessario e manter os testes rapidos.

## Verificando o que o Babel vai transpilar

Para inspecionar quais transformacoes o Babel aplicaria sem gerar arquivos:

```bash
npx babel src/index.js --out-file /dev/stdout
```

Ou use o **Babel REPL** online em [babeljs.io/repl](https://babeljs.io/repl) para testar trechos de codigo e ver o resultado em tempo real.

## Gerando o compilado na pasta dist

Com o projeto configurado, o fluxo para gerar o codigo compilado e simples.

### Estrutura esperada do projeto

```
meu-projeto/
├── src/
│   └── index.js
├── babel.config.json
└── package.json
```

### Compilando um arquivo unico

```bash
npx babel src/index.js --out-file dist/index.js
```

### Compilando uma pasta inteira

```bash
npx babel src --out-dir dist
```

O Babel vai replicar a estrutura de `src` dentro de `dist`, compilando cada arquivo.

### Assistindo mudancas em tempo real

Durante o desenvolvimento, use a flag `--watch` para recompilar automaticamente sempre que um arquivo for alterado:

```bash
npx babel src --out-dir dist --watch
```

### Gerando source maps

Para manter o vinculo entre o codigo gerado e o original (essencial para depuracao):

```bash
npx babel src --out-dir dist --source-maps
```

Isso gera um arquivo `.map` ao lado de cada arquivo compilado.

### Adicionando os scripts no package.json

```json
{
  "scripts": {
    "build": "babel src --out-dir dist",
    "build:watch": "babel src --out-dir dist --watch",
    "build:maps": "babel src --out-dir dist --source-maps"
  }
}
```

### Resultado esperado apos o build

```
meu-projeto/
├── dist/
│   └── index.js        (codigo compilado)
├── src/
│   └── index.js        (codigo original)
├── babel.config.json
└── package.json
```

Se o `src` tiver subdiretorios, o `dist` vai replicar a mesma arvore:

```
src/
├── index.js
├── utils/
│   └── format.js
└── services/
    └── api.js

dist/
├── index.js
├── utils/
│   └── format.js
└── services/
    └── api.js
```

### Dica: ignorar o dist no git

Adicione ao `.gitignore` para nao versionar o codigo gerado:

```
dist/
```

O codigo-fonte em `src` e o que deve ser versionado. O `dist` e sempre gerado a partir dele.

## Ignorando arquivos

Para excluir arquivos ou pastas da compilacao, use a opcao `ignore`:

```json
{
  "ignore": ["node_modules", "dist"]
}
```

## Resumo

O arquivo `babel.config.json` e o centro da configuracao do Babel. Presets cobrem casos amplos e plugins cobrem transformacoes especificas. O `@babel/preset-env` com `targets` e a forma mais pratica de garantir compatibilidade sem transpilar o que ja e suportado. Configuracoes por ambiente (`env`) permitem comportamentos diferentes entre desenvolvimento, producao e testes — sem precisar de multiplos arquivos de configuracao.
