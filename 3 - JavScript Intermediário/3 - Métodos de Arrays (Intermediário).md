# Métodos de Arrays (Intermediário)

## O que são Arrays?

Arrays são estruturas de dados fundamentais em JavaScript que permitem armazenar uma coleção de múltiplos itens em uma única variável. Eles são versáteis e podem conter elementos de diferentes tipos de dados, como números, strings, objetos e até outros arrays.

Um array é uma lista ordenada, o que significa que cada item possui um índice (uma posição numérica), começando do zero.

```javascript
// Exemplo de um array simples
const frutas = ["Maçã", "Banana", "Laranja"];
const misto = [1, "texto", { id: 1 }, [1, 2, 3]];
```

---

## Métodos de Arrays: O Coração da Manipulação

JavaScript oferece um vasto conjunto de métodos para manipular arrays, permitindo adicionar, remover, iterar e transformar dados de forma eficiente. Em um nível intermediário, o foco se move dos métodos básicos para os de iteração e transformação, que são a base da programação funcional em JS.

---

## Boas Práticas ao Trabalhar com Arrays

1.  **Prefira a Imutabilidade:** Em vez de modificar o array original (com métodos como `push`, `splice`, etc.), dê preferência a métodos que retornam um novo array (`map`, `filter`, `reduce`, `slice`). Isso evita efeitos colaterais inesperados e torna o código mais previsível.

2.  **Use o Método Certo para a Tarefa Certa:**
    *   Precisa transformar cada item em algo novo? Use `map`.
    *   Precisa selecionar um subconjunto de itens? Use `filter`.
    *   Precisa calcular um único valor a partir do array? Use `reduce`.
    *   Precisa apenas percorrer os itens sem criar um novo array? Use `forEach`.

3.  **Evite Loops `for` Tradicionais:** Métodos como `map`, `filter` e `forEach` são geralmente mais legíveis e menos propensos a erros do que um loop `for` manual para a maioria das tarefas de manipulação de dados.

4.  **Nomeie Funções de Callback de Forma Clara:** Ao usar métodos de iteração, dê nomes significativos às suas funções de callback para que o propósito do código seja óbvio.

    ```javascript
    // Ruim
    const precosFinais = precos.map(p => p * 1.1);

    // Bom
    const adicionarImposto = preco => preco * 1.1;
    const precosFinais = precos.map(adicionarImposto);
    ```
