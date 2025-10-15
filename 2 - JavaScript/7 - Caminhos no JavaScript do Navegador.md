# 7 - Caminhos no JavaScript do Navegador (Front-end)

Quando o JavaScript é executado no navegador (front-end), ele segue exatamente as **mesmas regras de caminho** que o HTML e o CSS. O ponto de referência continua sendo a URL na barra de endereços do navegador.

O conceito é o mesmo, mas a aplicação acontece no código JavaScript, geralmente ao manipular o DOM ou ao fazer requisições de rede.

## Exemplos Práticos

### 1. Alterando a Imagem de um Elemento

Se você quiser trocar a imagem de uma tag `<img>` dinamicamente.

```javascript
// Supondo que este script está rodando em uma página na raiz do site

const minhaImagem = document.querySelector('#logo');

// Usando um caminho relativo
minhaImagem.src = 'imagens/logo-alternativo.png';

// Usando um caminho relativo à raiz
minhaImagem.src = '/imagens/logo-alternativo.png';

// Usando um caminho absoluto (URL completa)
minhaImagem.src = 'https://outro-site.com/logo.png';
```

### 2. Fazendo Requisições com `fetch`

A API `fetch` é usada para buscar recursos em uma rede (por exemplo, dados de uma API).

```javascript
// Buscar um arquivo JSON local usando um caminho relativo
fetch('./api/dados.json')
  .then(response => response.json())
  .then(data => console.log(data));

// Buscar dados de uma API usando um caminho relativo à raiz
// (Útil se o front-end e o back-end estão no mesmo domínio)
fetch('/api/usuarios/1')
  .then(response => response.json())
  .then(user => console.log(user));

// Buscar dados de uma API externa usando um caminho absoluto (URL)
fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(response => response.json())
  .then(todo => console.log(todo));
```

### Conclusão

Não importa se o caminho está em um atributo `href` do HTML ou em uma chamada `fetch` do JavaScript. Se o código está rodando no navegador, as regras são as mesmas. A chave é sempre pensar: "Onde este recurso está localizado em relação à URL do meu site?"

Para uma revisão detalhada dos três tipos de caminho (Relativo, Relativo à Raiz e Absoluto), consulte a anotação `7 - Caminhos em HTML e CSS.md` na pasta de HTML.
