# 3 - Instalando o json-server

Antes de consumir uma API real, é muito útil ter uma **API falsa** rodando localmente para testar o código. O **json-server** faz exatamente isso: ele lê um arquivo `.json` e cria automaticamente uma API REST completa a partir dele, sem escrever uma linha de back-end.

---

## 1. O que é o json-server?

O json-server é um pacote NPM que transforma um arquivo JSON em uma API funcional com suporte a todos os métodos HTTP (GET, POST, PUT, PATCH, DELETE). É amplamente usado para prototipagem e aprendizado.

- Sem configuração complexa.
- Sem banco de dados.
- Pronto para usar em minutos.

---

## 2. Instalação

Instale como dependência de desenvolvimento, já que ele é uma ferramenta de ambiente local, não algo que vai para produção:

```bash
npm install -D json-server
```

---

## 3. Criando o Arquivo de Dados

Crie um arquivo `db.json` na raiz do projeto. Ele será o "banco de dados" da sua API falsa. Cada chave de objeto vira um **endpoint**:

```json
{
  "usuarios": [
    { "id": 1, "nome": "Tayron", "email": "tayron@email.com" },
    { "id": 2, "nome": "Maria", "email": "maria@email.com" }
  ],
  "produtos": [
    { "id": 1, "nome": "Teclado", "preco": 250 },
    { "id": 2, "nome": "Mouse", "preco": 120 }
  ]
}
```

Esse arquivo gera automaticamente os endpoints:
- `GET /usuarios`
- `GET /usuarios/1`
- `GET /produtos`
- `GET /produtos/1`
- E os equivalentes de POST, PUT, PATCH e DELETE para cada um.

---

## 4. Configurando o Script no `package.json`

Adicione um script para facilitar a inicialização do servidor:

```json
{
  "scripts": {
    "api": "json-server --watch db.json --port 3001"
  }
}
```

- **`--watch`:** Faz o servidor recarregar automaticamente quando o `db.json` for alterado.
- **`--port 3001`:** Define a porta. O padrão é `3000`, mas é comum usar `3001` para não conflitar com o servidor front-end.

---

## 5. Iniciando o Servidor

```bash
npm run api
```

O terminal exibirá os endpoints disponíveis:

```
Resources
  http://localhost:3001/usuarios
  http://localhost:3001/produtos
```

---

## 6. Testando com o Fetch

Com o servidor rodando, já é possível fazer requisições normalmente:

```javascript
// Listando todos os usuários
async function listarUsuarios() {
  const resposta = await fetch("http://localhost:3001/usuarios")
  const usuarios = await resposta.json()
  console.log(usuarios)
}

// Criando um novo usuário
async function criarUsuario(dados) {
  const resposta = await fetch("http://localhost:3001/usuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  })
  const novo = await resposta.json()
  console.log("Criado:", novo)
}

listarUsuarios()
criarUsuario({ nome: "Carlos", email: "carlos@email.com" })
```

> O json-server persiste as alterações diretamente no `db.json`. Um POST real adiciona o item ao arquivo; um DELETE real o remove.

---

## Conclusão

O json-server elimina a dependência de um back-end para desenvolver e testar o front-end. Com um único arquivo JSON e um comando, você tem uma API REST completamente funcional rodando localmente, pronta para simular qualquer cenário de consumo de dados.
