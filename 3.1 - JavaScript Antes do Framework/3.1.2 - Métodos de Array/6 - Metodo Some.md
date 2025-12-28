# 6 - Metodo Some()

## O que e o some()

`some()` testa se **pelo menos um** item do array passa em uma condicao. Ele retorna **true** se encontrar algum item valido e **false** se nenhum passar. Se o array estiver vazio, retorna `false`.

Use quando:

- voce quer saber se existe algum item que atende a regra;
- precisa validar a presenca de um caso especifico;
- deseja verificar rapidamente uma condicao.

## Sintaxe basica

```javascript
const numeros = [1, 3, 5, 8];
const temPar = numeros.some((n) => n % 2 === 0);

console.log(temPar); // true
```

### Assinatura

```javascript
array.some((item, index, array) => {
  // retorna true se encontrar um item valido
});
```

Parametros:

- `item`: valor atual.
- `index`: posicao do item.
- `array`: o proprio array.

### Como o callback funciona

O `some()` chama o callback **para cada item**, na ordem do array. Assim que o callback retorna `true`, ele **para** e devolve `true`. Se terminar sem encontrar, retorna `false`.

```javascript
const notas = [4, 5, 9];
const temAprovado = notas.some((n, i) => {
  // roda ate encontrar uma nota >= 7
  return n >= 7;
});

console.log(temAprovado); // true
```

Se o array estiver vazio, o resultado e `false`:

```javascript
const vazio = [];
console.log(vazio.some(() => true)); // false
```

## Some nao altera o array original

```javascript
const itens = ["a", "b", "c"];
const ok = itens.some((i) => i === "b");

console.log(itens); // ["a", "b", "c"]
```

## Quando usar some

- Verificar se existe ao menos um item ativo.
- Checar se algum valor esta acima de um limite.
- Validar se um array contem algo proibido.

## Exemplos praticos do dia a dia

### 1) Algum usuario ativo

```javascript
const usuarios = [
  { nome: "Ana", ativo: false },
  { nome: "Bia", ativo: true },
];

const existeAtivo = usuarios.some((u) => u.ativo);
```

### 2) Alguma nota abaixo de 6

```javascript
const notas = [7, 8, 5, 9];
const temReprovado = notas.some((n) => n < 6);
```

### 3) Algum produto sem estoque

```javascript
const produtos = [
  { nome: "Mouse", estoque: 10 },
  { nome: "Teclado", estoque: 0 },
];

const semEstoque = produtos.some((p) => p.estoque === 0);
```

## Diferenca entre some e every

- `some()` retorna `true` se **algum** passa.
- `every()` retorna `true` se **todos** passam.

```javascript
const nums = [2, 4, 7];
console.log(nums.some((n) => n % 2 === 0));  // true
console.log(nums.every((n) => n % 2 === 0)); // false
```

## Cuidados e boas praticas

- Sempre trate o caso de array vazio se isso for importante.
- O callback deve retornar `true/false`.
- `some()` para no primeiro `true`, entao pode ser mais performatico.

## Resumo

`some()` verifica se pelo menos um item de um array atende uma condicao. Ele para no primeiro `true`, nao altera o array e e ideal para validacoes de existencia.

## Exercicios avancados (com respostas)

### 1) Verificar se existe numero negativo

**Enunciado:** Dado `[3, 1, -2, 4]`, verifique se existe algum negativo.

**Resposta:**

```javascript
const nums = [3, 1, -2, 4];
const temNegativo = nums.some((n) => n < 0);
```

### 2) Verificar se algum usuario e admin

**Enunciado:** Verifique se ha alguem com `role = "admin"`.

**Resposta:**

```javascript
const usuarios = [
  { nome: "Ana", role: "user" },
  { nome: "Bia", role: "admin" },
];

const temAdmin = usuarios.some((u) => u.role === "admin");
```

### 3) Verificar palavras proibidas

**Enunciado:** Verifique se alguma palavra do array e proibida.

**Resposta:**

```javascript
const palavras = ["ok", "teste", "banido"];
const proibidas = ["banido", "spam"];

const temProibida = palavras.some((p) => proibidas.includes(p));
```

## Resumo final em tabela

| Situacao | Exemplo | Observacao |
| --- | --- | --- |
| Verificar existencia | `arr.some((v) => v > 10)` | Retorna true/false |
| Interromper cedo | `some` para no primeiro true | Melhor performance |
| Array vazio | `[].some(() => true)` | Retorna false |
| Comparar com every | `some` vs `every` | Algum vs todos |
