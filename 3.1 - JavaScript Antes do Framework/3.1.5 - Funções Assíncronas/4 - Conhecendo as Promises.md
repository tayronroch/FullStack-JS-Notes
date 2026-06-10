# 4 - Conhecendo as Promises

Uma **Promise** (Promessa) é um objeto que representa o sucesso ou a falha de uma operação assíncrona. Imagine como um "pedido" em um restaurante: você faz o pedido, recebe uma promessa de que a comida virá, e enquanto espera, pode fazer outras coisas.

---

## 1. Os 3 Estados de uma Promise

Uma Promise sempre estará em um destes três estados:

1.  **Pending (Pendente):** Estado inicial, quando a operação ainda está sendo processada.
2.  **Fulfilled (Resolvida):** Quando a operação foi concluída com sucesso.
3.  **Rejected (Rejeitada):** Quando a operação falhou.

---

## 2. Criando uma Promise

Para criar uma promessa, usamos o construtor `new Promise` que recebe uma função com dois parâmetros: `resolve` (sucesso) e `reject` (erro).

```javascript
const minhaPromessa = new Promise((resolve, reject) => {
  const sucesso = true;

  setTimeout(() => {
    if (sucesso) {
      resolve("Deu tudo certo!");
    } else {
      reject("Ocorreu um erro!");
    }
  }, 2000);
});
```

---

## 3. Consumindo uma Promise (.then, .catch, .finally)

Para usar o resultado de uma Promise, não podemos simplesmente atribuí-la a uma variável. Precisamos usar métodos específicos:

### `.then()`
Executado quando a Promise é **resolvida**. Recebe o valor passado no `resolve`.

```javascript
minhaPromessa.then((resultado) => {
  console.log(resultado); // "Deu tudo certo!"
});
```

### `.catch()`
Executado quando a Promise é **rejeitada**. Recebe o erro passado no `reject`.

```javascript
minhaPromessa.catch((erro) => {
  console.error(erro); // "Ocorreu um erro!"
});
```

### `.finally()`
Executado **sempre**, independente se deu certo ou errado. Útil para fechar conexões ou parar indicadores de carregamento (loaders).

```javascript
minhaPromessa.finally(() => {
  console.log("Operação finalizada.");
});
```

---

## 4. Por que Promises são importantes?

Antes das Promises, usávamos apenas **Callbacks**. Quando tínhamos muitas tarefas sequenciais, caíamos no "Callback Hell" (Inferno de Callbacks), onde o código ficava impossível de ler. As Promises permitem o **encadeamento**:

```javascript
fazerPedido()
  .then(prepararComida)
  .then(entregarComida)
  .catch(lidarComErro);
```

---

## 5. Exemplo Real: Simulação de API

```javascript
function buscarUsuario(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 1) {
        resolve({ id: 1, nome: "Tayron" });
      } else {
        reject("Usuário não encontrado!");
      }
    }, 1500);
  });
}

buscarUsuario(1)
  .then(user => console.log(`Bem-vindo, ${user.nome}`))
  .catch(err => console.error(err));
```

---

## Exercícios de Fixação

### 1) Criando um atraso
**Enunciado:** Crie uma função chamada `delay(ms)` que retorne uma Promise que se resolve após `ms` milissegundos.

**Resposta:**
```javascript
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

delay(2000).then(() => console.log("Passaram 2 segundos!"));
```

### 2) Estados da Promise
**Enunciado:** O que acontece com uma Promise se chamarmos tanto `resolve()` quanto `reject()` dentro dela?
**Resposta:** Apenas o primeiro que for chamado será executado. Uma Promise só pode mudar de estado **uma única vez** (de pendente para resolvida OU de pendente para rejeitada).

---

## Resumo

- **Promise** é um objeto para lidar com assincronismo.
- Possui estados: **Pending**, **Fulfilled** e **Rejected**.
- Usamos `resolve()` para sucesso e `reject()` para falha.
- Consumimos com `.then()`, `.catch()` e `.finally()`.
- São a base para o funcionamento do `async/await`.
