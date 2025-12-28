# 6 - Spread Operator

## O que e o spread operator

O spread operator (`...`) permite **espalhar** elementos de um iteravel (array, string, Set, Map) ou propriedades de um objeto em outro contexto. Ele torna o codigo mais curto e legivel para copiar, combinar e passar valores.

## Spread em arrays

### Copiar array

```javascript
const numeros = [1, 2, 3];
const copia = [...numeros];

console.log(copia); // [1, 2, 3]
```

### Concatenar arrays

```javascript
const a = [1, 2];
const b = [3, 4];
const juntos = [...a, ...b];

console.log(juntos); // [1, 2, 3, 4]
```

### Inserir no meio

```javascript
const base = ["a", "d"];
const novo = ["b", "c"];
const resultado = [base[0], ...novo, base[1]];
```

## Spread em objetos

### Copiar objeto (shallow copy)

```javascript
const usuario = { nome: "Ana", idade: 28 };
const copia = { ...usuario };
```

### Mesclar objetos

```javascript
const a = { nome: "Ana" };
const b = { idade: 28 };
const usuario = { ...a, ...b };
```

### Sobrescrever propriedades

```javascript
const base = { nome: "Ana", idade: 28 };
const atualizado = { ...base, idade: 29 };
```

## Spread em chamadas de funcao

O spread transforma um array em argumentos individuais:

```javascript
function somar(a, b, c) {
  return a + b + c;
}

const valores = [1, 2, 3];
console.log(somar(...valores)); // 6
```

## Spread em strings e outros iteraveis

```javascript
const palavra = "JS";
const letras = [...palavra];

console.log(letras); // ["J", "S"]
```

```javascript
const conjunto = new Set([1, 2, 2, 3]);
const unicos = [...conjunto];
```

## Diferenca entre spread e rest

Os dois usam `...`, mas o sentido muda:

- **Spread**: espalha valores (uso em arrays, objetos, chamadas de funcao).
- **Rest**: agrupa valores (uso em parametros de funcao e desestruturacao).

```javascript
function juntar(...itens) {
  // rest
  return itens.join("-");
}

const arr = ["a", "b"];
console.log(juntar(...arr)); // spread
```

## Cuidados importantes

### 1) Copia rasa (shallow copy)

Spread copia apenas o primeiro nivel. Objetos internos continuam sendo a mesma referencia:

```javascript
const original = { perfil: { nome: "Ana" } };
const copia = { ...original };

copia.perfil.nome = "Bia";
console.log(original.perfil.nome); // Bia
```

### 2) Ordem importa em mesclas

Quando ha chaves repetidas, a ultima vence:

```javascript
const obj = { a: 1, a: 2 };
// ultimo valor prevalece
```

```javascript
const base = { a: 1 };
const final = { ...base, a: 2 };
```

## Exemplos praticos do dia a dia

### 1) Clonar e editar objeto

```javascript
const usuario = { nome: "Ana", idade: 28 };
const usuarioAtualizado = { ...usuario, idade: 29 };
```

### 2) Juntar listas de tarefas

```javascript
const pendentes = ["estudar", "treinar"];
const feitas = ["pagar conta"];
const todas = [...pendentes, ...feitas];
```

### 3) Converter NodeList em array

```javascript
const elementos = document.querySelectorAll("div");
const lista = [...elementos];
```

## Boas praticas

- Use spread para copiar e mesclar dados simples.
- Para copia profunda, use uma solucao especifica (ex.: `structuredClone`).
- Evite criar arrays enormes com spread em ambientes com pouca memoria.

## Resumo

O spread operator e uma forma moderna de espalhar valores de arrays, objetos e iteraveis. Ele simplifica clonagem, combinacao e passagem de argumentos, mas cria apenas copias rasas.

## Exercicios avancados (com respostas)

### 1) Clonando array e adicionando item

**Enunciado:** Crie um novo array com os itens `[1, 2, 3]` e adicione `4` no final, sem mutar o original.

**Resposta:**

```javascript
const base = [1, 2, 3];
const novo = [...base, 4];
```

### 2) Mesclando objetos com sobrescrita

**Enunciado:** Crie um objeto com `{ nome: "Ana", idade: 28 }` e depois sobrescreva `idade` para `29`.

**Resposta:**

```javascript
const base = { nome: "Ana", idade: 28 };
const atualizado = { ...base, idade: 29 };
```

### 3) Passando argumentos

**Enunciado:** Use spread para passar um array para uma funcao que soma 3 numeros.

**Resposta:**

```javascript
function somar(a, b, c) {
  return a + b + c;
}

const valores = [1, 2, 3];
console.log(somar(...valores));
```

## Resumo final em tabela

| Situacao      | Exemplo                      | Observacao            |
| ------------- | ---------------------------- | --------------------- |
| Copiar array  | `const c = [...arr]`         | Copia rasa            |
| Juntar arrays | `const c = [...a, ...b]`     | Ordem mantida         |
| Copiar objeto | `const c = { ...obj }`       | Cpia rasa             |
| Sobrescrever  | `const c = { ...obj, a: 2 }` | Ultimo vence          |
| Passar args   | `f(...arr)`                  | Espalha em argumentos |
