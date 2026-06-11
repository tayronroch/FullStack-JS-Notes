# 5 - Criando um Script para Compilar

## Por que criar um script

Rodar `npx babel src --out-dir dist` manualmente toda vez e impratico. O `package.json` tem uma secao `scripts` exatamente para isso: centralizar os comandos do projeto em atalhos simples e consistentes para qualquer pessoa que clone o repositorio.

## Estrutura da secao scripts

```json
{
  "scripts": {
    "nome-do-script": "comando a executar"
  }
}
```

Os scripts sao executados com `npm run nome-do-script`. O NPM adiciona automaticamente o `node_modules/.bin` ao PATH durante a execucao, entao nao e necessario usar `npx` dentro dos scripts.

## Criando os scripts de compilacao

```json
{
  "scripts": {
    "build": "babel src --out-dir dist",
    "build:watch": "babel src --out-dir dist --watch",
    "build:clean": "rm -rf dist && babel src --out-dir dist"
  }
}
```

- **`build`**: compila `src` para `dist` uma unica vez.
- **`build:watch`**: recompila automaticamente a cada alteracao em `src`.
- **`build:clean`**: apaga o `dist` antes de compilar, garantindo que nao sobrem arquivos antigos.

Para rodar:

```bash
npm run build
npm run build:watch
npm run build:clean
```

## Limpando o dist antes de compilar

Em projetos que renomeiam ou removem arquivos com frequencia, arquivos antigos podem permanecer no `dist` mesmo apos o build. A solucao e apagar o `dist` antes de cada compilacao.

No Linux e macOS:

```json
"build:clean": "rm -rf dist && babel src --out-dir dist"
```

No Windows (via rimraf, compativel com todos os sistemas):

```bash
npm install --save-dev rimraf
```

```json
"build:clean": "rimraf dist && babel src --out-dir dist"
```

O `rimraf` e o padrao para projetos que precisam funcionar em qualquer sistema operacional.

## Encadeando scripts com npm-run-all

Em projetos maiores, e comum encadear varios scripts em sequencia ou em paralelo. O pacote `npm-run-all` facilita isso:

```bash
npm install --save-dev npm-run-all
```

```json
{
  "scripts": {
    "clean": "rimraf dist",
    "compile": "babel src --out-dir dist",
    "build": "run-s clean compile"
  }
}
```

- **`run-s`**: executa os scripts em sequencia (serial).
- **`run-p`**: executa os scripts em paralelo.

## Adicionando source maps apenas em desenvolvimento

Uma pratica comum e gerar source maps em desenvolvimento e omiti-los em producao para reduzir o tamanho dos arquivos:

```json
{
  "scripts": {
    "build": "babel src --out-dir dist",
    "build:dev": "babel src --out-dir dist --source-maps"
  }
}
```

Ou usando a variavel `NODE_ENV` para que o proprio Babel decida com base no ambiente:

```json
{
  "scripts": {
    "build": "NODE_ENV=production babel src --out-dir dist",
    "build:dev": "NODE_ENV=development babel src --out-dir dist --source-maps"
  }
}
```

No Windows, use o pacote `cross-env` para definir variaveis de ambiente de forma compativel:

```bash
npm install --save-dev cross-env
```

```json
{
  "scripts": {
    "build": "cross-env NODE_ENV=production babel src --out-dir dist",
    "build:dev": "cross-env NODE_ENV=development babel src --out-dir dist --source-maps"
  }
}
```

## Exemplo de package.json completo

```json
{
  "name": "meu-projeto",
  "version": "1.0.0",
  "scripts": {
    "build": "cross-env NODE_ENV=production rimraf dist && babel src --out-dir dist",
    "build:dev": "cross-env NODE_ENV=development babel src --out-dir dist --source-maps",
    "build:watch": "babel src --out-dir dist --watch"
  },
  "devDependencies": {
    "@babel/cli": "^7.0.0",
    "@babel/core": "^7.0.0",
    "@babel/preset-env": "^7.0.0",
    "cross-env": "^7.0.0",
    "rimraf": "^5.0.0"
  }
}
```

## Resumo

A secao `scripts` do `package.json` e o lugar certo para centralizar os comandos de compilacao. Um bom conjunto de scripts cobre pelo menos tres cenarios: build de producao, build com watch para desenvolvimento e limpeza do `dist` antes de compilar. Ferramentas como `rimraf` e `cross-env` garantem que os scripts funcionem igual em qualquer sistema operacional.
