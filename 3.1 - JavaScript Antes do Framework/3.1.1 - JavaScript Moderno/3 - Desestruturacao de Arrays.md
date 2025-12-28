# 3 - Desestruturacao de Arrays

## O que e desestruturacao

Desestruturacao de arrays e uma sintaxe do JavaScript moderno que permite extrair valores de um array e atribuir em variaveis de forma simples e legivel. Em vez de acessar `arr[0]`, `arr[1]`, voce "abre" o array e nomeia cada posicao com uma variavel.

Ela e muito usada quando:

- a ordem dos itens e conhecida;
- voce so precisa de algumas posicoes;
- quer deixar o codigo mais direto e facil de ler.

## Sintaxe basica

```javascript
const cores = ["azul", "verde", "vermelho"];
const [primeira, segunda, terceira] = cores;

console.log(primeira); // azul
console.log(segunda);  // verde
console.log(terceira); // vermelho
```

Leitura mental: "pegue o array `cores` e atribua a posicao 0 a `primeira`, a posicao 1 a `segunda` e a posicao 2 a `terceira`".

Se o array tiver menos itens do que variaveis, as variaveis extras recebem `undefined`.

```javascript
const numeros = [1];
const [a, b] = numeros;

console.log(a); // 1
console.log(b); // undefined
```

## Pular itens

Voce pode ignorar posicoes usando virgulas. Cada virgula representa uma posicao do array:

```javascript
const numeros = [10, 20, 30, 40];
const [primeiro, , terceiro] = numeros;

console.log(primeiro); // 10
console.log(terceiro); // 30
```

## Valores padrao

Se o array nao tiver um valor na posicao, voce pode definir um padrao. O padrao so e usado quando o valor e `undefined`:

```javascript
const usuario = ["Tayron"];
const [nome, sobrenome = "Silva"] = usuario;

console.log(nome);      // Tayron
console.log(sobrenome); // Silva
```

Se o array tiver `null`, o padrao nao e aplicado:

```javascript
const usuario = ["Tayron", null];
const [nome, sobrenome = "Silva"] = usuario;

console.log(sobrenome); // null
```

## Rest operator (resto do array)

O rest operator `...` captura o restante dos itens em um novo array. Ele deve ser o **ultimo** na desestruturacao:

```javascript
const itens = ["mouse", "teclado", "monitor", "headset"];
const [primeiro, ...resto] = itens;

console.log(primeiro); // mouse
console.log(resto);    // ["teclado", "monitor", "headset"]
```

## Troca de valores

Um uso muito comum e trocar valores sem variavel temporaria. Isso funciona porque a direita cria um array temporario:

```javascript
let a = 1;
let b = 2;

[a, b] = [b, a];

console.log(a); // 2
console.log(b); // 1
```

## Desestruturacao com arrays aninhados

```javascript
const matriz = [
  [1, 2],
  [3, 4],
];

const [[a, b], [c, d]] = matriz;

console.log(a, b, c, d); // 1 2 3 4
```

## Retorno de funcoes

Muitas funcoes retornam arrays. A desestruturacao facilita o acesso e evita `resultado[0]`, `resultado[1]`:

```javascript
function dividir(a, b) {
  const quociente = Math.floor(a / b);
  const resto = a % b;
  return [quociente, resto];
}

const [q, r] = dividir(10, 3);
console.log(q, r); // 3 1
```

## Iteraveis tambem funcionam

Qualquer iteravel pode ser desestruturado como array. Isso inclui strings, sets e o resultado de algumas APIs:

```javascript
const texto = "JS";
const [letra1, letra2] = texto;

console.log(letra1); // J
console.log(letra2); // S
```

## Exemplos praticos do dia a dia

### 1) Pegando dados de API (array fixo)

```javascript
const resposta = ["ok", 200, { id: 1, nome: "Ana" }];
const [status, codigo, dados] = resposta;
```

Aqui a ordem e conhecida: status, codigo e dados. Se a API mudar a ordem, o codigo quebra. Por isso, use quando a ordem for confiavel.

### 2) Separando primeiro e ultimo item

```javascript
const lista = ["a", "b", "c", "d"];
const [primeiro, ...meio] = lista;
const ultimo = meio.pop();

console.log(primeiro); // a
console.log(ultimo);   // d
```

Esse padrao e util quando voce quer destacar extremos e tratar o meio depois.

### 3) Tratando retorno de regex

```javascript
const email = "contato@site.com";
const match = email.match(/^(.+)@(.+)$/);

if (match) {
  const [, usuario, dominio] = match; // pula o match completo
  console.log(usuario); // contato
  console.log(dominio); // site.com
}
```

O primeiro item do array do `match` e o texto completo, por isso usamos uma virgula para pular.

### 4) Recebendo parametros em funcoes

```javascript
function criarUsuario([nome, idade]) {
  return { nome, idade };
}

const usuario = criarUsuario(["Ana", 28]);
```

Esse estilo e comum quando voce tem arrays pequenos e fixos. Se os dados forem nomeados, prefira objetos.

## Cuidados e boas praticas

- Evite desestruturar quando a ordem nao e obvia.
- Use nomes claros para as variaveis.
- Para arrays grandes, desestruture apenas o que for necessario.
- Combine com valores padrao para evitar `undefined`.
- Se os dados tiverem significado por nome, considere objetos em vez de arrays.

## Comparacao rapida com acesso por indice

```javascript
const pessoa = ["Ana", 28, "SP"];

// acesso por indice
const nome = pessoa[0];
const idade = pessoa[1];

// com desestruturacao
const [nome2, idade2] = pessoa;
```

Com desestruturacao, o codigo fica mais curto e expressivo, mas depende da ordem correta.

## Detalhes avancados

### 1) Rest e spread em arrays aninhados

```javascript
const dados = [1, [2, 3, 4], 5];
const [primeiro, [segundo, ...restoInterno], ultimo] = dados;

console.log(primeiro);      // 1
console.log(segundo);       // 2
console.log(restoInterno);  // [3, 4]
console.log(ultimo);        // 5
```

### 2) Desestruturacao com `for...of` e `entries()`

```javascript
const nomes = ["Ana", "Bruno", "Carla"];

for (const [indice, nome] of nomes.entries()) {
  console.log(indice, nome);
}
```

Aqui `entries()` retorna pares `[indice, valor]`, que sao desestruturados no loop.

### 3) Parametros com valores padrao e fallback

```javascript
function criarConta([nome, tipo = "padrao", saldo = 0]) {
  return { nome, tipo, saldo };
}

console.log(criarConta(["Ana"]));
// { nome: "Ana", tipo: "padrao", saldo: 0 }
```

Se o array for `undefined`, voce pode proteger com um valor padrao no parametro:

```javascript
function criarConta(dados = []) {
  const [nome, tipo = "padrao", saldo = 0] = dados;
  return { nome, tipo, saldo };
}
```

### 4) `undefined` vs `null`

Valores padrao so entram quando o valor e `undefined`. Se o array tiver `null`, o `null` permanece.

```javascript
const valores = [null, undefined];
const [a = 1, b = 2] = valores;

console.log(a); // null
console.log(b); // 2
```

### 5) Uso com `Map` e `Set`

`Map` e `Set` sao iteraveis, entao podem ser desestruturados:

```javascript
const mapa = new Map([
  ["id", 10],
  ["nome", "Ana"],
]);

for (const [chave, valor] of mapa) {
  console.log(chave, valor);
}
```

Em `Set`, cada item e um valor, entao voce pega apenas uma variavel:

```javascript
const conjunto = new Set([1, 2, 3]);
const [a, b] = conjunto;
console.log(a, b); // 1 2
```

### 6) Armadilhas comuns (pitfalls)

- **Ordem importa**: se a ordem mudar, as variaveis recebem valores errados.
- **Arrays esparsos**: buracos geram `undefined`.
- **Iteraveis diferentes**: desestruturar string pega caracteres, nao palavras.
- **Rest deve ser o ultimo**: `const [...resto, ultimo] = arr` e invalido.

```javascript
const arr = [1, , 3];
const [x, y, z] = arr;
console.log(y); // undefined por causa do buraco
```

## Resumo

Desestruturacao de arrays torna o codigo mais direto e expressivo. Ela e muito util para pegar partes de um array, trabalhar com retornos de funcoes e simplificar logica de troca e separacao de dados. O ponto principal e lembrar que **a ordem importa**.

## Exercicios avancados (com respostas)

### 1) Extraindo dados com rest

**Enunciado:** Dado o array `[10, 20, 30, 40, 50]`, pegue o primeiro e o ultimo valor. Use desestruturacao.

**Resposta:**

```javascript
const nums = [10, 20, 30, 40, 50];
const [primeiro, ...meio] = nums;
const ultimo = meio.pop();

console.log(primeiro, ultimo); // 10 50
```

### 2) Parametros com valores padrao

**Enunciado:** Crie uma funcao que receba um array com `[nome, cargo, salario]`. Se `cargo` ou `salario` nao vierem, use `"dev"` e `3000`.

**Resposta:**

```javascript
function criarFuncionario([nome, cargo = "dev", salario = 3000]) {
  return { nome, cargo, salario };
}

console.log(criarFuncionario(["Ana"]));
```

### 3) Map com pares

**Enunciado:** Percorra um `Map` e imprima `"chave: valor"` para cada par.

**Resposta:**

```javascript
const mapa = new Map([
  ["id", 10],
  ["nome", "Ana"],
]);

for (const [chave, valor] of mapa) {
  console.log(`${chave}: ${valor}`);
}
```

### 4) Regex com desestruturacao

**Enunciado:** Extraia usuario e dominio do email `"aluno@escola.com"`.

**Resposta:**

```javascript
const email = "aluno@escola.com";
const match = email.match(/^(.+)@(.+)$/);

if (match) {
  const [, usuario, dominio] = match;
  console.log(usuario, dominio);
}
```

### 5) Iteravel customizado

**Enunciado:** Dado um `Set` com `[5, 6, 7]`, pegue os dois primeiros valores.

**Resposta:**

```javascript
const conjunto = new Set([5, 6, 7]);
const [a, b] = conjunto;
console.log(a, b); // 5 6
```

## Resumo final em tabela

| Situacao | Exemplo | Observacao |
| --- | --- | --- |
| Basico | `const [a, b] = [1, 2]` | Ordem importa |
| Pular item | `const [a, , c] = [1, 2, 3]` | Virgula ignora posicao |
| Valor padrao | `const [a = 1] = []` | So aplica com `undefined` |
| Rest | `const [a, ...r] = [1,2,3]` | `...r` deve ser o ultimo |
| Aninhado | `const [[a]] = [[1]]` | Abre subarrays |
| Iteravel | `const [x, y] = "JS"` | Strings/Set/Map funcionam |
