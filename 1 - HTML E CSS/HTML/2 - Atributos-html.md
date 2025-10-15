# Atributos HTML

Atributos HTML fornecem informações adicionais sobre os elementos HTML. Eles são sempre especificados na tag de abertura e geralmente vêm em pares de nome/valor como `nome="valor"`.

## Atributo `id`

O atributo `id` especifica um ID exclusivo para um elemento HTML. O valor do `id` deve ser único dentro do documento HTML. É usado para estilizar um elemento específico com CSS ou para selecioná-lo com JavaScript.

```html
<p id="paragrafo-unico">Este é um parágrafo com um ID exclusivo.</p>
```

## Atributo `class`

O atributo `class` especifica uma ou mais classes para um elemento HTML. Vários elementos podem compartilhar a mesma classe. É usado para estilizar um grupo de elementos com CSS.

```html
<p class="destaque">Este parágrafo está em destaque.</p>
<p class="destaque">Este também está em destaque.</p>
```

## Atributos `data-*`

Os atributos `data-*` são usados para armazenar dados personalizados privados para a página ou aplicativo. Os dados armazenados podem ser facilmente utilizados no JavaScript da página para criar uma experiência de usuário mais envolvente.

```html
<div data-id-usuario="123" data-tipo-usuario="admin">
  <p>Informações do usuário</p>
</div>
```

## Atributo `style`

O atributo `style` é usado para adicionar estilos a um elemento, como cor, fonte, tamanho, etc. O uso de CSS embutido com o atributo `style` não é uma boa prática para estilizar um site inteiro, mas é útil para aplicar estilos rápidos e específicos.

```html
<p style="color:blue; font-size:16px;">Este parágrafo é azul e tem uma fonte de 16px.</p>
```
