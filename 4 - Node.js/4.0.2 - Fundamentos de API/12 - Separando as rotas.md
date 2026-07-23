# 12 - Separando as Rotas

À medida que uma API cresce, a quantidade de rotas e lógica aumenta significativamente. Manter todas as condicionais de rotas (`if (method === 'GET' && url === '/users')`) dentro do arquivo principal `server.js` torna o código confuso, gigante e de difícil manutenção.

Nesta aula, aprenderemos como organizar a aplicação separando as rotas da lógica do servidor nativo do Node.js, e como fazer isso em frameworks modernos.

---

## 1. A Estrutura da Separação Nativa

Para modularizar as rotas no Node.js nativo, implementamos um padrão baseado em três partes:

1. **O Arquivo de Rotas (`routes.js`)**: Contém uma lista (array) com todas as rotas da aplicação, seus métodos HTTP e as funções que devem ser executadas (handlers).
2. **O Roteador (`routeHandler.js`)**: Um middleware/função que recebe a requisição, analisa o método e a URL, procura uma rota correspondente e executa seu handler.
3. **O Servidor (`server.js`)**: Foca apenas na inicialização do servidor HTTP e no fluxo global de execução (middlewares globais).

---

## 2. Implementação Passo a Passo

### Passo 1: Definir o Array de Rotas (`src/routes.js`)

Aqui definimos a estrutura de cada rota como um objeto contendo `method` (método), `path` (caminho) e `handler` (função controladora):

```javascript
export const routes = [
  {
    method: "GET",
    path: "/products",
    handler: (request, response) => {
      response.writeHead(200, { "Content-Type": "application/json" });
      return response.end(JSON.stringify({ message: "Listagem de produtos" }));
    },
  },
  {
    method: "POST",
    path: "/products",
    handler: (request, response) => {
      const { name, price } = request.body || {};
      response.writeHead(201, { "Content-Type": "application/json" });
      return response.end(JSON.stringify({ 
        message: "Produto criado!", 
        dados: { name, price } 
      }));
    },
  }
];
```

### Passo 2: O Middleware de Roteamento (`src/middlewares/routeHandler.js`)

Este middleware atua como um "guarda de trânsito", direcionando a requisição para a função de rota correta ou retornando erro `404` caso não exista correspondência:

```javascript
import { routes } from "../routes.js";

export async function routeHandler(request, response) {
  const { method, url } = request;

  // Busca uma rota que coincida com o método e o path da requisição
  const route = routes.find(
    (route) => route.method === method && route.path === url,
  );

  // Se a rota não for encontrada, retorna 404
  if (!route) {
    response.writeHead(404, { "Content-Type": "application/json" });
    return response.end(JSON.stringify({ erro: "Rota não encontrada" }));
  }

  // Executa a função responsável por aquela rota
  return route.handler(request, response);
}
```

### Passo 3: O Servidor Limpo (`src/server.js`)

Agora, nosso arquivo inicial não precisa saber quais rotas existem, apenas inicializar o fluxo:

```javascript
import http from "node:http";
import { jsonBodyHandler } from "./middlewares/jsonBodyHandler.js";
import { routeHandler } from "./middlewares/routeHandler.js";

const server = http.createServer(async (request, response) => {
  // 1. Processa o corpo da requisição primeiro (middleware)
  await jsonBodyHandler(request, response);
  
  // 2. Executa o roteamento das requisições (middleware)
  routeHandler(request, response);
});

server.listen(3333, () => {
  console.log("Server is running on http://localhost:3333");
});
```

---

## 3. Como os Frameworks resolvem isso (Express Router)

No Express, não precisamos criar o nosso próprio motor de busca de rotas (`routes.find()`). Ele já fornece um módulo nativo chamado **`Router`** feito especificamente para isso.

### Criando as rotas separadas (`routes.js` no Express):
```javascript
import express from 'express';
export const router = express.Router();

router.get('/products', (req, res) => {
  res.json({ message: "Listagem de produtos no Express" });
});

router.post('/products', (req, res) => {
  res.status(201).json({ message: "Produto criado no Express" });
});
```

### Registrando as rotas no Servidor (`server.js` no Express):
```javascript
import express from 'express';
import { router } from './routes.js';

const app = express();
app.use(express.json());

// Registra todas as rotas importadas
app.use(router);

// Ou registra sob um prefixo de versão de API
// app.use('/api/v1', router); // As rotas serão acessadas em /api/v1/products

app.listen(3333);
```

Esse padrão modular com `express.Router()` é o design de arquitetura mais utilizado na comunidade, facilitando muito o trabalho em equipe, já que diferentes desenvolvedores podem trabalhar em arquivos de rotas distintos sem conflitos.
