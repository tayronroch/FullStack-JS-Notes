# 2 - NPM e Módulos em Node.js

## O que é o NPM?

**NPM (Node Package Manager)** é o gerenciador de pacotes padrão do Node.js. Ele é duas coisas ao mesmo tempo:

1.  Um **repositório online** para a publicação de projetos de código aberto (pacotes ou módulos).
2.  Uma **ferramenta de linha de comando** para interagir com esse repositório (instalar, atualizar e remover pacotes).

O NPM permite que você utilize facilmente código escrito por outras pessoas em seus projetos, evitando que você precise "reinventar a roda".

## O Arquivo `package.json`

Todo projeto Node.js deve ter um arquivo `package.json`. Este arquivo é o coração do projeto, contendo metadados e gerenciando as dependências.

**Para criar um `package.json`**, navegue até a pasta do seu projeto no terminal e execute:

```bash
npm init -y
```

O `-y` aceita todas as perguntas padrão. O arquivo gerado será parecido com este:

```json
{
  "name": "meu-projeto",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

## Instalando Pacotes

Para instalar um pacote, usamos o comando `npm install`.

Vamos instalar o `lodash`, uma biblioteca muito popular com funções utilitárias.

```bash
npm install lodash
```

Após a instalação, duas coisas importantes acontecem:

1.  **Pasta `node_modules`:** Uma pasta é criada contendo o código do `lodash` e de todas as suas dependências.
2.  **`package.json` e `package-lock.json`:** O `package.json` é atualizado com o `lodash` na seção `dependencies`. O `package-lock.json` é criado para garantir que as mesmas versões dos pacotes sejam instaladas em diferentes máquinas.

## Módulos em Node.js (CommonJS)

Para manter o código organizado, nós o dividimos em arquivos menores chamados **módulos**. O Node.js usa o sistema de módulos **CommonJS** por padrão.

- **`module.exports`**: Um objeto especial usado para exportar (tornar público) código de um módulo.
- **`require()`**: Uma função usada para importar (carregar) o código de outro módulo.

### Exemplo Prático

Vamos criar dois arquivos: `operacoes.js` e `app.js`.

**1. Crie `operacoes.js`:**

```javascript
// operacoes.js
const somar = (a, b) => a + b;
const subtrair = (a, b) => a - b;

// Exportando as funções para que outros arquivos possam usá-las
module.exports = {
  somar,
  subtrair
};
```

**2. Crie `app.js`:**

```javascript
// app.js

// Importando o módulo lodash que instalamos
const _ = require('lodash');

// Importando nosso módulo local (note o './')
const minhasOperacoes = require('./operacoes.js');

const resultadoSoma = minhasOperacoes.somar(5, 3);
console.log("Resultado da soma:", resultadoSoma); // Saída: 8

// Usando uma função do lodash
const array = [1, [2, [3, [4]], 5]];
const arrayAchatado = _.flattenDeep(array);
console.log("Array achatado pelo Lodash:", arrayAchatado); // Saída: [ 1, 2, 3, 4, 5 ]
```

**3. Execute `app.js`:**

```bash
node app.js
```

Este sistema de módulos é a base para a construção de aplicações Node.js complexas e bem estruturadas.
