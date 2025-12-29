# Bcrypt e Hash de Senhas

## Por que NÃO armazenar senhas em texto plano?

 **NUNCA faça isso:**
```javascript
// PÉSSIMA PRÁTICA!
await db.users.create({
  email: 'user@example.com',
  password: 'senha123' // Texto plano!
});
```

**Problemas:**
1. Vazamento de dados expõe todas as senhas
2. Funcionários podem ver senhas dos usuários
3. Violação de privacidade e regulamentações (LGPD, GDPR)

## O que é Hashing?

**Hashing** é um processo **unidirecional** que transforma a senha em uma string fixa.

```
Senha: "senha123"
      ↓ (hash)
Hash: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
```

Características:
-  Irreversível (não pode voltar para senha original)
-  Determinístico (mesma entrada = mesma saída)
-  Rápido para calcular
-  Pequenas mudanças na entrada causam grande mudança no hash

## Por que Bcrypt?

### Comparação de Algoritmos

| Algoritmo | Segurança | Velocidade | Recomendado |
|-----------|-----------|------------|-------------|
| MD5 |  Quebrado | Muito rápido |  NÃO |
| SHA1 |  Quebrado | Muito rápido |  NÃO |
| SHA256 |  Não ideal | Rápido |  Não para senhas |
| **Bcrypt** |  Seguro | Lento (proposital) |  **SIM** |
| Argon2 |  Muito seguro | Configurável |  SIM |

### Vantagens do Bcrypt

1. **Salt automático**: Previne rainbow tables
2. **Adaptativo**: Pode aumentar custo computacional
3. **Resistente a brute force**: Lento por design

## Instalação

```bash
npm install bcrypt
```

## Uso Básico

### Criar Hash

```javascript
import bcrypt from 'bcrypt';

async function hashPassword(password) {
  const saltRounds = 10; // Custo computacional
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

// Uso
const hash = await hashPassword('senha123');
console.log(hash);
// $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
```

### Verificar Senha

```javascript
async function verifyPassword(password, hash) {
  const match = await bcrypt.compare(password, hash);
  return match; // true ou false
}

// Uso
const isValid = await verifyPassword('senha123', hash);
console.log(isValid); // true

const isInvalid = await verifyPassword('senhaErrada', hash);
console.log(isInvalid); // false
```

## Salt Rounds

**Salt Rounds** define o custo computacional (2^saltRounds iterações).

```javascript
const saltRounds = 10; // 2^10 = 1024 iterações

// Mais seguro, mas mais lento
const saltRounds = 12; // 2^12 = 4096 iterações
```

### Recomendações

| Salt Rounds | Tempo aprox. | Uso |
|-------------|--------------|-----|
| 8 | ~40ms | Desenvolvimento |
| 10 | ~100ms | **Recomendado** |
| 12 | ~400ms | Alta segurança |
| 14 | ~1.6s | Muito alta segurança |

## Implementação Completa

### Registro de Usuário

```javascript
import express from 'express';
import bcrypt from 'bcrypt';

const app = express();
app.use(express.json());

app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validações
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Verificar se usuário já existe
    const existingUser = await db.users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await db.users.create({
      email,
      password: hashedPassword
    });

    res.status(201).json({
      id: user.id,
      email: user.email
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Login

```javascript
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuário
    const user = await db.users.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Gerar token (JWT)
    const token = generateToken(user);

    res.json({ token });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Trocar Senha

```javascript
app.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Buscar usuário
    const user = await db.users.findById(req.user.userId);

    // Verificar senha atual
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Validar nova senha
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualizar
    await db.users.update(user.id, { password: hashedPassword });

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Reset de Senha

```javascript
import crypto from 'crypto';

// Solicitar reset
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  const user = await db.users.findOne({ email });
  if (!user) {
    // NÃO revele que o email não existe
    return res.json({ message: 'If the email exists, a reset link was sent' });
  }

  // Gerar token único
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = await bcrypt.hash(resetToken, 10);

  // Salvar no banco com expiração
  await db.users.update(user.id, {
    resetToken: resetTokenHash,
    resetTokenExpires: new Date(Date.now() + 3600000) // 1 hora
  });

  // Enviar email (implementação depende do serviço de email)
  await sendEmail({
    to: email,
    subject: 'Password Reset',
    text: `Reset link: https://myapp.com/reset-password?token=${resetToken}`
  });

  res.json({ message: 'If the email exists, a reset link was sent' });
});

// Redefinir senha
app.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  // Buscar usuário com token válido
  const users = await db.users.find({
    resetTokenExpires: { $gt: new Date() }
  });

  let user = null;
  for (const u of users) {
    const validToken = await bcrypt.compare(token, u.resetToken);
    if (validToken) {
      user = u;
      break;
    }
  }

  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }

  // Hash da nova senha
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Atualizar senha e remover token
  await db.users.update(user.id, {
    password: hashedPassword,
    resetToken: null,
    resetTokenExpires: null
  });

  res.json({ message: 'Password reset successful' });
});
```

## Versão Síncrona (Não Recomendada)

```javascript
// Versão assíncrona (recomendada)
const hash = await bcrypt.hash(password, 10);

// Versão síncrona (bloqueia o event loop)
const hash = bcrypt.hashSync(password, 10);

// Comparação
const match = await bcrypt.compare(password, hash);  //  Recomendado
const match = bcrypt.compareSync(password, hash);    //  Evitar
```

## Geração Manual de Salt

```javascript
// Automático (recomendado)
const hash = await bcrypt.hash(password, 10);

// Manual
const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(password, salt);
```

## Entendendo o Hash Bcrypt

```
$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
│ │ │  │                                                        │
│ │ │  └─ Salt (22 caracteres)                                 └─ Hash (31 caracteres)
│ │ └─ Cost factor (salt rounds)
│ └─ Minor version
└─ Algorithm identifier
```

## Boas Práticas

###  Fazer

1. **Use salt rounds adequado**
   ```javascript
   const hash = await bcrypt.hash(password, 10);
   ```

2. **Valide senha antes de hash**
   ```javascript
   if (password.length < 8) {
     throw new Error('Password too short');
   }
   ```

3. **Nunca logue senhas**
   ```javascript
   //  NUNCA
   console.log('Password:', password);

   //  OK
   console.log('Password hash:', hash);
   ```

4. **Use async/await**
   ```javascript
   const hash = await bcrypt.hash(password, 10); // 
   ```

5. **Mensagens de erro genéricas**
   ```javascript
   //  Revela informação
   return res.status(401).json({ error: 'User not found' });

   //  Genérico
   return res.status(401).json({ error: 'Invalid credentials' });
   ```

###  Evitar

1. **Não use saltRounds muito baixo**
   ```javascript
   bcrypt.hash(password, 4); //  Muito fraco
   ```

2. **Não armazene senha original**
   ```javascript
   //  NUNCA
   await db.users.create({
     email,
     password,           // Texto plano
     hashedPassword: hash
   });
   ```

3. **Não use MD5/SHA sem salt**
   ```javascript
   //  Inseguro
   const hash = crypto.createHash('md5').update(password).digest('hex');
   ```

## Alternativas ao Bcrypt

### Argon2 (Mais Moderno)

```bash
npm install argon2
```

```javascript
import argon2 from 'argon2';

// Hash
const hash = await argon2.hash(password);

// Verificar
const match = await argon2.verify(hash, password);
```

### Scrypt (Nativo do Node.js)

```javascript
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString('hex')}.${salt}`;
}

async function verifyPassword(password, hash) {
  const [hashedPassword, salt] = hash.split('.');
  const buf = await scryptAsync(password, salt, 64);
  return buf.toString('hex') === hashedPassword;
}
```

## Checklist de Segurança

- [ ] Senhas hasheadas com bcrypt (salt rounds >= 10)
- [ ] Senhas nunca logadas ou expostas
- [ ] Validação de força de senha
- [ ] Mensagens de erro genéricas
- [ ] Rate limiting em login e registro
- [ ] Reset de senha com token temporário
- [ ] Função async/await (não sync)
