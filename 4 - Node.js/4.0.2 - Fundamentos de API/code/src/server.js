import http from "node:http";

const server = http.createServer(async (request, response) => {
  const { method, url } = request;

  if (method === "GET" && url === "/products") {
    response.writeHead(200, { "Content-Type": "application/json" });
    return response.end(
      JSON.stringify({
        message: "Você esta na home da aplicação. Usando metodo: " + method,
      }),
    );
  }

  if (method === "POST" && url === "/products") {
    const buffers = [];

    for await (const chunk of request) {
      buffers.push(chunk);
    }

    const fullBody = Buffer.concat(buffers).toString();

    try {
    } catch (error) {
      console.log(error);
    }

    console.log(fullBody);

    response.writeHead(200, { "Content-Type": "application/json" });
    return response.end(
      JSON.stringify({
        message: "Você esta na home da aplicação. Usando metodo: " + method,
      }),
    );
  }

  return response.writeHead(404).end("Rota não encontrada");
});

server.listen(3333, () => {
  console.log("Server is running on http://localhost:3333");
});
