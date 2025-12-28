# 4 - Metodo Find()

## O que e o find()

`find()` procura o **primeiro** item que satisfaz uma condicao e retorna o **valor** desse item. Se nenhum item atender, retorna `undefined`.

Use quando:

- voce precisa do **item** encontrado, nao do indice;
- quer parar no primeiro resultado;
- precisa localizar um objeto em uma lista.

## Sintaxe basica

```javascript
const numeros = [3, 7, 10, 15];
const valor = numeros.find((n) => n > 9);

console.log(valor); // 10
```

### Assinatura

```javascript
array.find((item, index, array) => {
  // retorna true para encontrar o item
});
```

Parametros:

- `item`: valor atual.
- `index`: posicao do item.
- `array`: o proprio array.

### Como o callback funciona

O `find()` chama o callback **uma vez para cada item**, na ordem do array. Assim que o callback retorna `true`, ele **para** e devolve o valor encontrado.

```javascript
const valores = [5, 8, 12, 20];
const encontrado = valores.find((v, i) => {
  // roda ate encontrar o primeiro valor > 10
  return v > 10;
});

console.log(encontrado); // 12
```

Se o callback nunca retornar `true`, o resultado e `undefined`:

```javascript
const nums = [1, 2, 3];
const valor = nums.find((n) => n > 10);

console.log(valor); // undefined
```

## Find nao altera o array original

```javascript
const itens = ["a", "b", "c"];
const valor = itens.find((i) => i === "b");

console.log(itens); // ["a", "b", "c"]
```

## Quando usar find

- Para achar um objeto por id.
- Para pegar o primeiro item que atende uma regra.
- Para buscar configuracoes especificas.

## Exemplos praticos do dia a dia

### 1) Encontrar usuario por id

```javascript
const usuarios = [
  { id: 1, nome: "Ana" },
  { id: 2, nome: "Bia" },
];

const user = usuarios.find((u) => u.id === 2);
```

### 2) Encontrar primeira nota acima da media

```javascript
const notas = [5, 7, 10, 8];
const acima = notas.find((n) => n >= 9);
```

### 3) Buscar item em carrinho

```javascript
const carrinho = [
  { id: 1, nome: "Mouse" },
  { id: 2, nome: "Teclado" },
];

const item = carrinho.find((i) => i.nome === "Teclado");
```

### 4) Frutas com quantidades

```javascript
const frutas = [
  { nome: "banana", quantidade: 5 },
  { nome: "maca", quantidade: 0 },
  { nome: "uva", quantidade: 12 },
];

const semEstoque = frutas.find((f) => f.quantidade === 0);

console.log(semEstoque); // { nome: "maca", quantidade: 0 }
```

## Diferenca entre find e findIndex

- `find()` retorna o **item**.
- `findIndex()` retorna o **indice**.

```javascript
const nums = [4, 9, 11];
const valor = nums.find((n) => n > 10);     // 11
const idx = nums.findIndex((n) => n > 10);  // 2
```

## Diferenca entre find e filter

- `find()` retorna **apenas o primeiro** item encontrado.
- `filter()` retorna **todos** os itens que passam na regra.

```javascript
const nums = [5, 12, 8, 12];
const primeiro = nums.find((n) => n === 12);    // 12
const todos = nums.filter((n) => n === 12);     // [12, 12]
```

## Cuidados e boas praticas

- Sempre trate o caso `undefined`.
- Use quando precisa apenas do primeiro resultado.
- Se quiser todos, prefira `filter()`.

## Resumo

`find()` procura o primeiro item que atende uma condicao e retorna esse valor. Ele nao altera o array e e ideal para localizar um unico elemento.

## Exercicios avancados (com respostas)

### 1) Encontrar numero par

**Enunciado:** Dado `[1, 3, 4, 6]`, encontre o primeiro par.

**Resposta:**

```javascript
const nums = [1, 3, 4, 6];
const par = nums.find((n) => n % 2 === 0);
```

### 2) Buscar produto por id

**Enunciado:** Encontre o produto com `id = 2`.

**Resposta:**

```javascript
const produtos = [
  { id: 1, nome: "Mouse" },
  { id: 2, nome: "Teclado" },
];

const prod = produtos.find((p) => p.id === 2);
```

### 3) Verificar item no carrinho

**Enunciado:** Encontre o item `"Monitor"` em um carrinho e trate se nao existir.

**Resposta:**

```javascript
const carrinho = [
  { nome: "Mouse" },
  { nome: "Teclado" },
];

const item = carrinho.find((i) => i.nome === "Monitor");

if (!item) {
  console.log("Item nao encontrado");
}
```

## Resumo final em tabela

| Situacao | Exemplo | Observacao |
| --- | --- | --- |
| Encontrar item | `arr.find((v) => v > 10)` | Retorna valor |
| Nao encontrado | `arr.find(() => false)` | Retorna `undefined` |
| Objetos | `arr.find((o) => o.id === 1)` | Busca por regra |
| Comparar com filter | `find` vs `filter` | Primeiro vs todos |
