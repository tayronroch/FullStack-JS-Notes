# 8 - Criando o Primeiro Servidor Node.js

Agora que já entendemos como inicializar projetos, configurar variáveis de ambiente e gerenciar importações de módulos, vamos criar a nossa primeira aplicação web funcional: um **servidor HTTP nativo** capaz de escutar requisições de rede e responder a elas.

---

## 1. O Módulo Nativo `http`

Para criar um servidor, o Node.js fornece um módulo integrado chamado **`http`**. Como vimos na aula anterior, existem duas maneiras principais de importar este módulo dependendo do sistema de importação adotado:

### A. Modo Moderno (ES Modules / Recomendado)
Se o seu projeto estiver configurado com `"type": "module"` no `package.json`, você utiliza a sintaxe oficial e moderna do ES Modules com o prefixo `node:`:
```javascript
import http from 'node:http';
```

### B. Modo Tradicional (CommonJS)
Se o seu projeto não utiliza ES Modules, você usa a função `require` padrão (também adotando o prefixo `node:` como boa prática):
```javascript
const http = require('node:http');
```

---

## 2. Escrevendo o Código do Servidor

Crie um arquivo chamado `server.js` na raiz ou na pasta `src` do seu projeto e adicione o seguinte código básico:

```javascript
// server.js (Usando ES Modules)
import http from 'node:http';

// 1. Criando o servidor HTTP
const server = http.createServer((request, response) => {
  // Configurando o cabeçalho de resposta: status 200 (OK) e formato texto UTF-8
  response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  
  // Enviando o conteúdo e finalizando a conexão
  response.end('Olá! Este é o meu primeiro servidor Node.js funcionando! 🚀');
});

// 2. Definindo a porta da rede
const PORT = 3000;

// 3. Colocando o servidor para rodar (escutar) na porta definida
server.listen(PORT, () => {
  console.log(`Servidor rodando em: http://localhost:${PORT}`);
});
```

### Explicando os Componentes Principais:

* **`http.createServer(callback)`**: Função que de fato inicializa o servidor. Ela recebe uma função de callback que será disparada **toda vez** que um usuário acessar o servidor. Esse callback nos dá dois objetos principais:
  * **`request` (ou `req`):** Contém todas as informações sobre a requisição vinda do cliente (como a URL acessada, dados enviados no cabeçalho, método HTTP utilizado, etc.).
  * **`response` (ou `res`):** Objeto que usamos para construir e enviar a resposta de volta ao cliente.
* **`response.writeHead(status, headers)`**: Envia os cabeçalhos de resposta HTTP para o cliente. O status `200` indica sucesso, e o cabeçalho `'Content-Type'` diz ao navegador que estamos devolvendo texto simples criptografado em UTF-8 (para suportar acentos e emojis).
* **`response.end(data)`**: Envia os dados finais ao cliente e sinaliza ao servidor que a resposta está completa, fechando a conexão.
* **`server.listen(PORT, callback)`**: Associa o servidor a uma porta de rede específica (no caso, a 3000) e inicia o processo de escuta ativa. A função de callback roda apenas uma vez, confirmando que o servidor foi iniciado com sucesso.

---

## 3. Testando o Servidor

1. Abra o seu terminal e execute o arquivo:
   ```bash
   node --watch server.js
   ```
2. Você verá a mensagem no console: `Servidor rodando em: http://localhost:3000`.
3. Abra o seu navegador web e acesse o endereço: [http://localhost:3000](http://localhost:3000). A mensagem será exibida na tela.
4. Para testar via linha de comando em outro terminal, você pode usar o utilitário `curl`:
   ```bash
   curl http://localhost:3000
   ```

---

## 4. Criando Rotas Simples (Routing)

No mundo real, um servidor precisa responder a diferentes caminhos (URLs) de formas diferentes. Podemos fazer isso verificando a propriedade `url` do objeto `request`:

```javascript
import http from 'node:http';

const server = http.createServer((req, res) => {
  // Definindo cabeçalho padrão para responder em formato JSON
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });

  // Criando o roteamento com base na URL
  if (req.url === '/') {
    res.end(JSON.stringify({ mensagem: "Bem-vindo à API Inicial!" }));
  } else if (req.url === '/sobre') {
    res.end(JSON.stringify({ 
      autor: "Tayron Rocha", 
      curso: "FullStack JS Notes" 
    }));
  } else {
    // Se a página não existir, alteramos o status da resposta para 404 (Not Found)
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ erro: "Rota não encontrada!" }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor de rotas rodando em: http://localhost:${PORT}`);
});
```

Experimente acessar no seu navegador:
* `http://localhost:3000/` ➔ Retorna a mensagem de boas-vindas.
* `http://localhost:3000/sobre` ➔ Retorna as informações do autor.
* `http://localhost:3000/contato` ➔ Retorna o erro 404 de rota não encontrada.

---

## 5. Por que usamos frameworks (como o Express)?

Embora o módulo `http` nativo do Node.js seja extremamente rápido e poderoso, construir uma API complexa usando apenas ele é muito trabalhoso. Você teria que escrever muitos blocos de `if/else` manuais para lidar com rotas, gerenciar cookies, ler dados enviados em formulários ou JSON, e lidar com segurança.

Por isso, na comunidade Node.js, é padrão usarmos **frameworks e roteadores** construídos sobre o módulo `http` (sendo o **Express** e o **Fastify** os mais famosos) para abstrair essa complexidade e acelerar o desenvolvimento.
