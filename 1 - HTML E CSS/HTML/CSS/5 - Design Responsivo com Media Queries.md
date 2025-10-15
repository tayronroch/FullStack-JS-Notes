# Design Responsivo com Media Queries

Design Responsivo é a prática de criar páginas web que se adaptam e fornecem uma boa experiência de visualização em uma variedade de dispositivos, desde desktops a celulares.

A principal ferramenta do CSS para alcançar a responsividade são as **Media Queries**.

## A Meta Tag Viewport

Antes de mais nada, para que o design responsivo funcione corretamente em dispositivos móveis, você deve incluir a meta tag `viewport` no `<head>` do seu HTML. Ela instrui o navegador a controlar as dimensões e a escala da página.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

- `width=device-width`: Define a largura da página para seguir a largura da tela do dispositivo.
- `initial-scale=1.0`: Define o nível de zoom inicial quando a página é carregada pela primeira vez.

## Media Queries

Media Queries permitem que você aplique blocos de CSS apenas quando certas condições são atendidas, como a largura da tela do navegador.

A sintaxe usa a regra `@media`.

```css
/* Estilos que se aplicam por padrão (mobile-first) */
.container {
  width: 100%;
  background-color: lightblue;
}

/* Estilos que se aplicam em telas com 600px de largura ou mais */
@media (min-width: 600px) {
  .container {
    width: 80%;
    background-color: lightgreen;
  }
}

/* Estilos que se aplicam em telas com 992px de largura ou mais */
@media (min-width: 992px) {
  .container {
    width: 60%;
    background-color: lightcoral;
  }
}
```

### Exemplo Prático: Layout Flexbox Responsivo

Imagine um layout com dois contêineres, um ao lado do outro em telas grandes, mas empilhados em telas pequenas.

**HTML:**
```html
<div class="flex-container">
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
</div>
```

**CSS (abordagem Mobile-First):**
```css
.flex-container {
  display: flex;
  flex-direction: column; /* Empilhado por padrão (mobile) */
}

.item {
  background-color: #f2f2f2;
  margin: 10px;
  padding: 20px;
  font-size: 30px;
}

/* Quando a tela for de 768px ou maior, muda para layout em linha */
@media (min-width: 768px) {
  .flex-container {
    flex-direction: row;
  }
}
```

Neste exemplo, os itens ficam um sobre o outro em telas menores que 768px. Em telas de 768px ou mais, eles ficam lado a lado. Essa é a base do design responsivo moderno.
