# 3 - Utilizando o Insomnia na Prática

Nas aulas anteriores, entendemos os conceitos de APIs e as configurações básicas do Insomnia. Agora, vamos colocar tudo isso em prática com um **Laboratório Prático (Lab)**. 

Criaremos um servidor Node.js local que simula uma lista de produtos na memória e permite realizar operações completas de **CRUD** (Create, Read, Update, Delete). Em seguida, configuraremos o Insomnia passo a passo para gerenciar e testar todos os cenários desse servidor.

---

## 1. O Servidor de Teste (CRUD local)

Primeiro, precisamos de um servidor rodando localmente para podermos enviar as requisições. 

Crie um arquivo temporário em seu computador chamado `app-teste.js` (ou salve-o na pasta do seu projeto Node) e adicione o seguinte código utilizando ES Modules (certifique-se de que a pasta tem `"type": "module"` configurado no `package.json` ou salve o arquivo com a extensão `.mjs`):

```javascript
// app-teste.js
import http from 'node:http';

// Banco de dados em memória
let produtos = [
  { id: 1, nome: "Notebook", preco: 4500.00 },
  { id: 2, nome: "Mouse Óptico", preco: 120.00 }
];

const server = http.createServer((req, res) => {
  // Configurando respostas padrão em JSON e UTF-8
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  const urlParts = req.url.split('/'); // Divide "/produtos/1" em ["", "produtos", "1"]
  const recurso = urlParts[1];
  const idStr = urlParts[2];
  const id = Number(idStr);

  // --- GET /produtos (Listar todos os produtos) ---
  if (req.method === 'GET' && recurso === 'produtos' && !idStr) {
    res.writeHead(200);
    res.end(JSON.stringify(produtos));
  }
  
  // --- POST /produtos (Cadastrar novo produto) ---
  else if (req.method === 'POST' && recurso === 'produtos' && !idStr) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { nome, preco } = JSON.parse(body);
        const novoProduto = {
          id: produtos.length > 0 ? produtos[produtos.length - 1].id + 1 : 1,
          nome,
          preco: Number(preco)
        };
        produtos.push(novoProduto);
        res.writeHead(201); // 201 Created
        res.end(JSON.stringify(novoProduto));
      } catch (err) {
        res.writeHead(400);
        res.end(JSON.stringify({ erro: "Dados inválidos enviados no corpo." }));
      }
    });
  }

  // --- PUT /produtos/:id (Atualizar um produto existente) ---
  else if (req.method === 'PUT' && recurso === 'produtos' && id) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const index = produtos.findIndex(p => p.id === id);
      if (index === -1) {
        res.writeHead(404);
        res.end(JSON.stringify({ erro: "Produto não encontrado!" }));
        return;
      }
      try {
        const { nome, preco } = JSON.parse(body);
        produtos[index] = { ...produtos[index], nome, preco: Number(preco) };
        res.writeHead(200);
        res.end(JSON.stringify(produtos[index]));
      } catch (err) {
        res.writeHead(400);
        res.end(JSON.stringify({ erro: "Dados inválidos." }));
      }
    });
  }

  // --- DELETE /produtos/:id (Remover um produto existente) ---
  else if (req.method === 'DELETE' && recurso === 'produtos' && id) {
    const index = produtos.findIndex(p => p.id === id);
    if (index === -1) {
      res.writeHead(404);
      res.end(JSON.stringify({ erro: "Produto não encontrado!" }));
      return;
    }
    produtos.splice(index, 1);
    res.writeHead(200);
    res.end(JSON.stringify({ mensagem: "Produto removido com sucesso!" }));
  }

  // --- Rota Padrão (Não Encontrada) ---
  else {
    res.writeHead(404);
    res.end(JSON.stringify({ erro: "Caminho não encontrado!" }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor de teste CRUD rodando em http://localhost:${PORT}`);
});
```

### Inicialize o Servidor
No seu terminal, inicie o arquivo:
```bash
node app-teste.js
```

---

## 2. Configurando o Laboratório no Insomnia

Com o servidor rodando em `http://localhost:3000`, abra o Insomnia e siga as etapas abaixo para configurar o seu painel de testes.

### Passo 1: Configurar a URL Base (Environment)
1. No canto superior esquerdo, clique no seletor de ambiente e vá em **Manage Environments** (ou clique na engrenagem).
2. Adicione a variável `base_url` apontando para o seu servidor local:
   ```json
   {
     "base_url": "http://localhost:3000"
   }
   ```
3. Clique em **Close**.

---

### Passo 2: Criar as Requisições do CRUD

Vamos criar as requisições básicas para interagir com o servidor. Para manter organizado, clique com o botão direito no menu lateral e selecione **New Folder**, nomeando-a como **`Produtos`**. Mantenha todas as requisições dentro desta pasta.

#### A. Listar Produtos (GET)
* Clique em **New Request** (`Ctrl + N`).
* Nome: `Listar Todos`.
* Método: **`GET`**.
* URL: `{{ _.base_url }}/produtos`.
* Clique em **Send**. 
* **Resposta esperada:** Status `200 OK` e o JSON listando os 2 produtos padrão da memória.

#### B. Cadastrar Produto (POST)
* Clique em **New Request** (`Ctrl + N`).
* Nome: `Cadastrar Produto`.
* Método: **`POST`**.
* URL: `{{ _.base_url }}/produtos`.
* Selecione **Body ➔ JSON** e insira o seguinte conteúdo:
  ```json
  {
    "nome": "Teclado Mecânico RGB",
    "preco": 320.50
  }
  ```
* Clique em **Send**.
* **Resposta esperada:** Status `201 Created` retornando o produto com o `id: 3`. 
*(Dica: Rode a requisição de listagem novamente e verá que agora existem 3 produtos no banco em memória!)*

#### C. Atualizar Produto (PUT)
* Clique em **New Request** (`Ctrl + N`).
* Nome: `Atualizar Produto`.
* Método: **`PUT`**.
* URL: `{{ _.base_url }}/produtos/1` (Note o ID `1` especificado na URL).
* Selecione **Body ➔ JSON** e altere os dados do Notebook:
  ```json
  {
    "nome": "Notebook Ultra Gamer",
    "preco": 7500.00
  }
  ```
* Clique em **Send**.
* **Resposta esperada:** Status `200 OK` retornando as informações do Notebook já atualizadas.

#### D. Remover Produto (DELETE)
* Clique em **New Request** (`Ctrl + N`).
* Nome: `Remover Produto`.
* Método: **`DELETE`**.
* URL: `{{ _.base_url }}/produtos/2` (Removendo o produto de ID `2`).
* Clique em **Send**.
* **Resposta esperada:** Status `200 OK` com a mensagem `"Produto removido com sucesso!"`.

---

## 3. Exportando e Importando Coleções (Compartilhamento)

Em times de desenvolvimento reais, é uma prática padrão que o desenvolvedor backend crie a coleção de testes no Insomnia e a exporte para enviar aos desenvolvedores frontend, facilitando a integração.

### Como Exportar a Coleção:
1. No menu superior esquerdo (ao lado do nome da Request Collection), clique na seta para baixo para abrir o menu de configurações da Coleção.
2. Clique em **Import/Export**.
3. Selecione a aba **Export Data** e clique em **Export** (selecione apenas a coleção atual).
4. Escolha o formato **Insomnia JSON** e salve o arquivo em seu computador (ex: `colecao-produtos.json`). Você pode commitar este arquivo na raiz do repositório Git do projeto!

### Como Importar:
1. No painel inicial (Dashboard) do Insomnia, clique no botão **Import**.
2. Selecione **File** e carregue o arquivo `.json` da coleção.
3. Todas as pastas, variáveis de ambiente e requisições configuradas aparecerão prontas para uso imediato!
