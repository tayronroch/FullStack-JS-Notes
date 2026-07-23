# 2 - Salvando usuários em memória

Antes de integrarmos completamente a nossa API com a persistência em arquivos físicos (como o `db.json`), precisamos entender como estruturar o fluxo de dados em memória de forma limpa e profissional dentro de nossas rotas.

Nesta aula, aprenderemos a gerar identificadores únicos universais (UUID) usando o módulo nativo **`node:crypto`** do Node.js e a preparar os objetos de usuários para inserção no banco de dados.

---

## 1. Gerando IDs Únicos com `node:crypto`

Em qualquer banco de dados, cada registro precisa de uma chave primária única (ID) para identificá-lo. 

Em aplicações Node.js modernas, em vez de criarmos números sequenciais simples (que são fáceis de adivinhar e podem gerar conflitos), costumamos utilizar **UUIDs** (Universally Unique Identifiers).

O Node.js possui um módulo nativo chamado **`crypto`** que possui a função **`randomUUID()`**, gerando strings aleatórias únicas e padronizadas:

```javascript
import { randomUUID } from 'node:crypto';

const novoId = randomUUID();
console.log(novoId); // Exemplo: "d3b07384-d113-4ec6-a5d6-c0cfd5d04278"
```

---

## 2. Estruturando o Objeto do Usuário

Ao recebermos uma requisição `POST /users`, coletamos as informações enviadas pelo cliente no corpo da requisição (`request.body`) e montamos o objeto completo contendo o novo `id` gerado:

```javascript
const { name, email } = request.body;

const novoUsuario = {
  id: randomUUID(),
  name,
  email,
};
```

---

## 3. Implementando a Rota no Servidor (`src/routes.js`)

Vamos ver como fica o arquivo de rotas simulando a inserção de usuários usando a classe `Database` que criamos. 

```javascript
import { randomUUID } from 'node:crypto';
import { Database } from './database.js';

const database = new Database();

export const routes = [
  {
    method: 'POST',
    path: '/users',
    controller: (request, response) => {
      const { name, email } = request.body || {};

      // Validação básica
      if (!name || !email) {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        return response.end(JSON.stringify({ erro: "Campos 'name' e 'email' são obrigatórios." }));
      }

      // Cria a estrutura do objeto em memória
      const user = {
        id: randomUUID(),
        name,
        email
      };

      // Insere o objeto na tabela 'users'
      database.insert('users', user);

      // Retorna o status 201 (Created) e o usuário criado
      response.writeHead(201, { 'Content-Type': 'application/json' });
      return response.end(JSON.stringify(user));
    }
  },
  {
    method: 'GET',
    path: '/users',
    controller: (request, response) => {
      // Busca todos os usuários da tabela 'users'
      const users = database.select('users');

      response.writeHead(200, { 'Content-Type': 'application/json' });
      return response.end(JSON.stringify(users));
    }
  }
];
```

---

## 4. Por que essa abordagem é resiliente?

Como nossa classe `Database` é instanciada apenas uma vez no arquivo de rotas (ou no servidor) e reaproveitada:
1. Os dados inseridos no array interno do banco de dados ficam guardados na memória (RAM) de forma estruturada.
2. Sempre que inserimos um novo usuário via `POST`, ele é adicionado na memória e instantaneamente salvo no arquivo pelo método `#persist()`.
3. Se o servidor for reiniciado, a classe `Database` lê o arquivo no construtor e repopula a lista em memória, evitando que o estado se perca.
