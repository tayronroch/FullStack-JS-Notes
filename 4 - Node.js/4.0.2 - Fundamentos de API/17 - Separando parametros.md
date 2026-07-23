# 17 - Separando Parâmetros (Params vs Query)

Quando construímos APIs, é muito comum que uma única requisição envie dados de identificação e dados de busca ao mesmo tempo. Por exemplo, na URL:
`http://localhost:3333/products/1?search=Mecânico&limit=10`

Nós temos dois tipos de parâmetros misturados na mesma string:
1. **Route Params**: O valor `1` (que identifica o produto).
2. **Query Params**: Os valores `search=Mecânico` e `limit=10` (que filtram e limitam os resultados).

Nesta aula, aprenderemos a separar esses parâmetros de forma automática no Node.js nativo para disponibilizá-los em objetos separados no servidor: `request.params` e `request.query`.

---

## 1. O que são Query Parameters?

Ao contrário dos Route Params (que identificam o recurso e são obrigatórios no caminho da rota), os **Query Parameters** são parâmetros opcionais adicionados ao final da URL após o caractere `?` e separados por `&`. Eles são comumente estruturados como pares de chave e valor (`chave=valor`).

Eles são usados para:
* **Filtros**: `?search=Teclado`
* **Paginação**: `?page=2&limit=10`
* **Ordenação**: `?sort=price`

---

## 2. Separando e Extraindo os Parâmetros no Roteador

Para que a nossa aplicação consiga ler tanto o `request.params` quanto o `request.query` de forma independente, precisamos atualizar o roteador nativo.

Utilizaremos a classe global `URL` do Node.js. Ela nos fornece o objeto `searchParams` (um iterador de chave e valor), que podemos converter facilmente em um objeto JavaScript comum utilizando o método utilitário **`Object.fromEntries()`**.

### Atualização no Roteador (`src/middlewares/routeHandler.js`)

Veja como fica a implementação completa separando os parâmetros:

```javascript
import { routes } from "../routes.js";

export async function routeHandler(request, response) {
  const { method, url } = request;

  // 1. Instancia a URL completa usando o host dos headers
  const parsedUrl = new URL(url, `http://${request.headers.host}`);
  
  // 2. Separa a URL em pathname (rota limpa) e searchParams (query string)
  const pathname = parsedUrl.pathname;
  const searchParams = parsedUrl.searchParams;

  // Encontra a rota correspondente
  const route = routes.find((route) => {
    return route.method === method && route.path.test(pathname);
  });

  if (route) {
    const match = pathname.match(route.path);
    
    // 3. Extrai os Route Params e anexa em request.params
    request.params = match.groups || {};

    // 4. Converte os Query Params em um objeto limpo e anexa em request.query
    // Ex: '?search=Teclado&limit=10' vira { search: 'Teclado', limit: '10' }
    request.query = Object.fromEntries(searchParams);

    return route.controller(request, response);
  }

  return response.writeHead(404).end("Rota não encontrada");
}
```

---

## 3. Acessando os Parâmetros Separados nas Rotas (`src/routes.js`)

Agora os controllers têm acesso independente a ambos os objetos. Veja um exemplo prático de uma rota de listagem que lê filtros via `request.query`:

```javascript
export const routes = [
  {
    method: "GET",
    path: "/products",
    controller: (request, response) => {
      // Obtendo os query parameters opcionais
      const { search, limit } = request.query;

      console.log(`Buscando por: ${search} | Limite: ${limit}`);

      response.writeHead(200, { "Content-Type": "application/json" });
      return response.end(JSON.stringify({
        mensagem: "Listagem de produtos filtrada",
        filtros: { search, limit }
      }));
    },
  }
];
```

---

## 4. Como os Frameworks resolvem isso (Express.js)

O Express faz toda essa extração de forma transparente por debaixo dos panos, alimentando duas propriedades distintas no objeto de requisição (`req`):

```javascript
app.get('/products/:id', (req, res) => {
  // 1. Acessa os Route Params
  const { id } = req.params; 

  // 2. Acessa os Query Params
  const { search, limit } = req.query; 

  res.json({
    id,
    filtros: { search, limit }
  });
});
```

Ao entender a separação de responsabilidades entre caminhos (paths) e query strings no protocolo HTTP, fica muito simples entender como qualquer framework backend organiza os dados que vêm do cliente.
