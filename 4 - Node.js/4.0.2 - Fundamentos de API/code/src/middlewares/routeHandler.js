import { routes } from "../routes.js";

export async function routeHandler(request, response) {
  const { method, url } = request;
  const route = routes.find(
    (route) => route.method === method && route.path === url,
  );

  if (route) {
    return route.controller(request, response);
  }

  return response.writeHead(404).end("Rota não encontrada");
}
