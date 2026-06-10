# 7 - Utilizando Async e Await

O `async/await` é a forma moderna de trabalhar com operações assíncronas em JavaScript. Quando combinado com o `fetch()`, torna o código de requisições limpo e fácil de seguir — parecendo código síncrono, mas sem travar o navegador.

---

## 1. O Problema sem Async/Await

Sem `async/await`, requisições encadeadas viram uma pirâmide de `.then()` difícil de ler:

```javascript
// Sem async/await — difícil de seguir
fetch("http://localhost:3001/tarefas")
  .then(resposta => resposta.json())
  .then(tarefas => {
    return fetch(`http://localhost:3001/tarefas/${tarefas[0].id}`)
      .then(resposta => resposta.json())
      .then(tarefa => console.log(tarefa))
  })
```

Com `async/await`, o mesmo código fica linear:

```javascript
// Com async/await — fácil de seguir
async function buscarPrimeiraTarefa() {
  const tarefas = await fetch("http://localhost:3001/tarefas").then(r => r.json())
  const tarefa = await fetch(`http://localhost:3001/tarefas/${tarefas[0].id}`).then(r => r.json())
  console.log(tarefa)
}
```

---

## 2. Como Funciona

- **`async`:** Declara que a função é assíncrona. Ela sempre retorna uma Promise automaticamente.
- **`await`:** Pausa a execução da função até a Promise resolver, e extrai o valor resolvido.

```javascript
async function exemplo() {
  const resultado = await algumaPromise()
  // só chega aqui quando a Promise resolver
  console.log(resultado)
}
```

O `await` **só pode ser usado dentro de funções `async`**.

---

## 3. Sequencial vs. Paralelo

Um erro comum é usar `await` em sequência quando as requisições são independentes, tornando o código desnecessariamente lento.

### Sequencial (mais lento)
Cada requisição espera a anterior terminar:

```javascript
async function sequencial() {
  const usuarios = await fetch("http://localhost:3001/usuarios").then(r => r.json())
  const tarefas = await fetch("http://localhost:3001/tarefas").then(r => r.json())
  // tempo total = tempo de /usuarios + tempo de /tarefas
}
```

### Paralelo com `Promise.all` (mais rápido)
As duas requisições disparam ao mesmo tempo:

```javascript
async function paralelo() {
  const [usuarios, tarefas] = await Promise.all([
    fetch("http://localhost:3001/usuarios").then(r => r.json()),
    fetch("http://localhost:3001/tarefas").then(r => r.json())
  ])
  // tempo total = tempo da requisição mais lenta
  console.log(usuarios, tarefas)
}
```

> Use `Promise.all` sempre que as requisições não dependerem uma da outra.

---

## 4. Tratamento de Erros com Try/Catch

Com `async/await`, o tratamento de erros usa a estrutura `try/catch`, que é familiar e agrupa toda a lógica de erro em um só lugar:

```javascript
async function buscarTarefa(id) {
  try {
    const resposta = await fetch(`http://localhost:3001/tarefas/${id}`)

    if (!resposta.ok) {
      throw new Error(`Tarefa não encontrada (status ${resposta.status})`)
    }

    const tarefa = await resposta.json()
    return tarefa
  } catch (erro) {
    console.error("Erro:", erro.message)
  }
}
```

---

## 5. Async/Await com Múltiplas Operações Dependentes

Quando uma requisição depende do resultado de outra, o `async/await` torna o fluxo muito claro:

```javascript
async function concluirPrimeiraTarefa() {
  // 1. Busca todas as tarefas pendentes
  const resposta = await fetch("http://localhost:3001/tarefas?concluida=false")
  const pendentes = await resposta.json()

  if (pendentes.length === 0) {
    console.log("Nenhuma tarefa pendente.")
    return
  }

  // 2. Usa o ID da primeira para fazer o PATCH
  const primeira = pendentes[0]
  const atualizacao = await fetch(`http://localhost:3001/tarefas/${primeira.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ concluida: true })
  })

  const atualizada = await atualizacao.json()
  console.log("Concluída:", atualizada)
}

concluirPrimeiraTarefa()
```

---

## 6. Retornando Dados de Funções Async

Funções `async` sempre retornam uma Promise. Para usar o valor retornado, você também precisa de `await`:

```javascript
async function obterTarefas() {
  const resposta = await fetch("http://localhost:3001/tarefas")
  return await resposta.json()
}

// Para usar o retorno:
async function main() {
  const tarefas = await obterTarefas()
  console.log(tarefas)
}

main()
```

---

## Conclusão

O `async/await` não é apenas açúcar sintático — ele muda a forma como você raciocina sobre código assíncrono, tornando-o linear e previsível. A regra principal é simples: use `await` para operações dependentes em sequência, e `Promise.all` para operações independentes em paralelo.
