# Funções e Escopo em JavaScript

Funções são um dos blocos de construção mais importantes em JavaScript. Elas são blocos de código reutilizáveis que executam uma tarefa específica.

## O que são Funções?

Uma função é um procedimento — um conjunto de instruções que realiza uma tarefa. Para usar uma função, você deve defini-la em algum lugar e depois chamá-la.

## Declarando Funções

Existem várias maneiras de declarar uma função em JavaScript.

### Declaração de Função (Function Declaration)

A forma mais comum.

```javascript
function saudar() {
  console.log("Olá, mundo!");
}

// Chamando a função
saudar(); // Saída: Olá, mundo!
```

### Expressão de Função (Function Expression)

Uma função também pode ser definida como uma expressão e atribuída a uma variável.

```javascript
const minhaSaudacao = function() {
  console.log("Olá de novo!");
};

minhaSaudacao(); // Saída: Olá de novo!
```

### Hoisting (Içamento)

Hoisting é um comportamento do JavaScript onde as declarações de variáveis e funções são "movidas" para o topo de seu escopo (global ou de função) antes da execução do código.

**1. Hoisting de Declaração de Função**

Declarações de função são completamente içadas. Isso significa que você pode chamar uma função *antes* de tê-la declarado no código.

```javascript
// A função é chamada antes de ser declarada, e funciona!
chamarMeuNome(); // Saída: Meu nome é Duke

function chamarMeuNome() {
  console.log("Meu nome é Duke");
}
```

**2. Hoisting com Expressão de Função**

Com expressões de função, o comportamento é diferente. A variável (`minhaFuncao`, por exemplo) é içada, mas a atribuição da função a ela não é.

- Se usar `var`, a variável é inicializada como `undefined`. Tentar chamá-la antes da atribuição resultará em um `TypeError`.
- Se usar `let` ou `const`, a variável fica em uma "Temporal Dead Zone" (TDZ) até ser declarada. Tentar acessá-la antes resultará em um `ReferenceError`.

```javascript
// Isso vai gerar um erro!
// tenteChamar(); // TypeError: tenteChamar is not a function

var tenteChamar = function() {
  console.log("Isso não vai funcionar antes da linha acima.");
};

// Com let ou const, o erro seria ReferenceError.
```

**Regra geral:** Para evitar confusão, declare suas funções e variáveis no topo de seus escopos, ou simplesmente use declarações de função quando precisar do hoisting e expressões de função quando não precisar.

## Parâmetros e Argumentos

Funções podem aceitar **parâmetros**, que são como variáveis locais para a função.
Quando você chama a função, você passa **argumentos** para esses parâmetros.

```javascript
// 'nome' é um parâmetro
function saudarPessoa(nome) {
  console.log("Olá, " + nome + "!");
}

// "Maria" e "João" são argumentos
saudarPessoa("Maria"); // Saída: Olá, Maria!
saudarPessoa("João");  // Saída: Olá, João!
```

## O Comando `return`

Funções podem retornar um valor para o local onde foram chamadas usando o comando `return`.

```javascript
function somar(a, b) {
  return a + b;
}

const resultado = somar(5, 3);
console.log(resultado); // Saída: 8
```

## Escopo (Scope)

Escopo determina a acessibilidade (visibilidade) das variáveis. Em JavaScript, existem principalmente três tipos de escopo:

1.  **Escopo Global:** Variáveis declaradas fora de qualquer função são globais. Elas podem ser acessadas de qualquer lugar no seu código.

    ```javascript
    const nomeGlobal = "Mundo"; // Escopo Global

    function minhaFuncao() {
      console.log(nomeGlobal); // Acessível aqui dentro
    }
    minhaFuncao();
    ```

2.  **Escopo de Função:** Variáveis declaradas dentro de uma função são locais para essa função. Elas não podem ser acessadas de fora.

    ```javascript
    function outraFuncao() {
      const nomeLocal = "JavaScript"; // Escopo de Função
      console.log(nomeLocal);
    }

    outraFuncao();
    // console.log(nomeLocal); // Erro! nomeLocal não está definido aqui fora.
    ```

3.  **Escopo de Bloco (ES6):** Com `let` e `const`, as variáveis também têm escopo de bloco. Elas são acessíveis apenas dentro do bloco (`{...}`) em que foram declaradas (ex: dentro de um `if` ou `for`).

    ```javascript
    if (true) {
      let variavelDeBloco = "Visível apenas aqui";
      console.log(variavelDeBloco);
    }

    // console.log(variavelDeBloco); // Erro! Não está definida aqui.
    ```

Entender o escopo é crucial para evitar bugs e escrever um código limpo e previsível.

## Contexto de Execução (`this`)

Se o escopo é sobre a visibilidade das variáveis, o **contexto** é sobre **a quem pertence a execução da função**. Em JavaScript, o contexto é determinado pela palavra-chave `this`.

O valor de `this` é dinâmico e depende de **como a função é chamada**.

### 1. `this` no Contexto Global

Fora de qualquer função, `this` refere-se ao objeto global. Nos navegadores, o objeto global é o `window`.

```javascript
console.log(this); // Em um navegador, irá mostrar o objeto Window
```

### 2. `this` em Métodos de Objeto

Quando uma função é chamada como um método de um objeto, `this` refere-se ao próprio objeto.

```javascript
const pessoa = {
  nome: "Ana",
  saudar: function() {
    // 'this' aqui se refere ao objeto 'pessoa'
    console.log("Olá, meu nome é " + this.nome);
  }
};

pessoa.saudar(); // Saída: Olá, meu nome é Ana
```

### 3. `this` em Funções Simples

Quando uma função é chamada sozinha (não como um método), o comportamento de `this` muda.

- **Modo não-estrito (Sloppy Mode):** `this` se refere ao objeto global (`window`).
- **Modo estrito ('use strict'):** `this` é `undefined`. Isso evita bugs, pois impede que você modifique o objeto global acidentalmente.

```javascript
'use strict'; // Ativa o modo estrito

function quemSouEu() {
  console.log(this);
}

quemSouEu(); // Saída: undefined
```

### 4. `this` em Arrow Functions (ES6)

Arrow functions não possuem seu próprio contexto `this`. Em vez disso, elas **herdam o `this` do escopo pai** (o escopo onde foram criadas). Isso as torna muito previsíveis.

```javascript
const carro = {
  marca: "Ford",
  getMarca: function() {
    // 'this' aqui é o objeto 'carro'
    const mostrar = () => {
      // A arrow function herda o 'this' de getMarca
      console.log(this.marca);
    };
    mostrar();
  }
};

carro.getMarca(); // Saída: Ford
```

### 5. Manipulando `this` com `call`, `apply` e `bind`

JavaScript permite que você defina manualmente o valor de `this` usando métodos especiais da função:

- `.call(contexto, arg1, arg2)`: Executa a função com um `this` definido e argumentos passados individualmente.
- `.apply(contexto, [arg1, arg2])`: Similar ao `call`, mas os argumentos são passados como um array.
- `.bind(contexto)`: **Não executa a função**, mas retorna uma nova função que, quando chamada, terá o `this` permanentemente definido para o contexto passado.

```javascript
function apresentar(cidade) {
  console.log(`Eu sou ${this.nome} e moro em ${cidade}.`);
}

const dev = { nome: "Carlos" };

// Usando .call para definir 'this' como o objeto 'dev'
apresentar.call(dev, "São Paulo"); // Saída: Eu sou Carlos e moro em São Paulo.
```
