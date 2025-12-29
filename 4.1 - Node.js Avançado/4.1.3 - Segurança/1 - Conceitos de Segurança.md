# Conceitos de Segurança em Aplicações Web

## Princípios Fundamentais

### 1. Defesa em Profundidade (Defense in Depth)
Múltiplas camadas de segurança, não apenas uma.

```
┌─────────────────────┐
│  Firewall/WAF       │
├─────────────────────┤
│  HTTPS/TLS          │
├─────────────────────┤
│  Autenticação       │
├─────────────────────┤
│  Autorização        │
├─────────────────────┤
│  Validação Input    │
├─────────────────────┤
│  Sanitização Output │
└─────────────────────┘
```

### 2. Princípio do Menor Privilégio
Conceda apenas as permissões mínimas necessárias.

```javascript
//  Ruim: Permissão excessiva
if (user.isAuthenticated) {
  // Pode fazer qualquer coisa
}

//  Bom: Permissões específicas
if (user.hasPermission('posts:delete')) {
  deletePost(postId);
}
```

### 3. Validação de Input
Nunca confie em dados do usuário.

```javascript
//  Ruim: Sem validação
app.post('/users', (req, res) => {
  const user = await db.insert(req.body); // PERIGOSO!
});

//  Bom: Com validação
app.post('/users', (req, res) => {
  const { error, value } = userSchema.validate(req.body);
  if (error) return res.status(400).json({ error });

  const user = await db.insert(value);
});
```

### 4. Fail Securely
Em caso de erro, falhe de forma segura (negar acesso).

```javascript
//  Bom: Nega acesso por padrão
function checkPermission(user, resource) {
  try {
    return hasAccess(user, resource);
  } catch (error) {
    return false; // Nega acesso em caso de erro
  }
}
```

## Vulnerabilidades Comuns (OWASP Top 10)

### 1. Injection (SQL, NoSQL, Command)

**Problema:**
```javascript
//  SQL Injection
const query = `SELECT * FROM users WHERE email = '${email}'`;
// Input: ' OR '1'='1
```

**Solução:**
```javascript
//  Prepared statements
const query = 'SELECT * FROM users WHERE email = $1';
const result = await db.query(query, [email]);
```

### 2. Broken Authentication

**Problema:**
```javascript
//  Senha em texto plano
await db.insert({ email, password });
```

**Solução:**
```javascript
//  Hash de senha
const hashedPassword = await bcrypt.hash(password, 10);
await db.insert({ email, password: hashedPassword });
```

### 3. Sensitive Data Exposure

**Problema:**
```javascript
//  Retorna senha
res.json(user); // { id, email, password }
```

**Solução:**
```javascript
//  Remove campos sensíveis
const { password, ...safeUser } = user;
res.json(safeUser);
```

### 4. XML External Entities (XXE)

**Problema:**
```javascript
//  Parser XML inseguro
const parser = new xml2js.Parser();
```

**Solução:**
```javascript
//  Desabilita entidades externas
const parser = new xml2js.Parser({
  xmlns: false,
  explicitArray: false
});
```

### 5. Broken Access Control

**Problema:**
```javascript
//  Sem verificação de propriedade
app.delete('/posts/:id', async (req, res) => {
  await Post.delete(req.params.id); // Qualquer um pode deletar!
});
```

**Solução:**
```javascript
//  Verifica propriedade
app.delete('/posts/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.authorId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  await post.delete();
});
```

### 6. Security Misconfiguration

**Problema:**
```javascript
//  Mensagens de erro verbosas
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.stack });
});
```

**Solução:**
```javascript
//  Mensagens genéricas
app.use((err, req, res, next) => {
  console.error(err.stack); // Log interno
  res.status(500).json({ error: 'Internal Server Error' });
});
```

### 7. Cross-Site Scripting (XSS)

**Problema:**
```javascript
//  Renderiza HTML sem sanitizar
<div>{userInput}</div>
```

**Solução:**
```javascript
//  Escapa HTML
import DOMPurify from 'dompurify';
<div>{DOMPurify.sanitize(userInput)}</div>
```

### 8. Insecure Deserialization

**Problema:**
```javascript
//  Deserialização insegura
const data = JSON.parse(untrustedInput);
eval(data.code); // MUITO PERIGOSO!
```

**Solução:**
```javascript
//  Validação após deserialização
const data = JSON.parse(input);
const validated = schema.validate(data);
```

### 9. Using Components with Known Vulnerabilities

**Solução:**
```bash
# Verificar vulnerabilidades
npm audit

# Corrigir automaticamente
npm audit fix

# Usar ferramentas
npm install -g snyk
snyk test
```

### 10. Insufficient Logging & Monitoring

**Problema:**
```javascript
//  Sem logs
app.post('/login', async (req, res) => {
  const user = await authenticate(req.body);
  res.json({ token });
});
```

**Solução:**
```javascript
//  Com logs
app.post('/login', async (req, res) => {
  const { email } = req.body;

  logger.info('Login attempt', { email, ip: req.ip });

  try {
    const user = await authenticate(req.body);
    logger.info('Login successful', { userId: user.id });
    res.json({ token });
  } catch (error) {
    logger.warn('Login failed', { email, reason: error.message });
    res.status(401).json({ error: 'Invalid credentials' });
  }
});
```

## Headers de Segurança

```javascript
import helmet from 'helmet';

app.use(helmet()); // Configura vários headers automaticamente

// Ou manualmente:
app.use((req, res, next) => {
  // Previne XSS
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Previne clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Previne MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // HSTS (HTTPS obrigatório)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // Content Security Policy
  res.setHeader('Content-Security-Policy', "default-src 'self'");

  next();
});
```

## Rate Limiting

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requests
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);

// Rate limit específico para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts'
});

app.post('/login', loginLimiter, loginHandler);
```

## CORS Seguro

```javascript
import cors from 'cors';

//  Ruim: Permite todos
app.use(cors());

//  Bom: Específico
app.use(cors({
  origin: ['https://meusite.com'],
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Variáveis de Ambiente

```javascript
//  Ruim: Credenciais no código
const dbPassword = 'senha123';

//  Bom: Variáveis de ambiente
const dbPassword = process.env.DB_PASSWORD;

// Validação de variáveis
if (!process.env.DB_PASSWORD) {
  throw new Error('DB_PASSWORD not set');
}
```

## Checklist de Segurança

### Autenticação
- [ ] Senhas hasheadas com bcrypt/argon2
- [ ] Rate limiting em login
- [ ] Timeout de sessão
- [ ] Logout invalidam tokens

### Autorização
- [ ] Verificar permissões em TODAS as rotas
- [ ] Princípio do menor privilégio
- [ ] RBAC (Role-Based Access Control) implementado

### Dados
- [ ] Validação de input
- [ ] Sanitização de output
- [ ] Prepared statements (SQL)
- [ ] Campos sensíveis não retornados

### Comunicação
- [ ] HTTPS obrigatório
- [ ] HSTS habilitado
- [ ] Cookies com flags secure e httpOnly

### Configuração
- [ ] Helmet.js instalado
- [ ] CORS configurado corretamente
- [ ] Mensagens de erro genéricas
- [ ] Logs implementados

### Dependências
- [ ] npm audit executado
- [ ] Dependências atualizadas
- [ ] Snyk ou similar configurado

## Recursos

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
