# 1 - Iniciando com Requisições

Agora que já conhecemos funções assíncronas e pacotes, chegou a hora de usar essas ferramentas para algo muito concreto: **buscar dados de um servidor externo** diretamente pelo JavaScript.

---

## 1. O que é uma Requisição?

Uma **requisição (request)** é uma mensagem que o seu código envia para um servidor pedindo ou enviando alguma informação. O servidor processa esse pedido e devolve uma **resposta (response)**.

Esse modelo é chamado de **Cliente-Servidor** e é a base de como a web funciona:

```
Seu Código (Cliente)  →  [Requisição]  →  Servidor
Seu Código (Cliente)  ←  [Resposta]   ←  Servidor
```

---

## 2. A Fetch API

O navegador possui uma função nativa chamada **`fetch()`** para fazer requisições HTTP. Ela retorna uma **Promise**, por isso usamos `async/await` para trabalhar com ela de forma legível.

```javascript
async function buscarDados() {
  const resposta = await fetch("https://api.exemplo.com/usuarios")
  const dados = await resposta.json()
  console.log(dados)
}

buscarDados()
```

O processo sempre tem **duas etapas de `await`**:
1. `await fetch(url)` — aguarda a conexão com o servidor e o início da resposta.
2. `await resposta.json()` — aguarda a leitura completa do corpo da resposta e converte de JSON para objeto JavaScript.

---

## 3. Inspecionando a Resposta

O objeto retornado pelo `fetch()` contém informações importantes além dos dados em si:

```javascript
async function buscarDados() {
  const resposta = await fetch("https://api.exemplo.com/usuarios")

  console.log(resposta.status)  // 200, 404, 500...
  console.log(resposta.ok)      // true se status for 200-299

  const dados = await resposta.json()
  console.log(dados)
}
```

- **`resposta.status`:** O código numérico da resposta (ex: `200` = sucesso, `404` = não encontrado).
- **`resposta.ok`:** Atalho booleano — `true` se o status estiver entre 200 e 299.

---

## 4. Tratando Erros

O `fetch()` **não lança erro automaticamente** em respostas como `404` ou `500` — ele considera que a comunicação foi bem-sucedida. O erro só é lançado se houver uma falha de rede (sem internet, servidor inacessível).

Por isso, um tratamento robusto deve verificar `resposta.ok`:

```javascript
async function buscarUsuario(id) {
  const resposta = await fetch(`https://api.exemplo.com/usuarios/${id}`)

  if (!resposta.ok) {
    throw new Error(`Erro na requisição: ${resposta.status}`)
  }

  return await resposta.json()
}
```

Para capturar erros de rede, usamos `try/catch`:

```javascript
async function buscarUsuario(id) {
  try {
    const resposta = await fetch(`https://api.exemplo.com/usuarios/${id}`)

    if (!resposta.ok) {
      throw new Error(`Erro: ${resposta.status}`)
    }

    return await resposta.json()
  } catch (erro) {
    console.error("Falha ao buscar usuário:", erro.message)
  }
}
```

---

## 5. Exemplo Completo com uma API Pública

A [JSONPlaceholder](https://jsonplaceholder.typicode.com/) é uma API gratuita para testes. Veja um exemplo real:

```javascript
async function listarPosts() {
  try {
    const resposta = await fetch("https://jsonplaceholder.typicode.com/posts")

    if (!resposta.ok) {
      throw new Error(`Erro: ${resposta.status}`)
    }

    const posts = await resposta.json()
    console.log(`Total de posts: ${posts.length}`)
    console.log("Primeiro post:", posts[0])
  } catch (erro) {
    console.error(erro.message)
  }
}

listarPosts()
```

---

## Conclusão

O `fetch()` é o ponto de entrada para qualquer aplicação que precise se comunicar com o mundo externo. Combinado com `async/await` (visto no módulo anterior), ele torna o código de requisições limpo e fácil de seguir. O próximo passo é entender melhor **o que é uma API** e como ela estrutura essas respostas.
