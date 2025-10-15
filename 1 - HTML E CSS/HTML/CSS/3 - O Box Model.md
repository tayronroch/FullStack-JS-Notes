# O Box Model do CSS

No CSS, todo elemento HTML é tratado como uma caixa retangular. O **Box Model** (Modelo de Caixa) é o conjunto de regras que define como as dimensões dessa caixa (largura e altura) são calculadas, e como as propriedades de preenchimento, borda e margem interagem.

O Box Model é composto por quatro partes:

1.  **Conteúdo (Content):** A área onde o seu texto e imagens aparecem.
2.  **Preenchimento (Padding):** Uma área transparente ao redor do conteúdo, mas dentro da borda. Cria um espaçamento interno.
3.  **Borda (Border):** A borda que envolve o conteúdo e o preenchimento.
4.  **Margem (Margin):** Uma área transparente fora da borda. Cria um espaçamento externo, afastando o elemento de outros.

![Box Model](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model/box-model-small.png)

## Propriedades do Box Model

- `padding`: Define o espaço de preenchimento nos quatro lados.
  - `padding-top`, `padding-right`, `padding-bottom`, `padding-left`
- `border`: Define a espessura, estilo e cor da borda.
  - Ex: `border: 1px solid black;`
- `margin`: Define o espaço de margem nos quatro lados.
  - `margin-top`, `margin-right`, `margin-bottom`, `margin-left`

### Exemplo

```css
div {
  width: 200px;
  height: 100px;
  padding: 20px;
  border: 5px solid red;
  margin: 30px;
  background-color: lightgray;
}
```

## `box-sizing`

Por padrão (`box-sizing: content-box;`), a largura (`width`) e altura (`height`) que você define se aplicam apenas à **área de conteúdo**. O `padding` e a `border` são adicionados *fora* dessa largura/altura, o que muitas vezes torna o cálculo do layout complicado.

Para simplificar, usamos `box-sizing: border-box;`. Com ele, a `width` e a `height` que você define incluem o **conteúdo, o padding e a borda**.

É uma prática comum aplicar esta regra a todos os elementos:

```css
* {
  box-sizing: border-box;
}
```

Isso torna a criação de layouts muito mais intuitiva, pois um elemento com `width: 200px;` terá sempre 200px de largura total, independentemente do padding ou da borda que você adicionar.
