# 5 - Metodo Every()

## O que e o every()

`every()` testa se **todos** os itens de um array passam em uma condicao. Ele retorna **true** se todos passarem, e **false** caso algum falhe. Se o array estiver vazio, o resultado e `true`.

Use quando:

- voce precisa validar se todos os itens seguem uma regra;
- quer garantir consistencia de dados;
- precisa saber se um conjunto inteiro atende um criterio.

## Sintaxe basica

```javascript
const numeros = [2, 4, 6];
const todosPares = numeros.every((n) => n % 2 === 0);

console.log(todosPares); // true
```

### Assinatura

```javascript
array.every((item, index, array) => {
  // retorna true se o item passar
});
```

Parametros:

- `item`: valor atual.
- `index`: posicao do item.
- `array`: o proprio array.

### Como o callback funciona

O `every()` chama o callback **para cada item**, na ordem do array. Se algum retorno for `false`, ele **para** e devolve `false`. Se chegar ao fim sem falhar, retorna `true`.

```javascript
const notas = [7, 8, 9];
const todasBoas = notas.every((n, i) => {
  // roda ate encontrar uma nota menor que 6
  return n >= 6;
});

console.log(todasBoas); // true
```

Se o callback nunca retornar `false`, o resultado e `true`:

```javascript
const valores = [1, 2, 3];
const ok = valores.every((v) => v > 0);

console.log(ok); // true
```

Se o array estiver vazio, o resultado e `true` (verdade vacua):

```javascript
const vazio = [];
console.log(vazio.every(() => false)); // true
```

## Every nao altera o array original

```javascript
const itens = ["a", "b", "c"];
const ok = itens.every((i) => i.length === 1);

console.log(itens); // ["a", "b", "c"]
```

## Quando usar every

- Validar se todos os items estao preenchidos.
- Verificar se todas as notas estao acima de um minimo.
- Garantir que todas as flags estao como `true`.

## Exemplos praticos do dia a dia

### 1) Todos maiores de idade

```javascript
const pessoas = [
  { nome: "Ana", idade: 20 },
  { nome: "Bia", idade: 19 },
];

const todosAdultos = pessoas.every((p) => p.idade >= 18);
```

### 2) Todas as tarefas completas

```javascript
const tarefas = [
  { titulo: "Estudar", feita: true },
  { titulo: "Treinar", feita: true },
];

const tudoFeito = tarefas.every((t) => t.feita);
```

### 3) Todas as notas acima de 7

```javascript
const notas = [8, 7, 9];
const aprovados = notas.every((n) => n >= 7);
```

## Diferenca entre every e some

- `every()` retorna `true` se **todos** passam.
- `some()` retorna `true` se **pelo menos um** passa.

```javascript
const nums = [2, 4, 7];
console.log(nums.every((n) => n % 2 === 0)); // false
console.log(nums.some((n) => n % 2 === 0));  // true
```

## Cuidados e boas praticas

- Sempre trate o caso de array vazio se isso for importante no seu contexto.
- O callback deve retornar `true/false`.
- Use `every()` apenas quando a regra precisa valer para todos.

## Resumo

`every()` verifica se todos os itens de um array atendem uma condicao. Ele para no primeiro `false`, nao altera o array e e ideal para validacoes.

## Exercicios avancados (com respostas)

### 1) Verificar se todos sao positivos

**Enunciado:** Dado `[1, 2, 3]`, valide se todos sao positivos.

**Resposta:**

```javascript
const nums = [1, 2, 3];
const ok = nums.every((n) => n > 0);
```

### 2) Validar estoque

**Enunciado:** Verifique se todas as frutas tem quantidade maior que 0.

**Resposta:**

```javascript
const frutas = [
  { nome: "banana", quantidade: 5 },
  { nome: "maca", quantidade: 2 },
];

const ok = frutas.every((f) => f.quantidade > 0);
```

### 3) Validar campos preenchidos

**Enunciado:** Verifique se todos os campos de um formulario estao preenchidos.

**Resposta:**

```javascript
const campos = ["nome", "email", "senha"];
const ok = campos.every((c) => c.length > 0);
```

## Resumo final em tabela

| Situacao | Exemplo | Observacao |
| --- | --- | --- |
| Validar todos | `arr.every((v) => v > 0)` | Retorna true/false |
| Interromper cedo | `every` para no primeiro false | Melhor performance |
| Array vazio | `[].every(() => false)` | Retorna true |
| Comparar com some | `every` vs `some` | Todos vs pelo menos um |
