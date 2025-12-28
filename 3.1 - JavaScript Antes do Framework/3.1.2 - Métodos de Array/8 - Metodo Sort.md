# 8 - Metodo Sort()

## O que e o sort()

`sort()` ordena os elementos de um array **no proprio array** (ele **muta** o original). Por padrao, a ordenacao e **lexicografica** (como texto), mesmo para numeros.

Use quando:

- voce precisa ordenar uma lista;
- quer ordenar por nome, data, preco;
- precisa de ordenacao personalizada com comparador.

## Sintaxe basica

```javascript
const letras = ["d", "a", "c"];
letras.sort();

console.log(letras); // ["a", "c", "d"]
```

### Assinatura

```javascript
array.sort((a, b) => {
  // retorna negativo, zero ou positivo
});
```

### Como o comparador funciona

O comparador recebe dois itens `a` e `b`:

- retorna **negativo**: `a` vem antes de `b`
- retorna **positivo**: `b` vem antes de `a`
- retorna **0**: mantem a ordem relativa entre eles

```javascript
const nums = [10, 2, 5];
nums.sort((a, b) => a - b);
console.log(nums); // [2, 5, 10]
```

Se voce nao passar comparador, o `sort()` converte tudo para string:

```javascript
const nums = [10, 2, 5];
nums.sort();
console.log(nums); // [10, 2, 5]
```

## Sort muta o array original

```javascript
const nums = [3, 1, 2];
nums.sort((a, b) => a - b);

console.log(nums); // [1, 2, 3]
```

Se quiser manter o original, copie antes:

```javascript
const original = [3, 1, 2];
const ordenado = [...original].sort((a, b) => a - b);
```

## Ordenando numeros

```javascript
const nums = [100, 20, 3];
nums.sort((a, b) => a - b); // crescente
```

```javascript
const nums = [100, 20, 3];
nums.sort((a, b) => b - a); // decrescente
```

## Ordenando strings

Por padrao, strings sao comparadas por Unicode:

```javascript
const nomes = ["Ana", "carlos", "Bia"];
nomes.sort();
```

Para ordenacao com acentos ou locale:

```javascript
const nomes = ["Ana", "carlos", "Bia", "Álvaro"];
nomes.sort((a, b) => a.localeCompare(b, "pt-BR"));
```

## Ordenando objetos

### Por numero

```javascript
const produtos = [
  { nome: "Mouse", preco: 50 },
  { nome: "Teclado", preco: 100 },
];

produtos.sort((a, b) => a.preco - b.preco);
```

### Por string

```javascript
const usuarios = [
  { nome: "Ana" },
  { nome: "Carlos" },
  { nome: "Bia" },
];

usuarios.sort((a, b) => a.nome.localeCompare(b.nome));
```

## Sort estavel

Em JavaScript moderno, `sort()` e **estavel** (mantem a ordem de itens iguais). Isso importa quando voce faz varias ordenacoes.

## Cuidados e boas praticas

- Lembre que `sort()` **muta** o array original.
- Para numeros, sempre passe comparador.
- Para strings com acento, use `localeCompare`.
- Prefira copiar antes se precisar preservar o original.

## Resumo

`sort()` ordena arrays, mas muda o array original. Para resultados corretos, use comparador para numeros e `localeCompare` para textos.

## Exercicios avancados (com respostas)

### 1) Ordenar numeros

**Enunciado:** Ordene `[9, 2, 11, 3]` em ordem crescente.

**Resposta:**

```javascript
const nums = [9, 2, 11, 3];
nums.sort((a, b) => a - b);
```

### 2) Ordenar por idade

**Enunciado:** Ordene usuarios por idade crescente.

**Resposta:**

```javascript
const usuarios = [
  { nome: "Ana", idade: 30 },
  { nome: "Bia", idade: 20 },
];

usuarios.sort((a, b) => a.idade - b.idade);
```

### 3) Ordenar nomes com acento

**Enunciado:** Ordene `["Álvaro", "Ana", "Bia"]` em pt-BR.

**Resposta:**

```javascript
const nomes = ["Álvaro", "Ana", "Bia"];
nomes.sort((a, b) => a.localeCompare(b, "pt-BR"));
```

## Resumo final em tabela

| Situacao | Exemplo | Observacao |
| --- | --- | --- |
| Ordenar numeros | `arr.sort((a,b)=>a-b)` | Comparador necessario |
| Ordenar strings | `arr.sort()` | Unicode, pode surpreender |
| Ordenar objetos | `arr.sort((a,b)=>a.idade-b.idade)` | Comparar propriedade |
| Preservar original | `[...arr].sort()` | Evita mutacao |
