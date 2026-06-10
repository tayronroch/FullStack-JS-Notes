# 6 - Utilizando o Fetch

O `fetch()` é a função nativa do JavaScript para fazer requisições HTTP. Nas aulas anteriores já o usamos de forma básica — agora vamos entender seu funcionamento em profundidade e as boas práticas para usá-lo com segurança.

---

## 1. Como o Fetch Funciona por Dentro

O `fetch()` retorna uma **Promise** que resolve com um objeto `Response`. Esse objeto representa a resposta HTTP, mas **não contém os dados ainda** — ele é apenas o envelope. Para ler o conteúdo, é preciso chamar um método no `Response`:

```javascript
fetch("http://localhost:3001/tarefas")
  .then(resposta => resposta.json())  // lê e converte o corpo
  .then(dados => console.log(dados))
```

Com `async/await`, o mesmo fluxo fica:

```javascript
const resposta = await fetch("http://localhost:3001/tarefas")
const dados = await resposta.json()
```

---

## 2. Métodos de Leitura do Response

Dependendo do tipo de dado que a API retorna, você usa um método diferente:

| Método | Retorna | Quando usar |
| :--- | :--- | :--- |
| `resposta.json()` | Objeto/Array JS | API REST que retorna JSON |
| `resposta.text()` | String pura | HTML, CSV, texto simples |
| `resposta.blob()` | Arquivo binário | Imagens, PDFs, downloads |

---

## 3. O Objeto de Configuração (Options)

O segundo parâmetro do `fetch()` é um objeto de opções que controla como a requisição é feita:

```javascript
fetch(url, {
  method: "POST",          // GET (padrão), POST, PUT, PATCH, DELETE
  headers: {               // cabeçalhos HTTP
    "Content-Type": "application/json",
    "Authorization": "Bearer SEU_TOKEN"
  },
  body: JSON.stringify(dados)  // corpo da requisição (apenas POST, PUT, PATCH)
})
```

> `GET` e `DELETE` não têm `body`. Enviar um body num GET é ignorado pela maioria dos servidores.

---

## 4. Headers: Cabeçalhos da Requisição

Os **headers** transmitem metadados sobre a requisição. Os mais comuns:

```javascript
const headers = {
  // Informa ao servidor o formato do dado que estamos enviando
  "Content-Type": "application/json",

  // Token de autenticação (comum em APIs que exigem login)
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIs..."
}
```

---

## 5. Tratamento de Erros Completo

O `fetch()` **nunca rejeita a Promise por respostas de erro HTTP** (404, 500, etc.) — ele só rejeita em falhas de rede. Por isso, o tratamento correto precisa verificar `resposta.ok`:

```javascript
async function requisicao(url, opcoes = {}) {
  try {
    const resposta = await fetch(url, opcoes)

    if (!resposta.ok) {
      throw new Error(`Erro ${resposta.status}: ${resposta.statusText}`)
    }

    return await resposta.json()
  } catch (erro) {
    // Captura tanto erros HTTP quanto falhas de rede
    console.error("Falha na requisição:", erro.message)
    throw erro
  }
}
```

---

## 6. Exemplos Práticos com a API Local

### GET — Listar com filtro

```javascript
async function buscarPendentes() {
  const dados = await requisicao(
    "http://localhost:3001/tarefas?concluida=false"
  )
  console.log("Pendentes:", dados)
}
```

### POST — Enviar dados

```javascript
async function criarTarefa(titulo) {
  const dados = await requisicao("http://localhost:3001/tarefas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo, concluida: false })
  })
  console.log("Criada:", dados)
}
```

### PATCH — Atualizar parcialmente

```javascript
async function marcarConcluida(id) {
  const dados = await requisicao(`http://localhost:3001/tarefas/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ concluida: true })
  })
  console.log("Atualizada:", dados)
}
```

### DELETE — Remover

```javascript
async function deletarTarefa(id) {
  await requisicao(`http://localhost:3001/tarefas/${id}`, {
    method: "DELETE"
  })
  console.log(`Tarefa ${id} removida.`)
}
```

---

## 7. Atenção: useEffect não Aceita Async Diretamente (React)

Quando você chegar ao React, vai querer fazer requisições dentro do `useEffect`. Um erro muito comum é tornar o callback do `useEffect` diretamente `async`:

```javascript
// ❌ ERRADO — nunca faça isso
useEffect(async () => {
  const dados = await fetch("http://localhost:3001/tarefas").then(r => r.json())
  setTarefas(dados)
}, [])
```

**Por que não funciona?** O `useEffect` espera que seu callback retorne `undefined` ou uma função de limpeza. Uma função `async` sempre retorna uma Promise — e o React não sabe o que fazer com ela, gerando bugs silenciosos de memória e comportamento inesperado.

### Estratégia 1: Criar uma função interna e chamá-la

A solução mais comum é declarar uma função `async` dentro do `useEffect` e chamá-la logo em seguida:

```javascript
useEffect(() => {
  async function buscarTarefas() {
    const dados = await fetch("http://localhost:3001/tarefas").then(r => r.json())
    setTarefas(dados)
  }

  buscarTarefas()
}, [])
```

### Estratégia 2: IIFE async (sem criar uma função nomeada)

Se quiser evitar declarar uma função separada, use uma **IIFE** (função imediatamente invocada):

```javascript
useEffect(() => {
  ;(async () => {
    const dados = await fetch("http://localhost:3001/tarefas").then(r => r.json())
    setTarefas(dados)
  })()
}, [])
```

A IIFE `(async () => { ... })()` declara e executa a função ao mesmo tempo, sem precisar de um nome. O `;` antes é uma proteção contra problemas de ponto-e-vírgula automático em alguns bundlers.

> Ambas as estratégias são válidas. A função nomeada é mais legível; a IIFE é mais compacta. Escolha conforme o contexto e o padrão da equipe.

---

## 8. Boas Práticas

- **Sempre verifique `resposta.ok`** antes de chamar `.json()` — ler o corpo de uma resposta de erro pode retornar HTML de página de erro, não JSON.
- **Centralize a lógica de fetch** em uma função utilitária (como a `requisicao` acima) para não repetir o tratamento de erros em todo lugar.
- **Não misture `.then()` e `async/await`** no mesmo fluxo — escolha um padrão e mantenha consistente.

---

## Conclusão

O `fetch()` é simples por fora, mas tem nuances importantes: o duplo `await`, a necessidade de verificar `resposta.ok` manualmente e o uso correto do objeto de opções. Dominar esses detalhes é o que separa um código que funciona de um código que funciona com segurança.
