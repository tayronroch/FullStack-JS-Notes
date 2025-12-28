# 2 - Strict Mode

## O que e strict mode

Strict mode e um modo restrito do JavaScript que ativa regras mais rigorosas de semantica e erros. Ele ajuda a evitar bugs silenciosos, melhora a seguranca e facilita a otimizacao do codigo pelos motores JavaScript.

## Como ativar

Strict mode e ativado com a diretiva `"use strict"` no inicio do script ou da funcao:

```javascript
"use strict";
// todo o script esta em strict mode
```

```javascript
function soma(a, a) {
  "use strict";
  // strict mode ativo apenas dentro desta funcao
  return a + a;
}
```

Regras importantes:

- A diretiva precisa estar no **inicio** do corpo do script ou funcao (directive prologue).
- Qualquer string literal antes dela invalida a ativacao.
- Em modulos ES (`type="module"` ou `import/export`), strict mode e **automatico**.
- `class` e `import/export` so existem em ES2015+, e classes sao sempre strict.

## Escopos do strict mode

Strict mode nao e "global" para tudo; ele segue regras de escopo bem claras.

### Escopo de script

Quando `"use strict"` aparece no topo de um arquivo (script), ele afeta todo o arquivo.

```javascript
"use strict";

function foo() {
  // strict mode ativo aqui tambem
}
```

### Escopo de funcao

Quando a diretiva aparece dentro de uma funcao, ela afeta **somente** aquela funcao e funcoes internas.

```javascript
function fora() {
  // sem strict mode
  function dentro() {
    "use strict";
    // strict mode ativo aqui
  }
}
```

### Escopo de modulo (ESM)

Arquivos que usam `import` ou `export` sao sempre strict, mesmo sem a diretiva.

```javascript
// arquivo modulo
export function ping() {
  // strict mode ativo por padrao
}
```

### Blocos nao ativam strict mode

Colocar `"use strict"` dentro de um bloco (ex.: `if`, `for`) nao ativa strict mode para aquele bloco. A diretiva e reconhecida apenas no topo do script ou funcao.

```javascript
if (true) {
  "use strict";
  // NAO ativa strict mode para este bloco
}
```

### Eval e strict mode

`eval` pode ser executado em modo estrito ou nao, dependendo do contexto:

- Se o arquivo ou funcao esta em strict, o `eval` herda o strict mode.
- `eval` em strict cria seu proprio escopo e nao vaza variaveis para fora.

## Principais mudancas de comportamento

### 1) Erros em vez de falhas silenciosas

Erros comuns que antes passavam passam a gerar excecao:

- Usar variavel nao declarada.
- Deletar variaveis, funcoes, ou argumentos.
- Duplicar parametros em funcoes.

```javascript
"use strict";
variavelSolta = 10; // ReferenceError
```

### 2) `this` em funcoes simples

Em strict mode, `this` nao vira automaticamente o objeto global.

```javascript
"use strict";
function f() {
  return this;
}
f(); // undefined
```

Sem strict, `this` seria `window` (navegador) ou `global` (Node).

### 3) `with` e `eval` restritos

`with` e proibido em strict mode, pois dificulta a resolucao de escopos.

```javascript
"use strict";
with (Math) {} // SyntaxError
```

### 4) Proibicao de octal legacy

Literais octais com `0` a esquerda sao proibidos.

```javascript
"use strict";
const n = 012; // SyntaxError
```

### 5) Nomes reservados

Algumas palavras ficam reservadas e nao podem ser usadas como identificadores em strict mode, especialmente aquelas ligadas a classes e modulos.

### 6) `arguments` e funcoes especiais

Em strict mode:

- `arguments` nao reflete automaticamente alteracoes nos parametros.
- `arguments.callee` e `arguments.caller` sao proibidos.
- `func.caller` e `func.arguments` sao proibidos.

## Strict mode e classes

Corpos de `class` sao sempre strict. Mesmo sem `"use strict"`, as regras acima se aplicam dentro da classe.

```javascript
class Conta {
  sacar() {
    // strict mode ativo aqui
  }
}
```

## Strict mode e Node.js

### CommonJS (require)

- Strict mode **nao** e automatico.
- Voce precisa adicionar `"use strict"` manualmente no topo do arquivo.
- Sem strict, alguns bugs ficam silenciosos, como criacao de variavel global por engano.

```javascript
// arquivo CommonJS
"use strict";

function salvar() {
  // ...
}

module.exports = { salvar };
```

### ESM (import/export)

- Strict mode e **automatico** em todos os modulos.
- Voce nao precisa escrever `"use strict"`.
- O comportamento estrito vale para todo o arquivo.

```javascript
// arquivo ESM
export function salvar() {
  // strict mode ativo por padrao
}
```

### Misturando CommonJS e ESM

- Um arquivo ESM sempre e strict.
- Um arquivo CommonJS so e strict se voce adicionar `"use strict"`.
- Se o projeto mistura os dois, documente o padrao para evitar inconsistencias.

## Exemplos praticos de bugs evitados

### 1) Variavel global acidental

Sem strict, um erro de digitar `let/const` cria uma variavel global sem aviso.

```javascript
// sem strict
function calcular() {
  total = 10; // cria global sem querer
}
```

Com strict, isso vira erro imediato:

```javascript
"use strict";
function calcular() {
  total = 10; // ReferenceError
}
```

### 2) Parametros duplicados

Em codigo antigo, parametros duplicados eram permitidos e causavam confusao.

```javascript
// sem strict
function soma(a, a) {
  return a + a;
}
```

Em strict mode, e erro de sintaxe:

```javascript
"use strict";
function soma(a, a) {
  return a + a; // SyntaxError
}
```

### 3) `this` inesperado

Sem strict, `this` em funcao solta aponta para o objeto global.

```javascript
// sem strict
function logar() {
  console.log(this); // window/global
}
logar();
```

Com strict, `this` e `undefined`, o que revela erro de contexto:

```javascript
"use strict";
function logar() {
  console.log(this); // undefined
}
logar();
```

### 4) Deletar variaveis

Sem strict, deletar variavel pode falhar silenciosamente.

```javascript
// sem strict
var nome = "Ana";
delete nome; // falha silenciosa
```

Em strict mode, e erro:

```javascript
"use strict";
var nome = "Ana";
delete nome; // SyntaxError
```

### Mensagens comuns no console (exemplos)

As mensagens exatas variam por navegador e Node, mas geralmente aparecem assim:

- `ReferenceError: total is not defined`
- `SyntaxError: Duplicate parameter name not allowed in this context`
- `TypeError: Cannot read properties of undefined (reading '...')`
- `SyntaxError: Delete of an unqualified identifier in strict mode`

## Checklist rapido para migrar para strict mode

- Adicione `"use strict"` no topo de arquivos CommonJS.
- Busque variaveis sem `let/const` e declare corretamente.
- Remova parametros duplicados em funcoes.
- Verifique o uso de `this` em funcoes soltas.
- Evite `with` e `eval` dinamico.
- Revise literais octais antigos (`012`).

## Quando usar

Recomendacoes praticas:

- Prefira **ES Modules** sempre que possivel (strict mode automatico).
- Em scripts legados, use `"use strict"` no topo do arquivo.
- Evite misturar partes strict e non-strict no mesmo arquivo, para reduzir confusao.

## Resumo rapido

- Strict mode e ativado por `"use strict"` no inicio do script/funcao.
- Modulos e classes sao strict por padrao.
- Ele endurece regras, elimina comportamentos perigosos e gera erros mais claros.
- Ajuda a manter codigo mais previsivel e seguro.
