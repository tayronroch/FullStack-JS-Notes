# Operadores e Controle de Fluxo em JavaScript

Para escrever programas úteis, precisamos ser capazes de realizar cálculos e tomar decisões. É para isso que servem os operadores e as estruturas de controle de fluxo.

## Operadores

### Operadores Aritméticos

Realizam operações matemáticas.

- `+` (Adição)
- `-` (Subtração)
- `*` (Multiplicação)
- `/` (Divisão)
- `%` (Módulo - resto da divisão)

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
