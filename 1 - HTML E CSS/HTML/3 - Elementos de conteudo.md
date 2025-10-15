# Elementos de Conteúdo em HTML

## Semântica HTML

A semântica no HTML refere-se ao uso de tags que descrevem o significado do conteúdo que elas envolvem. Usar elementos semânticos torna o código mais claro, acessível e otimizado para mecanismos de busca.

## Títulos e Parágrafos

- **Títulos (`<h1>` a `<h6>`):** Estruturam o conteúdo em seções hierárquicas. `<h1>` é o mais importante e `<h6>` o menos.
- **Parágrafos (`<p>`):** Usados para agrupar blocos de texto.

## Formatação Básica de Textos

- `<b>` e `<strong>`: Negrito. `<strong>` indica forte importância.
- `<i>` e `<em>`: Itálico. `<em>` dá ênfase ao texto.
- `<u>`: Sublinhado.

## Listas

- **Listas Ordenadas (`<ol>`):** Para itens em uma sequência numerada.
- **Listas Não Ordenadas (`<ul>`):** Para itens sem uma ordem específica.
- **Itens de Lista (`<li>`):** Usado dentro de `<ol>` e `<ul>` para cada item.

## Representação de Código

- `<code>`: Para exibir pequenas partes de código inline.
- `<pre>`: Para blocos de código, preservando espaços e quebras de linha.

## Hiperlinks

A tag `<a>` (âncora) cria links para outras páginas ou recursos. O atributo `href` especifica o destino do link.

```html
<a href="https://www.exemplo.com">Visite nosso site</a>
```

## Imagens

A tag `<img>` é usada para incorporar imagens. É uma tag vazia (não tem fechamento).

- `src`: O caminho (URL) da imagem.
- `alt`: Texto alternativo, essencial para acessibilidade.

```html
<img src="caminho/para/imagem.jpg" alt="Descrição da imagem">
```
