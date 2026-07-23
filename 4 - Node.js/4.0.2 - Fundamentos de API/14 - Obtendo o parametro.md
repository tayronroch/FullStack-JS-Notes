# 14 - Obtendo o parâmetro na Rota

Após configurar o nosso roteador dinâmico para identificar e parsear os parâmetros da URL, o próximo passo é **recuperar e utilizar esses parâmetros** dentro das nossas funções controladoras (controllers) para buscar, atualizar ou deletar dados.

Nesta aula, criaremos uma listagem de dados em memória e implementaremos as operações de busca e remoção detalhando as boas práticas e os cuidados necessários.

---

## 1. Criando um Banco de Dados em Memória (Mock)

Para simular o comportamento de um banco de dados real, criaremos uma lista de produtos simples em memória.

Adicione este array no topo do seu arquivo `routes.js`:

```javascript
const products = [
  { id: "1", name: "Teclado Mecânico", price: 150.00 },
  { id: "2", name: "Mouse Gamer", price: 80.00 },
  { id: "3", name: "Monitor UltraWide", price: 1200.00 },
];
```

---

## 2. Buscando um Recurso pelo ID (Método GET)

Quando o cliente solicita a rota `GET /products/2`, queremos ler o parâmetro `id` (`"2"`) e retornar apenas as informações do Mouse Gamer.

### Exemplo de Código:

```javascript
  {
    method: "GET",
    path: "/products/:id",
    controller: (request, response) => {
      // 1. Obtendo o parâmetro extraído pelo roteador
      const { id } = request.params;

      // 2. Buscando o produto no "banco de dados"
      const product = products.find((product) => product.id === id);

      // 3. Se o produto não existir, retorna status 404
      if (!product) {
        response.writeHead(404, { "Content-Type": "application/json" });
        return response.end(JSON.stringify({ erro: "Produto não encontrado." }));
      }

      // 4. Se existir, retorna o produto com status 200
      response.writeHead(200, { "Content-Type": "application/json" });
      return response.end(JSON.stringify(product));
    },
  }
```

---

## 3. O Detalhe Importante: Tipagem dos Parâmetros

Um erro muito comum no início do aprendizado ocorre quando os identificadores no banco de dados são **números** e a comparação falha:

```javascript
// Exemplo se os IDs fossem números no banco: { id: 2, ... }
const { id } = request.params; // Retorna a STRING "2"

const product = products.find((product) => product.id === id); 
// Retorna undefined! Porque o número 2 é diferente da string "2" (2 === "2" é false)
```

> [!IMPORTANT]
> **Lembre-se:** Qualquer dado extraído da URL é sempre uma **String**.
> Se o seu banco utilizar chaves primárias numéricas (como autoincremento do SQL), lembre-se de converter o parâmetro antes de comparar: `Number(id)`.

---

## 4. Deletando um Recurso pelo ID (Método DELETE)

Para remover um produto da lista, usamos o método `.findIndex()` para encontrar a posição do elemento no array e `.splice()` para removê-lo.

Seguindo o padrão de respostas limpas (**status 204 No Content**):

```javascript
  {
    method: "DELETE",
    path: "/products/:id",
    controller: (request, response) => {
      const { id } = request.params;

      // 1. Encontra a posição do elemento
      const productIndex = products.findIndex((product) => product.id === id);

      // 2. Se o produto não for encontrado, retorna 404
      if (productIndex === -1) {
        response.writeHead(404, { "Content-Type": "application/json" });
        return response.end(JSON.stringify({ erro: "Produto não encontrado." }));
      }

      // 3. Remove o produto da lista
      products.splice(productIndex, 1);

      // 4. Retorna resposta de sucesso vazia
      response.writeHead(204);
      return response.end();
    },
  }
```

---

## 5. Como é feito nos Frameworks (Express)

O fluxo é idêntico nos frameworks modernos. A única diferença é a sintaxe mais simplificada oferecida pelos métodos utilitários do Express:

```javascript
app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ erro: "Produto não encontrado." });
  }

  res.json(product);
});
```

A lógica de busca e as regras de negócio (`find`, `findIndex`, conversão de tipos) são puramente lógica JavaScript e se aplicam independentemente da ferramenta utilizada.
