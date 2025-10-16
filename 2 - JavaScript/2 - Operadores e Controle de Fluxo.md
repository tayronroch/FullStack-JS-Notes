# Operadores e Controle de Fluxo em JavaScript

Para escrever programas úteis, precisamos ser capazes de realizar cálculos e tomar decisões. É para isso que servem os operadores e as estruturas de controle de fluxo.

## Tipos de Dados, Operadores e Coerção

JavaScript é uma linguagem de **tipagem dinâmica e fraca**. Isso significa que você não precisa declarar o tipo de uma variável, e o motor do JavaScript pode converter tipos automaticamente quando você usa operadores. Esse processo é chamado de **coerção de tipo (type coercion)** ou conversão implícita.

Entender isso é crucial, pois pode gerar resultados inesperados.

### Conversão de Tipo Explícita

Em contraste com a coerção (implícita), a conversão explícita ocorre quando **nós, desenvolvedores, forçamos a mudança de um tipo para outro**. Isso nos dá mais controle sobre o código.

**1. Para String**
- `String(valor)`: Converte o valor para sua representação em string.
- `valor.toString()`: Um método que a maioria dos tipos possui.

```javascript
String(123);       // "123"
(456).toString();  // "456"
```

**2. Para Número**
- `Number(valor)`: Converte o valor para um número. Pode resultar em `NaN` se a conversão não for possível.
- `parseInt(string)`: Analisa uma string e retorna um **inteiro**. Ignora o que vem depois do número.
- `parseFloat(string)`: Analisa uma string e retorna um número de **ponto flutuante (decimal)**.

```javascript
Number("10.5");    // 10.5
Number("Olá");     // NaN (Not a Number)

parseInt("10.99"); // 10 (ignora o decimal)
parseFloat("10.99"); // 10.99

parseInt("10 Reais"); // 10 (lê o número até encontrar um não-número)
```

**3. Para Boolean**

Como visto mais adiante, usa-se `Boolean(valor)` ou a dupla negação `!!valor`.

### Coerção com o Operador `+`

O operador `+` soma números, mas concatena (junta) strings. Se um dos operandos for uma string, o outro será convertido para string.

```javascript
5 + 5;      // 10 (Number)
'5' + 5;    // '55' (String) - O número 5 foi coagido para string
'5' + '5';  // '55' (String)
```

### Igualdade: `==` vs. `===` (A Regra de Ouro)

Esta é uma das fontes mais comuns de bugs em JavaScript.

- `==` (Igualdade Abstrata): Compara dois valores **após fazer a coerção de tipo**. 
- `===` (Igualdade Estrita): Compara os valores **e também os tipos**, sem fazer coerção.

**Regra de ouro: Sempre prefira `===` para evitar surpresas.**

```javascript
10 == '10';   // true, porque o JavaScript converte a string '10' para o número 10 antes de comparar.
10 === '10';  // false, porque os tipos são diferentes (Number vs. String).

0 == false;   // true, porque `false` é coagido para 0.
0 === false;  // false, porque os tipos são diferentes (Number vs. Boolean).
```

### Valores "Truthy" e "Falsy"

No contexto de controle de fluxo (como um `if`), todo valor em JavaScript pode ser coagido para `true` ou `false`.

- **Valores Falsy:** São os únicos valores que se comportam como `false`.
  - `false`
  - `0`
  - `""` (string vazia)
  - `null`
  - `undefined`
  - `NaN` (Not a Number)

- **Valores Truthy:** Qualquer outro valor que não esteja na lista acima. Inclui `'0'`, `'false'`, `[]` (array vazio), `{}` (objeto vazio), etc.

```javascript
if ('0') { // '0' é truthy
  console.log("Esta mensagem será exibida!");
}

if (0) { // 0 é falsy
  // Este código não será executado.
}
```

### As Diferenças entre `undefined` e `null`

Ambos representam a ausência de valor, mas de formas diferentes.

- **`undefined`**: É o valor padrão de uma variável que foi declarada, mas **ainda não recebeu um valor**. É o "esquecimento".
  ```javascript
  let nome;
  console.log(nome); // undefined
  ```

- **`null`**: É um valor de atribuição. Representa a **ausência intencional** de qualquer valor ou objeto. É uma forma de dizer explicitamente que "aqui não há valor".
  ```javascript
  let usuario = { nome: "Carlos" };
  usuario = null; // O programador definiu que não há mais um usuário.
  ```

**Comparações e a Peculiaridade do `typeof`**

- `null == undefined` → `true` (O operador `==` os considera iguais por uma regra de coerção especial).
- `null === undefined` → `false` (São de tipos diferentes, então a igualdade estrita falha).
- `typeof undefined` → `"undefined"`.
- `typeof null` → `"object"` (Este é um **bug histórico** do JavaScript! `null` é um tipo primitivo, mas o `typeof` o reporta incorretamente como um objeto).

**Quando usar:** Geralmente, você não atribui `undefined` a nada. Você apenas checa se uma variável é `undefined` para saber se ela já foi inicializada. Você usa `null` quando quer limpar uma variável que antes continha um objeto.

## Operadores

### Operadores Aritméticos

Realizam operações matemáticas.

- `+` (Adição)
- `-` (Subtração)
- `*` (Multiplicação)
- `/` (Divisão)
- `%` (Módulo - resto da divisão)

### Operações e Checagens Numéricas

Além dos operadores básicos, JavaScript fornece ferramentas para lidar com números de forma mais avançada.

**1. O Objeto `Math`**

É um objeto nativo que possui métodos e constantes matemáticas. Não é uma função, você o usa diretamente.

- `Math.round(x)`: Arredonda para o inteiro mais próximo. (ex: `Math.round(4.7)` retorna `5`).
- `Math.floor(x)`: Arredonda para baixo. (ex: `Math.floor(4.7)` retorna `4`).
- `Math.ceil(x)`: Arredonda para cima. (ex: `Math.ceil(4.2)` retorna `5`).
- `Math.random()`: Retorna um número decimal pseudo-aleatório entre 0 (inclusivo) e 1 (exclusivo).
- `Math.max(a, b, ...)`: Retorna o maior número de uma lista.
- `Math.min(a, b, ...)`: Retorna o menor número de uma lista.

**2. Valores Especiais: `NaN` e `Infinity`**

- `Infinity`: Representa o infinito matemático. Ocorre, por exemplo, ao dividir um número por zero (`1 / 0`).
- `NaN` (Not a Number): É um valor especial que indica que uma operação matemática falhou ou resultou em algo que não é um número real (ex: `0 / 0` ou `Math.sqrt(-1)`).

  **Importante:** `NaN` não é igual a nada, nem a si mesmo! `NaN === NaN` retorna `false`.

**3. Verificando Números Válidos**

Como saber se uma variável contém um número de verdade?

- `typeof`: `typeof 10` retorna `'number'`, mas `typeof NaN` também retorna `'number'`. Portanto, `typeof` sozinho não é suficiente.
- `Number.isNaN(valor)`: Esta é a forma **correta e moderna** de verificar se um valor é `NaN`. Ele retorna `true` **apenas** se o valor for `NaN`.

```javascript
let resultado = 0 / 0; // resultado é NaN

console.log(typeof resultado); // 'number' (confuso!)
console.log(resultado === NaN); // false (não funciona!)

// A forma correta:
console.log(Number.isNaN(resultado)); // true

// Para checar se é um número real e utilizável:
function isRealNumber(valor) {
  return typeof valor === 'number' && !Number.isNaN(valor);
}

console.log(isRealNumber(10));    // true
console.log(isRealNumber(NaN));   // false
console.log(isRealNumber('10')); // false
```

### Operadores de Atribuição

Atribuem valores a variáveis.

- `=` (Atribuição simples)
- `+=` (Adição e atribuição, ex: `x += y` é o mesmo que `x = x + y`)
- `-=` (Subtração e atribuição)

### Operadores de Comparação

Comparam dois valores e retornam um booleano (`true` ou `false`).

- `==` (Igual a): Compara apenas o valor.
- `===` (Estritamente igual a): Compara o valor **e** o tipo. **Prefira este!**
- `!=` (Diferente de)
- `!==` (Estritamente diferente de)
- `>` (Maior que)
- `<` (Menor que)
- `>=` (Maior ou igual a)
- `<=` (Menor ou igual a)

```javascript
10 == '10'  // true (compara apenas o valor)
10 === '10' // false (compara valor E tipo, Number vs String)
```

### Operadores Lógicos

Usados para combinar expressões booleanas.

- `&&` (E Lógico): Retorna `true` se **ambas** as condições forem verdadeiras.
- `||` (OU Lógico): Retorna `true` se **pelo menos uma** das condições for verdadeira.
- `!` (NÃO Lógico): Inverte o valor booleano.

### Conversão Explícita para Boolean

Às vezes, você pode querer forçar a conversão de um valor para seu equivalente booleano (`true` ou `false`) fora de um `if`. Existem duas maneiras comuns de fazer isso:

**1. A Função `Boolean()`**

Envolve o valor na função `Boolean()` e ela retornará `true` para valores *truthy* e `false` para valores *falsy*.

**2. A Dupla Negação `!!`**

Usar o operador de negação (`!`) duas vezes é uma forma curta e comum de fazer a mesma conversão. O primeiro `!` converte o valor para um booleano e o inverte, e o segundo `!` o inverte de volta ao seu valor booleano original.

```javascript
// Usando Boolean()
console.log(Boolean("Olá")); // true
console.log(Boolean(0));     // false
console.log(Boolean({}));    // true

// Usando !!
console.log(!!"Olá"); // true
console.log(!!0);     // false
console.log(!!{});    // true
```

## Controle de Fluxo

### Condicional `if / else`

Executa um bloco de código se uma condição for verdadeira e, opcionalmente, outro bloco (`else`) se for falsa.

```javascript
const idade = 18;

if (idade >= 18) {
  console.log("Você é maior de idade.");
} else {
  console.log("Você é menor de idade.");
}
```

Você pode aninhar condições com `else if`.

```javascript
const hora = 14;

if (hora < 12) {
  console.log("Bom dia!");
} else if (hora < 18) {
  console.log("Boa tarde!");
} else {
  console.log("Boa noite!");
}
```

## Laços de Repetição (Loops)

Executam um bloco de código repetidamente.

### `for`

O loop `for` é ideal quando você sabe quantas vezes quer repetir.

```javascript
// Este loop vai de 0 a 4
for (let i = 0; i < 5; i++) {
  console.log("O número é " + i);
}
```

### `while`

O loop `while` continua enquanto uma condição for verdadeira. É útil quando você não sabe o número exato de iterações.

```javascript
let contador = 0;

while (contador < 5) {
  console.log("Contador: " + contador);
  contador++; // Importante: incrementar para não criar um loop infinito!
}
```
