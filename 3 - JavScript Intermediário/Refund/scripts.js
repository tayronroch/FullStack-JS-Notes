console.log("Refund Script Loaded");
// You can add your JavaScript code for the Refund page here.

// Select events to form submission
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

// Select elements of list
const expenseList = document.querySelector("ul");
const expensesQuantity = document.querySelector("aside header p span");
const expensesTotal = document.querySelector("aside header h2");

amount.oninput = () => {
  // Remove all non-digit characters
  let value = amount.value.replace(/\D/g, "");
  // Limit to maximum of 1,000,000 (which is 10,000.00 in currency format)
  if (value > 9000000) {
    value = "9000000";
  }
  // Update the value in the input field formatted as currency
  amount.value = (value / 100).toFixed(2);
};

function formatCurrency(value) {
  // formats of value to default BRL currency
  const result = Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return result;
}

//Capture form submission in detail
form.onsubmit = (event) => {
  // Prevent the default form submission behavior
  event.preventDefault();

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date().toISOString(),
  };

  const amountValue = parseFloat(amount.value);

// ... (existing code) ...

  if (isNaN(amountValue) || amountValue <= 0) {
    alert("Please enter a valid refund amount.");
    return;
  }

  expenseAdd(newExpense);
  saveExpense(newExpense);
};

function expenseAdd(newExpense, shouldUpdateUI = true) {
  try {
    // create a new element list item
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    // Create icon of category
    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    // Create info div
    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    expenseInfo.append(expenseName, expenseCategory);

    // Create amount span
    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.textContent = formatCurrency(newExpense.amount).toUpperCase();

    // Create remove icon
    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.setAttribute("src", "img/remove.svg");
    removeIcon.setAttribute("alt", "remover");

    // Add remove functionality
    removeIcon.onclick = () => {
      removeExpense(newExpense.id);
      expenseItem.remove();
      updateTotals();
    };

    // add details if itens
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);
    // Add to list
    expenseList.append(expenseItem);

    // Update totals and clear form only when adding new expense (not loading)
    if (shouldUpdateUI) {
      updateTotals();
      formReset();
    }
  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas.");
    console.error(error);
  }
}

function updateTotals() {
  try {
    // Count items
    const items = expenseList.children;
    expensesQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`;

    // Sum totals
    let total = 0;
    for (let item of items) {
      const itemAmount = item.querySelector(".expense-amount").textContent;
      // Remove R$ and replace comma with dot
      let value = itemAmount.replace(/[^\d,]/g, "").replace(",", ".");
      value = parseFloat(value);

      if (isNaN(value)) {
        return alert(
          "Não foi possível calcular o total. O valor não parece ser um número."
        );
      }
      total += Number(value);
    }

    // Format total and update display
    const totalFormatted = formatCurrency(total).toUpperCase();

    expensesTotal.innerHTML = "";
    expensesTotal.textContent = totalFormatted;
  } catch (error) {
    console.log(error);
    alert("Não foi possível atualizar os totais.");
  }
}

function formReset() {
  expense.value = "";
  category.value = "";
  amount.value = "";
  expense.focus();
}

function saveExpense(newExpense) {
  try {
    const expenses = JSON.parse(localStorage.getItem("refund_expenses")) || [];
    expenses.push(newExpense);
    localStorage.setItem("refund_expenses", JSON.stringify(expenses));
  } catch (error) {
    console.error("Erro ao salvar despesa:", error);
  }
}

function removeExpense(id) {
  try {
    const expenses = JSON.parse(localStorage.getItem("refund_expenses")) || [];
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    localStorage.setItem("refund_expenses", JSON.stringify(updatedExpenses));
  } catch (error) {
    console.error("Erro ao remover despesa:", error);
  }
}

function loadExpenses() {
  try {
    const expenses = JSON.parse(localStorage.getItem("refund_expenses")) || [];
    expenses.forEach((expense) => expenseAdd(expense, false));
    // Update totals only once after loading all expenses
    updateTotals();
  } catch (error) {
    console.error("Erro ao carregar despesas:", error);
  }
}

// Load expenses on startup
loadExpenses();
