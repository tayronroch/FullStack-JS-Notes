# JWT (JSON Web Tokens)

## O que é JWT?

JWT é um padrão aberto (RFC 7519) para transmitir informações de forma segura entre partes como um objeto JSON. É usado principalmente para **autenticação** e **troca de informações**.

## Estrutura de um JWT

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTY4NzM2NjQwMCwiZXhwIjoxNjg3NDUyODAwfQ.9j3xK5mN_qR7sT8uV2wX3yZ4A5bC6dE7fG8hI9jK0lM

├── HEADER       ├── PAYLOAD        ├── SIGNATURE
```

### 1. Header (Cabeçalho)
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### 2. Payload (Dados)
```json
{
  "userId": 1,
  "email": "test@example.com",
  "iat": 1687366400,
  "exp": 1687452800
}
```

### 3. Signature (Assinatura)
```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

## Instalação

```bash
npm install jsonwebtoken
```

## Criando JWT

```javascript
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

// Gerar token
function generateToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };

  const options = {
    expiresIn: '24h', // Expira em 24 horas
    issuer: 'minha-app',
    audience: 'usuarios'
  };

  return jwt.sign(payload, SECRET_KEY, options);
}

// Uso
const token = generateToken({ id: 1, email: 'user@example.com', role: 'user' });
console.log(token);
```

## Verificando JWT

```javascript
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return { valid: true, data: decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

// Uso
const result = verifyToken(token);
if (result.valid) {
  console.log('User ID:', result.data.userId);
} else {
  console.error('Invalid token:', result.error);
}
```

## Middleware de Autenticação

```javascript
function authenticateToken(req, res, next) {
  // Extrair token do header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  // Verificar token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
      return res.status(403).json({ error: 'Invalid token' });
    }

    // Adicionar dados do usuário na request
    req.user = decoded;
    next();
  });
}

// Uso em rotas
app.get('/profile', authenticateToken, (req, res) => {
  res.json({
    userId: req.user.userId,
    email: req.user.email
  });
});
```

## Access Token + Refresh Token

### Conceito

- **Access Token**: Curta duração (15min - 1h), usado em cada request
- **Refresh Token**: Longa duração (7-30 dias), usado para obter novo access token

### Implementação

```javascript
// Gerar tokens
function generateTokens(user) {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validar credenciais
  const user = await authenticateUser(email, password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Gerar tokens
  const { accessToken, refreshToken } = generateTokens(user);

  // Salvar refresh token no banco
  await db.refreshTokens.create({
    userId: user.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  res.json({ accessToken, refreshToken });
});

// Renovar access token
app.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }

  // Verificar se existe no banco
  const storedToken = await db.refreshTokens.findOne({ token: refreshToken });
  if (!storedToken) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }

  // Verificar validade
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Gerar novo access token
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken });

  } catch (error) {
    // Token expirado ou inválido - remover do banco
    await db.refreshTokens.delete({ token: refreshToken });
    return res.status(403).json({ error: 'Refresh token expired' });
  }
});

// Logout
app.post('/logout', authenticateToken, async (req, res) => {
  const { refreshToken } = req.body;

  // Remover refresh token do banco
  await db.refreshTokens.delete({ token: refreshToken });

  res.json({ message: 'Logged out successfully' });
});
```

## Claims Reservados

```javascript
const payload = {
  // Claims reservados
  iss: 'minha-app',              // Issuer (emissor)
  sub: '1234567890',             // Subject (assunto/usuário)
  aud: 'usuarios',               // Audience (audiência)
  exp: Math.floor(Date.now() / 1000) + (60 * 60), // Expiration time
  nbf: Math.floor(Date.now() / 1000), // Not Before
  iat: Math.floor(Date.now() / 1000), // Issued At
  jti: 'abc123',                 // JWT ID (identificador único)

  // Claims customizados
  userId: 1,
  email: 'user@example.com',
  role: 'admin'
};

const token = jwt.sign(payload, SECRET_KEY);
```

## Algoritmos de Assinatura

### Simétrico (HMAC)
```javascript
// Mesma chave para assinar e verificar
const token = jwt.sign(payload, SECRET_KEY, { algorithm: 'HS256' });
```

### Assimétrico (RSA)
```javascript
import fs from 'fs';

const privateKey = fs.readFileSync('private.key');
const publicKey = fs.readFileSync('public.key');

// Assinar com chave privada
const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

// Verificar com chave pública
const decoded = jwt.verify(token, publicKey);
```

## Erros Comuns

```javascript
try {
  const decoded = jwt.verify(token, SECRET_KEY);
} catch (error) {
  if (error.name === 'TokenExpiredError') {
    console.log('Token expirado em:', error.expiredAt);
  }

  if (error.name === 'JsonWebTokenError') {
    console.log('Token inválido:', error.message);
  }

  if (error.name === 'NotBeforeError') {
    console.log('Token ainda não é válido:', error.date);
  }
}
```

## Armazenamento no Cliente

###  localStorage/sessionStorage
```javascript
// VULNERÁVEL A XSS
localStorage.setItem('token', token);
```

###  httpOnly Cookie
```javascript
// Servidor
res.cookie('token', token, {
  httpOnly: true,   // Não acessível via JavaScript
  secure: true,     // Apenas HTTPS
  sameSite: 'strict', // Previne CSRF
  maxAge: 24 * 60 * 60 * 1000 // 24 horas
});

// Middleware para ler cookie
function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
}
```

## Decodificar sem Verificar

```javascript
// Apenas decodifica (NÃO verifica assinatura)
const decoded = jwt.decode(token);
console.log(decoded); // { userId: 1, email: 'user@example.com', ... }

// Com informações completas
const decoded = jwt.decode(token, { complete: true });
console.log(decoded.header);  // { alg: 'HS256', typ: 'JWT' }
console.log(decoded.payload); // { userId: 1, ... }
console.log(decoded.signature); // '9j3xK5mN...'
```

## Boas Práticas

###  Fazer

1. **Use HTTPS**
   - JWT pode ser interceptado sem HTTPS

2. **Defina expiração**
   ```javascript
   jwt.sign(payload, secret, { expiresIn: '1h' });
   ```

3. **Valide claims**
   ```javascript
   jwt.verify(token, secret, {
     issuer: 'minha-app',
     audience: 'usuarios'
   });
   ```

4. **Use chave forte**
   ```bash
   # Gerar chave segura
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

5. **Armazene em httpOnly cookies**

6. **Implemente refresh tokens**

###  Evitar

1. **Não armazene dados sensíveis**
   ```javascript
   //  NUNCA faça isso
   const payload = { userId: 1, password: 'senha123' };
   ```

2. **Não use sem expiração**
   ```javascript
   //  Token eterno
   const token = jwt.sign(payload, secret);
   ```

3. **Não ignore verificação**
   ```javascript
   //  Perigoso
   const data = jwt.decode(token); // Sem verificar assinatura
   ```

## Exemplo Completo

```javascript
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser());

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await db.users.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  await db.refreshTokens.create({ userId: user.id, token: refreshToken });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({ accessToken });
});

// Refresh
app.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }

  const storedToken = await db.refreshTokens.findOne({ token: refreshToken });
  if (!storedToken) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken });
  } catch (error) {
    await db.refreshTokens.delete({ token: refreshToken });
    return res.status(403).json({ error: 'Token expired' });
  }
});

// Logout
app.post('/logout', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  await db.refreshTokens.delete({ token: refreshToken });
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
});

app.listen(3000);
```

## Recursos

- [JWT.io](https://jwt.io/) - Decodificador online
- [RFC 7519](https://tools.ietf.org/html/rfc7519) - Especificação JWT
