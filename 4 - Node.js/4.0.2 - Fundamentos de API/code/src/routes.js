export const routes = [
  {
    method: "GET",
    path: "/products",
    handler: (request, response) => {
      response.writeHead(200, { "Content-Type": "application/json" });
      return response.end(
        JSON.stringify({
          message: "Você esta na home da aplicação. Usando metodo: " + request.method,
        }),
      );
    },
  },
  {
    method: "POST",
    path: "/products",
    handler: (request, response) => {
      response.writeHead(200, { "Content-Type": "application/json" });
      console.log(request.body);
      return response.end(
        JSON.stringify({
          message: "Você esta enviando o objeto usando metodo: " + request.method,
        }),
      );
    },
  },
  {
    method: "PUT",
    path: "/products",
    handler: (request, response) => {
      response.writeHead(200, { "Content-Type": "application/json" });
      console.log(request.body);
      return response.end(
        JSON.stringify({
          message: "Você esta enviando o objeto usando metodo: " + request.method,
        }),
      );
    },
  },
  {
    method: "DELETE",
    path: "/products",
    handler: (request, response) => {
      response.writeHead(200, { "Content-Type": "application/json" });
      console.log(request.body);
      return response.end(
        JSON.stringify({
          message: "Você esta enviando o objeto usando metodo: " + request.method,
        }),
      );
    },
  },
];
