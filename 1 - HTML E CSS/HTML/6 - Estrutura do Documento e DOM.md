# Estrutura do Documento e DOM

## Estrutura Básica de um Documento HTML

Todo documento HTML segue uma estrutura padrão para ser corretamente interpretado pelos navegadores.

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Título da Página</title>
</head>
<body>
    <!-- O conteúdo visível da página vai aqui -->
</body>
</html>
```

- `<!DOCTYPE html>`: Define o tipo de documento como HTML5. É a primeira coisa em seu documento.
- `<html>`: O elemento raiz que envolve todo o conteúdo da página.
- `<head>`: Contém metadados sobre o documento, como o título, codificação de caracteres e links para folhas de estilo.
    - `<meta charset="UTF-8">`: Especifica a codificação de caracteres do documento, essencial para exibir corretamente todos os tipos de caracteres.
    - `<title>`: Define o título da página, que aparece na aba do navegador.
- `<body>`: Contém todo o conteúdo visível da página, como textos, imagens, links e vídeos.

## O DOM (Document Object Model)

Quando um navegador carrega uma página HTML, ele cria uma representação da página na memória chamada **Document Object Model (DOM)**.

O DOM representa o documento como uma **árvore de objetos**, onde cada elemento, atributo e texto do HTML é um "nó" (node) nessa árvore.

- **Documento:** A página inteira.
- **Elemento:** Uma tag HTML (ex: `<body>`, `<p>`).
- **Texto:** O conteúdo dentro de um elemento.
- **Atributo:** Um valor dentro de uma tag (ex: `href` na tag `<a>`).

Essa estrutura em árvore permite que linguagens de script, como o JavaScript, acessem e manipulem dinamicamente o conteúdo, a estrutura e o estilo de um documento.

Por exemplo, com JavaScript, você pode usar o DOM para:

- Mudar um texto.
- Adicionar ou remover um elemento.
- Alterar o estilo de um elemento (cores, fontes, etc.).

Entender o DOM é o primeiro passo para criar páginas web dinâmicas e interativas.
