# Guia HTML

## O que é HTML?

HTML (HyperText Markup Language) é a linguagem de marcação padrão para criar páginas da web. Ele descreve a estrutura de uma página da web usando um sistema de "tags".

## Comentários

Comentários em HTML são usados para adicionar notas ao código que não são exibidas no navegador. Eles são úteis para explicar o código e torná-lo mais legível.

```html
<!-- Este é um comentário em HTML -->
```

## Tags

Tags HTML são os blocos de construção de uma página da web. Elas são usadas para formatar o conteúdo e definir a estrutura da página. As tags geralmente vêm em pares, com uma tag de abertura e uma tag de fechamento.

```html
<p>Este é um parágrafo.</p>
```

## Espaços e Quebras de Linha

No HTML, vários espaços e quebras de linha no código-fonte são tratados como um único espaço no navegador. Para criar quebras de linha visíveis, você pode usar a tag `<br>`.

```html
<p>Este é um parágrafo com uma <br> quebra de linha.</p>
```

## Fluxo HTML

O fluxo HTML refere-se à ordem em que os elementos são renderizados na página. Por padrão, os elementos de bloco (como `<div>` e `<p>`) ocupam toda a largura disponível e são empilhados verticalmente, enquanto os elementos embutidos (como `<span>` e `<a>`) ocupam apenas o espaço necessário e são renderizados na mesma linha.

## Aninhamento de Tags

As tags HTML podem ser aninhadas umas dentro das outras para criar estruturas mais complexas. É importante fechar as tags na ordem inversa em que foram abertas para manter o código válido.

```html
<div>
    <p>Este é um <strong>texto importante</strong> aninhado.</p>
</div>
```

## Caracteres Reservados

Alguns caracteres são reservados em HTML e precisam ser representados por entidades de caracteres para serem exibidos corretamente.

| Caractere | Entidade | Descrição |
| :--- | :--- | :--- |
| `<` | `&lt;` | Menor que |
| `>` | `&gt;` | Maior que |
| `&` | `&amp;` | E comercial |
| `"` | `&quot;` | Aspas duplas |
| `'` | `&apos;` | Aspas simples |
