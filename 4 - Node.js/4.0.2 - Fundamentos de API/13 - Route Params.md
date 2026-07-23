# 13 - Route Params

No desenvolvimento de APIs RESTful, frequentemente precisamos atuar sobre um recurso específico (deletar um usuário, atualizar os dados de um produto ou buscar detalhes de uma venda). Para identificar esse recurso único, a melhor prática é utilizar **Route Parameters (Parâmetros de Rota)**.

Nesta aula, aprenderemos o que são Route Params, como implementá-los de forma dinâmica no Node.js nativo (construindo um processador de rotas dinâmicas com Regex) e como eles são facilitados em frameworks.

---

## 1. O que são Route Params?

**Route Params** são parâmetros variáveis inseridos diretamente no caminho (path) da URL. Eles fazem parte da própria identidade do recurso.

Por exemplo, na URL:
`http://localhost:3333/products/abc-123`
* A rota base é `/products`.
* O valor `abc-123` é o **Route Param** (normalmente chamado de `id`).

### Diferença entre Route Params e Query Params

| Tipo | Formato na URL | Uso Principal | Exemplo |
| :--- | :--- | :--- | :--- |
| **Route Params** | `/products/10` | Identificar um recurso único | Obter, deletar ou atualizar um produto específico |
| **Query Params** | `/products?limit=5` | Filtrar, ordenar ou paginar uma lista | Buscar produtos com estoque menor que 5 |

---

## 2. O Desafio no Node.js Nativo

Se definirmos uma rota no nosso arquivo de rotas como `/products/:id` e tentarmos compará-la diretamente:
```javascript
// routes.js
{
  method: 'DELETE',
  path: '/products/:id', // Rota esperada
  handler: ...
}
```
E o cliente fizer uma requisição para `DELETE /products/42`, a verificação simples `url === path` falhará (pois `/products/42` é diferente de `/products/:id`).

Para resolver isso de forma nativa e profissional, precisamos converter nossos caminhos dinâmicos em **Expressões Regulares (RegEx)** no roteador.

---

## 3. Implementando Route Params Dinâmicos (Sem Frameworks)

Vamos atualizar o nosso roteador nativo para conseguir identificar e extrair parâmetros de rota automaticamente.

### Passo 1: O Roteador Dinâmico (`src/middlewares/routeHandler.js`)

Atualizaremos o roteador para transformar a string `/products/:id` em uma expressão regular capaz de ler o valor do `:id`:

```javascript
import { routes } from "../routes.js";

export async function routeHandler(request, response) {
  const { method, url } = request;

  // Percorre as rotas tentando encontrar uma que combine com o padrão
  for (const route of routes) {
    // 1. Transforma o caminho da rota (ex: '/products/:id') em Regex
    // Ex: '/products/:id' vira o regex: /^\/products\/([^/]+)$/
    const routePathRegex = new RegExp(
      "^" + route.path.replace(/\/:([^\/]+)/g, "/([^/]+)") + "$"
    );

    // 2. Compara a URL da requisição com a Regex gerada
    const match = url.match(routePathRegex);

    if (route.method === method && match) {
      // 3. Extrai as chaves de parâmetros (ex: ['id'])
      const paramNames = [...route.path.matchAll(/\/:([^\/]+)/g)].map(m => m[1]);

      // 4. Mapeia os valores extraídos da URL para as suas respectivas chaves
      request.params = {};
      paramNames.forEach((name, index) => {
        request.params[name] = match[index + 1]; // match[0] é a url completa, match[1] é o primeiro grupo
      });

      // 5. Executa o handler correspondente
      return route.handler(request, response);
    }
  }

  // Rota não encontrada
  response.writeHead(404, { "Content-Type": "application/json" });
  return response.end(JSON.stringify({ erro: "Rota não encontrada" }));
}
```

### Passo 2: Definindo Rotas com Parâmetros (`src/routes.js`)

Agora que o roteador suporta parâmetros dinâmicos, podemos usar a notação de dois pontos (`:id` ou `:nome`) nas rotas e acessar o valor em `request.params`:

```javascript
export const routes = [
  {
    method: "GET",
    path: "/products/:id",
    handler: (request, response) => {
      // Acessando o parâmetro mapeado pelo roteador
      const { id } = request.params;

      response.writeHead(200, { "Content-Type": "application/json" });
      return response.end(JSON.stringify({ 
        message: `Exibindo detalhes do produto com ID: ${id}` 
      }));
    },
  },
  {
    method: "DELETE",
    path: "/products/:id",
    handler: (request, response) => {
      const { id } = request.params;

      response.writeHead(200, { "Content-Type": "application/json" });
      return response.end(JSON.stringify({ 
        message: `Produto com ID: ${id} removido com sucesso.` 
      }));
    },
  }
];
```

---

## 4. Como os Frameworks resolvem isso (Express.js)

O Express já possui toda a lógica de expressões regulares integrada por baixo dos panos na sua biblioteca de roteamento (`path-to-regexp`). O desenvolvedor só precisa ler o objeto `req.params`:

```javascript
import express from 'express';
const app = express();

// Definindo múltiplos route params na rota
app.get('/users/:userId/books/:bookId', (req, res) => {
  // O Express parseia e entrega tudo pronto em req.params!
  const { userId, bookId } = req.params;

  res.json({
    mensagem: `Buscando o livro ${bookId} do usuário ${userId}`
  });
});

app.listen(3333);
```

Essa facilidade é um dos principais diferenciais produtivos que os frameworks oferecem sobre o desenvolvimento puro no Node.js nativo.
