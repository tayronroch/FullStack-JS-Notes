# Refund - Sistema de Reembolso

Este projeto consiste em um sistema simples para solicitação e gerenciamento de reembolsos de despesas. Ele permite que o usuário adicione despesas, categorize-as e visualize o total a ser reembolsado.

Abaixo, explicamos a lógica implementada no arquivo `scripts.js` passo a passo.

## 1. Seleção de Elementos do DOM

O script inicia selecionando os elementos HTML que serão manipulados. Isso inclui o formulário, os campos de input (valor, nome da despesa, categoria) e a lista onde as despesas serão exibidas (`ul`), além dos elementos de cabeçalho que mostram os totais.

```javascript
const form = document.querySelector("form");
const amount = document.getElementById("amount");
// ... outros seletores
const expenseList = document.querySelector("ul");
const expensesQuantity = document.querySelector("aside header p span");
const expensesTotal = document.querySelector("aside header h2");
```

## 2. Máscara de Moeda (`amount.oninput`)

Para garantir que o usuário insira valores monetários corretos, interceptamos o evento `input` no campo de valor.
*   Removemos qualquer caractere que não seja dígito.
*   Limitamos o valor máximo (ex: 9.000.000).
*   Dividimos por 100 para criar as casas decimais e formatamos o valor de volta no input.

## 3. Formatação de Moeda (`formatCurrency`)

Uma função utilitária `formatCurrency(value)` é usada para converter números puros em strings formatadas no padrão brasileiro (BRL), utilizando `toLocaleString`.

## 4. Submissão do Formulário (`form.onsubmit`)

Quando o usuário clica em "Adicionar despesa":
1.  `event.preventDefault()` previne o recarregamento da página.
2.  Um objeto `newExpense` é criado com os dados dos inputs (ID, nome, categoria, valor, data).
3.  Verificamos se o valor é válido (`isNaN`).
4.  Chamamos a função `expenseAdd(newExpense)` passando o objeto criado.

## 5. Adicionando Despesa na Lista (`expenseAdd`)

Esta é a função central que manipula o DOM para criar os elementos visuais da nova despesa.
1.  **Criação de Elementos:** Utilizamos `document.createElement` para criar a `li` (item da lista), `img` (ícone da categoria), `div` (informações), e `span` (valor).
2.  **Classes e Atributos:** Adicionamos classes CSS e atributos como `src` e `alt` para as imagens dinamicamente, baseando-se na categoria selecionada (`img/${newExpense.category_id}.svg`).
3.  **Montagem:** Usamos `append` para aninhar os elementos criados dentro do item da lista (`li`) e, finalmente, adicionamos a `li` dentro da lista principal (`ul` ou `expenseList`).
4.  **Remoção:** Dentro desta mesma função, criamos o ícone de remover e atribuímos um evento `onclick` a ele. Quando clicado, ele remove o próprio elemento pai (`expenseItem.remove()`) e chama `updateTotals()` para recalcular.

## 6. Atualização dos Totais (`updateTotals`)

Sempre que uma despesa é adicionada ou removida, esta função é chamada.
1.  **Contagem:** Conta o número de filhos (`children`) da lista `ul` para exibir a quantidade de despesas ("1 despesa", "2 despesas").
2.  **Soma:** Percorre cada item da lista, captura o texto do valor, limpa a formatação (remove "R$" e converte vírgula para ponto) e soma os valores.
3.  **Exibição:** Formata o total final usando `formatCurrency` e atualiza o elemento `h2` no cabeçalho.

## 7. Limpeza do Formulário (`formReset`)

Após adicionar uma despesa com sucesso, esta função limpa os valores dos inputs e coloca o foco novamente no campo de nome da despesa, facilitando o cadastro de múltiplos itens.
