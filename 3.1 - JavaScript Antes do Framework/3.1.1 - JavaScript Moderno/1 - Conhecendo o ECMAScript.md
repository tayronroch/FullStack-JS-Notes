# 1 - Conhecendo o ECMAScript

## O que e ECMAScript

ECMAScript (ES) e o padrao que define a linguagem JavaScript. Ele descreve sintaxe, tipos, objetos nativos, semantica e APIs de base. JavaScript e a implementacao mais famosa do ECMAScript, mas outros ambientes (como runtimes embarcados) tambem seguem esse padrao.

## Por que o ECMAScript importa

- **Compatibilidade**: navegadores e runtimes evoluem seguindo o padrao.
- **Evolucao previsivel**: desde 2015, o ECMAScript e publicado em ciclos anuais.
- **Portabilidade**: um mesmo codigo funciona em ambientes diferentes quando o padrao e seguido.

## Quem define o padrao

O padrao e mantido pela **TC39**, um comite com representantes de empresas e da comunidade. As novas propostas seguem um processo formal chamado **stages**:

- **Stage 0-2**: ideias e propostas em refinamento.
- **Stage 3**: pronto para implementacao.
- **Stage 4**: aprovado e incorporado ao proximo release do ECMAScript.

## Como acompanhar compatibilidade

Mesmo com um padrao anual, nem todos os ambientes suportam tudo de imediato. Por isso:

- **Transpilers** (ex.: Babel) convertem sintaxe nova para antiga.
- **Polyfills** implementam APIs que ainda nao existem no ambiente.
- **Targets** em ferramentas de build definem quais versoes voce precisa suportar.

## Linha do tempo do ECMAScript

Abaixo, um panorama das edicoes e seus pontos mais relevantes. Nao e uma lista exaustiva, mas cobre as inovacoes mais importantes ao longo dos anos.

### ES1 (1997)

- Primeira especificacao oficial do JavaScript.
- Base da linguagem como conhecemos hoje (tipos, funcoes, objetos, prototipos).

### ES2 (1998)

- Revisao editorial sem mudancas de linguagem.

### ES3 (1999)

- `try/catch`, expressoes regulares mais consistentes, melhorias em `String` e `Array`.
- Base para praticamente todo o JavaScript da web nos anos 2000.

### ES4 (cancelado)

- Proposta ambiciosa, nunca finalizada.
- Levou a um replanejamento que culminou no ES5 e depois no ES2015.

### ES5 (2009)

- **Strict mode** (`"use strict"`).
- JSON nativo (`JSON.parse`/`JSON.stringify`).
- Metodos de array: `map`, `filter`, `reduce`, `forEach`.
- `Object.defineProperty`, getters/setters.

### ES5.1 (2011)

- Ajustes de padronizacao e clarificacoes.

### ES2015 / ES6 (2015)

Marco de modernizacao da linguagem:

- `let` e `const`, escopo de bloco.
- Arrow functions.
- Classes e `super`.
- Modulos (`import`/`export`).
- Template literals.
- Destructuring.
- Default parameters, rest e spread.
- Promises.
- Symbols, iterators e generators.
- `Map`, `Set`, `WeakMap`, `WeakSet`.

### ES2016 (2016)

- Operador de exponenciacao `**`.
- `Array.prototype.includes`.

### ES2017 (2017)

- `async/await`.
- `Object.values` e `Object.entries`.
- `String.prototype.padStart` e `padEnd`.

### ES2018 (2018)

- Rest/spread para objetos.
- Iteracao assincrona (`for await...of`).
- `Promise.prototype.finally`.
- Melhorias em RegExp (ex.: `s` flag).

### ES2019 (2019)

- `Array.prototype.flat` e `flatMap`.
- `Object.fromEntries`.
- Optional catch binding (`catch { ... }`).
- `String.prototype.trimStart` e `trimEnd`.
- `Symbol.prototype.description`.

### ES2020 (2020)

- Optional chaining (`?.`).
- Nullish coalescing (`??`).
- `BigInt`.
- `Promise.allSettled`.
- `globalThis`.
- `import()` dinamico e `import.meta`.

### ES2021 (2021)

- Operadores logicos de atribuicao (`&&=`, `||=`, `??=`).
- `String.prototype.replaceAll`.
- `Promise.any`.
- `WeakRef` e `FinalizationRegistry`.

### ES2022 (2022)

- Campos de classe publicos e privados.
- `static` blocks em classes.
- `Error` com `cause`.
- `Array.prototype.at`.
- `Object.hasOwn`.
- `top-level await` em modulos.

### ES2023 (2023)

- Metodos de array por copia: `toSorted`, `toReversed`, `toSpliced`, `with`.
- `Array.prototype.findLast` e `findLastIndex`.
- Hashbang (`#!`) em scripts.

### ES2024 (2024)

- `Array.prototype.groupBy` e `Map.groupBy`.
- `Promise.withResolvers`.
- Novos recursos de RegExp (`/v` flag).
- Melhorias em `ArrayBuffer` redimensionavel.

## Boas praticas para usar recursos modernos

- **Conheca o seu target** (navegadores e Node suportados).
- **Use tooling** quando necessario (Babel, TypeScript, bundlers).
- **Prefira features estaveis** (Stage 4).
- **Documente** quais versoes sao suportadas no projeto.

## Resumo

ECMAScript evoluiu de uma especificacao basica nos anos 1990 para um padrao moderno, com entregas anuais e foco em produtividade, performance e seguranca. Entender essa linha do tempo ajuda a escrever JavaScript moderno com clareza e compatibilidade.
