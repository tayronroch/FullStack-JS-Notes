# Métodos de Arrays (Intermediário)

## O que são Arrays?

Arrays são estruturas de dados fundamentais em JavaScript que permitem armazenar uma coleção de múltiplos itens em uma única variável. Eles são versáteis e podem conter elementos de diferentes tipos de dados, como números, strings, objetos e até outros arrays.

Um array é uma lista ordenada, o que significa que cada item possui um índice (uma posição numérica), começando do zero.

```javascript
// Exemplo de um array simples
const frutas = ["Maçã", "Banana", "Laranja"];
const misto = [1, "texto", { id: 1 }, [1, 2, 3]];
```

---

## 1. Criação e Acesso a Elementos

A forma mais comum, simples e legível de criar um array é através da **notação literal** `[]`.

```javascript
// Criando um array de strings
const cores = ["vermelho", "verde", "azul"];

// Criando um array de números
const numerosDaSorte = [7, 13, 21, 42];

// Um array pode estar vazio
const arrayVazio = [];
```

### Acessando Elementos pelo Índice

Cada elemento em um array tem uma posição, chamada de **índice**. A contagem dos índices sempre começa em **zero**.

```javascript
const animais = ["Cachorro", "Gato", "Pássaro", "Peixe"];
// Índices:      0           1         2          3

// Acessando o primeiro elemento (índice 0)
console.log(animais[0]); // "Cachorro"

// Acessando o terceiro elemento (índice 2)
console.log(animais[2]); // "Pássaro"
```

Uma prática muito comum é acessar o **último elemento** de um array usando a propriedade `length`.

```javascript
// O índice do último elemento é sempre o tamanho do array menos 1
const ultimoAnimal = animais[animais.length - 1];
console.log(ultimoAnimal); // "Peixe"
```

#### O Erro Comum: `array[array.length]`

É muito importante lembrar do `- 1`. Um erro comum para iniciantes é tentar acessar o último elemento usando `array[array.length]`. Isso sempre resultará em `undefined`.

Vamos analisar o porquê com um array de 4 posições:

```javascript
const letras = ['a', 'b', 'c', 'd'];
// Índices:    0,   1,   2,   3

console.log(letras.length); // 4

// O último índice válido é 3.
// Se tentarmos acessar o índice 4 (que é o valor de `letras.length`)... 
console.log(letras[letras.length]); // undefined

// O correto é sempre subtrair 1 para pegar o último índice.
console.log(letras[letras.length - 1]); // 'd'
```

Lembre-se: a propriedade `length` retorna a **quantidade** de itens (contagem começando em 1), enquanto os índices são as **posições** (contagem começando em 0).

### Modificando Elementos

Você pode alterar o valor de um elemento simplesmente acessando seu índice e atribuindo um novo valor.

```javascript
const planetas = ["Mercúrio", "Vênus", "Terra", "Marte"];
console.log(planetas[1]); // "Vênus"

// Modificando o valor no índice 1
planetas[1] = "Jupiter";
console.log(planetas[1]); // "Jupiter"

console.log(planetas); // ["Mercúrio", "Jupiter", "Terra", "Marte"]
```

### Acesso a Índices Inexistentes

Se você tentar acessar um índice que está fora dos limites do array, o JavaScript retornará `undefined`, sem causar um erro.

```javascript
const veiculos = ["Carro", "Moto"];

console.log(veiculos[2]); // undefined (não há elemento no índice 2)
console.log(veiculos[-1]); // undefined (índices negativos não funcionam para acesso direto) Se nao fizer isso dará Undefined!
```

---

## 2. Criação Avançada: O Construtor `new Array()`

Embora a notação literal `[]` seja preferível, JavaScript também permite criar arrays usando o construtor `new Array()`. Entender seu funcionamento é importante para cenários específicos e para evitar armadilhas.

O comportamento do construtor `Array()` muda dependendo dos argumentos:

1.  **Múltiplos Argumentos:** Tornam-se os elementos do array.

    ```javascript
    const numeros = new Array(10, 20, 30);
    console.log(numeros); // [10, 20, 30]
    ```

2.  **Um Único Argumento Numérico:** Define o **comprimento (`length`)** do array, criando posições vazias (_empty slots_).

    ```javascript
    const arrayVazio = new Array(5);
    console.log(arrayVazio); // [ <5 empty items> ]
    ```

#### A Armadilha dos _Empty Slots_

Um array criado com um tamanho definido possui "buracos" ou _empty slots_. A maioria dos métodos de iteração (`map`, `forEach`, `filter`) **ignora** esses espaços.

```javascript
const tamanho5 = new Array(5);
const arrayMapeado = tamanho5.map((_, index) => index); // Não executa
console.log(arrayMapeado); // [ <5 empty items> ]
```

### Soluções para Pré-alocação

**a. Usando `Array.prototype.fill()`**

O método `fill()` preenche os elementos de um array com um valor estático. Ele **não ignora** os _empty slots_.

```javascript
// Criar um array de tamanho 5 e preenchê-lo com zeros
const zeros = new Array(5).fill(0);
console.log(zeros); // [0, 0, 0, 0, 0]

// Agora o .map funciona!
const indices = new Array(5).fill(undefined).map((_, index) => index);
console.log(indices); // [0, 1, 2, 3, 4]
```

**b. Usando `Array.from()` (A Melhor Abordagem)**

`Array.from()` cria uma nova instância de `Array` a partir de um objeto "array-like". É a forma mais flexível de criar arrays dinamicamente.

```javascript
// Criar um array de 0 a 4
const arrayDeIndices = Array.from({ length: 5 }, (_, index) => index);
console.log(arrayDeIndices); // [0, 1, 2, 3, 4]
```

**c. Usando `Array.of()`**

`Array.of()` evita a ambiguidade do `new Array()`. Ele **sempre** cria um array com os elementos passados como argumento.

```javascript
const umElemento = Array.of(5); // Resultado: [5]
const tresElementos = Array.of(10, 20, 30); // Resultado: [10, 20, 30]
```

---

## 3. Convertendo Strings em Arrays

É muito comum a necessidade de converter uma string em um array, seja para manipular seus caracteres individualmente ou para extrair dados de um texto estruturado. Existem três abordagens principais, cada uma com suas particularidades.

### a. `String.prototype.split(separator)`

Este é o método mais tradicional e poderoso para dividir uma string em um array de substrings.

- **Divisão por um caractere:**

```javascript
const frase = "Eu amo programar em JavaScript";
const palavras = frase.split(' '); // Divide a string pelos espaços
console.log(palavras); // ["Eu", "amo", "programar", "em", "JavaScript"]

const csv = "item1,item2,item3";
const itens = csv.split(',');
console.log(itens); // ["item1", "item2", "item3"]
```

- **Dividir em caracteres (a armadilha):** Usar uma string vazia (`''`) como separador divide a string em um array de seus caracteres. **Atenção:** Isso não funciona corretamente com caracteres de múltiplos bytes, como emojis.

```javascript
const palavra = "Olá";
console.log(palavra.split('')); // ['O', 'l', 'á']

const emoji = "🚀✨";
console.log(emoji.split('')); // ['', '', '✨'] (resultado incorreto, o foguete foi quebrado)
```

- **Uso avançado com `limit`:** O segundo argumento opcional limita o número de divisões.

```javascript
const lista = "a,b,c,d,e,f";
const primeirosTres = lista.split(',', 3);
console.log(primeirosTres); // ['a', 'b', 'c']
```

- **Uso com Expressões Regulares:** Para divisões complexas, você pode usar uma RegEx.

```javascript
const dados = "nome:João;idade:30|cidade:São Paulo";
// Divide por ponto e vírgula, dois pontos ou barra vertical
const partes = dados.split(/[:;|]/);
console.log(partes); // ["nome", "João", "idade", "30", "cidade", "São Paulo"]
```

### b. `Array.from(string)`

Este método estático trata a string como uma coleção de caracteres e cria um novo array a partir dela. É a forma **correta e segura** de converter uma string em um array de seus caracteres, pois lida bem com emojis e outros símbolos complexos.

```javascript
const texto = "Olá 🚀";

const chars = Array.from(texto);
console.log(chars); // ['O', 'l', 'á', ' ', '🚀'] (resultado correto)
```

### c. Sintaxe de Espalhamento (Spread Syntax) `[...string]`

Introduzida no ES6, a sintaxe de espalhamento é uma forma moderna e concisa de atingir o mesmo resultado que `Array.from()` para converter uma string em seus caracteres constituintes. Também lida corretamente com caracteres complexos.

```javascript
const nome = "Maria";
const letrasDoNome = [...nome];
console.log(letrasDoNome); // ['M', 'a', 'r', 'i', 'a']

const emojiComplexo = "👩‍💻";
const arrayDoEmoji = [...emojiComplexo];
console.log(arrayDoEmoji); // ['👩‍💻'] (correto, preserva o caractere)
```

### Qual usar?

- Para dividir uma string em **substrings** com base em um separador (palavras, dados de CSV, etc.), use **`split()`**.
- Para converter uma string em um **array de seus caracteres** de forma segura e legível, use **`Array.from()`** ou a sintaxe de espalhamento **`[...string]`**.

---

## 4. Boas Práticas ao Trabalhar com Arrays

1.  **Prefira a Imutabilidade:** Em vez de modificar o array original (`push`, `splice`), dê preferência a métodos que retornam um novo array (`map`, `filter`, `reduce`). Isso evita efeitos colaterais.

2.  **Use o Método Certo para a Tarefa Certa:**

    - Transformar itens: `map`.
    - Selecionar itens: `filter`.
    - Calcular um valor único: `reduce`.
    - Apenas percorrer: `forEach`.

3.  **Evite Loops `for` Tradicionais:** Métodos modernos são mais legíveis e menos propensos a erros.

4.  **Nomeie Funções de Callback de Forma Clara:**

    ```javascript
    // Ruim: const precosFinais = precos.map(p => p * 1.1);
    // Bom:
    const adicionarImposto = (preco) => preco * 1.1;
    const precosFinais = precos.map(adicionarImposto);
    ```

---

## 5. Adicionando e Removendo Elementos

Manipular o conteúdo de um array é uma das tarefas mais comuns. Existem duas filosofias principais para isso: a abordagem **mutável** (que altera o array original) e a **imutável** (que cria um novo array com as mudanças).

### a. A Abordagem Mutável (Tradicional)

Estes métodos modificam o array diretamente. São úteis em alguns contextos, mas podem gerar efeitos colaterais (bugs) se o mesmo array estiver sendo usado em múltiplos lugares do seu código.

- **`push()` e `pop()`**: Adicionam e removem do **final** do array.

```javascript
const frutas = ["maçã", "banana"];
frutas.push("laranja"); // Adiciona no final
console.log(frutas); // ["maçã", "banana", "laranja"]

const frutaRemovida = frutas.pop(); // Remove do final
console.log(frutaRemovida); // "laranja"
console.log(frutas); // ["maçã", "banana"]
```

- **`unshift()` e `shift()`**: Adicionam e removem do **início** do array. (São computacionalmente mais "caros"/lentos que `push/pop`, pois precisam reordenar todos os índices).

```javascript
const numeros = [3, 4];
numeros.unshift(1, 2); // Adiciona no início
console.log(numeros); // [1, 2, 3, 4]

numeros.shift(); // Remove do início
console.log(numeros); // [2, 3, 4]
```

- **`splice()`: O "Canivete Suíço" da Mutação**

  O método `splice()` é extremamente poderoso e pode remover, adicionar ou substituir elementos em qualquer posição do array.

  `array.splice(startIndex, deleteCount, item1, item2, ...)`

  - **Removendo:**

  ```javascript
  const letras = ['a', 'b', 'c', 'd', 'e'];
  // A partir do índice 2, remova 1 elemento
  const removidas = letras.splice(2, 1);
  console.log(letras); // ['a', 'b', 'd', 'e']
  console.log(removidas); // ['c']
  ```

  - **Adicionando:**

  ```javascript
  // A partir do índice 1, remova 0 elementos e adicione 'x' e 'y'
  letras.splice(1, 0, 'x', 'y');
  console.log(letras); // ['a', 'x', 'y', 'b', 'd', 'e']
  ```

  - **Substituindo:**

  ```javascript
  // A partir do índice 3, remova 2 elementos e adicione 'Z'
  letras.splice(3, 2, 'Z');
  console.log(letras); // ['a', 'x', 'y', 'Z', 'e']
  ```

### b. A Abordagem Imutável (Moderna e Recomendada)

Esta abordagem, favorecida no React e em programação funcional, nunca altera o array original. Em vez disso, ela cria um **novo array** com as alterações desejadas. A sintaxe de espalhamento (`...`) é a principal ferramenta aqui.

- **Adicionando Elementos:**

```javascript
const original = [1, 2, 3];

// Adicionar no final
const novoFinal = [...original, 4];
console.log(novoFinal); // [1, 2, 3, 4]

// Adicionar no início
const novoInicio = [0, ...original];
console.log(novoInicio); // [0, 1, 2, 3]

console.log(original); // [1, 2, 3] (permanece intacto)
```

- **Removendo Elementos:**

```javascript
const paraRemover = ['a', 'b', 'c', 'd'];
const indexParaRemover = 2; // Quero remover o 'c'

// Usando slice()
const removidoComSlice = [
  ...paraRemover.slice(0, indexParaRemover), // Pega tudo ANTES do índice
  ...paraRemover.slice(indexParaRemover + 1) // Pega tudo DEPOIS do índice
];
console.log(removidoComSlice); // ['a', 'b', 'd']

// Usando filter() (mais legível)
const removidoComFilter = paraRemover.filter((_, index) => index !== indexParaRemover);
console.log(removidoComFilter); // ['a', 'b', 'd']
```

- **Substituindo um Elemento:**

```javascript
const paraSubstituir = ["maçã", "banana", "uva"];
const indexParaSubstituir = 1;
const novoValor = "morango";

// Usando map()
const substituido = paraSubstituir.map((item, index) => {
  return index === indexParaSubstituir ? novoValor : item;
});
console.log(substituido); // ["maçã", "morango", "uva"]
```

---

## 6. Usando Índices de Arrays de Forma Avançada

Embora o acesso a elementos via `array[indice]` seja básico, existem técnicas mais avançadas e elegantes para trabalhar com índices, especialmente os negativos ou para acessar múltiplos elementos de uma vez.

### a. O Método `.at(indice)`: Acesso Moderno e Flexível

O método `.at()` foi introduzido no ES2022 e simplifica o acesso a elementos, principalmente quando se trata de índices negativos.

- **Acesso com índice positivo:** Funciona exatamente como `[]`.

```javascript
const cores = ["vermelho", "verde", "azul"];
console.log(cores.at(1)); // "verde"
```

- **Acesso com índice negativo:** Esta é a grande vantagem. Um índice negativo conta a partir do **final** do array. `array.at(-1)` retorna o último elemento, `array.at(-2)` o penúltimo, e assim por diante.

```javascript
const numeros = [10, 20, 30, 40, 50];

// Acessando o último elemento
console.log(numeros.at(-1)); // 50
// Forma tradicional: console.log(numeros[numeros.length - 1]);

// Acessando o penúltimo elemento
console.log(numeros.at(-2)); // 40
// Forma tradicional: console.log(numeros[numeros.length - 2]);
```

Isso torna o código muito mais limpo e legível, eliminando a necessidade da verbosa sintaxe `array[array.length - n]`.

### b. Desestruturação (Destructuring) com Índices

A desestruturação de arrays permite extrair valores em variáveis de forma concisa. É uma maneira poderosa de "desempacotar" elementos de um array.

- **Extraindo os primeiros elementos:**

```javascript
const ranking = ["Ouro", "Prata", "Bronze", "Participação"];

const [primeiro, segundo, terceiro] = ranking;

console.log(primeiro); // "Ouro"
console.log(segundo); // "Prata"
console.log(terceiro); // "Bronze"
```

- **Ignorando elementos:** Você pode usar uma vírgula vazia para pular um elemento que não deseja extrair.

```javascript
const dados = ["João", 30, "São Paulo", "Brasil"];

const [nome, , cidade] = dados; // Ignoramos a idade (índice 1)

console.log(nome);   // "João"
console.log(cidade); // "São Paulo"
```

- **Coletando o "resto" com o operador `...rest`:**

O operador de resto (`...`) pode ser usado na desestruturação para agrupar todos os elementos restantes em um novo array.

```javascript
const notas = [10, 9.5, 8, 7, 6];

const [melhorNota, segundaMelhor, ...outrasNotas] = notas;

console.log(melhorNota);       // 10
console.log(segundaMelhor);    // 9.5
console.log(outrasNotas);      // [8, 7, 6]
```

**Importante:** O operador `...rest` deve ser sempre o último elemento na desestruturação.

### c. Trocando Valores de Variáveis com Desestruturação

Uma das "mágicas" mais elegantes da desestruturação de arrays é a capacidade de trocar os valores de duas variáveis sem precisar de uma variável temporária.

```javascript
let a = 10;
let b = 20;

// A forma tradicional (com variável temporária)
/*
let temp = a;
a = b;
b = temp;
*/

// A forma moderna com desestruturação
[a, b] = [b, a];

console.log(a); // 20
console.log(b); // 10
```

Essa técnica cria um array temporário `[b, a]` (que seria `[20, 10]`) e imediatamente o desestrutura, atribuindo o primeiro valor a `a` e o segundo a `b`.

### d. Manipulação Precisa com .splice()

Embora já mencionado como um método de mutação, o `.splice()` merece um lugar de destaque aqui, pois ele é a ferramenta mais poderosa para manipulação baseada em **índices**. Ele pode remover, adicionar ou substituir elementos em qualquer ponto do array, tudo em uma única operação.

A sintaxe completa é: `array.splice(startIndex, deleteCount, item1, item2, ...)`

- **`startIndex`**: O índice a partir do qual a alteração começará. Aceita números negativos (contando do final, assim como `.at()`).
- **`deleteCount`** (opcional): O número de elementos a serem removidos a partir do `startIndex`.
- **`item1, item2, ...`** (opcional): Os elementos a serem adicionados ao array a partir do `startIndex`.

Vamos ver seu poder em ação:

- **Removendo elementos a partir do final:**

```javascript
const itens = ['A', 'B', 'C', 'D', 'E'];

// A partir do terceiro elemento a partir do final (-3), remova 2 itens ('C' e 'D')
const removidos = itens.splice(-3, 2);

console.log(itens);     // ['A', 'B', 'E']
console.log(removidos); // ['C', 'D']
```

- **Inserindo elementos sem remover nada:**

Para apenas inserir, o `deleteCount` deve ser `0`.

```javascript
const codigo = [101, 102, 105];

// No índice 2, não remova ninguém e insira 103 e 104
codigo.splice(2, 0, 103, 104);

console.log(codigo); // [101, 102, 103, 104, 105]
```

- **Substituindo elementos:**

Para substituir, `deleteCount` deve ser maior que zero, e você fornece os novos itens.

```javascript
const playlist = ['Música 1', 'Música Antiga', 'Música 3'];

// A partir do índice 1, remova 1 item e adicione 'Música 2 (Nova Versão)'
playlist.splice(1, 1, 'Música 2 (Nova Versão)');

console.log(playlist); // ['Música 1', 'Música 2 (Nova Versão)', 'Música 3']
```

O `.splice()` é a ferramenta definitiva para quando você precisa de controle total sobre as modificações do array em uma posição específica, combinando remoção e adição de forma eficiente.

---

## 7. A Flexibilidade dos Elementos de um Array

Uma das características mais poderosas dos arrays em JavaScript é a sua **flexibilidade de tipos**. Diferente de muitas outras linguagens de programação onde um array só pode conter um único tipo de dado (como `int[]` ou `string[]`), um array em JavaScript pode conter uma mistura de **qualquer tipo de valor** que a linguagem suporta.

### a. Tipos Primitivos

Você pode misturar livremente todos os tipos de dados primitivos do JavaScript em um único array.

- **String:** Sequências de texto.
- **Number:** Valores numéricos, incluindo inteiros, pontos flutuantes, `Infinity` e `NaN` (Not-a-Number).
- **Boolean:** Valores `true` ou `false`.
- **`null`:** Representa a ausência intencional de um valor de objeto.
- **`undefined`:** Indica que uma variável não foi atribuída.
- **Symbol:** Um tipo de dado único e imutável.
- **BigInt:** Para números inteiros arbitrariamente grandes.

```javascript
const mixPrimitivo = [
  "Olá, mundo!",      // String
  42,                 // Number (inteiro)
  3.14,               // Number (ponto flutuante)
  true,               // Boolean
  null,               // null
  undefined,          // undefined
  Symbol('id'),       // Symbol
  9007199254740991n   // BigInt
];

console.log(mixPrimitivo);
```

### b. Tipos de Objeto

Além dos primitivos, arrays podem conter tipos mais complexos, baseados em objetos.

- **Objetos Literais:** Estruturas de chave-valor.
- **Outros Arrays (Arrays Aninhados):** Criando matrizes ou estruturas de dados multidimensionais.
- **Funções:** Sim, funções podem ser armazenadas em arrays e executadas posteriormente.
- **Instâncias de Classes:** Objetos criados a partir de classes personalizadas.
- **Expressões Regulares (`RegExp`)**.
- **Datas (`Date`)**.

```javascript
function saudar() {
  console.log("Olá do array!");
}

class Pessoa {
  constructor(nome) {
    this.nome = nome;
  }
}

const mixComplexo = [
  { nome: "Ana", idade: 28 }, // Objeto Literal
  [1, 2, 3],                   // Outro Array
  saudar,                      // Função
  new Pessoa("Carlos"),        // Instância de Classe
  /abc/g,                      // Expressão Regular
  new Date()                   // Objeto Date
];

// Acessando e usando os elementos
console.log(mixComplexo[0].nome); // "Ana"
console.log(mixComplexo[1][1]);   // 2
mixComplexo[2]();                 // Executa a função: "Olá do array!"
console.log(mixComplexo[3].nome); // "Carlos"
```

### Implicações Práticas

- **Versatilidade:** Essa flexibilidade permite criar estruturas de dados complexas e dinâmicas para representar praticamente qualquer tipo de informação.
- **Cuidado:** Embora seja poderoso, misturar muitos tipos diferentes de forma desordenada pode tornar o código mais difícil de entender e manter. Geralmente, é uma boa prática manter arrays com dados de um mesmo "tipo" ou estrutura (por exemplo, um array de objetos `Pessoa`, ou um array de números).

A capacidade de aninhar arrays é a base para a criação de **matrizes** (arrays bidimensionais) ou estruturas de dados ainda mais complexas, usadas em jogos (mapas de tabuleiro), visualização de dados (gráficos) e muito mais.

---

## 8. Verificando se um Conteúdo Existe no Array

Saber se um elemento específico está presente em um array é uma das operações mais fundamentais e recorrentes. JavaScript oferece vários métodos para essa tarefa, cada um com suas próprias vantagens e casos de uso. A escolha do método certo depende do que você precisa saber: apenas se o item existe, onde ele está, ou se ele atende a uma condição complexa.

### a. `includes()`: A Resposta Simples e Direta (ES6+)

O método `.includes()` é a forma mais moderna e legível para verificar a existência de um elemento. Ele retorna um booleano simples: `true` se o elemento for encontrado, e `false` caso contrário.

**Sintaxe:** `array.includes(elemento, fromIndex)`

- **`elemento`**: O valor a ser procurado.
- **`fromIndex`** (opcional): O índice a partir do qual a busca deve começar.

```javascript
const frutas = ['maçã', 'banana', 'manga', 'abacaxi'];

console.log(frutas.includes('manga')); // true
console.log(frutas.includes('uva'));   // false

// Procurando por 'maçã' a partir do índice 1
console.log(frutas.includes('maçã', 1)); // false (porque a busca começa depois da maçã)
```

**Vantagens do `.includes()`:**
- **Legibilidade:** O nome do método (`includes`) deixa a intenção do código extremamente clara.
- **Trata `NaN` corretamente:** Diferente de outros métodos, `.includes()` consegue encontrar `NaN` (Not-a-Number) em um array.

```javascript
const arrayComNaN = [1, 2, NaN, 4];
console.log(arrayComNaN.includes(NaN)); // true
```

**Boa prática:** Para uma simples verificação de "sim ou não", `.includes()` deve ser sempre sua primeira escolha.

### b. `indexOf()` e `lastIndexOf()`: Encontrando a Posição

Se além de saber se o elemento existe, você precisa saber **onde** ele está, os métodos `indexOf()` e `lastIndexOf()` são a solução.

- **`indexOf(elemento)`**: Retorna o **primeiro índice** em que o elemento é encontrado.
- **`lastIndexOf(elemento)`**: Retorna o **último índice** em que o elemento é encontrado.

Ambos retornam **`-1`** se o elemento não for encontrado. Este retorno (`-1`) é a chave para usá-los como verificação de existência.

```javascript
const numeros = [10, 20, 30, 20, 40];

console.log(numeros.indexOf(20));      // 1 (encontra a primeira ocorrência)
console.log(numeros.lastIndexOf(20));  // 3 (encontra a última ocorrência)
console.log(numeros.indexOf(50));      // -1 (não encontrado)
```

**Verificando a existência com `indexOf()`:**

A prática comum (antes do `.includes()`) era verificar se o resultado era diferente de `-1`.

```javascript
if (numeros.indexOf(30) !== -1) {
  console.log("O número 30 existe no array!");
} else {
  console.log("O número 30 não foi encontrado.");
}
```

**Armadilha:** `indexOf()` não funciona para `NaN`.

```javascript
const arrayComNaN = [1, 2, NaN, 4];
console.log(arrayComNaN.indexOf(NaN)); // -1 (resultado incorreto)
```

**Boa prática:** Use `indexOf()` ou `lastIndexOf()` quando a posição do elemento for importante para a lógica seguinte. Para uma simples verificação de existência, prefira `.includes()`.

### c. `find()` e `findIndex()`: A Busca por Condição

E se você não estiver procurando por um valor exato, mas por um elemento que satisfaça uma **condição** (por exemplo, o primeiro número maior que 25 ou um objeto com uma propriedade específica)? Para isso, usamos `find()` e `findIndex()`.

- **`find(callback)`**: Retorna o **primeiro elemento** que satisfaz a condição da função de callback. Retorna `undefined` se nenhum elemento for encontrado.
- **`findIndex(callback)`**: Retorna o **índice do primeiro elemento** que satisfaz a condição. Retorna `-1` se nenhum elemento for encontrado.

A função de `callback` recebe três argumentos: `(elemento, indice, array)`.

**Exemplo com `find()`:**

```javascript
const usuarios = [
  { id: 1, nome: 'Ana', admin: false },
  { id: 2, nome: 'Beto', admin: true },
  { id: 3, nome: 'Carlos', admin: false }
];

const primeiroAdmin = usuarios.find(usuario => usuario.admin === true);
console.log(primeiroAdmin); // { id: 2, nome: 'Beto', admin: true }

const usuarioInexistente = usuarios.find(usuario => usuario.id === 5);
console.log(usuarioInexistente); // undefined
```

**Verificando a existência com `find()`:**

Você pode converter o resultado para um booleano.

```javascript
const existeAdmin = usuarios.find(user => user.admin);
if (existeAdmin) { // ou if (Boolean(existeAdmin))
  console.log("Há pelo menos um administrador no array.");
}
```

**Exemplo com `findIndex()`:**

```javascript
const numerosMaioresQue25 = [10, 15, 28, 35];
const indexDoPrimeiroMaior = numerosMaioresQue25.findIndex(num => num > 25);
console.log(indexDoPrimeiroMaior); // 2 (o número 28 está no índice 2)
```

**Boa prática:** `find()` e `findIndex()` são as ferramentas ideais para buscas em arrays de objetos ou quando a lógica de verificação é mais complexa do que uma simples igualdade.

### d. `some()`: Verificação de Condição com Retorno Booleano

O método `.some()` é como uma combinação do `.includes()` com a lógica do `.find()`. Ele testa se **pelo menos um** elemento no array passa na condição implementada pela função de callback. Ele retorna `true` assim que encontra o primeiro, sendo muito eficiente.

**Sintaxe:** `array.some(callback)`

```javascript
const idades = [12, 17, 25, 30];

// Existe alguma idade maior ou igual a 18?
const existeMaiorDeIdade = idades.some(idade => idade >= 18);
console.log(existeMaiorDeIdade); // true

// Existe algum número negativo?
const existeNegativo = idades.some(idade => idade < 0);
console.log(existeNegativo); // false
```

**`some()` vs `find()`:**
- Use `some()` quando a única coisa que importa é saber se "sim" ou "não" algum item satisfaz a condição. O retorno é um booleano limpo.
- Use `find()` quando você precisa do **próprio item** que satisfez a condição.

### Resumo e Melhores Práticas

| Método | O que retorna? | Quando usar? | Trata `NaN`? |
| :--- | :--- | :--- | :--- |
| **`includes(valor)`** | `true` / `false` | **Padrão:** Para verificar se um valor primitivo exato existe. | **Sim** |
| **`indexOf(valor)`** | `índice` ou `-1` | Quando você precisa da **posição** do primeiro valor encontrado. | Não |
| **`lastIndexOf(valor)`**| `índice` ou `-1` | Quando você precisa da **posição** do último valor encontrado. | Não |
| **`find(callback)`** | `elemento` ou `undefined` | Para encontrar o **primeiro elemento** que satisfaz uma condição complexa (ótimo para objetos). | Sim |
| **`findIndex(callback)`**| `índice` ou `-1` | Para encontrar o **índice do primeiro elemento** que satisfaz uma condição complexa. | Sim |
| **`some(callback)`** | `true` / `false` | Para verificar se **pelo menos um elemento** satisfaz uma condição, com um retorno booleano direto e eficiente. | Sim |
