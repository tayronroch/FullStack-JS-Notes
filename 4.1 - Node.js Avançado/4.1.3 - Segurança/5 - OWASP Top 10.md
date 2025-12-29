# OWASP Top 10 - Vulnerabilidades Web

## O que é OWASP?

**OWASP** (Open Web Application Security Project) é uma organização sem fins lucrativos dedicada a melhorar a segurança de software.

O **OWASP Top 10** é uma lista das 10 vulnerabilidades de segurança mais críticas em aplicações web, atualizada periodicamente.

## OWASP Top 10 (2021)

### A01:2021 - Broken Access Control

**Problema:** Usuários podem acessar recursos que não deveriam.

 **Vulnerável:**
```javascript
app.delete('/users/:id', async (req, res) => {
  // Qualquer um pode deletar qualquer usuário!
  await db.users.delete(req.params.id);
  res.json({ message: 'User deleted' });
});
```

 **Seguro:**
```javascript
app.delete('/users/:id', authenticateToken, async (req, res) => {
  // Apenas admins ou o próprio usuário
  if (req.user.role !== 'admin' && req.user.userId !== parseInt(req.params.id)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  await db.users.delete(req.params.id);
  res.json({ message: 'User deleted' });
});
```

---

### A02:2021 - Cryptographic Failures

**Problema:** Dados sensíveis expostos ou mal protegidos.

 **Vulnerável:**
```javascript
// Senha em texto plano
await db.users.create({ email, password });

// HTTP ao invés de HTTPS
app.listen(3000); // Dados trafegam sem criptografia
```

 **Seguro:**
```javascript
// Hash de senha
const hashedPassword = await bcrypt.hash(password, 10);
await db.users.create({ email, password: hashedPassword });

// HTTPS obrigatório
app.use((req, res, next) => {
  if (!req.secure && process.env.NODE_ENV === 'production') {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});
```

---

### A03:2021 - Injection

**Problema:** Dados não validados são interpretados como código.

#### SQL Injection

 **Vulnerável:**
```javascript
app.get('/users', async (req, res) => {
  const { email } = req.query;

  // SQL Injection!
  const query = `SELECT * FROM users WHERE email = '${email}'`;
  // Input: ' OR '1'='1
  const users = await db.query(query);
});
```

 **Seguro:**
```javascript
app.get('/users', async (req, res) => {
  const { email } = req.query;

  // Prepared statement
  const query = 'SELECT * FROM users WHERE email = $1';
  const users = await db.query(query, [email]);
});
```

#### NoSQL Injection

 **Vulnerável:**
```javascript
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // NoSQL Injection!
  const user = await db.users.findOne({ email, password });
  // Input: { "email": {"$ne": null}, "password": {"$ne": null} }
});
```

 **Seguro:**
```javascript
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validar tipos
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const user = await db.users.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
});
```

#### Command Injection

 **Vulnerável:**
```javascript
app.get('/ping', (req, res) => {
  const { host } = req.query;

  // Command Injection!
  exec(`ping -c 4 ${host}`, (error, stdout) => {
    // Input: 8.8.8.8; rm -rf /
    res.send(stdout);
  });
});
```

 **Seguro:**
```javascript
app.get('/ping', (req, res) => {
  const { host } = req.query;

  // Validar input
  if (!/^[\w.-]+$/.test(host)) {
    return res.status(400).json({ error: 'Invalid host' });
  }

  exec(`ping -c 4 ${host}`, (error, stdout) => {
    res.send(stdout);
  });
});
```

---

### A04:2021 - Insecure Design

**Problema:** Falhas de design na arquitetura da aplicação.

 **Boas Práticas:**
- Threat modeling
- Secure design patterns
- Defense in depth
- Princípio do menor privilégio

```javascript
// Limite de tentativas de login
const loginAttempts = new Map();

app.post('/login', async (req, res) => {
  const { email } = req.body;
  const attempts = loginAttempts.get(email) || 0;

  // Bloquear após 5 tentativas
  if (attempts >= 5) {
    return res.status(429).json({ error: 'Too many attempts. Try again later.' });
  }

  // ... lógica de login

  if (!validCredentials) {
    loginAttempts.set(email, attempts + 1);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Reset em caso de sucesso
  loginAttempts.delete(email);
});
```

---

### A05:2021 - Security Misconfiguration

**Problema:** Configurações inseguras ou padrões.

 **Vulnerável:**
```javascript
// Debug mode em produção
app.set('env', 'development');

// Stack traces expostos
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.stack }); // Expõe informações
});

// CORS aberto
app.use(cors()); // Permite qualquer origem
```

 **Seguro:**
```javascript
// Ambiente correto
if (process.env.NODE_ENV === 'production') {
  app.set('env', 'production');
}

// Erros genéricos
app.use((err, req, res, next) => {
  console.error(err.stack); // Log interno
  res.status(500).json({ error: 'Internal server error' });
});

// CORS específico
app.use(cors({
  origin: ['https://meusite.com'],
  credentials: true
}));

// Headers de segurança
app.use(helmet());
```

---

### A06:2021 - Vulnerable and Outdated Components

**Problema:** Uso de bibliotecas com vulnerabilidades conhecidas.

 **Prevenção:**
```bash
# Verificar vulnerabilidades
npm audit

# Corrigir automaticamente
npm audit fix

# Forçar correção (cuidado!)
npm audit fix --force

# Ferramentas adicionais
npm install -g snyk
snyk test
snyk monitor
```

**package.json:**
```json
{
  "scripts": {
    "audit": "npm audit",
    "audit:fix": "npm audit fix"
  }
}
```

---

### A07:2021 - Identification and Authentication Failures

**Problema:** Falhas em autenticação e gerenciamento de sessão.

 **Vulnerável:**
```javascript
// Senhas fracas aceitas
app.post('/register', async (req, res) => {
  const { password } = req.body;
  await db.users.create({ password }); // Aceita "123"
});

// Sessões sem timeout
app.use(session({ maxAge: Infinity }));

// Reset sem verificação
app.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  await db.users.update({ email }, { password: newPassword });
});
```

 **Seguro:**
```javascript
// Validar força da senha
function validatePassword(password) {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
}

app.post('/register', async (req, res) => {
  const { password } = req.body;

  if (!validatePassword(password)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters with uppercase and numbers'
    });
  }

  const hash = await bcrypt.hash(password, 10);
  await db.users.create({ password: hash });
});

// Timeout de sessão
app.use(session({
  maxAge: 24 * 60 * 60 * 1000, // 24 horas
  rolling: true // Renova a cada request
}));

// Reset com token
app.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  const user = await db.users.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: new Date() }
  });

  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }

  // ... atualizar senha
});
```

---

### A08:2021 - Software and Data Integrity Failures

**Problema:** Código ou dados não verificados podem ser maliciosos.

 **Prevenção:**
```javascript
// Usar SRI (Subresource Integrity) em CDNs
<script
  src="https://cdn.example.com/library.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/ux..."
  crossorigin="anonymous"
></script>

// Validar updates automáticos
// package.json - use versões exatas
{
  "dependencies": {
    "express": "4.18.2"  // Exata, não "^4.18.2"
  }
}

// CI/CD com verificação
// .github/workflows/security.yml
- name: Run npm audit
  run: npm audit --audit-level=high
```

---

### A09:2021 - Security Logging and Monitoring Failures

**Problema:** Falta de logs ou monitoramento adequado.

 **Vulnerável:**
```javascript
app.post('/login', async (req, res) => {
  const user = await authenticate(req.body);
  res.json({ token });
  // Sem logs!
});
```

 **Seguro:**
```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

app.post('/login', async (req, res) => {
  const { email } = req.body;

  logger.info('Login attempt', {
    email,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  try {
    const user = await authenticate(req.body);

    logger.info('Login successful', { userId: user.id });

    res.json({ token });
  } catch (error) {
    logger.warn('Login failed', {
      email,
      reason: error.message,
      ip: req.ip
    });

    res.status(401).json({ error: 'Invalid credentials' });
  }
});
```

---

### A10:2021 - Server-Side Request Forgery (SSRF)

**Problema:** Servidor faz requests não autorizados.

 **Vulnerável:**
```javascript
app.get('/fetch', async (req, res) => {
  const { url } = req.query;

  // SSRF! Pode acessar recursos internos
  const response = await fetch(url);
  // Input: http://localhost:6379/
  // Input: http://169.254.169.254/latest/meta-data/

  res.send(await response.text());
});
```

 **Seguro:**
```javascript
import { URL } from 'url';

const ALLOWED_HOSTS = ['api.example.com', 'cdn.example.com'];

app.get('/fetch', async (req, res) => {
  const { url } = req.query;

  try {
    const parsedUrl = new URL(url);

    // Bloquear IPs locais
    if (parsedUrl.hostname === 'localhost' ||
        parsedUrl.hostname.startsWith('127.') ||
        parsedUrl.hostname.startsWith('192.168.') ||
        parsedUrl.hostname.startsWith('10.') ||
        parsedUrl.hostname === '169.254.169.254') {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    // Whitelist de hosts
    if (!ALLOWED_HOSTS.includes(parsedUrl.hostname)) {
      return res.status(400).json({ error: 'Host not allowed' });
    }

    const response = await fetch(url);
    res.send(await response.text());

  } catch (error) {
    res.status(400).json({ error: 'Invalid URL' });
  }
});
```

---

## Checklist de Segurança

- [ ] **A01**: Controle de acesso em todas as rotas
- [ ] **A02**: HTTPS obrigatório, senhas hasheadas
- [ ] **A03**: Prepared statements, validação de input
- [ ] **A04**: Design seguro, rate limiting
- [ ] **A05**: Helmet.js, erros genéricos, CORS configurado
- [ ] **A06**: npm audit executado, dependências atualizadas
- [ ] **A07**: Senhas fortes, sessões com timeout, 2FA
- [ ] **A08**: SRI em CDNs, verificação de integridade
- [ ] **A09**: Logs implementados, monitoramento ativo
- [ ] **A10**: Whitelist de URLs, bloqueio de IPs locais

## Recursos

- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
