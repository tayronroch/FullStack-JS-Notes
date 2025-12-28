# 5 - Rest Params

## O que sao rest params

Rest params permitem receber um numero variavel de argumentos em uma funcao e agrupa-los em um array. Isso deixa o codigo mais flexivel e reduz a necessidade de usar `arguments`.

## Sintaxe basica

O rest param e escrito com `...` antes do nome da variavel:

```javascript
function somar(...numeros) {
  return numeros.reduce((acc, n) => acc + n, 0);
}

console.log(somar(1, 2, 3)); // 6
```

Aqui `numeros` vira um array com todos os argumentos passados.

## Rest params vs arguments

`arguments` e um objeto parecido com array, mas:

- nao e um array de verdade;
- nao funciona com arrow functions;
- nao permite facil uso de metodos como `map` e `reduce`.

Com rest params, voce recebe um **array real**:

```javascript
function listar(...itens) {
  return itens.map((item) => item.toUpperCase());
}

// Rest params (...) permite representar um número indefinido de argumentos como um array.

function values(...rest) {
  //Mostra a quiantidade de parametros.
  console.log(rest.length);

  //Exbindo conteudo do Array
  console.log(...rest);

  //Exbido o conteudo do rest que é um array
  console.log(rest);
}

values(1, 2, 3);
```

## Posicao do rest param

O rest param **precisa ser o ultimo** parametro da funcao:

```javascript
function combinar(a, b, ...resto) {
  return [a, b, resto];
}
```

Isso nao e permitido:

```javascript
// SyntaxError
function invalido(...resto, ultimo) {}
```

## Usos comuns

### 1) Somar qualquer quantidade

```javascript
function somar(...nums) {
  return nums.reduce((total, n) => total + n, 0);
}
```

### 2) Agrupar parametros fixos + variaveis

```javascript
function criarPedido(cliente, ...itens) {
  return { cliente, itens };
}

const pedido = criarPedido("Ana", "agua", "pao", "suco");
```

### 3) Encaminhar argumentos

```javascript
function log(prefixo, ...mensagens) {
  console.log(prefixo, ...mensagens);
}
```

## Rest params em arrow functions

Arrow functions suportam rest params normalmente:

```javascript
const contar = (...args) => args.length;
console.log(contar(1, 2, 3)); // 3
```

## Rest params com desestruturacao

Voce pode combinar rest params com desestruturacao:

```javascript
function analisar(primeiro, ...resto) {
  const [segundo, terceiro] = resto;
  return { primeiro, segundo, terceiro };
}
```

## Rest params com valores padrao

Voce pode usar valores padrao antes do rest:

```javascript
function criarUsuario(nome = "Anonimo", ...tags) {
  return { nome, tags };
}
```

## Diferenca entre rest params e spread

Ambos usam `...`, mas em contextos diferentes:

- **Rest params**: na declaracao da funcao, **recebe** varios argumentos.
- **Spread**: na chamada, **espalha** um array em argumentos.

```javascript
function somar(a, b, c) {
  return a + b + c;
}

const valores = [1, 2, 3];
console.log(somar(...valores)); // spread
```

```javascript
function somarTodos(...nums) {
  return nums.reduce((acc, n) => acc + n, 0);
}
```

## Cuidados e boas praticas

- Use rest params quando a quantidade de argumentos e variavel.
- Evite misturar logica complexa dentro do rest; organize os parametros fixos primeiro.
- Rest params e mais legivel e moderno que `arguments`.
- Lembre: rest params sempre gera um array novo.

## Resumo

Rest params tornam funcoes mais flexiveis e legiveis, permitindo receber qualquer quantidade de argumentos como um array. Use `...` no ultimo parametro da funcao e combine com metodos de array para processar os valores.

## Exercicios avancados (com respostas)

### 1) Media de varios numeros

**Enunciado:** Crie uma funcao `media` que aceite qualquer quantidade de numeros.

**Resposta:**

```javascript
function media(...nums) {
  if (nums.length === 0) return 0;
  const soma = nums.reduce((acc, n) => acc + n, 0);
  return soma / nums.length;
}
```

### 2) Separar cabecalho e corpo

**Enunciado:** A funcao recebe `titulo` e o resto dos itens como corpo.

**Resposta:**

```javascript
function criarMensagem(titulo, ...linhas) {
  return { titulo, linhas };
}
```

### 3) Encaminhar argumentos

**Enunciado:** Crie uma funcao `logInfo` que prefixa mensagens e repassa para `console.log`.

**Resposta:**

```javascript
function logInfo(...msgs) {
  console.log("[INFO]", ...msgs);
}
```

## Resumo final em tabela

| Situacao                 | Exemplo                             | Observacao                   |
| ------------------------ | ----------------------------------- | ---------------------------- |
| Receber variavel         | `function f(...args) {}`            | `args` e um array real       |
| Misturar fixo + variavel | `function f(a, ...r) {}`            | `...r` deve ser o ultimo     |
| Com desestruturacao      | `function f(a, ...r)`               | `r` pode ser desestruturado  |
| Spread vs rest           | `f(...arr)` / `function f(...args)` | uso diferente do mesmo `...` |
