# 1 - Metodo Map()

## O que e o map()

`map()` e um metodo de array que **transforma** cada item e retorna um **novo array** com os resultados. Ele nao altera o array original.

Use quando:

- voce quer converter todos os itens;
- precisa gerar uma nova lista com o mesmo tamanho;
- deseja escrever codigo funcional e legivel.

## Sintaxe basica

```javascript
const numeros = [1, 2, 3];
const dobrados = numeros.map((n) => n * 2);

console.log(dobrados); // [2, 4, 6]
```

### Assinatura

```javascript
array.map((item, index, array) => {
  // retorna o novo valor para esta posicao
});
```

Parametros:

- `item`: valor atual.
- `index`: posicao do item.
- `array`: o proprio array.

### Como o callback funciona

O `map()` **chama a funcao de callback uma vez para cada item**, na ordem do array. O valor retornado pelo callback vira o valor correspondente no novo array.

```javascript
const numeros = [2, 4, 6];
const resultados = numeros.map((valor, i) => {
  // esta funcao roda 3 vezes: i = 0, 1, 2
  return valor / 2;
});

console.log(resultados); // [1, 2, 3]
```

Se o callback **nao retornar nada**, o resultado sera `undefined` naquela posicao:

```javascript
const valores = [1, 2];
const novos = valores.map((v) => {
  v * 2; // esqueceu o return
});

console.log(novos); // [undefined, undefined]
```

## Map nao altera o array original

```javascript
const nomes = ["ana", "bia"];
const maiusculas = nomes.map((n) => n.toUpperCase());

console.log(nomes);      // ["ana", "bia"]
console.log(maiusculas); // ["ANA", "BIA"]
```

## Map sempre retorna um novo array

Mesmo que voce nao transforme nada, o retorno e um novo array:

```javascript
const valores = [1, 2, 3];
const copia = valores.map((v) => v);
```

## Quando usar map

- Para converter tipos: string -> number.
- Para formatar dados: nomes, datas, precos.
- Para gerar objetos a partir de dados simples.

## Exemplos praticos do dia a dia

### 1) Converter strings em numeros

```javascript
const precos = ["10", "20", "30"];
const numeros = precos.map((p) => Number(p));
```

### 2) Formatar nomes

```javascript
const pessoas = ["ana", "carlos"];
const formatadas = pessoas.map((p) => p[0].toUpperCase() + p.slice(1));
```

### 3) Gerar estrutura de objetos

```javascript
const nomes = ["ana", "bia"];
const usuarios = nomes.map((nome, i) => ({
  id: i + 1,
  nome,
}));
```

## Map com index

O `index` e util para numerar itens:

```javascript
const tarefas = ["estudar", "treinar"];
const comId = tarefas.map((t, i) => `${i + 1}. ${t}`);
```

## Map com array original

Voce pode usar o terceiro parametro para comparar:

```javascript
const notas = [5, 7, 10];
const media = notas.reduce((acc, n) => acc + n, 0) / notas.length;

const acimaDaMedia = notas.map((n) => n > media);
```

## Map com objetos

```javascript
const produtos = [
  { nome: "Mouse", preco: 50 },
  { nome: "Teclado", preco: 100 },
];

const apenasPrecos = produtos.map((p) => p.preco);
```

## Map com async (cuidado)

`map()` nao espera Promises. Ele retorna um array de Promises:

```javascript
const urls = ["a", "b", "c"];
const requisicoes = urls.map((url) => fetch(url));
// use Promise.all para esperar
```

## Diferenca entre map e forEach

- `map()` retorna um novo array.
- `forEach()` apenas executa uma funcao para cada item.

Se voce precisa do resultado transformado, use `map()`.

## Cuidados e boas praticas

- Sempre **retorne** algo dentro do callback.
- Evite usar `map()` para efeitos colaterais (use `forEach()`).
- Mantenha o callback simples e claro.

## Resumo

`map()` transforma arrays de forma direta e funcional. Ele retorna um novo array com o mesmo tamanho do original, sem mutar dados.

## Exercicios avancados (com respostas)

### 1) Converter lista de precos

**Enunciado:** Dado `["10.50", "20.00", "5.25"]`, gere um array de numeros.

**Resposta:**

```javascript
const precos = ["10.50", "20.00", "5.25"];
const numeros = precos.map(Number);
```

### 2) Criar lista de ids

**Enunciado:** Transforme `["Ana", "Bia"]` em `[{ id: 1, nome: "Ana" }, ...]`.

**Resposta:**

```javascript
const nomes = ["Ana", "Bia"];
const lista = nomes.map((nome, i) => ({ id: i + 1, nome }));
```

### 3) Aplicar desconto

**Enunciado:** Dado um array de precos, aplique 10% de desconto.

**Resposta:**

```javascript
const precos = [100, 200, 50];
const comDesconto = precos.map((p) => p * 0.9);
```

## Resumo final em tabela

| Situacao | Exemplo | Observacao |
| --- | --- | --- |
| Transformar valores | `arr.map((v) => v * 2)` | Retorna novo array |
| Usar index | `arr.map((v, i) => i)` | Index disponivel |
| Objetos | `arr.map((o) => o.id)` | Extrai propriedades |
| Async | `arr.map(fetch)` | Retorna Promises |
