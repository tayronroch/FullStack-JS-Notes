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

### Funções Anônimas

Uma função anônima é, literalmente, uma função sem nome. A `Function Expression` que vimos acima é o exemplo mais comum de uso de uma função anônima.

```javascript
// A função à direita do sinal de '=' é anônima
const dizerOi = function() {
  console.log("Oi");
};
```

Elas são extremamente úteis em JavaScript e aparecem em vários contextos.

**1. Funções de Callback**

Este é o uso mais frequente. Uma função de callback é uma função passada como argumento para outra função, para ser "chamada de volta" (executed) mais tarde. Como elas geralmente são usadas apenas naquele ponto específico, não há necessidade de dar-lhes um nome.

**Exemplo com `setTimeout`:**
```javascript
// Passamos uma função anônima que será executada após 1000ms (1 segundo).
setTimeout(function() {
  console.log("Esta mensagem apareceu após 1 segundo.");
}, 1000);
```

**Exemplo com métodos de Array:**
```javascript
const numeros = [1, 2, 3, 4, 5];

// Passamos uma função anônima para o método .map()
const dobrados = numeros.map(function(num) {
  return num * 2;
});

console.log(dobrados); // Saída: [2, 4, 6, 8, 10]
```

**2. IIFE (Immediately Invoked Function Expression)**

É um padrão de design onde uma função anônima é executada assim que é definida. O principal objetivo histórico era criar um escopo privado para variáveis, evitando a poluição do escopo global.

A sintaxe envolve criar uma função anônima e envolvê-la em parênteses, e depois chamá-la imediatamente com outro par de parênteses.

```javascript
(function() {
  const mensagem = "Estou dentro de uma IIFE!";
  console.log(mensagem); // A mensagem é exibida imediatamente.
})();

// console.log(mensagem); // Erro! 'mensagem' não está acessível aqui fora.
```

**3. Arrow Functions como Funções Anônimas**

O ES6 introduziu as Arrow Functions (`=>`), que oferecem uma sintaxe muito mais curta e concisa para escrever funções anônimas, tornando-as a escolha preferida em código moderno para callbacks.

```javascript
// Exemplo de callback com função anônima tradicional
setTimeout(function() {
  console.log("Função tradicional");
}, 1000);

// O mesmo exemplo com Arrow Function
setTimeout(() => {
  console.log("Arrow Function!");
}, 1000);


// Exemplo de map com Arrow Function
const numeros = [1, 2, 3];
const triplicados = numeros.map(num => num * 3); // Sintaxe ainda mais curta
console.log(triplicados); // [3, 6, 9]
```

### Hoisting (Içamento): Uma Análise Detalhada

Hoisting é um comportamento do JavaScript onde as declarações de variáveis e funções são processadas antes de qualquer código ser executado. É como se o interpretador "içasse" (levantasse) essas declarações para o topo de seus escopos (seja o escopo global ou de uma função).

É importante entender que não é o código que é movido fisicamente, mas sim a forma como o motor do JavaScript compila e prepara o código antes da execução.

**1. Hoisting de Declaração de Função (`function nome() {}`)**

As declarações de função são completamente içadas. Tanto o nome quanto o corpo da função são movidos para o topo. Isso permite que você chame uma função antes mesmo de tê-la declarado no código.

```javascript
// A função é chamada antes de ser declarada, e funciona perfeitamente.
chamarMeuNome(); // Saída: Meu nome é Duke

function chamarMeuNome() {
  console.log("Meu nome é Duke");
}
```

**2. Hoisting de Variáveis (A Grande Diferença: `var` vs. `let`/`const`)**

O hoisting de variáveis é mais complexo e é uma das principais razões pelas quais `let` e `const` foram introduzidos no ES6.

**a) Com `var`**

Apenas a **declaração** da variável é içada, não a sua **atribuição**. A variável é automaticamente inicializada com o valor `undefined` no topo do seu escopo.

```javascript
console.log(minhaVar); // Saída: undefined

var minhaVar = 10;

console.log(minhaVar); // Saída: 10
```
O que o motor do JavaScript efetivamente faz:
```javascript
// 1. A declaração é içada e inicializada com undefined
var minhaVar;

// 2. O código é executado
console.log(minhaVar); // undefined

// 3. A atribuição acontece onde foi escrita
minhaVar = 10;

console.log(minhaVar); // 10
```

**b) Com `let` e `const` (Temporal Dead Zone - TDZ)**

As declarações com `let` e `const` também são içadas, mas de uma forma diferente. Elas **não são inicializadas** com `undefined`. Em vez disso, elas entram em um estado chamado **"Temporal Dead Zone" (TDZ)**.

A TDZ é o período entre o início do escopo e a linha onde a variável é declarada. Qualquer tentativa de acessar a variável dentro da TDZ resultará em um `ReferenceError`. Isso é uma medida de segurança para evitar o uso de variáveis antes de sua declaração explícita.

```javascript
// console.log(minhaLet); // ReferenceError: Cannot access 'minhaLet' before initialization

let minhaLet = 20;

console.log(minhaLet); // Saída: 20
```

**3. Hoisting e Expressões de Função**

Expressões de função são tratadas como atribuições de variáveis, então as regras acima se aplicam.

```javascript
// Com var, a variável é içada como undefined, resultando em TypeError se chamada.
// console.log(typeof minhaFuncao); // undefined
// minhaFuncao(); // TypeError: minhaFuncao is not a function

var minhaFuncao = function() {
  console.log("Olá!");
};

// Com let, a variável entra na TDZ, resultando em ReferenceError.
// outraFuncao(); // ReferenceError: Cannot access 'outraFuncao' before initialization

let outraFuncao = function() {
  console.log("Tchau!");
};
```

**Regra de Ouro:** Para um código mais limpo e previsível, declare suas funções primeiro e sempre declare suas variáveis e constantes no topo de seus escopos. Prefira `let` e `const` em vez de `var` para se beneficiar da segurança da TDZ.

## Parâmetros e Argumentos: Uma Análise Detalhada

Embora os termos sejam usados de forma intercambiável, eles têm significados distintos que são importantes para entender como as funções recebem e manipulam dados.

**1. A Diferença Fundamental**

- **Parâmetros**: São as variáveis listadas na **definição** da função. Eles atuam como espaços reservados para os valores que a função espera receber.
- **Argumentos**: São os **valores reais** que são passados para a função quando ela é **chamada (invocada)**.

```javascript
// 'param1' e 'param2' são PARÂMETROS
function somar(param1, param2) {
  return param1 + param2;
}

// 5 e 10 são ARGUMENTOS
const resultado = somar(5, 10);
```

**2. Parâmetros Padrão (Default Parameters - ES6)**

Você pode definir um valor padrão para um parâmetro caso nenhum argumento (ou `undefined`) seja passado para ele.

```javascript
function saudar(nome = "Visitante") {
  console.log(`Olá, ${nome}!`);
}

saudar("Ana");   // Saída: Olá, Ana!
saudar();       // Saída: Olá, Visitante!
```

**3. Parâmetros Rest (Rest Parameters - ES6)**

É a forma moderna de permitir que uma função aceite um número indefinido de argumentos, agrupando-os em um **array verdadeiro**.

- Usa a sintaxe `...` antes do nome do último parâmetro.
- Agrupa todos os argumentos *restantes* em um array.

```javascript
// O parâmetro 'numeros' será um array com todos os argumentos passados.
function somarTodos(...numeros) {
  // Agora podemos usar métodos de array, como o reduce
  return numeros.reduce((total, num) => total + num, 0);
}

console.log(somarTodos(1, 2, 3));       // Saída: 6
console.log(somarTodos(10, 20, 30, 40)); // Saída: 100
```

Você também pode combinar parâmetros normais com o parâmetro rest.

```javascript
function apresentar(primeiroConvidado, ...outrosConvidados) {
  console.log(`O convidado de honra é ${primeiroConvidado}.`);
  console.log(`Os outros convidados são: ${outrosConvidados.join(', ')}.`);
}

apresentar("Maria", "João", "Pedro", "Sofia");
```

**4. O Objeto `arguments` (Legado)**

Antes do ES6, a única maneira de acessar todos os argumentos passados para uma função era através do objeto `arguments`.

- É um **objeto "array-like"** (parecido com um array), não um array de verdade. Ele tem a propriedade `length`, mas não tem métodos como `map`, `forEach` ou `reduce`.
- **Não funciona em Arrow Functions.**

```javascript
function logarArgumentos() {
  console.log(arguments);
  for (let i = 0; i < arguments.length; i++) {
    console.log(`Argumento ${i}: ${arguments[i]}`);
  }
}

logarArgumentos("a", "b", "c");
// Saída: [Arguments] { '0': 'a', '1': 'b', '2': 'c' }
// E depois os logs individuais...
```
**Nota:** Com a introdução dos parâmetros rest (`...`), o uso direto do objeto `arguments` tornou-se menos comum e é geralmente desaconselhado em código moderno.

**5. Desestruturação de Parâmetros (Destructuring - ES6)**

Você pode "desempacotar" valores de objetos ou arrays diretamente na lista de parâmetros, tornando o código mais limpo e legível.

```javascript
// Desestruturando um objeto
const usuario = {
  nome: "Carlos",
  idade: 35,
  email: "carlos@exemplo.com"
};

// A função espera um objeto e extrai apenas as propriedades 'nome' e 'idade'
function exibirInfo({ nome, idade }) {
  console.log(`${nome} tem ${idade} anos.`);
}

exibirInfo(usuario); // Saída: Carlos tem 35 anos.

// Combinando com parâmetros padrão
function criarConfig({ tema = "claro", idioma = "pt-br" } = {}) {
  console.log(`Tema: ${tema}, Idioma: ${idioma}`);
}

criarConfig({ tema: "escuro" }); // Saída: Tema: escuro, Idioma: pt-br
criarConfig();                   // Saída: Tema: claro, Idioma: pt-br
```

## O Comando `return`: Retornando Valores

O comando `return` finaliza a execução de uma função e especifica um valor a ser retornado para o local onde a função foi chamada.

**1. Retornando um Valor Simples**

Qualquer tipo de dado pode ser retornado por uma função: um número, uma string, um booleano, um objeto, etc.

```javascript
function somar(a, b) {
  return a + b; // Retorna a soma de a e b
}

const resultado = somar(5, 3);
console.log(resultado); // Saída: 8
```

**2. Retorno Implícito: `undefined`**

Se uma função não tiver um comando `return`, ou se tiver um `return` sem um valor, ela automaticamente retornará `undefined`.

```javascript
function logarMensagem(mensagem) {
  console.log(mensagem);
  // Nenhum 'return' aqui
}

const valorRetornado = logarMensagem("Olá!"); // "Olá!" é impresso no console
console.log(valorRetornado); // Saída: undefined
```

**3. Retorno Antecipado (Early Return)**

O comando `return` para a execução da função imediatamente. Qualquer código após o `return` dentro da mesma função não será executado. Isso é muito útil para criar "Guard Clauses", que validam dados no início da função e a encerram mais cedo se as condições não forem atendidas.

```javascript
function dividir(a, b) {
  if (b === 0) {
    // Se a condição for atendida, a função para aqui e retorna uma mensagem.
    return "Erro: Divisão por zero não é permitida.";
  }

  // Este código só é executado se a condição do 'if' for falsa.
  return a / b;
}

console.log(dividir(10, 2)); // Saída: 5
console.log(dividir(10, 0)); // Saída: Erro: Divisão por zero não é permitida.
```

**4. Retornando Múltiplos Valores**

Uma função só pode retornar **um único valor**. No entanto, você pode agrupar múltiplos valores em um objeto ou array e retornar essa estrutura. A desestruturação (destructuring) do ES6 torna esse processo muito elegante.

**a) Retornando um Objeto**
Esta é a abordagem mais comum e legível, pois os valores retornados têm nomes (chaves).

```javascript
function getUsuario(id) {
  // Simula a busca de um usuário
  return {
    id: id,
    nome: "Ana Silva",
    email: "ana.silva@exemplo.com"
  };
}

const { nome, email } = getUsuario(123);
console.log(`Nome: ${nome}, Email: ${email}`); // Saída: Nome: Ana Silva, Email: ana.silva@exemplo.com
```

**b) Retornando um Array**
Útil quando a ordem dos valores retornados é mais importante do que seus nomes.

```javascript
function calcularOperacoes(a, b) {
  const soma = a + b;
  const subtracao = a - b;
  return [soma, subtracao];
}

const [resultadoSoma, resultadoSub] = calcularOperacoes(10, 5);
console.log(`Soma: ${resultadoSoma}, Subtração: ${resultadoSub}`); // Saída: Soma: 15, Subtração: 5
```

## Funções de Callback (Callbacks)

Uma função de callback é um dos conceitos mais fundamentais e poderosos em JavaScript, especialmente para lidar com operações assíncronas.

**1. O que é uma Callback?**

Uma função de callback é uma função que é passada como um **argumento** para outra função, com a intenção de ser executada mais tarde (ser "chamada de volta").

Pense nisso como dar seu telefone e instruções a alguém: "Faça esta tarefa e, *quando terminar*, me ligue de volta (execute a callback)".

```javascript
// 'executarQuandoPronto' é a nossa função de callback.
function fazerAlgo(tarefa, executarQuandoPronto) {
  console.log(`Iniciando a tarefa: ${tarefa}`);
  // Simula uma operação demorada...
  console.log("...tarefa em andamento...");
  // Quando a tarefa termina, chamamos a callback.
  executarQuandoPronto();
}

// Passamos uma função anônima como callback.
fazerAlgo("Lavar a louça", function() {
  console.log("Tarefa finalizada!");
});
```

**2. Callbacks Síncronos**

Nem toda callback é assíncrona. Callbacks síncronos são executados durante a execução da função de ordem superior (a função que os recebe). Eles são comuns em métodos de manipulação de arrays.

**Exemplo com `.map()`:**
O método `.map()` recebe uma função de callback e a executa para **cada item** do array, uma vez por item, de forma síncrona.

```javascript
const numeros = [1, 2, 3, 4];

const callbackDobrar = (numero) => {
  return numero * 2;
};

const dobrados = numeros.map(callbackDobrar);

console.log(dobrados); // Saída: [2, 4, 6, 8]
```

**3. Callbacks Assíncronos**

Este é o caso de uso mais importante. Callbacks são a maneira clássica de lidar com operações que levam tempo, como requisições de rede, timers ou eventos do usuário, sem travar o programa.

**Exemplo com `setTimeout`:**
A função `setTimeout` recebe uma callback e um tempo. Ela espera esse tempo passar e, só então, executa a callback. O resto do seu código continua a ser executado normalmente.

```javascript
console.log("1. Pedido enviado.");

setTimeout(() => {
  // Esta callback só executa após 2 segundos.
  console.log("3. Resposta recebida!");
}, 2000);

console.log("2. Continuo fazendo outras coisas...");
```
A saída no console será `1`, `2`, e depois de 2 segundos, `3`.

**4. O "Callback Hell" (Inferno de Callbacks)**

Quando você tem múltiplas operações assíncronas que dependem uma da outra, você pode acabar aninhando callbacks dentro de callbacks. Isso cria uma estrutura de código conhecida como "Pyramid of Doom" ou "Callback Hell", que é difícil de ler, manter e depurar.

```javascript
// Exemplo de Callback Hell
primeiraFuncao(arg, function(resultado1) {
  segundaFuncao(resultado1, function(resultado2) {
    terceiraFuncao(resultado2, function(resultado3) {
      // E assim por diante...
      console.log("Finalmente!", resultado3);
    }, falhaCallback);
  }, falhaCallback);
}, falhaCallback);
```

Esse problema foi a principal motivação para a introdução de **Promises** e, posteriormente, **`async/await`** no JavaScript, que oferecem maneiras muito mais limpas e legíveis de lidar com a assincronicidade.

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

### 4. Arrow Functions (=>) do ES6: Uma Análise Detalhada

Introduzidas no ES6, as Arrow Functions mudaram a forma como as funções são escritas em JavaScript, oferecendo uma sintaxe mais curta e um comportamento mais intuitivo para a palavra-chave `this`.

**a) Sintaxe Concisa**

Arrow functions permitem uma escrita mais limpa e direta, especialmente para funções anônimas.

```javascript
// Função tradicional
const somar_trad = function(a, b) {
  return a + b;
};

// Com Arrow Function
const somar_arrow = (a, b) => {
  return a + b;
};
```

**Retorno Implícito:** Se a função tem apenas uma linha e essa linha é um `return`, você pode omitir as chaves `{}` e a palavra `return`.

```javascript
const somar = (a, b) => a + b; // Retorno implícito
const quadrado = n => n * n;   // Com um único parâmetro, os parênteses são opcionais
```

**Retornando um Objeto:** Para retornar um objeto literal em uma única linha, você deve envolvê-lo em parênteses `()` para que as chaves `{}` não sejam confundidas com o corpo da função.

```javascript
const criarPessoa = (nome, idade) => ({ nome: nome, idade: idade });
```

**b) O Comportamento do `this` (Herança Lexical)**

Esta é a diferença mais importante. **Arrow functions não possuem seu próprio contexto `this`**. Em vez disso, elas **herdam o `this` do escopo pai** (o escopo onde foram criadas). Isso é chamado de "this lexical".

Isso resolve um problema comum em JavaScript com funções de callback:

```javascript
const equipe = {
  nome: "Time de Desenvolvedores",
  membros: ["Ana", "Carlos", "Maria"],

  // Usando uma função tradicional (que cria seu próprio 'this')
  listarMembros_problema: function() {
    this.membros.forEach(function(membro) {
      // ERRO: 'this' aqui dentro não é o objeto 'equipe'.
      // Em modo não-estrito, é o objeto global (window). Em modo estrito, é undefined.
      // console.log(`${membro} faz parte do ${this.nome}`); // Vai falhar
    });
  },

  // Usando uma Arrow Function (que herda o 'this' de listarMembros)
  listarMembros_solucao: function() {
    // 'this' aqui é o objeto 'equipe'
    this.membros.forEach(membro => {
      // SUCESSO: A arrow function herda o 'this' do contexto pai.
      console.log(`${membro} faz parte do ${this.nome}`);
    });
  }
};

equipe.listarMembros_solucao();
```

**c) Outras Diferenças Importantes**

- **Não possuem o objeto `arguments`**: Se precisar dos argumentos, use parâmetros rest (`...args`).
- **Não podem ser usadas como construtores**: Tentar usar `new` com uma arrow function resultará em um `TypeError`.

**d) Quando NÃO Usar Arrow Functions**

Apesar de úteis, há situações em que elas não são a escolha certa:

- **Métodos de um objeto**: Se você precisa que o `this` se refira ao próprio objeto, use uma função tradicional.

  ```javascript
  const obj = {
    valor: 42,
    getValor: () => {
      // 'this' aqui não é 'obj'. Será o 'this' do escopo global.
      return this.valor; // undefined (no navegador, em modo não-estrito)
    }
  };
  ```

- **Funções Construtoras**: Como mencionado, elas não podem ser usadas com `new`.

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

## Promises: Gerenciando a Assincronicidade

As Promises foram introduzidas no ES6 como uma solução robusta e flexível para o "Callback Hell", proporcionando uma maneira mais limpa e gerenciável de lidar com operações assíncronas.

**1. O que é uma Promise?**

Uma **Promise** é um objeto que representa a eventual conclusão (ou falha) de uma operação assíncrona e seu valor resultante.

A analogia mais comum é a de um recibo: quando você pede um café, você recebe um recibo (a Promise). Você ainda não tem o café, mas o recibo é a garantia de que você o receberá (estado *fulfilled*) ou será informado de que houve um problema (estado *rejected*).

**2. Os 3 Estados de uma Promise**

Uma Promise sempre estará em um destes três estados:

- **`pending` (pendente):** O estado inicial. A operação ainda não foi concluída.
- **`fulfilled` (realizada/resolvida):** A operação foi concluída com sucesso, e a Promise tem um valor resultante.
- **`rejected` (rejeitada):** A operação falhou, e a Promise tem um motivo (um erro).

Uma vez que uma Promise é *fulfilled* ou *rejected*, ela está em um estado "settled" (estabelecido) e seu valor não pode mais ser alterado.

**3. Consumindo uma Promise: `.then()`, `.catch()` e `.finally()`**

Para interagir com uma Promise, usamos seus métodos:

- **`.then(onFulfilled)`**: Agenda uma função de callback para ser executada quando a Promise for resolvida. Esta função recebe o valor resolvido como argumento.
- **`.catch(onRejected)`**: Agenda uma função para ser executada quando a Promise for rejeitada. Esta função recebe o erro (o motivo da rejeição) como argumento. É uma forma mais legível do que usar o segundo argumento do `.then()`.
- **`.finally(onFinally)`**: Agenda uma função para ser executada quando a Promise for estabelecida (seja resolvida ou rejeitada). É ideal para código de limpeza, como esconder um spinner de carregamento.

```javascript
const minhaPromise = new Promise((resolve, reject) => {
  const sucesso = true;
  setTimeout(() => {
    if (sucesso) {
      resolve("Dados recebidos com sucesso!");
    } else {
      reject(new Error("Falha ao buscar dados."));
    }
  }, 2000);
});

console.log("Iniciando a requisição...");

minhaPromise
  .then((resultado) => {
    // Executado se a promise for resolvida (fulfilled)
    console.log("Sucesso:", resultado);
  })
  .catch((erro) => {
    // Executado se a promise for rejeitada (rejected)
    console.error("Erro:", erro.message);
  })
  .finally(() => {
    // Executado sempre, ao final de tudo
    console.log("Operação finalizada.");
  });
```

**4. Encadeamento de Promises (Chaining)**

A verdadeira força das Promises está no encadeamento. Cada chamada a `.then()` ou `.catch()` retorna uma **nova Promise**, permitindo que você encadeie operações assíncronas de forma linear e legível, acabando com o "Callback Hell".

```javascript
// Simulando o "Callback Hell" com Promises
primeiraFuncao(arg)
  .then(resultado1 => {
    return segundaFuncao(resultado1); // Retorna uma nova promise
  })
  .then(resultado2 => {
    return terceiraFuncao(resultado2); // Retorna outra nova promise
  })
  .then(resultado3 => {
    console.log("Finalmente!", resultado3);
  })
  .catch(falhaCallback); // Um único .catch para tratar qualquer erro na cadeia
```

**5. Métodos Estáticos Úteis**

- **`Promise.all(iterable)`**: Recebe um array de Promises e retorna uma nova Promise que é resolvida quando **todas** as Promises do array são resolvidas. Se **qualquer uma** for rejeitada, a Promise principal é imediatamente rejeitada.

  ```javascript
  const p1 = Promise.resolve("Primeira");
  const p2 = new Promise(resolve => setTimeout(() => resolve("Segunda"), 1000));
  const p3 = Promise.resolve("Terceira");

  Promise.all([p1, p2, p3]).then(resultados => {
    console.log(resultados); // ["Primeira", "Segunda", "Terceira"] (após 1 segundo)
  });
  ```

- **`Promise.race(iterable)`**: Recebe um array de Promises e retorna uma nova Promise que é resolvida ou rejeitada assim que a **primeira** Promise do array for resolvida ou rejeitada.

As Promises são a base para a sintaxe `async/await`, que torna o código assíncrono ainda mais fácil de ler.