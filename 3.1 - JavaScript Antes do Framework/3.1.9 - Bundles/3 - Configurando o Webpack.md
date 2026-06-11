# 3 - Configurando o Webpack

## Por que configurar

O Webpack funciona sem configuracao para casos simples, mas qualquer projeto real precisa customizar ao menos o ponto de entrada, a saida ou o modo. O arquivo `webpack.config.js` e onde essa configuracao vive.

## Criando o arquivo de configuracao

Crie `webpack.config.js` na raiz do projeto:

```js
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
}
```

Com esse arquivo, rodar `npx webpack` ja usa a configuracao definida — sem precisar passar flags no terminal.

## Entry

Define o ponto de entrada — o arquivo a partir do qual o Webpack vai resolver o grafo de dependencias.

### Entrada unica

```js
entry: './src/index.js'
```

### Multiplas entradas

Util quando o projeto tem mais de uma pagina ou contexto independente:

```js
entry: {
  main: './src/index.js',
  admin: './src/admin.js',
}
```

Cada entrada gera um bundle separado na saida.

## Output

Define onde e como os bundles gerados serao gravados.

```js
output: {
  filename: 'bundle.js',
  path: path.resolve(__dirname, 'dist'),
}
```

- **`filename`**: nome do arquivo gerado.
- **`path`**: caminho absoluto da pasta de saida. O `path.resolve` garante que funcione em qualquer sistema operacional.

### Saida dinamica para multiplas entradas

Quando ha multiplas entradas, use `[name]` para gerar nomes unicos:

```js
output: {
  filename: '[name].bundle.js',
  path: path.resolve(__dirname, 'dist'),
}
```

Resultado: `main.bundle.js` e `admin.bundle.js`.

## Mode

Define o nivel de otimizacao aplicado ao bundle.

```js
mode: 'development' // ou 'production' ou 'none'
```

| Mode | O que faz |
|---|---|
| `development` | Codigo legivel, source maps, sem minificacao |
| `production` | Minificacao, tree shaking, otimizacao de performance |
| `none` | Sem otimizacao nenhuma |

## Loaders

Por padrao, o Webpack so entende JavaScript e JSON. Para processar outros tipos de arquivo (CSS, imagens, TypeScript), sao necessarios **loaders**.

Um loader e configurado na secao `module.rules`:

```js
module: {
  rules: [
    {
      test: /\.js$/,         // padrao de arquivo que o loader vai processar
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',  // loader a ser usado
      },
    },
  ],
}
```

### Exemplo: integrando o Babel ao Webpack

Instale o `babel-loader` e as dependencias do Babel:

```bash
npm install --save-dev babel-loader @babel/core @babel/preset-env
```

Configure no `webpack.config.js`:

```js
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
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
  },
}
```

Crie o `babel.config.json` normalmente — o `babel-loader` o utiliza automaticamente:

```json
{
  "presets": [
    ["@babel/preset-env", { "targets": { "node": "current" } }]
  ]
}
```

Agora o Webpack processa cada arquivo `.js` com o Babel antes de empacota-lo.

### Exemplo: processando CSS

Instale os loaders necessarios:

```bash
npm install --save-dev style-loader css-loader
```

Adicione a regra:

```js
{
  test: /\.css$/,
  use: ['style-loader', 'css-loader'],
}
```

- **`css-loader`**: interpreta os `@import` e `url()` dentro do CSS.
- **`style-loader`**: injeta o CSS processado no DOM via `<style>`.

A ordem importa: loaders sao aplicados da direita para a esquerda — `css-loader` primeiro, `style-loader` depois.

## Plugins

Loaders transformam arquivos individuais. **Plugins** atuam sobre o processo de build como um todo — otimizacao, geracao de HTML, limpeza do `dist`, entre outros.

### HtmlWebpackPlugin

Gera automaticamente o `index.html` na pasta `dist`, ja com a tag `<script>` apontando para o bundle correto:

```bash
npm install --save-dev html-webpack-plugin
```

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  // ...
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
}
```

Com isso, nao e necessario atualizar o `index.html` manualmente quando o nome do bundle mudar.

## Configuracao completa de exemplo

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,  // limpa o dist antes de cada build
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
}
```

- **`output.clean: true`**: apaga o `dist` automaticamente antes de cada build, sem precisar do `rimraf`.

## Resumo

O `webpack.config.js` centraliza toda a configuracao do Webpack. Os tres campos fundamentais sao `entry`, `output` e `mode`. Loaders estendem o Webpack para processar outros tipos de arquivo, e plugins atuam sobre o processo de build como um todo. A proxima aula mostra como usar o Webpack Dev Server para ter hot reload durante o desenvolvimento.
