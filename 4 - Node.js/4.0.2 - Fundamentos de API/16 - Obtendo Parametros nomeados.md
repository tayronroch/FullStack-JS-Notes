# 16 - Obtendo Parâmetros Nomeados na Prática

Nas aulas anteriores, criamos a infraestrutura para que o roteador nativo do Node.js consiga ler parâmetros nomeados das URLs utilizando Expressões Regulares (Regex) e Grupos de Captura Nomeados (`Named Capture Groups`). 

Nesta aula, focaremos em como **recuperar, desestruturar e aplicar múltiplos parâmetros nomeados** dentro dos nossos controllers em cenários de rotas reais e complexas.

---

## 1. Como os parâmetros são mapeados no objeto `request`

No roteador [routeHandler.js](file:///Users/tayron/Documents/github/FullStack-JS-Notes/4%20-%20Node.js/4.0.2%20-%20Fundamentos%20de%20API/code/src/middlewares/routeHandler.js), implementamos a seguinte lógica de mapeamento:

```javascript
const match = pathname.match(route.path);
request.params = match.groups || {};
```

A mágica disso é que qualquer parâmetro definido na rota com dois pontos (`:nomeDoParametro`) torna-se automaticamente uma **chave** dentro de `request.params`.

### Exemplo de correspondência simples:
Se a rota for `/products/:id` e a URL chamada for `/products/7`:
* `request.params` vira o objeto: `{ id: '7' }`.

---

## 2. Lidando com Múltiplos Parâmetros Nomeados

Em sistemas reais, é comum termos rotas aninhadas que exigem mais de um identificador. Por exemplo, para gerenciar as fotos de um produto específico, a URL poderia ser:
`/products/:productId/photos/:photoId`

### Como a Regex mapeia a URL?

Quando um cliente faz uma chamada para:
`GET /products/100/photos/42`

O helper `parseRoutePath` gera a seguinte expressão regular:
`/^\/products\/(?<productId>[a-z0-9-_]+)\/photos\/(?<photoId>[a-z0-9-_]+)$/`

Ao testar a URL contra a Regex, o JavaScript preenche o objeto `match.groups` com as duas chaves nomeadas capturadas:

```javascript
console.log(match.groups);
// Saída: { productId: '100', photoId: '42' }
```

---

## 3. Recuperando os dados no Controller (Desestruturação)

Para acessar esses dados dentro da função controladora no arquivo `routes.js`, utilizamos a técnica de **desestruturação de objetos (destructuring)** do JavaScript. É a forma mais limpa e moderna de extrair chaves de um objeto:

```javascript
  {
    method: "GET",
    path: "/products/:productId/photos/:photoId",
    controller: (request, response) => {
      // Extraindo múltiplos parâmetros com desestruturação
      const { productId, photoId } = request.params;

      response.writeHead(200, { "Content-Type": "application/json" });
      return response.end(JSON.stringify({
        mensagem: `Buscando a foto ${photoId} do produto ${productId}`
      }));
    }
  }
```

---

## 4. Integração Prática: Parâmetros Nomeados + Request Body (Método PUT)

Nas operações de atualização (`PUT`), comumente precisamos de duas informações ao mesmo tempo:
1. **O Parâmetro Nomeado**: Para saber *qual* recurso atualizar (ex: `request.params.id`).
2. **O Corpo (Body)**: Para saber *o que* atualizar naquele recurso (ex: `request.body`).

Veja como esse fluxo se integra no controller:

```javascript
  {
    method: "PUT",
    path: "/products/:id",
    controller: (request, response) => {
      const { id } = request.params; // Identifica o produto
      const { name, price } = request.body || {}; // Pega os novos dados do corpo

      console.log(`Atualizando o produto ${id} com o nome ${name} e preço ${price}`);

      // Executa lógica de atualização...
      
      response.writeHead(204); // Retorna 204 No Content
      return response.end();
    }
  }
```

---

## 5. Como é feito nos Frameworks (Express)

Assim como no Node.js nativo que estruturamos, no Express a captura de múltiplos parâmetros segue a mesma sintaxe de leitura de chaves do objeto `params`:

```javascript
app.put('/products/:productId/photos/:photoId', (req, res) => {
  const { productId, photoId } = req.params;
  const { title } = req.body;

  res.status(200).json({
    mensagem: `Título da foto ${photoId} do produto ${productId} alterado para: ${title}`
  });
});
```

A grande vantagem de entender como os *Named Groups* e o *matching* funcionam por debaixo dos panos no Node.js puro é que a lógica do Express ou de qualquer outro framework backend passa a fazer total sentido técnico para você.
