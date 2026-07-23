# 9 - Recuperando dados no body

Como vimos na aula anterior, o corpo de uma requisição HTTP chega ao servidor Node.js como uma *Readable Stream* dividida em pedaços de dados (*chunks*). Nesta aula, aprenderemos na prática como recuperar, concatenar e parsear esses dados no servidor.

---

## 1. O que é o Corpo (Body) e como enviá-lo

O corpo da requisição permite transmitir dados estruturados complexos do cliente (navegador/Insomnia) para o servidor. É a base das operações de criação (`POST`) e atualização (`PUT` / `PATCH`).

![Enviando dados no corpo](./assets/enviando-dados-body.png)

### Como enviar dados (Lado do Cliente):

#### A. Usando Fetch API (JavaScript no Navegador)
```javascript
const dados = { name: "Teclado", price: 120.50 };

fetch('http://localhost:3333/produtos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(dados) // Transforma em string JSON
});
```

#### B. Usando Insomnia ou Postman
1. Altere o método da requisição para `POST` ou `PUT`.
2. Selecione a aba **Body** -> **JSON**.
3. Envie o objeto formatado:
   ```json
   {
     "name": "Teclado",
     "price": 120.50
   }
   ```

---

## 2. Recuperando dados no Servidor Nativo

Para recuperar o corpo da requisição no Node.js sem frameworks, precisamos escutar os eventos da stream `request`:

* **`request.on('data', callback)`**: Disparado cada vez que um chunk de dados chega.
* **`request.on('end', callback)`**: Disparado quando todos os chunks terminaram de ser transmitidos.

### Exemplo de implementação:

```javascript
import http from 'node:http';

const server = http.createServer((request, response) => {
  const { method, url } = request;

  if (method === 'POST' && url === '/users') {
    const chunks = [];

    // 1. Armazena cada chunk que chega da rede
    request.on('data', (chunk) => {
      chunks.push(chunk);
    });

    // 2. Quando o envio termina, junta e processa os dados
    request.on('end', () => {
      // Une os buffers e converte para string de texto
      const bodyCompleto = Buffer.concat(chunks).toString();
      
      try {
        // Converte o texto JSON de volta para objeto JavaScript
        const usuario = JSON.parse(bodyCompleto);
        
        console.log('Usuário recebido:', usuario);
        
        response.writeHead(201, { 'Content-Type': 'application/json' });
        return response.end(JSON.stringify({ mensagem: 'Usuário cadastrado!', dados: usuario }));
      } catch (error) {
        // Tratamento de erro caso o JSON seja inválido
        response.writeHead(400, { 'Content-Type': 'application/json' });
        return response.end(JSON.stringify({ erro: 'JSON inválido enviado no corpo.' }));
      }
    });
  }
});

server.listen(3333);
```

---

## 3. Criando um Helper JSON Body Parser

Para evitar repetir a escuta de eventos (`data` e `end`) em todas as rotas que precisam ler o corpo da requisição, podemos isolar essa lógica em uma função auxiliar assíncrona:

```javascript
// helpers/json-body-parser.js
export async function jsonBodyParser(request) {
  const chunks = [];

  // Usando sintaxe for await para iterar sobre a stream de forma limpa
  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const content = Buffer.concat(chunks).toString();

  try {
    return JSON.parse(content);
  } catch {
    return null; // Retorna null se não houver corpo ou se for inválido
  }
}
```

### Como utilizar no servidor:

```javascript
import http from 'node:http';
import { jsonBodyParser } from './helpers/json-body-parser.js';

const server = http.createServer(async (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });

  // Resolve o body antes de mapear as rotas
  const body = await jsonBodyParser(request);
  request.body = body; // Anexa o body processado na request

  if (request.method === 'POST' && request.url === '/users') {
    const { name, email } = request.body || {};
    return response.end(JSON.stringify({ mensagem: `Usuário ${name} cadastrado!` }));
  }
});
```

---

## 4. Recuperando dados em Frameworks (Express.js)

Os frameworks encapsulam todo esse processo de buffers e streams. No **Express.js**, por exemplo, o middleware integrado faz todo o trabalho por debaixo dos panos e disponibiliza os dados diretamente no objeto `req.body`:

```javascript
import express from 'express';
const app = express();

// Habilita a leitura de corpos em formato JSON
app.use(express.json());

app.post('/users', (req, res) => {
  // Apenas lemos req.body diretamente!
  const { name, email } = req.body;
  res.status(201).json({ mensagem: `Usuário ${name} cadastrado!` });
});

app.listen(3333);
```
