# 8 - Como o Node.js lida com requisições HTTP

Para entender profundamente o Node.js, é fundamental compreender como ele gerencia as requisições HTTP por debaixo dos panos. Diferente de servidores tradicionais (como o Apache), que criam uma nova thread (processo) para cada cliente, o Node.js usa uma arquitetura baseada em eventos, I/O não-bloqueante e streams.

---

## 1. Single Thread e Event Loop

O Node.js executa o JavaScript em uma única thread principal (Single-Threaded). Quando uma requisição HTTP chega ao servidor:
1. O Node.js **não** cria um novo processo/thread para atendê-la.
2. Em vez disso, ele delega a leitura da rede para o sistema operacional (I/O assíncrono).
3. O **Event Loop** monitora o término das operações de I/O. Quando os dados chegam, a função de callback associada (o seu handler no `createServer`) é colocada na fila e executada na thread principal.

Isso permite que o Node.js lide com milhares de conexões simultâneas com pouquíssimo consumo de memória.

---

## 2. O que é o Corpo (Body) da Requisição e como enviá-lo

Quando um cliente (como um navegador ou um API client) envia uma requisição HTTP para o servidor, ele pode incluir dados estruturados em um **corpo (body)**. 

Essa técnica é usada principalmente para enviar dados complexos que serão criados ou atualizados no servidor (usando os métodos `POST`, `PUT` ou `PATCH`).

![Enviando dados no corpo](./assets/enviando-dados-body.png)

### 2.1. Como enviar dados usando o Body (Lado do Cliente)

Para enviar dados no corpo, o cliente precisa configurar três coisas fundamentais:
1. O **Método HTTP** (ex: `POST`).
2. O cabeçalho **`Content-Type`** (informa ao servidor o formato do dado enviado, ex: `application/json`).
3. O **Corpo (Body)** serializado.

#### A. Usando a API Fetch no Navegador (JavaScript)
```javascript
const novoProduto = { name: "Teclado", price: 120.50 };

fetch('http://localhost:3333/produtos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  },
  body: JSON.stringify(novoProduto) // Serializa o objeto JS para string JSON
});
```

#### B. Usando o Insomnia / Postman
1. Defina a URL e altere o método para `POST`.
2. Logo abaixo, selecione a aba **Body** e escolha a opção **JSON**.
3. Escreva o seu objeto JSON:
   ```json
   {
     "name": "Teclado",
     "price": 120.50
   }
   ```
4. Ao enviar, o client insere automaticamente o cabeçalho `Content-Type: application/json` na requisição.

---

## 3. Requisições e Respostas como Streams

No Node.js, os objetos `request` e `response` na verdade são **Streams** (fluxos de dados):

* **`request` (Readable Stream)**: É um fluxo de dados de leitura. Quando um cliente envia uma requisição com corpo (como o JSON acima), os dados não chegam todos de uma vez. Eles chegam em pequenos pacotes chamados **chunks** (pedações de dados em formato de `Buffer`).
* **`response` (Writable Stream)**: É um fluxo de escrita. Você pode enviar dados aos poucos usando `response.write()` e avisar que terminou de escrever usando `response.end()`.

---

## 4. Lendo o corpo da requisição (Request Body) de forma manual

Como o `request` é uma Readable Stream, para capturarmos o corpo da requisição, precisamos escutar os eventos emitidos pela stream:

1. **`data`**: Disparado sempre que um novo chunk (pacote de dados) chega ao servidor.
2. **`end`**: Disparado quando a transmissão do corpo da requisição termina completamente.

### Exemplo Prático de Consumo de Body:

```javascript
import http from 'node:http';

const server = http.createServer((request, response) => {
  const { method, url } = request;

  if (method === 'POST' && url === '/users') {
    const chunks = [];

    // 1. Escuta a chegada dos pacotes de dados (chunks)
    request.on('data', (chunk) => {
      chunks.push(chunk);
    });

    // 2. Escuta o encerramento do envio do corpo
    request.on('end', () => {
      // Junta todos os buffers e os converte em string (texto)
      const bodyCompleto = Buffer.concat(chunks).toString();
      
      // Converte o texto JSON em um objeto JavaScript
      const usuario = JSON.parse(bodyCompleto);

      console.log('Dados do usuário recebidos:', usuario);

      response.writeHead(201, { 'Content-Type': 'application/json' });
      return response.end(JSON.stringify({ 
        mensagem: 'Usuário recebido com sucesso!', 
        dados: usuario 
      }));
    });
  }
});

server.listen(3333);
```

> [!IMPORTANT]
> O método `JSON.parse()` pode lançar erros se a string não for um JSON válido. Na prática, é essencial envelopar essa conversão em um bloco `try/catch` para evitar que a aplicação quebre (sofra um *crash*).

---

## 5. Criando um Helper / Middleware de Body Parser

Ficar escrevendo os eventos `data` e `end` para cada rota `POST` ou `PUT` gera muita duplicação de código. Em APIs nativas, costumamos isolar essa lógica em uma função auxiliar (helper):

```javascript
// helper/json-body-parser.js
export async function jsonBodyParser(request) {
  const chunks = [];

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

Usando a função no servidor:

```javascript
import http from 'node:http';
import { jsonBodyParser } from './helper/json-body-parser.js';

const server = http.createServer(async (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });

  // Resolve o body antes de analisar as rotas
  const body = await jsonBodyParser(request);
  request.body = body; // Anexa o body no próprio objeto request

  if (request.method === 'POST' && request.url === '/users') {
    const { name, email } = request.body || {};
    
    return response.end(JSON.stringify({ 
      mensagem: `Usuário ${name} cadastrado!` 
    }));
  }
});
```

---

## 6. Como os Frameworks resolvem isso (Express.js)

Em frameworks modernos, o gerenciamento de streams é ocultado por rotinas prontas chamadas middlewares. No Express.js, por exemplo, basta habilitar o interpretador nativo de JSON:

```javascript
import express from 'express';

const app = express();

// Habilita o parsing de JSON globalmente
app.use(express.json());

app.post('/users', (req, res) => {
  // O corpo já vem parseado e disponível no req.body!
  const { name, email } = req.body;
  res.status(201).json({ mensagem: `Usuário ${name} cadastrado!` });
});

app.listen(3333);
```
