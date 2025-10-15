# 7 - Caminhos em HTML e CSS (Front-end)

No front-end (HTML, CSS e JavaScript do navegador), os caminhos para recursos como imagens, folhas de estilo e outros arquivos são interpretados pelo **navegador**.

O ponto de referência principal é a **URL** na barra de endereços.

## 1. Caminho Relativo

É o tipo mais comum. O caminho é relativo ao **arquivo atual**.

Imagine a estrutura:
```
/index.html
/css/style.css
/imagens/logo.png
/paginas/sobre.html
```

- **Dentro de `index.html`:**
  - Para pegar a folha de estilo: `<link href="./css/style.css">`
  - Para mostrar a imagem: `<img src="./imagens/logo.png">`
  - O `./` é opcional, `<img src="imagens/logo.png">` funciona igual.

- **Dentro de `sobre.html` (que está na pasta `paginas`):**
  - Para pegar a mesma folha de estilo, você precisa "subir" um nível: `<link href="../css/style.css">`

## 2. Caminho Relativo à Raiz

Se um caminho começa com uma barra (`/`), ele é relativo à **raiz do seu site (domínio)**. Isso é muito útil para recursos compartilhados em todo o site.

- Não importa em qual página você esteja (`index.html` ou `sobre.html`), o caminho abaixo sempre funcionará e apontará para o mesmo lugar:
  - `<img src="/imagens/logo.png">` (O navegador buscará `http://www.seusite.com/imagens/logo.png`)
  - `<a href="/paginas/sobre.html">Sobre</a>`

## 3. Caminho Absoluto

No contexto do front-end, um caminho absoluto é uma **URL completa**, incluindo o protocolo (`http://` ou `https://`). É usado para carregar recursos de outros domínios.

- **Exemplos:**
  - Carregar uma fonte do Google Fonts:
    ```html
    <link href="https://fonts.googleapis.com/css2?family=Roboto">`
    ```
  - Carregar uma imagem de um CDN (Content Delivery Network):
    ```html
    <img src="https://cdn.exemplo.com/imagens/produto.jpg">`
    ```

### Resumo

| Tipo de Caminho | Começa com... | Relativo a...                               |
| --------------- | ------------- | ------------------------------------------- |
| Relativo        | `nome/` ou `../` | Localização do arquivo atual.               |
| Relativo à Raiz | `/`           | Raiz do seu site (domínio).                 |
| Absoluto        | `http://`...  | Um endereço completo na internet.           |
