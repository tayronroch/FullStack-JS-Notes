# 4 - Como Incluir o HTML

## O problema sem automacao

No fluxo basico, o `index.html` fica na raiz do projeto e aponta manualmente para o bundle gerado:

```html
<script src="./dist/main.js"></script>
```

Isso funciona para projetos simples, mas cria problemas conforme o projeto cresce:

- Se o nome do bundle mudar (ex.: `main.abc123.js` com hash), o HTML quebra.
- O HTML nao vai para o `dist`, ficando fora da pasta de saida do build.
- Em producao, voce precisaria ajustar o caminho manualmente a cada deploy.

A solucao e deixar o Webpack gerar o HTML automaticamente.

## HtmlWebpackPlugin

O `HtmlWebpackPlugin` e o plugin oficial para gerar o `index.html` dentro do `dist`, ja com a tag `<script>` apontando para o bundle correto — automaticamente.

### Instalacao

```bash
npm install --save-dev html-webpack-plugin
```

### Configuracao basica

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
  plugins: [
    new HtmlWebpackPlugin(),
  ],
}
```

Sem nenhuma opcao, o plugin gera um `index.html` padrao no `dist` com o `<script>` injetado automaticamente.

## Usando um template HTML proprio

Na maioria dos projetos voce quer controlar o HTML — definir o `<title>`, adicionar metatags, incluir fontes externas ou uma `<div id="app">` para o framework. Para isso, use a opcao `template`:

Crie `index.html` na raiz do projeto:

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Meu Projeto</title>
  </head>
  <body>
    <div id="app"></div>
    <!-- o plugin injeta o <script> automaticamente, nao precisa adicionar -->
  </body>
</html>
```

Configure o plugin com o caminho do template:

```js
plugins: [
  new HtmlWebpackPlugin({
    template: './index.html',
  }),
]
```

O Webpack vai copiar esse template para `dist/index.html` e injetar a tag `<script src="main.js">` antes do `</body>` automaticamente.

## Resultado no dist

Apos o build, o `dist/index.html` gerado fica assim:

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Meu Projeto</title>
  </head>
  <body>
    <div id="app"></div>
    <script defer src="main.js"></script>
  </body>
</html>
```

O `<script>` foi injetado pelo plugin — voce nao precisa escreve-lo no template.

## Opcoes uteis do plugin

### Titulo da pagina

```js
new HtmlWebpackPlugin({
  template: './index.html',
  title: 'Meu App',
})
```

Para usar o titulo definido no config dentro do template:

```html
<title><%= htmlWebpackPlugin.options.title %></title>
```

### Nome do arquivo de saida

```js
new HtmlWebpackPlugin({
  template: './index.html',
  filename: 'index.html',  // padrao, pode ser alterado
})
```

### Multiplas paginas

Para projetos com mais de uma pagina, instancie o plugin uma vez por pagina:

```js
plugins: [
  new HtmlWebpackPlugin({
    template: './src/pages/index.html',
    filename: 'index.html',
    chunks: ['main'],
  }),
  new HtmlWebpackPlugin({
    template: './src/pages/admin.html',
    filename: 'admin.html',
    chunks: ['admin'],
  }),
]
```

A opcao `chunks` define quais bundles sao injetados em cada pagina.

## Estrutura do projeto com o plugin

```
meu-projeto/
├── dist/
│   ├── index.html    (gerado pelo plugin)
│   └── main.js       (bundle gerado pelo Webpack)
├── src/
│   └── index.js
├── index.html        (template — nao vai para o navegador diretamente)
├── webpack.config.js
└── package.json
```

O `dist` passa a ser a pasta completa e autossuficiente para deploy — contem o HTML e o bundle, sem depender de nada fora dela.

## Resumo

O `HtmlWebpackPlugin` elimina a necessidade de manter o HTML sincronizado manualmente com os bundles gerados. Com um template proprio, voce controla a estrutura do HTML enquanto o plugin cuida de injetar os scripts corretamente. O resultado e uma pasta `dist` pronta para deploy, com HTML e bundle juntos.
