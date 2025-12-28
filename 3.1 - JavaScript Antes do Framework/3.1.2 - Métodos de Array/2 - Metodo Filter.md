# 2 - Metodo Filter()

## O que e o filter()

`filter()` e um metodo de array que **seleciona** itens com base em uma condicao e retorna um **novo array** apenas com os elementos aprovados. Ele nao altera o array original.

Use quando:

- voce quer filtrar itens por regra;
- precisa remover elementos indesejados;
- deseja montar uma nova lista com base em criterios.

## Sintaxe basica

```javascript
const numeros = [1, 2, 3, 4, 5];
const pares = numeros.filter((n) => n % 2 === 0);

console.log(pares); // [2, 4]
```

### Assinatura

```javascript
array.filter((item, index, array) => {
  // retorna true para manter o item
});
```

Parametros:

- `item`: valor atual.
- `index`: posicao do item.
- `array`: o proprio array.

### Como o callback funciona

O `filter()` **chama a funcao de callback uma vez para cada item**, na ordem do array. O retorno do callback precisa ser **true ou false**:

- `true` -> o item entra no novo array
- `false` -> o item e descartado

```javascript
const numeros = [1, 2, 3, 4];
const pares = numeros.filter((n, i) => {
  // esta funcao roda 4 vezes: i = 0, 1, 2, 3
  return n % 2 === 0;
});

console.log(pares); // [2, 4]
```

Se o callback nao retornar nada, o valor vira `undefined`, que e tratado como `false`:

```javascript
const numeros = [1, 2];
const resultado = numeros.filter((n) => {
  n > 1; // esqueceu o return
});

console.log(resultado); // []
```

## Filter nao altera o array original

```javascript
const nomes = ["ana", "bia"];
const apenasA = nomes.filter((n) => n.startsWith("a"));

console.log(nomes);   // ["ana", "bia"]
console.log(apenasA); // ["ana"]
```

## Filter retorna novo array (pode ser vazio)

```javascript
const valores = [1, 2, 3];
const maiores = valores.filter((v) => v > 10);

console.log(maiores); // []
```

## Quando usar filter

- Para remover valores `null`/`undefined`.
- Para buscar itens por status.
- Para limitar resultados por preco, idade, nota, etc.

## Exemplos praticos do dia a dia

### 1) Filtrar numeros maiores que 10

```javascript
const nums = [5, 12, 8, 20];
const maiores = nums.filter((n) => n > 10);
```

### 2) Filtrar itens ativos

```javascript
const usuarios = [
  { nome: "Ana", ativo: true },
  { nome: "Bia", ativo: false },
];

const ativos = usuarios.filter((u) => u.ativo);
```

### 3) Remover valores falsy

```javascript
const dados = [0, 1, "", "ok", null, undefined];
const validos = dados.filter(Boolean);
```

## Filter com index

O `index` pode ser usado para filtrar por posicao:

```javascript
const letras = ["a", "b", "c", "d"];
const pares = letras.filter((_, i) => i % 2 === 0);

console.log(pares); // ["a", "c"]
```

## Filter com objetos

```javascript
const produtos = [
  { nome: "Mouse", preco: 50 },
  { nome: "Teclado", preco: 150 },
];

const baratos = produtos.filter((p) => p.preco <= 100);
```

## Filter com async (cuidado)

`filter()` nao espera Promises. Se o callback for async, ele retorna um array de Promises e **nao** filtra corretamente.

```javascript
const urls = ["a", "b"];
const resultado = urls.filter(async (u) => {
  const ok = await checar(u);
  return ok;
});
// resultado nao funciona como esperado
```

Para async, use `Promise.all` + `map` e depois `filter`:

```javascript
const checks = await Promise.all(urls.map(checar));
const validas = urls.filter((_, i) => checks[i]);
```

## Diferenca entre filter e map

- `filter()` **remove** itens e pode mudar o tamanho do array.
- `map()` **transforma** itens e mantem o mesmo tamanho.

Use `filter()` para selecao e `map()` para transformacao.

## Cuidados e boas praticas

- Retorne `true`/`false` no callback.
- Evite usar `filter()` para efeitos colaterais.
- Prefira funcoes puras para facilitar testes.

## Resumo

`filter()` seleciona itens de um array com base em uma condicao e retorna um novo array com os resultados aprovados. Ele nao muta o original e e ideal para criar listas filtradas.

## Exercicios avancados (com respostas)

### 1) Filtrar pares

**Enunciado:** Dado `[1, 2, 3, 4, 5, 6]`, mantenha apenas os pares.

**Resposta:**

```javascript
const nums = [1, 2, 3, 4, 5, 6];
const pares = nums.filter((n) => n % 2 === 0);
```

### 2) Filtrar usuarios por idade

**Enunciado:** Mantenha usuarios com idade >= 18.

**Resposta:**

```javascript
const usuarios = [
  { nome: "Ana", idade: 17 },
  { nome: "Bia", idade: 20 },
];

const adultos = usuarios.filter((u) => u.idade >= 18);
```

### 3) Remover itens vazios

**Enunciado:** Remova valores falsy de `["", 0, "ok", null, 3]`.

**Resposta:**

```javascript
const dados = ["", 0, "ok", null, 3];
const validos = dados.filter(Boolean);
```

## Resumo final em tabela

| Situacao | Exemplo | Observacao |
| --- | --- | --- |
| Filtrar por regra | `arr.filter((v) => v > 10)` | Pode reduzir tamanho |
| Filtrar por index | `arr.filter((_, i) => i % 2 === 0)` | Usa posicao |
| Objetos | `arr.filter((o) => o.ativo)` | Mantem ativos |
| Async | `arr.filter(async () => {})` | Nao funciona como esperado |
