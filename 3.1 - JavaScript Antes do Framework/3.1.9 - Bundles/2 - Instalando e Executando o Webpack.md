# 2 - Instalando e Executando o Webpack

## O que e o Webpack

Webpack e um bundler de modulos para JavaScript. Ele recebe um arquivo de entrada, resolve todo o grafo de dependencias e gera um ou mais arquivos de saida otimizados. Alem de JavaScript, suporta CSS, imagens e outros assets via loaders.

## Pre-requisitos

- Node.js instalado.
- Um projeto com `package.json`. Se ainda nao tiver:

```bash
npm init -y
```

## Instalando o Webpack

O Webpack e dividido em dois pacotes:

```bash
npm install --save-dev webpack webpack-cli
```

- **`webpack`**: o motor do bundler.
- **`webpack-cli`**: permite executar o Webpack via linha de comando.

## Estrutura inicial do projeto

```
meu-projeto/
├── src/
│   └── index.js
├── package.json
└── node_modules/
```

Crie o arquivo de entrada `src/index.js`:

```js
const mensagem = 'Hello, Webpack!'
console.log(mensagem)
```

## Executando sem configuracao

O Webpack tem um comportamento padrao sem nenhum arquivo de configuracao:

- **Entrada**: `src/index.js`
- **Saida**: `dist/main.js`
- **Modo**: `production` (com minificacao)

Para executar:

```bash
npx webpack
```

O Webpack vai gerar `dist/main.js` automaticamente. Para rodar o resultado:

```bash
node dist/main.js
```

## Definindo o modo

O Webpack aceita dois modos principais:

```bash
npx webpack --mode development
npx webpack --mode production
```

- **`development`**: codigo legivel, sem minificacao, com informacoes de debug.
- **`production`**: codigo minificado e otimizado para entrega.

Sem definir o modo, o Webpack exibe um aviso e usa `production` por padrao.

## Adicionando scripts no package.json

```json
{
  "scripts": {
    "build": "webpack --mode production",
    "build:dev": "webpack --mode development",
    "build:watch": "webpack --mode development --watch"
  }
}
```

- **`build`**: gera o bundle de producao.
- **`build:dev`**: gera o bundle de desenvolvimento (legivel).
- **`build:watch`**: recompila automaticamente a cada mudanca.

Para rodar:

```bash
npm run build
npm run build:dev
npm run build:watch
```

## Testando com multiplos modulos

Crie `src/utils.js`:

```js
export function somar(a, b) {
  return a + b
}
```

Atualize `src/index.js`:

```js
import { somar } from './utils.js'

console.log(somar(2, 3))
```

Rode o build:

```bash
npm run build:dev
```

O Webpack vai resolver o import de `utils.js`, incluir os dois modulos no bundle e gerar um unico `dist/main.js`.

## Verificando o bundle gerado

Em modo development, o `dist/main.js` e legivel e contem comentarios indicando de qual modulo cada trecho veio. Em modo production, o codigo e minificado em uma unica linha.

```bash
node dist/main.js
# 5
```

## Estrutura do projeto apos o build

```
meu-projeto/
├── dist/
│   └── main.js       (bundle gerado)
├── src/
│   ├── index.js
│   └── utils.js
├── package.json
└── node_modules/
```

## Exemplo completo: Hello World com HTML

Este exemplo mostra o fluxo completo — um `index.js` que manipula o DOM, empacotado pelo Webpack e carregado por um `index.html`.

### Estrutura do projeto

```
meu-projeto/
├── src/
│   └── index.js
├── index.html
└── package.json
```

### index.html

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>Hello Webpack</title>
  </head>
  <body>
    <div id="app"></div>

    <!-- aponta para o bundle gerado pelo Webpack, nao para src -->
    <script src="./dist/main.js"></script>
  </body>
</html>
```

### src/index.js

```js
const app = document.getElementById('app')
app.textContent = 'Hello, World!'
```

### Gerando o bundle

```bash
npm run build:dev
```

O Webpack empacota `src/index.js` e gera `dist/main.js`.

### Resultado

Abra o `index.html` diretamente no navegador. O texto **Hello, World!** vai aparecer na pagina — servido pelo bundle gerado, nao pelo arquivo original.

### Estrutura apos o build

```
meu-projeto/
├── dist/
│   └── main.js       (bundle — referenciado pelo HTML)
├── src/
│   └── index.js      (codigo fonte — nao vai para o HTML)
├── index.html
└── package.json
```

O HTML so conhece o `dist/main.js`. Todo o codigo em `src` e invisivel para o navegador — o Webpack e o intermediario entre os dois.

## Resumo

Instalar o Webpack exige apenas `webpack` e `webpack-cli`. Sem nenhuma configuracao, ele ja funciona com entrada em `src/index.js` e saida em `dist/main.js`. Os scripts no `package.json` com `--mode development` e `--mode production` cobrem os dois cenarios mais comuns. A proxima aula mostra como criar o arquivo `webpack.config.js` para customizar esse comportamento.
