# 5 - Identificando o Método HTTP

No desenvolvimento de APIs, apenas a URL visitada (como `/usuarios`) não é suficiente para determinar o que o servidor deve fazer. Uma mesma URL pode se comportar de maneiras totalmente diferentes dependendo do **Método HTTP** (Verbo) utilizado na requisição:

* `GET /usuarios` ➔ Deve listar os usuários.
* `POST /usuarios` ➔ Deve criar um novo usuário.
* `DELETE /usuarios/10` ➔ Deve deletar o usuário de ID 10.

Nesta aula, aprenderemos como identificar e validar o método HTTP que o cliente enviou à nossa aplicação Node.js.

---

## 1. A Propriedade `request.method`

Quando criamos um servidor nativo com o Node.js usando o módulo `http`, a função de callback recebe o objeto **`request`** (geralmente abreviado como `req`). Esse objeto possui uma propriedade chamada **`method`** que armazena o método HTTP da requisição como uma string em letras maiúsculas (ex: `"GET"`, `"POST"`, `"PUT"`, `"DELETE"`).

```javascript
const server = http.createServer((req, res) => {
  console.log(req.method); // Saída no terminal: "GET", "POST", etc.
});
```

### 💡 Atalho Moderno: Desestruturação (Destructuring)

Em JavaScript moderno (ES6+), uma prática recomendada é extrair propriedades como `method` e `url` diretamente do objeto `req` utilizando a **desestruturação**. Isso deixa o código mais limpo e evita repetir a palavra `req.` várias vezes ao longo do código:

```javascript
const server = http.createServer((req, res) => {
  // Extraindo método e URL por desestruturação
  const { method, url } = req;

  console.log(`Método: ${method} | Rota: ${url}`);
});
```

---

## 2. Implementando Roteamento por Método (Exemplo Prático)

Vamos criar um servidor que responde de formas diferentes para a mesma URL `/produtos` dependendo do verbo HTTP utilizado.

Crie ou modifique um arquivo `server.js` com o seguinte código:

```javascript
import http from 'node:http';

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // Definindo o cabeçalho padrão para JSON
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });

  // Roteamento combinando URL e Método
  if (url === '/produtos') {
    if (method === 'GET') {
      return res.end(JSON.stringify([
        { id: 1, nome: "Teclado Mecânico", preco: 250 },
        { id: 2, nome: "Mouse Gamer", preco: 150 }
      ]));
    }
    
    if (method === 'POST') {
      // Aqui entraria a lógica de salvar o produto no banco de dados
      return res.end(JSON.stringify({
        mensagem: "Produto cadastrado com sucesso!",
        status: "criado"
      }));
    }
  }

  // Tratamento de rota não encontrada
  res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ erro: "Rota ou método não suportado!" }));
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em: http://localhost:${PORT}`);
});
```

---

## 3. Melhorando a Estrutura com `Switch`

Em servidores nativos com muitas rotas e métodos, encadear muitos `if` pode deixar o código confuso. Uma alternativa limpa é utilizar uma estrutura `switch`:

```javascript
const server = http.createServer((req, res) => {
  const { method, url } = req;
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });

  switch (url) {
    case '/usuarios':
      if (method === 'GET') {
        return res.end(JSON.stringify({ acao: "Listando usuários" }));
      }
      if (method === 'POST') {
        return res.end(JSON.stringify({ acao: "Criando usuário" }));
      }
      break;

    case '/configuracoes':
      if (method === 'GET') {
        return res.end(JSON.stringify({ acao: "Buscando configurações" }));
      }
      break;
  }

  res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ erro: "Não encontrado" }));
});
```

---

## 4. Como Testar Métodos Diferentes do `GET`?

Por padrão, quando você digita uma URL no seu navegador web, ele realiza uma requisição do tipo **`GET`**. Para testar métodos como `POST`, `PUT` ou `DELETE`, você precisará de ferramentas específicas:

1. **API Clients (Insomnia / Postman):** Ferramentas visuais que permitem configurar o método, corpo (body), cabeçalhos e enviar requisições de forma simples.
2. **Terminal (`curl`):**
   * Testar `GET`:
     ```bash
     curl http://localhost:3000/produtos
     ```
   * Testar `POST`:
     ```bash
     curl -X POST http://localhost:3000/produtos
     ```

---

## 5. Como os Frameworks resolvem isso?

Construir condicionais manuais para cada combinação de URL e método (como `if (url === '/x' && method === 'GET')`) é o que chamamos de **roteamento de baixo nível**. 

Frameworks modernos como o **Express** automatizam esse processo fornecendo métodos auxiliares para cada verbo HTTP:

```javascript
import express from 'express';
const app = express();

// O Express mapeia automaticamente o método GET para esta função
app.get('/produtos', (req, res) => {
  res.json({ acao: "Listando produtos" });
});

// O Express mapeia automaticamente o método POST para esta função
app.post('/produtos', (req, res) => {
  res.json({ acao: "Criando produto" });
});

app.listen(3000);
```
Isso torna o código infinitamente mais limpo, modular e fácil de manter.
