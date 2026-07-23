import http from "node:http";
import { jsonBodyHandler } from "./middlewares/jsonBodyHandler.js";

const server = http.createServer(async (request, response) => {
  const { method, url } = request;

  await jsonBodyHandler(request, response);

  if (method === "GET" && url === "/products") {
    response.writeHead(200, { "Content-Type": "application/json" });
    return response.end(
      JSON.stringify({
        message: "Você tentando pegar algo usando o metodo: " + method,
      }),
    );
  }

  if (method === "POST" && url === "/products") {
    response.writeHead(200, { "Content-Type": "application/json" });
    console.log(request.body);
    return response.end(
      JSON.stringify({
        message: "Você esta enviando o objeto usando metodo: " + method,
      }),
    );
  }

  return response.writeHead(404).end("Rota não encontrada");
});

server.listen(3333, () => {
  console.log("Server is running on http://localhost:3333");
});
