# Manipulação do DOM com JavaScript

O DOM (Document Object Model) é a representação em árvore do seu documento HTML. O JavaScript pode interagir com essa árvore para alterar a estrutura, o conteúdo e o estilo da página dinamicamente.

## 1. Selecionando Elementos

Para manipular um elemento, primeiro você precisa selecioná-lo.

- **`getElementById('id-do-elemento')`**: Seleciona um único elemento pelo seu `id`.
  ```javascript
  const titulo = document.getElementById('titulo-principal');
  ```

- **`querySelector('seletor-css')`**: O método mais versátil. Seleciona o **primeiro** elemento que corresponde a um seletor CSS.
  ```javascript
  const primeiroItem = document.querySelector('.lista-item'); // Pega o primeiro item com a classe
  const link = document.querySelector('nav ul li a'); // Pega o primeiro link dentro da lista da nav
  ```

- **`querySelectorAll('seletor-css')`**: Seleciona **todos** os elementos que correspondem a um seletor CSS e os retorna em uma lista (NodeList).
  ```javascript
  const todosOsItens = document.querySelectorAll('.lista-item');
  ```

## 2. Manipulando Conteúdo e Estilos

Uma vez que um elemento é selecionado, você pode alterar suas propriedades.

- **Alterando o Conteúdo:**
  - `textContent`: Altera o conteúdo de texto de um nó.
  - `innerHTML`: Altera o HTML interno de um elemento. **Cuidado:** pode ser inseguro se o conteúdo vier do usuário.
  ```javascript
  titulo.textContent = 'Novo Título da Página';
  ```

- **Alterando Estilos:**
  A propriedade `style` permite alterar o CSS inline de um elemento.
  ```javascript
  titulo.style.color = 'blue';
  titulo.style.backgroundColor = 'yellow'; // Propriedades com hífen (background-color) viram camelCase
  ```

- **Manipulando Classes CSS:**
  É a forma preferida de alterar estilos. Você cria as classes no seu CSS e as adiciona/remove com JavaScript.
  - `classList.add('nova-classe')`
  - `classList.remove('classe-existente')`
  - `classList.toggle('classe-liga-desliga')`
  ```javascript
  titulo.classList.add('destaque'); // Adiciona a classe .destaque
  ```

## 3. Lidando com Eventos

JavaScript pode reagir a ações do usuário, como cliques, movimentos do mouse, digitação, etc. Isso é chamado de "escuta de eventos" (event listening).

O método `addEventListener()` é a forma moderna de fazer isso.

```javascript
// 1. Seleciona o botão
const botao = document.querySelector('#meu-botao');

// 2. Define a função que será executada no evento
function aoClicar() {
  alert('Botão foi clicado!');
}

// 3. Adiciona o "escutador" que conecta o evento ('click') à função
botao.addEventListener('click', aoClicar);
```

## 4. Criando e Adicionando Elementos

Você também pode criar novos elementos do zero e adicioná-los à página.

```javascript
// 1. Cria um novo elemento <li>
const novoItem = document.createElement('li');

// 2. Define seu conteúdo
novoItem.textContent = 'Item novo';

// 3. Seleciona a lista <ul> onde queremos adicioná-lo
const lista = document.querySelector('#minha-lista');

// 4. Adiciona o novo item ao final da lista
lista.appendChild(novoItem);
```
