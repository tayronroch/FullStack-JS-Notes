# To-Do List (Lista de Tarefas)

Este projeto é uma aplicação de lista de tarefas que permite adicionar, marcar como concluída e remover tarefas, com persistência de dados utilizando o `localStorage` do navegador.

Abaixo, explicamos a lógica implementada no arquivo `main.js` passo a passo.

## 1. Seleção de Elementos

O script começa selecionando os elementos principais do DOM que serão manipulados: o input de texto, o botão de adicionar e o container onde as tarefas serão listadas.

```javascript
const inputElement = document.querySelector(".new-task-input");
const addTaskButton = document.querySelector(".new-task-button");
const tasksContainer = document.querySelector(".tasks-container");
```

## 2. Validação do Input (`validateInput`)

Uma função simples que verifica se o input não está vazio (removendo espaços em branco extras). Retorna `true` se houver texto, `false` caso contrário.

## 3. Adicionando Tarefas (`handleAddTask`)

Esta função é disparada quando o botão "Adicionar" é clicado:
1.  **Validação:** Verifica se o input é válido. Se não for, adiciona uma classe de erro visual (`error`).
2.  **Criação de Elementos:** Cria dinamicamente:
    *   Um `div` container para o item da tarefa (`task-item`).
    *   Um parágrafo `p` com o texto da tarefa.
    *   Um ícone `i` (Font Awesome) para a função de deletar.
3.  **Event Listeners:** Adiciona eventos de clique:
    *   No texto da tarefa: para alternar o status de concluído (`handleClick`).
    *   No ícone de lixeira: para remover a tarefa (`handleDeleteClick`).
4.  **Inserção:** Adiciona os elementos criados ao container de tarefas na página.
5.  **Persistência:** Chama `updateLocalStorage()` para salvar a nova lista.

## 4. Marcando como Concluída (`handleClick`)

Ao clicar no texto de uma tarefa:
1.  A função percorre as tarefas existentes.
2.  Verifica qual tarefa foi clicada (`isSameNode`).
3.  Alterna a classe CSS `completed` (toggle), que aplica o estilo de "tachado" (riscado) no texto.
4.  Atualiza o `localStorage`.

## 5. Removendo Tarefas (`handleDeleteClick`)

Ao clicar no ícone de lixeira:
1.  A função identifica o item correspondente.
2.  Remove o container da tarefa (`taskItemContainer.remove()`) do DOM.
3.  Atualiza o `localStorage`.

## 6. Persistência de Dados (`updateLocalStorage` e `refreshTasksUsingLocalStorage`)

Para que os dados não se percam ao recarregar a página:
*   **updateLocalStorage:** Lê todas as tarefas atuais na tela, cria um array de objetos contendo a descrição e o status (`isCompleted`), e salva no `localStorage` do navegador como uma string JSON.
*   **refreshTasksUsingLocalStorage:** Ao carregar a página, esta função lê o `localStorage`. Se houver tarefas salvas, ela recria os elementos HTML para cada uma delas, restaurando o estado visual (texto e se está concluída ou não).

## 7. Monitoramento de Input (`handleInputChange`)

Monitora mudanças no input para remover a classe de erro (`error`) assim que o usuário digita algo válido, melhorando a experiência de uso.
