# 6 - Conhecendo o Event Loop

O **Event Loop** (Laço de Eventos) é o motor que permite ao JavaScript ser assíncrono e não bloqueante, mesmo sendo uma linguagem *single-threaded* (um único fio de execução).

---

## 1. O Fluxo de Execução

Imagine o Event Loop como um ciclo constante que gerencia as seguintes áreas:

1.  **Call Stack (Pilha de Chamadas):** Armazena as chamadas de funções em execução. Segue o princípio **LIFO** (*Last In, First Out*). Quando uma função é chamada, ela é empilhada; quando termina, é removida.
2.  **Web APIs:** Algumas tarefas não são executadas na Call Stack, elas apenas "passam" por ela e são enviadas para as Web APIs (recursos do navegador ou Node). Exemplos: `setTimeout`, manipulação do `DOM`, e requisições `fetch`.
3.  **Callback Queue (Fila de Callbacks):** É a fila que armazena as funções que já terminaram seu processamento nas Web APIs e estão aguardando para serem executadas. Exemplos: eventos de `onClick`, `onLoad` ou o código dentro de um `setTimeout`.
4.  **Event Loop:** O "vigia" que verifica constantemente a Call Stack. Se a pilha estiver **vazia**, ele remove o primeiro callback da fila e o coloca na Call Stack para ser executado.

---

## 2. Microtasks e Macrotasks

Dentro da Fila de Callbacks, existem dois tipos principais de tarefas com prioridades diferentes:

### 🚀 Microtasks (Alta Prioridade)
São executadas imediatamente após a Call Stack esvaziar, **antes** de qualquer Macrotask.
- **Exemplos:** Promises (`.then`, `await`), `queueMicrotask`.

### ⏳ Macrotasks (Menor Prioridade)
São as tarefas comuns da fila que aguardam o sistema estar livre.
- **Exemplos:** `setTimeout`, `setInterval`, eventos de clique, eventos de carregamento (`onLoad`).

> **Regra de Ouro:** O Event Loop só processa uma Macrotask depois que **todas** as Microtasks pendentes forem finalizadas.

---

## 3. Exemplo Prático de Prioridade

Observe a ordem de execução baseada no fluxo real:

```javascript
console.log("1 - Stack Principal"); // Síncrono

setTimeout(() => {
  console.log("2 - Macrotask (Timer)");
}, 0);

Promise.resolve().then(() => {
  console.log("3 - Microtask (Promise)");
});

console.log("4 - Stack Principal"); // Síncrono
```

**O que acontece nos bastidores:**
1.  Logs síncronos (1 e 4) entram e saem da **Call Stack** na hora.
2.  O `setTimeout` vai para a **Web API**, termina o tempo (0ms) e o callback cai na **Callback Queue (Macrotask)**.
3.  A Promise vai para a **Microtask Queue**.
4.  A Call Stack esvazia. O Event Loop prioriza a **Microtask Queue** (Log 3).
5.  Somente após as microtasks, o Event Loop pega a **Macrotask** (Log 2).

---

## 4. Por que isso é importante?


### ⚠️ Não bloqueie a Stack!
Se você rodar um loop infinito ou um cálculo extremamente pesado na Call Stack, o Event Loop nunca terá chance de olhar para as filas. Isso faz com que o navegador "trave", botões parem de responder e animações congelem.

### 🚀 Prioridade de UI
As microtarefas (Promises) são ideais para atualizações rápidas de estado, enquanto as macrotarefas (Timers) são melhores para coisas que podem esperar um pouco mais.

---

## Exercícios de Fixação

### 1) Ordem de Execução II
**Enunciado:** Qual a ordem de saída?
```javascript
setTimeout(() => console.log("A"), 0);
Promise.resolve().then(() => console.log("B"));
console.log("C");
Promise.resolve().then(() => console.log("D"));
```
**Resposta:** C, B, D, A. (O log síncrono primeiro, depois todas as microtasks na fila, e por fim a macrotask do timer).

### 2) Call Stack
**Enunciado:** Se uma função demora 10 segundos para terminar na Call Stack, o que acontece com um `setTimeout(..., 1000)` agendado para 1 segundo?
**Resposta:** O timeout terá que esperar os 10 segundos terminarem. O tempo no `setTimeout` é o tempo **mínimo** de espera, não o tempo exato, pois ele depende da Call Stack estar vazia.

---

## Resumo Final: O Ciclo de Vida do Código

Para consolidar, lembre-se destes 4 pontos principais:

1.  **Execução de Código:** O código síncrono é executado de cima para baixo na **Call Stack**, empilhando e desempilhando funções conforme necessário.
2.  **Eventos Assíncronos:** Quando ocorrem eventos assíncronos (como uma requisição concluída ou um timer finalizado), o **callback** correspondente é enviado para a **Fila de Callbacks (Callback Queue)**.
3.  **Verificação do Event Loop:** O Event Loop verifica constantemente a Call Stack e a Fila de Callbacks. Se a pilha estiver **vazia**, ele move um callback da fila para a pilha de chamadas para ser executado.
4.  **Microtasks:** Antes de verificar novamente a Fila de Callbacks para uma nova tarefa, o Event Loop executa **todas as Microtasks pendentes** (como as Promises).

---

## Exercícios de Fixação
