# 7 - Webpack Dev Server

## O que e o Webpack Dev Server

O Webpack Dev Server e um servidor de desenvolvimento que serve o bundle diretamente da memoria — sem gravar arquivos no disco. Ele observa as mudancas nos arquivos fonte e atualiza o navegador automaticamente via **Hot Module Replacement (HMR)**, sem precisar recarregar a pagina inteira.

## Instalando

```bash
npm install --save-dev webpack-dev-server
```

## Configurando no webpack.config.js

Adicione a secao `devServer`:

```js
module.exports = {
  // ...
  devServer: {
    static: './dist',
    port: 3000,
    open: true,
  },
}
```

- **`static`**: pasta que o servidor vai servir os arquivos estaticos.
- **`port`**: porta do servidor (padrao e 8080).
- **`open`**: abre o navegador automaticamente ao iniciar.

## Adicionando o script no package.json

```json
{
  "scripts": {
    "build": "webpack --mode production",
    "build:dev": "webpack --mode development",
    "dev": "webpack serve --mode development"
  }
}
```

Para iniciar o servidor:

```bash
npm run dev
```

O terminal exibe o endereco — geralmente `http://localhost:3000` — e o navegador abre automaticamente.

## Hot Module Replacement (HMR)

O HMR substitui apenas o modulo alterado no navegador sem recarregar a pagina inteira. O estado da aplicacao e preservado — formularios preenchidos, posicao de scroll e dados em memoria continuam intactos apos a atualizacao.

O HMR e ativado por padrao no Dev Server em modo `development`. Para ativar explicitamente:

```js
devServer: {
  static: './dist',
  port: 3000,
  hot: true,
}
```

## Configuracao completa do devServer

```js
devServer: {
  static: './dist',   // pasta dos arquivos estaticos
  port: 3000,         // porta do servidor
  open: true,         // abre o navegador ao iniciar
  hot: true,          // habilita HMR
  compress: true,     // compressao gzip para os assets servidos
  historyApiFallback: true, // redireciona 404 para index.html (necessario para SPAs)
}
```

### historyApiFallback

Em aplicacoes de pagina unica (SPAs), a navegacao e feita pelo JavaScript — rotas como `/sobre` e `/contato` nao existem como arquivos reais. Sem `historyApiFallback: true`, acessar essas rotas diretamente no navegador retorna 404. Com a opcao ativa, qualquer rota desconhecida serve o `index.html` e o JavaScript assume o controle.

## Exemplo completo

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
  devServer: {
    static: './dist',
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: true,
  },
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
    new HtmlWebpackPlugin({ template: './index.html' }),
  ],
}
```

### package.json

```json
{
  "scripts": {
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production"
  }
}
```

## Dev Server vs build:watch

| | Dev Server | build:watch |
|---|---|---|
| Grava arquivos no disco | Nao (serve da memoria) | Sim |
| Atualiza o navegador | Automaticamente (HMR) | Nao — precisa do nodemon |
| Ideal para | Frontend (HTML/CSS/JS no navegador) | Backend (Node.js) |
| Velocidade | Mais rapido (sem I/O de disco) | Depende do projeto |

O Dev Server e para projetos que rodam no navegador. Para projetos Node.js, o combo `babel --watch` + `nodemon` continua sendo o caminho.

## Resumo

O Webpack Dev Server elimina o ciclo manual de build e reload durante o desenvolvimento. Com `npm run dev`, o servidor sobe, o navegador abre e qualquer mudanca no codigo e refletida automaticamente via HMR. A configuracao minima exige apenas instalar o pacote, adicionar a secao `devServer` no config e criar o script `dev` no `package.json`.
