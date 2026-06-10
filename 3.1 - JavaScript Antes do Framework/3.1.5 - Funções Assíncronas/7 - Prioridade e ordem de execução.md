# 7 - Prioridade e Ordem de Execução

Agora que você conhece as peças do Event Loop, vamos focar no "quem vem primeiro". Entender a prioridade de execução é crucial para evitar bugs onde o código parece rodar em uma ordem aleatória, mas que na verdade segue regras muito rígidas.

---

## 1. A Hierarquia de Execução

O JavaScript segue sempre esta ordem de prioridade:

1.  **Código Síncrono (Call Stack):** É a prioridade máxima. Nada mais roda enquanto a pilha principal não estiver vazia.
2.  **Microtasks (Promises):** Logo após a pilha esvaziar, o JavaScript limpa toda a fila de microtarefas.
3.  **Macrotasks (Timers/Eventos):** Só são executadas quando a pilha está vazia e não há mais nenhuma microtarefa pendente.

---

## 2. Analisando um Cenário Complexo

Observe o código abaixo e tente prever a ordem dos números:

```javascript
console.log("1 - Síncrono");

setTimeout(() => console.log("2 - Macrotask"), 0);

Promise.resolve().then(() => {
  console.log("3 - Microtask");
  Promise.resolve().then(() => console.log("4 - Microtask aninhada"));
});

console.log("5 - Síncrono");
```

### O que acontece passo a passo:
1.  **Pilha Principal:** Executa `1 - Síncrono` e `5 - Síncrono`. O `setTimeout` é enviado para a Web API e a `Promise` (3) para a Microtask Queue.
2.  **Pilha Esvaziou:** O Event Loop olha para as **Microtasks**.
3.  Executa o log `3`. Dentro dele, uma nova Promise (4) é criada e adicionada à fila de Microtasks.
4.  **Atenção:** O Event Loop **não vai** para as Macrotasks ainda. Ele continua limpando a fila de Microtasks e executa o log `4`.
5.  **Tudo Limpo:** Agora sim, ele busca a **Macrotask** e executa o log `2`.

**Resultado Final:** 1, 5, 3, 4, 2.

---

## 3. Promises Aninhadas vs Timers

Um erro comum é achar que um `setTimeout` com tempo zero ganharia de uma Promise que foi criada dentro de outra Promise. **Isso nunca acontece.**

As Microtasks têm um "passe livre" para serem processadas até que a fila esteja zerada, mesmo que novas microtarefas sejam adicionadas durante o processo.

---

## 4. Aplicação Prática: Evitando Travamentos

Se você tem uma tarefa muito pesada, uma técnica comum é "quebrá-la" usando `setTimeout`. Isso dá chance ao navegador de processar outras coisas (como cliques ou animações) entre os pedaços da sua tarefa, pois cada pedaço se torna uma nova macrotask.

---

## Exercícios Desafiadores

### 1) O Desafio da Ordem
**Enunciado:** Qual a ordem de saída?
```javascript
setTimeout(() => console.log("A"), 0);
console.log("B");
Promise.resolve().then(() => {
  console.log("C");
  setTimeout(() => console.log("D"), 0);
});
console.log("E");
```
**Resposta:** B, E, C, A, D.
- B e E são síncronos.
- C é a primeira microtask.
- A é a primeira macrotask agendada.
- D é uma nova macrotask agendada depois de A.

### 2) Microtasks Infinitas
**Enunciado:** O que acontece se uma função `async` chamar a si mesma recursivamente sem um `await` ou `setTimeout`?
**Resposta:** Você cria um loop infinito de Microtasks que impedirá o Event Loop de chegar às Macrotasks ou de atualizar a interface, fazendo o navegador travar.

---

## Resumo

- **Síncrono > Microtasks > Macrotasks.**
- Microtasks novas são processadas no mesmo ciclo do Event Loop.
- Macrotasks novas sempre esperam o próximo ciclo.
- Use este conhecimento para garantir que animações e interações do usuário não fiquem "engasgadas".
