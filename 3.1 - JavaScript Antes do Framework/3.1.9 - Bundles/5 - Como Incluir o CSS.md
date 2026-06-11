# 5 - Como Incluir o CSS

## O problema sem configuracao

O Webpack nao entende CSS por padrao. Se voce tentar importar um arquivo `.css` diretamente no JavaScript:

```js
import './styles.css'
```

O build vai falhar com um erro informando que nenhum loader foi configurado para esse tipo de arquivo.

## Entendendo as regras (module.rules)

Toda configuracao de loader no Webpack passa pela secao `module.rules`. Cada item do array e uma regra que define: quais arquivos processar, quais loaders usar e como configura-los.

### Anatomia de uma regra

```js
module: {
  rules: [
    {
      test: /\.css$/,       // padrao regex: quais arquivos essa regra afeta
      include: /src/,       // (opcional) restringe a uma pasta especifica
      exclude: /node_modules/, // (opcional) ignora uma pasta
      use: [                // quais loaders aplicar, da direita para a esquerda
        'style-loader',
        'css-loader',
      ],
    },
  ],
}
```

### test

Define quais arquivos a regra vai processar, usando uma expressao regular:

```js
test: /\.css$/       // arquivos que terminam com .css
test: /\.js$/        // arquivos que terminam com .js
test: /\.(png|jpg|gif)$/ // imagens
test: /\.(woff|woff2|eot|ttf|otf)$/ // fontes
```

### include e exclude

Restringem quais pastas a regra afeta. Usar `exclude: /node_modules/` e uma pratica essencial para evitar que o Webpack tente processar as dependencias instaladas, o que tornaria o build muito lento:

```js
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: 'babel-loader',
}
```

### use com opcoes

Quando um loader precisa de configuracao, use a forma de objeto:

```js
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env'],
    },
  },
}
```

### Multiplos loaders em sequencia

Quando `use` recebe um array, os loaders sao aplicados da direita para a esquerda (ou de baixo para cima, se escritos em multiplas linhas):

```js
use: ['style-loader', 'css-loader']
// execucao: css-loader → style-loader
```

### Regras com oneOf

`oneOf` aplica apenas a primeira regra que corresponder ao arquivo, evitando que multiplas regras processem o mesmo arquivo desnecessariamente:

```js
module: {
  rules: [
    {
      oneOf: [
        {
          test: /\.module\.css$/,  // CSS com CSS Modules
          use: ['style-loader', 'css-loader?modules'],
        },
        {
          test: /\.css$/,          // CSS normal
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
  ],
}
```

### Exemplo com multiplas regras

```js
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
    {
      test: /\.(png|jpg|gif|svg)$/,
      type: 'asset/resource',  // loader nativo do Webpack 5 para assets
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      type: 'asset/resource',
    },
  ],
}
```

O Webpack 5 introduziu os **Asset Modules** (`type: 'asset/resource'`), que substituem loaders como `file-loader` e `url-loader` para imagens e fontes sem precisar instalar pacotes adicionais.

## Os loaders necessarios

Para processar CSS, sao necessarios dois loaders instalados em sequencia:

```bash
npm install --save-dev css-loader style-loader
```

- **`css-loader`**: le o arquivo CSS, interpreta `@import` e `url()` e transforma o conteudo em um modulo JavaScript.
- **`style-loader`**: pega o modulo gerado pelo `css-loader` e injeta o CSS no DOM via uma tag `<style>` em tempo de execucao.

## Configurando os loaders

No `webpack.config.js`, adicione a regra dentro de `module.rules`:

```js
module: {
  rules: [
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },
  ],
}
```

A ordem importa: loaders sao aplicados da direita para a esquerda. O `css-loader` processa primeiro, depois o `style-loader` injeta o resultado no DOM.

## Importando CSS no JavaScript

Com os loaders configurados, importe o CSS diretamente no arquivo JavaScript:

```js
import './styles.css'

const app = document.getElementById('app')
app.textContent = 'Hello, World!'
```

O Webpack inclui o CSS no bundle e o `style-loader` injeta a tag `<style>` automaticamente quando o bundle e carregado no navegador.

## Exemplo completo

### Estrutura do projeto

```
meu-projeto/
├── src/
│   ├── index.js
│   └── styles.css
├── index.html
├── webpack.config.js
└── package.json
```

### src/styles.css

```css
body {
  margin: 0;
  font-family: sans-serif;
  background-color: #f0f0f0;
}

#app {
  padding: 2rem;
  font-size: 1.5rem;
  color: #333;
}
```

### src/index.js

```js
import './styles.css'

const app = document.getElementById('app')
app.textContent = 'Hello, World!'
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

Rode o build e abra o `dist/index.html` no navegador — o CSS sera aplicado automaticamente.

## Extraindo o CSS para um arquivo separado

O `style-loader` injeta o CSS via JavaScript em tempo de execucao. Em producao, o ideal e gerar um arquivo `.css` separado, carregado pelo navegador diretamente — o que evita o flash de conteudo sem estilo e permite cache independente.

Para isso, use o `MiniCssExtractPlugin`:

```bash
npm install --save-dev mini-css-extract-plugin
```

Substitua o `style-loader` pelo plugin:

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
  ],
}
```

O resultado no `dist`:

```
dist/
├── index.html    (com <link rel="stylesheet" href="styles.css"> injetado)
├── main.js
└── styles.css    (arquivo CSS separado)
```

O `HtmlWebpackPlugin` injeta automaticamente o `<link>` para o CSS gerado no HTML.

## style-loader vs MiniCssExtractPlugin

| | style-loader | MiniCssExtractPlugin |
|---|---|---|
| Como entrega o CSS | Injeta via `<style>` no DOM | Gera um arquivo `.css` separado |
| Suporta hot reload | Sim | Nao |
| Ideal para | Desenvolvimento | Producao |

Uma pratica comum e usar os dois conforme o ambiente:

```js
const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    !isDev && new MiniCssExtractPlugin({ filename: 'styles.css' }),
  ].filter(Boolean),
}
```

## Resumo

Incluir CSS no Webpack exige `css-loader` e `style-loader` para desenvolvimento. Em producao, o `MiniCssExtractPlugin` extrai o CSS para um arquivo separado, melhorando performance e cache. O CSS e importado diretamente no JavaScript — o Webpack cuida de empacotar e entregar ao navegador da forma correta para cada ambiente.
