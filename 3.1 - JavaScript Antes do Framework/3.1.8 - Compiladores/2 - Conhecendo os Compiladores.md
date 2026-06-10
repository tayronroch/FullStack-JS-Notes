# 2 - Conhecendo os Compiladores

## O que e um compilador

Um compilador e um programa que le um codigo-fonte escrito em uma linguagem e produz uma saida equivalente em outra linguagem. No contexto do JavaScript moderno, o termo e usado de forma ampla para descrever ferramentas que transformam codigo JavaScript em outro codigo JavaScript, com objetivos como compatibilidade, otimizacao ou suporte a sintaxes especiais.

Essas ferramentas tambem sao chamadas de **transpilers** (ou source-to-source compilers), pois o codigo de entrada e de saida pertencem ao mesmo nivel de abstracao — diferente de um compilador tradicional, que converte codigo de alto nivel em codigo de maquina.

## Como um compilador funciona

Todo compilador, independente da linguagem, passa por etapas similares:

### 1. Analise lexica (Tokenizacao)

O compilador le o codigo como texto e divide em tokens: palavras-chave, identificadores, operadores, literais. Por exemplo:

```
const x = 10 + 2;
```

Gera tokens como: `const`, `x`, `=`, `10`, `+`, `2`, `;`

### 2. Analise sintatica (Parsing)

Os tokens sao organizados em uma arvore que representa a estrutura gramatical do codigo. Essa arvore e chamada de **AST** (Abstract Syntax Tree — Arvore Sintatica Abstrata).

O AST do exemplo acima seria algo como:

```
VariableDeclaration
  kind: "const"
  declarations:
    VariableDeclarator
      id: Identifier (name: "x")
      init: BinaryExpression
        operator: "+"
        left: NumericLiteral (value: 10)
        right: NumericLiteral (value: 2)
```

### 3. Transformacao

Com o AST em maos, o compilador pode percorrer a arvore e modificar nos. E aqui que acontecem transformacoes como:

- Converter arrow functions em funcoes normais para compatibilidade com ES5.
- Substituir `const` e `let` por `var`.
- Converter JSX em chamadas de funcao.
- Injetar polyfills onde necessario.

### 4. Geracao de codigo

O AST transformado e convertido de volta para texto — o codigo de saida. Esse codigo e o que o navegador ou o Node.js vai executar.

## Os principais compiladores do ecossistema JavaScript

### Babel

O compilador mais usado historicamente no frontend. Funciona com um sistema de **plugins** e **presets** (conjuntos de plugins).

- `@babel/preset-env`: transpila para o alvo definido (ex.: navegadores com mais de 0.5% de uso).
- `@babel/preset-react`: transforma JSX em `React.createElement`.
- `@babel/preset-typescript`: remove as anotacoes de tipo do TypeScript.

Babel e escrito em JavaScript e e extensivel, mas tem custo de performance em projetos grandes.

### SWC

Compilador escrito em Rust, criado como alternativa ao Babel com foco em velocidade. E usado internamente pelo Next.js e pelo Vite (via plugin). Suporta JSX, TypeScript e transpilacao de ES moderno, com performance significativamente maior que o Babel.

### esbuild

Bundler e compilador escrito em Go. Extremamente rapido. Usado pelo Vite como compilador base durante o desenvolvimento. Suporta TypeScript e JSX nativamente, mas tem menos flexibilidade para transformacoes customizadas comparado ao Babel.

### TypeScript Compiler (tsc)

O compilador oficial do TypeScript. Alem de verificar tipos estaticamente, o `tsc` tambem transpila o codigo para JavaScript. Em projetos modernos, e comum usar o `tsc` apenas para verificacao de tipos e delegar a transpilacao ao Babel ou SWC, que sao mais rapidos.

## O que e um AST e por que importa

O AST e a representacao estruturada do codigo em forma de arvore. Toda ferramenta que analisa, transforma ou gera codigo trabalha com ASTs internamente.

Entender o AST explica por que certas operacoes sao possiveis:

- Linters como o ESLint percorrem o AST para encontrar padroes problematicos.
- Formatadores como o Prettier recebem o AST e reescrevem o codigo com suas regras de estilo.
- Plugins de Babel recebem o AST e podem adicionar, remover ou modificar qualquer no.

Voce pode visualizar o AST de qualquer trecho de JavaScript em [astexplorer.net](https://astexplorer.net).

## Compilador vs. Bundler

E comum confundir os dois conceitos:

| Compilador | Bundler |
|---|---|
| Transforma um arquivo de entrada em outro | Agrupa multiplos arquivos em um ou poucos arquivos de saida |
| Foco em sintaxe e compatibilidade | Foco em resolucao de dependencias e otimizacao do bundle |
| Exemplos: Babel, SWC, tsc | Exemplos: Webpack, Rollup, Vite, esbuild |

Na pratica, ferramentas modernas combinam os dois. O Vite usa o esbuild como compilador e o Rollup como bundler. O Next.js usa o SWC como compilador e tem seu proprio pipeline de bundling.

## Source Maps

Quando um compilador transforma o codigo, o resultado e diferente do original. Isso dificulta a depuracao, pois o erro no navegador aponta para o codigo gerado.

**Source maps** sao arquivos auxiliares (`.map`) que criam um mapeamento entre o codigo gerado e o codigo original. Com eles, o navegador e as ferramentas de debug exibem o codigo que voce escreveu, nao o codigo transformado.

Todos os compiladores modernos suportam geracao de source maps.

## Resumo

Compiladores sao a base invisivel do desenvolvimento frontend moderno. Eles convertem o codigo que voce escreve — com sintaxe moderna, JSX ou tipos — em algo que o ambiente de execucao entende. Entender o ciclo de tokenizacao, parsing, transformacao e geracao de codigo da visibilidade real sobre o que acontece entre o seu editor e o navegador. As proximas aulas mostram como configurar e usar essas ferramentas na pratica.
