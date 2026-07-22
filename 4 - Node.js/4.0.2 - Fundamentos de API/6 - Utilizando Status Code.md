# 6 - Utilizando Status Codes

No desenvolvimento de APIs com Node.js, é dever do servidor responder ao cliente utilizando o código de status HTTP correto. Isso informa à aplicação cliente (seja um frontend em React, um app mobile ou outra API) se a operação deu certo, se faltou algum dado ou se houve uma falha interna.

Nesta aula, aprenderemos as duas formas principais de definir e retornar Status Codes em um servidor HTTP nativo do Node.js, além de ver como isso é feito em frameworks modernos.

---

## 1. Usando a propriedade `response.statusCode`

A forma mais simples e direta de definir o código de status é através da propriedade **`statusCode`** do objeto `response` (ou `res`). 

Basta atribuir o número correspondente ao status desejado antes de finalizar a resposta com `res.end()`:

```javascript
import http from 'node:http';

const server = http.createServer((req, res) => {
  // Define o status code como 201 (Created)
  res.statusCode = 201;
  
  // Define o cabeçalho content-type
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  
  res.end(JSON.stringify({ mensagem: "Recurso criado com sucesso!" }));
});
```

> [!NOTE]
> Ao usar `res.statusCode`, os cabeçalhos e o status não são enviados imediatamente ao cliente. Eles são guardados na memória do Node.js até que você execute `res.end()` ou envie a primeira parte do corpo da resposta com `res.write()`. Isso permite que você altere o código de status a qualquer momento do processamento caso ocorra um erro inesperado.

---

## 2. Usando o método `response.writeHead()`

O método **`writeHead()`** é uma alternativa mais poderosa. Ele permite definir o **Status Code** e vários **Headers (Cabeçalhos)** de uma única vez.

```javascript
import http from 'node:http';

const server = http.createServer((req, res) => {
  // Define o status como 400 (Bad Request) e passa os cabeçalhos
  res.writeHead(400, {
    'Content-Type': 'application/json; charset=utf-8',
    'X-Custom-Header': 'ValorPersonalizado'
  });
  
  res.end(JSON.stringify({ erro: "Dados inválidos enviados na requisição." }));
});
```

### Qual a diferença entre `statusCode` e `writeHead`?

| Característica | `res.statusCode` | `res.writeHead()` |
| :--- | :--- | :--- |
| **Envio dos Dados** | Diferido (espera o `res.end()` ou `res.write()`) | Imediato (envia os cabeçalhos para a rede na hora) |
| **Facilidade de alteração** | Pode ser alterado a qualquer momento antes do envio | Não pode ser alterado após ser chamado |
| **Praticidade** | Bom para alterações dinâmicas durante o fluxo | Excelente para definir tudo de uma vez no final do fluxo |

---

## 3. Exemplo Prático de API Nativa com Validação e Status Codes

No exemplo abaixo, simulamos a criação de um produto. Dependendo das regras de negócio, retornamos status códigos diferentes:

```javascript
import http from 'node:http';

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // Rota de criação de produto
  if (url === '/produtos' && method === 'POST') {
    // Simulando que validamos os dados e o campo 'nome' estava vazio
    const nomeDoProdutoValido = false;

    if (!nomeDoProdutoValido) {
      // 400 Bad Request: O cliente enviou dados inválidos
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ erro: "O nome do produto é obrigatório." }));
    }

    // 201 Created: Produto criado com sucesso
    res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ mensagem: "Produto criado com sucesso!" }));
  }

  // 404 Not Found: Qualquer outra URL ou método não suportado
  res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ erro: "Rota não encontrada." }));
});

server.listen(3000, () => {
  console.log("Servidor de validação rodando na porta 3000");
});
```

---

## 4. Como os Frameworks resolvem isso (Express.js)

Em frameworks como o **Express**, a definição de códigos de status é extremamente fluida, pois o objeto `res` é estendido com métodos utilitários, como o `.status()`:

```javascript
import express from 'express';
const app = express();

app.post('/produtos', (req, res) => {
  // Retorna status 201 e envia um JSON (tudo encadeado)
  res.status(201).json({ mensagem: "Criado!" });
});

app.get('/admin', (req, res) => {
  // Retorna status 403 (Forbidden)
  res.status(403).json({ erro: "Acesso proibido." });
});

app.listen(3000);
```

Essa sintaxe encadeada (`res.status(201).json(...)`) é o padrão de mercado mais utilizado hoje na comunidade Node.js pela legibilidade e facilidade de manutenção.
