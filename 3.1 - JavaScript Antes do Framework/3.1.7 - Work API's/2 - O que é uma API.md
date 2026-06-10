# 2 - O que é uma API

Ao fazer uma requisição com `fetch()`, você está se comunicando com uma **API**. Entender o que ela é e como ela funciona é essencial para trabalhar com qualquer dado externo no JavaScript.

---

## 1. Definição

**API (Application Programming Interface)** é uma interface que permite que dois sistemas se comuniquem. No contexto web, uma API é um servidor que expõe **endpoints** (endereços) pelos quais você pode pedir ou enviar dados.

Pense assim: você não precisa saber como o banco de dados interno do Twitter funciona. Você só precisa chamar o endpoint correto e ele te devolve os dados no formato combinado.

```
Seu App  →  GET /tweets/123  →  API do Twitter
Seu App  ←  { id: 123, text: "..." }  ←  API do Twitter
```

---

## 2. A Relação Cliente-Servidor

Toda comunicação com uma API segue o modelo **Cliente-Servidor**, onde cada lado tem uma responsabilidade clara:

- **Cliente:** É quem faz a requisição. Pode ser um navegador, um app mobile ou até outro servidor. No nosso caso, é o código JavaScript rodando no browser.
- **Servidor:** É quem recebe a requisição, processa e devolve uma resposta. É onde a API vive.

```
┌──────────────┐        Requisição (GET /produtos)       ┌──────────────┐
│              │  ─────────────────────────────────────► │              │
│   CLIENTE    │                                         │   SERVIDOR   │
│  (Seu App)   │  ◄───────────────────────────────────── │   (API)      │
│              │        Resposta (200 + JSON)            │              │
└──────────────┘                                         └──────────────┘
```

O cliente **nunca acessa o banco de dados diretamente** — ele só conversa com a API, que decide o que retornar. Isso isola a lógica e protege os dados.

---

## 3. APIs Gratuitas e Pagas

Nem toda API é de acesso livre. Elas se dividem basicamente em dois tipos:

### Gratuitas (Free)

Disponibilizam acesso sem custo, geralmente com um limite de requisições por dia ou por mês. Ótimas para aprender e para projetos pequenos.

- **Exemplos:** JSONPlaceholder, ViaCEP, Open Meteo (clima), PokeAPI.

### Pagas

Cobram conforme o uso (por requisição ou por plano). Normalmente oferecem mais dados, mais confiabilidade e suporte.

- **Exemplos:** Google Maps API, Stripe (pagamentos), Twilio (SMS), OpenAI.

> A maioria das APIs pagas oferece uma **camada gratuita (free tier)** com um volume limitado de uso, permitindo desenvolver e testar sem custo até atingir um certo limite.

---

## 4. REST: O Padrão Mais Usado

A grande maioria das APIs web segue o padrão **REST (Representational State Transfer)**. Nele, os recursos (usuários, produtos, posts) são identificados por **URLs**, e a **ação** que você quer fazer é definida pelo **método HTTP**.

### Métodos HTTP

| Método     | Ação                              | Exemplo              |
| :--------- | :-------------------------------- | :------------------- |
| **GET**    | Buscar/Ler dados                  | `GET /usuarios`      |
| **POST**   | Criar um novo recurso             | `POST /usuarios`     |
| **PUT**    | Substituir um recurso completo    | `PUT /usuarios/1`    |
| **PATCH**  | Atualizar parcialmente um recurso | `PATCH /usuarios/1`  |
| **DELETE** | Remover um recurso                | `DELETE /usuarios/1` |

---

## 5. Códigos de Status HTTP

Toda resposta de uma API vem acompanhada de um **código de status** que indica o resultado da operação. Eles são agrupados por faixas:

| Faixa   | Significado      | Exemplos                                               |
| :------ | :--------------- | :----------------------------------------------------- |
| **2xx** | Sucesso          | `200 OK`, `201 Created`                                |
| **3xx** | Redirecionamento | `301 Moved Permanently`                                |
| **4xx** | Erro do cliente  | `400 Bad Request`, `401 Unauthorized`, `404 Not Found` |
| **5xx** | Erro do servidor | `500 Internal Server Error`                            |

> Os mais importantes para o dia a dia: `200` (tudo certo), `201` (criado com sucesso), `401` (não autenticado), `404` (não encontrado) e `500` (erro interno no servidor).

---

## 6. O Formato JSON

**JSON (JavaScript Object Notation)** é um formato de texto usado para representar e transportar dados entre sistemas. Apesar do nome mencionar JavaScript, ele é independente de linguagem — praticamente toda linguagem moderna consegue ler e gerar JSON.

A ideia é simples: ao invés de inventar um formato proprietário, a API devolve os dados como um texto padronizado que qualquer sistema entende.

```json
{
  "id": 1,
  "nome": "Tayron",
  "email": "tayron@email.com",
  "ativo": true,
  "tags": ["dev", "js"]
}
```

### Regras básicas do JSON
- Chaves e valores de texto sempre entre **aspas duplas** `"`.
- Suporta os tipos: `string`, `number`, `boolean`, `null`, `array` e `object`.
- Não aceita comentários nem vírgula no último item.

### No JavaScript
O navegador recebe o JSON como texto puro. O `fetch()` cuida da conversão:

```javascript
const dados = await resposta.json()    // texto JSON → objeto JS
const texto = JSON.stringify(usuario)  // objeto JS → texto JSON
```

---

## 7. Anatomia de uma URL de API

```
https://api.exemplo.com/v1/usuarios/42?campos=nome,email
│         │              │  │        │  └─ Query String (filtros/opções)
│         │              │  │        └─── ID do recurso específico
│         │              │  └─────────── Recurso (endpoint)
│         │              └────────────── Versão da API
│         └───────────────────────────── Domínio
└─────────────────────────────────────── Protocolo
```

- **Versão (`/v1`):** APIs bem mantidas incluem a versão na URL para que mudanças futuras não quebrem quem usa a versão antiga.
- **Query String (`?campos=...`):** Parâmetros opcionais para filtrar, paginar ou ordenar os resultados.

---

## 8. Fazendo Requisições com Diferentes Métodos

O `fetch()` usa `GET` por padrão. Para outros métodos, você passa um objeto de configuração:

```javascript
// POST — criando um novo recurso
async function criarUsuario(novoUsuario) {
  const resposta = await fetch("https://api.exemplo.com/usuarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(novoUsuario),
  });

  return await resposta.json();
}

criarUsuario({ nome: "Tayron", email: "tayron@email.com" });
```

```javascript
// DELETE — removendo um recurso
async function removerUsuario(id) {
  const resposta = await fetch(`https://api.exemplo.com/usuarios/${id}`, {
    method: "DELETE",
  });

  console.log(resposta.ok); // true se removido com sucesso
}
```

---

## Conclusão

Uma API REST é essencialmente um contrato: ela define quais URLs existem, quais métodos cada uma aceita e o que ela devolve. Entender os **métodos HTTP**, os **códigos de status** e o **formato JSON** é tudo que você precisa para consumir qualquer API pública ou construída pela sua equipe.
