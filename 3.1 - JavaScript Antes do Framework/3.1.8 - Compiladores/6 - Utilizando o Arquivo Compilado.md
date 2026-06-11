# 6 - Utilizando o Arquivo Compilado

## O que e o arquivo compilado

Apos rodar o build, o Babel gera o codigo transformado na pasta `dist`. Esse e o arquivo que deve ser executado — nao o arquivo original de `src`. O codigo em `src` e para o desenvolvedor; o codigo em `dist` e para o ambiente de execucao.

## Executando o arquivo compilado com Node

```bash
node dist/index.js
```

O Node executa o codigo ja transpilado, sem precisar entender a sintaxe moderna que o Babel transformou.

## Apontando o entry point no package.json

O campo `main` do `package.json` define qual arquivo e o ponto de entrada do projeto quando ele e importado por outro modulo ou executado diretamente:

```json
{
  "main": "dist/index.js"
}
```

Com isso, ao rodar `node .` na raiz do projeto, o Node vai automaticamente executar `dist/index.js`.

## Adicionando um script de start

Uma convencao comum e separar o script de build do script que executa o projeto:

```json
{
  "scripts": {
    "build": "babel src --out-dir dist",
    "start": "node dist/index.js",
    "dev": "npm run build && node dist/index.js"
  }
}
```

- **`build`**: gera o compilado.
- **`start`**: executa o compilado ja existente.
- **`dev`**: compila e executa em sequencia — util durante o desenvolvimento.

## Fluxo completo de desenvolvimento

```
1. Escrever codigo em src/
2. npm run build       → gera dist/
3. npm start           → executa dist/index.js
```

Ou em uma unica etapa:

```
npm run dev
```

## Usando nodemon para reexecutar apos o watch

O `nodemon` reinicia o processo Node automaticamente quando os arquivos em `dist` mudam. Combinado com o `build:watch` do Babel, forma um ciclo de desenvolvimento continuo:

```bash
npm install --save-dev nodemon
```

```json
{
  "scripts": {
    "build:watch": "babel src --out-dir dist --watch",
    "start:watch": "nodemon dist/index.js",
    "dev": "npm-run-all --parallel build:watch start:watch"
  }
}
```

Com `npm run dev`, o Babel observa `src` e recompila a cada mudanca, enquanto o `nodemon` observa `dist` e reinicia o Node automaticamente. O resultado e um fluxo semelhante ao hot reload.

## Importando modulos do dist em outros arquivos

Se o projeto tem multiplos arquivos, os imports dentro do `dist` ja estao resolvidos pelo Babel. Nao e necessario importar de `src` em nenhum momento — tudo parte de `dist/index.js`:

```
src/
├── index.js
└── utils/
    └── format.js

dist/
├── index.js       ← ponto de entrada
└── utils/
    └── format.js  ← importado automaticamente pelo index compilado
```

## O que nao deve ser feito

- **Nao edite arquivos em `dist` diretamente.** Qualquer mudanca sera sobrescrita no proximo build.
- **Nao importe de `src` em producao.** O ambiente de producao deve conhecer apenas o `dist`.
- **Nao versione o `dist` no git** (adicione ao `.gitignore`). O codigo-fonte em `src` e suficiente para recriar o `dist` a qualquer momento com `npm run build`.

## Resumo

O arquivo compilado em `dist` e o produto final do Babel — e ele que o Node executa. Apontar o `main` do `package.json` para `dist/index.js` e separar os scripts de `build`, `start` e `dev` sao as convencoes que tornam o projeto previsivel para qualquer pessoa que for trabalhar nele. Combinando `babel --watch` com `nodemon`, o ciclo de desenvolvimento se torna automatico e continuo.
