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

#### Detalhes Avançados do Loop `for` (Perspectiva de Engenharia)

O loop `for` clássico, embora pareça simples, oferece um nível de controle que os métodos de iteração mais modernos (`forEach`, `map`) não fornecem. Um engenheiro experiente o utiliza para cenários que exigem otimização e manipulação precisa do fluxo.

**1. Todas as Cláusulas são Opcionais**

As três partes da declaração `for` são opcionais. Isso permite construções flexíveis (e perigosas se não usadas com cuidado).

```javascript
let i = 0;

// Loop 'for' sem inicialização (a variável já foi declarada fora)
for (; i < 5; i++) {
  console.log(i);
}

// Loop 'for' sem a expressão final (o incremento é feito dentro do bloco)
for (let j = 0; j < 5;) {
  console.log(j);
  j++;
}

// Um 'for' sem condição e sem expressão final é um loop infinito,
// equivalente a 'while (true)'. Requer um 'break' para sair.
for (let k = 0; ; ) {
  if (k > 3) {
    break;
  }
  console.log(k);
  k++;
}
```

**2. Múltiplas Variáveis e Expressões**

A cláusula de inicialização e a expressão final podem lidar com múltiplas variáveis, separadas por vírgula. Isso é útil para algoritmos mais complexos.

**Exemplo:** Iterar em um array do início e do fim ao mesmo tempo.

```javascript
const items = ['a', 'b', 'c', 'd', 'e'];

for (let i = 0, j = items.length - 1; i <= j; i++, j--) {
  console.log(`Par: ${items[i]} e ${items[j]}`);
  if (i === j) {
    console.log('Os ponteiros se encontraram.');
  }
}
// Saída:
// Par: a e e
// Par: b e d
// Par: c e c
// Os ponteiros se encontraram.
```

**3. Escopo de Bloco com `let` (Crucial para Assincronicidade)**

Antes do ES6 (`let`/`const`), usar `var` em loops era uma fonte comum de bugs, especialmente com closures e código assíncrono.

-   **`var`:** Tem escopo de função. A mesma variável é "reaproveitada" a cada iteração.
-   **`let`:** Tem escopo de bloco. A cada iteração, uma **nova** variável é criada, capturando o valor daquela iteração específica.

**O Problema Clássico:**

```javascript
// Usando 'var', todos os setTimeouts referenciam a MESMA variável 'i'.
// Quando eles executam, o loop já terminou e o valor final de 'i' é 3.
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(`Com var: ${i}`); // Imprime "Com var: 3" três vezes.
  }, 10);
}

// Usando 'let', cada iteração tem sua PRÓPRIA variável 'i'.
// O closure do setTimeout captura o valor de 'i' daquela iteração específica.
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(`Com let: ${i}`); // Imprime "Com let: 0", "Com let: 1", "Com let: 2"
  }, 10);
}
```
Entender essa diferença é fundamental para qualquer desenvolvedor JavaScript.

**4. Otimizações de Performance (Micro-otimização)**

Em código extremamente sensível à performance (ex: bibliotecas de animação, processamento de grandes volumes de dados), recalcular `array.length` a cada iteração pode ter um custo. Uma otimização comum era "cachear" o tamanho do array.

```javascript
// Otimização clássica: 'len' é calculado apenas uma vez.
const meuArrayGigante = new Array(1000000).fill(0);
for (let i = 0, len = meuArrayGigante.length; i < len; i++) {
  // ...
}
```
**Nota:** Os motores JavaScript modernos são extremamente otimizados e, na maioria dos casos, essa otimização manual é prematura e desnecessária. No entanto, é um bom conhecimento histórico e pode ser útil em nichos específicos.

**5. Loops Aninhados (Nested Loops) e Exemplos Práticos**

Um loop pode ser colocado dentro de outro. Isso é conhecido como "loop aninhado" e é uma técnica poderosa para trabalhar com estruturas de dados bidimensionais (como matrizes ou tabuleiros) ou para gerar combinações de dados.

**Exemplo Clássico: Gerando uma Tabuada**

A tabuada de multiplicação é um exemplo perfeito de um loop aninhado, onde o loop externo itera sobre os números da tabuada (de 1 a 10) e o loop interno calcula o produto de cada um desses números pelo multiplicador (também de 1 a 10).

```javascript
// Loop externo: itera do 1 ao 10 (a tabuada que queremos calcular)
for (let i = 1; i <= 10; i++) {
  console.log(`\n--- Tabuada do ${i} ---`);

  // Loop interno: itera do 1 ao 10 (o multiplicador)
  for (let j = 1; j <= 10; j++) {
    const resultado = i * j;
    console.log(`${i} x ${j} = ${resultado}`);
  }
}
```

**Saída (parcial):**

```
--- Tabuada do 1 ---
1 x 1 = 1
1 x 2 = 2
...
1 x 10 = 10

--- Tabuada do 2 ---
2 x 1 = 2
2 x 2 = 4
...
2 x 10 = 20
... e assim por diante até a tabuada do 10.
```
Neste exemplo, para cada **uma** iteração do loop externo (a variável `i`), o loop interno (a variável `j`) executa seu ciclo **completo** de 10 iterações.

**Quando Usar o `for` Clássico Hoje?**

-   Quando você precisa de controle total sobre a iteração (ex: pular elementos, `i += 2`).
-   Quando precisa iterar de trás para frente (`for (let i = arr.length - 1; i >= 0; i--)`).
-   Quando precisa **modificar o array durante a iteração** (cuidado!).
-   Em cenários de performance crítica onde micro-otimizações foram provadas necessárias através de profiling.

Para a maioria dos outros casos (simplesmente percorrer um array), `for...of` ou `forEach()` são mais legíveis e menos propensos a erros.

### b. `while`

O loop `while` executa um bloco de código enquanto uma condição especificada for verdadeira. É ideal quando você não sabe quantas iterações serão necessárias, mas sabe qual é a condição de parada.

**Sintaxe:**
`while (condição) { ... }`

**Exemplo Básico:** Sorteando números até encontrar um maior que 8.

```javascript
let numeroSorteado = 0;
let tentativas = 0;

while (numeroSorteado <= 8) {
  numeroSorteado = Math.floor(Math.random() * 10) + 1; // Sorteia um número de 1 a 10
  tentativas++;
  console.log(`Tentativa ${tentativas}: sorteou ${numeroSorteado}`);
}

console.log(
  `Finalmente! O número ${numeroSorteado} foi sorteado após ${tentativas} tentativas.`
);
```

**Cuidado:** É crucial que a condição do `while` em algum momento se torne `false`. Caso contrário, você criará um **loop infinito**, que travará seu programa.

#### Detalhes Avançados sobre `while`

##### `do...while`Dominando Loops e Evitando Catástrofes (Loops Infinitos)

Do ponto de vista de engenharia de software, um loop infinito não é apenas um erro; é uma falha catastrófica que pode derrubar um serviço, congelar a UI de um cliente e esgotar recursos de CPU e memória, gerando custos e instabilidade. Dominar o controle de fluxo é fundamental.

**Anatomia de um Bug de Produção: Loops Infinitos Acidentais**

Esses bugs quase sempre surgem de uma suposição incorreta sobre a mutação de estado.

1.  **Estado Imutável:** A variável de controle nunca é alterada dentro do escopo do loop.

    ```javascript
    // BUG: A variável `i` nunca é incrementada.
    // Em um ambiente de produção, isso pode travar um worker ou um thread.
    let i = 0;
    while (i < 10) {
      console.log("Processando job... mas sem progresso.");
    }
    ```

2.  **Lógica de Condição Falha:** A condição é estruturada de forma que é logicamente impossível de se tornar `false`.
    ```javascript
    // BUG: A lógica `i > 0` com um incremento `i++` nunca terminará.
    for (let i = 1; i > 0; i++) {
      // Isso pode acontecer em cenários mais complexos, com múltiplas variáveis.
    }
    ```

**O Uso Arquitetural de `while (true)`: Alto Risco, Alta Recompensa**

Em 99% do código de aplicação (lógica de negócio, componentes de UI), você **não** deve escrever `while (true)`. No entanto, no núcleo de sistemas, ele é a base de arquiteturas orientadas a eventos.

- **Event Loops (Node.js, Navegador):** O coração do JavaScript assíncrono é um `while (true)` que processa a fila de eventos. Você não o escreve, mas interage com ele.
- **Game Engines:** O loop principal de um jogo (`Game Loop`) é um `while (true)` que renderiza frames e processa a lógica do jogo, quebrando apenas quando o usuário fecha o jogo.
- **Message Queue Consumers:** Um serviço que consome mensagens de uma fila (RabbitMQ, SQS) pode usar um loop principal para pedir novas mensagens continuamente.

O ponto-chave é que esses loops **não são verdadeiramente infinitos**. Eles sempre possuem um mecanismo de saída: um `break` acionado por um evento externo (como um sinal de `SIGTERM` do sistema operacional) ou uma condição interna explícita.

**Princípios de Engenharia para Controle de Loops:**

1.  **Defensividade e Invariantes:** Programe defensivamente. Qual é a _invariante_ (a condição que deve ser verdadeira) para seu loop continuar? E qual é a condição que _garante_ sua terminação? Valide isso.
2.  **Estado Explícito:** Trate a condição do loop como um estado crítico. Evite modificações implícitas ou "efeitos colaterais" que possam afetar a condição de parada. A mudança de estado deve ser óbvia e deliberada.
3.  **Code Review com Foco:** Loops complexos são um "code smell". Durante uma revisão de código, eles exigem escrutínio extra. Questione: "Qual a garantia de que este loop termina?".
4.  **Use o Debugger:** Não use `console.log` para depurar loops complexos. Use um debugger com breakpoints para inspecionar o estado da memória a cada iteração e entender por que a condição de saída não está sendo atingida.
5.  **Implemente um "Circuit Breaker":** Para loops críticos ou de longa duração, especialmente em background jobs, implementar um "disjuntor" (circuit breaker) é uma prática sênior. É um mecanismo de segurança que força a parada se um número de iterações ou um tempo de execução for excedido, prevenindo uma falha total do sistema.

    ```javascript
    const MAX_ITERATIONS = 1000000; // Limite de segurança
    let iteration = 0;
    let someComplexCondition = true; // Simula uma condição

    while (someComplexCondition) {
      if (iteration++ > MAX_ITERATIONS) {
        // Logue o erro, envie um alerta para a equipe de monitoramento.
        throw new Error(
          "Circuit breaker triggered: Loop excedeu o limite de iterações."
        );
      }
      // ... lógica principal do loop ...
    }
    ```

#### Detalhes Avançados sobre `while`

##### Processando Estruturas de Dados

O `while` é excelente para consumir dados de uma estrutura até que ela esteja vazia. Por exemplo, processar itens de uma "fila" (um array onde removemos o primeiro elemento a cada iteração).

```javascript
const tarefas = [
  "Lavar a louça",
  "Passear com o cachorro",
  "Fazer compras",
  "Estudar JavaScript",
];

while (tarefas.length > 0) {
  const tarefaAtual = tarefas.shift(); // .shift() remove e retorna o primeiro elemento
  console.log(`Executando a tarefa: ${tarefaAtual}`);
}

console.log("Todas as tarefas foram concluídas!");
// Saída:
// Executando a tarefa: Lavar a louça
// Executando a tarefa: Passear com o cachorro
// Executando a tarefa: Fazer compras
// Executando a tarefa: Estudar JavaScript
// Todas as tarefas foram concluídas!
```

##### Interrompendo um Loop com `break`

A palavra-chave `break` permite sair de um loop `while` imediatamente, mesmo que a condição principal ainda seja verdadeira.

**Exemplo:** Buscando um item específico em uma lista.

```javascript
let contador = 0;
const itens = ["caneta", "livro", "chave", "carteira", "mochila"];

while (true) {
  // Loop potencialmente infinito
  if (contador >= itens.length) {
    console.log("Item não encontrado.");
    break; // Garante que o loop termine se o item não existir
  }

  const itemAtual = itens[contador];
  console.log(`Verificando: ${itemAtual}`);

  if (itemAtual === "carteira") {
    console.log("Carteira encontrada!");
    break; // Sai do loop assim que encontra o item
  }

  contador++;
}
```

##### Pulando uma Iteração com `continue`

A palavra-chave `continue` interrompe a iteração atual e pula para a próxima verificação da condição do loop.

**Exemplo:** Processando apenas números pares.

```javascript
let numero = 0;

while (numero < 10) {
  numero++;

  if (numero % 2 !== 0) {
    // Se o número for ímpar, pula o console.log e continua para a próxima iteração
    continue;
  }

  console.log(`Número par encontrado: ${numero}`);
}
// Saída:
// Número par encontrado: 2
// Número par encontrado: 4
// Número par encontrado: 6
// Número par encontrado: 8
// Número par encontrado: 10
```

### c. `do...while`

O loop `do...while` é uma variação do `while`. A principal diferença é que o bloco de código é executado **pelo menos uma vez**, antes que a condição seja verificada.

**Sintaxe:**
`do { ... } while (condição);`

**Exemplo:** Pedindo uma entrada ao usuário até que ela seja válida.

```javascript
let senha;

do {
  // A primeira vez, `senha` é undefined, mas o bloco executa mesmo assim.
  senha = window.prompt("Digite sua senha (deve ter mais de 4 caracteres):");
} while (senha.length <= 4);

console.log("Senha válida registrada!");
```

---

## 2. Loops para Coleções (`for...of` e `for...in`)

Esses loops foram projetados para iterar sobre estruturas de dados, como arrays e objetos, de forma mais direta.

### a. `for...of` (A Forma Correta de Iterar Sobre Valores)

O loop `for...of`, introduzido no ES6, revolucionou a iteração em JavaScript. Ele fornece uma maneira direta e limpa de iterar sobre os **valores** de **objetos iteráveis**.

**Sintaxe:**
`for (const elemento of iteravel) { ... }`

---

#### O Que é um "Objeto Iterável"? (O Protocolo de Iteração)

A magia do `for...of` não se limita a arrays. Ele funciona com qualquer objeto que implemente o **protocolo de iteração**. Os principais iteráveis nativos são:

-   `Array`
-   `String`
-   `Map`
-   `Set`
-   `arguments` (o objeto de argumentos de uma função)
-   `NodeList` (retornado por `document.querySelectorAll`)

**Exemplo com String:**
```javascript
const nome = "Gemini";
for (const letra of nome) {
  console.log(letra);
}
// Saída: G, e, m, i, n, i
```

**`for...of` vs. `for...in`: A Diferença Fundamental**

-   `for...of` itera sobre **VALORES** de um objeto iterável.
-   `for...in` itera sobre **CHAVES (propriedades)** de um objeto.

```javascript
const meuArray = ['a', 'b', 'c'];
meuArray.propriedadeCustom = 'Oops';

// for...of: O correto para valores de arrays
console.log('--- Usando for...of ---');
for (const valor of meuArray) {
  console.log(valor); // a, b, c
}

// for...in: O incorreto para arrays
console.log('\n--- Usando for...in ---');
for (const chave in meuArray) {
  console.log(chave); // '0', '1', '2', 'propriedadeCustom'
}
```

#### Tornando Seus Próprios Objetos Iteráveis

Esta é a parte mais poderosa do `for...of`. Objetos (`{}`) simples não são iteráveis por padrão. Mas podemos fazê-los implementar o protocolo de iteração definindo um método especial: `[Symbol.iterator]`.

**Objetivo:** Criar um objeto `equipe` que contém uma lista de membros. Queremos poder iterar diretamente sobre o objeto `equipe` para obter cada membro.

**Implementação com Gerador (a forma moderna e concisa):**

Um gerador (`function*`) é a maneira mais fácil de criar um iterador. A palavra-chave `yield` pausa a função e "entrega" um valor para o `for...of`.

```javascript
const equipe = {
  nome: 'Time de Heróis',
  membros: ['Capitão América', 'Homem de Ferro', 'Viúva Negra'],

  // Implementando o protocolo de iteração com um gerador
  *[Symbol.iterator]() {
    for (const membro of this.membros) {
      yield membro;
    }
  }
};

// Agora o objeto 'equipe' é iterável!
for (const heroi of equipe) {
  console.log(heroi);
}
// Saída:
// Capitão América
// Homem de Ferro
// Viúva Negra

// Também podemos usar o operador spread, que depende do protocolo de iteração
const membrosEmArray = [...equipe];
console.log(membrosEmArray); // ['Capitão América', 'Homem de Ferro', 'Viúva Negra']
```

**Explicação:**
1.  Criamos um método no objeto `equipe` com a chave `[Symbol.iterator]`. O `*` antes do nome indica que é uma função geradora.
2.  Dentro do gerador, iteramos sobre o array interno `this.membros`.
3.  `yield membro;` entrega cada membro para o loop `for...of` que está consumindo o iterador.
4.  Como resultado, o objeto `equipe` se comporta como um iterável, permitindo um código limpo e declarativo.

**Recomendação do Engenheiro:**

Use `for...of` como sua ferramenta padrão sempre que precisar iterar sobre os **valores** de um array ou de qualquer outro objeto iterável. Ele é mais legível e menos propenso a erros do que um loop `for` clássico quando o índice não é necessário. Entender o protocolo de iteração e como usar `Symbol.iterator` abre portas para a criação de APIs e objetos customizados muito mais elegantes e poderosos.


### b. `for...in` (A Ferramenta para Inspeção de Objetos)

O loop `for...in` itera sobre as chaves (propriedades) **enumeráveis** de um objeto. Embora útil, seu comportamento tem nuances que todo engenheiro de software deve entender para evitar bugs sutis.

**Sintaxe:**
`for (const chave in objeto) { ... }`

**Exemplo Básico:**

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

---

#### Detalhes Avançados e Armadilhas do `for...in`

**1. O Problema da Cadeia de Protótipos (Prototype Chain)**

A característica mais perigosa do `for...in` é que ele **não itera apenas sobre as propriedades do próprio objeto**, mas também sobre as propriedades enumeráveis de sua cadeia de protótipos (`prototype chain`).

**Exemplo de Bug:**

```javascript
// Imagine que um script ou biblioteca (de forma inadequada) modifica o Object.prototype
Object.prototype.metodoGlobal = function() { console.log("Oops!"); };

const carro = {
  marca: 'Toyota',
  modelo: 'Corolla'
};

// Este loop vai encontrar 'metodoGlobal' como uma propriedade do objeto 'carro'!
for (const chave in carro) {
  console.log(chave);
}
// Saída:
// marca
// modelo
// metodoGlobal  <-- Propriedade indesejada vinda do protótipo!
```

**A Solução Clássica: `hasOwnProperty`**

Para iterar de forma segura com `for...in`, a prática padrão sempre foi usar o método `hasOwnProperty` para garantir que a propriedade pertence diretamente ao objeto, e não ao seu protótipo.

```javascript
for (const chave in carro) {
  // Chamada segura ao hasOwnProperty
  if (Object.prototype.hasOwnProperty.call(carro, chave)) {
    console.log(`${chave}: ${carro[chave]}`);
  }
}
// Saída:
// marca: Toyota
// modelo: Corolla
```
**Por que `Object.prototype.hasOwnProperty.call(...)`?** É uma chamada defensiva. Um objeto malicioso poderia ter sua própria propriedade chamada `hasOwnProperty` (ex: `{ hasOwnProperty: () => false }`), quebrando a lógica. Chamar diretamente do `Object.prototype` garante que você está usando o método original e imutável.

**2. `for...in` vs. Alternativas Modernas (e Melhores)**

Na prática, a necessidade de usar `hasOwnProperty` torna o `for...in` verboso e propenso a erros. Para a maioria dos casos, existem alternativas superiores desde o ES5 e ES6:

-   **`Object.keys(obj)`:** Retorna um array contendo apenas as chaves **do próprio objeto** (não do protótipo). É a substituição mais comum e segura para `for...in`.
-   **`Object.values(obj)`:** Retorna um array com os valores das chaves do próprio objeto.
-   **`Object.entries(obj)`:** Retorna um array de pares `[chave, valor]` do próprio objeto, ideal para usar com `for...of`.

**Exemplo Moderno e Seguro:**

```javascript
// Usando Object.keys
const chaves = Object.keys(carro); // ['marca', 'modelo']
chaves.forEach(chave => {
  console.log(`${chave}: ${carro[chave]}`);
});

// A forma mais idiomática com for...of
for (const chave of Object.keys(carro)) {
  console.log(`${chave}: ${carro[chave]}`);
}

// A forma mais completa com Object.entries
for (const [chave, valor] of Object.entries(carro)) {
  console.log(`${chave}: ${valor}`);
}
```

**3. Por que NUNCA usar `for...in` em Arrays**

O aviso "não use em arrays" é crítico por três razões:
1.  **Itera sobre Índices como Strings:** As chaves de um array são seus índices, e o `for...in` os trata como strings ('0', '1', '2', ...), o que pode causar problemas em operações matemáticas.
2.  **Ordem não Garantida:** A especificação do ECMAScript não garante a ordem da iteração. Embora a maioria dos navegadores modernos itere na ordem numérica, confiar nisso é perigoso.
3.  **Itera sobre Propriedades não Numéricas:** Se alguém adicionar uma propriedade a um array (ex: `meuArray.nome = 'lista'`), o `for...in` irá iterar sobre ela.

**Recomendação do Engenheiro:**

Hoje, o `for...in` é uma ferramenta de nicho. **Evite-o para a lógica de aplicação do dia a dia.** Prefira `Object.keys()`, `Object.values()`, e `Object.entries()` combinados com `forEach` ou `for...of` para iterar sobre objetos.

O único caso de uso moderno e justificável para `for...in` é quando você precisa **deliberadamente inspecionar a cadeia de protótipos de um objeto**, geralmente para tarefas de depuração, metaprogramação ou para construir bibliotecas de baixo nível. Para todos os outros cenários, as alternativas são mais seguras, previsíveis e legíveis.

#### Exemplos Avançados (Casos de Uso de Nicho para `for...in`)

Conforme a recomendação anterior, `for...in` deve ser evitado no código de aplicação geral. No entanto, ele se torna a ferramenta certa para tarefas específicas de "meta-nível", onde a intenção é justamente analisar a estrutura completa de um objeto, incluindo sua herança.

**Exemplo 1: Função de Debug Universal (`dumpObject`)**

Imagine que você está depurando um sistema complexo e recebe um objeto de uma fonte desconhecida. Você quer inspecionar não apenas suas propriedades diretas, mas tudo o que ele herdou, para entender seu comportamento completo.

**Objetivo:** Criar uma função que lista todas as propriedades de um objeto, separando as que são "próprias" (own) das que são "herdadas" (inherited).

```javascript
function dumpObject(obj) {
  console.log(`--- Inspecionando Objeto ---`);
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      console.log(`[Own] ${prop}: ${obj[prop]}`);
    } else {
      console.log(`[Inherited] ${prop}: ${obj[prop]} (do protótipo)`);
    }
  }
  console.log(`--- Fim da Inspeção ---`);
}

// Setup: Usando construtores para criar uma cadeia de protótipos
function Veiculo(rodas) {
  this.rodas = rodas;
}
Veiculo.prototype.locomover = function() { return "movendo..."; };

function Carro(marca) {
  Veiculo.call(this, 4); // Chama o construtor pai
  this.marca = marca;
}
// Cria a herança: Carro.prototype herda de Veiculo.prototype
Carro.prototype = Object.create(Veiculo.prototype);
Carro.prototype.constructor = Carro; // Corrige o construtor

const meuCarro = new Carro('Honda');

// Usando a função de debug
dumpObject(meuCarro);
```

**Saída:**
```
--- Inspecionando Objeto ---
[Own] rodas: 4
[Own] marca: Honda
[Inherited] constructor: function Carro(marca) { ... } (do protótipo)
[Inherited] locomover: function() { return "movendo..."; } (do protótipo)
--- Fim da Inspeção ---
```
**Explicação:** Neste cenário, `for...in` é a ferramenta ideal porque nossa meta é justamente atravessar a cadeia de protótipos. Usar `Object.keys()` seria inútil, pois ele não nos mostraria as propriedades herdadas como `locomover`. A combinação de `for...in` com `hasOwnProperty` nos permite categorizar cada propriedade, criando um relatório de depuração poderoso.

---

**Exemplo 2: Serialização Seletiva com Herança**

**Objetivo:** Serializar um objeto para JSON, mas incluindo uma propriedade específica da classe pai que sabemos ser importante.

```javascript
class Entidade {
  constructor() {
    this.id = Math.random().toString(36).substring(2);
    this.criadoEm = new Date();
  }
}

class Produto extends Entidade {
  constructor(nome, preco) {
    super(); // Chama o construtor da Entidade
    this.nome = nome;
    this.preco = preco;
  }
}

function serializarParaAPI(obj) {
  const payload = {};
  for (const key in obj) {
    // Incluímos propriedades próprias OU a propriedade 'id' herdada
    if (Object.prototype.hasOwnProperty.call(obj, key) || key === 'id') {
      payload[key] = obj[key];
    }
  }
  return JSON.stringify(payload);
}

const livro = new Produto("O Senhor dos Anéis", 59.90);
const jsonPayload = serializarParaAPI(livro);

console.log(jsonPayload);
```
**Saída (exemplo):**
```json
{"id":"l4k2j3h4","nome":"O Senhor dos Anéis","preco":59.9}
```
**Explicação:** Aqui, `for...in` nos permite "pescar" uma propriedade (`id`) da classe pai (`Entidade`) que não seria encontrada por `Object.keys(livro)`. É um exemplo de lógica condicional mais complexa dentro de um loop de inspeção, onde o comportamento padrão do `for...in` é aproveitado de forma controlada. Mesmo neste caso, uma implementação alternativa com `Object.keys()` e acesso explícito a `obj.id` poderia ser mais clara, mas ilustra uma possibilidade do `for...in`.

---

## 3. Métodos de Iteração de Arrays

JavaScript fornece um conjunto poderoso de métodos no protótipo do `Array` que permitem iterar e transformar dados de maneira funcional, produzindo um código mais limpo e declarativo.

### a. `forEach()`

Executa uma função de callback para **cada elemento** do array. É um substituto moderno para o loop `for` quando você só precisa "fazer algo" com cada item e não precisa criar um novo array.

**Sintaxe:** `array.forEach(callback(elemento, indice, array))`

```javascript
const nomes = ["Ana", "Bia", "Carlos"];
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
const raizes = numeros.map((num) => Math.sqrt(num));

console.log(raizes); // [1, 2, 3, 4]
console.log(numeros); // [1, 4, 9, 16] (o array original permanece intacto)
```

### c. `filter()`

Cria um **novo array** com todos os elementos que passaram no teste implementado pela função de callback (ou seja, para os quais o callback retornou `true`). É a ferramenta ideal para **selecionar** ou **filtrar** dados.

**Sintaxe:** `const novoArray = array.filter(callback(elemento, indice, array))`

```javascript
const idades = [15, 21, 17, 35, 12];

// Criar um novo array apenas com as idades de maiores de idade
const maioresDeIdade = idades.filter((idade) => idade >= 18);

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

## 4. Controle Fino de Loops: `break` e `continue`

Além de definir a lógica de uma iteração, muitas vezes precisamos de um controle mais granular para interromper ou pular parte do processo. É aqui que `break` e `continue` se tornam ferramentas essenciais.

### a. `break`: A Saída de Emergência

A instrução `break` termina imediatamente o loop (ou `switch`) mais interno em que se encontra e o programa continua a execução na instrução seguinte ao loop.

**Uso em Loops:**

É comumente usado para parar um loop assim que uma condição específica é atendida, evitando iterações desnecessárias.

```javascript
const numeros = [1, 5, -3, 8, 4, 10];

let primeiroNegativo = null;
for (const num of numeros) {
  if (num < 0) {
    primeiroNegativo = num;
    break; // Encontrou o que queria, sai do loop imediatamente.
  }
  console.log(`Processando: ${num}`); // Este log não será exibido para números após -3
}

console.log(`O primeiro número negativo é: ${primeiroNegativo}`);
// Saída:
// Processando: 1
// Processando: 5
// O primeiro número negativo é: -3
```

**Uso em `switch` e o "Fall-through"**

Em uma instrução `switch`, `break` é usado para sair do bloco `switch` após um `case` ser executado. Se omitido, ocorre o "fall-through": a execução continua para o `case` seguinte, independentemente de a condição corresponder.

```javascript
const dia = 3;
let nomeDia;

switch (dia) {
  case 1:
    nomeDia = 'Segunda';
    break;
  case 2:
    nomeDia = 'Terça';
    break;
  // ... outros dias
  default:
    nomeDia = 'Dia inválido';
    break; // Boa prática ter no default também
}
```

**Fall-through Intencional (Uso Avançado):**
Às vezes, o fall-through é usado de propósito para agrupar casos.

```javascript
function isFimDeSemana(dia) {
  switch (dia) {
    case 'Sábado':
    case 'Domingo':
      return true; // Se for Sábado, cai para Domingo e retorna true
    default:
      return false;
  }
}
```

**Tópico Avançado: `labeled break`**

O `break` normal só consegue sair do loop mais interno. Para sair de loops aninhados, você pode usar um "label".

**Objetivo:** Encontrar um valor em uma matriz 2D e parar toda a busca (ambos os loops) assim que encontrar.

```javascript
const matriz = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
const valorProcurado = 5;

loopExterno: // Isto é um label
for (let i = 0; i < matriz.length; i++) {
  for (let j = 0; j < matriz[i].length; j++) {
    if (matriz[i][j] === valorProcurado) {
      console.log(`Valor encontrado na posição [${i}, ${j}]`);
      break loopExterno; // Quebra o loop identificado pelo label 'loopExterno'
    }
  }
}
console.log("Busca terminada.");
```
Sem o `labeled break`, o `break` sairia apenas do loop interno, e o loop externo continuaria para a próxima linha da matriz.

### b. `continue`: Pulando uma Iteração

A instrução `continue` encerra a execução das instruções da iteração *atual* do loop e continua a execução do loop com a *próxima* iteração.

**Uso Comum: Padrão de "Guard Clause"**

`continue` é excelente para simplificar o código e evitar aninhamento de `if`s. Em vez de envolver a lógica principal em um `if`, você usa um `if` para checar a condição de exclusão e chama `continue`.

```javascript
const produtos = [
  { nome: 'Maçã', preco: 2.5, tipo: 'fruta' },
  { nome: 'Pão', preco: 5.0, tipo: 'padaria' },
  { nome: 'Uva', preco: -1, tipo: 'fruta' }, // Preço inválido
  { nome: 'Alface', preco: 1.5, tipo: 'verdura' }
];

let precoTotalFrutas = 0;

for (const produto of produtos) {
  // Guard Clause: Se não for fruta ou o preço for inválido, pule para o próximo.
  if (produto.tipo !== 'fruta' || produto.preco <= 0) {
    continue;
  }

  // Lógica principal do loop
  console.log(`Adicionando ${produto.nome} ao total.`);
  precoTotalFrutas += produto.preco;
}

console.log(`Preço total das frutas: ${precoTotalFrutas}`);
// Saída:
// Adicionando Maçã ao total.
// Preço total das frutas: 2.5
```
O código fica mais "plano" e legível.

**Tópico Avançado: `labeled continue`**

Assim como o `break`, `continue` também pode ser usado com labels. Ele pulará para a próxima iteração do loop identificado pelo label. É um recurso raramente usado, mas útil para controle de fluxo complexo em loops aninhados.

```javascript
loopExterno:
for (let i = 0; i < 3; i++) {
  loopInterno:
  for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) {
      // Pula para a próxima iteração do loop EXTERNO
      continue loopExterno;
    }
    console.log(`i=${i}, j=${j}`);
  }
}
// Saída:
// i=0, j=0
// i=0, j=1
// i=0, j=2
// i=1, j=0
// (Quando i=1 e j=1, ele pula o resto do loop externo para i=1 e vai para i=2)
// i=2, j=0
// i=2, j=1
// i=2, j=2
```

---

## 5. Qual Usar? (Resumo e Boas Práticas)

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
