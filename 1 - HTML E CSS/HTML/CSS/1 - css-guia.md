# Guia Introdutório de CSS

## O que é CSS?

CSS (Cascading Style Sheets) é uma linguagem de folha de estilo usada para descrever a apresentação de um documento escrito em HTML. Com o CSS, você pode controlar cores, fontes, espaçamento, layout e muito mais.

Separar o HTML do CSS torna o código mais organizado, fácil de manter e reutilizável.

## Sintaxe Básica

Uma regra CSS consiste em um **seletor** e um **bloco de declaração**.

```css
 seletor {
    propriedade: valor;
 }
```

- **Seletor:** Aponta para o elemento HTML que você deseja estilizar (ex: `p`, `h1`, `.classe`, `#id`).
- **Bloco de Declaração:** Contém uma ou mais declarações separadas por ponto e vírgula.
- **Declaração:** Inclui um nome de propriedade CSS e um valor, separados por dois pontos.

### Exemplo

```css
p {
  color: blue;
  font-size: 16px;
}
```

Este código seleciona todos os elementos `<p>` e define a cor do texto como azul e o tamanho da fonte como 16 pixels.

## Como Adicionar CSS a um HTML

Existem três maneiras de inserir CSS em um documento HTML:

1.  **CSS Externo (External):**
    Crie um arquivo `.css` separado e vincule-o ao seu HTML usando a tag `<link>` no `<head>`.

    ```html
    <link rel="stylesheet" href="estilos.css">
    ```

2.  **CSS Interno (Internal):**
    Escreva o código CSS dentro da tag `<style>` no `<head>` do seu arquivo HTML.

    ```html
    <style>
      body {
        background-color: lightblue;
      }
    </style>
    ```

3.  **CSS Inline:**
    Aplique estilos diretamente a um elemento HTML usando o atributo `style`. (Use com moderação).

    ```html
    <h1 style="color: navy; text-align: center;">Meu Título</h1>
    ```

A abordagem mais comum e recomendada é usar **CSS Externo**, pois mantém a estrutura (HTML) e a apresentação (CSS) completamente separadas.
