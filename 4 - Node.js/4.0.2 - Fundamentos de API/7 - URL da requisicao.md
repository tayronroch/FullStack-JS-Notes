# 7 - URL da Requisição

No módulo nativo do Node.js (`node:http`), a propriedade `request.url` não contém apenas a rota (pathname). Ela contém a URL completa da requisição a partir da barra inicial `/` — o que inclui o **caminho (path)** e os **parâmetros de busca (query parameters)**.

Por exemplo, se um cliente fizer uma requisição para `http://localhost:3333/users?name=Tayron&age=25`, a propriedade `request.url` retornará:
`"/users?name=Tayron&age=25"`

Se tentarmos validar a rota diretamente com `url === '/users'`, a comparação resultará em `false` devido aos parâmetros na URL. Nesta aula, aprenderemos a analisar, extrair e gerenciar as URLs e seus parâmetros no Node.js nativo e como os frameworks facilitam esse processo.

---

## 1. O Objeto `URL` do Node.js (WHATWG API)

O Node.js possui uma classe global chamada `URL` baseada na API WHATWG (o padrão moderno da web).

Como o `request.url` do Node.js nativo é **relativo** (não contém o protocolo `http://` nem o domínio `localhost:3333`), precisamos passar uma URL base como segundo argumento ao instanciá-lo:

```javascript
const minhaUrl = new URL(request.url, `http://${request.headers.host}`);
```

### Principais propriedades do objeto `URL`

Dada a URL `http://localhost:3333/users?search=Tayron&limit=10`:

* **`pathname`**: Retorna apenas o caminho do recurso (ex: `/users`). É o ideal para estruturar as rotas (roteamento).
* **`search`**: Retorna a query string completa, incluindo a interrogação (ex: `?search=Tayron&limit=10`).
* **`searchParams`**: Retorna um objeto utilitário especial (`URLSearchParams`) para trabalhar com os parâmetros de consulta.

---

## 2. Trabalhando com Query Parameters (`URLSearchParams`)

Os Query Parameters são ótimos para filtros, buscas e paginação. O objeto `searchParams` possui métodos úteis para interagir com esses parâmetros:

* `searchParams.get('nome')`: Retorna o valor de uma chave específica.
* `searchParams.has('nome')`: Verifica se a chave existe na URL.
* `searchParams.entries()`: Permite iterar sobre todas as chaves e valores.

### Exemplo Prático:

```javascript
const url = new URL("/users?search=Tayron&limit=10", "http://localhost:3333");

console.log(url.pathname); // "/users"
console.log(url.searchParams.get("search")); // "Tayron"
console.log(url.searchParams.get("limit")); // "10"
console.log(url.searchParams.has("page")); // false
```

---

## 3. Implementando no Servidor Nativo

Vamos atualizar a lógica do roteamento para usar o `pathname` em vez do `url` cru. Assim, os filtros da URL não quebrarão as nossas rotas.

```javascript
import http from "node:http";

const server = http.createServer((request, response) => {
  const { method, url } = request;

  // Cria o objeto URL usando o host dos headers
  const parsedUrl = new URL(url, `http://${request.headers.host}`);
  
  // Extrai o pathname (ex: '/users') e os parâmetros de busca
  const pathname = parsedUrl.pathname;
  const searchParams = parsedUrl.searchParams;

  response.writeHead(200, { "Content-Type": "application/json" });

  // Rota de listagem de usuários com suporte a query params
  if (method === "GET" && pathname === "/users") {
    const search = searchParams.get("search");

    if (search) {
      return response.end(
        JSON.stringify({ 
          mensagem: `Listagem filtrada pelo termo: ${search}` 
        })
      );
    }

    return response.end(
      JSON.stringify({ mensagem: "Listagem de todos os usuários" })
    );
  }

  // Rota não encontrada
  response.writeHead(404, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ erro: "Rota não encontrada" }));
});

server.listen(3333);
```

---

## 4. Route Parameters (Parâmetros de Rota) no Node.js Nativo

Ao contrário dos *Query Parameters* (`?chave=valor`), os *Route Parameters* são parte do próprio caminho da URL, normalmente usados para identificar um recurso único (ex: `/users/1`).

No Node.js nativo, não há um sistema de rotas dinâmico pré-construído (como `/users/:id`). Para extrair o ID, precisamos tratar o `pathname` de forma manual (ex: usando expressões regulares ou quebrando a string com `.split()`):

```javascript
// Exemplo manual de identificação de rota dinâmica: /users/1
if (method === "DELETE" && pathname.startsWith("/users/")) {
  const partes = pathname.split("/"); // ["", "users", "1"]
  const id = partes[2];

  return response.end(
    JSON.stringify({ mensagem: `Removendo o usuário com ID: ${id}` })
  );
}
```

---

## 5. Como os Frameworks resolvem isso (Express.js)

Os frameworks modernos lidam com esses dois tipos de parâmetros de forma automática e elegante, injetando os dados diretamente no objeto de requisição (`req`).

### No Express.js:

```javascript
import express from 'express';
const app = express();

// 1. Query Params (?search=Tayron) -> Acessíveis via req.query
app.get('/users', (req, res) => {
  const search = req.query.search;
  res.json({ mensagem: `Buscando por: ${search}` });
});

// 2. Route Params (/users/12) -> Definidos com ":" e acessíveis via req.params
app.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  res.json({ mensagem: `Deletando usuário: ${id}` });
});

app.listen(3333);
```

Essa facilidade de tratar URLs e parâmetros é um dos maiores motivos pelos quais raramente usamos o roteamento nativo do Node.js no dia a dia em produção, optando por frameworks ou roteadores dedicados.
