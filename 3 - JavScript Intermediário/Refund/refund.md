# Refund - Sistema de Reembolso

Este projeto é um sistema de controle de despesas que permite adicionar, listar e remover itens, com cálculo automático de totais e persistência de dados no navegador.

Abaixo, detalhamos a lógica do arquivo `scripts.js` bloco por bloco.

## 1. Seleção de Elementos (DOM)

Logo no início, selecionamos os elementos HTML que vamos manipular. Usamos `querySelector` para seletores CSS genéricos e `getElementById` para IDs específicos.

```javascript
// Seleciona o formulário principal
const form = document.querySelector("form");

// Seleciona os campos de entrada de dados
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

// Seleciona a lista (ul) onde os itens serão inseridos
const expenseList = document.querySelector("ul");

// Seleciona os elementos do cabeçalho da sidebar para exibir os totais
const expensesQuantity = document.querySelector("aside header p span");
const expensesTotal = document.querySelector("aside header h2");
```

## 2. Máscara de Input de Valor (`amount.oninput`)

Para garantir que o usuário digite apenas números e que o valor seja formatado corretamente enquanto digita.

```javascript
amount.oninput = () => {
  // 1. Remove qualquer caractere que NÃO seja número (0-9) usando Regex (/\D/g)
  let value = amount.value.replace(/\D/g, "");

  // 2. Limita o valor para evitar números gigantescos não tratados
  // Aqui transformamos "9000000" centavos em R$ 90.000,00 como limite
  if (value > 9000000) {
    value = "9000000";
  }

  // 3. Divide por 100 para considerar os dois últimos dígitos como centavos
  // 4. toFixed(2) garante sempre duas casas decimais
  amount.value = (value / 100).toFixed(2);
};
```

## 3. Função de Formatação (`formatCurrency`)

Uma função auxiliar que recebe um número e devolve uma string formatada como dinheiro brasileiro (R$ 1.000,00).

```javascript
function formatCurrency(value) {
  // Converte para Number e usa toLocaleString com as opções de moeda BRL
  const result = Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return result; // Ex: Retorna "R$ 10,50"
}
```

## 4. Manipulação do Envio do Formulário (`form.onsubmit`)

Ocorre quando o usuário clica no botão "Adicionar despesa".

```javascript
form.onsubmit = (event) => {
  // Impede que a página recarregue (comportamento padrão do form)
  event.preventDefault();

  // Cria um objeto com os dados da nova despesa
  const newExpense = {
    id: new Date().getTime(), // Gera um ID único baseado no timestamp atual
    expense: expense.value,   // Nome da despesa
    category_id: category.value, // ID da categoria (ex: 'food') para o ícone
    category_name: category.options[category.selectedIndex].text, // Nome legível da categoria
    amount: amount.value,     // Valor (string formatada do input)
    created_at: new Date().toISOString(),
  };

  // Validação extra: verifica se o valor é um número válido
  const amountValue = parseFloat(amount.value);
  if (isNaN(amountValue) || amountValue <= 0) {
    alert("Please enter a valid refund amount.");
    return;
  }

  // Chama as funções para adicionar na tela e salvar no navegador
  expenseAdd(newExpense);
  saveExpense(newExpense);
};
```

## 5. Adicionando Item na Tela (`expenseAdd`)

Esta função cria dinamicamente o HTML de cada despesa.

```javascript
function expenseAdd(newExpense) {
  try {
    // 1. Cria o elemento de lista (<li>)
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    // 2. Cria a imagem do ícone (<img>)
    const expenseIcon = document.createElement("img");
    // Define o src dinamicamente baseado na categoria (ex: img/food.svg)
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    // 3. Cria a div com as informações de texto
    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    // Adiciona nome e categoria dentro da div de info
    expenseInfo.append(expenseName, expenseCategory);

    // 4. Cria o span do valor
    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    // Formata o valor visualmente, colocando o R$ em uma tag <small>
    expenseAmount.innerHTML = `<small>R$</small>${formatCurrency(newExpense.amount)
      .toUpperCase()
      .replace("R$", "")}`;

    // 5. Cria o ícone de remover (lixeira)
    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.setAttribute("src", "img/remove.svg");
    removeIcon.setAttribute("alt", "remover");

    // Adiciona o evento de clique para remover este item específico
    removeIcon.onclick = () => {
      removeExpense(newExpense.id); // Remove do localStorage
      expenseItem.remove();         // Remove do HTML
      updateTotals();               // Recalcula totais
    };

    // 6. Monta o item final e adiciona na lista (<ul>)
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);
    expenseList.append(expenseItem);

    // Atualiza os totais e limpa o formulário
    updateTotals();
    formReset();

  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas.");
    console.error(error);
  }
}
```

## 6. Atualização de Totais (`updateTotals`)

Responsável por ler o que está na tela e recalcular a soma e a quantidade.

```javascript
function updateTotals() {
  try {
    // 1. Pega todos os itens (<li>) dentro da lista
    const items = expenseList.children;

    // 2. Atualiza o texto da quantidade, tratando plural/singular
    expensesQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`;

    // 3. Soma os valores
    let total = 0;
    for (let item of items) {
      const itemAmount = item.querySelector(".expense-amount").textContent;
      
      // Limpa a string para pegar apenas o número (substitui vírgula por ponto)
      let value = itemAmount.replace(/[^\d,]/g, "").replace(",", ".");
      value = parseFloat(value);

      if (isNaN(value)) {
        return alert("Não foi possível calcular o total.");
      }
      total += value;
    }

    // 4. Formata o total final e exibe na tela
    const symbolBRL = document.createElement("small");
    symbolBRL.textContent = "R$";

    const totalFormatted = formatCurrency(total).toUpperCase().replace("R$", "");

    expensesTotal.innerHTML = "";
    expensesTotal.append(symbolBRL, totalFormatted);
  } catch (error) {
    console.log(error);
    alert("Não foi possível atualizar os totais.");
  }
}
```

## 7. Funções de Persistência (LocalStorage)

Para não perder os dados ao fechar a aba.

### `saveExpense(newExpense)`
Lê o array existente no `localStorage`, adiciona a nova despesa e salva de volta convertido em string JSON.

### `removeExpense(id)`
Lê o array, filtra (remove) o item que tem o ID passado e salva a lista atualizada.

### `loadExpenses()`
Executada ao abrir a página. Lê o `localStorage` e, para cada item encontrado, chama a função `expenseAdd` para desenhá-lo na tela.

```javascript
// Carrega as despesas assim que o script roda
loadExpenses();
```