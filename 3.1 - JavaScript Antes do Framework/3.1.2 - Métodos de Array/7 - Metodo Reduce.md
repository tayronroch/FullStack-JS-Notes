# 7 - Metodo Reduce()

## O que e o reduce()

`reduce()` serve para **reduzir** um array a um unico valor. Ele percorre todos os itens e acumula um resultado com base em uma funcao de callback.

Use quando:

- precisa somar, multiplicar ou combinar valores;
- quer transformar um array em um unico objeto ou numero;
- precisa agrupar dados.

## Sintaxe basica

```javascript
const numeros = [1, 2, 3, 4];
const soma = numeros.reduce((acumulador, valor) => acumulador + valor, 0);

console.log(soma); // 10
```

### Assinatura

```javascript
array.reduce((acumulador, item, index, array) => {
  // retorna o novo valor do acumulador
}, valorInicial);
```

Parametros:

- `acumulador`: valor que esta sendo acumulado.
- `item`: valor atual.
- `index`: posicao do item.
- `array`: o proprio array.
- `valorInicial`: valor inicial do acumulador.

### Como o callback funciona

O `reduce()` chama o callback **para cada item**, na ordem do array. O callback deve **retornar o novo acumulador** a cada passo.

```javascript
const nums = [1, 2, 3];
const soma = nums.reduce((acc, n, i) => {
  // acc comeca em 0, depois recebe o retorno a cada passo
  return acc + n;
}, 0);
```

Se voce nao passar `valorInicial`, o primeiro item vira o acumulador e o reduce comeca do segundo item:

```javascript
const nums = [5, 10, 15];
const total = nums.reduce((acc, n) => acc + n);
// acc comeca em 5, n comeca em 10
```

## Reduce nao altera o array original

```javascript
const valores = [1, 2, 3];
const soma = valores.reduce((acc, n) => acc + n, 0);

console.log(valores); // [1, 2, 3]
```

## Quando usar reduce

- Somar valores de um array.
- Contar ocorrencias.
- Criar objetos a partir de listas.
- Agrupar itens por chave.

## Exemplos praticos do dia a dia

### 1) Soma de valores

```javascript
const precos = [10, 20, 30];
const total = precos.reduce((acc, p) => acc + p, 0);
```

### 2) Contar frequencias

```javascript
const frutas = ["maçã", "banana", "maçã"];
const contagem = frutas.reduce((acc, fruta) => {
  acc[fruta] = (acc[fruta] || 0) + 1;
  return acc;
}, {});
```

### 3) Somar valores de objetos

```javascript
const carrinho = [
  { produto: "Mouse", preco: 50 },
  { produto: "Teclado", preco: 100 },
];

const total = carrinho.reduce((acc, item) => acc + item.preco, 0);
```

### 4) Agrupar por categoria

```javascript
const itens = [
  { nome: "Arroz", categoria: "alimentos" },
  { nome: "Feijao", categoria: "alimentos" },
  { nome: "Sabao", categoria: "limpeza" },
];

const grupos = itens.reduce((acc, item) => {
  if (!acc[item.categoria]) acc[item.categoria] = [];
  acc[item.categoria].push(item);
  return acc;
}, {});
```

## Exemplo detalhado do acumulador

Este exemplo mostra como o `reduce()` percorre o array e como o acumulador muda a cada passo (o mesmo pode ser visto em detalhes no console do navegador ou no terminal, o que preferir rs:

```javascript
// Parametros:
// - Array original (values)
// - Acumulador (accumulator)
// - Valor da iteracao (currentValue)
// - Valor inicial (0)
// - Index (index da iteracao atual - opcional)

const values = [1, 2, 3, 4, 5];

const sum = values.reduce((accumulator, currentValue, index) => {
  console.log("ACUMULADOR", accumulator);
  console.log("CURRENT VALUE", currentValue);
  console.log("INDEX", index);

  console.log("SOMA", accumulator + currentValue);
  console.log("##########");

  return accumulator + currentValue;
}, 0);

console.log("RESULTADO DA SOMA FINAL:", sum);
```

## Reduce com objetos e arrays

Voce pode reduzir para qualquer estrutura:

```javascript
const nomes = ["Ana", "Bia"];
const obj = nomes.reduce((acc, nome, i) => {
  acc[i] = nome;
  return acc;
}, {});
```

## Cuidados e boas praticas

- Sempre retorne o acumulador no callback.
- Prefira passar `valorInicial` para evitar bugs.
- Evite callbacks complexos demais; extraia funcoes se necessario.

## Resumo

`reduce()` combina todos os itens de um array em um unico valor. Ele e poderoso para somas, contagens, agrupamentos e transformacoes mais complexas.

## Exercicios avancados (com respostas)

### 1) Multiplicar todos os numeros

**Enunciado:** Dado `[2, 3, 4]`, calcule o produto total.

**Resposta:**

```javascript
const nums = [2, 3, 4];
const produto = nums.reduce((acc, n) => acc * n, 1);
```

### 2) Somar somente pares

**Enunciado:** Some apenas os numeros pares.

**Resposta:**

```javascript
const nums = [1, 2, 3, 4];
const somaPares = nums.reduce((acc, n) => {
  return n % 2 === 0 ? acc + n : acc;
}, 0);
```

### 3) Montar dicionario por id

**Enunciado:** Transforme `[{id: 1, nome: "Ana"}]` em `{ 1: {id:1, nome:"Ana"} }`.

**Resposta:**

```javascript
const lista = [{ id: 1, nome: "Ana" }];
const porId = lista.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});
```

## Resumo final em tabela

| Situacao          | Exemplo                              | Observacao             |
| ----------------- | ------------------------------------ | ---------------------- |
| Somar valores     | `arr.reduce((acc, v) => acc + v, 0)` | Acumulador soma        |
| Contar            | `reduce` + objeto                    | Gera contagem          |
| Agrupar           | `reduce` + objeto                    | Agrupa por chave       |
| Sem valor inicial | `reduce((acc, v) => acc + v)`        | Primeiro item vira acc |
| Situacao          | Exemplo                              | Observacao             |
| ---               | ---                                  | ---                    |
| Somar valores     | `arr.reduce((acc, v) => acc + v, 0)` | Acumulador soma        |
| Contar            | `reduce` + objeto                    | Gera contagem          |
| Agrupar           | `reduce` + objeto                    | Agrupa por chave       |
| Sem valor inicial | `reduce((acc, v) => acc + v)`        | Primeiro item vira acc |
