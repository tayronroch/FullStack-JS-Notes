# 1 - Conhecendo o setTimeout()

O `setTimeout()` é uma das funções mais fundamentais para entender a natureza assíncrona do JavaScript. Ele permite que você agende a execução de uma função após um determinado período de tempo (em milissegundos).

---

## 1. Sintaxe Básica

A função recebe dois argumentos principais: a **função de callback** (o que fazer) e o **tempo de espera** (quanto tempo esperar).

```javascript
setTimeout(() => {
  console.log("Isso aparece depois de 2 segundos!");
}, 2000);
```

---

## 2. O conceito de Não-Bloqueante

O JavaScript não "para" e fica esperando o tempo passar. Ele agenda a tarefa e continua executando o restante do código. Isso é o que chamamos de comportamento **assíncrono**.

```javascript
console.log("Passo 1: Início");

setTimeout(() => {
  console.log("Passo 2: Executado após o tempo");
}, 1000);

console.log("Passo 3: Fim (mas executado antes do passo 2)");
```

**Saída no console:**
1. Passo 1: Início
2. Passo 3: Fim
3. Passo 2: Executado após o tempo (após 1 segundo)

---

## 3. Passando Argumentos

Você pode passar argumentos para a função de callback diretamente através do `setTimeout`.

```javascript
function saudar(nome, saudacao) {
  console.log(`${saudacao}, ${nome}!`);
}

// setTimeout(funcao, tempo, arg1, arg2...)
setTimeout(saudar, 3000, "Tayron", "Bom dia");
```

---

## 4. Cancelando um Timeout

Toda vez que você chama o `setTimeout`, ele retorna um **ID único**. Você pode usar esse ID com a função `clearTimeout()` para impedir que a função seja executada antes que o tempo acabe.

```javascript
const agendamento = setTimeout(() => {
  console.log("Isso nunca será executado.");
}, 5000);

// Alguma lógica acontece... e decidimos cancelar
clearTimeout(agendamento);
console.log("Timeout cancelado com sucesso.");
```

---

## 5. Curiosidade: setTimeout com tempo 0

O que acontece se você colocar `0` no tempo?

```javascript
console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C");
```

**Resultado:** A, C e depois B.
Isso acontece porque o `setTimeout` sempre envia a função para a **Fila de Tarefas (Task Queue)**. Ela só será executada quando a **Pilha de Execução (Call Stack)** principal estiver vazia. Mesmo com tempo zero, ele respeita a fila.

---

## Exercícios de Fixação

### 1) Timer Simples
**Enunciado:** Crie um código que exiba "Carregando..." imediatamente e "Concluído!" após 2.5 segundos.

**Resposta:**
```javascript
console.log("Carregando...");
setTimeout(() => {
  console.log("Concluído!");
}, 2500);
```

### 2) Ordem de Execução
**Enunciado:** Qual a ordem de saída do código abaixo?
```javascript
setTimeout(() => console.log("1"), 100);
console.log("2");
setTimeout(() => console.log("3"), 50);
```
**Resposta:** 2, 3, 1 (O console log direto é instantâneo, o de 50ms vem antes do de 100ms).

---

## Resumo

- `setTimeout` não trava o código.
- O tempo é medido em milissegundos (1000ms = 1s).
- Pode ser cancelado com `clearTimeout`.
- É a porta de entrada para entender como o JavaScript lida com tarefas em segundo plano.
