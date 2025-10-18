# Métodos de Strings (Texto) em JavaScript

Strings são um dos tipos de dados mais utilizados em qualquer linguagem de programação. JavaScript oferece um conjunto rico e poderoso de métodos para manipulá-las.

---

## 1. A Imutabilidade das Strings

O conceito mais importante sobre strings em JavaScript é que elas são **imutáveis**. Isso significa que, uma vez que uma string é criada, ela não pode ser alterada.

Todos os métodos que "modificam" uma string, na verdade, **retornam uma nova string** com a modificação aplicada, sem alterar a original.

```javascript
let nome = "tayron";

let nomeMaiusculo = nome.toUpperCase();

console.log(nomeMaiusculo); // "TAYRON"
console.log(nome); // "tayron" (a original permanece intacta)
```

---

## 2. Obtendo o Comprimento e Acessando Caracteres

### a. Obtendo o Comprimento com `.length`

A propriedade `length` é a forma mais simples de descobrir quantos caracteres uma string possui.

- **É uma propriedade, não um método:** Você a acessa diretamente, sem usar parênteses `()`.
- **Conta tudo:** `length` conta todos os caracteres, incluindo letras, números, espaços, pontuação e símbolos.
- **Útil para validação e loops:** É fundamental para verificar se uma string não está vazia ou para iterar sobre seus caracteres.

```javascript
const saudacao = "Olá, Mundo!";
console.log(saudacao.length); // 11

const email = "usuario@email.com";
console.log(email.length); // 17

const stringVazia = "";
console.log(stringVazia.length); // 0

// Exemplo de validação
const senha = "123";
if (senha.length < 8) {
  console.log("Erro: A senha deve ter pelo menos 8 caracteres.");
}

// Nota sobre caracteres especiais (como emojis)
const emoji = "🚀";
console.log(emoji.length); // 2 (Em JavaScript, alguns emojis são compostos e podem contar como mais de um caractere)
```

### b. Acessando Caracteres Individuais

Existem duas formas principais de acessar um caractere específico em uma string, usando sua posição (índice), que sempre começa em `0`.

- **Acesso por índice `[]`**: A forma moderna, concisa e mais comum.
- **`charAt(index)`**: O método mais antigo para fazer o mesmo.

```javascript
const palavra = "JavaScript";

// Acessando o primeiro caractere (índice 0)
console.log(palavra[0]); // "J"
console.log(palavra.charAt(0)); // "J"

// Acessando o último caractere
// O índice do último caractere é sempre length - 1
console.log(palavra[palavra.length - 1]); // "t"

// O que acontece com índices inválidos?
// O acesso por colchetes retorna 'undefined', enquanto charAt() retorna uma string vazia.
console.log(palavra[99]); // undefined
console.log(palavra.charAt(99)); // ""
```

---

## 3. Buscando e Verificando Substrings

Esses métodos ajudam a encontrar ou verificar se um pedaço de texto existe dentro de uma string. Eles são sensíveis a maiúsculas e minúsculas.

- **`includes(substring, position?)`**: Retorna `true` se a string contém a `substring`. O segundo argumento opcional define a partir de qual posição começar a busca.
- **`startsWith(substring, position?)`**: Retorna `true` se a string **começa** com a `substring`.
- **`endsWith(substring, length?)`**: Retorna `true` se a string **termina** com a `substring`.
- **`indexOf(substring, position?)`**: Retorna o índice da **primeira** ocorrência da `substring`. Se não encontrar, retorna `-1`.
- **`lastIndexOf(substring, position?)`**: Retorna o índice da **última** ocorrência da `substring`. Se não encontrar, retorna `-1`.

```javascript
const texto = "O JavaScript é uma linguagem poderosa. JavaScript é versátil.";

// includes
console.log(texto.includes("JavaScript")); // true
console.log(texto.includes("Python")); // false

// startsWith / endsWith
console.log(texto.startsWith("O JavaScript")); // true
console.log(texto.endsWith("versátil.")); // true

// indexOf / lastIndexOf
console.log(texto.indexOf("JavaScript")); // 2 (primeira ocorrência)
console.log(texto.lastIndexOf("JavaScript")); // 39 (última ocorrência)
console.log(texto.indexOf("Java")); // 2
console.log(texto.indexOf("não existe")); // -1
```

---

## 4. Extraindo Substrings (Fatiando o Texto)

Esses métodos são usados para extrair um pedaço (uma "fatia") de uma string, sempre retornando uma nova string.

- **`slice(startIndex, endIndex?)`**: O método mais comum e flexível. Extrai uma parte da string e a retorna.

  - `startIndex`: O índice onde a extração começa.
  - `endIndex` (opcional): O índice **antes** do qual a extração termina. O caractere neste índice não é incluído.
  - Aceita índices negativos, que contam a partir do final da string.

- **`substring(startIndex, endIndex?)`**: Similar ao `slice`, mas com duas diferenças principais:
  - Não aceita índices negativos.
  - Se `startIndex` for maior que `endIndex`, ele inverte os argumentos automaticamente.

```javascript
const url = "https://meusite.com/produtos/notebook";

// --- Exemplos com slice (o mais recomendado) ---

// Extrai do índice 8 até o final
console.log(url.slice(8)); // "meusite.com/produtos/notebook" (do índice 8 até o final)

// Extrai do índice 8 até o 19 (o 20 não é incluído)
console.log(url.slice(8, 20)); // "meusite.com/" (do índice 8 até o 19)

// Usando índices negativos (contagem a partir do final)
console.log(url.slice(-9)); // "notebook" (os últimos 9 caracteres)
console.log(url.slice(0, -10)); // "https://meusite.com/produtos" (tudo, exceto os últimos 10)

// --- Exemplos com substring ---
console.log(url.substring(8, 20)); // "meusite.com/" (funciona como slice com positivos)

// substring inverte os argumentos se o primeiro for maior
console.log(url.substring(20, 8)); // "meusite.com/" (mesmo resultado)
// slice retornaria uma string vazia neste caso
console.log(url.slice(20, 8)); // ""

// Exemplo prático: extrair o nome de usuário de um e-mail
const email = "aluno.escola@dominio.com.br";
const indiceArroba = email.indexOf("@");
const nomeUsuario = email.slice(0, indiceArroba);
console.log(nomeUsuario); // "aluno.escola"
```

---

## 5. Modificando a String (Retornando uma Nova)

- **`replace(pattern, replacement)`**: Substitui a **primeira** ocorrência de um `pattern` (pode ser uma string ou uma expressão regular).
- **`replaceAll(pattern, replacement)`**: Substitui **todas** as ocorrências de um `pattern`.
- **`toUpperCase()` / `toLowerCase()`**: Converte a string inteira para maiúsculas ou minúsculas.
- **`trim()`**: Remove espaços em branco do início **e** do fim da string.
  - **`trimStart()`**: Remove espaços apenas do início.
  - **`trimEnd()`**: Remove espaços apenas do fim.
- **`concat(...strings)`**: Junta (concatena) uma ou mais strings à string original. O operador `+` é geralmente mais usado para isso.

```javascript
let frase = "  Aprender JavaScript é divertido!  ";

// toUpperCase / toLowerCase
console.log(frase.toUpperCase()); // "  APRENDER JAVASCRIPT É DIVERTIDO!  "

// trim
console.log(frase.trim()); // "Aprender JavaScript é divertido!"

let mensagem = "O gato é preto, o cachorro é preto.";

// replace (substitui só o primeiro)
console.log(mensagem.replace("preto", "branco")); // "O gato é branco, o cachorro é preto."

// replaceAll (substitui todos)
console.log(mensagem.replaceAll("preto", "branco")); // "O gato é branco, o cachorro é branco."

// concat
const parte1 = "Olá";
const parte2 = "Mundo";
console.log(parte1.concat(", ", parte2, "!")); // "Olá, Mundo!"
console.log(parte1 + ", " + parte2 + "!"); // Mesma coisa, mais legível
```

---

## 6. Dividindo e Preenchendo

- **`split(separator, limit?)`**: Divide a string em um **array** de substrings, usando um `separator` para determinar onde fazer a divisão. Este é um dos métodos mais úteis.
- **`padStart(targetLength, padString?)`**: Preenche o início da string com `padString` até que ela atinja o `targetLength`.
- **`padEnd(targetLength, padString?)`**: Preenche o final da string.

```javascript
// split
const csv = "ana;silva;30;desenvolvedora";
const dados = csv.split(";");
console.log(dados); // ['ana', 'silva', '30', 'desenvolvedora']

const fraseSplit = "Eu amo programar em JavaScript";
const palavras = fraseSplit.split(" ");
console.log(palavras); // ['Eu', 'amo', 'programar', 'em', 'JavaScript']

const letras = "abc".split("");
console.log(letras); // ['a', 'b', 'c']

// padStart / padEnd
const codigo = "99";

// Preenche com '0' no início até a string ter 4 caracteres
console.log(codigo.padStart(4, "0")); // "0099"

const nomeProduto = "Notebook";
// Preenche com '.' no final até a string ter 20 caracteres
console.log(nomeProduto.padEnd(20, ".")); // "Notebook............"
```

---

## 7. Exemplo Prático: Criando um "Slug" para URL

Um "slug" é uma versão de uma string amigável para URLs (sem espaços, acentos ou maiúsculas). Vamos criar uma função que faz isso combinando vários métodos.

```javascript
function criarSlug(titulo) {
  // 1. Converte para minúsculas
  const tituloMinusculo = titulo.toLowerCase();

  // 2. Remove espaços do início e do fim
  const tituloTrimmed = tituloMinusculo.trim();

  // 3. Substitui espaços no meio por hífens
  const slug = tituloTrimmed.replaceAll(" ", "-");

  return slug;
}

// Versão encadeada e mais concisa
function criarSlugConciso(titulo) {
  return titulo.toLowerCase().trim().replaceAll(" ", "-");
}

const tituloPost = "  Minha Primeira Publicação no Blog  ";

const urlSlug = criarSlug(tituloPost);
console.log(urlSlug); // "minha-primeira-publicação-no-blog"

const urlSlug2 = criarSlugConciso(tituloPost);
console.log(urlSlug2); // "minha-primeira-publicação-no-blog"

// Nota: Uma função de slug real também removeria acentos e caracteres especiais,
// o que geralmente requer o uso de Expressões Regulares (RegEx) com o método .replace().
```
