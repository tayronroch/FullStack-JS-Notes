import http from "node:http";

const server = http.createServer((request, response) => {
  const { method, url } = request;

  if (method === "GET" && url === "/home") {
    response.writeHead(200, { "Content-Type": "application/json" });
    return response.end(
      JSON.stringify({
        message: "Você esta na home da aplicação. Usando metodo: " + method,
      }),
    );
  }
  if (method === "POST" && url === "/home") {
    response.writeHead(201, { "Content-Type": "application/json" });
    return response.end(
      JSON.stringify({
        message: "Você esta na home da aplicação. Usando metodo: " + method,
      }),
    );
  }

  if (method === "GET" && url === "/users") {
    response.writeHead(200, { "Content-Type": "application/json" });
    return response.end(
      JSON.stringify({
        message: "Listagem de usuários. Usando metodo: " + method,
      }),
    );
  }

  if (method === "POST" && url === "/users") {
    response.writeHead(201, { "Content-Type": "application/json" });
    return response.end(
      JSON.stringify({
        message: "Criação de usuário. Usando metodo: " + method,
      }),
    );
  }

  return response.writeHead(404).end("Rota não encontrada");
});

server.listen(3333, () => {
  console.log("Server is running on http://localhost:3333");
});
