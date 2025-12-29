# Autenticação e Autorização

## Diferença entre Autenticação e Autorização

### Autenticação (Authentication)
**"Quem é você?"**
- Verifica a identidade do usuário
- Login com email/senha
- Login social (Google, Facebook)
- Biometria, 2FA

### Autorização (Authorization)
**"O que você pode fazer?"**
- Verifica permissões do usuário
- Controle de acesso a recursos
- Roles e permissões
- RBAC, ABAC

```
┌─────────────────┐
│  Autenticação   │ → Login com email/senha → Usuário autenticado
└─────────────────┘

┌─────────────────┐
│  Autorização    │ → Verificar se pode acessar /admin → Permitido/Negado
└─────────────────┘
```

## Autenticação

### 1. Autenticação com Sessões

```javascript
// app.js
import express from 'express';
import session from 'express-session';
import bcrypt from 'bcrypt';

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // Apenas HTTPS
    httpOnly: true, // Não acessível via JavaScript
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Registro
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Validar dados
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Salvar usuário
  const user = await db.users.create({
    email,
    password: hashedPassword
  });

  res.status(201).json({ id: user.id, email: user.email });
});

// Login
app.post('/login', async (req, res) => {
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

  // Criar sessão
  req.session.userId = user.id;
  req.session.email = user.email;

  res.json({ message: 'Login successful' });
});

// Logout
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
});

// Middleware de autenticação
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Rota protegida
app.get('/profile', requireAuth, (req, res) => {
  res.json({
    userId: req.session.userId,
    email: req.session.email
  });
});
```

### 2. Autenticação com JWT (Token)

```javascript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET;

// Login e geração de token
app.post('/login', async (req, res) => {
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

  // Gerar token
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ token });
});

// Middleware de verificação de token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.user = decoded;
    next();
  });
}

// Rota protegida
app.get('/profile', authenticateToken, (req, res) => {
  res.json({
    userId: req.user.userId,
    email: req.user.email
  });
});

// Refresh token
app.post('/refresh', authenticateToken, (req, res) => {
  const newToken = jwt.sign(
    { userId: req.user.userId, email: req.user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ token: newToken });
});
```

### 3. OAuth 2.0 (Login Social)

```javascript
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
  // Buscar ou criar usuário
  let user = await db.users.findOne({ googleId: profile.id });

  if (!user) {
    user = await db.users.create({
      googleId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName
    });
  }

  return done(null, user);
}));

// Rotas
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Gerar JWT ou criar sessão
    const token = jwt.sign({ userId: req.user.id }, JWT_SECRET);
    res.redirect(`/dashboard?token=${token}`);
  }
);
```

## Autorização

### 1. RBAC (Role-Based Access Control)

```javascript
// Definir roles
const ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user'
};

const PERMISSIONS = {
  admin: ['read', 'write', 'delete', 'manage_users'],
  moderator: ['read', 'write', 'delete'],
  user: ['read', 'write']
};

// Middleware de autorização
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
}

// Uso
app.delete('/users/:id',
  authenticateToken,
  authorize(ROLES.ADMIN),
  async (req, res) => {
    await db.users.delete(req.params.id);
    res.json({ message: 'User deleted' });
  }
);

app.post('/posts',
  authenticateToken,
  authorize(ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN),
  async (req, res) => {
    const post = await db.posts.create(req.body);
    res.json(post);
  }
);
```

### 2. Autorização Baseada em Recursos

```javascript
// Verificar propriedade do recurso
async function checkPostOwnership(req, res, next) {
  const post = await db.posts.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  if (post.authorId !== req.user.userId && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  req.post = post;
  next();
}

// Uso
app.put('/posts/:id',
  authenticateToken,
  checkPostOwnership,
  async (req, res) => {
    await req.post.update(req.body);
    res.json(req.post);
  }
);

app.delete('/posts/:id',
  authenticateToken,
  checkPostOwnership,
  async (req, res) => {
    await req.post.delete();
    res.json({ message: 'Post deleted' });
  }
);
```

### 3. ACL (Access Control List)

```javascript
class ACL {
  constructor() {
    this.permissions = new Map();
  }

  grant(userId, resource, action) {
    const key = `${userId}:${resource}`;
    if (!this.permissions.has(key)) {
      this.permissions.set(key, new Set());
    }
    this.permissions.get(key).add(action);
  }

  check(userId, resource, action) {
    const key = `${userId}:${resource}`;
    return this.permissions.get(key)?.has(action) || false;
  }
}

const acl = new ACL();

// Configurar permissões
acl.grant(1, 'post:123', 'read');
acl.grant(1, 'post:123', 'write');
acl.grant(2, 'post:123', 'read');

// Middleware
function checkPermission(resource, action) {
  return (req, res, next) => {
    if (!acl.check(req.user.userId, resource, action)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

// Uso
app.put('/posts/:id',
  authenticateToken,
  checkPermission('post:123', 'write'),
  updatePost
);
```

## Boas Práticas

###  Fazer

1. **Hash de senhas**
   ```javascript
   const hash = await bcrypt.hash(password, 10);
   ```

2. **Rate limiting**
   ```javascript
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 5
   });
   app.post('/login', limiter, loginHandler);
   ```

3. **Tokens com expiração**
   ```javascript
   jwt.sign(payload, secret, { expiresIn: '24h' });
   ```

4. **HTTPS obrigatório**
   ```javascript
   app.use((req, res, next) => {
     if (!req.secure) {
       return res.redirect('https://' + req.headers.host + req.url);
     }
     next();
   });
   ```

###  Evitar

1. **Senhas em texto plano**
2. **Tokens sem expiração**
3. **Mensagens de erro verbosas**
   ```javascript
   //  Ruim
   res.status(401).json({ error: 'User not found' });

   //  Bom
   res.status(401).json({ error: 'Invalid credentials' });
   ```

4. **Cookies sem flags de segurança**

## Exemplo Completo

```javascript
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import rateLimit from 'express-rate-limit';

const app = express();
app.use(express.json());

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5
});

// Registro
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await db.users.create({ email, password: hashedPassword, role: 'user' });
  res.status(201).json({ id: user.id, email: user.email });
});

// Login
app.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  const user = await db.users.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ token });
});

// Middleware
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

// Rotas
app.get('/profile', authenticateToken, (req, res) => {
  res.json(req.user);
});

app.delete('/users/:id', authenticateToken, authorize('admin'), async (req, res) => {
  await db.users.delete(req.params.id);
  res.json({ message: 'User deleted' });
});
```
