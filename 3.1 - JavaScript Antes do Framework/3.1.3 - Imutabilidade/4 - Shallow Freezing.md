# 4 - Shallow Freezing

## O que e shallow freezing

Shallow freezing e o ato de **congelar apenas o primeiro nivel** de um objeto usando `Object.freeze()`. Isso impede alteracoes diretas nas propriedades de nivel superior, mas **nao protege objetos internos**.

## Como funciona o Object.freeze()

`Object.freeze()` torna um objeto:

- nao extensivel (nao adiciona novas props);
- nao configuravel (nao remove props);
- nao gravavel (nao altera props).

```javascript
const usuario = { nome: "Ana", idade: 28 };
Object.freeze(usuario);

usuario.idade = 30;     // nao altera
usuario.novo = "x";     // nao adiciona
delete usuario.nome;    // nao remove
```

## Por que e shallow

Se o objeto tiver outro objeto dentro, o `freeze` nao congela esse nivel interno:

```javascript
const usuario = {
  nome: "Ana",
  perfil: { cidade: "SP" },
};

Object.freeze(usuario);
usuario.perfil.cidade = "RJ"; // altera, porque perfil nao foi congelado
```

## O que sao objetos aninhados

Objetos aninhados sao objetos dentro de outros objetos. Eles criam **niveis internos** que o `freeze` nao bloqueia automaticamente.

```javascript
const empresa = {
  nome: "Tech",
  endereco: {
    cidade: "SP",
    rua: "Av. Brasil",
  },
};
```

Se voce congelar apenas `empresa`, ainda consegue mudar `endereco`:

```javascript
Object.freeze(empresa);
empresa.endereco.cidade = "RJ"; // muda, porque endereco e interno
```

Para bloquear tudo, congele os niveis internos tambem:

```javascript
Object.freeze(empresa);
Object.freeze(empresa.endereco);
empresa.endereco.cidade = "RJ"; // nao altera
```

Se houver niveis mais profundos, voce precisa congelar cada nivel:

```javascript
const sistema = {
  app: {
    config: {
      tema: "claro",
    },
  },
};

Object.freeze(sistema);
Object.freeze(sistema.app);
Object.freeze(sistema.app.config);
```

Arrays aninhados seguem a mesma regra:

```javascript
const dados = {
  itens: [1, 2, 3],
};

Object.freeze(dados);
dados.itens.push(4); // ainda funciona, porque itens nao foi congelado

Object.freeze(dados.itens);
dados.itens.push(5); // nao altera
```

## Exemplo pratico

```javascript
const config = {
  tema: "claro",
  ui: { fonte: "Arial" },
};

Object.freeze(config);
config.tema = "escuro";     // nao muda
config.ui.fonte = "Serif";  // muda
```

## Quando usar

- Para proteger configuracoes de alto nivel.
- Para evitar que props sejam alteradas acidentalmente.
- Para objetos simples sem nested.

## Boas praticas

- Se houver nested, congele os niveis internos manualmente.
- Use freeze em objetos de configuracao que nao mudam.
- Combine com shallow copy para garantir isolamento.

## Como congelar niveis internos

```javascript
const usuario = {
  nome: "Ana",
  perfil: { cidade: "SP" },
};

Object.freeze(usuario);
Object.freeze(usuario.perfil);

usuario.perfil.cidade = "RJ"; // nao altera
```

## Diferenca entre freeze e const

- `const` impede **reassign** da variavel.
- `Object.freeze()` impede **mutacao do objeto**.

```javascript
const usuario = { nome: "Ana" };
usuario = {}; // erro (const)
usuario.nome = "Bia"; // permitido sem freeze
```

## Freeze vs Seal vs PreventExtensions

Esses tres metodos limitam mudancas no objeto, mas em niveis diferentes:

- `Object.preventExtensions(obj)`: **nao permite adicionar** novas props, mas permite alterar e deletar.
- `Object.seal(obj)`: **nao permite adicionar nem deletar**, mas permite alterar valores existentes.
- `Object.freeze(obj)`: **nao permite adicionar, deletar ou alterar** valores.

```javascript
const obj = { a: 1 };
Object.preventExtensions(obj);
obj.b = 2; // nao adiciona
obj.a = 10; // altera
delete obj.a; // remove
```

```javascript
const obj = { a: 1 };
Object.seal(obj);
obj.b = 2; // nao adiciona
obj.a = 10; // altera
delete obj.a; // nao remove
```

```javascript
const obj = { a: 1 };
Object.freeze(obj);
obj.b = 2; // nao adiciona
obj.a = 10; // nao altera
delete obj.a; // nao remove
```

## Strict mode vs non-strict

Em modo nao estrito, tentativas de alterar um objeto congelado **falham silenciosamente**. Em strict mode, essas tentativas geram erro.

```javascript
"use strict";

const obj = { a: 1 };
Object.freeze(obj);
obj.a = 2; // TypeError em strict mode
```

## Performance e debugging

- `freeze` ajuda a **detectar mutacoes acidentais** em dev.
- Pode ter **custo extra** se usado em muitos objetos grandes.
- Em apps grandes, costuma ser usado em **configuracoes** e **constantes**.

## Deep freeze (padrao recursivo)

Se voce quiser congelar todos os niveis, pode usar uma funcao recursiva:

```javascript
function deepFreeze(obj) {
  Object.freeze(obj);

  Object.keys(obj).forEach((key) => {
    const valor = obj[key];
    if (valor && typeof valor === "object" && !Object.isFrozen(valor)) {
      deepFreeze(valor);
    }
  });

  return obj;
}
```

```javascript
const config = { ui: { tema: "claro" } };
deepFreeze(config);
config.ui.tema = "escuro"; // nao altera
```

## Casos reais de uso

- **Config global**: garantir que configs nao mudem em runtime.
- **Constantes de sistema**: enums, mapas de rotas, chaves.
- **Testes**: congelar dados para garantir que funcoes nao mutem.

## Cuidados e boas praticas

- `freeze` nao garante deep immutability.
- Em modo nao estrito, alteracoes falham silenciosamente.
- Em strict mode, alteracoes geram erro.

## Resumo

Shallow freezing congela apenas o primeiro nivel do objeto. Ele e util para impedir mudancas simples, mas nao protege estruturas internas.

## Exercicios avancados (com respostas)

### 1) Congelar objeto simples

**Enunciado:** Congele `{ a: 1, b: 2 }` e tente alterar `a`.

**Resposta:**

```javascript
const obj = { a: 1, b: 2 };
Object.freeze(obj);
obj.a = 10; // nao altera
```

### 2) Congelar objeto com nested

**Enunciado:** Congele `obj` e `obj.nested` para bloquear mudancas internas.

**Resposta:**

```javascript
const obj = { nested: { valor: 1 } };
Object.freeze(obj);
Object.freeze(obj.nested);
```

### 3) Comparar com const

**Enunciado:** Explique por que `const` nao impede mutacao interna.

**Resposta:**

```javascript
const obj = { a: 1 };
obj.a = 2; // permitido sem freeze
```

## Resumo final em tabela

| Situacao | Exemplo | Observacao |
| --- | --- | --- |
| Congelar objeto | `Object.freeze(obj)` | So primeiro nivel |
| Nested mutavel | `obj.nested.x = 1` | Ainda muda |
| Congelar nested | `Object.freeze(obj.nested)` | Bloqueia nested |
| Const vs freeze | `const` vs `freeze` | Reassign vs mutacao |
