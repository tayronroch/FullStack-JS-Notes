# Display e Posicionamento em CSS

As propriedades `display` e `position` são fundamentais para controlar o layout e a organização dos elementos em uma página.

## A Propriedade `display`

A propriedade `display` define como um elemento se comporta em termos de layout.

- **`block`**: O elemento ocupa toda a largura disponível e começa em uma nova linha. Exemplos: `<div>`, `<p>`, `<h1>`.
- **`inline`**: O elemento ocupa apenas a largura necessária e não começa em uma nova linha. Não é possível definir `width` e `height` para elementos inline. Exemplos: `<a>`, `<span>`, `<strong>`.
- **`inline-block`**: Uma mistura dos dois. O elemento não começa em uma nova linha, mas você pode definir `width`, `height`, `margin` e `padding`.
- **`none`**: O elemento é completamente removido da página e não ocupa espaço.

## A Propriedade `position`

A propriedade `position` especifica o método de posicionamento usado para um elemento.

- **`static`**: O padrão. O elemento é posicionado de acordo com o fluxo normal da página.
- **`relative`**: O elemento é posicionado em relação à sua posição normal. Você pode usar `top`, `right`, `bottom` e `left` para deslocá-lo.
- **`absolute`**: O elemento é posicionado em relação ao seu "ancestral posicionado" mais próximo (qualquer ancestral que não seja `static`). Se não houver, ele usa o `<body>` como referência. Ele é removido do fluxo normal da página.
- **`fixed`**: O elemento é posicionado em relação à janela do navegador (viewport). Ele permanece no mesmo lugar mesmo quando a página é rolada.

## Introdução ao Flexbox

Flexbox é um modelo de layout unidimensional que oferece uma maneira mais eficiente de alinhar e distribuir espaço entre itens em um contêiner.

Para usar o Flexbox, você define `display: flex;` em um contêiner.

```html
<div class="flex-container">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

```css
.flex-container {
  display: flex;
  justify-content: space-around; /* Distribui os itens horizontalmente */
  align-items: center;         /* Alinha os itens verticalmente */
}
```

### Propriedades Chave do Flexbox:

- **`flex-direction`**: Define a direção do eixo principal (linha ou coluna).
- **`justify-content`**: Alinha os itens ao longo do eixo principal.
- **`align-items`**: Alinha os itens ao longo do eixo transversal.

Flexbox simplifica a criação de muitos layouts complexos que antes exigiam soluções alternativas complicadas.
