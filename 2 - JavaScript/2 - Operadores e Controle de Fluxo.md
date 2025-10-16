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

### Igualdade Abstrata (`==`) vs. Estrita (`===`)

Esta é uma das fontes mais comuns de bugs em JavaScript, por isso é crucial entender a diferença.

- `===` (Igualdade Estrita): Compara o valor **e** o tipo, sem fazer conversão automática de tipo (coerção). É a forma mais segura e previsível.
- `==` (Igualdade Abstrata): Compara dois valores **após tentar convertê-los para um tipo comum**. Esse processo de coerção pode ter resultados inesperados.

**Regra de ouro: Sempre prefira `===` para evitar surpresas e bugs.**

Veja como a coerção do `==` pode ser confusa:

```javascript
// Exemplo 1: String vs. Number
10 === '10'; // false (tipos diferentes)
10 == '10';  // true (a string '10' é coagida para o número 10)

// Exemplo 2: Boolean vs. Number
1 === true; // false (tipos diferentes)
1 == true;  // true (o boolean true é coagido para o número 1)

0 === false; // false (tipos diferentes)
0 == false;  // true (o boolean false é coagido para o número 0)

// Exemplo 3: null vs. undefined
null === undefined; // false (são tipos primitivos diferentes)
null == undefined;  // true (esta é uma exceção específica da linguagem)

// Exemplo 4: String vazia vs. Number
'' === 0; // false (tipos diferentes)
'' == 0;  // true (a string vazia é coagida para o número 0)
```

### Valores "Truthy" e "Falsy": Um Mergulho Profundo

Em JavaScript, todo valor tem um valor booleano inerente. Isso é crucial para o controle de fluxo (`if`, `while`, etc.) e para o comportamento dos operadores lógicos (`&&`, `||`).

- Um valor **truthy** é um valor que se traduz em `true` quando avaliado em um contexto booleano.
- Um valor **falsy** é um valor que se traduz em `false` quando avaliado em um contexto booleano.

**A Lista Definitiva dos Valores Falsy**

É mais fácil memorizar os valores `falsy`, pois são poucos. Qualquer valor que não esteja nesta lista é, por definição, `truthy`.

1.  `false` (o booleano falso)
2.  `0` (o número zero)
3.  `-0` (o número zero negativo)
4.  `0n` (o BigInt zero)
5.  `""` (a string vazia)
6.  `null`
7.  `undefined`
8.  `NaN` (Not a Number)

**O Universo dos Valores Truthy**

Qualquer outro valor é `truthy`. Isso inclui alguns casos que podem surpreender iniciantes:

| Valor                  | Representação | Booleano Equivalente | Motivo                                       |
| ---------------------- | ------------- | -------------------- | -------------------------------------------- |
| String com zero        | `'0'`         | `true`               | É uma string não-vazia.                      |
| String com "false"     | `'false'`     | `true`               | É uma string não-vazia.                      |
| String com espaços     | `' '`         | `true`               | É uma string não-vazia.                      |
| Array vazio            | `[]`          | `true`               | Arrays (e objetos) são sempre truthy.        |
| Objeto vazio           | `{}`          | `true`               | Objetos (e arrays) são sempre truthy.        |
| Função vazia           | `function(){}`| `true`               | Funções são um tipo de objeto e são truthy.  |

**Como Verificar Manualmente**

Você pode converter explicitamente qualquer valor para seu equivalente booleano usando a função `Boolean()` ou o atalho de dupla negação `!!`.

```javascript
console.log(Boolean('hello')); // true
console.log(Boolean(0));       // false

console.log(!!{});   // true
console.log(!!'');   // false
```

**Onde o Conceito é Aplicado**

- **Condicionais `if/else`**:
  ```javascript
  const carrinho = [];
  if (carrinho) { // [] é truthy, então o bloco executa
    console.log("O carrinho existe.");
  }
  ```
- **Operadores Lógicos `||` e `&&`**: O comportamento de curto-circuito depende inteiramente desses conceitos.
  ```javascript
  const nomeUsuario = '';
  const nomeFinal = nomeUsuario || 'Visitante'; // Retorna 'Visitante' porque '' é falsy

  const temPermissao = true;
  temPermissao && executarAcao(); // A função é chamada porque o primeiro valor é truthy
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

Operadores de atribuição são usados para atribuir valores a variáveis. O mais simples é o de atribuição básica (`=`), mas existem também os operadores de atribuição composta, que são atalhos para atualizar o valor de uma variável.

**1. Atribuição Simples (`=`)**

Atribui o valor do operando à direita para o operando à esquerda.

```javascript
let nome = "Alice";
let x = 10;
```

Uma característica importante é que a atribuição retorna o valor atribuído, o que permite encadear atribuições (a associatividade é da direita para a esquerda).

```javascript
let a, b, c;
a = b = c = 20;

console.log(a); // 20
console.log(b); // 20
console.log(c); // 20
```

**2. Atribuição Composta**

São atalhos para executar uma operação no valor de uma variável e atribuir o novo valor de volta a ela.

- **Adição e atribuição (`+=`)**
  `x += y` é o mesmo que `x = x + y`.
  ```javascript
  let saldo = 100;
  saldo += 50; // saldo agora é 150
  ```

- **Subtração e atribuição (`-=`)**
  `x -= y` é o mesmo que `x = x - y`.
  ```javascript
  let divida = 200;
  divida -= 70; // divida agora é 130
  ```

- **Multiplicação e atribuição (`*=`)**
  `x *= y` é o mesmo que `x = x * y`.
  ```javascript
  let score = 10;
  score *= 3; // score agora é 30
  ```

- **Divisão e atribuição (`/=`)**
  `x /= y` é o mesmo que `x = x / y`.
  ```javascript
  let fatias = 8;
  fatias /= 2; // fatias agora é 4
  ```

- **Módulo e atribuição (`%=`)**
  `x %= y` é o mesmo que `x = x % y`.
  ```javascript
  let numero = 10;
  numero %= 3; // numero agora é 1 (o resto de 10 dividido por 3)
  ```

### Operadores de Incremento e Decremento

São atalhos para adicionar ou subtrair 1 de uma variável.

- `++` (Incremento): Aumenta o valor em 1.
- `--` (Decremento): Diminui o valor em 1.

Eles podem ser usados de duas formas:

**1. Pós-fixado (ex: `variavel++`)**
O valor da variável é **primeiro retornado** (usado na expressão) e **depois incrementado**.

```javascript
let a = 5;
console.log(a++); // Imprime 5, e depois 'a' se torna 6
console.log(a);   // Imprime 6
```

**2. Pré-fixado (ex: `++variavel`)**
O valor da variável é **primeiro incrementado** e **depois retornado** (usado na expressão).

```javascript
let b = 5;
console.log(++b); // Imprime 6, pois 'b' se torna 6 antes de ser usado
console.log(b);   // Imprime 6
```

O mesmo se aplica ao decremento (`--`).

```javascript
let c = 10;
console.log(c--); // Imprime 10, depois c vira 9
console.log(--c); // c vira 8, e depois imprime 8
```

### Operadores de Comparação

Comparam dois valores e retornam um booleano (`true` ou `false`). A regra de ouro sobre igualdade estrita (`===`) também se aplica à desigualdade estrita (`!==`).

- `>` (Maior que)
- `<` (Menor que)
- `>=` (Maior ou igual a)
- `<=` (Menor ou igual a)

- `===` (Estritamente igual a): Retorna `true` se os operandos são iguais e do mesmo tipo. **(Recomendado)**
- `==` (Igual a): Retorna `true` se os operandos são iguais após a coerção de tipo.

- `!==` (Estritamente diferente de): Retorna `true` se os operandos não são iguais ou não são do mesmo tipo. **(Recomendado)**
- `!=` (Diferente de): Retorna `true` se os operandos não são iguais após a coerção de tipo.

**Exemplos de Igualdade:**
```javascript
10 === '10'; // false (compara valor E tipo)
10 == '10';  // true (compara apenas o valor após coerção)
```

**Exemplos de Desigualdade:**
```javascript
10 !== '10'; // true (porque os tipos são diferentes)
10 != '10';  // false (porque após a coerção, os valores são iguais)

1 !== true; // true (porque os tipos são diferentes)
1 != true;  // false (porque após a coerção, os valores são iguais)
```

#### Detalhes sobre Comparações de Grandeza (>, <, >=, <=)

Esses operadores funcionam como esperado para números, mas seu comportamento com outros tipos, como strings, é importante de se conhecer.

**1. Comparando Números**
A comparação é puramente matemática.
```javascript
10 > 5;    // true
10 >= 10;  // true
5 < 4;     // false
```

**2. Comparando Strings**
As strings são comparadas caractere por caractere, com base em seus valores na tabela Unicode. A comparação é "lexicográfica" (alfabética).
```javascript
'a' < 'b'; // true
'Gato' > 'Cachorro'; // true, porque 'G' vem depois de 'C' no alfabeto

// Cuidado com maiúsculas e minúsculas!
'Z' < 'a'; // true, porque letras maiúsculas têm valores Unicode menores que as minúsculas.
```

**3. Coerção de Tipo em Comparações**
Quando um número é comparado com uma string, o JavaScript tenta converter a string para um número antes de comparar.
```javascript
'10' > 5;   // true, a string '10' é convertida para o número 10
'1' < 10;   // true, a string '1' é convertida para o número 1

// Se a conversão falhar, o resultado é NaN, e toda comparação com NaN é false.
'Gato' > 10; // false, porque 'Gato' vira NaN, e NaN > 10 é false.
'Gato' < 10; // false, porque NaN < 10 é false.
```

### Operadores Lógicos

Operadores lógicos são tipicamente usados com valores booleanos, mas eles na verdade retornam o valor de um dos operandos. Por isso, são muito úteis para controle de fluxo.

**1. NÃO Lógico (`!`)**

É o mais simples. Ele inverte o valor booleano de um operando. Se o operando não for um booleano, ele primeiro o converte para um (usando as regras de truthy/falsy) e depois o inverte.

```javascript
!true;   // false
!false;  // true

// Coerção para booleano e inversão
!'Gato'; // false (porque 'Gato' é truthy)
!0;      // true (porque 0 é falsy)
!null;   // true (porque null é falsy)
```

**2. E Lógico (`&&`)**

Retorna o primeiro valor *falsy* que encontrar. Se todos os valores forem *truthy*, ele retorna o **último** valor.

Isso leva a um comportamento chamado **"curto-circuito" (short-circuiting)**: se o primeiro operando for `false` (ou falsy), o segundo operando **nem é avaliado**.

```javascript
// Com booleanos
true && true;   // true
true && false;  // false
false && true;  // false (o segundo 'true' não é avaliado)

// Com outros tipos
'Alice' && 'Bob';  // 'Bob' (ambos são truthy, retorna o último)
'' && 'Bob';       // '' (string vazia é falsy, retorna ela e para)
0 && 100;          // 0 (zero é falsy, retorna ele e para)
```

**Caso de uso comum: Execução condicional**
Você pode usar o `&&` como um atalho para um `if`.

```javascript
const usuarioLogado = true;
usuarioLogado && console.log("Bem-vindo!"); // A mensagem é exibida

const usuarioVisitante = false;
usuarioVisitante && console.log("Você não verá isso."); // A mensagem não é exibida
```

**3. OU Lógico (`||`)**

Retorna o primeiro valor *truthy* que encontrar. Se todos os valores forem *falsy*, ele retorna o **último** valor.

O "curto-circuito" aqui acontece quando o primeiro operando é `true` (ou truthy). O segundo operando não é avaliado.

```javascript
// Com booleanos
true || false;  // true (o segundo 'false' não é avaliado)
false || true;  // true
false || false; // false

// Com outros tipos
'Alice' || 'Bob';  // 'Alice' (é o primeiro truthy, retorna ele e para)
'' || 'Bob';       // 'Bob' (string vazia é falsy, continua e retorna 'Bob')
0 || null;         // null (ambos são falsy, retorna o último)
```

**Caso de uso comum: Definir valores padrão**
O `||` é muito usado para garantir que uma variável tenha um valor caso ela seja `null`, `undefined`, `0`, `''`, etc.

```javascript
const nomeUsuario = null;
const nomeExibido = nomeUsuario || "Visitante"; // nomeExibido será "Visitante"

const avatarUrl = "/img/avatar.png";
const avatarFinal = avatarUrl || "/img/default.png"; // avatarFinal será "/img/avatar.png"
```

### Ordem de Precedência dos Operadores

Quando múltiplos operadores são usados em uma única expressão, o JavaScript os avalia em uma ordem específica, conhecida como **ordem de precedência**. Isso determina qual operação é realizada primeiro.

```javascript
const resultado = 10 + 5 * 2; // O resultado é 20, não 30
```

Neste caso, a multiplicação (`*`) tem maior precedência que a adição (`+`), então `5 * 2` é calculado primeiro, resultando em `10`, e só depois a soma `10 + 10` é realizada.

**A Regra dos Parênteses**

A maneira mais clara e segura de garantir a ordem de execução é usar parênteses `()`. Expressões dentro de parênteses são sempre avaliadas primeiro, independentemente da precedência dos operadores.

```javascript
const resultadoCorreto = (10 + 5) * 2; // Agora o resultado é 30
```
**É uma boa prática usar parênteses sempre que uma expressão for complexa, mesmo que a ordem padrão já seja a desejada. Isso torna o código muito mais fácil de ler e entender.**

**Tabela de Precedência (Simplificada)**

Aqui está uma lista dos operadores mais comuns, da maior para a menor precedência:

1.  **Agrupamento**: `()`
2.  **Negação e Incremento/Decremento**: `!`, `++`, `--`
3.  **Multiplicação, Divisão e Módulo**: `*`, `/`, `%`
4.  **Adição e Subtração**: `+`, `-`
5.  **Operadores Relacionais**: `<`, `<=`, `>`, `>=`
6.  **Operadores de Igualdade**: `==`, `!=`, `===`, `!==`
7.  **E Lógico**: `&&`
8.  **OU Lógico**: `||`
9.  **Operadores de Atribuição**: `=`, `+=`, `-=`, etc.

**Associatividade**

Quando operadores têm a mesma precedência (como `*` e `/`), a **associatividade** determina a ordem. A maioria tem associatividade **da esquerda para a direita**.

```javascript
const calculo = 100 / 10 * 2; // Primeiro 100/10=10, depois 10*2=20.
```

A principal exceção são os operadores de atribuição, que têm associatividade **da direita para a esquerda**.

```javascript
let x, y;
x = y = 5; // Primeiro y recebe 5, depois x recebe o valor de y.
```


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

O controle de fluxo dita a ordem em que o código é executado. Com estruturas condicionais e laços de repetição, podemos criar lógicas complexas e dinâmicas.

### Condicional `if / else`: Uma Análise Detalhada

A estrutura `if` é o bloco de construção fundamental para a tomada de decisões em JavaScript. Ela permite que o programa execute diferentes caminhos de código com base em uma condição.

**1. A Estrutura Básica (`if`)**

Executa um bloco de código somente se a condição fornecida for avaliada como `true` (ou um valor *truthy*).

```javascript
const temperatura = 25;

if (temperatura > 22) {
  console.log("Está um dia quente!");
}
```
*Opcional: Para um único comando, as chaves `{}` não são obrigatórias, mas **é uma forte boa prática sempre usá-las** para evitar erros e melhorar a legibilidade.*

```javascript
// Funciona, mas não é recomendado
if (temperatura > 22) console.log("Dia quente!");
```

**2. A Cláusula `else`**

A cláusula `else` fornece um bloco de código alternativo que é executado se a condição do `if` for `false` (ou um valor *falsy*).

```javascript
const numero = 7;

if (numero % 2 === 0) {
  console.log("O número é par.");
} else {
  console.log("O número é ímpar.");
}
```

**3. Encadeando com `else if`**

Para testar múltiplas condições em sequência, você pode usar `else if`. O JavaScript avaliará cada condição em ordem e executará o bloco de código correspondente à **primeira** condição verdadeira que encontrar. Se nenhuma for verdadeira, o bloco `else` final será executado (se existir).

```javascript
const nota = 85;

if (nota >= 90) {
  console.log("Nota: A");
} else if (nota >= 80) {
  console.log("Nota: B"); // Esta condição é a primeira a ser verdadeira
} else if (nota >= 70) {
  console.log("Nota: C");
} else {
  console.log("Nota: Reprovado");
}
```

**4. Aninhamento de Condicionais (Nested `if`)**

Você pode colocar estruturas `if` dentro de outras para criar lógicas mais complexas.

```javascript
const usuario = { logado: true, permissao: "admin" };

if (usuario.logado) {
  console.log("Usuário está logado.");
  if (usuario.permissao === "admin") {
    console.log("Bem-vindo, Administrador!");
  } else {
    console.log("Bem-vindo, usuário!");
  }
} else {
  console.log("Por favor, faça o login.");
}
```
**Cuidado:** O aninhamento excessivo pode tornar o código difícil de ler e manter. Muitas vezes, pode ser simplificado com operadores lógicos ou refatorado em funções menores.

**5. Boas Práticas**

- **Sempre use chaves `{}`**: Aumenta a clareza e previne bugs ao adicionar novas linhas de código ao bloco `if` ou `else`.
- **Use Igualdade Estrita (`===`)**: Evite surpresas com a coerção de tipo usando `===` em vez de `==` nas suas condições.
- **Pense em "Guard Clauses"**: Para evitar aninhamento, você pode validar condições "negativas" no início de uma função.

  ```javascript
  // Em vez de aninhar...
  function processar(usuario) {
    if (usuario) {
      if (usuario.ativo) {
        // ...lógica principal aqui
      }
    }
  }

  // Use uma "Guard Clause"
  function processar(usuario) {
    if (!usuario || !usuario.ativo) {
      return; // Sai da função mais cedo
    }
    // ...lógica principal aqui, com menos aninhamento
  }
  ```

### Operador Condicional (Ternário)

É um atalho para a estrutura `if/else`, muito útil para atribuições condicionais em uma única linha.

A sintaxe é: `condição ? valorSeVerdadeiro : valorSeFalso`.

```javascript
const idade = 20;
const status = idade >= 18 ? "Maior de idade" : "Menor de idade";

console.log(status); // "Maior de idade"
```
Use-o para lógicas simples. Para múltiplas ações ou lógicas complexas, um `if/else` completo é mais legível.

### Condicional `switch`

É usado para comparar uma expressão com múltiplos valores diferentes. É uma alternativa mais limpa para uma cadeia longa de `if/else if`.

```javascript
const permissao = "admin"; // poderia ser "editor", "visitante", etc.

switch (permissao) {
  case "admin":
    console.log("Acesso total.");
    break; // Impede que o código continue para o próximo case
  case "editor":
    console.log("Acesso para editar conteúdo.");
    break;
  case "visitante":
    console.log("Acesso apenas para visualização.");
    break;
  default: // Executado se nenhum dos cases corresponder
    console.log("Permissão desconhecida.");
}
```

**Atenção ao `break`!**
Se você omitir o `break`, a execução "cairá" (fall-through) para o próximo `case` e o executará também, até encontrar um `break` ou o fim do `switch`.

```javascript
const diaSemana = 2;

switch (diaSemana) {
  case 1:
  case 2:
  case 3:
  case 4:
  case 5:
    console.log("Dia útil.");
    break; // Para aqui
  case 6:
  case 7:
    console.log("Fim de semana.");
    break;
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


## Tratamento de Erros e Exceções

Mesmo com o código bem escrito, erros podem acontecer. Uma entrada de usuário inválida, uma falha de rede, ou um bug inesperado podem interromper o fluxo normal do programa. O tratamento de exceções permite que você gerencie esses erros de forma elegante, sem que o programa quebre.

### 1. A Estrutura `try...catch`

É o principal mecanismo para tratar erros em JavaScript.

- **`try`**: Envolve o código que você suspeita que pode lançar um erro.
- **`catch`**: Bloco de código que é executado **se, e somente se**, um erro for lançado no bloco `try`. Ele recebe um objeto de erro como argumento, que contém informações sobre o erro.

```javascript
try {
  // Código propenso a erros aqui
  const dados = JSON.parse('{ "nome": "Ana", "idade": }'); // JSON inválido
  console.log(dados.nome);
} catch (erro) {
  // Código para tratar o erro
  console.log("Ocorreu um erro ao processar os dados.");
  console.log("Detalhes do erro:", erro.message); // Exibe a mensagem do erro
}

console.log("O programa continua executando...");
```
Sem o `try...catch`, o erro `SyntaxError` quebraria o script. Com ele, o erro é capturado e o programa continua.

**O Objeto de Erro**
O objeto passado para o `catch` geralmente possui estas propriedades:
- `name`: O nome do tipo do erro (ex: `SyntaxError`, `TypeError`).
- `message`: Uma mensagem descritiva sobre o erro.
- `stack`: O "caminho" no código que levou ao erro, útil para depuração.

### 2. Lançando Exceções com `throw`

Você não precisa depender apenas dos erros nativos do JavaScript. Você pode criar e "lançar" suas próprias exceções usando a palavra-chave `throw`. Isso é útil para sinalizar condições de erro específicas da lógica do seu aplicativo.

A boa prática é sempre lançar um objeto `Error`.

```javascript
function calcularArea(largura, altura) {
  if (typeof largura !== 'number' || typeof altura !== 'number') {
    throw new Error("Largura e altura devem ser números.");
  }
  if (largura <= 0 || altura <= 0) {
    throw new Error("Largura e altura devem ser valores positivos.");
  }
  return largura * altura;
}

try {
  const area = calcularArea(10, "vinte");
  console.log("Área:", area);
} catch (e) {
  console.error("Erro na função calcularArea:", e.message);
}
```

### 3. A Cláusula `finally`

O bloco `finally` é opcional e executa um código **após** o `try` e o `catch`, independentemente de um erro ter ocorrido ou não. É ideal para tarefas de "limpeza", como fechar uma conexão de rede ou um arquivo, garantindo que essas ações aconteçam em qualquer cenário.

```javascript
let conexaoAberta = true;

try {
  console.log("Abrindo conexão com o banco de dados...");
  // throw new Error("Falha na comunicação!"); // Descomente para simular um erro
  console.log("Processando dados...");
} catch (erro) {
  console.error("Erro durante o processamento:", erro.message);
} finally {
  // Este bloco SEMPRE executa
  conexaoAberta = false;
  console.log("Fechando conexão com o banco de dados. Status:", conexaoAberta);
}
```

### 4. Tipos de Erros Comuns

JavaScript tem vários tipos de objetos de erro nativos que são lançados em diferentes situações:
- **`SyntaxError`**: Um erro na sintaxe do código que impede o programa de ser analisado.
- **`ReferenceError`**: Ocorre ao tentar acessar uma variável que não foi declarada.
- **`TypeError`**: Ocorre quando um valor não é do tipo esperado (ex: tentar chamar uma string como se fosse uma função).
- **`RangeError`**: Ocorre quando um número está fora de uma faixa permitida.
