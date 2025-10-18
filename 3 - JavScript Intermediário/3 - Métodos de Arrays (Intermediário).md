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
