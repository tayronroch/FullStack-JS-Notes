# 6 - Como Incluir o Babel

## Por que integrar o Babel ao Webpack

O Webpack empacota modulos, mas nao transpila JavaScript por padrao. Se o projeto usa sintaxe moderna (ES2015+), JSX ou TypeScript, o Webpack precisa do Babel para transformar o codigo antes de empacota-lo.

A integracao e feita via `babel-loader` — um loader que conecta o Webpack ao Babel dentro do pipeline de build.

## Instalando as dependencias

```bash
npm install --save-dev babel-loader @babel/core @babel/preset-env
```

- **`babel-loader`**: conecta o Webpack ao Babel.
- **`@babel/core`**: o motor do Babel.
- **`@babel/preset-env`**: transpila JavaScript moderno para o alvo configurado.

## Configurando o babel-loader no Webpack

No `webpack.config.js`, adicione a regra para arquivos `.js`:

```js
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
      },
    },
  ],
}
```

O `exclude: /node_modules/` e essencial — sem ele, o Webpack tentaria transpilar todas as dependencias instaladas, tornando o build extremamente lento.

## Configurando o Babel

O `babel-loader` usa o arquivo de configuracao do Babel automaticamente. Crie o `babel.config.json` na raiz do projeto:

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "browsers": "> 0.5%, last 2 versions, not dead"
      }
    }]
  ]
}
```

Ou passe as opcoes diretamente no loader, sem precisar de um arquivo separado:

```js
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: [
        ['@babel/preset-env', { targets: '> 0.5%, last 2 versions, not dead' }]
      ],
    },
  },
}
```

Para projetos simples, passar as opcoes no loader e suficiente. Para projetos maiores, o `babel.config.json` e mais facil de manter.

## Exemplo completo

### Estrutura do projeto

```
meu-projeto/
├── src/
│   ├── index.js
│   └── utils.js
├── index.html
├── babel.config.json
├── webpack.config.js
└── package.json
```

### src/utils.js

```js
export const somar = (a, b) => a + b
export const dobrar = (n) => n * 2
```

### src/index.js

```js
import { somar, dobrar } from './utils.js'

const app = document.getElementById('app')
app.textContent = `Soma: ${somar(2, 3)} | Dobro: ${dobrar(4)}`
```

### babel.config.json

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": "> 0.5%, last 2 versions, not dead"
    }]
  ]
}
```

### webpack.config.js

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './index.html' }),
  ],
}
```

Rode o build:

```bash
npm run build:dev
```

O Webpack processa cada `.js` com o Babel antes de empacotar — arrow functions, template literals e `import`/`export` sao todos transpilados conforme o target definido.

## Adicionando suporte a JSX

Para projetos React, instale o preset de JSX:

```bash
npm install --save-dev @babel/preset-react
```

Adicione ao `babel.config.json`:

```json
{
  "presets": [
    ["@babel/preset-env", { "targets": "> 0.5%, last 2 versions, not dead" }],
    "@babel/preset-react"
  ]
}
```

Atualize a regra no Webpack para incluir arquivos `.jsx`:

```js
{
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: { loader: 'babel-loader' },
}
```

## Adicionando suporte a TypeScript

Para TypeScript, instale o preset correspondente:

```bash
npm install --save-dev @babel/preset-typescript
```

Adicione ao `babel.config.json`:

```json
{
  "presets": [
    ["@babel/preset-env", { "targets": "> 0.5%, last 2 versions, not dead" }],
    "@babel/preset-typescript"
  ]
}
```

Atualize a regra para incluir `.ts` e `.tsx`:

```js
{
  test: /\.(js|jsx|ts|tsx)$/,
  exclude: /node_modules/,
  use: { loader: 'babel-loader' },
}
```

O Babel remove as anotacoes de tipo e transpila o codigo. Para verificacao de tipos, use o `tsc` separadamente:

```json
{
  "scripts": {
    "build": "webpack --mode production",
    "typecheck": "tsc --noEmit"
  }
}
```

## Cache do babel-loader

Em projetos grandes, o `babel-loader` pode ser lento pois processa cada arquivo individualmente. Ative o cache para acelerar builds subsequentes:

```js
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
    },
  },
}
```

O resultado de cada arquivo transpilado e salvo em cache. Nos proximos builds, apenas os arquivos alterados sao reprocessados.

## Resumo

Integrar o Babel ao Webpack exige instalar `babel-loader`, `@babel/core` e um preset, adicionar a regra no `webpack.config.js` e criar o `babel.config.json`. O `exclude: /node_modules/` e o `cacheDirectory: true` sao essenciais para manter o build rapido. A partir dai, o pipeline completo esta montado: Babel transpila, Webpack empacota.
