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
