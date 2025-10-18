# Repetição e Iteração em JavaScript

Repetir tarefas é uma das ações mais comuns na programação. Seja para processar uma lista de itens, ler dados de uma fonte ou executar uma ação várias vezes, as estruturas de repetição são essenciais. Em JavaScript, existem duas abordagens principais: os **loops tradicionais** e os **métodos de iteração de arrays**.

---

## 1. Loops Tradicionais

Os loops clássicos dão a você controle total sobre o início, a condição de parada e o incremento da repetição.

### a. `for`

O loop `for` é a estrutura de repetição mais comum e versátil. Ele é ideal quando você sabe exatamente quantas vezes deseja repetir o bloco de código.

**Sintaxe:**
`for ([inicialização]; [condição]; [expressão final]) { ... }`

- **Inicialização:** Executada uma única vez, antes do início do loop. Geralmente usada para declarar e iniciar uma variável de controle (ex: `let i = 0`).
- **Condição:** Avaliada antes de cada iteração. Se for `true`, o bloco de código é executado. Se for `false`, o loop termina.
- **Expressão final:** Executada ao final de cada iteração. Geralmente usada para incrementar a variável de controle (ex: `i++`).

**Exemplo:** Contando de 0 a 4.

```javascript
for (let i = 0; i < 5; i++) {
  console.log(`O número atual é ${i}`);
}
// Saída:
// O número atual é 0
// O número atual é 1
// O número atual é 2
// O número atual é 3
// O número atual é 4
```

**Caso de uso comum:** Percorrer um array usando seus índices.

```javascript
const frutas = ['maçã', 'banana', 'cereja'];
for (let i = 0; i < frutas.length; i++) {
  console.log(`Fruta na posição ${i}: ${frutas[i]}`);
}
```

### b. `while`

O loop `while` executa um bloco de código enquanto uma condição especificada for verdadeira. É ideal quando você não sabe quantas iterações serão necessárias, mas sabe qual é a condição de parada.

**Sintaxe:**
`while (condição) { ... }`

**Exemplo:** Sorteando números até encontrar um maior que 8.

```javascript
let numeroSorteado = 0;
let tentativas = 0;

while (numeroSorteado <= 8) {
  numeroSorteado = Math.floor(Math.random() * 10) + 1; // Sorteia um número de 1 a 10
  tentativas++;
  console.log(`Tentativa ${tentativas}: sorteou ${numeroSorteado}`);
}

console.log(`Finalmente! O número ${numeroSorteado} foi sorteado após ${tentativas} tentativas.`);
```

**Cuidado:** É crucial que a condição do `while` em algum momento se torne `false`. Caso contrário, você criará um **loop infinito**, que travará seu programa.

### c. `do...while`

O loop `do...while` é uma variação do `while`. A principal diferença é que o bloco de código é executado **pelo menos uma vez**, antes que a condição seja verificada.

**Sintaxe:**
`do { ... } while (condição);`

**Exemplo:** Pedindo uma entrada ao usuário até que ela seja válida.

```javascript
let senha;

do {
  // A primeira vez, `senha` é undefined, mas o bloco executa mesmo assim.
  senha = prompt("Digite sua senha (deve ter mais de 4 caracteres):");
} while (senha.length <= 4);

console.log("Senha válida registrada!");
```

---

## 2. Loops para Coleções (`for...of` e `for...in`)

Esses loops foram projetados para iterar sobre estruturas de dados, como arrays e objetos, de forma mais direta.

### a. `for...of` (A forma moderna para arrays)

O loop `for...of` itera sobre os **valores** de objetos iteráveis (como Arrays, Strings, Maps, Sets, etc.). É a maneira mais recomendada e legível de percorrer os elementos de um array quando você não precisa do índice.

**Sintaxe:**
`for (const elemento of iteravel) { ... }`

**Exemplo:**

```javascript
const cores = ['vermelho', 'verde', 'azul'];

for (const cor of cores) {
  console.log(cor);
}
// Saída:
// vermelho
// verde
// azul
```

### b. `for...in` (Para propriedades de objetos)

O loop `for...in` itera sobre as **chaves (propriedades)** de um objeto.

**Sintaxe:**
`for (const chave in objeto) { ... }`

**Exemplo:**

```javascript
const usuario = {
  nome: 'Carlos',
  idade: 32,
  cidade: 'São Paulo'
};

for (const propriedade in usuario) {
  console.log(`${propriedade}: ${usuario[propriedade]}`);
}
// Saída:
// nome: Carlos
// idade: 32
// cidade: São Paulo
```

**Atenção:** Não use `for...in` para percorrer arrays. Ele pode iterar sobre propriedades inesperadas (incluindo as do protótipo do array) e a ordem da iteração não é garantida. Para arrays, use `for`, `for...of` ou os métodos de iteração.

---

## 3. Métodos de Iteração de Arrays

JavaScript fornece um conjunto poderoso de métodos no protótipo do `Array` que permitem iterar e transformar dados de maneira funcional, produzindo um código mais limpo e declarativo.

### a. `forEach()`

Executa uma função de callback para **cada elemento** do array. É um substituto moderno para o loop `for` quando você só precisa "fazer algo" com cada item e não precisa criar um novo array.

**Sintaxe:** `array.forEach(callback(elemento, indice, array))`

```javascript
const nomes = ['Ana', 'Bia', 'Carlos'];
nomes.forEach((nome, index) => {
  console.log(`${index + 1}. ${nome}`);
});
// Saída:
// 1. Ana
// 2. Bia
// 3. Carlos
```
**Importante:** `forEach` não tem um valor de retorno (retorna `undefined`) e não pode ser interrompido com `break` (embora você possa simular isso com `try...catch` ou retornando de dentro do callback, o que não é ideal).

### b. `map()`

Cria um **novo array** com os resultados da chamada de uma função de callback para cada elemento do array original. É a ferramenta perfeita para **transformar** dados.

**Sintaxe:** `const novoArray = array.map(callback(elemento, indice, array))`

```javascript
const numeros = [1, 4, 9, 16];

// Criar um novo array com a raiz quadrada de cada número
const raizes = numeros.map(num => Math.sqrt(num));

console.log(raizes); // [1, 2, 3, 4]
console.log(numeros); // [1, 4, 9, 16] (o array original permanece intacto)
```

### c. `filter()`

Cria um **novo array** com todos os elementos que passaram no teste implementado pela função de callback (ou seja, para os quais o callback retornou `true`). É a ferramenta ideal para **selecionar** ou **filtrar** dados.

**Sintaxe:** `const novoArray = array.filter(callback(elemento, indice, array))`

```javascript
const idades = [15, 21, 17, 35, 12];

// Criar um novo array apenas com as idades de maiores de idade
const maioresDeIdade = idades.filter(idade => idade >= 18);

console.log(maioresDeIdade); // [21, 35]
```

### d. `reduce()`

Executa uma função "redutora" para cada elemento do array, resultando em um **único valor de retorno**. É o método mais poderoso e flexível, podendo ser usado para calcular somas, médias, agrupar dados e até mesmo recriar `map` e `filter`.

**Sintaxe:** `array.reduce(callback(acumulador, valorAtual, indice, array), valorInicial)`

- **`acumulador`**: O valor retornado na iteração anterior.
- **`valorAtual`**: O elemento atual sendo processado.
- **`valorInicial`** (opcional): Um valor para ser usado como o primeiro argumento do `acumulador` na primeira chamada.

**Exemplo:** Somando todos os números de um array.

```javascript
const valores = [10, 20, 30, 40];

const somaTotal = valores.reduce((somaParcial, valor) => {
  return somaParcial + valor;
}, 0); // 0 é o valor inicial da somaParcial

console.log(somaTotal); // 100
```

---

## Qual Usar? (Resumo e Boas Práticas)

- **Precisa de controle total (início, parada, passo)?**
  - Use um loop `for` tradicional.
- **Precisa de um loop que continue enquanto uma condição for verdadeira?**
  - Use `while` (verifica antes) ou `do...while` (executa uma vez, depois verifica).
- **Precisa percorrer os valores de um array (ou string, etc.)?**
  - Use `for...of`. É a sintaxe mais limpa e moderna.
- **Precisa percorrer as propriedades de um objeto?**
  - Use `for...in`.
- **Precisa executar uma ação para cada item de um array, sem criar um novo?**
  - Use `forEach()`.
- **Precisa criar um novo array transformando cada item do original?**
  - Use `map()`.
- **Precisa criar um novo array com um subconjunto de itens que atendem a uma condição?**
  - Use `filter()`.
- **Precisa calcular um valor único a partir de todos os itens de um array (soma, média, objeto agrupado)?**
  - Use `reduce()`.
