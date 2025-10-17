# Manipulação do DOM com JavaScript

O **DOM (Document Object Model)** é uma interface de programação para documentos HTML e XML. Ele representa a estrutura do documento como uma árvore de objetos, onde cada nó corresponde a uma parte do documento (como elementos, atributos e texto). O JavaScript pode interagir com essa árvore para alterar dinamicamente a estrutura, o conteúdo e o estilo da página.

## A Árvore DOM

Quando o navegador carrega um documento HTML, ele cria um modelo do documento na memória. Essa representação é a árvore DOM. Cada tag HTML se torna um **nó de elemento**, o texto dentro das tags se torna um **nó de texto**, e os atributos das tags se tornam **nós de atributo**.

### Visualização da Árvore DOM

Imagine um documento HTML simples:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Minha Página</title>
  </head>
  <body>
    <h1>Título Principal</h1>
    <p>Um parágrafo com um <a href="#">link</a>.</p>
  </body>
</html>
```

A árvore DOM correspondente seria algo assim:

```
               [document]
                   |
                [html]
                   |
      +------------+-------------+
      |                          |
    [head]                     [body]
      |                          |
      +--------+                 +-----------------+
      |        |                 |                 |
  [#text]    [title]           [#text]             [h1]            [p]
             |                                     |               |
           [#text "Minha Página"]                [#text "Título"]   [#text "Um parágrafo com um "]
                                                                     |
                                                                    [a href="#"]
                                                                     |
                                                                   [#text "link"]
                                                                     |
                                                                   [#text "."]

```

- **`document`**: O nó raiz de toda a árvore.
- **`<html>`**: O elemento raiz do documento.
- **`head`** e **`body`**: Filhos diretos de `<html>`.
- **`#text`**: Nós de texto, que contêm o conteúdo textual. Espaços em branco e quebras de linha também podem ser nós de texto.

## Navegando na Árvore DOM

Você pode navegar pela árvore usando as propriedades de relacionamento dos nós:

- `parentNode`: Acessa o nó pai de um elemento.
- `childNodes`: Retorna uma `NodeList` (lista de nós) com todos os filhos de um elemento, incluindo nós de texto e comentários.
- `children`: Retorna uma `HTMLCollection` com apenas os filhos que são elementos (ignora texto e comentários). É geralmente mais prático de usar.
- `firstChild`: O primeiro nó filho (pode ser um nó de texto).
- `lastChild`: O último nó filho (pode ser um nó de texto).
- `firstElementChild`: O primeiro filho que é um elemento.
- `lastElementChild`: O último filho que é um elemento.
- `nextSibling`: O próximo nó no mesmo nível da árvore (pode ser um nó de texto).
- `previousSibling`: O nó anterior no mesmo nível da árvore (pode ser um nó de texto).
- `nextElementSibling`: O próximo elemento no mesmo nível.
- `previousElementSibling`: O elemento anterior no mesmo nível.

## 1. Selecionando Elementos

Para manipular um elemento, primeiro você precisa selecioná-lo. Existem métodos modernos e legados para isso.

### Métodos Modernos (Recomendado)

- **`querySelector('seletor-css')`**: Este é um dos métodos mais poderosos e versáteis para selecionar um elemento. Ele utiliza a mesma sintaxe de seletores que você usa no CSS para encontrar o **primeiro** elemento no documento que corresponde ao seletor especificado. Se nenhum elemento for encontrado, ele retorna `null`.

  A grande vantagem é poder usar seletores complexos que você já conhece do CSS.

  **Exemplos de Seletores:**

  - **Por Classe:** Seleciona o primeiro elemento com a classe `destaque`.

    ```javascript
    const itemDestaque = document.querySelector(".destaque");
    ```

  - **Por ID:** Equivalente a `getElementById`, mas usando a sintaxe de seletor CSS.

    ```javascript
    const cabecalho = document.querySelector("#cabecalho-principal");
    ```

  - **Por Tag e Classe:** Seleciona o primeiro parágrafo (`<p>`) que também tem a classe `introducao`.

    ```javascript
    const pIntro = document.querySelector("p.introducao");
    ```

  - **Seletor de Descendente:** Seleciona o primeiro link (`<a>`) que está dentro de um `<li>`.

    ```javascript
    const primeiroLinkNaLista = document.querySelector("li a");
    ```

  - **Seletor de Filho Direto:** Seleciona o primeiro `<li>` que é filho direto de uma `<ul>` com o id `minha-lista`.

    ```javascript
    const primeiroFilho = document.querySelector("ul#minha-lista > li");
    ```

  - **Seletor de Atributo:** Seleciona o primeiro input do tipo `submit`.

    ```javascript
    const botaoEnviar = document.querySelector('input[type="submit"]');
    ```

  - **Combinações Complexas:** Seleciona o primeiro `<span>` dentro de um `div` com a classe `info` que está dentro de um elemento com o id `container`.
    ```javascript
    const infoSpan = document.querySelector("#container .info span");
    ```

  **Importante:** Lembre-se que `querySelector` para e retorna assim que encontra o primeiro elemento que satisfaz a busca. Se você precisar de todos os elementos, use `querySelectorAll`.

- **`querySelectorAll('seletor-css')`**: Seleciona **todos** os elementos que correspondem a um seletor CSS e os retorna em uma `NodeList`.

  ```javascript
  const todosOsItens = document.querySelectorAll(".lista-item");

  // Você pode iterar sobre a NodeList com forEach
  todosOsItens.forEach((item) => {
    console.log(item);
  });
  ```

### Métodos Legados

- **`getElementById('id-do-elemento')`**: Seleciona um único elemento pelo seu `id`. É muito rápido e ainda útil.

  ```javascript
  const titulo = document.getElementById("titulo-principal");
  ```

- **`getElementsByTagName('nome-da-tag')`**: Seleciona todos os elementos com a tag especificada e os retorna em uma `HTMLCollection`.

  ```javascript
  const todosOsLinks = document.getElementsByTagName("a");
  ```

- **`getElementsByClassName('nome-da-classe')`**: Seleciona todos os elementos que contêm a classe especificada e os retorna em uma `HTMLCollection`.
  ```javascript
  const todosOsItens = document.getElementsByClassName("lista-item");
  ```

### `NodeList` vs. `HTMLCollection`

É importante entender a diferença entre os objetos retornados por `querySelectorAll` (`NodeList`) e os métodos legados (`HTMLCollection`).

- **`HTMLCollection`** (retornado por `getElementsByTagName` e `getElementsByClassName`):

  - É uma coleção **viva (live)**. Se um elemento for adicionado ou removido do DOM, a coleção é atualizada automaticamente.
  - Não possui o método `forEach`. Você precisa convertê-la para um Array para usar `forEach` (ex: `Array.from(collection)`).

- **`NodeList`** (retornado por `querySelectorAll`):
  - É uma coleção **estática (static)**. Ela é um retrato do DOM no momento em que foi criada e não reflete alterações posteriores.
  - Possui o método `forEach`, o que a torna mais fácil de iterar.

Na maioria dos casos, `querySelector` e `querySelectorAll` são preferíveis por sua versatilidade com seletores CSS e pelo comportamento previsível da `NodeList` estática.

## 2. Manipulando Conteúdo e Estilos

Uma vez que um elemento é selecionado, você pode alterar suas propriedades.

- **Alterando o Conteúdo:** Existem três propriedades principais para alterar o conteúdo de um elemento. A escolha de qual usar depende da sua necessidade.

  - `textContent`: Esta propriedade obtém ou define o conteúdo de texto de um nó e de todos os seus descendentes.

    - **Segurança:** É a opção mais segura, pois ela trata todo o conteúdo como texto puro. Qualquer tag HTML passada para `textContent` será renderizada como texto literal na tela, não interpretada pelo navegador. Isso previne ataques de Cross-Site Scripting (XSS).
    - **Performance:** Geralmente é a mais rápida, pois não precisa analisar HTML.

    ```javascript
    const paragrafo = document.querySelector("#meu-paragrafo");

    // Obtendo o texto
    console.log(paragrafo.textContent);

    // Definindo o texto (qualquer HTML aqui será tratado como texto)
    paragrafo.textContent = "Este é um <strong>texto</strong> seguro.";
    // Na tela, aparecerá literalmente: Este é um <strong>texto</strong> seguro.
    ```

  - `innerText`: Similar ao `textContent`, mas com algumas diferenças importantes:

    - **Consciência do Estilo:** `innerText` leva em conta o estilo CSS. Ele não retornará o texto de elementos que estão ocultos (por exemplo, com `display: none`).
    - **Performance:** É mais lento que `textContent` porque precisa fazer cálculos de layout para saber o que está visível.
    - **Formatação:** Ao ler, `innerText` tenta preservar a formatação visual (como quebras de linha).

    ```javascript
    // Se um <span> dentro do parágrafo estiver com display: none,
    // seu texto não aparecerá no console.log.
    console.log(paragrafo.innerText);
    ```

    Geralmente, `textContent` é preferível a `innerText` a menos que você precise especificamente do texto como ele é renderizado visualmente para o usuário.

  - `innerHTML`: Esta propriedade obtém ou define o conteúdo HTML dentro de um elemento.

    - **Funcionalidade:** Ao contrário de `textContent`, o `innerHTML` interpreta a string que você passa como HTML, criando nós do DOM a partir dela. Isso permite adicionar novos elementos, não apenas texto.
    - **RISCO DE SEGURANÇA (XSS):** Esta é a sua principal desvantagem. Se você usar `innerHTML` para inserir conteúdo que venha de uma fonte externa ou do usuário (como um campo de formulário), você pode acidentalmente introduzir scripts maliciosos na sua página. Um atacante poderia injetar uma tag `<script>` que rouba informações do usuário.

    ```javascript
    const divConteudo = document.querySelector("#conteudo");

    // Definindo o conteúdo com HTML
    // O navegador vai criar um h2 e um p dentro da div.
    divConteudo.innerHTML =
      "<h2>Novo Título</h2><p>Este parágrafo foi criado via innerHTML.</p>";

    // Exemplo de uso INSEGURO:
    const userInput = '<img src="x" onerror="alert(\'XSS Attack!\')">';
    // Se userInput viesse de um formulário, o script no onerror seria executado.
    divConteudo.innerHTML = userInput; // NÃO FAÇA ISSO!
    ```

    **Regra de ouro:** Use `innerHTML` apenas quando você precisar inserir HTML e o conteúdo for de uma fonte 100% confiável ou tiver sido devidamente "sanitizado" (processado para remover scripts perigosos). Para inserir apenas texto, **sempre** prefira `textContent`.

### Manipulando Atributos

Atributos são as informações extras que você coloca em uma tag HTML, como `href` em um `<a>` ou `src` em uma `<img>`. JavaScript oferece várias maneiras de ler, definir e remover esses atributos.

#### Atributos vs. Propriedades

Primeiro, é crucial entender a diferença entre um **atributo** e uma **propriedade**:

- **Atributo:** É o que está escrito no código HTML (`<input type="text" value="Olá">`). É uma string.
- **Propriedade:** É o que está no objeto do DOM, na memória. (`meuInput.value`). O tipo pode variar (string, booleano, etc.).

Na maioria das vezes, o navegador sincroniza atributos e propriedades. Se você alterar a propriedade `id` de um elemento em JS, o atributo `id` no HTML (se você inspecionar o elemento) também mudará.

Porém, isso **não acontece sempre**:

- O atributo `value` de um input reflete o valor _inicial_. A propriedade `value` reflete o valor _atual_ que o usuário digitou.
- Atributos customizados (não padrão) não se tornam propriedades do elemento.

#### Métodos Padrão: `get`, `set`, `has`, `remove`

Estes métodos trabalham diretamente com os atributos HTML e são a forma mais explícita e segura de manipulá-los.

- `elemento.getAttribute('nome-do-atributo')`: Retorna o valor do atributo como uma string. Se o atributo não existir, retorna `null`.

- `elemento.setAttribute('nome-do-atributo', 'valor')`: Define um novo valor para um atributo. Se o atributo não existir, ele é criado.

- `elemento.hasAttribute('nome-do-atributo')`: Retorna `true` se o elemento possuir o atributo, caso contrário, `false`.

- `elemento.removeAttribute('nome-do-atributo')`: Remove completamente um atributo de um elemento.

**Exemplo prático:**

```javascript
const link = document.querySelector("#meu-link");

// 1. Lendo atributos
console.log(link.getAttribute("href")); // ex: './pagina.html'
console.log(link.getAttribute("id")); // ex: 'meu-link'

// 2. Verificando se um atributo existe
if (link.hasAttribute("target")) {
  console.log("O link já tem um alvo.");
} else {
  console.log("O link não tem um alvo, vamos adicionar um.");
  // 3. Definindo um atributo
  link.setAttribute("target", "_blank"); // Faz o link abrir em uma nova aba
}

// 4. Adicionando um atributo que não é padrão
link.setAttribute("data-info", "Este é um link importante");

// 5. Removendo um atributo
link.removeAttribute("title");
```

#### Acesso Direto via Propriedades

Para os atributos mais comuns e padrão (como `id`, `src`, `href`, `className`, `title`), você pode acessá-los diretamente como propriedades do objeto do elemento.

```javascript
const imagem = document.querySelector("#minha-imagem");

// Lendo a propriedade 'src'
console.log(imagem.src); // Retorna a URL completa (ex: 'http://site.com/imagem.png')

// Alterando a propriedade 'src'
imagem.src = "nova-imagem.jpg";

// Lendo e definindo o 'id'
console.log(imagem.id); // 'minha-imagem'
imagem.id = "imagem-principal";
```

**Quando usar qual?**

- Use **propriedades diretas** (`.id`, `.src`) para atributos padrão. É mais rápido e o código fica mais limpo.
- Use **`getAttribute` e `setAttribute`** quando precisar do valor exato como está no HTML, ou ao trabalhar com atributos customizados (não-padrão).

#### Atributos `data-*` e a Propriedade `dataset`

Para armazenar dados extras em um elemento sem criar atributos não-padrão, o HTML5 introduziu os atributos `data-*`.

```html
<div
  id="usuario"
  data-id="123"
  data-nome-usuario="ana"
  data-status-conta="ativa"
>
  Ana
</div>
```

JavaScript fornece uma propriedade especial e muito conveniente para acessá-los: `dataset`.

- O `dataset` é um objeto que mapeia todos os atributos `data-*` de um elemento.
- Os nomes dos atributos são convertidos para `camelCase`. (ex: `data-nome-usuario` vira `dataset.nomeUsuario`).

```javascript
const userDiv = document.querySelector("#usuario");

// Lendo dados
const userId = userDiv.dataset.id; // "123"
const userName = userDiv.dataset.nomeUsuario; // "ana"
const userStatus = userDiv.dataset.statusConta; // "ativa"

console.log(
  `Usuário ${userName} (ID: ${userId}) está com a conta ${userStatus}.`
);

// Modificando dados
userDiv.dataset.statusConta = "inativa"; // Altera o atributo para data-status-conta="inativa"

// Adicionando um novo data attribute via JS
userDiv.dataset.ultimaVisita = "2023-10-27"; // Cria o atributo data-ultima-visita="..."
```

Usar `dataset` é a maneira moderna e recomendada de trabalhar com dados customizados em elementos.

- **Alterando Atributos:**
  - `getAttribute('atributo')`: Pega o valor de um atributo.
  - `setAttribute('atributo', 'valor')`: Define ou altera o valor de um atributo.
  - `removeAttribute('atributo')`: Remove um atributo.
  ```javascript
  const link = document.querySelector("a");
  link.setAttribute("href", "https://www.google.com");
  ```

### Alterando Estilos: Inline vs. Classes

Existem duas maneiras principais de alterar o estilo de um elemento com JavaScript. A abordagem de usar classes CSS é quase sempre a melhor prática.

#### 1. Alterando Estilos Inline (Propriedade `style`)

Todo elemento do DOM possui uma propriedade `style` que corresponde aos estilos inline do elemento (o que seria definido no atributo `style="..."` no HTML). Você pode usar esta propriedade para definir estilos diretamente.

- **Como funciona:** Você acessa a propriedade `style` e, em seguida, uma propriedade CSS. As propriedades CSS que contêm hífen (como `background-color`) são convertidas para `camelCase` em JavaScript (ex: `backgroundColor`).

  ```javascript
  const titulo = document.querySelector("#titulo-principal");

  // Alterando a cor do texto para azul
  titulo.style.color = "blue";

  // Alterando a cor de fundo para amarelo
  titulo.style.backgroundColor = "yellow";

  // Alterando o tamanho da fonte
  titulo.style.fontSize = "24px";
  ```

- **Vantagens:**

  - Rápido e direto para alterações simples e dinâmicas (ex: mover um elemento com base na posição do mouse).

- **Desvantagens:**
  - **Baixa Manutenibilidade:** Mistura lógica de estilo (CSS) com a lógica de comportamento (JavaScript), tornando o código mais difícil de ler e manter.
  - **Não é Escalável:** As alterações se aplicam apenas a um elemento de cada vez. Se você precisar estilizar vários elementos da mesma forma, terá que iterar e aplicar o estilo a cada um.
  - **Alta Especificidade:** Estilos inline têm alta especificidade no CSS, o que pode tornar difícil sobrescrevê-los com regras de uma folha de estilo externa, causando confusão.
  - **Não é possível ler estilos de folhas de estilo externas:** A propriedade `style` só "enxerga" os estilos que foram definidos inline. Ela não consegue ler os estilos aplicados a um elemento por meio de um arquivo `.css`. Para isso, você precisaria usar `window.getComputedStyle(elemento)`.

#### 2. Manipulando Classes CSS (Propriedade `classList`) - **Método Recomendado**

A maneira preferida e mais organizada de alterar estilos é criar classes no seu arquivo CSS e usar JavaScript apenas para adicionar ou remover essas classes do elemento.

- **Como funciona:** Primeiro, defina os estilos em seu arquivo `.css`.

  ```css
  /* Em styles.css */
  .destaque {
    background-color: yellow;
    border: 1px solid red;
  }

  .texto-grande {
    font-size: 30px;
  }
  ```

  Depois, use a propriedade `classList` no JavaScript para gerenciar as classes. `classList` é um objeto com métodos úteis:

  - `add('nome-da-classe')`: Adiciona uma ou mais classes.
  - `remove('nome-da-classe')`: Remove uma ou mais classes.
  - `toggle('nome-da-classe')`: Adiciona a classe se ela não existir, e a remove se ela já existir. Perfeito para funcionalidades como menus, modo escuro, etc.
  - `contains('nome-da-classe')`: Retorna `true` ou `false`, verificando se o elemento possui a classe.

  ```javascript
  const titulo = document.querySelector("#titulo-principal");

  // Adicionando uma classe
  titulo.classList.add("destaque");

  // Adicionando múltiplas classes de uma vez
  titulo.classList.add("texto-grande", "outra-classe");

  // Removendo uma classe
  titulo.classList.remove("outra-classe");

  // Usando o toggle em um botão
  const botao = document.querySelector("#meu-botao");
  botao.addEventListener("click", () => {
    // A cada clique, a classe 'ativo' será adicionada ou removida do body
    document.body.classList.toggle("modo-noturno");
  });

  // Verificando se uma classe existe
  if (titulo.classList.contains("destaque")) {
    console.log("O título está em destaque!");
  }
  ```

- **Vantagens:**
  - **Separação de Responsabilidades:** Mantém seu CSS nos arquivos `.css` e seu JavaScript focado no comportamento e na lógica.
  - **Manutenibilidade:** É muito mais fácil atualizar os estilos no arquivo CSS do que procurar por eles no meio do código JavaScript.
  - **Reutilização e Escalabilidade:** Uma única classe pode ser aplicada a inúmeros elementos, e você pode alterar o estilo de todos eles de uma vez, apenas modificando a regra CSS.
  - **Performance:** O navegador é altamente otimizado para aplicar estilos a partir de classes CSS.

**Conclusão:** Use a propriedade `style` para casos muito específicos e dinâmicos. Para todo o resto, dê preferência total ao uso de `classList` para gerenciar suas classes CSS.

## 3. Criando, Adicionando e Removendo Elementos

Além de modificar elementos existentes, uma das tarefas mais comuns na manipulação do DOM é criar elementos do zero e inseri-los dinamicamente na página.

### O Processo Completo: Criar, Configurar, Inserir

O fluxo de trabalho geral é sempre o mesmo:

1.  **Criar o elemento:** Use `document.createElement('tag')`. Isso cria um nó de elemento na memória, mas ele ainda não está na página.
2.  **Configurar o elemento:** Adicione conteúdo, classes, atributos e estilos ao novo elemento.
3.  **Inserir o elemento no DOM:** Escolha um elemento "pai" que já está na página e anexe o novo elemento a ele.

#### Exemplo Passo a Passo:

Vamos supor que temos uma lista `<ul>` no nosso HTML e queremos adicionar um novo item `<li>` a ela.

```html
<ul id="minha-lista">
  <li>Item 1</li>
</ul>
```

```javascript
// --- PASSO 1: CRIAR O ELEMENTO ---
// Cria um elemento <li>, mas ele ainda está "solto" na memória.
const novoItem = document.createElement("li");

// --- PASSO 2: CONFIGURAR O ELEMENTO ---
// Adiciona conteúdo de texto. Use textContent por segurança.
novoItem.textContent = "Item 2 (criado via JS)";

// Adiciona uma classe para estilização.
novoItem.classList.add("item-lista");

// Adiciona um atributo, como 'id'.
novoItem.id = "novo-item";

// Você também pode usar setAttribute para outros atributos.
novoItem.setAttribute("data-info", "item-dinamico");

// --- PASSO 3: INSERIR O ELEMENTO NO DOM ---
// Primeiro, selecionamos o elemento "pai" onde queremos inserir o novo item.
const lista = document.querySelector("#minha-lista");

// Agora, inserimos o novoItem dentro da lista.
// appendChild() é o método clássico para adicionar ao final.
lista.appendChild(novoItem);
```

Após a execução deste código, o DOM será atualizado e o HTML na página será equivalente a:

```html
<ul id="minha-lista">
  <li>Item 1</li>
  <li class="item-lista" id="novo-item" data-info="item-dinamico">
    Item 2 (criado via JS)
  </li>
</ul>
```

### Métodos de Inserção: Onde colocar o novo elemento?

Existem vários métodos para controlar exatamente onde um novo elemento é inserido.

#### Métodos Clássicos:

- `pai.appendChild(filho)`: Adiciona `filho` como o **último** descendente do elemento `pai`. (Como no exemplo acima).
- `pai.insertBefore(novoElemento, elementoDeReferencia)`: Insere `novoElemento` dentro de `pai`, mas posicionado logo **antes** do `elementoDeReferencia`.

  ```javascript
  const primeiroItem = lista.querySelector("li"); // Pega o 'Item 1'
  const outroItem = document.createElement("li");
  outroItem.textContent = "Item 0";

  // Insere 'Item 0' antes de 'Item 1'
  lista.insertBefore(outroItem, primeiroItem);
  ```

#### Métodos Modernos (Mais Flexíveis):

Os métodos mais recentes são ainda mais intuitivos e poderosos.

- `elemento.append(...elementos)`: Pode adicionar um ou mais elementos ou strings de texto no **final** do `elemento`.
- `elemento.prepend(...elementos)`: Pode adicionar um ou mais elementos ou strings de texto no **início** do `elemento`.
- `elemento.before(...elementos)`: Insere um ou mais elementos **antes** do próprio `elemento` (como um irmão anterior).
- `elemento.after(...elementos)`: Insere um ou mais elementos **depois** do próprio `elemento` (como um irmão posterior).

```javascript
const lista = document.querySelector('#minha-lista');
const novoItemFinal = document.createElement('li');
novoItemFinal.textContent = 'Último item';

// Adiciona ao final da lista (similar a appendChild)
lista.append(novoItemFinal, ' (texto adicionado também!)');

const novoItemInicio = document.createElement('li');
novoItemInicio.textContent = 'Primeiro item';

// Adiciona no início da lista
lista.prepend(novoItemInicio);

const titulo = document.createElement('h2');
-titulo.textContent = 'Minha Lista de Compras';

// Insere o título ANTES da lista inteira
lista.before(titulo);
```

### Removendo Elementos

Remover elementos também é uma tarefa simples.

- `elemento.remove()`: O método moderno e mais simples. Basta chamar no próprio elemento que você quer remover.

  ```javascript
  const itemParaRemover = document.querySelector("#novo-item");
  if (itemParaRemover) {
    itemParaRemover.remove(); // Adeus, elemento!
  }
  ```

- `pai.removeChild(filho)`: O método clássico. Você precisa ter uma referência ao elemento pai e ao filho que será removido.

  ```javascript
  const lista = document.querySelector("#minha-lista");
  const itemParaRemover = document.querySelector("#novo-item");
  if (lista && itemParaRemover) {
    lista.removeChild(itemParaRemover);
  }
  ```

Como pode ver, `elemento.remove()` é muito mais direto e é a abordagem recomendada hoje em dia.

## 4. Lidando com Eventos (Event Handling)

Eventos são ações que acontecem na página web e para as quais você pode criar uma resposta. O JavaScript permite "escutar" (listen for) esses eventos e executar uma função quando eles ocorrem. Isso é o que torna as páginas interativas.

### O Método `addEventListener()`

O método `addEventListener()` é a forma moderna e preferida de registrar um "escutador de eventos" em um elemento. Ele é flexível porque permite adicionar múltiplas funções para o mesmo evento.

**Sintaxe:** `elemento.addEventListener(tipoDeEvento, funcaoCallback, opcoes);`

- `tipoDeEvento`: Uma string com o nome do evento (ex: `'click'`, `'keydown'`, `'submit'`).
- `funcaoCallback`: A função que será executada quando o evento ocorrer. Essa função recebe automaticamente um objeto `event` como seu primeiro argumento.
- `opcoes` (Opcional): Um objeto que especifica características sobre o listener. A mais comum é `capture` (veja abaixo).

```javascript
// 1. Seleciona o botão
const botao = document.querySelector("#meu-botao");

// 2. Define a função (callback) que será executada no evento
function aoClicar(event) {
  // O objeto 'event' contém informações valiosas sobre a interação.
  console.log("O evento que ocorreu foi:", event.type); // ex: 'click'
  alert("Botão foi clicado!");
}

// 3. Adiciona o "escutador" que conecta o evento ('click') à função
botao.addEventListener("click", aoClicar);
```

### O Objeto `event`

Quando um evento é disparado, o navegador passa um objeto `event` para a função de callback. Este objeto contém informações cruciais sobre o evento.

- `event.target`: O elemento que **originou** o evento. É o alvo mais profundo na hierarquia DOM onde o evento ocorreu.
- `event.currentTarget`: O elemento que está **escutando** o evento (onde o `addEventListener` foi anexado).
- `event.preventDefault()`: Um método que impede o comportamento padrão do navegador para aquele evento. Essencial para controlar formulários e links.
- `event.stopPropagation()`: Impede que o evento se propague para os elementos pais (veja Event Bubbling abaixo).

**Exemplo com `preventDefault`:**

```javascript
const form = document.querySelector("#meu-form");

form.addEventListener("submit", function (event) {
  // Impede que o formulário seja enviado da maneira tradicional (recarregando a página).
  event.preventDefault();

  console.log(
    "Formulário não foi enviado! Podemos processar os dados com JS agora."
  );
});
```

### O Fluxo de Eventos: Bubbling e Capturing

Quando um evento ocorre em um elemento, ele não acontece apenas naquele elemento. Ele passa por uma jornada em três fases:

1.  **Fase de Captura (Capturing Phase):** O evento "desce" da raiz do documento (`window` -> `document` -> `<body>`...) até o elemento alvo (`event.target`).
2.  **Fase de Alvo (Target Phase):** O evento chega ao `event.target`.
3.  **Fase de Borbulhamento (Bubbling Phase):** O evento "sobe" de volta do `event.target` até a raiz do documento. Este é o comportamento padrão.

Por padrão, os listeners em JavaScript rodam na fase de **Bubbling**. Você pode, opcionalmente, fazê-los rodar na fase de Captura definindo a terceira opção do `addEventListener` como `true` ou `{ capture: true }`.

### Delegação de Eventos (Event Delegation)

Event Delegation é um padrão poderoso e eficiente. Em vez de adicionar um listener para cada um de vários elementos filhos, você adiciona **um único listener** a um elemento pai.

Dentro da função de callback, você usa `event.target` para descobrir qual elemento filho originou o evento.

**Por que usar Event Delegation?**

- **Performance:** Menos listeners de evento na página significa menos consumo de memória.
- **Elementos Dinâmicos:** Se novos elementos filhos são adicionados à lista (ex: via JS), você não precisa adicionar novos listeners a eles. O listener no pai funcionará para eles automaticamente.

**Exemplo Prático:**

Imagine uma lista `<ul>` onde queremos saber qual `<li>` foi clicado.

```html
<ul id="lista-delegacao">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
```

```javascript
const lista = document.querySelector("#lista-delegacao");

lista.addEventListener("click", function (event) {
  // Verificamos se o alvo (event.target) do clique foi um elemento LI.
  // A propriedade tagName sempre retorna em maiúsculas.
  if (event.target.tagName === "LI") {
    console.log("Você clicou no texto:", event.target.textContent);
  }
});

// Agora, se adicionarmos um novo item, ele também funcionará!
const novoItem = document.createElement("li");
novoItem.textContent = "Item 4 (dinâmico)";
lista.append(novoItem);
```

### Removendo Event Listeners

Para remover um listener, você usa o método `removeEventListener()`. É crucial que você passe a **mesma função** que foi usada no `addEventListener`. Por isso, não funciona com funções anônimas.

```javascript
const botao = document.querySelector("#meu-botao");

// A função precisa ter um nome para ser referenciada depois.
function lidarComClique() {
  alert("Este alerta só aparece uma vez!");
  // Remove o listener de dentro dele mesmo.
  botao.removeEventListener("click", lidarComClique);
}

botao.addEventListener("click", lidarComClique);
```

### Tipos Comuns de Eventos:

- **Mouse**: `click`, `dblclick`, `mousedown`, `mouseup`, `mouseover`, `mouseout`, `mousemove`.
- **Teclado**: `keydown`, `keyup`, `keypress`.
- **Formulário**: `submit`, `change` (para `<input>`, `<select>`, `<textarea>`), `focus`, `blur`.
- **Página**: `load` (quando a página e seus recursos terminam de carregar), `DOMContentLoaded` (quando o HTML foi carregado e o DOM está pronto, sem esperar por CSS e imagens).

### Explorando Tipos de Eventos Específicos

#### Eventos de Mouse

- `click`: Disparado quando o botão principal do mouse é pressionado e solto sobre um elemento.
- `dblclick`: Disparado com um clique duplo.
- `mousedown` / `mouseup`: Disparados quando o botão do mouse é **pressionado** (`mousedown`) e quando é **solto** (`mouseup`). Útil para ações de arrastar e soltar.
- `mouseover` / `mouseout`: Disparados quando o ponteiro do mouse **entra** (`mouseover`) ou **sai** (`mouseout`) de um elemento. **Importante:** Estes eventos borbulham (bubble) e podem ser disparados novamente se o mouse se mover para um elemento filho.
- `mouseenter` / `mouseleave`: Similares ao `mouseover`/`mouseout`, mas **não borbulham**. São disparados apenas quando o mouse entra ou sai dos limites do elemento como um todo, ignorando os filhos. São geralmente mais previsíveis.
- `mousemove`: Disparado continuamente sempre que o mouse se move sobre um elemento.

```javascript
const box = document.querySelector(".minha-caixa");
box.addEventListener("mouseenter", () => {
  box.textContent = "Você entrou na caixa!";
});
box.addEventListener("mouseleave", () => {
  box.textContent = "Você saiu da caixa!";
});
box.addEventListener("mousemove", (event) => {
  // Acessa as coordenadas X e Y do mouse relativas à página
  console.log(`Posição do mouse: X=${event.clientX}, Y=${event.clientY}`);
});
```

#### Eventos de Teclado

Normalmente associados ao `document` ou a campos de input.

- `keydown`: Disparado quando uma tecla é pressionada. Ele se repete se a tecla for mantida pressionada.
- `keyup`: Disparado quando uma tecla é solta.
- `keypress` (obsoleto): Similar ao `keydown`, mas geralmente não era disparado para teclas como `Shift`, `Ctrl`, `Alt`. **Evite usar**, prefira `keydown`.

O objeto `event` para eventos de teclado é muito útil:

- `event.key`: Retorna o valor da tecla pressionada (ex: 'a', 'Enter', 'Shift').
- `event.code`: Retorna o código físico da tecla no teclado (ex: 'KeyA', 'Enter', 'ShiftLeft'). Útil para identificar a tecla independentemente do layout do teclado.

```javascript
const input = document.querySelector("#meu-input");
input.addEventListener("keydown", (event) => {
  console.log(`Tecla pressionada: ${event.key} (Código: ${event.code})`);
  if (event.key === "Enter") {
    alert("Você pressionou Enter!");
  }
});
```

#### Eventos de Formulário: Guia Detalhado

Formulários são um dos principais pontos de interação em uma página web. Dominar seus eventos é essencial.

- **`submit`**: Este é o evento mais importante para formulários. Ele é disparado no próprio elemento `<form>` quando o usuário tenta enviá-lo (clicando em um `<button type="submit">` ou pressionando Enter em um campo de texto).

  - **Comportamento Padrão:** Enviar os dados para o servidor, o que causa um recarregamento da página.
  - **Uso em JavaScript:** Quase sempre você vai querer impedir esse comportamento padrão para processar os dados do formulário com JavaScript (enviando-os para uma API, por exemplo) sem recarregar a página. Para isso, usa-se `event.preventDefault()`.

  ```javascript
  const meuFormulario = document.querySelector("#meu-form");

  meuFormulario.addEventListener("submit", function (event) {
    // PASSO 1: Impedir o recarregamento da página
    event.preventDefault();

    // PASSO 2: Capturar os dados do formulário
    // A forma moderna é usar o objeto FormData
    const formData = new FormData(meuFormulario);

    // Você pode então converter para um objeto simples
    const dados = Object.fromEntries(formData.entries());
    console.log("Dados capturados:", dados); // ex: { nome: 'Ana', email: 'ana@exemplo.com' }

    // PASSO 3: Fazer algo com os dados (ex: enviar para uma API)
    alert(`Obrigado, ${dados.nome}! Formulário enviado.`);

    // Opcional: Limpar o formulário após o envio
    meuFormulario.reset();
  });
  ```

- **Outros Eventos do Formulário:**
  - `reset`: Disparado no elemento `<form>` quando seu botão de reset (`<button type="reset">`) é clicado. Você pode usar `event.preventDefault()` para impedir o reset.
  - `invalid`: Disparado em um campo de input quando ele falha na validação nativa do HTML5 (ex: um campo `required` está vazio, ou um `type="email"` não contém um email válido no momento do `submit`).

### Um Mergulho Profundo nos Eventos de Input

Antes de detalhar os eventos, é crucial saber como ler e definir os valores dos diferentes tipos de campos de formulário.

#### Lendo e Definindo o Valor de Inputs

A maneira de interagir com o valor de um campo muda de acordo com o seu tipo.

-   **Inputs de Texto (`text`, `password`, `email`, `<textarea>`):
    -   Use a propriedade `.value` para ler ou definir o conteúdo como uma string.

    ```javascript
    const campoNome = document.querySelector('#nome');
    // Lendo o valor
    console.log(campoNome.value);
    // Definindo um novo valor
    campoNome.value = 'João da Silva';
    ```

-   **Checkboxes (`checkbox`):
    -   Use a propriedade `.checked` (um booleano `true`/`false`) para saber se está marcado.
    -   A propriedade `.value` contém o valor enviado no formulário (definido no HTML), não o estado do checkbox.

    ```javascript
    const aceitoTermos = document.querySelector('#termos');
    // Verificando se está marcado
    if (aceitoTermos.checked) {
      console.log('O usuário aceitou os termos.');
    }
    // Marcando o checkbox via JS
    aceitoTermos.checked = true;
    ```

-   **Radio Buttons (`radio`):
    -   Como vários radios podem ter o mesmo `name`, você precisa encontrar qual deles está selecionado.
    -   A forma mais fácil é usar um seletor CSS com a pseudo-classe `:checked`.

    ```javascript
    const form = document.querySelector('#meu-form');
    // Encontra o radio button do grupo 'plano' que está selecionado
    const planoSelecionado = form.querySelector('input[name="plano"]:checked');

    if (planoSelecionado) {
      // A propriedade .value contém o valor do radio selecionado
      console.log('Plano escolhido:', planoSelecionado.value); // ex: 'premium'
    }
    
    // Para marcar um radio específico via JS
    const planoBasico = document.querySelector('#plano-basico');
    planoBasico.checked = true;
    ```

-   **Dropdowns (`<select>`):
    -   A propriedade `.value` do próprio elemento `<select>` retorna o `value` do `<option>` que está selecionado.

    ```javascript
    const seletorPais = document.querySelector('#pais');
    // Lendo o valor da opção selecionada
    const paisEscolhido = seletorPais.value;
    console.log('País selecionado:', paisEscolhido); // ex: 'BR'

    // Para selecionar uma opção via JS
    seletorPais.value = 'PT'; // Seleciona a opção que tem value="PT"
    ```

| Tipo de Input | Propriedade para Ler/Definir | Exemplo |
| :--- | :--- | :--- |
| `text`, `password`, `textarea` | `.value` (string) | `meuInput.value = 'novo texto';` |
| `checkbox` | `.checked` (boolean) | `if (meuCheckbox.checked) {...}` |
| `radio` | `.value` do radio com `:checked` | `form.querySelector('[name=grupo]:checked').value` |
| `select` | `.value` (string) | `meuSelect.value;` |


Vamos detalhar os eventos que ocorrem nos elementos de entrada de dados, como `<input>`, `<textarea>` e `<select>`.

#### O Evento `input`: O Cavalo de Batalha para Ações em Tempo Real

Este é o evento mais importante para feedback instantâneo. Ele dispara **imediatamente** sempre que o valor de um elemento é alterado. Isso inclui digitar, colar, autocompletar ou até mesmo usar reconhecimento de voz.

**Exemplo 1: Filtro de busca em tempo real**

```html
<input id="filtro-nomes" placeholder="Filtrar por nome..." />
<ul id="lista-nomes">
  <li>Ana</li>
  <li>Bruno</li>
  <li>Carla</li>
  <li>Daniel</li>
</ul>
```

```javascript
const filtro = document.querySelector("#filtro-nomes");
const lista = document.querySelector("#lista-nomes");
const itens = lista.querySelectorAll("li");

filtro.addEventListener("input", () => {
  const termoBusca = filtro.value.toLowerCase();
  itens.forEach((item) => {
    const textoItem = item.textContent.toLowerCase();
    if (textoItem.includes(termoBusca)) {
      item.style.display = "list-item";
    } else {
      item.style.display = "none";
    }
  });
});
```

**Exemplo 2: Habilitar botão com base no preenchimento**

```javascript
const campoTermos = document.querySelector("#termos");
const botaoEnviar = document.querySelector("#botao-enviar");

campoTermos.addEventListener("input", () => {
  // Habilita o botão apenas se o usuário digitar "aceito"
  botaoEnviar.disabled = campoTermos.value.toLowerCase() !== "aceito";
});
```

#### O Evento `change`: A Escolha para Ações Pós-Confirmação

O evento `change` é mais deliberado. Ele só dispara quando o usuário **confirma** a mudança de valor.

- Para campos de texto (`<input type="text">`, `<textarea>`), isso acontece quando o campo **perde o foco** (`blur`).
- Para `<select>`, checkboxes (`<input type="checkbox">`) e radio buttons (`<input type="radio">`), ele dispara imediatamente após a seleção.

**Exemplo: Validar nome de usuário após o preenchimento**

```javascript
const campoUsuario = document.querySelector("#username");

campoUsuario.addEventListener("change", () => {
  // Isso só executa quando o usuário sai do campo
  console.log("Verificando disponibilidade do nome de usuário...");
  // Aqui você faria uma chamada a uma API, por exemplo.
  // É mais eficiente do que fazer uma chamada a cada tecla digitada.
});
```

#### Eventos de Foco: `focus` e `blur`

Esses eventos são perfeitos para dar feedback visual ao usuário, indicando qual campo está ativo.

- `focus`: Dispara quando um elemento se torna o elemento ativo na página.
- `blur`: Dispara quando um elemento perde o foco.

**Exemplo: Destaque visual no campo ativo**

```javascript
const todosOsInputs = document.querySelectorAll("input");

todosOsInputs.forEach((input) => {
  input.addEventListener("focus", (event) => {
    event.target.style.backgroundColor = "#e0f7fa"; // Um azul claro
  });

  input.addEventListener("blur", (event) => {
    event.target.style.backgroundColor = ""; // Volta ao normal
  });
});
```

#### Eventos de Teclado em Inputs: `keydown` e `keyup`

Embora o evento `input` seja geralmente melhor para capturar _o que_ foi digitado, os eventos de teclado são úteis para saber _qual tecla_ foi pressionada.

**Exemplo: Enviar formulário com "Enter" ou limpar com "Escape"**

```javascript
const campoAcao = document.querySelector("#campo-acao");

campoAcao.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    // Lógica para enviar os dados
    console.log("Dados enviados!");
  } else if (event.key === "Escape") {
    // Limpa o campo
    campoAcao.value = "";
    console.log("Campo limpo.");
  }
});
```

#### Eventos de Área de Transferência: `cut`, `copy`, `paste`

Você pode interceptar ações de cortar, copiar e colar, seja para impedir a ação ou para modificar o conteúdo.

**Exemplo: Impedir que o usuário cole no campo de confirmação de senha**

```javascript
const campoConfirmaSenha = document.querySelector("#confirma-senha");

campoConfirmaSenha.addEventListener("paste", (event) => {
  event.preventDefault();
  alert(
    "Por segurança, por favor, digite sua senha novamente em vez de colar."
  );
});
```

### Tabela Comparativa Rápida

| Evento    | Quando Dispara                                            | Principal Caso de Uso                                     |
| :-------- | :-------------------------------------------------------- | :-------------------------------------------------------- |
| `input`   | Imediatamente a cada alteração de valor.                  | Feedback em tempo real (contadores, filtros, etc.).       |
| `change`  | Ao confirmar a mudança (perdendo o foco ou selecionando). | Validação final, ações após o usuário terminar a entrada. |
| `keydown` | Ao pressionar qualquer tecla.                             | Interceptar teclas específicas (Enter, Esc, setas).       |
| `focus`   | Ao entrar no campo.                                       | Feedback visual de que o campo está ativo.                |
| `blur`    | Ao sair do campo.                                         | Validação final, salvar dados, remover feedback visual.   |

#### Eventos de Página / Documento

Estes eventos são geralmente escutados no objeto `window` ou `document`.

- `DOMContentLoaded`: Disparado quando o documento HTML inicial foi completamente carregado e analisado (o DOM está pronto), sem esperar que folhas de estilo, imagens e subframes terminem de carregar. Este é o evento que você deve usar na maioria das vezes para iniciar seu código JavaScript, pois ele não precisa esperar por todos os recursos.

- `load`: Disparado no `window` depois que a página inteira carregou, **incluindo todos os recursos dependentes**, como folhas de estilo e imagens. Útil se seu código depende das dimensões de uma imagem, por exemplo.

```javascript
// MÉTODO PREFERIDO para iniciar seu script
document.addEventListener("DOMContentLoaded", () => {
  console.log("O DOM está pronto! Pode manipular os elementos.");
  // Todo o seu código principal de manipulação do DOM vai aqui.
});

// Usado em casos mais específicos
window.addEventListener("load", () => {
  console.log("A página e todos os recursos (imagens, etc.) foram carregados.");
});
```
