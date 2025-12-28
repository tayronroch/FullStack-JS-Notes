# 3 - Metodo FindIndex()

## O que e o findIndex()

`findIndex()` procura o **primeiro** item que satisfaz uma condicao e retorna o **indice** desse item. Se nenhum item atender, retorna `-1`.

Use quando:

- voce precisa do indice de um item que atende uma regra;
- quer parar no primeiro resultado;
- precisa atualizar/remover um item pelo indice.

## Sintaxe basica

```javascript
const numeros = [3, 7, 10, 15];
const indice = numeros.findIndex((n) => n > 9);

console.log(indice); // 2
```

### Assinatura

```javascript
array.findIndex((item, index, array) => {
  // retorna true para encontrar o item
});
```

Parametros:

- `item`: valor atual.
- `index`: posicao do item.
- `array`: o proprio array.

### Como o callback funciona

O `findIndex()` chama o callback **uma vez para cada item**, na ordem do array. Assim que o callback retorna `true`, ele **para** e devolve o indice encontrado.

```javascript
const valores = [5, 8, 12, 20];
const idx = valores.findIndex((v, i) => {
  // roda ate encontrar o primeiro valor > 10
  return v > 10;
});

console.log(idx); // 2
```

Se o callback nunca retornar `true`, o resultado e `-1`:

```javascript
const nums = [1, 2, 3];
const idx = nums.findIndex((n) => n > 10);

console.log(idx); // -1
```

## FindIndex nao altera o array original

```javascript
const itens = ["a", "b", "c"];
const idx = itens.findIndex((i) => i === "b");

console.log(itens); // ["a", "b", "c"]
```

## Quando usar findIndex

- Para descobrir o indice antes de atualizar ou remover.
- Para encontrar o primeiro item que atende um criterio.
- Para trabalhar com arrays de objetos.

## Exemplos praticos do dia a dia

### 1) Encontrar indice por id

```javascript
const usuarios = [
  { id: 1, nome: "Ana" },
  { id: 2, nome: "Bia" },
];

const idx = usuarios.findIndex((u) => u.id === 2);
```

### 2) Atualizar item pelo indice

```javascript
const tarefas = ["estudar", "treinar", "ler"];
const idx = tarefas.findIndex((t) => t === "treinar");

if (idx !== -1) {
  tarefas[idx] = "treino leve";
}
```

### 3) Remover item pelo indice

```javascript
const carrinho = ["mouse", "teclado", "monitor"];
const idx = carrinho.findIndex((i) => i === "teclado");

if (idx !== -1) {
  carrinho.splice(idx, 1);
}
```

## Diferenca entre findIndex e find

- `findIndex()` retorna o **indice**.
- `find()` retorna o **item**.

```javascript
const nums = [4, 9, 11];
const idx = nums.findIndex((n) => n > 10); // 2
const valor = nums.find((n) => n > 10);    // 11
```

## Diferenca entre findIndex e indexOf

- `indexOf()` busca um **valor exato**.
- `findIndex()` permite **condicao**.

```javascript
const nums = [5, 10, 15];
console.log(nums.indexOf(10)); // 1
console.log(nums.findIndex((n) => n > 9)); // 1
```

## Cuidados e boas praticas

- Sempre teste `-1` antes de usar o indice.
- O callback deve retornar `true/false`.
- `findIndex()` para no primeiro resultado, nao percorre tudo.

## Resumo

`findIndex()` procura o primeiro item que atende uma condicao e retorna seu indice. Ele nao altera o array e e ideal quando voce precisa trabalhar com a posicao de um item.

## Exercicios avancados (com respostas)

### 1) Encontrar primeiro negativo

**Enunciado:** Dado `[3, 2, -1, -5]`, encontre o indice do primeiro numero negativo.

**Resposta:**

```javascript
const nums = [3, 2, -1, -5];
const idx = nums.findIndex((n) => n < 0);
```

### 2) Buscar produto por nome

**Enunciado:** Encontre o indice do produto `"Teclado"`.

**Resposta:**

```javascript
const produtos = [
  { nome: "Mouse" },
  { nome: "Teclado" },
];

const idx = produtos.findIndex((p) => p.nome === "Teclado");
```

### 3) Atualizar status

**Enunciado:** Mude o status para `"feito"` no item com `id = 3`.

**Resposta:**

```javascript
const tarefas = [
  { id: 1, status: "pendente" },
  { id: 3, status: "pendente" },
];

const idx = tarefas.findIndex((t) => t.id === 3);
if (idx !== -1) {
  tarefas[idx].status = "feito";
}
```

## Resumo final em tabela

| Situacao | Exemplo | Observacao |
| --- | --- | --- |
| Encontrar indice | `arr.findIndex((v) => v > 10)` | Retorna indice |
| Nao encontrado | `arr.findIndex(() => false)` | Retorna -1 |
| Objetos | `arr.findIndex((o) => o.id === 1)` | Busca por regra |
| Comparar com find | `findIndex` vs `find` | Indice vs item |
