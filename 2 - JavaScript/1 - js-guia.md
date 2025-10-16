# Guia Introdutório de JavaScript

## O que é JavaScript?

JavaScript (JS) é uma linguagem de programação que permite implementar itens complexos em páginas web. Enquanto o HTML define a estrutura e o CSS define o estilo, o JavaScript adiciona **interatividade** e comportamento dinâmico.

Com ele, você pode criar e atualizar conteúdo dinamicamente, controlar mídias, animar imagens e muito mais.

## Como Adicionar JavaScript a um HTML

Assim como o CSS, existem três maneiras principais de incluir JavaScript.

1.  **JavaScript Externo (Recomendado):**
    Crie um arquivo `.js` separado e vincule-o ao seu HTML usando a tag `<script>` com o atributo `src`. Geralmente, a tag `<script>` é colocada no final do `<body>` para garantir que o HTML seja carregado antes do script.

    ```html
    <script src="meu-script.js"></script>
    ```

2.  **JavaScript Interno:**
    Escreva o código diretamente dentro da tag `<script>` no seu arquivo HTML.

    ```html
    <script>
      // Seu código JavaScript aqui
      console.log('Olá, mundo!');
    </script>
    ```

3.  **JavaScript Inline (Não recomendado):**
    Execute código diretamente em um atributo de evento de um elemento HTML.

    ```html
    <button onclick="alert('Você clicou!');">Clique em mim</button>
    ```

## Sintaxe Básica

### Comentários

```javascript
// Este é um comentário de uma linha

/*
  Este é um comentário
  de múltiplas linhas.
*/
```

### Sensibilidade a Maiúsculas e Minúsculas (Case-Sensitive)

JavaScript é uma linguagem **case-sensitive**. Isso significa que letras maiúsculas e minúsculas são tratadas como caracteres diferentes.

Por exemplo, as variáveis `minhaVariavel` e `minhavariavel` são completamente distintas.

```javascript
let nome = "Alice";
let Nome = "Bob";

console.log(nome); // Saída: "Alice"
console.log(Nome); // Saída: "Bob"
```

Isso se aplica a tudo: nomes de variáveis, funções, constantes e até mesmo eventos. Palavras-chave da linguagem, como `let`, `const`, `if`, `else`, etc., devem sempre ser escritas em minúsculas.

### Variáveis

Variáveis são contêineres para armazenar valores. Em JavaScript moderno, usamos `let` e `const`.

- `let`: Permite declarar variáveis que podem ter seu valor alterado. Possui escopo de bloco.
- `const`: Permite declarar constantes, cujo valor não pode ser alterado após a atribuição inicial. Também possui escopo de bloco.

```javascript
let idade = 30;
idade = 31; // Válido

const nome = "Maria";
// nome = "Joana"; // Inválido, vai gerar um erro
```

#### Uma nota sobre `var`

Antes do ES6 (2015), a única forma de declarar variáveis era com `var`. A principal diferença é que `var` tem **escopo de função**, enquanto `let` e `const` têm **escopo de bloco** (`{}`). Isso significa que uma variável declarada com `var` é visível em toda a função onde foi criada, o que pode levar a bugs e comportamentos inesperados. Por isso, em código moderno, `let` e `const` são sempre preferidos.

#### Regras e Convenções para Nomes de Variáveis

Ao nomear suas variáveis, você precisa seguir algumas regras e convenções.

**Regras (Obrigatório):**
- Nomes podem conter letras, números, underscore (`_`) e cifrão (`$`).
- Nomes devem começar com uma letra, `_` ou `$`. 
- **Não podem** começar com um número.
- **Não podem** conter espaços.
- **Não podem** ser palavras reservadas da linguagem (como `let`, `const`, `if`, `function`, etc.).

**Convenções (Boas Práticas):**
- **camelCase:** É a convenção **padrão** e mais comum em JavaScript para variáveis e funções. A primeira palavra começa com letra minúscula e as subsequentes começam com maiúscula. Ex: `minhaPrimeiraVariavel`.
- **PascalCase:** Usado para nomes de Classes. É igual ao camelCase, mas a primeira palavra também começa com maiúscula. Ex: `class MeuComponente { ... }`.
- **snake_case:** Comum em outras linguagens (como Python), mas **não é uma convenção padrão em JavaScript** para variáveis. Você pode encontrá-lo em respostas de APIs ou em arquivos de configuração. Ex: `minha_variavel`.
- **UPPER_SNAKE_CASE (ou SCREAMING_SNAKE_CASE):** Usado para constantes, ou seja, valores que nunca mudam. Ex: `const PI = 3.14;`, `const TAMANHO_MAXIMO = 100;`.
- **Nomes Descritivos:** Use nomes que descrevam o dado que a variável armazena. `nomeUsuario` é melhor que `nu`.

```javascript
// Válido e bom
let primeiroNome = "Tayron";
const IDADE_MINIMA = 18;

// Válido, mas não recomendado
let _data = new Date();
let $elemento = document.getElementById('id');

// Inválido
// let 1nome = "inválido"; // Começa com número
// let nome completo = "inválido"; // Contém espaço
// let if = "inválido"; // Palavra reservada
```

### Tipos de Dados Primitivos

- **String:** Texto. Ex: `"Olá, mundo"`
- **Number:** Números inteiros ou de ponto flutuante. Ex: `10`, `3.14`
- **Boolean:** Verdadeiro ou falso. Ex: `true`, `false`
- **Undefined:** Uma variável que foi declarada, mas ainda não teve um valor atribuído.
- **Null:** Representa a ausência intencional de um valor.
- **Symbol:** Um valor único e imutável, frequentemente usado para adicionar chaves de propriedade únicas a um objeto.
- **BigInt:** Usado para representar números inteiros maiores que o tipo `Number` pode suportar.

### Template Literals (ES6)

O ES6 introduziu uma maneira mais fácil e poderosa de trabalhar com strings, chamada Template Literals ou Template Strings.

**Forma antiga (concatenação com `+`):**
```javascript
const nome = "Maria";
const saudacao = "Olá, " + nome + "! Bem-vinda.";
// Resultado: "Olá, Maria! Bem-vinda."
```

**Forma moderna (Template Literals):**

Eles usam crases (`` ` ``) em vez de aspas e permitem duas grandes melhorias:

1.  **Interpolação de Expressões:** Você pode inserir variáveis ou qualquer expressão JavaScript diretamente na string usando a sintaxe `${...}`.
2.  **Strings de Múltiplas Linhas:** Você pode quebrar a linha dentro da string simplesmente pressionando Enter, sem precisar do caractere `\n`.

```javascript
const usuario = "João";
const idade = 25;

// Exemplo com interpolação
const mensagem = `Olá, meu nome é ${usuario} e eu tenho ${idade} anos.`;
console.log(mensagem);
// Saída: Olá, meu nome é João e eu tenho 25 anos.

// Exemplo com múltiplas linhas
const email = `
Olá, ${usuario},

Obrigado por se cadastrar.

Atenciosamente,
A Equipe.
`;
console.log(email);
```

### Exemplo: Manipulando o DOM

JavaScript é frequentemente usado para interagir com o DOM (Document Object Model) que aprendemos na seção de HTML. Aqui está um exemplo que muda o texto de um parágrafo.

**HTML:**
```html
<p id="meu-paragrafo">Este é o texto original.</p>
<button id="meu-botao">Mudar Texto</button>
```

**JavaScript:**
```javascript
// Seleciona o botão e o parágrafo pelo ID
const botao = document.getElementById('meu-botao');
const paragrafo = document.getElementById('meu-paragrafo');

// Adiciona um "ouvinte de evento" que espera por um clique no botão
botao.addEventListener('click', function() {
  // Quando o botão for clicado, muda o texto do parágrafo
  paragrafo.textContent = 'O texto foi alterado pelo JavaScript!';
});
```
