# Seletores e Propriedades CSS

## Seletores CSS

Seletores são o coração do CSS. Eles permitem que você escolha precisamente quais elementos HTML estilizar.

### Seletores Básicos

- **Seletor de Tipo (Elemento):** Seleciona todos os elementos de um determinado tipo.
  ```css
  p { /* Estiliza todos os <p> */ }
  ```
- **Seletor de Classe:** Seleciona todos os elementos que têm um atributo `class` específico. É o seletor mais comum e reutilizável.
  ```css
  .minha-classe { /* Estiliza <p class="minha-classe"> */ }
  ```
- **Seletor de ID:** Seleciona um único elemento que tem um atributo `id` específico. O ID deve ser único na página.
  ```css
  #meu-id { /* Estiliza <div id="meu-id"> */ }
  ```

### Agrupamento e Combinações

- **Agrupamento:** Aplique o mesmo estilo a vários seletores, separando-os por vírgulas.
  ```css
  h1, h2, p {
    color: gray;
  }
  ```
- **Seletor Descendente:** Seleciona elementos que são descendentes de um elemento específico.
  ```css
  div p {
    /* Estiliza apenas os <p> que estão dentro de uma <div> */
    font-weight: bold;
  }
  ```

## Propriedades Comuns

Depois de selecionar um elemento, você aplica estilos com propriedades.

### Texto

- `color`: Define a cor do texto.
- `font-size`: Define o tamanho do texto (ex: `16px`, `1.2em`).
- `font-family`: Define a família da fonte (ex: `"Arial", sans-serif`).
- `font-weight`: Define a "grossura" da fonte (ex: `normal`, `bold`).
- `text-align`: Alinha o texto horizontalmente (ex: `left`, `center`, `right`).

### Fundo (Background)

- `background-color`: Define a cor de fundo de um elemento.
- `background-image`: Define uma imagem como fundo.

### Exemplo Completo

```css
/* Estilo geral para o corpo da página */
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
}

/* Estilo para um cabeçalho principal */
#cabecalho-principal {
  background-color: #333;
  color: white;
  text-align: center;
}

/* Estilo para textos de destaque */
.texto-destaque {
  color: green;
  font-weight: bold;
}
```
