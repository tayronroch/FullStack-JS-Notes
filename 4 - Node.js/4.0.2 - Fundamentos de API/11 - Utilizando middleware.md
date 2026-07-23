# 11 - Utilizando Middleware na Prática

Na aula anterior, entendemos o conceito teórico dos middlewares e como eles se comportam na arquitetura de rede. Nesta aula, colocaremos a mão na massa e aprenderemos como estruturar, criar e aplicar middlewares reais em uma aplicação Node.js (usando o Express como referência de mercado).

---

## 1. Organização do Projeto

Em projetos reais, é uma boa prática organizar os middlewares em uma pasta dedicada para manter o código do arquivo principal (`server.js` ou `app.js`) limpo e legível.

Estrutura recomendada:
```text
src/
├── middlewares/
│   ├── logger.js
│   └── validador-usuario.js
├── routes.js
└── server.js
```

---

## 2. Passo a Passo: Criando seu Primeiro Middleware Customizado

Vamos criar um middleware de logs que registra informações de cada requisição em um arquivo ou no console.

### Passo 1: Escrever a função middleware (`src/middlewares/logger.js`)
```javascript
export function loggerMiddleware(req, res, next) {
  const { method, url } = req;
  const start = Date.now();

  // O Express permite ouvir quando a resposta terminar de ser enviada
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[LOG] ${method} ${url} - Status: ${res.statusCode} (${duration}ms)`);
  });

  next(); // Passa o controle para o próximo middleware ou rota
}
```

### Passo 2: Registrar o middleware globalmente (`src/server.js`)
Para que o logger seja executado em todas as requisições, nós o registramos logo no início do servidor usando `app.use()`:

```javascript
import express from 'express';
import { loggerMiddleware } from './middlewares/logger.js';

const app = express();

// Aplica o middleware de log globalmente
app.use(loggerMiddleware);

app.get('/produtos', (req, res) => {
  res.json([{ id: 1, nome: "Teclado" }]);
});

app.listen(3333);
```

---

## 3. Criando um Middleware de Validação de Dados

Agora, criaremos um middleware para validar o corpo de uma requisição. Esse middleware será aplicado de forma **local** (apenas na rota de criação de usuários).

### Passo 1: Criar o validador (`src/middlewares/validador-usuario.js`)
```javascript
export function validarCriacaoUsuario(req, res, next) {
  const { name, email } = req.body || {};

  if (!name || !email) {
    // Retorna erro 400 e interrompe o ciclo (não chama next())
    return res.status(400).json({ 
      erro: "Os campos 'name' e 'email' são obrigatórios para o cadastro." 
    });
  }

  // Se o e-mail não tiver arroba (validação simples)
  if (!email.includes('@')) {
    return res.status(400).json({ erro: "E-mail inválido." });
  }

  next(); // Se os dados forem válidos, permite continuar
}
```

### Passo 2: Aplicar o middleware na rota (`src/server.js`)

```javascript
import express from 'express';
import { validarCriacaoUsuario } from './middlewares/validador-usuario.js';

const app = express();
app.use(express.json()); // Middleware integrado para ler JSON

// Rota POST protegida pelo middleware de validação
app.post('/usuarios', validarCriacaoUsuario, (req, res) => {
  const { name, email } = req.body;

  // A lógica da rota só é executada se passar pela validação!
  res.status(201).json({ 
    mensagem: "Usuário criado com sucesso!",
    usuario: { name, email }
  });
});
```

---

## 4. Compartilhando Dados entre Middlewares

Uma das capacidades mais fantásticas dos middlewares é a modificação dos objetos `req` (request) e `res` (response). Como o mesmo objeto `req` passa por toda a pilha de execução, podemos anexar dados a ele para serem lidos posteriormente.

### Exemplo: Middleware de Autenticação / Identificação de Usuário
```javascript
// src/middlewares/autenticar.js
export function autenticarUsuario(req, res, next) {
  const token = req.headers.authorization;

  if (token === "token-valido-123") {
    // Anexa os dados do usuário autenticado diretamente na requisição
    req.usuarioLogado = { id: 42, nome: "Tayron", papel: "admin" };
    return next();
  }

  return res.status(401).json({ erro: "Acesso não autorizado." });
}
```

Uso na rota:
```javascript
app.get('/perfil', autenticarUsuario, (req, res) => {
  // A rota tem acesso imediato aos dados anexados pelo middleware anterior!
  const usuario = req.usuarioLogado; 
  res.json({ mensagem: `Olá ${usuario.nome}, aqui está seu perfil.` });
});
```

---

## 5. Ordem de Execução é Tudo!

O Express executa os middlewares exatamente na ordem em que foram declarados com `app.use()` ou na lista de argumentos da rota. 

Veja este fluxo:
```javascript
app.use(middlewareA);
app.use(middlewareB);

app.get('/teste', middlewareC, (req, res) => {
  res.send("Finalizado!");
});
```
* **Fluxo da Requisição**: `middlewareA` -> `middlewareB` -> `middlewareC` -> Rota Handler.
* Se o `middlewareA` falhar e não chamar `next()`, a execução é interrompida imediatamente.
* Se você registrar um middleware global **depois** de declarar as rotas, ele não será executado para aquelas rotas.
