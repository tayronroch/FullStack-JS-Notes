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

### Variáveis

Variáveis são contêineres para armazenar valores. Em JavaScript moderno, usamos `let` e `const`.

- `let`: Para variáveis cujo valor pode mudar.
- `const`: Para constantes, cujo valor não pode ser alterado após a atribuição.

```javascript
let idade = 30;
idade = 31; // Válido

const nome = "Maria";
// nome = "Joana"; // Inválido, vai gerar um erro
```

### Tipos de Dados Primitivos

- **String:** Texto. Ex: `"Olá, mundo"`
- **Number:** Números inteiros ou de ponto flutuante. Ex: `10`, `3.14`
- **Boolean:** Verdadeiro ou falso. Ex: `true`, `false`
- **Undefined:** Uma variável que foi declarada, mas ainda não teve um valor atribuído.
- **Null:** Representa a ausência intencional de um valor.

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
