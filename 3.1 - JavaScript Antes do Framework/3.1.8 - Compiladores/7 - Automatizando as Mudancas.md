# 7 - Automatizando as Mudancas

## O problema sem automacao

Sem automacao, o ciclo de desenvolvimento exige intervencao manual a cada mudanca:

```
1. Editar src/
2. npm run build   (manual)
3. node dist/      (manual)
4. Verificar resultado
5. Repetir
```

Isso torna o desenvolvimento lento e sujeito a erros — e facil esquecer de rodar o build e testar codigo desatualizado.

## A solucao: watch + nodemon

A combinacao de dois processos rodando em paralelo elimina o trabalho manual:

- **`babel --watch`**: observa `src` e recompila automaticamente a cada alteracao.
- **`nodemon`**: observa `dist` e reinicia o Node automaticamente a cada mudanca.

O resultado e um ciclo continuo: voce salva o arquivo, o Babel recompila, o nodemon reinicia — tudo em menos de um segundo.

## Instalando as dependencias

```bash
npm install --save-dev nodemon npm-run-all
```

- **`nodemon`**: reinicia o processo Node ao detectar mudancas em arquivos.
- **`npm-run-all`**: permite rodar multiplos scripts NPM em paralelo ou em sequencia.

## Configurando os scripts

```json
{
  "scripts": {
    "build:watch": "babel src --out-dir dist --watch",
    "start:watch": "nodemon dist/index.js",
    "dev": "npm-run-all --parallel build:watch start:watch"
  }
}
```

Com um unico comando:

```bash
npm run dev
```

Os dois processos sobem juntos. O terminal exibe a saida de ambos simultaneamente.

## Configurando o nodemon

Por padrao, o nodemon observa todos os arquivos `.js` no diretorio atual. Para restringir ao `dist` e evitar reinicializacoes desnecessarias, crie um arquivo `nodemon.json` na raiz:

```json
{
  "watch": ["dist"],
  "ext": "js",
  "ignore": ["src", "node_modules"]
}
```

Ou passe as opcoes diretamente no script:

```json
"start:watch": "nodemon --watch dist dist/index.js"
```

## Adicionando delay para aguardar o build

Em projetos maiores, o Babel pode levar alguns milissegundos para terminar de compilar antes do nodemon tentar reiniciar o processo. Um pequeno delay resolve isso:

```json
"start:watch": "nodemon --watch dist --delay 500ms dist/index.js"
```

O nodemon vai aguardar 500ms apos detectar a mudanca antes de reiniciar.

## Fluxo automatizado completo

```
Voce salva src/index.js
       ↓
Babel detecta a mudanca (--watch)
       ↓
Babel recompila para dist/index.js
       ↓
nodemon detecta mudanca em dist/
       ↓
nodemon reinicia node dist/index.js
       ↓
Resultado atualizado no terminal
```

Tudo isso acontece automaticamente, sem nenhum comando manual apos o `npm run dev`.

## Exemplo de package.json final

```json
{
  "name": "meu-projeto",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "build": "rimraf dist && babel src --out-dir dist",
    "start": "node dist/index.js",
    "dev": "npm-run-all --parallel build:watch start:watch",
    "build:watch": "babel src --out-dir dist --watch",
    "start:watch": "nodemon --watch dist --delay 500ms dist/index.js"
  },
  "devDependencies": {
    "@babel/cli": "^7.0.0",
    "@babel/core": "^7.0.0",
    "@babel/preset-env": "^7.0.0",
    "nodemon": "^3.0.0",
    "npm-run-all": "^4.0.0",
    "rimraf": "^5.0.0"
  }
}
```

## Resumo

Automatizar o ciclo de compilacao e execucao elimina o trabalho manual e torna o desenvolvimento mais rapido e confiavel. A combinacao de `babel --watch` com `nodemon` e o padrao mais simples para projetos Node com Babel. O script `dev` no `package.json` centraliza tudo em um unico comando, deixando o ambiente pronto para qualquer pessoa que clonar o repositorio.
