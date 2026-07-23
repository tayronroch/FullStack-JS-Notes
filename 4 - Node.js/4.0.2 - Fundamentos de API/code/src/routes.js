import { parseRoutePath } from "./utils/parseRoutePath.js";

export const routes = [
  {
    method: "GET",
    path: "/products",
    controller: (request, response) => {
      response.writeHead(200, { "Content-Type": "application/json" });
      return response.end(
        JSON.stringify({
          message:
            "Você esta na home da aplicação. Usando metodo: " + request.method,
        }),
      );
    },
  },
  {
    method: "POST",
    path: "/products",
    controller: (request, response) => {
      response.writeHead(201, { "Content-Type": "application/json" });
      console.log(request.body);
      return response.end(
        JSON.stringify({
          message:
            "Você esta enviando o objeto usando metodo: " + request.method,
        }),
      );
    },
  },
  {
    method: "PUT",
    path: "/products/:id",
    controller: (request, response) => {
      console.log(request.body);
      console.log(request.params); // Exibe os parâmetros mapeados
      response.writeHead(204);
      return response.end();
    },
  },
  {
    method: "DELETE",
    path: "/products/:id",
    controller: (request, response) => {
      const { id } = request.params;
      response.writeHead(200);
      return response.end(`Produto ${id} removido com sucesso!!!`);
    },
  },
].map((route) => {
  return { ...route, path: parseRoutePath(route.path) };
});
