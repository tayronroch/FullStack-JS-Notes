# 5 - Criando uma API de Exemplo

Com o json-server instalado e configurado, é hora de montar uma API de exemplo completa e exercitar todos os métodos HTTP na prática. Vamos construir uma API de uma lista de tarefas (to-do list).

---

## 1. Estrutura do Projeto

```
projeto/
├── db.json
├── package.json
└── index.js
```

---

## 2. O Arquivo `db.json`

Crie o banco de dados inicial com algumas tarefas:

```json
{
  "tarefas": [
    { "id": 1, "titulo": "Estudar JavaScript", "concluida": true },
    { "id": 2, "titulo": "Praticar Fetch API", "concluida": false },
    { "id": 3, "titulo": "Criar um projeto pessoal", "concluida": false }
  ]
}
```

---

## 3. O `package.json`

```json
{
  "scripts": {
    "api": "json-server --watch db.json --port 3001"
  },
  "devDependencies": {
    "json-server": "^0.17.4"
  }
}
```

Inicie o servidor:

```bash
npm run api
```

---

## 4. Lendo os Dados (GET)

```javascript
// Buscar todas as tarefas
async function listarTarefas() {
  const resposta = await fetch("http://localhost:3001/tarefas")
  const tarefas = await resposta.json()
  console.log(tarefas)
}

// Buscar uma tarefa pelo ID
async function buscarTarefa(id) {
  const resposta = await fetch(`http://localhost:3001/tarefas/${id}`)

  if (!resposta.ok) {
    throw new Error("Tarefa não encontrada")
  }

  return await resposta.json()
}
```

O json-server também suporta filtros via **query string**:

```javascript
// Buscar apenas as tarefas não concluídas
const resposta = await fetch("http://localhost:3001/tarefas?concluida=false")
```

---

## 5. Criando uma Tarefa (POST)

```javascript
async function criarTarefa(titulo) {
  const resposta = await fetch("http://localhost:3001/tarefas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo, concluida: false })
  })

  const novaTarefa = await resposta.json()
  console.log("Criada:", novaTarefa)
  return novaTarefa
}

criarTarefa("Revisar anotações")
```

> O json-server gera o `id` automaticamente.

---

## 6. Atualizando uma Tarefa (PATCH)

Use `PATCH` para alterar apenas um campo sem sobrescrever o objeto inteiro:

```javascript
async function concluirTarefa(id) {
  const resposta = await fetch(`http://localhost:3001/tarefas/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ concluida: true })
  })

  const tarefaAtualizada = await resposta.json()
  console.log("Atualizada:", tarefaAtualizada)
  return tarefaAtualizada
}

concluirTarefa(2)
```

---

## 7. Removendo uma Tarefa (DELETE)

```javascript
async function removerTarefa(id) {
  const resposta = await fetch(`http://localhost:3001/tarefas/${id}`, {
    method: "DELETE"
  })

  if (resposta.ok) {
    console.log(`Tarefa ${id} removida com sucesso.`)
  }
}

removerTarefa(3)
```

---

## 8. Juntando Tudo

Um exemplo de fluxo completo encadeado:

```javascript
async function fluxoCompleto() {
  // 1. Lista o estado inicial
  const antes = await fetch("http://localhost:3001/tarefas").then(r => r.json())
  console.log("Antes:", antes.length, "tarefas")

  // 2. Cria uma nova tarefa
  await fetch("http://localhost:3001/tarefas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo: "Nova tarefa", concluida: false })
  })

  // 3. Lista o estado final
  const depois = await fetch("http://localhost:3001/tarefas").then(r => r.json())
  console.log("Depois:", depois.length, "tarefas")
}

fluxoCompleto()
```

---

## Conclusão

Com o json-server e o `fetch()`, você praticou o ciclo completo de uma aplicação que consome uma API REST: **listar, buscar, criar, atualizar e remover** dados. Esse é exatamente o padrão que você vai encontrar ao trabalhar com APIs reais em projetos com React, Vue ou qualquer outro framework.
