# Elementos Estruturais e de Mídia em HTML

## Elementos Estruturais Semânticos

HTML5 introduziu novos elementos para definir diferentes partes de uma página web, tornando o código mais legível e acessível.

- `<header>`: Define o cabeçalho de uma página ou seção. Geralmente contém o logotipo, título e navegação.
- `<footer>`: Define o rodapé, contendo informações de autor, direitos autorais e links relacionados.
- `<nav>`: Usado para agrupar links de navegação.
- `<main>`: Especifica o conteúdo principal e único de um documento.
- `<section>`: Representa uma seção genérica de um documento, geralmente com um título.
- `<article>`: Define um conteúdo independente e autocontido, como um post de blog ou notícia.
- `<aside>`: Para conteúdo lateralmente relacionado ao conteúdo principal (como uma barra lateral).

## Elementos de Mídia

HTML permite incorporar conteúdo de mídia diretamente em suas páginas.

### Áudio

A tag `<audio>` é usada para incorporar sons.

- `src`: O caminho para o arquivo de áudio.
- `controls`: Exibe os controles padrão de áudio (play, pause, volume).

```html
<audio controls src="caminho/para/audio.mp3">
  Seu navegador não suporta o elemento de áudio.
</audio>
```

### Vídeo

A tag `<video>` é usada para incorporar vídeos.

- `src`: O caminho para o arquivo de vídeo.
- `controls`: Exibe os controles padrão de vídeo.
- `width` e `height`: Definem as dimensões do player.

```html
<video controls width="320" height="240" src="caminho/para/video.mp4">
  Seu navegador não suporta o elemento de vídeo.
</video>
```
