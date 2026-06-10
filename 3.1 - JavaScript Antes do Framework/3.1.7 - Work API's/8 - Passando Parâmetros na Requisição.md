# 8 - Passando Parâmetros na Requisição

Raramente você quer buscar todos os dados de uma vez. O mais comum é buscar um item específico ou filtrar os resultados. Para isso, existem duas formas de passar parâmetros em uma requisição: via **URL (parâmetro de rota)** e via **query string**.

---

## 1. Parâmetro de Rota — Buscar por ID

Para buscar um recurso específico pelo ID, o valor vai diretamente na URL:

```javascript
async function buscarProduto(id) {
  const resposta = await fetch(`http://localhost:3001/produtos/${id}`)

  if (!resposta.ok) {
    throw new Error(`Produto ${id} não encontrado`)
  }

  return await resposta.json()
}

buscarProduto(1)
// GET http://localhost:3001/produtos/1
```

O json-server retorna apenas o objeto com aquele ID:

```json
{ "id": 1, "nome": "Teclado", "preco": 250 }
```

---

## 2. Query String — Filtrar Resultados

A **query string** começa com `?` e permite passar múltiplos filtros separados por `&`. É usada para buscar por qualquer campo, não apenas pelo ID:

```javascript
// Buscar produtos pelo nome
async function buscarPorNome(nome) {
  const resposta = await fetch(`http://localhost:3001/produtos?nome=${nome}`)
  return await resposta.json()
}

buscarPorNome("Teclado")
// GET http://localhost:3001/produtos?nome=Teclado
```

```javascript
// Buscar com múltiplos filtros
async function buscarPorFiltros(categoria, precoMax) {
  const resposta = await fetch(
    `http://localhost:3001/produtos?categoria=${categoria}&preco_lte=${precoMax}`
  )
  return await resposta.json()
}

buscarPorFiltros("perifericos", 300)
// GET http://localhost:3001/produtos?categoria=perifericos&preco_lte=300
```

---

## 3. Construindo Query Strings com `URLSearchParams`

Concatenar strings manualmente fica frágil quando há muitos parâmetros ou valores com caracteres especiais (espaços, acentos). A classe `URLSearchParams` resolve isso:

```javascript
async function buscarProdutos(filtros) {
  const params = new URLSearchParams(filtros)
  const resposta = await fetch(`http://localhost:3001/produtos?${params}`)
  return await resposta.json()
}

// Os parâmetros são codificados automaticamente
buscarProdutos({ categoria: "periféricos", preco_lte: 300 })
// GET http://localhost:3001/produtos?categoria=perif%C3%A9ricos&preco_lte=300
```

---

## 4. Filtros Especiais do json-server

O json-server oferece operadores de filtro prontos via query string:

| Parâmetro | Significado | Exemplo |
| :--- | :--- | :--- |
| `campo=valor` | Igual a | `?nome=Teclado` |
| `campo_gte=valor` | Maior ou igual | `?preco_gte=100` |
| `campo_lte=valor` | Menor ou igual | `?preco_lte=300` |
| `campo_like=valor` | Contém (busca parcial) | `?nome_like=tec` |
| `_page=n&_limit=n` | Paginação | `?_page=1&_limit=10` |
| `_sort=campo&_order=asc` | Ordenação | `?_sort=preco&_order=asc` |

```javascript
// Busca produtos com preço entre 100 e 300, ordenados do mais barato
async function buscarPorFaixa() {
  const params = new URLSearchParams({
    preco_gte: 100,
    preco_lte: 300,
    _sort: "preco",
    _order: "asc"
  })

  const resposta = await fetch(`http://localhost:3001/produtos?${params}`)
  return await resposta.json()
}
```

---

## 5. Parâmetro de Rota vs. Query String

| | Parâmetro de Rota | Query String |
| :--- | :--- | :--- |
| **Formato** | `/produtos/1` | `/produtos?nome=Teclado` |
| **Uso** | Identificar um recurso único | Filtrar, paginar, ordenar |
| **Obrigatório?** | Sim (faz parte da URL) | Não (é opcional) |
| **Retorno** | Objeto único | Array de resultados |

---

## Conclusão

Saber passar parâmetros corretamente é essencial para consumir qualquer API. Use o **parâmetro de rota** (`/id`) quando souber exatamente qual item quer, e a **query string** (`?campo=valor`) quando quiser filtrar ou paginar uma lista. Para query strings complexas, prefira `URLSearchParams` a concatenar strings manualmente.
